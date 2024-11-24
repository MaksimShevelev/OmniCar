<template>
    <div class="space-y-8 mb-40">
      <h2 class="text-2xl font-semibold text-gray-900 text-center">Mis Viajes</h2>
  
      <!-- Список поездок -->
      <div v-if="userTrips.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="trip in userTrips" :key="trip.id" class="border p-4 rounded-lg shadow">
            <p class="text-sm text-gray-600 mt-4">
            <strong>Publicado el:</strong> {{ formatDate(trip.created_at) || 'Fecha desconocida' }}
          </p>

          <h3 class="text-lg font-semibold text-gray-800"><strong class="text-gray-900 text-xl">De </strong> {{ trip.origin }}<strong class="text-gray-900 text-xl"> a </strong>  {{ trip.destination }}</h3>
  
          <p class="text-sm text-gray-600">
            <strong>Fecha del viaje:</strong> {{ trip.date || 'No especificada' }}
          </p>
          <p class="text-sm text-gray-600">
            <strong>Horario:</strong> {{ trip.time || 'No especificado' }}
          </p>
          <p class="text-sm text-gray-600">
            <strong>Precio:</strong> {{ trip.price }} $ ARS
          </p>
          <p class="text-sm text-gray-600">
            <strong>Asientos disponibles:</strong> {{ trip.numSeats || 'No especificado' }}
          </p>
          <p class="text-sm text-gray-600">
            <strong>Descripción:</strong> {{ trip.description || 'No especificada' }}
          </p>
  
          <!-- Mostrar opciones -->
          <div v-if="trip.options && trip.options.length" class="mt-4">
            <h4 class="text-sm font-semibold text-gray-800">Opciones:</h4>
            <ul class="list-disc pl-5">
              <li v-for="option in trip.options" :key="option.name" class="text-sm text-gray-600 flex items-center gap-2">
                <span v-html="option.icon" class="inline-block"></span>
                <span>{{ option.name }}</span>
              </li>
            </ul>
          </div>
  
          <!-- Mostrar фото -->
          <div v-if="trip.mapSnapshot" class="mt-4">
            <h4 class="text-sm font-semibold text-gray-800">Mapa de la ruta:</h4>
            <img :src="trip.mapSnapshot" alt="Mapa del viaje" class="w-full h-auto rounded-lg mt-2" />
          </div>
  

        </div>
      </div>
  
      <!-- Пустой список -->
      <p v-else class="text-center text-gray-600">No tienes viajes publicados aún.</p>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, onUnmounted } from 'vue';
  import { subscribeToTrips } from '../services/viajes';
  import { subscribeToAuthState } from '../services/auth';
  
  export default {
    name: 'MisViajes',
    setup() {
      const userTrips = ref([]);
      const userId = ref(null);
  
      const fetchUserTrips = () => {
        subscribeToTrips((trips) => {
          // Фильтруем поездки по текущему пользователю
          userTrips.value = trips.filter((trip) => trip.user_id === userId.value);
        });
      };
  
      const fetchUserId = () => {
        subscribeToAuthState((userData) => {
          userId.value = userData.id;
          fetchUserTrips(); // Обновляем список поездок после получения userId
        });
      };
  
      const formatDate = (timestamp) => {
        if (!timestamp) return 'No especificada';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' });
      };
  
      onMounted(() => {
        fetchUserId();
      });
  
      onUnmounted(() => {
        userTrips.value = [];
      });
  
      return {
        userTrips,
        formatDate,
      };
    },
  };
  </script>
  
  <style scoped>
  /* Добавьте стили при необходимости */
  </style>
  
