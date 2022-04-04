<template>

  <div>
    <div class="d-flex justify-content-between mb-3">
      <h2 class="blue">To-Do List</h2>
      <button @click="moveToCreatePage" class="btn btn-primary">Create Todo</button>
    </div>
    <input class="form-control" type="text" v-model="searchText" placeholder="Search" @keyup.enter="searchTodo">
    <hr>
    <!-- todo가 없을 때 경고 메세지 -->
    <div v-if="!todos.length" class="mt-4 red">추가된 TODO가 없습니다.</div>
    <!-- 검색 결과가 없을 때 경고 메세지 -->
    <div v-if="!todos.length && todos.length" class="mt-4 red">표시할 TODO가 없습니다.</div>
    <!-- todo 반복문 -->
    <TodoList :todos="todos" :numberOfPages="numberOfPages" :currentPage="currentPage" @toggle-todo="toggleTodo" @delete-todo="deleteTodo" @get-todos="getTodos" />
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
  <transition name="fade"> <!-- transition : 애니메이션 추가 -->
    <Toast v-if="showToast" :message="toastMessage" :type="toastAlertType" />
  </transition>
</template>

<script>
import { ref, computed, watch } from 'vue'; // 데이터 연동

import TodoList from '@/components/TodoList.vue';
import TodoShowIf from '@/components/TodoShowIf.vue';
import TodoComputed from '@/components/TodoComputed.vue';
import Toast from '@/components/Toast.vue';
import { useToast } from '@/composables/toast'; // .js는 생략가능
import axios from '@/axios.js';
import {useRouter} from 'vue-router';

export default {
  components: {
    TodoList,
    TodoShowIf,
    TodoComputed,
    Toast,
  },
  setup() { // 
    const router = useRouter();
    const toggle = ref(false);
    const todos = ref([]);
    const error = ref('');
    const totalTodos = ref(0);
    const pageLimit = 5;
    const currentPage = ref(1);
    const numberOfPages = computed(() => {
      return Math.ceil(totalTodos.value / pageLimit); // 올림 2.2 = 3페이지
    });
    const searchText = ref('');
    // toast
    const {
      showToast,
      toastMessage,
      toastAlertType,
      triggerToast
    } = useToast();

// === watch 예제 ===
    // const a = reactive({
    //   b: 1,
    //   c: 3
    // });
    // watch([currentPage, totalTodos], (currentPage, prev) => {
    //   console.log(currentPage, prev); 
    // });
    // watch(() => [a.b, a.c], (current, prev) => {
    //   // 여러 개를 감지할 경우, 리턴도 배열로 순서대로 들어간다.
    //   console.log('current : ' + current, 'prev : ' + prev);
    //   console.log('current : ' + current + ', prev : ' + prev);
    // });
    // a.b = 2;
// === watchEffect 예제 ===
    // const a = reactive({
    //   b: 1
    // });
    // watchEffect(() => {
      // watchEffect : currentPage.value가 변경될 때 감지하여, 해당 메소드를 다시 실행한다.
      // console.log(currentPage.value);
      // console.log(totalTodos.value);
      // react, props, computed값이 변경될 때도 실행된다.
      // console.log(numberOfPages.value);
      // console.log(a.b);
      // 그 이외에는 변경되어도 처음만 실행된다.
      // console.log(limit);
    // });
    // a.b = 4;

    // db.json으로부터 todos를 가져온다.
    // 리턴하는 함수가 아니다.
    const getTodos = async (page = currentPage.value) => {
      currentPage.value = page;
      try {
        // 백틱: ``으로 할 시, 문자열 내부에 자바스크립트 객체를 사용할 수 있다.
        const res = await axios
          .get(`todos?_sort=id&_order=desc&subject_like=${searchText.value}&_page=${page}&_limit=${pageLimit}`);
        totalTodos.value = res.headers['x-total-count']; // todo 갯수
        todos.value = (res.data);
      } catch(err) {
        console.log(err);
        triggerToast('GET 송신에 에러가 발생하였습니다.', 'danger');
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
        const res = await axios.post('todos', {
          subject: todo.subject,
          completed: todo.completed,
        });
        todos.value.push(res.data); // id까지 포함한 데이터가 객체에 저장된다.
        // 재검색
        getTodos();
      } catch(err2) {
        console.log(err2);
        triggerToast('POST 송신에 에러가 발생하였습니다.', 'danger');
      }
    };

    // v-show, v-if 토글 변수
    const changeToggle = () => {
      toggle.value = !toggle.value;
    };

    // 삭제 기능
    const deleteTodo = async (id) => {
      error.value = '';
      try {
        await axios.delete('todos/' + id);
        // toast 호출
        triggerToast(id + '번째 TODO가 삭제되었습니다.', 'danger');

        // TODO 재검색
        // 전체 갯수 % 삭제한 후 갯수 == 0 && 현재가 마지막 페이지, 페이지 = 페이지 - 1을 해준다.
        const res = await axios.get('todos/');
        if (res.data.length % pageLimit == 0 && currentPage.value === numberOfPages.value) {
          currentPage.value = currentPage.value - 1;
        }
        getTodos(currentPage.value);
      } catch(err) {
        triggerToast('DELETE 송신에 에러가 발생하였습니다.', 'danger');
      }
    };

    // complted 변경 기능
    const toggleTodo = async (index, chekced) => {
      error.value = '';
      const id = todos.value[index].id;
      try {
        await axios.patch('http://localhost:3000/todos/' + id, {
          completed: chekced
        });
        todos.value[index].completed = chekced;
      } catch(err) {
        triggerToast('PATCH 송신에 에러가 발생하였습니다.', 'danger');
      }
    };

    // const searchText = ref('');
    // const filteredTodos = computed(() => {
    //   if (searchText.value) {
    //     return todos.value.filter(todo => {
    //       return todo.subject.includes(searchText.value);
    //     });
    //   }
    //   // 빈 공간일 경우,
    //   return todos.value;
    // });

    const showIf = ref(false);
    const toggleShowIf = () => {
      showIf.value = !showIf.value;
    };
    const showComputed = ref(false);
    const toggleComputed = () => {
      showComputed.value = !showComputed.value;
    }

    let timeout = null;
    // 검색조건이 바뀌는지 관찰하고, 바뀌면 재검색한다.
    // 항상 첫번째 페이지를 표시하고, 검색조건은 getTodos의 get()에 파라미터로 들어가 있다.
    // 2초 기다렸다가 검색한다.
    watch(searchText, () => {
      clearTimeout(timeout); // 이전 요청을 초기화.
      timeout = setTimeout(() => {
        getTodos(1);
      }, 2000);
    });
    // Enter 입력 시, 곧바로 요청.
    const searchTodo = () => {
      clearTimeout(timeout);
      getTodos(1);
    }

    const moveToCreatePage = () => {
      router.push({
        name: 'TodoCreate'
      });
    };

    return {
      toggle,
      todos,
      addTodo,
      changeToggle,
      deleteTodo,
      toggleTodo,
      searchText,
      // filteredTodos,
      error,
      showIf,
      toggleShowIf,
      showComputed,
      toggleComputed,
      numberOfPages,
      currentPage,
      getTodos,
      searchTodo,
      showToast,
      toastMessage,
      toastAlertType,
      moveToCreatePage,
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
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

/* 시작점 */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-30px); 
}
/* 종료점 */
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0px);
}
</style>