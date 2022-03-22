<template>
  <div class="container">
    <h2 class="blue">To-Do List</h2>
    <input class="form-control" type="text" v-model="searchText" placeholder="Search">
    <hr>
    <!-- 입력 컴포넌트 -->
    <TodoSimpleForm @add-todo="addTodo"></TodoSimpleForm>
    <!-- todo추가 시 에러 메세지 -->
    <div class="red">{{ error }}</div>
    <!-- todo가 없을 때 경고 메세지 -->
    <div v-if="!todos.length" class="mt-4 red">추가된 TODO가 없습니다.</div>
    <!-- 검색 결과가 없을 때 경고 메세지 -->
    <div v-if="!filteredTodos.length && todos.length" class="mt-4 red">표시할 TODO가 없습니다.</div>
    <!-- todo 반복문 -->
    <TodoList :todos="filteredTodos" :numberOfPages="numberOfPages" :currentPage="currentPage" @toggle-todo="toggleTodo" @delete-todo="deleteTodo" @get-todos="getTodos" />
  </div>
  <div class="container align-items-center">
    <hr>
    <input :checked="showIf" @change="toggleShowIf()" type="checkbox" class="form-check-input">
    <span class="label label-default" style="padding-left: 10px;">SHOWIF</span>
    <TodoShowIf v-if="showIf" :toggle="toggle" @change-toggle="changeToggle" />
    <hr>
    <input :checked="showComputed" @change="toggleComputed()" type="checkbox" class="form-check-input">
    <label class="form-check-label" style="padding-left: 10px;">Computed 사용</label>
    <TodoComputed v-if="showComputed" />
  </div>
</template>

<script>
import { ref, computed } from 'vue'; // 데이터 연동

import TodoSimpleForm from './components/TodoSimpleForm.vue';
import TodoList from './components/TodoList.vue';
import TodoShowIf from './components/TodoShowIf.vue';
import TodoComputed from './components/TodoComputed.vue';

import axios from 'axios';

export default {
  components: {
    TodoSimpleForm,
    TodoList,
    TodoShowIf,
    TodoComputed,
  },
  setup() { // 
    const toggle = ref(false);
    const todos = ref([]);
    const error = ref('');
    const totalTodos = ref(0);
    const pageLimit = 5;
    const currentPage = ref(1);
    const numberOfPages = computed(() => {
      return Math.ceil(totalTodos.value / pageLimit); // 올림 2.2 = 3페이지
    })

    // db.json으로부터 todos를 가져온다.
    // 리턴하는 함수가 아니다.
    const getTodos = async (page = currentPage.value) => {
      currentPage.value = page;
      try {
        // 백틱: ``으로 할 시, 문자열 내부에 자바스크립트 객체를 사용할 수 있다.
        const res = await axios.get(`http://localhost:3000/todos?_page=${page}&_limit=${pageLimit}`);
        totalTodos.value = res.headers['x-total-count']; // todo 갯수
        todos.value = (res.data);
      } catch(err) {
        console.log(err);
        error.value = 'GET 송신에 에러가 발생하였습니다.';
      }
    };

    // 함수 실행.
    getTodos();

    // async : 비동기 함수로 만들어 버린다.
    const addTodo = async (todo) => {
      // json server db에 todo를 저장한다. 
      // post request npm axios
      // 터미널에서 json-server --watch db.json 해줘야 한다.
      // db.json에 값이 저장된다.
      // promise가 리턴된다.
      error.value = '';
      try {
        const res = await axios.post('http://localhost:3000/todos', {
          subject: todo.subject,
          completed: todo.completed,
        });
        todos.value.push(res.data); // id까지 포함한 데이터가 객체에 저장된다.
      } catch(err2) {
        console.log(err2);
        error.value = 'POST 송신에 에러가 발생하였습니다.';
      }
    };

    // v-show, v-if 토글 변수
    const changeToggle = () => {
      toggle.value = !toggle.value;
    };

    // 삭제 기능
    const deleteTodo = async (index) => {
      error.value = '';
      const id = todos.value[index].id;
      try {
        await axios.delete('http://localhost:3000/todos/' + id);
        todos.value.splice(index, 1);
        alert('id : ' + id + '가 삭제되었습니다.');
      } catch(err) {
        error.value = 'DELETE 송신에 에러가 발생하였습니다.';
      }
    };

    // complted 변경 기능
    const toggleTodo = async (index) => {
      error.value = '';
      const id = todos.value[index].id;
      try {
        await axios.patch('http://localhost:3000/todos/' + id, {
          completed: !todos.value[index].completed
        });
        todos.value[index].completed = !todos.value[index].completed;
      } catch(err) {
        error.value = 'PATCH 송신에 에러가 발생하였습니다.';
      }
    };

    const searchText = ref('');
    const filteredTodos = computed(() => {
      if (searchText.value) {
        return todos.value.filter(todo => {
          return todo.subject.includes(searchText.value);
        });
      }
      // 빈 공간일 경우,
      return todos.value;
    });

    const showIf = ref(false);
    const toggleShowIf = () => {
      showIf.value = !showIf.value;
    };
    const showComputed = ref(false);
    const toggleComputed = () => {
      showComputed.value = !showComputed.value;
    }

    return {
      toggle,
      todos,
      addTodo,
      changeToggle,
      deleteTodo,
      toggleTodo,
      searchText,
      filteredTodos,
      error,
      showIf,
      toggleShowIf,
      showComputed,
      toggleComputed,
      numberOfPages,
      currentPage,
      getTodos,
    };
  }
}
</script>

<style>
.red {
  color: red;
}
.blue {
  color: blue;
}
.todo {
  color: gray;
  text-decoration: line-through;
}
</style>