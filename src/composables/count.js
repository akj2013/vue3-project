import { reactive, toRefs } from 'vue';

export const useCount = () => {
  const state = reactive({
    count: 0
  });
  // toRefs를 넣으면 reactive를 잃지 않고 구조분해하여 사용할 수 있게 된다.
  return toRefs(state);
}





/**
 * 
 * export const useCount = () => { 로 수출하면
 * import { useCount } from 로 수입하고
export default useCount 로 수출하면
import useCount 로 수입한다.
 */ 