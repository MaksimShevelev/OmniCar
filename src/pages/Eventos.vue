<template>
          <div class="absolute inset-0 -z-10 transform-gpu blur-3xl opacity-20" aria-hidden="true">
            <div class="aspect-[1097/845] w-full h-full bg-gradient-to-tr from-[#239e61] to-[#1d7e4b]"
                style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
            ></div>
        </div>
      <div class="mx-auto max-w-4xl text-center mt-4 mb-10">
      <h1 class=" text-balance text-3xl font-semibold tracking-tight text-gray-900 sm:text-3xl">Viajes por eventos</h1>
    </div>
    <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow mt-2 mb-40">
      <div class="flex items-center justify-between mb-4">
        <button @click="previousMonth" class="text-gray-500 hover:text-gray-700">&lt;</button>
        <h2 class="text-lg font-bold">{{ currentMonthName }} {{ currentYear }}</h2>
        <button @click="nextMonth" class="text-gray-500 hover:text-gray-700">&gt;</button>
      </div>
  
      <div class="grid grid-cols-7 gap-y-2 text-center text-gray-600 mb-2">
        <span v-for="day in daysOfWeek" :key="day">{{ day }}</span>
      </div>
  
      <div class="grid grid-cols-7 gap-1">
        <div
          v-for="(day, index) in monthDays"
          :key="index"
          class="border border-transparent p-2 rounded-lg hover:bg-gray-100"
          @click="addEvent(day)"
        >
          <div :class="['font-bold', { 'text-gray-300': !day.isCurrentMonth }]">
            {{ day.date }}
          </div>
          <div class="text-xs text-gray-600 mt-1" v-if="day.events.length">
            <div v-for="(event, i) in day.events" :key="i" class="truncate">{{ event }}</div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        daysOfWeek: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
        currentMonth: new Date().getMonth(),
        currentYear: new Date().getFullYear(),
        events: {},
      };
    },
    computed: {
      currentMonthName() {
        return new Date(this.currentYear, this.currentMonth).toLocaleString("es-ES", { month: "long" });
      },
      monthDays() {
        const days = [];
        const firstDay = new Date(this.currentYear, this.currentMonth, 1);
        const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
        const totalDays = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
  
        for (let i = 0; i < startDay; i++) {
          days.push({ date: "", isCurrentMonth: false, events: [] });
        }
  
        for (let i = 1; i <= totalDays; i++) {
          const dayKey = `${this.currentYear}-${this.currentMonth}-${i}`;
          days.push({
            date: i,
            isCurrentMonth: true,
            events: this.events[dayKey] || [],
          });
        }
  
        return days;
      },
    },
    methods: {
      previousMonth() {
        if (this.currentMonth === 0) {
          this.currentMonth = 11;
          this.currentYear -= 1;
        } else {
          this.currentMonth -= 1;
        }
      },
      nextMonth() {
        if (this.currentMonth === 11) {
          this.currentMonth = 0;
          this.currentYear += 1;
        } else {
          this.currentMonth += 1;
        }
      },
      addEvent(day) {
        if (!day.isCurrentMonth || !day.date) return;
  
        const event = prompt("Agrega un evento:");
        if (event) {
          const dayKey = `${this.currentYear}-${this.currentMonth}-${day.date}`;
          if (!this.events[dayKey]) {
            this.$set(this.events, dayKey, []);
          }
          this.events[dayKey].push(event);
        }
      },
    },
  };
  </script>
  

  
