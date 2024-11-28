<template>
    <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 mb-20">
        
        <div class="absolute inset-0 -z-10 transform-gpu blur-3xl opacity-20" aria-hidden="true">
            <div class="aspect-[1097/845] w-full h-full bg-gradient-to-tr from-[#239e61] to-[#1d7e4b]"
                style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
            ></div>
        </div>
        
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <img class="mx-auto h-20 w-auto" src="/public/logo.png" alt="Logo de OmniCar" />
            <BaseHeading1 class="text-center text-3xl/9 font-bold tracking-tight text-gray-900">Ingresar con tu cuenta</BaseHeading1>
        </div>

        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <form @submit.prevent="handleSubmit" class="space-y-6">
                <div>
                    <label for="email" class="block text-sm/6 font-medium text-gray-900">Email</label>
                    <div class="mt-2">
                        <input id="email" name="email" type="email" v-model="user.email" required
                            class="pl-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6" />
                    </div>
                </div>

                <div>
                    <div class="flex items-center justify-between">
                        <label for="password" class="block text-sm/6 font-medium text-gray-900">Contraseña</label>
                        <div class="text-sm">
                            <a href="#" class="font-semibold text-green-700 hover:text-green-400">¿Olvidaste tu contraseña?</a>
                        </div>
                    </div>
                    <div class="mt-2">
                        <input id="password" name="password" type="password" v-model="user.password" required
                            class="pl-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6" />
                    </div>
                </div>

                <div>
                    <button type="submit" :class="loading ? 'bg-green-900' : 'bg-green-700 hover:bg-green-500'"
                        class="flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        :disabled="loading">
                        {{ loading ? 'Ingresando...' : 'Ingresar' }}
                    </button>
                </div>
            </form>

            <p class="mt-10 text-center text-sm/6 text-gray-900">
                ¿No tienes cuenta?
                <router-link to="/registro" class="font-semibold text-green-700 hover:text-green-400">
                    Regístrate aquí
                </router-link>
            </p>
        </div>
    </div>
</template>

<script>
import BaseHeading1 from '../components/BaseHeading1.vue';
import { login } from '../services/auth';

export default {
    name: 'Login',
    components: { BaseHeading1 },
    data() {
        return {
            user: {
                email: '',
                password: '',
            },
            loading: false,
        };
    },
    methods: {
        async handleSubmit() {
            this.loading = true;

            try {
                await login({
                    email: this.user.email,
                    password: this.user.password,
                });

                this.$router.push('/home');
            } catch (error) {
                console.error("[Login.vue] Error al autenticar: ", error);
                throw error;
            }
            this.loading = false;
        }
    }
}
</script>

<style>
.no-scroll {
    overflow-x: hidden;
    max-width: 100vw;
}

html, body {
    overflow-x: hidden;
    max-width: 100vw;
}

</style>
