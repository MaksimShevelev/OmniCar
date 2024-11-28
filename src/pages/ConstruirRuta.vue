<template>
              <BaseHeading1 class="flex flex-col rounded-x justify-center text-3xl items-center text-center mt-4">Crear un viaje
              </BaseHeading1>
    <div id="map-container" class="flex h-[75vh] w-full rounded-lg shadow-2xl mb-40">

        <div id="map" class="flex-grow rounded-lg">

        <div class="form-container mb-4 absolute bottom-3 right-3 w-70 p-4 shadow-lg rounded-lg 
            sm:right-2 sm:bottom-2 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0  ">

            <section class="w-full">
                <div class="mb-4 suggestions-container">
                    <label class="block mb-2"><strong>Origen</strong></label>
                    <input v-model="origin.city" @input="getSuggestionsDebounced(origin.city, 'origin')"
                        class="p-2 border rounded mb-2 responsive-input" />
                    <ul v-if="originSuggestions.length" class="suggestions-list">
                        <li v-for="(suggestion, index) in originSuggestions" :key="index"
                            @click="origin.city = suggestion; originSuggestions = []" class="suggestion-item">{{
                                suggestion }}</li>
                    </ul>
                </div>

                <div class="mb-4 suggestions-container">
                    <label class="block mb-2"><strong>Destino</strong></label>
                    <input v-model="destination.city" @input="getSuggestionsDebounced(destination.city, 'destination')"
                        class="p-2 border rounded responsive-input" />
                    <ul v-if="destinationSuggestions.length" class="suggestions-list">
                        <li v-for="(suggestion, index) in destinationSuggestions" :key="index"
                            @click="destination.city = suggestion; destinationSuggestions = []" class="suggestion-item">
                            {{ suggestion }}</li>
                    </ul>
                </div>

                <div class="mb-4">
                    <label class="block mb-2"><strong>Cantidad de asientos</strong></label>
                    <div class="flex items-center space-x-2">
                        <button @click="decrementSeats"
                            class="p-2 bg-gray-100 border rounded hover:bg-gray-300 focus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                class="bi bi-dash-circle" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" />
                            </svg>
                        </button>

                        <input type="number" v-model.number="numSeats" min="1" max="4"
                            class=" p-1 border rounded w-12 text-center no-spinner"
                            @input="numSeats = Math.max(1, Math.min(numSeats, 4))" />

                        <button @click="incrementSeats"
                            class="p-2 bg-gray-100 border rounded hover:bg-gray-300 focus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                class="bi bi-plus-circle" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                <path
                                    d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                            </svg>
                        </button>
                    </div>
                </div>


                <button @click="getRoute"
                    class="transition-all py-2 px-4 rounded bg-green-700 text-white focus:bg-green-500 hover:bg-green-500 active:bg-green-900 w-full">
                    Crear ruta
                </button>
            </section>




        </div>
 
    </div>


        
    </div>
    <div v-if="routeInfo.distance && (routeInfo.duration.hours || routeInfo.duration.minutes)" class="mx-auto mb-40 p-4 border-t shadow-lg rounded-lg w-[40%]">


<h2 class="my-4 text-2xl text-center text-green-700 font-semibold">Información sobre la ruta</h2>


<p class="my-4 "><strong>Distancia - </strong> {{ routeInfo.distance }} km</p>
<p class="my-4 "><strong>Tiempo de viaje - </strong> {{ routeInfo.duration.hours }}
    hs {{ routeInfo.duration.minutes }} min</p>
<p class="my-4 "><strong>Precio recomendado por 1 asiento - </strong> {{
    routeInfo.recommendedPrice }} $ ARS <span class="info-icon" title="El precio recomendado se calcula según la distancia del recorrido, la cantidad de asientos, el consumo promedio de combustible de tu auto y el precio actual del tipo de combustible que usa tu vehículo">
        &#128712;
    </span></p>
        
<div class="mb-4">
<label class="block mb-2"><strong>Precio por 1 asiento</strong></label>
<input
type="number"
v-model.number="customPrice"
class="p-2 border rounded responsive-input"
@input="customPrice = Math.max(1, customPrice)"
/> $ ARS 
</div>


<button @click="saveTrip"
    class="transition-all py-2 px-4 rounded bg-green-700 text-white focus:bg-green-500 hover:bg-green-500 active:bg-green-900 w-full">
    Continuar
</button>


</div>

    <BaseLoader v-if="isSaving" />
</template>



