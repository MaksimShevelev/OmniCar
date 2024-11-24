<template>
    <BaseHeading1 class="flex flex-col justify-center text-3xl items-center text-center mt-4">Opciones del viaje
    </BaseHeading1>
    <div class="mb-40 p-4 flex flex-col">
    <!-- Форма с секциями -->
    <form @submit.prevent="handleSubmit" class="flex flex-col lg:flex-row w-full gap-10">
        <!-- Левая секция -->
        <section class="lg:w-1/2 p-4 lg:border-r">
            <div class="mb-4">
                <h3 class="block mb-2 text-xl text-green-700">Descripción del viaje</h3>
                <textarea
                    id="text"
                    class="w-full min-h-8 p-2 border rounded"
                    v-model="newMessage.text"
                ></textarea>
            </div>

            <div class="mb-4">
                <label for="tripDate" class="block mb-2">Fecha del viaje</label>
                <input
                    type="date"
                    id="tripDate"
                    v-model="tripDate"
                    :min="todayDate"
                    class="w-60 p-2 border rounded"
                    required
                />
            </div>

            <div class="mb-4">
                <label for="tripTime" class="block mb-2">Horario de salida</label>
                <input
                    type="time"
                    id="tripTime"
                    v-model="tripTime"
                    :min="isToday ? currentTime : null"
                    class="w-60 p-2 border rounded"
                    required
                />
            </div>

            <div class="mb-4">
                <h3 class="block mb-2 text-xl text-green-700">¿Que tipo de la reserva prefieres agregar?</h3>
                <label class="inline-flex items-center">
                    <input
                        type="radio"
                        value="revisar"
                        v-model="tripType"
                        class="mr-2"
                    />
                    Revisar cada solicitud
                    <span class="ml-3 " v-html="tripTypeIcons.revisar"></span>
                </label>
                <label class="inline-flex items-center lg:ml-4 ">
                    <input
                        type="radio"
                        value="automaticomente"
                        v-model="tripType"
                        class="mr-2 lg:ml-3"
                    />
                    Confirmación automática
                    <span class="ml-3 " v-html="tripTypeIcons.automaticomente"></span>
                </label>
            </div>
        </section>

        <!-- Правая секция -->
        <section class="lg:w-1/2 p-4">
            <div class="mb-4">
                <h3 class="block mb-2 text-xl text-green-700">Opciones</h3>
                <div
                    v-for="option in availableOptions"
                    :key="option"
                    class="flex items-center mb-4"
                >
                    <input
                        type="checkbox"
                        :value="option"
                        v-model="options"
                        class="mr-2 bg-green-700"
                    />
                    <span class="ml-3" v-html="optionIcons[option]"></span>
                    <span class="ml-3">{{ option }}</span>
                </div>
            </div>
        </section>
    </form>

    <!-- Кнопка под формой -->
    <div class="flex justify-center border-t items-center pt-10 mt-10">
        <button
            type="button"
            @click="handleSubmit"
            class="transition-all w-80 py-2 px-4 rounded bg-green-700 text-white focus:bg-green-500 hover:bg-green-500 active:bg-green-900"
        >
            Publicar
        </button>
    </div>

    <BaseLoader v-if="isUpdating" class="mt-4" />
</div>




    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div class="bg-white p-6 rounded shadow-lg text-center">
            <p class="text-lg font-semibold">¡Viaje publicado con éxito!</p>
            <button @click="confirmModal" class="mt-4 py-2 px-6 rounded bg-green-700 text-white">
                OK
            </button>
        </div>
    </div>
    
</template>

<script>
import { ref, computed } from 'vue';
import mapboxgl from 'mapbox-gl';
import BaseLoader from '../components/BaseLoader.vue';
import BaseHeading1 from '../components/BaseHeading1.vue';
import { subscribeToAuthState } from '../services/auth.js';
import { saveChatMessage, subscribeToChatMessages, saveComment, subscribeToComments, updateTrip } from '../services/viajes.js';

let unsubscribeAuth = () => { };

mapboxgl.accessToken = 'pk.eyJ1IjoibWF4aWFzZGRzYWRzZGYiLCJhIjoiY20ydGM4MGFzMDFrZDJrb2gyMGV5ajFnMCJ9.l0ZQB85L5nD3LWTRYM0hlA';

