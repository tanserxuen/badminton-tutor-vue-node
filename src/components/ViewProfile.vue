<template>
  <div>
    <h1>Profile</h1>
    <router-link class="navbar-item" to="/update-password"
      >Update Password</router-link
    >
    <router-link class="navbar-item" to="/update-profile"
      >Update Profile</router-link
    >
    <p>View your profile here</p>

    <div v-if="userDetails">
      <pre>userDetails {{ userDetails }}</pre>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const userDetails = computed(() => store.state?.currentUserDetails ?? "");
    return { userDetails };
  },
};
</script>

<style></style>
