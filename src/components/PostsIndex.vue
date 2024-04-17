<template>
  <div class="container mx-auto px-4 py-10">
    <h2 class="base-page__heading-short">
      Posts Index
      <router-link to="/post-create" class="float-end"
        ><i class="fas fa-plus"></i
      ></router-link>
    </h2>
    <div class="grid grid-cols-3 gap-4 base-page__inner-margin">
      <template v-if="posts.length">
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
      <template v-else>No Posts Yet</template>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
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
img {
  height: 200px;
  width: 200px;
  object-fit: cover;
}

.fa-plus {
  /* background: white; */
  padding: 5px;
  border-radius: 3px;
  background: #fdba74;
  color: white;
}
</style>
