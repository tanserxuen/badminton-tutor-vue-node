<template>
  <div id="app">
    <AppHeader />
    <!-- <template v-if="isAuthenticated">
      <DashBoard />
    </template>
    <template v-else>
    </template> -->
    <router-view :key="$route.fullPath"></router-view>
    <!-- <SignIn /> -->
  </div>
</template>

<script>
import { onMounted, computed } from "vue";
import { useRouter } from "vue-router";
// import axios from "axios";
import AppHeader from "./components/AppHeader.vue";
// import DashBoard from "./components/DashBoard.vue";
import store from "./js/store";

export default {
  components: {
    AppHeader,
    // DashBoard,
  },
  setup() {
    const isAuthenticated = computed(() => store.getters.isAuthenticated);
    const router = useRouter();

    onMounted(async () => {
      await store
        .dispatch("checkAuth")
        .then(() => {
          if (!isAuthenticated.value) {
            router.push({ name: "SignIn" });
          } else {
            router.push({ name: "DashBoard" });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    });
    return { isAuthenticated };
  },
};
</script>
