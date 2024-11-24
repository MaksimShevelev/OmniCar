<template>
    <div 
        class="flex flex-col items-center justify-center min-h-screen p-2 mb-10"
    >
    <div class="absolute inset-0 -z-10 transform-gpu blur-3xl opacity-20" aria-hidden="true">
            <div class="aspect-[1097/845] w-full h-full bg-gradient-to-tr from-[#239e61] to-[#1d7e4b]"
                style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
            ></div>
        </div>
        <BaseLoader v-if="loadingUser" />
        <BaseHeading1 
            v-else 
            class="text-center text-2xl text-gray-900"
        >
            Chat con {{ user.displayName }}
        </BaseHeading1>

        <!-- Chat Container -->
        <div 
            class="text-center w-full max-w-lg min-h-[400px] p-4 mb-4 border rounded bg-white"
            v-if="!loadingUser"
        >
        <ul class="flex flex-col gap-4">
            <li
                v-for="message in messages"
                :key="message.id"
                :class="{
                    'self-end bg-green-300 text-right': message.user_id === loggedUser.id,
                    'self-start bg-gray-300 text-left': message.user_id !== loggedUser.id,
                }"
                class="p-4 rounded-lg relative max-w-[75%] z-10"
            >
                <!-- Сообщение -->
                <div class="ml-1 mr-1 mb-1 text-sm z-20">{{ message.text }}</div>
                <!-- Дата и время -->
                <div 
                    class="text-xs text-gray-600 absolute bottom-1 right-2 z-10" 
                    v-if="message.user_id === loggedUser.id"
                >
                    {{ formatDate(message.created_at) || 'Enviando...' }}
                </div>
                <div 
                    class="text-xs text-gray-600 absolute bottom-1 left-2 z-10"
                    v-else
                >
                    {{ formatDate(message.created_at) || 'Enviando...' }}
                </div>

                <!-- Уголки диалога -->
                <div
                    :class="{
                        'absolute bottom-0 -right-3 border-t-[30px] border-l-[30px] border-l-green-300 border-t-transparent': message.user_id === loggedUser.id,
                        'absolute bottom-0 -left-3 border-t-[30px] border-r-[30px] border-r-gray-300 border-t-transparent': message.user_id !== loggedUser.id,
                    }"
                    class="w-0 h-0 z-1"
                ></div>
            </li>
        </ul>



        </div>
        
        <!-- Message Input Form -->
    <div  class="text-center w-full max-w-lg">
        <form 
            action="#" 
            class="flex flex-col items-start gap-4" 
            @submit.prevent="handleSubmit"
        >
            <label for="text" class="sr-only">Mensaje</label>
            <textarea
                id="text"
                class="w-full min-h-[70px] p-2 border rounded resize-none"
                v-model="newMessage.text"
                placeholder="Escribe tu mensaje..."
            ></textarea>
        
        <button 
                type="submit"
                class="rounded-md w-full mt-4 mb-10 bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-400 hover:text-gray-900"
            >
                Enviar
            </button>
        </form>
        </div>
    </div>
</template>


<script>

import BaseHeading1 from '../components/BaseHeading1.vue';
import BaseLoader from '../components/BaseLoader.vue';
import { subscribeToAuthState } from '../services/auth';
import { getUserProfileById } from '../services/user-profile';
import { savePrivateChatMessage, subscribeToPrivateChatMessages } from '../services/private-chat';

let unsubscribeAuth = () => {};
let unsubscribeChat = () => {};

export default {
    name: 'PrivateChat',
    components: { BaseHeading1, BaseLoader },
    data() {
        return {
            loggedUser: {
                id: null,
                email: null,
                displayName: null,
                photoURL: null,
                bio: null,
                career: null,
            },
            loadingUser: false,
            user: {
                id: null,
                email: null,
                displayName: null,
                photoURL: null,
                bio: null,
            },
            loadingMessages: false,
            messages: [],
            newMessage: {
                text: '',
            }
        };
    },
    methods: {
        async handleSubmit() {
            try {
                await savePrivateChatMessage(
                    this.loggedUser.id,
                    this.$route.params.id,
                    this.newMessage.text,
                );
                this.newMessage.text = '';
            } catch (error) {
                // TODO: обработка ошибок
            }
        },
        formatDate(date) {
            if (!date) return null;

            const formatter = new Intl.DateTimeFormat('es-AR', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit', hour12: false
            });
            return formatter.format(date).replace(',', '');
        }
    },
    async mounted() {
        unsubscribeAuth = subscribeToAuthState(newUserData => this.loggedUser = newUserData);
        this.loadingUser = true;

        try {
            const userProfile = await getUserProfileById(this.$route.params.id);
            this.loadingUser = false;
            this.user = userProfile;
        } catch (error) {
            this.loadingUser = false;
            // TODO: обработка ошибок
        }
        
        this.loadingMessages = true;
        unsubscribeChat = await subscribeToPrivateChatMessages(
            this.loggedUser.id,
            this.$route.params.id,
            newMessages => {
                this.loadingMessages = false;
                this.messages = newMessages;
            }
        );
    },
    unmounted() {
        unsubscribeAuth();
        unsubscribeChat();
    }
}
</script>


