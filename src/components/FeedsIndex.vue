<template>
  <div class="container mx-auto px-4 py-10">
    <h2 class="base-page__heading-short">
      Connections<router-link class="float-end" to="/connection"
        ><i class="fas fa-user-plus"></i
      ></router-link>
    </h2>
    <div class="base-page__inner-margin">
      <template v-if="posts.length != 0">
        <div class="scroll-inside">
          <PostView
            :index="index"
            :isConnection="true"
            v-for="(post, index) in posts"
            :key="post.id"
          ></PostView>
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
