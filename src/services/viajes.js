import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from './firebase';


/**
 * Сохраняет сообщение чата.
 * @param {{user_id: string, email: string, text: string, displayName: string, rol: string, price: number}} message
 * @returns {Promise}
 */
export function saveChatMessage({ user_id, email, text, displayName, rol, price }) {
    const viajesRef = collection(db, 'viajes');

    return addDoc(viajesRef, {
        user_id,
        email,
        text,
        displayName,
        rol,
        price,
        created_at: serverTimestamp(),
    });
}

/**
 * Подписка на сообщения чата.
 * @param {function} callback
 */
export function subscribeToChatMessages(callback) {
    const viajesRef = collection(db, 'viajes');
    const q = query(viajesRef, orderBy('created_at'));

    onSnapshot(q, snapshot => {
        const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            user_id: doc.data().user_id,
            email: doc.data().email,
            text: doc.data().text,
            displayName: doc.data().displayName,
            rol: doc.data().rol,
            price: doc.data().price,
            created_at: doc.data().created_at,
            date: doc.data().date,
            destination: doc.data().destination,
            numSeats: doc.data().numSeats,
            options: doc.data().options,
            origin: doc.data().origin,
            time: doc.data().time,
            type: doc.data().type, // тип с иконкой
            description: doc.data().description,
            mapSnapshot: doc.data().mapSnapshot || null, // Ensure mapSnapshot is included
        }));
        callback(messages);
    });
}

/**
 * Сохраняет комментарий к поездке.
 * @param {{viajeId: string, user_id: string, text: string, displayName: string, rol: string}} commentData
 * @returns {Promise}
 */
export function saveComment({ viajeId, user_id, text, displayName, rol }) {
    const commentsRef = collection(db, 'comments'); 
    return addDoc(commentsRef, {
        viajeId,
        user_id,
        text,
        displayName,
        rol,
        created_at: serverTimestamp(),
    });
}

/**
 * Подписка на комментарии к поездке.
 * @param {string} viajeId - ID поездки
 * @param {function} callback - функция обратного вызова для получения комментариев
 */
export function subscribeToComments(viajeId, callback) {
    const commentsRef = collection(db, 'comments');
    const q = query(commentsRef, orderBy('created_at'));

    onSnapshot(q, snapshot => {
        const comments = snapshot.docs
            .map(doc => ({
                id: doc.id,
                viajeId: doc.data().viajeId,
                text: doc.data().text,
                displayName: doc.data().displayName,
                rol: doc.data().rol,
            }))
            .filter(comment => comment.viajeId === viajeId);

        callback(comments);
    });
}

/**
 * Сохраняет поездку в базе данных.
 * @param {{origin: string, destination: string, numSeats: number, price: number, user_id: string, mapSnapshot: string}} tripData
 * @returns {Promise}
 */
export async function saveTrip({ origin, destination, numSeats, price, user_id, mapSnapshot }) {
    const viajesRef = collection(db, 'viajes');

    try {
        // Сохранение поездки в Firestore
        const tripRef = await addDoc(viajesRef, {
            origin,
            destination,
            numSeats,
            price,
            user_id,
            mapSnapshot, // Ссылка на карту передаётся из компонента
            created_at: serverTimestamp(),
        });

        console.log('Поездка успешно сохранена:', tripRef.id);
        return tripRef;

    } catch (error) {
        console.error('Ошибка при сохранении поездки:', error);
        throw error;
    }
}



/**
 * Обновляет поездку дополнительными данными.
 * @param {string} tripId - ID поездки для обновления
 * @param {{date: string, time: string, type: {name: string, icon: string}, options: { name: string, icon: string }[], description: string}} additionalData
 * @returns {Promise}
 */
export function updateTrip(tripId, additionalData) {
    const tripRef = doc(db, 'viajes', tripId);
    return updateDoc(tripRef, {
        date: additionalData.date,
        time: additionalData.time,
        type: additionalData.type, // включает icon и name
        options: additionalData.options, // массив объектов с полями name и icon
        description: additionalData.description || 'Описание отсутствует' // добавляем описание или значение по умолчанию
    });
}




/**
 * Подписка на обновления поездок с загрузкой данных профиля пользователя.
 * @param {function} callback - функция обратного вызова для получения списка поездок
 */
export function subscribeToTrips(callback) {
    const viajesRef = collection(db, 'viajes');
    const q = query(viajesRef, orderBy('created_at'));
  
    onSnapshot(q, async (snapshot) => {
      const trips = await Promise.all(snapshot.docs.map(async (doc) => {
        const tripData = doc.data();
        const userProfile = await loadUserProfile(tripData.user_id);
  
        return {
          id: doc.id,
          origin: tripData.origin,
          destination: tripData.destination,
          numSeats: tripData.numSeats,
          price: tripData.price,
          user_id: tripData.user_id,
          date: tripData.date || null,
          time: tripData.time || null,
          type: tripData.type || null,
          options: tripData.options || [],
          description: tripData.description || 'Описание отсутствует', // включено описание
          created_at: tripData.created_at,
          mapSnapshot: tripData.mapSnapshot || null,
          displayName: userProfile?.displayName,
          email: userProfile?.email,
          rol: userProfile?.rol,
          photoURL: userProfile?.photoURL,
        };
      }));
  
      callback(trips);
    });
  }
  
  



/**
 * Загружает профиль пользователя по его user_id.
 * @param {string} userId - ID пользователя
 * @returns {Promise<{ displayName: string, email: string, rol: string, photoURL: string } | null>}
 */
async function loadUserProfile(userId) {
    const userDoc = doc(db, 'users', userId);
    const docSnap = await getDoc(userDoc);

    if (docSnap.exists()) {
        const data = docSnap.data();
        return {
            displayName: data.displayName || 'Имя отсутствует',
            email: data.email || 'Неизвестный пользователь',
            rol: data.rol || 'без роли',
            photoURL: data.photoURL || 'path/to/default-photo.jpg', // или URL фото по умолчанию
        };
    } else {
        console.log('Нет такого пользователя:', userId);
        return null;
    }
}


/**
 * Загружает профиль пользователя по его user_id.
 */

export async function updateTripSeats(tripId, numSeats) {
    if (!tripId) throw new Error("Trip ID is required");

    const tripRef = doc(db, "viajes", tripId); // Изменено с "trips" на "viajes"

    // Проверяем, существует ли документ
    const tripSnap = await getDoc(tripRef);
    if (!tripSnap.exists()) {
        throw new Error(`Document with ID ${tripId} does not exist`);
    }

    // Обновляем поле numSeats
    await updateDoc(tripRef, { numSeats });
    console.log(`Updated trip ${tripId} with ${numSeats} seats`);
}
