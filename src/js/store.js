import { createStore } from "vuex";
import axios from "axios";

const store = createStore({
  state() {
    return {
      currentUser: null,
    };
  },
  getters: {
    getCurrentUser: (state) => {
      return state.currentUser;
    },
    isAuthenticated: (state) => {
      return state.currentUser !== null;
    },
  },
  mutations: {
    setCurrentUser: (state, user) => {
      state.currentUser = user;
    },
  },
  actions: {
    checkAuth: async ({ commit }) => {
      try {
        const response = await axios.get("http://localhost:3000/auth/validate-auth");
        commit("setCurrentUser", response.data);
        console.log("checkAuth ",{ currentUser: response.data });
        return response.data;
      } catch (error) {
        return error;
      }
    },
  },
});

export default store;
