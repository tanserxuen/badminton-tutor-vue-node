import PostService from "../js/services/post.js";
import { createStore } from "vuex";
import axios from "axios";

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
    }
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
      console.log({ userPosts })
      state.userPosts = userPosts;
    },
    setNonUserPosts: (state, nonUserPosts) => {
      console.log({ nonUserPosts })
      state.nonUserPosts = nonUserPosts;
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
            dispatch("fetchPosts", res.data.uid);
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
    fetchPosts: async ({ commit }, userId) => {
      try {
        await PostService.getUserPosts().then((userPosts) => {
          commit("setUserPosts", userPosts.data.filter((post) => post.userId === userId));
          commit("setNonUserPosts", userPosts.data.filter((post) => post.userId !== userId))
        });
      } catch (error) {
        return error;
      }
    },
  },
});

export default store;
