<template>
  <header>
    <nav>
      <div class="nav-logo">Badminton Tutor</div>
      <div class="nav-links">
        <template v-if="!isAuthenticated">
          <router-link class="navbar-item" to="/signup">Register</router-link>
          <router-link class="navbar-item" to="/signin">Sign In</router-link>
          <router-link class="navbar-item" to="/reset-password"
            >Reset Password</router-link
          >
        </template>
        <template v-else>
          <router-link class="navbar-item" to="/dashboard"
            >Dashboard</router-link
          >
          <router-link class="navbar-item" to="/profile"
            >View Profile</router-link
          >
          <button @click="logoutUser">Log Out</button>
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
