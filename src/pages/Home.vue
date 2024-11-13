<template>
    <div class="bg-white">
        <div class="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
            <div
                class="relative isolate overflow-hidden bg-gray-100 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0 flex flex-col lg:flex-row">
                <div class="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-24 lg:text-left">
                    <h1 class="text-balance text-6xl font-semibold tracking-tight text-green-700">
                        ¡Bienvenido a bordo de OmniCar!</h1>
                    <p class="mt-6 text-pretty text-lg/8 text-black sm:text-2xl">Comienza tu viaje con nosotros</p>
                    <div class="mt-10 flex items-center justify-center gap-x-6 lg:justify-start flex-wrap">
                        <router-link to="/viajes"
                            class="rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-400 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                            <span class="pt-2">Ver viajes</span>
                        </router-link>
                        <a href="#" @click.prevent class="text-sm/6 font-semibold text-black">Conocer más de OmniCar <span
                                aria-hidden="true">→</span></a>
                    </div>
                </div>
                <div class="relative h-80 lg:mt-8 md:mt-4  sm:h-auto sm:flex sm:items-end mt-8 mb-8">
    <img class="absolute inset-0 w-full h-full object-cover sm:relative sm:object-contain sm:w-auto sm:h-auto rounded-md bg-white/5 ring-1 ring-white/10"
        src="/public/11.jpg" alt="App screenshot" width="1824" height="1080" />
</div>

            </div>
        </div>
    </div>


    <div class="relative max-w-[85%] max-h-[85%] isolate overflow-hidden bg-white  sm:py-20 p-10 rounded-lg shadow-lg mb-40 mx-auto flex justify-center items-center">




        <div class="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl"
            aria-hidden="true">
            <div class="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#239e61] to-[#1d7e4b] opacity-20"
                style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" />
        </div>
        <div class="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu"
            aria-hidden="true">
            <div class="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#239e61] to-[#1d7e4b] opacity-20"
                style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" />
        </div>
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
    <!-- Контейнер для центрирования h4 и p -->
    <div class="flex flex-col items-center justify-center text-center">
        <h4 class="text-5xl font-semibold tracking-tight text-green-700 sm:text-5xl">Ahora eres parte de OmniCar</h4>
        <p class="mt-8 text-pretty text-lg font-medium text-black sm:text-xl/8">
            OmniCar conecta a los conductores y los pasajeros para que puedan realizar viajes compartidos. Nuestra misión
            se basa en los tres aspectos del principio de "Desarrollo Sustentable".
        </p>
    </div>

    <!-- Центрирование изображения -->
    <img src="/public/2.png" alt="Viaje"
        class="object-contain -z-10 mx-auto m-4" />

    <div class="mx-auto mt-4 max-w-2xl lg:mx-0 lg:max-w-none">
        <div
            class="grid grid-cols-1 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 mt-10 text-3xl font-semibold text-black lg:gap-x-10">
            <div v-for="(link, index) in links" :key="link.name" class="flex flex-col mt-10 items-center">
                <h5 :href="link.href">{{ link.name }} <span aria-hidden="true"></span></h5>
                <dd class="text-base font-semibold tracking-tight mt-10 text-green-700">
                    {{ stats[index]?.value || '-' }}
                </dd>
            </div>
        </div>
    </div>
</div>

    </div>

</template>


<script>
import BaseHeading1 from '../components/BaseHeading1.vue';

export default {
    name: 'Home',
    components: { BaseHeading1 }
}

</script>

<script setup>
const links = [
    { name: 'Ecológico' },
    { name: 'Económico' },
    { name: 'Social' },
]
const stats = [
    { value: 'Reducir de emisiones de CO2 y usar eficiente de los recursos' },
    { value: 'Ahorrar los gastos de combustible y el pago de peajes' },
    { value: 'Fortalecer de las conexiones sociales' },
]
</script>
<template>
    <div class="bg-white">
        <div class="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
            <div
                class="relative isolate overflow-hidden bg-gray-100 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0 flex flex-col lg:flex-row">
                <div class="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-24 lg:text-left">
                    <h1 class="text-balance text-6xl font-semibold tracking-tight text-green-700">
                        ¡Bienvenido a bordo de OmniCar!</h1>
                    <p class="mt-6 text-pretty text-lg/8 text-black sm:text-2xl">Comienza tu viaje con nosotros</p>
                    <div class="mt-10 flex items-center justify-center gap-x-6 lg:justify-start flex-wrap">
                        <router-link to="/viajes"
                            class="rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-400 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                            <span class="pt-2">Ver viajes</span>
                        </router-link>
                        <a href="#" @click.prevent class="text-sm/6 font-semibold text-black">Conocer más de OmniCar <span
                                aria-hidden="true">→</span></a>
                    </div>
                </div>
                <div class="relative h-80 lg:mt-8 md:mt-4  sm:h-auto sm:flex sm:items-end mt-8 mb-8">
    <img class="absolute inset-0 w-full h-full object-cover sm:relative sm:object-contain sm:w-auto sm:h-auto rounded-md bg-white/5 ring-1 ring-white/10"
        src="/public/11.jpg" alt="App screenshot" width="1824" height="1080" />
</div>

            </div>
        </div>
    </div>


    <div class="relative max-w-[85%] max-h-[85%] isolate overflow-hidden bg-white  sm:py-20 p-10 rounded-lg shadow-lg mb-40 mx-auto flex justify-center items-center">




        <div class="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl"
            aria-hidden="true">
            <div class="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#239e61] to-[#1d7e4b] opacity-20"
                style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" />
        </div>
        <div class="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu"
            aria-hidden="true">
            <div class="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#239e61] to-[#1d7e4b] opacity-20"
                style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" />
        </div>
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
    <!-- Контейнер для центрирования h4 и p -->
    <div class="flex flex-col items-center justify-center text-center">
        <h4 class="text-5xl font-semibold tracking-tight text-green-700 sm:text-5xl">Ahora eres parte de OmniCar</h4>
        <p class="mt-8 text-pretty text-lg font-medium text-black sm:text-xl/8">
            OmniCar conecta a los conductores y los pasajeros para que puedan realizar viajes compartidos. Nuestra misión
            se basa en los tres aspectos del principio de "Desarrollo Sustentable".
        </p>
    </div>

    <!-- Центрирование изображения -->
    <img src="/public/2.png" alt="Viaje"
        class="object-contain -z-10 mx-auto m-4" />

    <div class="mx-auto mt-4 max-w-2xl lg:mx-0 lg:max-w-none">
        <div
            class="grid grid-cols-1 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 mt-10 text-3xl font-semibold text-black lg:gap-x-10">
            <div v-for="(link, index) in links" :key="link.name" class="flex flex-col mt-10 items-center">
                <h5 :href="link.href">{{ link.name }} <span aria-hidden="true"></span></h5>
                <dd class="text-base font-semibold tracking-tight mt-10 text-green-700">
                    {{ stats[index]?.value || '-' }}
                </dd>
            </div>
        </div>
    </div>
</div>

    </div>

</template>


<script>
import BaseHeading1 from '../components/BaseHeading1.vue';

export default {
    name: 'Home',
    components: { BaseHeading1 }
}

</script>

<script setup>
const links = [
    { name: 'Ecológico' },
    { name: 'Económico' },
    { name: 'Social' },
]
const stats = [
    { value: 'Reducir de emisiones de CO2 y usar eficiente de los recursos' },
    { value: 'Ahorrar los gastos de combustible y el pago de peajes' },
    { value: 'Fortalecer de las conexiones sociales' },
]
</script>
