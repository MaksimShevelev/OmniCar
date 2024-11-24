<template>
    <div class="flex flex-col h-screen">

        <!-- Header -->
        <header class="top-0 left-0 right-0 bg-custom-green-dark p-8 text-white flex items-center justify-center relative rounded-b-lg shadow-lg z-20">
                <!-- Кнопка меню слева -->
                <Popover class="absolute left-0 z-20 ml-4">
    <PopoverButton
      class="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-custom-green text-white border border-white hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 16 16">
        <path fill-rule="evenodd"
          d="M1 2a1 1 0 0 1 1-1h12a1 1 0 0 1 0 2H2a1 1 0 0 1-1-1zM1 8a1 1 0 0 1 1-1h12a1 1 0 0 1 0 2H2a1 1 0 0 1-1-1zM1 14a1 1 0 0 1 1-1h12a1 1 0 0 1 0 2H2a1 1 0 0 1-1-1z" />
      </svg>
    </PopoverButton>
                <transition enter-active-class="transition ease-out duration-200"
                    enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 translate-y-1">
                    <PopoverPanel class="absolute left-0 z-10 mt-5 flex w-screen max-w-max px-4">
                        <div
                            class="w-64 flex-auto overflow-hidden rounded-3xl bg-white text-sm shadow-lg ring-1 ring-gray-900/5">
                            <div class="flex flex-col w-64 bg-white text-white">
                            


     

                                <nav class="flex-1 px-2 py-4 space-y-2 border-t border-gray-300">
                                    <BaseHeading1>
                                        <h6 class="mb-3 text-center text-black">{{ loggedUser.displayName || 'Sin especificar' }}</h6>
                                        
                                    </BaseHeading1>
                                    <div class="scale-75"> <ProfileData :user="loggedUser" /></div>
                                    
                                    <router-link
                                        class="flex items-center justify-between px-4 py-2 text-gray-900 hover:bg-custom-green hover:text-white rounded-md border-b border-gray-300"
                                        to="/home">
                                        <span>Home</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-house" viewBox="0 0 16 16">
                                            <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z" />
                                        </svg>
                                    </router-link>

                                    <template v-if="loggedUser.id === null">
                                        <router-link
                                            class="flex items-center justify-between px-4 py-2 text-gray-900 hover:bg-custom-green hover:text-white rounded-md border-b border-gray-300"
                                            to="/iniciar-sesion"> 
                                            <span>Iniciar sesión</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-box-arrow-in-right" viewBox="0 0 16 16">
                                                <path fill-rule="evenodd"
                                                    d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z" />
                                                <path fill-rule="evenodd"
                                                    d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
                                            </svg>
                                        </router-link>
                                    </template>

                                    <template v-else>
                                        <router-link
                                            class="flex items-center justify-between px-4 py-2 text-gray-900 hover:bg-custom-green hover:text-white rounded-md border-b border-gray-300"
                                            to="/mi-perfil">
                                            <span>Mi perfíl</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                                                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                                <path fill-rule="evenodd"
                                                    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                                            </svg>
                                        </router-link>
                                        <router-link
                                        class="flex items-center justify-between px-4 py-2 text-gray-900 hover:bg-custom-green hover:text-white rounded-md border-b border-gray-300"
                                        to="/mis-viajes">
                                        <span>Mis viajes</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-person-lines-fill" viewBox="0 0 16 16">
  <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z"/>
</svg>

                                    </router-link>
                                        <router-link
                                        class="flex items-center justify-between px-4 py-2 text-gray-900 hover:bg-custom-green hover:text-white rounded-md border-b border-gray-300"
                                        to="/home">
                                        <span>Canjear cupón</span>
                                        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<rect width="16" height="16" fill="url(#pattern0_37_3298)"/>
