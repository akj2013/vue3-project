<template>
  <!-- 데이터 반복문 v-for -->
  <div class="mt-4">
    <div v-for="(todo, index) in todos" :key="todo.id" class="card mt-2">
      <div @click="moveToPage(todo.id)" class="cusrsorPointer card-body p-2 d-flex align-items-center">
        <div class="form-check flex-grow-1">
          <!-- 체크박스에 v-model로 데이터 연동 (양방향 바인딩) -->
          <input @click.stop :checked="todo.completed" @change="toggleTodo(index, $event)" type="checkbox" class="form-check-input">
          <!-- 객체로 style 바인딩 / 삼항연산자 사용 -->
          <label :style="todo.completed == true ? todoStyle : {}" class="form-check-label cusrsorPointer">{{ todo.subject }}</label>
          &nbsp;
          <!-- class 바인딩 / 조건식 추가 
          <label :class="{todo : todo.completed}" class="form-check-label">{{ todo.subject }}</label>
          -->
        </div>
        <!-- 삭제 버튼 .stop : 이벤트 버블링을 방지해준다. -->
        <div>
          <button @click.stop="deleteTodo(index)" class="btn btn-danger btn-sm">Delete</button>
        </div>
      </div>
    </div>
    <!-- pagination -->
    <hr>
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li v-if="currentPage !== 1" class="page-item"><a class="page-link cusrsorPointer" @click="getTodos(currentPage - 1)">Previous</a></li>
        <li v-for="page in numberOfPages" :key="page" class="page-item" :class="currentPage === page ? 'active' : ''">
          <a class="page-link cusrsorPointer" @click="getTodos(page)">{{page}}</a>
        </li>
        <li v-if="currentPage !== numberOfPages" class="page-item"><a class="page-link cusrsorPointer" @click="getTodos(currentPage + 1)">Next</a></li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
	props: {
		todos: {
			type: Array,
			required: true
		},
    numberOfPages: {
      type: Number,
      required: true
    },
    currentPage: {
      type: Number,
      required: true
    },
	},
  emits: ['toggle-todo', 'delete-todo', 'get-todos'],
  setup(props, { emit }) {
    const router = useRouter();
    const todoStyle = {
      textDecoration: 'line-through', // -는 못 쓰고, 대문자로 쓴다.
      color: 'gray',
    };
    const toggleTodo = (index, event) => {
      emit('toggle-todo', index, event.target.checked); // checked : true / false
    };
    const deleteTodo = (index) => {
      emit('delete-todo', index);
    };
    const getTodos = (page) => {
      emit('get-todos', page);
    };
    const moveToPage = (id) => {
      console.log(id);
      // router.push('/todos/' + id); // 가고 싶은 페이지로 이동한다.
      // 두 가지 방법이 있다. 아래에는 path가 고정되고 name이 바뀔 경우, 소스 수정이 쉽다.
      router.push({
        name: 'TodoDetail',
        params: {
          id: id
        }
      });
    }

    return {
      todoStyle,
      toggleTodo,
      deleteTodo,
      getTodos,
      moveToPage,
    }
  }
}
</script>

<style>
.cusrsorPointer {
  cursor: pointer
}
</style>