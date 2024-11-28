<template>
    <div class="mb-20">
      <BaseHeading1 class="text-3xl text-gray-900 mt-4">Editar mi perfil</BaseHeading1>
  
      <form @submit.prevent="handleSubmit" class="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section class="space-y-4">
          <h2 class="inline-block bg-gray-100 text-xl p-2 border rounded-xl shadow text-gray-700 font-semibold">Información personal</h2>
  
          <div class="mb-4">
            <label for="displayName" class="block mb-2 text-sm font-medium text-gray-900"><strong class="text-gray-900 text-xl">Nombre de usuario</strong></label>
            <input type="text" id="displayName" class="w-full p-2 border rounded" v-model="editData.displayName" />
          </div>
  
          <div class="mb-4">
            <label for="rol" class="block mb-2 text-sm font-medium text-gray-900"><strong class="text-gray-900 text-xl">Tipo de usuario</strong></label>
            <select id="rol" class="w-full p-2 border rounded" v-model="editData.rol">
              <option v-for="role in roles" :key="role" :value="role">{{ role }}</option>
            </select>
          </div>
  

  
          <div class="mb-4">
            <label for="email" class="block mb-2 text-sm font-medium text-gray-900"><strong class="text-gray-900 text-xl">Email</strong></label>
            <input type="email" id="email" class="w-full p-2 border rounded" v-model="editData.email" />
          </div>
  
          <div class="mb-4">
            <label for="telefono" class="block mb-2 text-sm font-medium text-gray-900"><strong class="text-gray-900 text-xl">Número de teléfono</strong></label>
            <input type="text" id="telefono" class="w-full p-2 border rounded" v-model="editData.telefono" />
          </div>
  
          <div class="mb-4">
            <label for="metodosDePago" class="block mb-2 text-sm font-medium text-gray-900"><strong class="text-gray-900 text-xl">Métodos de pago</strong></label>
            <input type="text" id="metodosDePago" class="w-full p-2 border rounded" v-model="editData.metodosDePago" />
          </div>

          <div class="mb-4">
            <label for="bio" class="block mb-2 text-sm font-medium text-gray-900"><strong class="text-gray-900 text-xl">Sobre mí</strong></label>
            <textarea id="bio" class="w-full p-2 border rounded" v-model="editData.bio"></textarea>
          </div>
        </section>
  
        <section class="space-y-4">
          <h2 class="inline-block bg-gray-100 text-xl p-2 border rounded-xl shadow text-gray-700 font-semibold">Información sobre auto</h2>
  
          <div class="mb-4">
            <label for="marca" class="block mb-2 text-sm font-medium text-gray-900"><strong class="text-gray-900 text-xl">Marca</strong></label>
            <input type="text" id="marca" class="w-full p-2 border rounded" v-model="editData.marca" />
          </div>
  
          <div class="mb-4">
            <label for="modelo" class="block mb-2 text-sm font-medium text-gray-900"><strong class="text-gray-900 text-xl">Modelo</strong></label>
            <input type="text" id="modelo" class="w-full p-2 border rounded" v-model="editData.modelo" />
          </div>
  
          <div class="mb-4">
            <label for="año" class="block mb-2 text-sm font-medium text-gray-900"><strong class="text-gray-900 text-xl">Año</strong></label>
            <input type="number" id="año" class="w-full p-2 border rounded" v-model="editData.año" />
          </div>
  
          <div class="mb-4">
            <label for="color" class="block mb-2 text-sm font-medium text-gray-900"><strong class="text-gray-900 text-xl">Color</strong></label>
            <input type="text" id="color" class="w-full p-2 border rounded" v-model="editData.color" />
          </div>
  
          <div class="mb-4">
            <label for="tipoCombustible" class="block mb-2 text-sm font-medium text-gray-900"><strong class="text-gray-900 text-xl">Tipo de combustible</strong></label>
            <input type="text" id="tipoCombustible" class="w-full p-2 border rounded" v-model="editData.tipoCombustible" />
          </div>
  
          <div class="mb-4">
            <label for="consumoPromedio" class="block mb-2 text-sm font-medium text-gray-900"><strong class="text-gray-900 text-xl">Consumo promedio</strong></label>
            <input type="text" id="consumoPromedio" class="w-full p-2 border rounded" v-model="editData.consumoPromedio" />
          </div>
        </section>
  
        <div>
          <button type="submit" class="transition-all py-2 px-4 rounded bg-green-700 text-white focus:bg-green-500 hover:bg-green-500 active:bg-green-900">
            Actualizar
          </button>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  import BaseHeading1 from "../components/BaseHeading1.vue";
  import { editMyProfile, subscribeToAuthState } from "../services/auth";
  
  let unsubscribeAuth = () => {};
  
  export default {
    name: "MyProfileEdit",
    components: { BaseHeading1 },
    data() {
      return {
        editData: {
          displayName: "",
          rol: "",
          bio: "",
          email: "",
          telefono: "",
          marca: "",
          modelo: "",
          año: "",
          color: "",
          tipoCombustible: "",
          consumoPromedio: "",
          metodosDePago: "",
        },
        editing: false,
        roles: ["Pasajero", "Conductor"],
      };
    },
    methods: {
      async handleSubmit() {
        this.editing = true;
        try {
          await editMyProfile({ ...this.editData });
          this.$router.push("/mi-perfil");
        } catch (error) {
          console.error(error);
        }
        this.editing = false;
      },
    },
    mounted() {
      unsubscribeAuth = subscribeToAuthState((userData) => {
        this.editData = {
          displayName: userData.displayName || "",
          rol: userData.rol || "",
          bio: userData.bio || "",
          email: userData.email || "",
          telefono: userData.telefono || "",
          marca: userData.marca || "",
          modelo: userData.modelo || "",
          año: userData.año || "",
          color: userData.color || "",
          tipoCombustible: userData.tipoCombustible || "",
          consumoPromedio: userData.consumoPromedio || "",
          metodosDePago: userData.metodosDePago || "",
        };
      });
    },
    unmounted() {
      unsubscribeAuth();
    },
  };
  </script>
  
