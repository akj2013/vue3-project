<template>
  <!-- 위로부터 item를 props로 받아서 Loop를 돌린다. -->
  <div
    v-for="(item, index) in items"
    :key="item.id"
    class="card mt-2"
  >
    <!--
      props로 받은 데이터를 Loop돌리면 각 item과 index가 생기므로,
      item을 위로 올려보내준다. 
      index를 위로 올려보내준다.
    -->
    <slot :item="item" :index="index"></slot> 
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true
    }
  }
}
</script>

<style>

</style>