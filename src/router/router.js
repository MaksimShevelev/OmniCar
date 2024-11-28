import { createRouter, createWebHashHistory } from "vue-router";
import { subscribeToAuthState } from "../services/auth";
import Home from "../pages/Home.vue";
import Viajes from "../pages/Viajes.vue";
import Register from "../pages/Register.vue";
import Login from "../pages/Login.vue";
import MyProfile from "../pages/MyProfile.vue";
import MyProfileEdit from "../pages/MyProfileEdit.vue";
import CrearViaje from "../pages/ViajeCreate.vue"; 
import Publicados from "../pages/Viajes.vue"; 
import Eventos from "../pages/Eventos.vue"; 
import Buscar from "../pages/Buscar.vue"; 
import MyProfileEditPhoto from "../pages/MyProfileEditPhoto.vue";
import UserProfile from "../pages/UserProfile.vue";
import PrivateChat from "../pages/PrivateChat.vue";
import Crear from "../pages/Crear.vue";
import CategoriaViaje from "../pages/CategoriaViaje.vue";
import ConstruirRuta from "../pages/ConstruirRuta.vue";
import PublicarViaje from "../pages/PublicarViaje.vue";
import ChatList from "../pages/ChatList.vue";
import MisViajes from "../pages/MisViajes.vue";
import StartPage from "../pages/Start.vue";

const routes = [
    { path: '/home', component: Home},
    { path: '/start', component: StartPage, alias: '/' },
    { path: '/registro', component: Register },
    { path: '/iniciar-sesion', component: Login },
    { path: '/viajes', component: Viajes, meta: { requiresAuth: true } },
    { path: '/mi-perfil', component: MyProfile, meta: { requiresAuth: true } },
    { path: '/mi-perfil/editar', component: MyProfileEdit, meta: { requiresAuth: true } },
    { path: '/buscar', component: Buscar, meta: { requiresAuth: true } }, 
    { path: '/eventos', component: Eventos, meta: { requiresAuth: true } }, 
    { path: '/crear-viaje', component: CrearViaje, meta: { requiresAuth: true } }, 
    { path: '/publicados', component: Publicados, meta: { requiresAuth: true } }, 
    { path: '/mi-perfil//editar/foto', component: MyProfileEditPhoto, meta: { requiresAuth: true } },
    { path: '/usuario/:id', component: UserProfile, meta: { requiresAuth: true } },
    { path: '/usuario/:id/chat', component: PrivateChat, meta: { requiresAuth: true } },
    { path: '/crear', component: Crear, meta: { requiresAuth: true } },
    { path: '/categoria-viaje', component: CategoriaViaje, meta: { requiresAuth: true } },
    { path: '/construir-ruta', component: ConstruirRuta, meta: { requiresAuth: true } },
    { path: '/mis-viajes', component: MisViajes, meta: { requiresAuth: true } },
    {
        path: '/publicar-viaje/:tripId?',
        name: 'PublicarViaje',  
        component: PublicarViaje,
        meta: { requiresAuth: true },
        props: route => ({ tripId: route.params.tripId }),
    },
{
    path: '/chats',
    name: 'ChatList',
    component: ChatList , meta: { requiresAuth: true }
  }
  
];

const router = createRouter({
    routes,
    history: createWebHashHistory(),
});

let loggedUser = {
    id: null,
    email: null,
    displayName: null,
    rol: null,
    bio: null,
};

subscribeToAuthState(newUserData => (loggedUser = newUserData));

router.beforeEach((to, from) => {
    if (loggedUser.id) {
        if (to.path === '/' || to.path === '/start') {
            return { path: '/home' };
        }
    }
    if (!loggedUser.id && to.meta.requiresAuth) {
        return { path: '/start' };
    }
});

export default router;
