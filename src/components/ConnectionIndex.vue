<template>
  <div>
    <h1>Connection Index</h1>
    <div class="p-4">
      <template v-if="posts">
        <div
          v-for="(post, index) in posts"
          :key="post.id"
          class="bg-white shadow-md rounded-lg p-4"
        >
        <PostView :index="index" :isConnection="true"></PostView>
        </div>
      </template>
      <template v-else>No Posts Yet</template>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import PostView from "./PostView.vue";

export default {
  components: { PostView },
  setup() {
    const store = useStore();
    const posts = computed(() => store.getters.getNonUserPosts);

    return {
      posts,
    };
  },
};
</script>

<style></style>
