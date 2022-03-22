<template>
  <div class="container">
    <h2 class="blue">v-show와 v-if</h2>
    <!-- v-show : 토글을 자주 할 때, 초기 랜더링 비용이 높다 -->
    <div v-show="toggle">true</div>
    <div v-show="!toggle">false</div>
    <!-- v-if :  --> 
    <div v-if="toggle">true</div>
    <div v-else>false</div>

    <button class="btn btn-primary" @click="onToggle">Toggle</button>
  </div>
</template>

<script>
export default {
  props: ['toggle'],
  setup(props, context) {
    const onToggle = () => {
      context.emit('change-toggle');
    };
    
    return {
      onToggle,
    }
  }
}
</script>

<style>

</style>