<template>
  <div>
    <h1>Posts Index</h1>
    <router-link to="/post-create">Create Post</router-link>
    <br><br>
    <div class="grid grid-cols-3 gap-4">
      <template v-if="posts">
        <div
          v-for="(post, index) in posts"
          :key="post.id"
          class="bg-white shadow-md rounded-lg p-4"
        >
          <router-link :to="{ name: 'PostView', params: { index: index } }">
            <img :src="post.image" alt="Post Image" class="w-full" />
          </router-link>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from "vuex";

export default {
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
img{
  height: 200px;
  width:200px;
  object-fit: cover;
}</style>
