<template>
  <img :src="image" alt="" @error="handleErrorLoadImage">
</template>

<script>
export default {
  props: {
    image: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleErrorLoadImage(ev) {
      ev.target.src = '/404.svg'
    }
  },
}
</script>