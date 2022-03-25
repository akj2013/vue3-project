import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/index.vue';
import Todos from '../pages/todos/index.vue';
import TodoDetail from '../pages/todos/_id.vue';
import TodoCreate from '../pages/todos/create/TodoCreate.vue';

const router = createRouter({
  history: createWebHistory(), // ?
  routes: [ // url 정보 등이 들어간다.
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/todos',
      name: 'Todos',
      component: Todos
    },
    {
      path: '/todos/:id', // 변수처럼 넣음
      name: 'TodoDetail',
      component: TodoDetail
    },
    {
      path: '/todos/create',
      name: 'TodoCreate',
      component: TodoCreate
    }
  ]
});
// 1 / home 2 /todos 3 /todos/create 4 /todos/:id
export default router;