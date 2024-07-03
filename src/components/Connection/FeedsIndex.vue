<template>
  <div class="container mx-auto px-4 py-10">
    <h2 class="base-page__heading-short">
      Feeds
      <router-link class="float-end" to="/connection"><i class="fas fa-user-plus"
          :class="userDetails?.requests?.length > 0 ? 'notification' : null"
          title="Connect with others"></i></router-link>
    </h2>
    <div class="base-page__inner-margin">
      <template v-if="posts.length != 0">
        <div class="scroll-inside">
          <PostView :index="index" :isConnection="true" v-for="(post, index) in posts" :key="post.id"></PostView>
        </div>
      </template>
      <template v-else-if="isLoading">
        <lottie-animation path="images/loading.json" v-show="isLoading" :width="150" :height="150" />
      </template>
      <template v-else>
        <lottie-animation path="images/no_data_found.json" />
      </template>
    </div>
  </div>
</template>

<script>
import { computed, defineAsyncComponent } from "vue";
import { useStore } from "vuex";
import LottieAnimation from "lottie-vuejs/src/LottieAnimation.vue";

export default {
  components: {
    PostView: defineAsyncComponent(() => import("@/components/Post/PostView.vue")),
    LottieAnimation
  },
  setup() {
    const store = useStore();
    const posts = computed(() => {
      let a = [...store.getters.getNonUserPosts]
      return a.sort((a, b) => new Date(b.created_at._seconds * 1000) - new Date(a.created_at._seconds * 1000));
    });
    const userDetails = computed(() => store.state.currentUserDetails);
    const isLoading = computed(() => !!posts.value);

    return {
      posts,
      isLoading,
      userDetails
    };
  },
};
</script>

<style scoped>
.fas.fa-user-plus {
  position: relative;
}

.notification::after {
  content: " ";
  position: absolute;
  width: 15px;
  height: 15px;
  background-color: red;
  right: -5px;
  top: -7px;
  border-radius: 100%;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}
</style>
