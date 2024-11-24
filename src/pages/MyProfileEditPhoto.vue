<template>
    <BaseHeading1 class="text-3xl text-gray-900 mt-4" >Cambiar foto de perfil</BaseHeading1>

    <div class="sm:col-span-4">
      <h2 class="block text-sm font-medium text-gray-900">Previsualización de la foto elegida</h2>
      <div class="mt-2 flex justify-start">
            <img 
                v-if="editData.photoPreview !== null"
                :src="editData.photoPreview"
                alt="Previsualización de la foto elegida"
                class="rounded-full w-32 h-32 object-cover border-2 border-custom-green"
            >
        </div>
    </div>

    <div 
        v-if="feedback.text"
        class="p-4 mb-4 rounded max-w-[60%]"
        :class="{
            'bg-green-200 text-green-700': feedback.type == 'success',
            'bg-red-200 text-red-700': feedback.type == 'error',
        }"
    >
        {{ feedback.text }}
    </div>

    <div class="flex gap-8 items-start mt-8  mb-40 max-w-[60%]">
        
        <!-- Форма загрузки фото -->
        <form 
            class="w-full max-w-[60%]"
            action="#"
            @submit.prevent="handleSubmit"
        >
            <div class="mb-4">
                <label for="photoURL" class="block text-sm font-medium text-gray-900 mb-2"><strong class="text-gray-900 text-xl">Nueva foto</strong></label>
                <input
                    type="file"
                    id="photoURL"
                    class="w-full p-2 border rounded  max-w-[60%]"
                    :class="{'bg-gray-200': editing}"
                    @change="handleFileSelection"
                >
            </div>
            <button 
                type="submit"
                class="transition-all py-2 px-4 rounded bg-green-700 text-white focus:bg-green-500 hover:bg-green-500 active:bg-green-900"
            >
                {{ !editing ? 'Actualizar' : 'Actualizando...' }}
            </button>
        </form>

        <!-- Превью фото -->

    </div>
</template>

<script>
import BaseHeading1 from '../components/BaseHeading1.vue';
import { editMyProfilePhoto } from '../services/auth';

export default {
    name: 'MyProfileEditPhoto',
    components: { BaseHeading1 },
    data() {
        return {
            editing: false,
            editData: {
                photo: null,
                photoPreview: null,
            },
            feedback: {
                text: null,
                type: null,
            },
        };
    },
    methods: {
    async handleSubmit() {
        if (this.editing) return;
        if (this.editData.photo == null) {
            this.feedback = {
                text: 'Tenés que elegir una foto para actualizar tu perfil.',
                type: 'error',
            };
            return;
        }
        this.editing = true;
        try {
            await editMyProfilePhoto(this.editData.photo);
            this.feedback = {
                text: '¡Tu foto de perfil fue actualizada con éxito!',
                type: 'success',
            };
            // Переход на страницу профиля после успешного обновления
            this.$router.push('/mi-perfil');
        } catch (error) {
            this.feedback = {
                text: 'Ocurrió un error y la foto no pudo ser actualizada.',
                type: 'error',
            };
        }
        this.editing = false;
    },
    handleFileSelection(ev) {
        this.editData.photo = ev.target.files[0] || null;
        if (!this.editData.photo) {
            this.editData.photoPreview = null;
            return;
        }
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            this.editData.photoPreview = reader.result;
        });
        reader.readAsDataURL(this.editData.photo);
    },
}
};
</script>


