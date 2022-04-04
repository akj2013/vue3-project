<template>
  <div>Home Page</div>
  <div>{{count}}</div>
  <button @click="count++">
    reactive를 잃지 않는 toRefs
  </button>
</template>

<script>
import { useCount } from '@/composables/count'; // .js는 생략가능
export default {
  setup() {
    // count를 구조분해 하여 사용한다.
    // count를 구조분해하면 reactive를 잃게 된다.
    const { count } = useCount();
    return {
      count
    }
  }
}
</script>

<style>

</style>