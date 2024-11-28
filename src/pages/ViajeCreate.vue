<template>
    <BaseHeading1 class="flex flex-col justify-center items-center text-3xl text-center mt-40">Crear viaje</BaseHeading1>
    <div class="flex flex-col justify-center items-center text-center mt-8 mb-40">
    </div>
    <div class="my-4 p-4 border rounded flex">
        
    <section class="w-1/2 p-2">
        <h2 class="text-xl mb-4">Descripción de viaje</h2>
        <form @submit.prevent="handleSubmit">
            <div class="mb-4">
                <label for="text" class="block mb-2">Publicar propuesta o solicitud de viaje</label>
                <textarea id="text" class="w-full min-h-8 p-2 border rounded" v-model="newViaje.text"></textarea>
            </div>
            <div class="mb-4">
                <label for="price" class="block mb-2">Precio del viaje</label>
                <input type="number" id="price" class="w-full p-2 border rounded" v-model="newViaje.price" placeholder="Precio" />
            </div>
            <button type="submit" class="transition-all py-2 px-4 rounded bg-green-700 text-white focus:bg-green-500 hover:bg-green-500 active:bg-green-900">
                Publicar
            </button>
        </form>
    </section>
    </div>
    <div id="map" class="h-96 mt-4"></div>
</template>

<script>
import BaseHeading1 from '../components/BaseHeading1.vue';
import { subscribeToAuthState } from '../services/auth.js';
import { saveViajes, subscribeToViajes, saveComment, subscribeToComments } from '../services/viajes.js';

let unsubscribeAuth = () => { };


export default {
    name: 'Viajes',
    components: { BaseHeading1 },
    data() {
        return {
            viajes: [],
            newViaje: {
                text: '',
            },
            comments: {},
            newComment: {},
            loggedUser: {
                id: null,
                email: null,
                displayName: null,
                rol: null,
            },

        };
    },
    methods: {
        handleSubmit() {
            saveViajes({
                user_id: this.loggedUser.id,
                email: this.loggedUser.email,
                text: this.newViaje.text,
                displayName: this.loggedUser.displayName,
                rol: this.loggedUser.rol,
            });
            this.newViaje.text = '';
        },
        async handleCommentSubmit(viajeId) {
            if (!this.newComment[viajeId]?.trim()) {
                console.error("El texto del comentario está vacío");
                return;
            }

            await saveComment({
                viajeId: viajeId,
                user_id: this.loggedUser.id,
                text: this.newComment[viajeId],
                displayName: this.loggedUser.displayName || 'Anónimo',
                rol: this.loggedUser.rol,
            });

            this.newComment[viajeId] = '';
            this.fetchComments(viajeId);
        },
        fetchComments(viajeId) {
            subscribeToComments(viajeId, (comments) => {
                if (!this.comments[viajeId]) {
                    this.comments[viajeId] = [];
                }
                this.comments[viajeId] = comments;
            });
        },
        

    }
    
    
}
</script>

<style>
.suggestions-list {
    border: 1px solid #ccc;
    background-color: white;
    position: absolute;
    z-index: 1000;
    width: calc(100% - 16px);
}

.suggestion-item {
    padding: 8px;
    cursor: pointer;
}

.suggestion-item:hover {
    background-color: #f0f0f0;
}
</style>
