<template>
    <BaseHeading1 class="text-center text-gray-900 mt-4 text-3xl">Crear viaje</BaseHeading1>

    <div id="map" class="h-96 mt-4"></div>
    <div class="my-4 p-4 border rounded flex mb-40">
        <section class="w-1/2 p-2 shadow-md bg-white">
            <h2 class="text-xl text-green-700 mb-4">Construir ruta</h2>
            <div class="mb-4 suggestions-container">
                <label class="block mb-2"><strong>Origen:</strong></label>
                <input v-model="origin.city" @input="getSuggestionsDebounced(origin.city, 'origin')" class="p-2 border rounded mb-2"/>
                <ul v-if="originSuggestions.length" class="suggestions-list">
                    <li v-for="(suggestion, index) in originSuggestions" :key="index" @click="origin.city = suggestion; originSuggestions = []" class="suggestion-item">{{ suggestion }}</li>
                </ul>
            </div>

            <div class="mb-4 suggestions-container">
                <label class="block mb-2"><strong>Destino:</strong></label>
                <input v-model="destination.city" @input="getSuggestionsDebounced(destination.city, 'destination')" class="p-2 border rounded"/>
                <ul v-if="destinationSuggestions.length" class="suggestions-list">
                    <li v-for="(suggestion, index) in destinationSuggestions" :key="index" @click="destination.city = suggestion; destinationSuggestions = []" class="suggestion-item">{{ suggestion }}</li>
                </ul>
            </div>

            <div class="mb-4">
                <label class="block mb-2"><strong>Cantidad de asientos:</strong></label>
                <input type="number" v-model.number="numSeats" min="1" max="4" class="p-2 border rounded" @input="numSeats = Math.max(1, Math.min(numSeats, 4))"/>
            </div>

            <button @click="getRoute" class="transition-all py-2 px-4 rounded bg-green-700 text-white focus:bg-green-500 hover:bg-green-500 active:bg-green-900">
                Construir
            </button>
        </section>

        <div v-if="routeInfo.distance && (routeInfo.duration.hours || routeInfo.duration.minutes)" class="w-1/2 p-4 shadow-md bg-white">
            <h2 class="my-4 text-xl text-green-700 font-semibold">Información sobre la ruta</h2>
            <p class="my-4 p-4 border rounded"><strong>Distancia:</strong> {{ routeInfo.distance }} km</p>
            <p class="my-4 p-4 border rounded"><strong>Tiempo de viaje:</strong> {{ routeInfo.duration.hours }} hs {{ routeInfo.duration.minutes }} min</p>
            <p class="my-4 p-4 border rounded"><strong>Precio recomendado:</strong> {{ routeInfo.recommendedPrice }} $ ARS</p>
            <div class="mb-4 p-4 border rounded">
                <label class="block mb-2"><strong>Precio $ ARS:</strong></label>
                <input type="number" v-model.number="customPrice" class="p-2 border rounded" @input="customPrice = Math.max(1, customPrice)"/>
            </div>

            <button @click="saveTrip" class="transition-all py-2 px-4 rounded bg-green-700 text-white focus:bg-green-500 hover:bg-green-500 active:bg-green-900">
                Continuar
            </button>

            <!-- Show loader if saving -->
            <BaseLoader v-if="isSaving" />
        </div>
    </div>
</template>



<script>
import mapboxgl from 'mapbox-gl';
import BaseHeading1 from '../components/BaseHeading1.vue';
import BaseLoader from '../components/BaseLoader.vue';
import { subscribeToAuthState } from '../services/auth.js';
import { saveTrip } from '../services/viajes.js';
import { uploadFile } from "../services/file-storage";
import 'mapbox-gl/dist/mapbox-gl.css';

let unsubscribeAuth = () => {};

mapboxgl.accessToken = 'pk.eyJ1IjoibWF4aWFzZGRzYWRzZGYiLCJhIjoiY20ydGM4MGFzMDFrZDJrb2gyMGV5ajFnMCJ9.l0ZQB85L5nD3LWTRYM0hlA';