<defs>
<pattern id="pattern0_37_3298" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_37_3298" transform="scale(0.0111111)"/>
</pattern>
<image id="image0_37_3298" width="90" height="90" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAAER0lEQVR4nO2cXYgWVRjHf6bblpFEVoJW9HVh0EWYYeCFolJBF3WR5YVEhRjEukFFKEZ5YSSBoKKCX9EXQRGpeRldRKAtFX1gIqWQSVkhiq4fpK0TJ44xHc4z78y77Tvn3fn/YO6eOXPe3zz7zDlnzg4IIYQQQgghhBBCCCGEaMFlwDPAAHAKyHSQeRefA/1A73Cz6HrgW4mlVXJ94121ncmSTCXZbWW2KxcqE1RysKQd0a4mSzSVHOxpR/SgRFM10ZyzyiibacuBRNOZ5JFoJJrRVKaU0Ug0dWehMpr6xY2K0vEH8AbQBzwKPAYsBz4B/kpAWteLPgcsA8YXXP924OOK7a4BbjEOdyMvNEn0WWBuyT6MBV4v2e4RYILRzpXAj03L6Kcr9uNS4IsS7T5Z0MZbHZKcjOgDPkurMq9Fu18BlxjnPtJBycmIfsG4lqufB/1DcJIRc9Bo09XdmcY5twInmyj6bqN+5mVsNPqzzWjzXSO+p6al3iREXxO5zpwgZp/Rnxcj7Z0GbjDiV9UgORnRPZHrzA9ifjf60xdp7+WCmj7UZNETS2T090Z/lgdxh4DLI3HXAr/WJDkZ0dOMGp1/m7PO6M+WoC33AA0ZA+yqUXIyop8zrrUA+MmPOlxGxshPOD7zUkP6a5acjOh9BePdImbl2nC1d3ok5g7gjERTagYXYxywO3f+1kjMeH8T687mZDI680Mya4IR4rJ/Q+7cE8aEZnMCgpMTnfmFpX6/jmFxE/BRcN7zkbiHE5CbrOjMHz8D6/069P3Ag36H1E7gzyD268iNuRE4loDc5EVnFcqNW5/OM9aPPvJx7ubs8Fuz3E27D1gIrPWjGommWMJTkURYHMTs8uXGoscv0Y70yKRrM3p7pG8T/FT9YszmCsPGGSO8z7srRf9iLETlF4wGjDWUIh6XaP4zMXGLQyE3+1HLxbhYTCvcrPI7ZTT/CHzNkPReMGqJMcVn+lFfy2M8K9HwpTHGnhm8yX7bkLgpF+MefldFYqY1vUafAqYaf+7hG5OVRt/3B3Gxt+4Tmy56kdGfhZHYpUZsfkSS+ZcLIT1NFv2B0Re3aHQ4Ev+qEb83iJsdibmuqaIPA1cbfXnJOMc9GGOszsUcN97E3NNE0UNG1jkmF0wwfjMmKu7h96H/970HjHaXNVH0KwX9eLPFuQ+18dvcOskPTRM9UDCzu6vE2+y9LTZLdvp/KJMUPQjcVtCHT0u2836Lte0890aWYEe96BUF22yfqNiWWzK9s+D3XOEfqudH+DclKTr7n48hL3yFXzha4N/kvOOn453oQyNEZwkcEo1EU3cWKqOpX5xKB/VLVY1Goqk745LLaH0YhcqS3Za1yuhTP3TmUz8p7DXOuuxw//5RmV7/ibG6O591yRHbG1ga99E8yaaUZLfFYVj0+k2Drv7oAcm/cgf9Bvm+4WSyEEIIIYQQQgghhBBC0Az+BguW6hz9vkjSAAAAAElFTkSuQmCC"/>
</defs>
</svg>

                                    </router-link>
                                    <router-link
                                        class="flex items-center justify-between px-4 py-2 text-gray-900 hover:bg-custom-green hover:text-white rounded-md border-b border-gray-300"
                                        to="/home">
                                        <span>Invitar amigos</span>
                                        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.99345 7.86138C4.91852 8.21792 4.68809 8.52229 4.36525 8.69114C4.01123 8.8763 3.58897 8.8763 3.23495 8.69114C2.9121 8.52229 2.68167 8.21792 2.60674 7.86138L2.58076 7.73776C2.50364 7.3708 2.5864 6.98837 2.80833 6.68613L2.85041 6.62882C3.07239 6.32651 3.42504 6.14795 3.8001 6.14795C4.17515 6.14795 4.5278 6.32651 4.74979 6.62882L4.79186 6.68613C5.01379 6.98837 5.09655 7.3708 5.01943 7.73776L4.99345 7.86138Z" fill="white"/>
