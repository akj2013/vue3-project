<template>
    <div v-if="loading">
    Loading...
  </div>
  <form
    v-else
    @submit.prevent="onSave"
  >
    <div class="row">
      <Input labelSubject="Subject" labelBody="Body" labelCompleted="Completed"
        v-model:subject="todo.subject" v-model:completed="todo.completed" v-model:body="todo.body"
        :editing="editing"
        :error="subjectError"
        @toggle-TodoStatus="toggleTodoStatus"
      />
    </div>

    <button
      class="btn btn-primary" type="submit"
      :disabled="!todoUpdated"
    >
      {{ editing ? 'Update' : 'Create' }}
    </button>
    <button
      class="btn btn-secondary" style="float: right" type="submit"
      @click="moveToListPage"
    >
      Back
    </button>
  </form>
  <transition name="fade"> <!-- transition : 애니메이션 추가 -->
    <Toast v-if="showToast" :message="toastMessage" :type="toastAlertType" />
  </transition>
  <div id="test"></div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router';
import axios from '@/axios.js';
import { ref, computed, onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onBeforeUnmount } from 'vue';
import _ from 'lodash';
import Toast from '@/components/Toast.vue';
import { useToast } from '@/composables/toast'; // .js는 생략가능
import Input from '@/components/Input.vue';

export default {
  components: {
    Toast,
    Input
  },
  props: {
    editing: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const route = useRoute();
    const router = useRouter();
    const todo = ref({
      subject: '',
      completed: false,
      body: ''
    });
    const originTodo = ref(null);
    const loading = ref(false);
    const todoId = route.params.id;
    // toast
    const {
      showToast,
      toastMessage,
      toastAlertType,
      triggerToast
    } = useToast();
    const subjectError = ref('');

    // DOM에 Mounted 되기 전
    onBeforeMount(() => {
      // DOM에 접근 불가
      console.log(document.querySelector('#test'));
    });
    // Dom에 mounted 됐을 때
    onMounted(() => {
      // DOM에 접근 가능
      console.log(document.querySelector('#test'));
    });
    console.log('setup함수가 먼저 실행된다.');
    onBeforeUpdate(() => {
      console.log('onbeforeUpdate');
      // console.log(todo.value.subject);
    });
    onUpdated(() => {
      console.log('onUpdated');
      // console.log(todo.value.subject);
    });
    onBeforeUnmount(() => {
      console.log('onBeforeUnmount');
    });
    // 1개 검색
    const getTodo = async () => {
      loading.value = true;
      console.log('getTodo실행');
      try {
        const response = await axios.get(`http://localhost:3000/todos/${todoId}`);
        todo.value = {...response.data}; // 스프레드 오퍼레이터 : 새로운 객체
        originTodo.value = {...response.data};
        // 데이터가 들어오면 로딩을 false로 변환.
        loading.value = false;
      } catch(err) {
        loading.value = false;
        triggerToast('axios 도중 에러가 발생했습니다.', 'danger');
      }
    }
    // 함수 호출
    if (props.editing) {
      getTodo();
    }

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
      subjectError.value = '';
      if (!todo.value.subject) {
        subjectError.value = 'Subject가 입력되지 않았습니다.';
        return;
      }
      try {
        let res;
        const data = {
          subject: todo.value.subject, // value 쓰기 싫으면 reactive 써라.
          completed: todo.value.completed,
          body: todo.value.body

        }
        if (props.editing) {
          // DB에 갱신한다.
          res = await axios.put(`todos/${todoId}`, data);
          // 갱신 후에는 다시 origin도 변경.
          originTodo.value = {...res.data};
        } else {
          // DB에 저장한다.
          res = await axios.post('todos', data);
          // 저장 후에는 초기화.
          todo.value.subject = '';
          todo.value.body = '';
        }
        const message = 'Succesfully ' + (props.editing ? 'Updated' : 'Created') + '!!!';
        triggerToast(message);

        // List 페이지로 이동시킨다.
        if (!props.editing) {
          router.push({
            name: 'Todos'
          })
        }
      } catch(err) {
        triggerToast('axios 도중 에러가 발생했습니다.', 'danger');
      }
    };

    return {
      todo,
      loading,
      toggleTodoStatus,
      moveToListPage,
      onSave,
      todoUpdated,
      showToast,
      toastMessage,
      toastAlertType,
      subjectError,
    };
  }
}
</script>

<style scoped> /* scoped : 다른 컴포넌트에서 적용되지 않는다. 모든 태그에 유니크한 ID가 추가된다. */
.text-red {
  color: red;
}
</style>

<style> /* global 적용 스타일 시트 */
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