<template>
  <!-- 데이터 반복문 v-for -->
  <div class="mt-4">
    <div v-for="(todo, index) in todos" :key="todo.id" class="card mt-2">
      <div class="card-body p-2 d-flex align-items-center">
        <div class="form-check flex-grow-1">
          <!-- 체크박스에 v-model로 데이터 연동 (양방향 바인딩) -->
          <input :checked="todo.completed" @change="toggleTodo(index)" type="checkbox" class="form-check-input">
          <!-- 객체로 style 바인딩 / 삼항연산자 사용 -->
          <label :style="todo.completed == true ? todoStyle : {}" class="form-check-label">{{ todo.subject }}</label>
          &nbsp;
          <!-- class 바인딩 / 조건식 추가 
          <label :class="{todo : todo.completed}" class="form-check-label">{{ todo.subject }}</label>
          -->
        </div>
        <!-- 삭제 버튼 -->
        <div>
          <button @click="deleteTodo(index)" class="btn btn-danger btn-sm">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
	props: {
		todos: {
			type: Array,
			required: true
		}
	},
  emits: ['toggle-todo', 'delete-todo'],
  setup(props, { emit }) {
    const todoStyle = {
      textDecoration: 'line-through', // -는 못 쓰고, 대문자로 쓴다.
      color: 'gray',
    };
    const toggleTodo = (index) => {
      emit('toggle-todo', index);
    };
    const deleteTodo = (index) => {
      emit('delete-todo', index);
    };

    return {
      todoStyle,
      toggleTodo,
      deleteTodo,
    }
  }
}
</script>

<style>

</style>