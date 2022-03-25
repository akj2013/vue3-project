/*
toast.js
모달과 비슷하게 화면 우측에 알람창을 띄웠다 꺼준다.
여러 화면에서 axios 관련 CRUD 로직 실행 후에 사용한다.
반복되는 소스이기 때문에 composables폴더에 .js로 빼와서 export를 해주고,
사용할 화면에서 import하고 함수에 return 변수와 함수를 선언해서 사용할 수 있다.
*/
import {ref, onUnmounted} from 'vue';
export const useToast = () => {
  // toast 관련 변수 및 함수
  const showToast = ref(false);
  const toastMessage = ref('');
  const toastAlertType = ref('');
  const toastTimeout = ref(null);
  const triggerToast = (message, type) => {
    showToast.value = true;
    toastMessage.value = message;
    toastAlertType.value = type;
    // 3초 후 초기화. 다른 화면 가도 이미 실행되어 버린다.
    toastTimeout.value = setTimeout(() => {
      console.log('triggerToast setTimeout');
      toastMessage.value = '';
      toastAlertType.value = '';
      showToast.value = false;
    }, 3000);
  };
  // Avoiding Memory Leak : 메모리 누수 관리
  onUnmounted(() => {
    console.log('onUnmounted');
    clearTimeout(toastTimeout.value); // setTimeout을 초기화시킨다.
  });
  return {
    showToast,
    toastMessage,
    toastAlertType,
    triggerToast,
  }
}