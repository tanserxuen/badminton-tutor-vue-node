<template>
  <div>
    <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">Profile</h1>
    <router-link class="font-medium text-blue-600 dark:text-blue-500 hover:underline" to="/update-password"
      >Update Password</router-link
    >
    <router-link class="font-medium text-blue-600 dark:text-blue-500 hover:underline" to="/update-profile"
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
