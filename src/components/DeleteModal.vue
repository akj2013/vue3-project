<template>
  <Modal>
      <!-- slot으로 들어간다. -->
      <template #title>Delete Todo!!!</template>
      <template #body>정말로 삭제하시겠습니까?{{todoDeleteId}}</template>
      <template #footer>
          <button @click="onClose" type="button" class="btn btn-secondary">Close</button>
          <button @click="onDelete" type="button" class="btn btn-danger">Delete</button>
      </template>
  </Modal>
</template>

<script>
import Modal from '@/components/Modal.vue';
export default {
  components: {
    Modal,
  },
  props: {
    todoDeleteId: {
      type: Number,
    }
  },
  setup(props, { emit }) {
    const onClose = () => {
      emit('close');
    };
    const onDelete = () => {
      emit('delete');
    };
    return {
      onClose,
      onDelete,
    }
  }
}
</script>

<style>

</style>