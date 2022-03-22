<template>
    <!-- 입력 폼 -->
    <form @submit.prevent="onSubmit">
      <div class="d-flex">
        <div class="flex-grow-1 mr-2">
          <input class="form-control" type="text" v-model="todo" placeholder="Type new To do">
        </div>
        <div class="">
          <button type="submit" class="btn btn-primary">Add</button>
        </div>
      </div>

      <!-- 에러 메세지 표시 -->
      <div v-if="hasError" class="red">
        v-if : This field can not be empty! 
      </div>
      <div v-show="hasError" class="red">
        v-show : This field can not be empty! 
      </div>
    </form>
</template>

<script>
import { ref } from 'vue';

export default{
  emits: ['add-todo'],
    setup(props, { emit }) { // context : 자식 -> 부모 로 데이터 연동.
        const todo = ref('');
        const hasError = ref(false);

        const onSubmit = () => {
            // 공백 입력 시, 에러 메세지 표시한다.
            if (todo.value === '') {
                hasError.value = true;
            } else {
                // 부모 컴포넌트로 객체를 보내준다.
                emit('add-todo', {
                    id: Date.now(),
                    subject: todo.value,
                    completed: false,
                });
                // 에러 메세지 초기화.
                hasError.value = false;
                // input 입력칸 초기화.
                todo.value = '';
            }
        };

        return {
            todo,
            hasError,
            onSubmit,
        }
    },
}
</script>

<style>

</style>
