import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userInfo: []
  },
  mutations: {
    tree: (state, data1) => {
      state.userInfo = data1;
      localStorage.setItem("tree", JSON.stringify(data1));
    }
  },
  actions: {},
  modules: {}
});
