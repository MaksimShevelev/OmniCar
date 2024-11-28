import { db } from "./firebase"; 
import { 
    collection, 
    query, 
    where, 
    getDocs, 
    addDoc, 
    serverTimestamp, 
    orderBy, 
    limit, 
    onSnapshot 
} from "firebase/firestore";
import { getUserProfileById } from "./user-profile";

const chatsCache = {};

/**
 * 
 * @param {string} senderId 
 * @param {string} receiverId 
 * @returns {string}
 */
function getCacheKey(senderId, receiverId) {
    return [senderId, receiverId].sort().join('_');
}

/**
 * 
 * @param {string} key 
 * @param {any} value 
 */
function cacheAdd(key, value) {
    chatsCache[key] = value;
}

/**
 * 
 * @param {string} senderId 
 * @param {string} receiverId 
 * @returns {Promise<DocumentReference>}
 */
async function getPrivateChatDocument(senderId, receiverId) {
    if (!senderId || !receiverId) {
        console.error("getPrivateChatDocument: No especificado");
        return null;
    }

    const cacheKey = getCacheKey(senderId, receiverId);
    const cacheDoc = chatsCache[cacheKey];

    if (cacheDoc) return cacheDoc;

    const privateChatRef = collection(db, `private-chats`);
    const privateChatQuery = query(privateChatRef, where('users', '==', {
        [senderId]: true,
        [receiverId]: true,
    }));

    const privateChatsSnapshot = await getDocs(privateChatQuery);
    let chatDocument;

    if (privateChatsSnapshot.empty) {
        chatDocument = await addDoc(privateChatRef, {
            users: {
                [senderId]: true,
                [receiverId]: true,
            },
        });
    } else {
        chatDocument = privateChatsSnapshot.docs[0];
    }

    cacheAdd(cacheKey, chatDocument);
    return chatDocument;
}

/**
 * 
 * @param {string} senderId 
 * @param {string} receiverId 
 * @param {string} text 
 */
export async function savePrivateChatMessage(senderId, receiverId, text) {
    const privateChatDoc = await getPrivateChatDocument(senderId, receiverId);
    if (!privateChatDoc) return;

    const messagesRef = collection(db, `private-chats/${privateChatDoc.id}/messages`);
    await addDoc(messagesRef, {
        user_id: senderId,
        text,
        created_at: serverTimestamp(),
    });
}

/**
 * 
 * @param {string} senderId 
 * @param {string} receiverId 
 * @param {Function} callback 
 * @returns {Promise<import("firebase/firestore").Unsubscribe>}
 */
export async function subscribeToPrivateChatMessages(senderId, receiverId, callback) {
    const privateChatDoc = await getPrivateChatDocument(senderId, receiverId);
    if (!privateChatDoc) return;

    const messagesRef = collection(db, `private-chats/${privateChatDoc.id}/messages`);
    const messagesQuery = query(messagesRef, orderBy('created_at'));

    return onSnapshot(messagesQuery, snapshot => {
        const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            user_id: doc.data().user_id,
            text: doc.data().text,
            created_at: doc.data().created_at?.toDate(),
        }));

        callback(messages);
    });
}

/**
 * 
 * @param {string} userId 
 * @returns {Promise<Array<{ chatId: string, otherUserId: string, lastMessage: string, lastMessageTime: Date | null }>>}
 */
export async function getUserPrivateChats(userId) {
    if (!userId) {
        console.error("getUserPrivateChats: ID de usuario faltante");
        return [];
    }

    const privateChatsRef = collection(db, "private-chats");
    const q = query(privateChatsRef, where(`users.${userId}`, "==", true));

    const snapshot = await getDocs(q);

    
    const chats = await Promise.all(
        snapshot.docs.map(async doc => {
            const users = Object.keys(doc.data().users);
            const otherUserId = users.find(id => id !== userId);

            const messagesRef = collection(db, `private-chats/${doc.id}/messages`);
            const messagesQuery = query(messagesRef, orderBy('created_at', 'desc'), limit(1));
            const messagesSnapshot = await getDocs(messagesQuery);

            let lastMessage = 'Sin mensajes';
            let lastMessageTime = null;

            if (!messagesSnapshot.empty) {
                const lastMessageDoc = messagesSnapshot.docs[0];
                lastMessage = lastMessageDoc.data().text || 'Sin texto';
                lastMessageTime = lastMessageDoc.data().created_at?.toDate() || null;
            }

            return { 
                chatId: doc.id, 
                otherUserId,
                lastMessage,
                lastMessageTime,
            };
        })
    );

    return chats;
}

/**
 * 
 * @param {Array<string>} userIds 
 * @returns {Promise<Array<{ id: string, email: string, displayName: string }>>}
 */
export async function getUsersProfiles(userIds) {
    const profiles = await Promise.all(
        userIds.map(id => id ? getUserProfileById(id) : null)
    );
    return profiles.filter(profile => profile);
}
