<template>
  <div id="app">
    <AppHeader />
    <div class="p-4 sm:ml-64" v-if="isAuthenticated">
      <div class="p-4">
        <router-view :key="$route.fullPath"></router-view>
      </div>
    </div>
    <div v-else>
      <router-view :key="$route.fullPath"></router-view>
    </div>
  </div>
</template>

<script>
import { onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import AppHeader from "./components/AppHeader.vue";
import store from "./js/store";

export default {
  components: {
    AppHeader,
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
