<template>
  <div class="container mx-auto px-4 py-10">
    <h2 class="base-page__heading-short">
      My Posts
      <router-link to="/post-create" class="float-end"><i class="fas fa-plus"
          title="Create new posts"></i></router-link>
    </h2>
    <div class="d-grid base-page__inner-margin">
      <template v-if="posts.length">
        <div v-for="(post, index) in posts" :key="post.id" class="bg-white shadow-md rounded-lg p-4">
          <router-link :to="{ name: 'PostView', params: { index: index } }">
            <img :src="post.image" alt="Post Image" class="w-full" />
          </router-link>
        </div>
      </template>
      <template v-else><lottie-animation path="images/no_data_found.json" /></template>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import LottieAnimation from "lottie-vuejs/src/LottieAnimation.vue";

export default {
  components: {
    LottieAnimation,
  },
  setup() {
    const store = useStore();
    const posts = computed(() => store.getters.getUserPosts);

    return {
      posts,
    };
  },
};
</script>

<style scoped>
img {
  height: 100%;
  width: 100%;
  object-fit: cover;

  @media screen and (max-width: 640px) {
    width: 140px;
    height: 140px;
    margin: auto;
  }
}

.fa-plus {
  /* background: white; */
  padding: 5px;
  border-radius: 3px;
  background: #fdba74;
  color: white;
}

.d-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
  @media screen and (max-width: 640px) {
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  }
}

.d-grid > div {
  @media screen and (max-width: 640px) {
    width: 100%;
    height: 100%;
  }
}

.d-grid>div>a {
  overflow: hidden;
}
</style>