<path d="M1.6001 11.2267C1.6001 11.4329 1.76725 11.6001 1.97343 11.6001H4.26223C4.40939 10.9462 4.80977 10.3747 5.37511 10.0131C5.27336 9.9405 5.1614 9.88 5.0409 9.83402L4.95653 9.80182C4.21177 9.51761 3.38843 9.51761 2.64366 9.80182L2.55929 9.83402C1.9817 10.0544 1.6001 10.6085 1.6001 11.2267Z" fill="white"/>
<path d="M14.0268 11.6001H11.738C11.5908 10.9463 11.1905 10.3747 10.6251 10.0131C10.7269 9.94053 10.8388 9.88004 10.9593 9.83406L11.0437 9.80186C11.7884 9.51765 12.6118 9.51765 13.3565 9.80186L13.4409 9.83406C14.0185 10.0545 14.4001 10.6085 14.4001 11.2268C14.4001 11.433 14.233 11.6001 14.0268 11.6001Z" fill="white"/>
<path d="M11.0067 7.86142C11.0817 8.21797 11.3121 8.52233 11.6349 8.69118C11.989 8.87634 12.4112 8.87634 12.7652 8.69118C13.0881 8.52233 13.3185 8.21797 13.3935 7.86142L13.4194 7.7378C13.4966 7.37085 13.4138 6.98841 13.1919 6.68617L13.1498 6.62886C12.9278 6.32655 12.5752 6.14799 12.2001 6.14799C11.825 6.14799 11.4724 6.32655 11.2504 6.62886L11.2083 6.68617C10.9864 6.98841 10.9036 7.37085 10.9808 7.7378L11.0067 7.86142Z" fill="white"/>
<path d="M11.1601 12.8001H4.8401C4.48664 12.8001 4.2001 12.5136 4.2001 12.1601C4.2001 11.1008 4.85536 10.1519 5.846 9.77672L6.01231 9.71373C7.29311 9.22864 8.70709 9.22864 9.98788 9.71373L10.1542 9.77672C11.1448 10.1519 11.8001 11.1008 11.8001 12.1601C11.8001 12.5136 11.5136 12.8001 11.1601 12.8001Z" fill="white"/>
<path d="M7.02836 7.81568C7.63759 8.13192 8.3626 8.13192 8.97183 7.81568C9.53217 7.52482 9.93275 6.99824 10.0635 6.3806L10.1045 6.18729C10.2387 5.55333 10.0949 4.89224 9.70952 4.3713L9.64346 4.28201C9.25797 3.76097 8.64823 3.45361 8.0001 3.45361C7.35196 3.45361 6.74222 3.76097 6.35674 4.28201L6.29068 4.3713C5.90526 4.89224 5.76149 5.55333 5.89573 6.18729L5.93666 6.3806C6.06744 6.99824 6.46802 7.52482 7.02836 7.81568Z" fill="white"/>
<path d="M4.99345 7.86138C4.91852 8.21792 4.68809 8.52229 4.36525 8.69114C4.01123 8.8763 3.58897 8.8763 3.23495 8.69114C2.9121 8.52229 2.68167 8.21792 2.60674 7.86138L2.58076 7.73776C2.50364 7.3708 2.5864 6.98837 2.80833 6.68613L2.85041 6.62882C3.07239 6.32651 3.42504 6.14795 3.8001 6.14795C4.17515 6.14795 4.5278 6.32651 4.74979 6.62882L4.79186 6.68613C5.01379 6.98837 5.09655 7.3708 5.01943 7.73776L4.99345 7.86138Z" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M1.6001 11.2267C1.6001 11.4329 1.76725 11.6001 1.97343 11.6001H4.26223C4.40939 10.9462 4.80977 10.3747 5.37511 10.0131C5.27336 9.9405 5.1614 9.88 5.0409 9.83402L4.95653 9.80182C4.21177 9.51761 3.38843 9.51761 2.64366 9.80182L2.55929 9.83402C1.9817 10.0544 1.6001 10.6085 1.6001 11.2267Z" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14.0268 11.6001H11.738C11.5908 10.9463 11.1905 10.3747 10.6251 10.0131C10.7269 9.94053 10.8388 9.88004 10.9593 9.83406L11.0437 9.80186C11.7884 9.51765 12.6118 9.51765 13.3565 9.80186L13.4409 9.83406C14.0185 10.0545 14.4001 10.6085 14.4001 11.2268C14.4001 11.433 14.233 11.6001 14.0268 11.6001Z" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11.0067 7.86142C11.0817 8.21797 11.3121 8.52233 11.6349 8.69118C11.989 8.87634 12.4112 8.87634 12.7652 8.69118C13.0881 8.52233 13.3185 8.21797 13.3935 7.86142L13.4194 7.7378C13.4966 7.37085 13.4138 6.98841 13.1919 6.68617L13.1498 6.62886C12.9278 6.32655 12.5752 6.14799 12.2001 6.14799C11.825 6.14799 11.4724 6.32655 11.2504 6.62886L11.2083 6.68617C10.9864 6.98841 10.9036 7.37085 10.9808 7.7378L11.0067 7.86142Z" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11.1601 12.8001H4.8401C4.48664 12.8001 4.2001 12.5136 4.2001 12.1601C4.2001 11.1008 4.85536 10.1519 5.846 9.77672L6.01231 9.71373C7.29311 9.22864 8.70709 9.22864 9.98788 9.71373L10.1542 9.77672C11.1448 10.1519 11.8001 11.1008 11.8001 12.1601C11.8001 12.5136 11.5136 12.8001 11.1601 12.8001Z" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7.02836 7.81568C7.63759 8.13192 8.3626 8.13192 8.97183 7.81568C9.53217 7.52482 9.93275 6.99824 10.0635 6.3806L10.1045 6.18729C10.2387 5.55333 10.0949 4.89224 9.70952 4.3713L9.64346 4.28201C9.25797 3.76097 8.64823 3.45361 8.0001 3.45361C7.35196 3.45361 6.74222 3.76097 6.35674 4.28201L6.29068 4.3713C5.90526 4.89224 5.76149 5.55333 5.89573 6.18729L5.93666 6.3806C6.06744 6.99824 6.46802 7.52482 7.02836 7.81568Z" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

                                    </router-link>
                                    <router-link
                                        class="flex items-center justify-between px-4 py-2 text-gray-900 hover:bg-custom-green hover:text-white rounded-md border-b border-gray-300"
                                        to="/home">
                                        <span>Soporte</span>
                                        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.9999 2.3999L8.6269 2.43511L9.24602 2.54031L9.84947 2.71416L10.4297 2.95448L10.9793 3.25825L11.4914 3.62165L11.9597 4.0401L12.3782 4.50836L12.7416 5.02052L13.0453 5.57015L13.2856 6.15034L13.4595 6.75379L13.5647 7.3729L13.5999 7.9999L13.5647 8.6269L13.4595 9.24602L13.2856 9.84947L13.0453 10.4297L12.7416 10.9793L12.3782 11.4914L11.9597 11.9597L11.4914 12.3782L10.9793 12.7416L10.4297 13.0453L9.84947 13.2856L9.24602 13.4595L8.6269 13.5647L7.9999 13.5999L7.3729 13.5647L6.75379 13.4595L6.15034 13.2856L5.57015 13.0453L5.02052 12.7416L4.50836 12.3782L4.0401 11.9597L3.62165 11.4914L3.25825 10.9793L2.95448 10.4297L2.71416 9.84947L2.54031 9.24602L2.43511 8.6269L2.3999 7.9999L2.43511 7.3729L2.54031 6.75379L2.71416 6.15034L2.95448 5.57015L3.25825 5.02052L3.62165 4.50836L4.0401 4.0401L4.50836 3.62165L5.02052 3.25825L5.57015 2.95448L6.15034 2.71416L6.75379 2.54031L7.3729 2.43511L7.9999 2.3999Z" fill="white"/>
