import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from './firebase';


/**
 * @param {{user_id: string, email: string, text: string, displayName: string, rol: string, price: number}} viaje
 * @returns {Promise}
 */
export function saveViajes({ user_id, email, text, displayName, rol, price }) {
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
 * @param {function} callback
 */
export function subscribeToViajes(callback) {
    const viajesRef = collection(db, 'viajes');
    const q = query(viajesRef, orderBy('created_at'));

    onSnapshot(q, snapshot => {
        const viajes = snapshot.docs.map(doc => ({
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
            type: doc.data().type, 
            description: doc.data().description,
            mapSnapshot: doc.data().mapSnapshot || null, 
        }));
        callback(viajes);
    });
}

/**
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
 * @param {string} viajeId
 * @param {function} callback
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
 * @param {{origin: string, destination: string, numSeats: number, price: number, user_id: string, mapSnapshot: string}} tripData
 * @returns {Promise}
 */
export async function saveTrip({ origin, destination, numSeats, price, user_id, mapSnapshot }) {
    const viajesRef = collection(db, 'viajes');

    try {
        const tripRef = await addDoc(viajesRef, {
            origin,
            destination,
            numSeats,
            price,
            user_id,
            mapSnapshot, 
            created_at: serverTimestamp(),
        });

        console.log('Viaje guardado exitosamente:', tripRef.id);
        return tripRef;

    } catch (error) {
        console.error('Error al guardar el viaje:', error);
        throw error;
    }
}



/**
 * @param {string} tripId 
 * @param {{date: string, time: string, type: {name: string, icon: string}, options: { name: string, icon: string }[], description: string}} additionalData
 * @returns {Promise}
 */
export function updateTrip(tripId, additionalData) {
    const tripRef = doc(db, 'viajes', tripId);
    return updateDoc(tripRef, {
        date: additionalData.date,
        time: additionalData.time,
        type: additionalData.type, 
        options: additionalData.options, 
        description: additionalData.description || 'Sin descripción' 
    });
}




/**
 * @param {function} callback 
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
          description: tripData.description || 'Sin descripción', 
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
 * @param {string} userId 
 * @returns {Promise<{ displayName: string, email: string, rol: string, photoURL: string } | null>}
 */
async function loadUserProfile(userId) {
    const userDoc = doc(db, 'users', userId);
    const docSnap = await getDoc(userDoc);

    if (docSnap.exists()) {
        const data = docSnap.data();
        return {
            displayName: data.displayName || 'Sin nombre',
            email: data.email || 'Usuario desconocido',
            rol: data.rol || 'Sin role',
            photoURL: data.photoURL || 'path/to/default-photo.jpg', 
        };
    } else {
        console.log('No existe tal usuario:', userId);
        return null;
    }
}



export async function updateTripSeats(tripId, numSeats) {
    if (!tripId) throw new Error("Trip ID is required");

    const tripRef = doc(db, "viajes", tripId); 

    const tripSnap = await getDoc(tripRef);
    if (!tripSnap.exists()) {
        throw new Error(`Document with ID ${tripId} does not exist`);
    }

    await updateDoc(tripRef, { numSeats });
    console.log(`Updated trip ${tripId} with ${numSeats} seats`);
}
