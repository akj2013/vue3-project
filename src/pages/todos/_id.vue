<template>
  <div>TodoDetail</div>
</template>

<script>
import { useRoute } from 'vue-router';

export default {
  setup() {
    const route = useRoute();
    console.log(route.params); // 안에 id가 들어있다.
    return {

    }
  }
}
</script>

<style>

</style>