<path d="M7.9999 9.2799V9.20384C7.9999 8.73712 8.24584 8.30494 8.64709 8.06655L8.99491 7.8599C9.494 7.56339 9.7999 7.02583 9.7999 6.44531C9.7999 5.53658 9.06323 4.7999 8.15449 4.7999H7.9999C7.00579 4.7999 6.1999 5.60579 6.1999 6.5999V6.70154M7.9999 10.7199V11.0399M7.9999 2.3999L8.6269 2.43511L9.24602 2.54031L9.84947 2.71416L10.4297 2.95448L10.9793 3.25825L11.4914 3.62165L11.9597 4.0401L12.3782 4.50836L12.7416 5.02052L13.0453 5.57015L13.2856 6.15034L13.4595 6.75379L13.5647 7.3729L13.5999 7.9999L13.5647 8.6269L13.4595 9.24602L13.2856 9.84947L13.0453 10.4297L12.7416 10.9793L12.3782 11.4914L11.9597 11.9597L11.4914 12.3782L10.9793 12.7416L10.4297 13.0453L9.84947 13.2856L9.24602 13.4595L8.6269 13.5647L7.9999 13.5999L7.3729 13.5647L6.75379 13.4595L6.15034 13.2856L5.57015 13.0453L5.02052 12.7416L4.50836 12.3782L4.0401 11.9597L3.62165 11.4914L3.25825 10.9793L2.95448 10.4297L2.71416 9.84947L2.54031 9.24602L2.43511 8.6269L2.3999 7.9999L2.43511 7.3729L2.54031 6.75379L2.71416 6.15034L2.95448 5.57015L3.25825 5.02052L3.62165 4.50836L4.0401 4.0401L4.50836 3.62165L5.02052 3.25825L5.57015 2.95448L6.15034 2.71416L6.75379 2.54031L7.3729 2.43511L7.9999 2.3999Z" stroke="#141414" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

                                    </router-link>
                                        

                                        <form @submit.prevent="handleLogout"
                                            class="flex items-center justify-between px-4 py-2 text-gray-900 hover:bg-custom-green hover:text-white rounded-md border-b border-gray-300">
                                            <button type="submit" class="flex items-center justify-between w-full">
    <span >Cerrar sesión</span>
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z" />
        <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
    </svg>
