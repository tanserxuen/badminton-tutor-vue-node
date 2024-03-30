<template>
  <header>
    <nav>
      <div class="nav-logo">Badminton Tutor</div>
      <div>
        <template v-if="!isAuthenticated">
          <router-link class="font-medium text-blue-600 dark:text-blue-500 hover:underline" to="/signup">Register</router-link>
          <router-link class="font-medium text-blue-600 dark:text-blue-500 hover:underline" to="/signin">Sign In</router-link>
          <router-link class="font-medium text-blue-600 dark:text-blue-500 hover:underline" to="/reset-password"
            >Reset Password</router-link
          >
        </template>
        <template v-else>
          <router-link class="font-medium text-blue-600 dark:text-blue-500 hover:underline" to="/dashboard"
            >Dashboard</router-link
          >
          <router-link class="font-medium text-blue-600 dark:text-blue-500 hover:underline" to="/profile"
            >View Profile</router-link
          >
          <router-link class="font-medium text-blue-600 dark:text-blue-500 hover:underline" to="/pose-counter"
            >Pose Counter</router-link
          >
          <button @click="logoutUser" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Log Out</button>
        </template>
      </div>
    </nav>
  </header>
</template>

<script>
import { logout } from "../js/services/auth.js";
import store from "@/js/store.js";
import { computed } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const isAuthenticated = computed(() => store.getters.isAuthenticated);
    const router = useRouter();

    const logoutUser = () => {
      logout()
        .then((response) => {
          if (response.status === 200) {
            store.commit("setCurrentUser", null);
            console.log({ currentUser: store.getters.getCurrentUser });
            console.log("Logged out");
            router.push({ name: "SignIn" });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    };
    return { isAuthenticated, logoutUser };
  },
};
</script>

<style scoped>
/* Your header styling here */
</style>
