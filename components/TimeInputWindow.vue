<template>
    <div class="flex flex-col justify-start">
      <span class="text-xl">{{ label }}</span>
      <div class="flex space-x-2">
        <input
          type="number"
          :value="hours"
          @input="$emit('update:hours', Number($event.target.value))"
          class="w-12 border border-emerald-200 bg-transparent rounded px-2 py-1 text-center focus:bg-emerald-200 focus:text-emerald-950 outline-none"
          placeholder="0"
          min="0"
          max="6"
        />
        <input
          type="number"
          :value="minutes"
          @input="$emit('update:minutes', Number($event.target.value))"
          class="w-12 border border-emerald-200 bg-transparent rounded px-2 py-1 text-center focus:bg-emerald-200 focus:text-emerald-950 outline-none"
          placeholder="0"
          min="0"
          max="59"
        />
        <input
          type="number"
          :value="seconds"
          @input="$emit('update:seconds', Number($event.target.value))"
          class="w-12 border border-emerald-200 bg-transparent rounded px-2 py-1 text-center focus:bg-emerald-200 focus:text-emerald-950 outline-none"
          placeholder="0"
          min="0"
          max="59"
        />
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      label: String,
      hours: { type: Number, default: 0 },
      minutes: { type: Number, default: 0 },
      seconds: { type: Number, default: 0 },
    },
  };
  </script>

<style scoped>
/* Chrome, Safari, Edge, Opera */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
