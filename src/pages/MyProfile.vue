<template>
  <div class="space-y-12 mb-40 ">
    <!-- Заголовок и ссылки для редактирования -->
    <div class="flex items-end gap-4 mt-4">
      <BaseHeading1 class="text-center text-3xl text-gray-900">Mi perfil</BaseHeading1>
      <router-link to="/mi-perfil/editar" class="mb-6 text-gray-900 underline focus:text-green-700 hover:text-green-700  active:text-green-700 ">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
          <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
        </svg>
      </router-link>
      <router-link to="/mi-perfil/editar/foto" class="mb-6 text-gray-900 underline focus:text-green-700  hover:text-green-700  active:text-green-700 ">
        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="currentColor" class="bi bi-person-bounding-box" viewBox="0 0 16 16">
          <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5M.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5" />
          <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
        </svg>
      </router-link>
    </div>

    <!-- Информация профиля и автомобиля -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Информация о пользователе -->
      <section>
        <h2 class="inline-block bg-gray-100 text-xl p-2 border rounded-xl shadow text-gray-700 font-semibold">Información sobre ti</h2>
        <div class="mt-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-900"><strong class="text-gray-900 text-xl">Foto</strong></label>
            <div class="mt-2 flex justify-start">
              <ProfileData :user="loggedUser" class="self-start" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-900"><strong class="text-gray-900 text-xl">Nombre</strong></label>
            <p class="text-gray-700">{{ loggedUser.displayName || 'Sin especificar' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-900"><strong class="text-gray-900 text-xl">Tipo de usuario</strong></label>
            <p class="text-gray-700">{{ loggedUser.rol || 'Sin especificar' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-900">Sobre mí</label>
            <p class="text-gray-700">{{ loggedUser.bio || 'Sin especificar' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-900">Email</label>
            <p class="text-gray-700">{{ loggedUser.email || 'Sin especificar' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-900">Número de teléfono</label>
            <p class="text-gray-700">{{ loggedUser.telefono || 'Sin especificar' }}</p>
          </div>
          <div>
            <h3>Documentos</h3>
            <label for="photo" class="block text-sm/6 font-medium text-gray-900">Foto de DNI</label>
            <div class="mt-2 flex items-center gap-x-3">
              <UserCircleIcon class="h-12 w-12 text-gray-300" aria-hidden="true" />
            </div>
            <label for="photo" class="block text-sm/6 font-medium text-gray-900">Foto de licencia</label>
            <div class="mt-2 flex items-center gap-x-3">
              <UserCircleIcon class="h-12 w-12 text-gray-300" aria-hidden="true" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-900">Métodos de pago</label>
            <p class="text-gray-700">{{ loggedUser.postalCode || 'Sin especificar' }}</p>
          </div>
        </div>
      </section>

      <!-- Информация об автомобиле -->
      <section>
        <h2 class="inline-block bg-gray-100 text-xl p-2 border rounded-xl shadow text-gray-700 font-semibold">Información sobre tu auto</h2>
        <div class="mt-6 space-y-4">
          <div>
            <label for="photo" class="block text-sm font-medium text-gray-900">Foto</label>
            <div class="mt-2 flex items-center gap-x-3">
              <UserCircleIcon class="h-12 w-12 text-gray-300" aria-hidden="true" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-900">Marca</label>
            <p class="text-gray-700">{{ loggedUser.firstName || 'Sin especificar' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-900">Modelo</label>
            <p class="text-gray-700">{{ loggedUser.lastName || 'Sin especificar' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-900">Año</label>
            <p class="text-gray-700">{{ loggedUser.country || 'Sin especificar' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-900">Color</label>
            <p class="text-gray-700">{{ loggedUser.streetAddress || 'Sin especificar' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-900">Tipo de combustible</label>
            <p class="text-gray-700">{{ loggedUser.city || 'Sin especificar' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-900">Consumo promedio</label>
            <p class="text-gray-700">{{ loggedUser.region || 'Sin especificar' }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import BaseHeading1 from '../components/BaseHeading1.vue';
  import ProfileData from '../components/profile/ProfileData.vue';
  import { subscribeToAuthState } from '../services/auth';
  import { getUserPublications } from '../services/publications';
  
  const loggedUser = ref({
    id: null,
    email: null,
    displayName: 'Guest',
    rol: null,
    bio: null,
    photoURL: null,
    firstName: '',
    lastName: '',
    country: '',
    streetAddress: '',
    city: '',
    region: '',
    postalCode: ''
  });
  
  const publications = ref([]);
  
  let unsubscribeAuth = () => {};
  
  onMounted(() => {
    unsubscribeAuth = subscribeToAuthState(async (newUserData) => {
      loggedUser.value = newUserData;
  
      if (loggedUser.value.id) {
        try {
          publications.value = await getUserPublications(loggedUser.value.id);
        } catch (error) {
          console.error("Error al cargar publicaciones:", error);
        }
      }
    });
  });
  
  onUnmounted(() => {
    unsubscribeAuth();
  });
  </script>
  
  
