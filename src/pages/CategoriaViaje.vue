<template>
  <div class="mt-4 mb-40">
    <div class="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl" aria-hidden="true">
      <div class="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#239e61] to-[#1d7e4b] opacity-30" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
    </div>
    <div class="mx-auto max-w-4xl text-center">
      <h1 class="mt-2 text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-3xl">Categoría del viaje</h1>
    </div>

    <!-- Grid layout для карточек -->
    <div class="mx-auto mt-4 grid max-w-lg gap-8 sm:gap-10 lg:max-w-4xl lg:grid-cols-2">
      <div
        v-for="(tier, index) in tiers"
        :key="tier.id"
        @mouseover="hoveredIndex = index"
        @mouseleave="hoveredIndex = null"
        :class="[
          'relative p-8 shadow-2xl ring-1 ring-gray-900/10 sm:p-10 rounded-3xl bg-white text-gray-900 transition-all duration-300 transform',
          hoveredIndex !== null && hoveredIndex !== index ? 'brightness-75 scale-95' : 'brightness-100 scale-105'
        ]"
      >
        <h2 :id="tier.id" class="text-green-700 font-semibold">{{ tier.name }}</h2>

        <!-- Изображение карточки -->
        <img :src="tier.image" alt="Описание изображения" class="mt-4 w-full h-auto rounded-md">

        <ul role="list" class="mt-8 space-y-3 text-sm sm:mt-10">
          <li v-for="feature in tier.features" :key="feature" class="flex gap-x-3">
            {{ feature }}
          </li>
        </ul>

        <router-link
          to="/construir-ruta"
          aria-describedby="tier.id"
          class="mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold shadow-sm bg-custom-green text-white hover:brightness-90"
        >
          {{ tier.featured ? 'Crear viaje' : 'Crear viaje' }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const hoveredIndex = ref(null) // индекс для отслеживания выбранной карточки

const tiers = [
  {
    name: 'Viaje común',
    id: 'tier-hobby',
    image: 'https://firebasestorage.googleapis.com/v0/b/omnicar-80e07.firebasestorage.app/o/100.jpg?alt=media&token=bcd20697-553d-44dd-8060-51318705c40f',
    features: [
      'Encuentra pasajeros para tu viaje. Publica tu trayecto indicando el punto de la partida y el destino de tu ruta para compartir los gastos y hacer el trayecto más ameno.',
    ],
    featured: false,
  },
  {
    name: 'Viaje a un evento',
    id: 'tier-enterprise',
    image: 'https://firebasestorage.googleapis.com/v0/b/omnicar-80e07.firebasestorage.app/o/evento.jpg?alt=media&token=41022a30-bde4-41d4-af51-380505331dd4',
    features: [
      'Dirígete a un evento y comparte la experiencia desde el camino. Publica tu viaje y encuentra compañeros que también asistirán al mismo concierto, partido u otra actividad, compartiendo los gastos y la diversión.',
    ],
    featured: true,
  },
]
</script>

<style scoped>
.grid {
  gap: 2rem;
}

@media (min-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 5rem;
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