export default {
    name: 'ConstruirRuta',
    components: { BaseHeading1, BaseLoader },
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
                duration: { hours: 0, minutes: 0 },
                recommendedPrice: null,
            },
            customPrice: '',
            map: null,
            isSaving: false, // Show loader during save
            getSuggestionsDebounced: null,
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
                alert("Please enter valid cities for origin and destination.");
                return;
            }
            const originCoordinates = await this.getCoordinates(this.origin.city);
            const destinationCoordinates = await this.getCoordinates(this.destination.city);

            if (!originCoordinates || !destinationCoordinates) {
                alert("Coordinates for the cities could not be found.");
                return;
            }

            const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${originCoordinates[0]},${originCoordinates[1]};${destinationCoordinates[0]},${destinationCoordinates[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
            const response = await fetch(url);
            const data = await response.json();
            const route = data.routes[0].geometry;

            this.routeInfo.distance = (data.routes[0].distance / 1000).toFixed(2);
            const totalMinutes = Math.round(data.routes[0].duration / 60);
            this.routeInfo.duration = { hours: Math.floor(totalMinutes / 60), minutes: totalMinutes % 60 };
            const basePrice = (parseFloat(this.routeInfo.distance) / 100) * 7 * 1000;

            this.routeInfo.recommendedPrice = this.numSeats > 0 ? (basePrice / this.numSeats).toFixed(2) : basePrice.toFixed(2);

            if (this.routeLayer) {
                this.map.removeLayer('route');
                this.map.removeSource('route');
            }

            this.map.addSource('route', {
                type: 'geojson',
                data: { type: 'Feature', properties: {}, geometry: route },
            });

            this.map.addLayer({
                id: 'route',
                type: 'line',
                source: 'route',
                layout: { 'line-join': 'round', 'line-cap': 'round' },
                paint: { 'line-color': '#3887be', 'line-width': 5, 'line-opacity': 0.75 },
            });

            this.routeLayer = 'route';

            this.map.fitBounds([
                [Math.min(originCoordinates[0], destinationCoordinates[0]), Math.min(originCoordinates[1], destinationCoordinates[1])],
                [Math.max(originCoordinates[0], destinationCoordinates[0]), Math.max(originCoordinates[1], destinationCoordinates[1])]
            ], { padding: 20 });
        },

        async saveTrip() {
            if (this.isSaving) return;
            this.isSaving = true;

            const tripData = {
                origin: this.origin.city,
                destination: this.destination.city,
                numSeats: this.numSeats,
                price: this.customPrice || this.routeInfo.recommendedPrice,
                user_id: this.loggedUser.id,
            };

            try {
                const originCoordinates = await this.getCoordinates(this.origin.city);
                const destinationCoordinates = await this.getCoordinates(this.destination.city);
                const imageUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s-o+000(${originCoordinates[0]},${originCoordinates[1]}),pin-s-d+f00(${destinationCoordinates[0]},${destinationCoordinates[1]})/${originCoordinates[0]},${originCoordinates[1]},6,0/600x400?access_token=${mapboxgl.accessToken}`;

                let response;
                for (let attempt = 1; attempt <= 3; attempt++) {
                    response = await fetch(imageUrl);
                    if (response.headers.get("content-type") === "image/png") break;
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

                if (response.ok) {
                    const blob = await response.blob();

                    if (blob.size > 5000) {
                        const downloadURL = await uploadFile(`mapSnapshots/${Date.now()}_map.png`, blob);
                        tripData.mapSnapshot = downloadURL;

                        const tripRef = await saveTrip(tripData);
                        this.$router.push({ name: 'PublicarViaje', params: { tripId: tripRef.id } });
                    } else {
                        console.warn("Image is too small or corrupted.");
                    }
                } else {
                    console.error("Could not retrieve a valid PNG image.");
                }
            } catch (error) {
                console.error('Error saving trip:', error);
                alert('Error saving trip.');
            } finally {
                this.isSaving = false;
            }
        },

        async getSuggestions(city, field) {
            if (!city) {
                this[`${field}Suggestions`] = [];
                return;
            }

            const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(city)}.json?access_token=${mapboxgl.accessToken}`;
            const response = await fetch(url);
            const data = await response.json();
            this[`${field}Suggestions`] = data.features.map(feature => feature.place_name);
        },

        debounce(func, delay) {
            let timeout;
            return function (...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), delay);
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
    },
};
</script>


<style>
.suggestions-list {
    border: 1px solid #ccc;
    background-color: white;
    position: absolute;
    z-index: 1000;
    width: calc(100% - 16px);
}

.suggestion-item {
    padding: 8px;
    cursor: pointer;
}

.suggestion-item:hover {
    background-color: #f0f0f0;
}

#map {
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.67);
    overflow: hidden;
}

.suggestions-container {
    position: relative;
}

.suggestions-list {
    position: absolute;
    top: 100%;
    left: 0;
    border: 1px solid #ccc;
    background-color: white;
    z-index: 1000;
    width: calc(100% - 16px);
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