export default {
    name: 'PublicarViaje',
    props: ['tripId'],
    components: { BaseHeading1, BaseLoader },
    data() {
        return {
            messages: [],
            newMessage: { text: '' },
            comments: {},
            newComment: {},
            loggedUser: { id: null, email: null, displayName: null, rol: null },
            tripDate: '',
            tripTime: '',
            tripType: 'revisar',
            options: [],
            isUpdating: false,
            description: '',
            showModal: false, // Controls the loader visibility
            availableOptions: [
                'Se permite fumar', 'Se permite la comida y bebida', 'Se permiten mascotas', 'No me gusta hablar mucho',
                'El baúl está vacío', 'Viajo hasta el destino sin paradas', 'Hay puertos USB para cargar'
            ],
            availableOptions: ['Se permite fumar', 'Se permite la comida y bebida', 'Se permiten mascotas', 'No me gusta hablar mucho', 'El baúl está vacío', 'Viajo hasta el destino sin paradas', 'Hay puertos USB para cargar'], // Доступные опции для checkbox
            optionIcons: {
                'Se permite fumar': `<svg width="35" height="35" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<rect width="25" height="25" fill="url(#pattern0_40_3365)"/>
<defs>
<pattern id="pattern0_40_3365" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_40_3365" transform="scale(0.02)"/>
</pattern>
<image id="image0_40_3365" width="50" height="50" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAACP0lEQVR4nO2YPWhUQRDHf6L4nUIQ0yiCCkoqI0ZEsBIUz0bQIxrQGAz4haDNWWiwECxEJWmstBALURQsNIgiSFIEEUMgiYUkld9WWmg8NT7ZMJFh2ZecFsnssT9YOGbncfPffW9mdiGRqBoWAeeBDvkdJYuBQSCT4cRExzzguRLhxiUi5KIn4iFQQ2QsBb4rEU+BOUTIGSWiDCwnUrqVkNtEzHsl5Hhgvh4YBr5JVrsMrMAgZSWkKTB/zUsEmYhqxRgfVIAnAvMHAkIy4DdQwBCPVHA9wIyAzzrgMHALGFX+LzDEEW+lj03iv8vzX4mhqv5WBeZW/NAkz/Qr/17gNLAEA2wDfnkrfRVYkON/J/DNfAb2YYA9wA8vuFfAxoBvS04CcLu5EwPskJXVwbmdOhtIAuslAdyVDDbu/waYiwFci9IVWO0bwOycZxo9XxO74pgJnPKKZQbczEnPjgHldwFjNADvPDF7K0gA1zGIe9U+qSDdyofYr3xMZK8Qbhf0rqzK8dsgwywLPSGu7kTLsBLiWvtoWSvVvnm6A0kkpohZQC1QB2yWtuIgUJLK7I649+Ry4iXwERgBHqjropLYHqv+KmSrmPnAMvkgt0jvcxRoA9qlT+oEngFDgcbwX8d2+d+vylaYwPaXTcA54IocN58AfcBruQjIpngUJa5KbWOsCRx6pnsU/0fIbgOBJyF6R1YDP6vh1ULOzdF/7JbT7xdl2zqBzVxBLEtBHD+7n5TA76viF7IlEolEIpGgWvgDsjPkn/sAlIEAAAAASUVORK5CYII="/>
</defs>
</svg>
`,
                'Se permite la comida y bebida': `<svg width="35" height="35" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<rect width="25" height="25" fill="url(#pattern0_40_3364)"/>
<defs>
<pattern id="pattern0_40_3364" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_40_3364" transform="scale(0.02)"/>
</pattern>
<image id="image0_40_3364" width="50" height="50" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADlElEQVR4nNWaW4gPURzHP7uLDZuUbJuV+yJyeSCXFNZ6cC8tK1KyD4u25L4lsopEIqxyi9I+KJcsDyRs7AMtyiaRZeWBXFuU21qro9/UMc5/Zv7/MzP6f+v3MvOb3zmfOWfO5XcG4lEmsBlYTpqrBGgT60oa67ZA1JPGmqy1xjzSWBcF4hnQjjTVIKBVQMpJYx0ViPdADmmqXOCrgGyNo8CxQB1wJ2R7qn3kjxL4bAsTZLdWYNymWiwjLJA8oFLG+LgA1ACwA5hOBNoSI8hbIlR5jCAP41oPtUVsN6IEmRIjyJkoQYbHCHJYyswGJgB9ZakfinrECLJdW8I41z4DtcAqoJcNSIcYQVRlkdYw3f8lk3RRqjDNMYEslvLaA/2BQmA1cBr46PK9DAxMFqQxJpBpPj2jBLiv+TcnO3neiglkVIC6jDCsBkqDglyQh67LSFIM1EifDROkj0dr9JPuttPw3A9gahCQ4/LAVcN29WWIIJ1d8dXOcb9U1O/ZD0B3PxDnLTQY7g0AXocA8cUQe12SMar8QNaLo3r7Jk0KoZu9MMS9lmSMFlm1J9RSrS8m2iectAS564qXkWJLr/ACmRUgkTbSEkTNC7pKU4xz1gtknOZY4OH3wAKkWmJkAfuAnyG17F8q0BwVVCIdtADZKzHyLFu2yaN+f7qT4zjbw2+lRQU2SoxhUYJkaGO5+vATaZFFBcokRmGUIEqvxHEDibXEogJzJcaCqEEaxHGXh0+yE5huE0PKEbwB8r1AnMnphIdPtUUFhkiMSkuQNuCbtKxRp8RJZdFNyrJcd+VqLXIlRavV9i3fgd6milaJgzqcMWmGBUSrvIgw1FPbCFaYHJwmV7lb06jmnD6lYu8IV/USd4/ppvMRfjLcW2PZp1UyO1V1kr2KY2Xa2YsaRf+RPixmu663WILc1OKdB4YGACgC7nksZR676mlM1Kl+2EUy9g69jZ2TMjKlYqqPj/GAmO/z8i55DcH6XrnOkNWwsSNSRjftWiKY+T4QvhNifogVd5tzsDPYdb1ZDpwcFQfoxr4g2RGCqNyV0njDPTW4bJJuHORb9AUh5O5kSszNCSFWUxAQ/fwvisScs6W2scb/magb7UpyRH7GUhMRiJNlNyXfkjX1PfmqIgKI51r8Y5axngT9yyhH25eEYWqFOtM1q6cSp1Uy9p45Lbc6AstkNXzIwtRfD+6lyNoknj8g+/yFchhl1G8pQTQCN3krrgAAAABJRU5ErkJggg=="/>
</defs>
</svg>
`,
                'Se permiten mascotas': `<svg width="35" height="35" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<rect width="25" height="25" fill="url(#pattern0_40_3368)"/>
<defs>
<pattern id="pattern0_40_3368" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_40_3368" transform="scale(0.02)"/>
</pattern>
<image id="image0_40_3368" width="50" height="50" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAACo0lEQVR4nO2ZTYhOURjHf8OQjyEpTT43xGIWksjCQsmUpKSsRAxKykemSExZjBIT3mJjg6yUha9SWGDGFBamyIakhoWvQaaUmfHq0VGn2z33nPve03mPur86m3ve57nP/73nPOd57oWSkpKSACwErgOfgCHgLXACmMR/wBrgCvBEBV9NGS+AyURMhyFwk5ijwGKggYhYBIzkEFLVRj/QBTQSATdqFFHVxqoYnsbvgiK+AlPqLeSch6fRQQS8LijicyxZ7EdBIe1Ewr4axXwHTgGjiYiTDoEPA9uBCURKs8o6NiFXiRhZFrccl9IOImUMcDnHnlhOhMwCHuTc3POICCnwNgNfashSzUTCAuB+gfNiagx74SDws+DB11RPEdIvvCwo4N8YVy8Ru4BfnkTIqMsJ3pUIYhuw1NB3SNG3B5gO3DSIkBImOMdSAtmtzR8AelXQPcBcba7HIORpaBHrDE1Sp6P9K4MQSRbBkJ7goyEQWVI2Jhr69v7Q/UZnxka95GA/HhhIsT1LQBqBDxlCtqrfPU5ZJvq12ym2sm+CsdqSOiUroQJekbDVrz1KsR0MmXqPW4TIvz7K4mO+ap7S7FsC6eCuw4F2OkOMFIR9GbZSaAbhjUXEgOrNpe5K45rFvuIz2CXAe+CdqqF0ssryZ8Bsi++KRYjXDX9Bc3wxMWd6cy6fAqY5+N5vEeJ1w5/XHN9LzJkCkGzmQpvDHmvxJeSQ5lTeeoy1CHmew/dGByGbfAlZlnC80yLkSA7f7Q5CKj777b7Eul2bIWRlDt9nHIR045HWlMLuoeHGc3L4dXmjMgisB2b6EnPY4abVnB8tbeeQPr4BM3yJ2aI6u6wbNtSYSFxGKx6RL0R7gTvqkEz253nY4ChgWL1i1TNmSUlJCX/5AysmYVtLwo7AAAAAAElFTkSuQmCC"/>
</defs>
</svg>
`,
                'No me gusta hablar mucho': `<svg width="35" height="35" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<rect width="25" height="25" fill="url(#pattern0_42_2183)"/>
<defs>
<pattern id="pattern0_42_2183" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_42_2183" transform="scale(0.02)"/>
</pattern>
<image id="image0_42_2183" width="50" height="50" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADwklEQVR4nO2aaahNURTHf3imDMksPkiZknkKkTEKTxniqdeT3qP0lOFRMpYPJCmEVz54MkSG0pOphGQmUyJjRMaUMfPRrnVqtzvjPefcc5N/rQ9n3732Xv+719p7rX0O/Me/i/nAPeCRJm+B95q8BB4Cp4FyoBBoTA5hCmBlKD+Ag0DXtEkoAz5FIGLLb2AP0DybxlcFJgIXgD8xkNDlJTA4GyT6A7djNt6UX8DUJEnMBX4mTMISUfNMSILEiiwRsDT5AnSKk8S0FEhYIreAvDhItJF/xkpRSuMgsidlEhbwNOqqtJT93coB6RuFSGkOELBEZkchsj0HCFgiK6MQOZ8DBCyR1VGIJH2Ch5H5UYhcCTHR64SJFEUhcijgJKeAOsDOBImMiEJkc4AJ7gONNJ0S4EMCRJpFITLDZ/CLLhOoqm8t8MrHFdVKbgHmAKOBjsB0Kbb0vi+IiC4uRqgaZCtQ20e/GtAdGAuMA/pJyqPc0Aujga/afEcyJTAAOOmSsl8FBpE8lhnzqvp/h6xaIBRJYeO0EmvIHha62KBWKt9PWbH97uHX80ifiCXZeOugu9RzYIixBadF5Ijc1LzT2tZ7KV/TOhZL24EcILJX2mZpbcpWV9zQOhYEJKImfABUAi1CGKr6HhbdBQGJTNTa7ngNvkvreBlo6EOkj+G7FSGIVBi6vX2INJUd025TBZ8rhhuD/zAu30wiY43+R0MQOWbojvEg8hH4ZvRX8euJLSF2rZpaqv8ZGBqCyDDRUbrnZKygu9Y6AqCKpAxO2exij9Nbz7dsTJE4WAq0c/hd6XSTMUwsd5j/jQR8KKjBewL7tYHU9hwUtRzOpHMSV0FQrukdkJo9L67E8WYIvSYubvFTYssPlzSdmcSADoYhyo2iELGD18kVbTQz0qTOxAT9fNmUIZGhkvjZzyqY3VCm9XsscRsLCrWBvwe8jzWJ1DECeLeLXl1Jj+x+TodlxqgOPNMGPy/vSMISKdGeT7jobTQyXS8XzAj5hmFrEyAyyLjZVG8AEsE2w7iyGIm0NUrjuw6HZGyobwS+KnkXZUhEvQGeDPSQmNPjQrlULxJGc8lYdSNVCVovAJFijy3ZFuVa48kSWsvS6wY8AUYahPXfa8v7R7+Xp6vIMhoAxx0MUb4/EGhltOdpyaIydp+4qZ046rGh0pusIk9uyc17KEu+fNCfa3jkdAVGmj6JlKCC9ayPy/jdZaniye67hBSh0ohR4m5mHPzyWBEbG1K6G/BEe6lpKuUjmrKAOteBM1Hvef+DHMBfMsKgum2yeKQAAAAASUVORK5CYII="/>
</defs>
</svg>
`,
                'El baúl está vacío': `<svg width="35" height="35" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<rect width="25" height="25" fill="url(#pattern0_42_2182)"/>
<defs>
<pattern id="pattern0_42_2182" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_42_2182" transform="scale(0.02)"/>
</pattern>
<image id="image0_42_2182" width="50" height="50" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAACIklEQVR4nO2YQUgUURjHf0WpYGlhYHvJWxQePNSlOuYhPFkdI1kPHcSwizfpICRCVy91aj1FJ/HiSQ8ipqAFaVIdAgmNiFQKxSJkY+Q/8YpxkZ03uzPw/eCxs7Pf/P/ve9/Me/MWDMMwDMMwjDTRBrwAvgDFMtt3YBLoqFYSt4GfMRKIao8qncR5YEfmI8C5GFqngQfAL+nlfXTwMjAObGm0F4F7wFEn5ggwJdNR/JGX5jbQGlds44CSjwHHFdOlc1+BJvzyTNorQH0coR5gAGgBGoC7qk5RJk1KoKjffBN0/q30C77FL6ncgfhHfU7qFkuCVscv71s8mBp/Szx4di6QLN3y2tUUXzbBw30DGASeAwvOVPuQylCQ3w9gBngK9AHtQO4wAheB5QMe+iWghspQD7wpseZsKMEnwB2gzr24GfiswFXgsWapK8AZqkNOVehTVYLOb0YktqrlY58RnZwGTpBucsB1oN+p3LdwwD/pxN/MMkINMOG8abCnL+HilyXa1Pc1nPstixxT3/eynsg//bdEUkLRKpLWiqzr4CrZ45o7/Q5HLP1zhxCZ87x3j+M7FK6Qw05lwnayhFhjAkmU47umJCJfal8qqLOE4C3FzOIP7769Cn6nEfifU8AHxQTbZF949w3K9FoXvAduai/foBEJxRY971MS8c05olHtFXDWYxKJ+tYC94F5/TGwrRmjN+EdY22VfA3DMAzDIC38AQjRG/UiMyBfAAAAAElFTkSuQmCC"/>
</defs>
</svg>

`,
                'Viajo hasta el destino sin paradas': `<svg width="35" height="35" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<rect width="25" height="25" fill="url(#pattern0_43_2189)"/>
<defs>
<pattern id="pattern0_43_2189" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_43_2189" transform="scale(0.02)"/>
</pattern>
<image id="image0_43_2189" width="50" height="50" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABsklEQVR4nO3Zu0oEMRTG8b+IsqtbeHkGsRZElEXFhzjY2Nn4CCv4ONpYyL6B4lZesBa0kMVeLEREMBJIMSxZnWTGJA754BR7mzM/kgkzG8jJyclpWtrADiCRqmvOoVLWgGdARa4ncy5emU4EoQqYlg9kBhgkAFCF0tPMK7PAeQIAZUpfMzQBI1UgKWHE5+Q7lteD/wgR4CixkRFfiP7xYcmR6ZZcCZeAfeAqNESVxFwDc449NOg9JET9IWYX+AoJUR4Y/fm8qYkfep2FhihHTL/wnp5Cx8Cipdd2DIhywFxYfnti6TUFvMWAqApL8+uYafYYC1J2ZEbrE5i09HuICfHBXFp6adhHbIgL5h5YtvTajHWxK0utlMDcmqV4NKcpQTYsx7AtAHfAQuE7ew49JBZk3MjcmJE5iHGLojwh4zAvjsdXKUDqegSQWJD1mh/OJBakX/PDmcSEqBoxEhtSF0ZSgNSBkRCQslUFIylBqmAkNYgvRlKE+GAkVYgrRnwg3UAQF8yWD6RtNldCYXq/3M4MfTd6MNtdKWCGwCoV0zLTLNTmZ8fyf7HeBszJycmhOfkGeuEXpaahp1sAAAAASUVORK5CYII="/>
</defs>
</svg>

`,
                'Hay puertos USB para cargar': `<svg width="35" height="35" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<rect width="25" height="25" fill="url(#pattern0_44_2193)"/>
<defs>
<pattern id="pattern0_44_2193" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_44_2193" transform="scale(0.02)"/>
</pattern>
<image id="image0_44_2193" width="50" height="50" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAACTUlEQVR4nO2Yv04UURTGf+CKhRITO5baQtCOlsJErQQb0ULhCYgIEv5YGAuDGJ8BCiS+BfgORtRohAoqGoQQsWDMSb5NJpOZdXbn3mWG3C85yZ0zc+beb87fXQg4X4gcy5khECF4xA9CaBFCyw/+Vz6L3u8YApGyeyQKnZ3gESc4N6EVUAb0AO+APQ+htQssaw/vWPZAIClvO0HEhyeSstcJIr5JRJ2qYHkPcgLMAXXJvHSVIzKfYrtQRSJ9KbZ9VSRST7HtryKRhRTbxSoSORGZujyxWNVkjwqKdwQitPYRvgGHEluvAw+Bi1XzSJQhP4AHVSDyBXgODAKXJbaeBrb0zCmwBHSXkYhVtEngQpO97d4z4K9slspGxEjcaeEMd0XGPDNaJiLmiTy4BIxpPRXLmbYKgI+caBZODXQBH2TzEqgBX3Vt1axlHDomYl82D17r+QPglnQz0hnBlrHpmMhAjj2fKB8sl27H9Df1ju/tELnvmEhv4qvfSOw3DPwRkfHEvV694zdt4o0HIpbEdn0EPJXuOrAv/auUcxQm0vDMhoOcsWaHGt96TL+iimTrVSV7EoVCyxU+6hDWseOYAI5jhD41+Z9rVs+scYZ4rENspZTfIWAH+AxczbCvaZhsu/zmRVYoNWBN7Jd0NnYkcU0/yLIwXbQhuiKCpthTjRs2duTFPRcjiksihvfS28GmFDJZqMkTToZG10S6YmQi5cyMKtIVia1fxEYSJ2O8L4wA2znKteWE93AqCgudR+onP9UcrU+ZJ2yeyvyp+w/qwKHmdmk1ZAAAAABJRU5ErkJggg=="/>
</defs>
</svg>

`,
            },
            tripType: 'revisar', // значение по умолчанию
            tripTypeIcons: {
                revisar: `<svg width="35" height="35" class="ml-3" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<rect width="35" height="35" fill="url(#pattern0_47_3305)"/>
<defs>
<pattern id="pattern0_47_3305" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_47_3305" transform="scale(0.02)"/>
</pattern>
<image id="image0_47_3305" width="50" height="50" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEJklEQVR4nO2ZW4hVZRTHf42j44WsMQ0nxCyTimIwKy+gSOFDOfSQYPaSgvpQEr0o6ouRWtDFQhE1BRF6iUSDhFC0wEy8pC8pKD4YmhXK5F0c1GZOLPhvWBzOPmd/+3KO4vzhg3P2Xt9a67ut77/Whl7cf3gCGMU9jmHATbWh3MN4Hiip2e+7Dk8DZ4FNOQ5kI9AJtFNHvJHQwaQDsYnpkdwM6oh+wHkZXpfDQFZLphPoT53xiYxfAwZnGMgA4KJkPqUBGAn8JwfezTCQeXrfrVDdEOyQE79nGMgRvf+RBuJ15+j4Cu9ty/2j9mCF9+2uf0cRDvYBtgO7gOFV5JqAQ7rwnouRaVGrhMeBK8B+6YrDNK26bcMgDAHuaKZOA09VkTUHHiI94gYZ4VVNlPnyAynwDnBbCi5UmfEiMQG4IR/+BsZkOQORoo8DV9QGPhWYqTZVz1oD9Hwl23ZnPUNGvAisAtqqyNjWehvYAJxwBziumcx6YFaNbdkGfJRlJZLiWWANcD2B83GtC/gGeIEGYBywt4JTJ0VZZiq02ow2q7Xp2VtajZMV+u+V7sIxVCy12xm/BHwBjE6hb7S27SWnr1s2LJcpBHZh/esMGsFbAAzMQfdA6ep0+i/mfUn20YGLVqFbe7qIjK9VZy7icD36b1szE4xi7HGzdCaGiuSN8bIV2d1ThWHXhIXFA07Zz8Cj1A+PADud/aO6n4LwsDhUpOTzGlyoKDQpkER+HJZvidC/bCVWpswg7fAeFDO4IZ3vAX0zJHElTXCiLHKz62SHPBTDNHNxF+ChlKF1hdOxpZbwAif8dcqt8GuC23xfyq26yel4vxrTjNjufm2PUMwKoCZ2w6eh/AfU33ydWC7QrMTFBP6qQRCrYXvAQLaltNEmSm86jpefuUXOgFH3tDgWMJC4PD8JOpyepT7djHKO75ywZYUfhIQ7V0hI0n4L0DscWAiMcM+2So9lj0/ag8/04ErZltqZYgtsDBhI0mDygGPaRo0iPCafSxoDkxXvy0uVS5zR6QmNvuxKn9WaybyUUOds16+8+GA+/1KLNvVz2d7pAJb7ZYKBGHVPgiGqF5QUrVKzi1fcDNe8hIQm3cRRFca3O8r9mxJuqR2u31gyYr1zZG5AP8uzP9Sh3KrfIbn3Emd3OTmgxUWjLq1S0ZjhVvQn5US5YJTLDq3QMIni0AHckq1zRaQOVha6LANXAyJZaFGwy9Wy7ANQIZio7yElpaOLc8pT+iqSldQ66/HNsV3h2GduSe+ESpgizhTpO6V6Wd3S0N1lYfXbgLNjq/iavon4C/T7mM8PhcLi/Bz3LdHP6Abt96je265PA/NFM86V9flTRb2GwkjlMtH/UmD7Q+dsEHcRmoE3axSye0T11yrMNqKgEYxBun8miEyOzKkq2YteUEf8D6V8uXcmN1bmAAAAAElFTkSuQmCC"/>
</defs>
</svg>`, // SVG иконка для типа "revisar"
                automaticomente: `<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-lightning" viewBox="0 0 16 16">
  <path d="M5.52.359A.5.5 0 0 1 6 0h4a.5.5 0 0 1 .474.658L8.694 6H12.5a.5.5 0 0 1 .395.807l-7 9a.5.5 0 0 1-.873-.454L6.823 9.5H3.5a.5.5 0 0 1-.48-.641zM6.374 1 4.168 8.5H7.5a.5.5 0 0 1 .478.647L6.78 13.04 11.478 7H8a.5.5 0 0 1-.474-.658L9.306 1z"/>
</svg>` // SVG иконка для типа "automaticomente"
            },
        };
    },
    setup() {
        const tripDate = ref('');
        const tripTime = ref('');
        const todayDate = new Date().toISOString().split('T')[0];
        const isToday = computed(() => tripDate.value === todayDate);
        const currentTime = new Date().toTimeString().slice(0, 5);

        return { tripDate, tripTime, todayDate, isToday, currentTime };
    },
    methods: {
        async handleSubmit() {
            try {
                this.isUpdating = true; // Show loader

                const selectedIcon = this.tripTypeIcons[this.tripType];
                const additionalData = {
                    date: this.tripDate,
                    time: this.tripTime,
                    type: { name: this.tripType, icon: selectedIcon },
                    options: this.options.map(option => ({ name: option, icon: this.optionIcons[option] })),
                    description: this.newMessage.text
                };

                if (!selectedIcon) {
                    console.error("Иконка для выбранного типа поездки отсутствует");
                    return;
                }

                await updateTrip(this.tripId, additionalData);

                // Show modal on success
                this.showModal = true;
            } catch (error) {
                console.error('Ошибка при обновлении поездки:', error);
            } finally {
                this.isUpdating = false; // Hide loader after completion
            }
        },
        confirmModal() {
            this.showModal = false;
            this.$router.push('/viajes'); // Redirect after modal confirmation
        }



        ,
        async handleCommentSubmit(messageId) {
            if (!this.newComment[messageId]?.trim()) {
                console.error("El texto del comentario está vacío");
                return;
            }

            await saveComment({
                viajeId: messageId,
                user_id: this.loggedUser.id,
                text: this.newComment[messageId],
                displayName: this.loggedUser.displayName || 'Anónimo',
                rol: this.loggedUser.rol,
            });

            this.newComment[messageId] = '';
            this.fetchComments(messageId);
        },
        fetchComments(messageId) {
            subscribeToComments(messageId, (comments) => {
                if (!this.comments[messageId]) {
                    this.comments[messageId] = [];
                }
                this.comments[messageId] = comments;
            });
        },
    },
    async mounted() {
        subscribeToChatMessages(newMessages => {
            this.messages = newMessages;
            this.messages.forEach(message => this.fetchComments(message.id));
        });
        unsubscribeAuth = subscribeToAuthState(newUserData => this.loggedUser = newUserData);
    },
    unmounted() {
        unsubscribeAuth();
    },
};
</script>

<style scoped>
.fixed {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>
