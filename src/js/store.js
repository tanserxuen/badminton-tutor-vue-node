import { createStore } from "vuex";
import axios from "axios";

const store = createStore({
  state() {
    return {
      currentUser: null,
      currentUserDetails: null,
    };
  },
  getters: {
    getCurrentUser: (state) => {
      return state.currentUser;
    },
    isAuthenticated: (state) => {
      return state.currentUser !== null;
    },
    getCurrentUserDetails: (state) => {
      return state.currentUserDetails;
    },
  },
  mutations: {
    setCurrentUser: (state, user) => {
      console.log({ user });
      state.currentUser = user;
    },
    setCurrentUserDetails: (state, userDetails) => {
      console.log({ userDetails });
      state.currentUserDetails = userDetails;
    },
  },
  actions: {
    checkAuth: async ({ commit, dispatch }) => {
      try {
        await axios
          .get("http://localhost:3000/auth/validate-auth")
          .then((res) => {
            commit("setCurrentUser", res.data);
            dispatch("fetchUserDetails", res.data.uid);
          });
      } catch (error) {
        return error;
      }
    },
    fetchUserDetails: async ({ commit }, id) => {
      try {
        await axios
          .get(`http://localhost:3000/user/view/${id}`)
          .then((userDetail) => {
            commit("setCurrentUserDetails", userDetail.data);
          });
      } catch (error) {
        return error;
      }
    },
  },
});

export default store;
