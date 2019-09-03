<template>
  <Index/>
</template>

<script>
// @ is an alias to /src
import Index from '@/components/Index.vue'

export default {
  name: 'home',
  components: {
    Index
  },
  created() {
    if (typeof localStorage.name === 'undefined') {
      localStorage.name = callSignGenerator();
    }

    function callSignGenerator() {
      let length = 5;
      return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
    }
  }
}
</script>
