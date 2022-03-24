<template>
  <h1>TodoDetail 페이지</h1>
  <div v-if="loading">
    Loading...
  </div>
  <form
    v-else
    @submit.prevent="onSave"
  >
    <div class="row">
      <!-- Subject -->
      <div class="col-6">
        <div class="form-group">
          <label>Todo Subject</label>
          <input v-model="todo.subject" type="text" class="form-control">
        </div>
      </div>
      <!-- Completed -->
      <div class="col-6">
        <div class="form-group">
          <label>Todo completed</label>
          <div>
            <!-- class 바인딩 -->
            <!-- type이 button이면 form에 대한 submit을 하지 않는다. @click.stop으로도 안 먹힌다. -->
            <button class="btn" :class="todo.completed ? 'btn-success' : 'btn-danger'"
              type="button" 
              @click="toggleTodoStatus"
            >
              {{ todo.completed ? 'Completed' : 'Incompleted'}}
            </button>
          </div>
        </div>
      </div>
    </div>
    <button
      class="btn btn-primary" type="submit"
      :disabled="!todoUpdated"
    >
      Save
    </button>
    <button
      class="btn btn-secondary" style="float: right" type="submit"
      @click="moveToListPage"
    >
      Back
    </button>
  </form>
</template>

<script>
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { ref, computed } from 'vue';
import _ from 'lodash';

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const todo = ref(null);
    const originTodo = ref(null);
    const loading = ref(true);
    const todoId = route.params.id;

    // 1개 검색
    const getTodo = async () => {
      const response = await axios.get(`http://localhost:3000/todos/${todoId}`);
      todo.value = {...response.data}; // 스프레드 오퍼레이터 : 새로운 객체
      originTodo.value = {...response.data};
      // 데이터가 들어오면 로딩을 false로 변환.
      loading.value = false;
    }
    // 함수 호출
    getTodo();
    const todoUpdated = computed(() => {
      return !_.isEqual(todo.value, originTodo.value);
    })

    // completed 버튼 함수
    const toggleTodoStatus = () => {
      todo.value.completed = !todo.value.completed;
    }
    // 되돌아가기 버튼
    const moveToListPage = () => {
      router.push({
        name: 'Todos'
      });
    }
    // 저장 버튼
    const onSave = async () => {
      const res = await axios.put(`http://localhost:3000/todos/${todoId}`, {
        subject: todo.value.subject, // value 쓰기 싫으면 reactive 써라.
        completed: todo.value.completed
      });
      // 저장 후에는 다시 origin도 변경.
      originTodo.value = {...res.data};
    }
    return {
      todo,
      loading,
      toggleTodoStatus,
      moveToListPage,
      onSave,
      todoUpdated,
    };
  }
}
</script>

<style>

</style>