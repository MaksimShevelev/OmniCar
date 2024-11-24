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
 * Генерирует уникальный ключ для кэширования чатов.
 * @param {string} senderId 
 * @param {string} receiverId 
 * @returns {string}
 */
function getCacheKey(senderId, receiverId) {
    return [senderId, receiverId].sort().join('_');
}

/**
 * Добавляет чат в кэш.
 * @param {string} key 
 * @param {any} value 
 */
function cacheAdd(key, value) {
    chatsCache[key] = value;
}

/**
 * Получает документ чата между двумя пользователями.
 * @param {string} senderId 
 * @param {string} receiverId 
 * @returns {Promise<DocumentReference>}
 */
async function getPrivateChatDocument(senderId, receiverId) {
    if (!senderId || !receiverId) {
        console.error("getPrivateChatDocument: неверные данные");
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
 * Сохраняет сообщение в приватном чате.
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
 * Подписка на сообщения в приватном чате.
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
 * Получает список приватных чатов текущего пользователя с временем последнего сообщения.
 * @param {string} userId - ID текущего пользователя.
 * @returns {Promise<Array<{ chatId: string, otherUserId: string, lastMessage: string, lastMessageTime: Date | null }>>}
 */
export async function getUserPrivateChats(userId) {
    if (!userId) {
        console.error("getUserPrivateChats: отсутствует ID пользователя");
        return [];
    }

    const privateChatsRef = collection(db, "private-chats");
    const q = query(privateChatsRef, where(`users.${userId}`, "==", true));

    const snapshot = await getDocs(q);

    // Обрабатываем каждый чат
    const chats = await Promise.all(
        snapshot.docs.map(async doc => {
            const users = Object.keys(doc.data().users);
            const otherUserId = users.find(id => id !== userId);

            // Получаем сообщения из этого чата
            const messagesRef = collection(db, `private-chats/${doc.id}/messages`);
            const messagesQuery = query(messagesRef, orderBy('created_at', 'desc'), limit(1));
            const messagesSnapshot = await getDocs(messagesQuery);

            let lastMessage = 'Нет сообщений';
            let lastMessageTime = null;

            if (!messagesSnapshot.empty) {
                const lastMessageDoc = messagesSnapshot.docs[0];
                lastMessage = lastMessageDoc.data().text || 'Нет текста';
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
 * Получает профили пользователей по их ID.
 * @param {Array<string>} userIds - массив ID пользователей.
 * @returns {Promise<Array<{ id: string, email: string, displayName: string }>>}
 */
export async function getUsersProfiles(userIds) {
    const profiles = await Promise.all(
        userIds.map(id => id ? getUserProfileById(id) : null)
    );
    return profiles.filter(profile => profile);
}