</button>

                                        </form>


                                    </template>
                                </nav>
                            </div>
                        </div>
                    </PopoverPanel>
                </transition>
            </Popover>

                <!-- Кнопка колокольчика справа с выпадающим меню -->

        <Popover class="absolute right-0 z-20 mr-4">
    <PopoverButton
      class="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-custom-green text-white border border-white hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-bell-fill"
        viewBox="0 0 16 16">
        <path
          d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
      </svg>
    </PopoverButton>


        <transition enter-active-class="transition ease-out duration-200"
                    enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 translate-y-1">
            <PopoverPanel class="absolute right-0 z-10 mt-5 flex w-64 px-4">
                <div class="w-full flex-auto overflow-hidden rounded-3xl bg-white text-sm shadow-lg ring-1 ring-gray-900/5">
                    <div class="flex flex-col w-full bg-white text-gray-900 p-4">
                        <h2>Notificaciones</h2>

                    </div>
                </div>
            </PopoverPanel>
        </transition>
    </Popover>


        </header>

        <!-- Main Content -->
                            <main class="container p-2 flex-1 mx-auto">
                                <router-view />
                            </main>
                            <footer class="fixed bottom-0 left-0 right-0 pt-4 pb-2 z-11 bg-custom-green-dark text-white flex justify-around items-center h-20 rounded-t-lg mt-4">
                        <router-link to="/buscar" class="footer-link text-center rounded-t-lg text-white hover:text-gray-900 hover:bg-green-400 pt-3 pb-3 pl-5 pr-5 flex flex-col items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                            </svg>
                            <span class="pt-2">Buscar</span>
                        </router-link>
                        
                        <router-link to="/crear" class="footer-link text-center rounded-t-lg text-white hover:text-gray-900 hover:bg-green-400 pt-3 pb-3 pl-5 pr-5 flex flex-col items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                            </svg>
                            <span class="pt-2">Crear</span>
                        </router-link>
                        
                        <router-link to="/eventos" class="footer-link text-center rounded-t-lg text-white hover:text-gray-900 hover:bg-green-400 pt-3 pb-3 pl-5 pr-5 flex flex-col items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" fill="currentColor" class="bi bi-calendar2-heart" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4zM1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm2 .5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V4a.5.5 0 0 0-.5-.5zm5 4.493c1.664-1.711 5.825 1.283 0 5.132-5.825-3.85-1.664-6.843 0-5.132"/>
                    </svg>
                            <span class="pt-2">Eventos</span>
                        </router-link>
                        
                        <router-link to="/viajes" class="footer-link text-center rounded-t-lg text-white hover:text-gray-900 hover:bg-green-400 pt-3 pb-3 pl-5 pr-5 flex flex-col items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" fill="currentColor" class="bi bi-card-list" viewBox="0 0 16 16">
                    <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"/>
                    <path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8m0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/>
                    </svg>

                            <span class="pt-2">Viajes</span>
                        </router-link>
                        
                        <router-link to="/chats" class="footer-link text-center rounded-t-lg text-white hover:text-gray-900 hover:bg-green-400 pt-3 pb-3 pl-5 pr-5 flex flex-col items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" fill="currentColor" class="bi bi-chat-left-text" viewBox="0 0 16 16">
                    <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                    <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6m0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/>
                    </svg>
                            <span class="pt-1">Chat</span>
                        </router-link>
                    </footer>


    </div>
</template>

<script setup>
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { logout, subscribeToAuthState } from './services/auth'
import { ref } from 'vue'


const loggedUser = ref({
    id: null,
    email: null,
    displayName: 'Guest'
})

function handleLogout() {
    logout()
    loggedUser.value = { id: null, email: null, displayName: 'Guest' }
}

subscribeToAuthState((newUserData) => {
    loggedUser.value = newUserData
})
</script>


<script>
import BaseHeading1 from './components/BaseHeading1.vue';
import ProfileData from './components/profile/ProfileData.vue';


export default {
    name: 'App',
    components: { BaseHeading1, ProfileData },
    data() {
        return {
            loggedUser: {
                id: null,
                displayName: null,
                photoURL: null,
            },
        }
    }
}
</script>


<style scoped>
/* Добавьте любые дополнительные стили, если необходимо */
.border-custom-green {
    border-color: #239e61; /* Цвет, который вы указали ранее */
}


header {
  display: flex;
  justify-content: center;
  position: relative; /* Для абсолютного позиционирования кнопок */
}

header .absolute.left-0 {
  left: 0;
}

header .absolute.right-0 {
  right: 0;
}


</style>
