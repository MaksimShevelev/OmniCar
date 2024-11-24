<template>
    <div
        class="h-screen w-full mb-20 flex items-center justify-center bg-cover bg-top-left bg-white bg-opacity-80 p-8 rounded shadow-lg"
        style="background-image: url('https://firebasestorage.googleapis.com/v0/b/omnicar-80e07.firebasestorage.app/o/%D1%81%D1%82%D0%B0%D1%80%D1%82.jpg?alt=media&token=f11cd7d4-b1d6-4e93-8cdc-b6fcdda58002');"
    >
    <div class="text-center w-full sm:w-3/4 md:w-1/2 lg:w-1/3 bg-white bg-opacity-80 p-8 rounded shadow-lg">


            <h1 class="mt-4 text-balance text-4xl font-semibold tracking-tight text-green-700">
                Encuentra a quien vaya en tu misma dirección
            </h1>
            <p class="mt-6 text-pretty text-lg font-medium text-gray-900 sm:text-xl">
                Como con el conductor o como el pasajero
            </p>

            <div class="mt-10 flex items-center justify-center gap-x-6 flex-wrap">
                <router-link to="/iniciar-sesion"
                    class="rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-400 hover:text-gray-900">
                    <span class="pt-2">Iniciar sesión</span>
                </router-link>

                <router-link to="/registro"
                    class="rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-400 hover:text-gray-900">
                    <span class="pt-2">Registrarse</span>
                </router-link>
            </div>
        </div>
    </div>
</template>

<style>
/* Убедитесь, что изображение фокусируется на верхнем левом углу */
.bg-top-left {
    background-position: top right; /* Фокус сверху слева */
    background-size: cover; /* Обеспечивает покрытие экрана */
}
</style>
