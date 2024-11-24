<template>
  <div class="mt-4 mb-40">
    <div class="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl" aria-hidden="true">
      <div class="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#239e61] to-[#1d7e4b] opacity-30" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
    </div>
    <div class="mx-auto max-w-4xl text-center">
      <h1 class="mt-4 text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-3xl">Crear viaje</h1>
    </div>
    
    <!-- Grid layout для карточек -->
    <div class="mx-auto mt-4 grid max-w-lg gap-8 sm:gap-10 lg:max-w-4xl lg:grid-cols-2">
      <div
        v-for="(tier, index) in tiers"
        :key="tier.id"
        @mouseover="hoveredIndex = index"
        @mouseleave="hoveredIndex = null"
        :class="[
          'bg-white/60 shadow-2xl p-8 rounded-3xl ring-1 ring-gray-900/10 sm:p-10 mb-8 mt-8 transition-transform duration-300 transform group',
          hoveredIndex !== null && hoveredIndex !== index ? 'scale-95 brightness-75' : 'scale-105 brightness-100'
        ]"
      >
        <div class="relative sm:mb-4 mt-4">
          <h2 :id="tier.id" class="text-green-700 text-base font-semibold">{{ tier.name }}</h2>
          <img :src="tier.image" alt="Описание изображения" class="mt-4 w-full h-auto rounded-md">
          
          <ul class="mt-8 space-y-3 text-sm text-green-700 sm:mt-10">
            <li v-for="feature in tier.features" :key="feature" class="flex gap-x-3">
              <CheckIcon class="h-6 w-5 flex-none text-green-700" aria-hidden="true"></CheckIcon>
              {{ feature }}
            </li>
          </ul>

          <router-link
            v-if="tier.featured"
            to="/categoria-viaje"
            aria-describedby="tier.id"
            class="mt-8 block rounded-md bg-custom-green-dark px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-400 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Crear viaje
          </router-link>

          <a
            v-else
            :href="tier.href"
            :aria-describedby="tier.id"
            class="mt-8 block rounded-md bg-custom-green-dark px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-400 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Crear solicitud de viaje
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { CheckIcon } from '@heroicons/vue/20/solid'

const hoveredIndex = ref(null) // индекс для отслеживания карточки под мышью

const tiers = [
  {
    name: 'Para pasajeros',
    id: 'tier-hobby',
    href: '#',
    image: '../public/12.jpg',
    features: [
      'Conductores verificados',
      'Creación de solicitudes para eventos',
      'Notificaciones de viajes disponibles',
      'Cancelación gratuita de reserva',
      'Viajes económicos y seguros',
    ],
    featured: false,
  },
  {
    name: 'Para conductores',
    id: 'tier-enterprise',
    href: '#',
    image: '../public/10.jpg',
    features: [
      'Pasajeros verificados',
      'Ahorro en combustible y peajes',
      'Creación de viajes a eventos',
      'Personalización del viaje',
      'Calculadora inteligente de costos de viaje',
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
