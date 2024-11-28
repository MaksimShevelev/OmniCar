<template>
    <div
        class="h-screen w-full mb-20 flex items-center justify-center bg-cover bg-top-left bg-white bg-opacity-80 p-8 rounded shadow-lg"
        style="background-image: url('/public/старт.jpg');"
    >
        <div class="text-center w-full sm:w-3/4 md:w-1/2 lg:w-1/3 bg-white bg-opacity-80 p-8 rounded shadow-lg">
            <h1 class="mt-4 text-balance text-4xl font-semibold tracking-tight text-gray-900 ">
                Encuentra a quien vaya en tu misma dirección
            </h1>
            <p class="mt-6 text-pretty text-lg font-medium text-gray-900 sm:text-xl">
                Como con el conductor o como el pasajero
            </p>

            <div class="mt-10 flex items-center justify-center gap-x-6 flex-wrap">
                <router-link to="/iniciar-sesion"
                    class="rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-white hover:text-gray-900">
                    <span class="pt-2">Iniciar sesión</span>
                </router-link>

                <router-link to="/registro"
                    class="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-green-600 hover:text-white">
                    <span class="pt-2">Registrarse</span>
                </router-link>
            </div>
        </div>
    </div>
</template>

<style>
.bg-top-left {
    background-position: top right; 
    background-size: cover; 
}
</style>
