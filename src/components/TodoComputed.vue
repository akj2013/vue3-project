<template>
  <div class="container">
    <h2 class="blue">Computed 사용</h2>
    <h4>count : {{ count }}</h4>
    <h4>double count : {{ doubleCount }}</h4>
    <h4>double count method : {{ doubleCountMethod() }}</h4>
    <button class="btn btn-primary" @click="count++">Add one</button>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  setup() {
    const count = ref(1);
    // computed : 매개변수를 받아올 수 없다. 캐시에 값을 저장해 둔다.
    // 두번을 사용해도 한 번만 계산하고 값을 갖고 있게 된다.
    const doubleCount = computed(() => {
      return count.value * 2;
    });

    const doubleCountMethod = () => {
      return count.value * 2;
    };
    return {
      count,
      doubleCount,
      doubleCountMethod,
    }
  }
}
</script>

<style>

</style>