<script>
import mapboxgl from 'mapbox-gl';
import BaseHeading1 from '../components/BaseHeading1.vue';
import BaseLoader from '../components/BaseLoader.vue';
import { subscribeToAuthState } from '../services/auth.js';
import { saveTrip } from '../services/viajes.js';
import { uploadFile } from "../services/file-storage";
import 'mapbox-gl/dist/mapbox-gl.css';
import polyline from '@mapbox/polyline';

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
            isSaving: false, 
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

            const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${originCoordinates[0]},${originCoordinates[1]};${destinationCoordinates[0]},${destinationCoordinates[1]}?geometries=polyline&access_token=${mapboxgl.accessToken}`;
            const response = await fetch(url);
            const data = await response.json();

            if (!data.routes || data.routes.length === 0) {
                alert("No route found.");
                return;
            }

            const route = data.routes[0].geometry;
            const coordinates = polyline.decode(route);

            const geojson = {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'LineString',
                    coordinates: coordinates.map(coord => [coord[1], coord[0]])
                }
            };

            this.routeInfo.distance = (data.routes[0].distance / 1000).toFixed(2);
            const totalMinutes = Math.round(data.routes[0].duration / 60);
            this.routeInfo.duration = { hours: Math.floor(totalMinutes / 60), minutes: totalMinutes % 60 };

            const basePrice = (parseFloat(this.routeInfo.distance) / 100) * 7 * 1200;
            this.routeInfo.recommendedPrice = this.numSeats > 0 ? (basePrice / this.numSeats).toFixed(2) : basePrice.toFixed(2);

            if (this.routeLayer) {
                this.map.removeLayer('route');
                this.map.removeSource('route');
            }

            this.map.addSource('route', {
                type: 'geojson',
                data: geojson,
            });

            this.map.addLayer({
                id: 'route',
                type: 'line',
                source: 'route',
                layout: { 'line-join': 'round', 'line-cap': 'round' },
                paint: { 'line-color': '#239e61', 'line-width': 5, 'line-opacity': 0.75 },
            });

            this.routeLayer = 'route';

            const bounds = new mapboxgl.LngLatBounds();
            coordinates.forEach(coord => bounds.extend([coord[1], coord[0]]));
            this.map.fitBounds(bounds, { padding: 20 });

            const staticMapUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s-a+9ed4bd(${originCoordinates[0]},${originCoordinates[1]}),pin-s-b+000(${destinationCoordinates[0]},${destinationCoordinates[1]}),path-5+f44-0.5(${encodeURIComponent(route)})/auto/400x300?access_token=${mapboxgl.accessToken}`;

            try {
                const mapResponse = await fetch(staticMapUrl);
                if (!mapResponse.ok) {
                    throw new Error(`Error fetching map snapshot: ${mapResponse.status}`);
                }

                const blob = await mapResponse.blob();
                if (blob.size < 5000) {
                    throw new Error('Map snapshot is too small or corrupted.');
                }

                const downloadURL = await uploadFile(`mapSnapshots/${Date.now()}_map.png`, blob);
                this.mapSnapshot = downloadURL;
                console.log('Map snapshot saved successfully:', downloadURL);

            } catch (error) {
                console.error('Error while saving map snapshot:', error);
            }
        },

        incrementSeats() {
            this.numSeats = Math.min(this.numSeats + 1, 4);
        },

        decrementSeats() {
            this.numSeats = Math.max(this.numSeats - 1, 1);
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
                mapSnapshot: this.mapSnapshot,
            };

            try {
                const tripRef = await saveTrip(tripData);
                console.log('Trip saved successfully:', tripRef.id);
                this.$router.push({ name: 'PublicarViaje', params: { tripId: tripRef.id } });
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
    watch: {
        numSeats(newVal) {
            if (this.routeInfo.distance) {
                const basePrice = (parseFloat(this.routeInfo.distance) / 100) * 7 * 1000;
                this.routeInfo.recommendedPrice = newVal > 0 ? (basePrice / newVal).toFixed(2) : basePrice.toFixed(2);

                if (!this.customPrice || this.customPrice === this.routeInfo.recommendedPrice) {
                    this.customPrice = '';
                }
            }
        }
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
.info-icon {
        font-size: 20px;
        color: #239e61;
        cursor: pointer;
        margin-left: 8px;
        position: relative; 
    }

    .info-icon:hover {
        text-decoration: underline;
    }

    .info-icon[title]:hover::after {
        content: attr(title);
        position: absolute;
        background-color: #239e61;
        color: #fff;
        border-radius: 5px;
        padding: 8px;
        font-size: 14px;
        top: 25px; /* Отступ сверху от иконки */
        left: 0; /* Отступ слева от иконки */
        z-index: 1; /* Чтобы текст не разрывался на несколько строк */
        width: max-content; /* Автоматическая ширина, чтобы окно подстраивалось под контент */
        max-width: 300px; /* Максимальная ширина для ограничения окна */
    }

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

.form-container {
    background-color: #ffffffce;
    z-index: 9989;
}

.no-spinner {
    -moz-appearance: textfield;
    -webkit-appearance: none;
    appearance: none;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.responsive-input {
    width: 100%; 
    max-width: 200px; 
  }

  @media (min-width: 640px) {
    .responsive-input {
      max-width: 300px; 
    }
  }
</style>
