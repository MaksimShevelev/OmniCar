<template>
  <div class="absolute inset-0 -z-10 transform-gpu blur-3xl opacity-20" aria-hidden="true">
      <div class="aspect-[1097/845] w-full h-full bg-gradient-to-tr from-[#239e61] to-[#1d7e4b]"
          style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)">
      </div>
  </div>
  <div class="chat-list">
      <BaseHeading1 class="flex flex-col rounded-x justify-center text-3xl items-center text-center mt-4 mb-4">Chats
      </BaseHeading1>

      <ul v-if="chats.length">
  <li
    v-for="chat in chats"
    :key="chat.chatId"
    class="mb-4 flex flex-col md:flex-row items-center gap-4 border p-4 rounded-lg shadow-md"
  >
    <!-- Foto del usuario -->
    <img
      :src="chat.otherUser?.photoURL || 'path/to/default-avatar.jpg'"
      alt="Avatar"
      class="w-16 h-16 rounded-full border-2 border-gray-300 object-cover"
    />

    <!-- Información del chat -->
    <div class="flex flex-col flex-grow text-center md:text-left">
      <p class="text-lg font-semibold">{{ chat.otherUser?.displayName || 'Nombre no disponible' }}</p>
      <p class="text-gray-600 text-sm">
        Último mensaje: {{ chat.lastMessageTime ? timeAgo(chat.lastMessageTime) : 'No hay mensajes' }}
      </p>
    </div>

    <!-- Enlace al chat -->
    <div class="w-full flex justify-center mt-4 md:mt-0 md:justify-end">
      <router-link
        :to="`/usuario/${chat.otherUserId}/chat`"
        class="bg-green-600 px-4 py-2 text-white rounded-lg text-center"
      >
        Ir al chat
      </router-link>
    </div>
  </li>
</ul>



      <p v-else class="text-gray-600 text-center mt-4">Todavía no hay chats</p>
  </div>
</template>

<script>
import { getUserPrivateChats, getUsersProfiles } from '../services/private-chat';
import { subscribeToAuthState } from '../services/auth';

export default {
  name: 'ChatList',
  data() {
    return {
      loggedUserId: null,
      chats: [],
    };
  },
  async mounted() {
    subscribeToAuthState(user => {
      if (user && user.id) {
        this.loggedUserId = user.id;
        this.loadChats();
      }
    });
  },
  methods: {
    async loadChats() {
      if (!this.loggedUserId) return;

      try {
        const userChats = await getUserPrivateChats(this.loggedUserId);
        const userIds = userChats.map(chat => chat.otherUserId);
        const profiles = await getUsersProfiles(userIds);

        this.chats = userChats.map(chat => {
          const otherUser = profiles.find(profile => profile?.id === chat.otherUserId);
          return {
            chatId: chat.chatId,
            otherUserId: chat.otherUserId,
            otherUser: otherUser || null,
            lastMessageTime: chat.lastMessageTime || null,
          };
        });
      } catch (error) {
        console.error("Error cargando los chats:", error);
      }
    },
    /**
     * Formatea el tiempo en texto "hace N minutos/horas/días".
     * @param {Date} date
     * @returns {string}
     */
    timeAgo(date) {
      const now = new Date();
      const diffMs = now - new Date(date); // Diferencia en milisegundos
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMinutes < 1) {
        return "Justo ahora";
      } else if (diffMinutes < 60) {
        return `hace ${diffMinutes} minutos`;
      } else if (diffHours < 24) {
        return `hace ${diffHours} horas`;
      } else {
        return `hace ${diffDays} días`;
      }
    }
  }
};
</script>

<style scoped>
.chat-list {
  max-width: 800px;
  margin: auto;
  padding: 16px;
}

.chat-list ul {
  list-style: none;
  padding: 0;
}

.chat-list li {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #fff;
}

.chat-list img {
  border-radius: 50%;
}

.chat-list p {
  margin: 0;
}

.chat-list a {
  text-decoration: none;
  background-color: #34a853;
  padding: 0.5em 1em;
  color: white;
  border-radius: 8px;
}

.chat-list a:hover {
  background-color: #2b8c45;
}
</style>
