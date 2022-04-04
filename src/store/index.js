/**
 * vuex 관련
 */

import { createStore } from "vuex";

export default createStore({
  // state안에 있는 것을 어느 vue에서나 가져다 쓸 수 있다.
  state: {
    showToast: false,
    toastMessage: '',
    toastAlertType: '',
    toastTimeout: null
  },
  mutations: {
    UPDATE_TOAST_MESSAGE (state, payload) {
      state.toastMessage = payload;
    },
    UPDATE_TOAST_ALERT_TYPE (state, payload) {
      state.toastAlertType = payload;
    },
    UPDATE_TOAST_STATUS (state, payload) {
      state.showToast = payload;
    },
    UPDATE_TOAST_TIMEOUT (state, payload) {
      state.toastTimeout = payload;
    }
  },
  actions: {
    triggerToast({ commit }, message, type = 'success') {
      commit('UPDATE_TOAST_MESSAGE', message);
      commit('UPDATE_TOAST_ALERT_TYPE', type);
      commit('UPDATE_TOAST_STATUS', true);
      // 4.5초 후 초기화. 다른 화면 가도 이미 실행되어 버린다.
      const timeout = setTimeout(() => {
        commit('UPDATE_TOAST_MESSAGE', '');
        commit('UPDATE_TOAST_ALERT_TYPE', '');
        commit('UPDATE_TOAST_STATUS', false);
      }, 4500);
      commit('UPDATE_TOAST_TIMEOUT', timeout);
    }
  },
  // vuex에서 사용하는 computed이다.
  getters: {
    toastMessageWithSmile (state) {
      return state.toastMessage + '^_^'; // reactive하기 때문에 변경되면 다시 계산해준다.
    }
  }
});