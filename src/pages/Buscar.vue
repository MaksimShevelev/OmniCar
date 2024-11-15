<template>
    <div id="map-container" class="relative w-full mb-4">
        <div id="map" class="h-[79vh] w-full rounded-lg"></div>
        <!-- Контейнер формы, размещённый поверх карты -->
        <div class="form-container absolute bottom-3 right-3 w-80 p-4 shadow-lg rounded-lg bg-white 
    sm:right-2 sm:bottom-2 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0">
    <h2 class="text-xl text-green-700 mb-4">Construir ruta</h2>
    <div class="mb-4 suggestions-container">
        <label class="block mb-2"><strong>Origen:</strong></label>
        <input v-model="origin.city" @input="getSuggestionsDebounced(origin.city, 'origin')" placeholder="Nombre de la ciudad" class="p-2 border rounded mb-2 w-full"/>
        <ul v-if="originSuggestions.length" class="suggestions-list">
            <li v-for="(suggestion, index) in originSuggestions" :key="index" @click="origin.city = suggestion; originSuggestions = []" class="suggestion-item">{{ suggestion }}</li>
        </ul>
    </div>
    <div class="mb-4 suggestions-container">
        <label class="block mb-2"><strong>Destino:</strong></label>
        <input v-model="destination.city" @input="getSuggestionsDebounced(destination.city, 'destination')" placeholder="Nombre de la ciudad" class="p-2 border rounded w-full"/>
        <ul v-if="destinationSuggestions.length" class="suggestions-list">
            <li v-for="(suggestion, index) in destinationSuggestions" :key="index" @click="destination.city = suggestion; destinationSuggestions = []" class="suggestion-item">{{ suggestion }}</li>
        </ul>
    </div>
    <button @click="getRoute" class="transition-all py-2 px-4 rounded bg-green-700 text-white focus:bg-green-500 hover:bg-green-500 active:bg-green-900 w-full">
        Buscar
    </button>
</div>

    </div>
</template>



<script>
import mapboxgl from 'mapbox-gl';
import BaseHeading1 from '../components/BaseHeading1.vue';
import { subscribeToAuthState } from '../services/auth.js';

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

let unsubscribeAuth = () => {};

mapboxgl.accessToken = 'pk.eyJ1IjoibWF4aWFzZGRzYWRzZGYiLCJhIjoiY20ydGM4MGFzMDFrZDJrb2gyMGV5ajFnMCJ9.l0ZQB85L5nD3LWTRYM0hlA';

export default {
    name: 'ConstruirRuta',
    components: { BaseHeading1 },
    data() {
        return {
            loggedUser: {
                id: null,
                email: null,
                displayName: null,
                rol: null,
            },
            origin: { city: '' },
            destination: { city: '' },
            originSuggestions: [],
            destinationSuggestions: [],
            routeLayer: null,
            numSeats: 1,
            routeInfo: {
                distance: null,
                duration: {
                    hours: 0,
                    minutes: 0,
                },
                recommendedPrice: null,
            },
            customPrice: '', 
            map: null,
        };
    },
    methods: {
        async getCoordinates(city) {
            const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(city)}.json?access_token=${mapboxgl.accessToken}`;
            const response = await fetch(url);
            const data = await response.json();
            return data.features[0]?.geometry.coordinates;
        },
        async getRoute() {
            if (!this.origin.city || !this.destination.city) {
                alert("Por favor, introduce ciudades válidas para los puntos de inicio y destino.");
                return;
            }

            const originCoordinates = await this.getCoordinates(this.origin.city);
            const destinationCoordinates = await this.getCoordinates(this.destination.city);

            if (!originCoordinates || !destinationCoordinates) {
                alert("No se pudieron encontrar las coordenadas de las ciudades.");
                return;
            }

            const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${originCoordinates[0]},${originCoordinates[1]};${destinationCoordinates[0]},${destinationCoordinates[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

            const response = await fetch(url);
            const data = await response.json();
            const route = data.routes[0].geometry;

            this.routeInfo.distance = (data.routes[0].distance / 1000).toFixed(2); // Переводим в километры
            const totalMinutes = Math.round(data.routes[0].duration / 60);
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;

            this.routeInfo.duration = {
                hours,
                minutes,
            };


            if (this.routeLayer) {
                this.map.removeLayer('route');
                this.map.removeSource('route');
            }

            this.map.addSource('route', {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    properties: {},
                    geometry: route,
                },
            });

            this.map.addLayer({
                id: 'route',
                type: 'line',
                source: 'route',
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': '#3887be',
                    'line-width': 5,
                    'line-opacity': 0.75
                }
            });

            this.routeLayer = 'route'; 

            this.map.fitBounds([
                [Math.min(originCoordinates[0], destinationCoordinates[0]), Math.min(originCoordinates[1], destinationCoordinates[1])],
                [Math.max(originCoordinates[0], destinationCoordinates[0]), Math.max(originCoordinates[1], destinationCoordinates[1])]
            ], { padding: 20 });
        },


        async getSuggestions(city, field) {
            if (!city) {
                if (field === 'origin') {
                    this.originSuggestions = [];
                } else {
                    this.destinationSuggestions = [];
                }
                return;
            }

            const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(city)}.json?access_token=${mapboxgl.accessToken}`;
            const response = await fetch(url);
            const data = await response.json();
            const suggestions = data.features.map(feature => feature.place_name);

            if (field === 'origin') {
                this.originSuggestions = suggestions;
            } else {
                this.destinationSuggestions = suggestions;
            }
        },

        debounce(func, delay) {
            let timeout;
            return function (...args) {
                const context = this;
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(context, args), delay);
            };
        },
    },
    async mounted() {
        this.map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-58.3816, -34.6037],
            zoom: 6,
        });

        unsubscribeAuth = subscribeToAuthState(newUserData => this.loggedUser = newUserData);

        this.getSuggestionsDebounced = this.debounce(this.getSuggestions, 300);
    },
    unmounted() {
        unsubscribeAuth();
    }
}
</script>




<style>
#map-container {
    position: relative;
}

#map {
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.67);
}

.form-container {
    z-index: 1000;
    background-color: #ffffff49;
}

.suggestions-list {
    position: absolute;
    top: 100%;
    left: 0;
    border: 1px solid #ccc;
    background-color: white;
    z-index: 1000;
    width: 100%;
    max-height: 150px;
    overflow-y: auto;
}

.suggestion-item {
    padding: 8px;
    cursor: pointer;
}

.suggestion-item:hover {
    background-color: #f0f0f0;
}

</style>
