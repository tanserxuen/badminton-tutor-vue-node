import PostService from "../js/services/post.js";
import UserService from "../js/services/user.js";
import AuthService from "../js/services/auth.js";
import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      currentUser: null,
      currentUserDetails: null,
      userPosts: [],
      nonUserPosts: [],
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
    getUserPosts: (state) => {
      console.log({ userPosts: state.userPosts });
      return state.userPosts;
    },
    getUserPost: (state) => (index) => {
      return state.userPosts[index];
    },
    getNonUserPosts: (state) => {
      return state.nonUserPosts;
    },
    getNonUserPost: (state) => (index) => {
      return state.nonUserPosts[index];
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
    setUserPosts: (state, userPosts) => {
      console.log({ userPosts });
      state.userPosts = userPosts;
    },
    setNonUserPosts: (state, nonUserPosts) => {
      console.log({ nonUserPosts });
      state.nonUserPosts = nonUserPosts;
    },
  },
  actions: {
    checkAuth: async ({ commit, dispatch }) => {
      try {
        await AuthService.validateAuth().then((res) => {
          if (res.status == 200) {
            commit("setCurrentUser", res.data);
            dispatch("fetchUserDetails", res.data?.uid);
            dispatch("fetchPosts", res.data?.uid);
            dispatch("updateActiveDaysPerWeek");
          }
        });
      } catch (error) {
        console.error(error);
      }
    },
    fetchUserDetails: async ({ commit }, id) => {
      try {
        await UserService.view(id).then((userDetail) => {
          commit("setCurrentUserDetails", userDetail.data);
        });
      } catch (error) {
        console.error(error);
      }
    },
    fetchPosts: async ({ commit }, userId) => {
      try {
        await PostService.getUserPosts().then((userPosts) => {
          commit(
            "setUserPosts",
            userPosts.data.filter((post) => post.userId === userId)
          );
          commit(
            "setNonUserPosts",
            userPosts.data.filter((post) => post.userId !== userId)
          );
        });
      } catch (error) {
        console.error(error);
      }
    },
    updateActiveDaysPerWeek: async () => {
      try {
        await UserService.updateActiveDaysPerWeek();
      } catch (error) {
        console.error(error);
      }
    },
  },
});

export default store;
