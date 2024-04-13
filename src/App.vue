<template>
  <div id="app">
    <SideBar />
    <div class="sm:ml-64" v-if="isAuthenticated" style="background: #fff2e0;min-height:100vh">
      <router-view :key="$route.fullPath"></router-view>
    </div>
    <div v-else>
      <router-view :key="$route.fullPath"></router-view>
    </div>
  </div>
</template>

<script>
import { onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import SideBar from "./components/SideBar.vue";
import store from "./js/store";

export default {
  components: {
    SideBar,
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
