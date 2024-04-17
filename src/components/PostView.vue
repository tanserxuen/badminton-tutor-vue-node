<template>
  <div class="container mx-auto px-4" :class="isConnection ? 'py-1' : 'py-10'">
    <h2 class="base-page__heading-short" v-if="!isConnection">
      Post View
      <router-link to="#" class="float-end"
        ><i class="fas fa-trash"></i
      ></router-link>
      <router-link
        :to="{ name: 'PostEdit', params: { index: index } }"
        class="float-end me-3"
        ><i class="fas fa-pencil-alt"></i
      ></router-link>
    </h2>
    <div class="bg-white border rounded-sm max-w-md mx-auto">
      <div class="flex items-center px-4 py-3">
        <img
          class="h-8 w-8 rounded-full"
          :src="user.image == '' ? '/images/placeholderImg.jpg' : user.image"
        />
        <div class="ml-3">
          <span class="text-sm font-semibold antialiased block leading-tight">{{
            post?.userName
          }}</span>
        </div>
      </div>
      <img :src="post?.image" :alt="post?.image" class="post-image" />
      <div class="m-4">
        <b>{{ post?.userName }}</b
        >&nbsp;&nbsp;<span>{{ post?.description }}</span>
        {{ post?.id }}
      </div>
      <div class="flex items-center justify-between mx-4 mt-3 mb-2">
        <div class="flex gap-5">
          <i
            :class="post?.current_user_liked ? 'fas fa-heart' : 'far fa-heart'"
            @click="toggleLike"
          ></i>
          <svg
            fill="#262626"
            height="24"
            viewBox="0 0 48 48"
            width="24"
            @click="isCommentsTabOpen = !isCommentsTabOpen"
          >
            <path
              clip-rule="evenodd"
              d="M47.5 46.1l-2.8-11c1.8-3.3 2.8-7.1 2.8-11.1C47.5 11 37 .5 24 .5S.5 11 .5 24 11 47.5 24 47.5c4 0 7.8-1 11.1-2.8l11 2.8c.8.2 1.6-.6 1.4-1.4zm-3-22.1c0 4-1 7-2.6 10-.2.4-.3.9-.2 1.4l2.1 8.4-8.3-2.1c-.5-.1-1-.1-1.4.2-1.8 1-5.2 2.6-10 2.6-11.4 0-20.6-9.2-20.6-20.5S12.7 3.5 24 3.5 44.5 12.7 44.5 24z"
              fill-rule="evenodd"
            ></path>
          </svg>
        </div>
      </div>
      <div class="font-semibold text-sm mx-4 mt-2 mb-4">
        {{ post?.number_of_likes ?? 0 }} like{{
          post?.number_of_likes == 0 ? "s" : ""
        }}
        <br />
        <span class="text-gray-500 text-xs">{{ date }}</span>
      </div>
      <div
        class="max-w-md mx-auto mt-5 px-4"
        :class="isCommentsTabOpen ? null : 'hidden'"
      >
        <h3 class="block mb-2 text-sm font-semibold">
          {{ post?.comments?.length ?? 0 }} Comments
        </h3>
        <form @submit.prevent="addComment()" class="my-5">
          <div>
            <input
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg mb-2"
              id="comment"
              @input="(event) => (comment = event.target.value)"
              :value="comment"
            />
            <button
              type="submit"
              class="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center"
            >
              Submit
            </button>
          </div>
        </form>

        <!-- display list of comments -->
        <template v-if="post?.comments?.length > 0">
          <div
            :class="isCommentsTabOpen ? null : 'hidden'"
            class="transition-all"
          >
            <div class="row" v-for="(comment, i) in post?.comments" :key="i">
              <!-- <div class="mb-2">
                <div class="d-inline me-3">
                <img :src="comment.userName" :alt="post?.userId" class="avatar" /> 
                </div> -->
              <span
                >{{ comment.userName }}&nbsp;&nbsp;{{ comment.message }}</span
              >
              <!-- </div>
              <div class="col-sm-10"> -->
              <!-- <p></p> -->
              <!-- </div> -->
            </div>
          </div>
        </template>
        <template v-else>
          <div class="row">
            <div class="col-sm-10">
              <p>No comments yet</p>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import PostServices from "../js/services/post";
import getDateFromTimestamp from "../js/services/date";

export default {
  props: {
    index: {
      type: Number,
      required: true,
    },
    isConnection: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const store = useStore();
    const comment = ref("");
    const post = ref(null);
    const user = computed(() => store.state?.currentUserDetails ?? "");
    const isCommentsTabOpen = ref(false);

    const fetchPost = async () => {
      post.value = (await props.isConnection)
        ? store.getters.getNonUserPost(props.index)
        : store.getters.getUserPost(props.index);
    };

    const date = computed(() => {
      if (!post.value) return;
      return getDateFromTimestamp(post.value?.created_at);
    });

    fetchPost();

    const updatePost = () => {
      if (!post.value) return;
      PostServices.updateLikeComment({
        postId: post.value.id,
        comments: post.value.comments,
        current_user_liked: post.value.current_user_liked,
        number_of_likes: post.value.number_of_likes,
      }).then((res) => {
        console.log(res);
      });
    };

    const addComment = async () => {
      if (comment.value == "") return;
      post.value.comments = post.value.comments ?? [];
      post.value?.comments.push({
        message: comment.value,
        userId: user.value.id,
      });
      comment.value = "";

      await updatePost();
    };

    const toggleLike = async () => {
      post.value.current_user_liked = !post.value.current_user_liked;
      await updatePost();
    };

    //watch current user like
    watch(
      () => post.value?.current_user_liked,
      (newVal, oldVal) => {
        newVal == true && oldVal == false
          ? post.value.number_of_likes++
          : newVal == false && oldVal == true
          ? post.value.number_of_likes--
          : null;
      }
    );

    return {
      post,
      user,
      toggleLike,
      addComment,
      isCommentsTabOpen,
      comment,date
    };
  },
};
</script>

<style scoped>
.fas.fa-heart {
  color: red;
}

.fa-heart {
  font-size: 26px;
}

img.post-image {
  max-height: 70vh;
  width: -webkit-fill-available;
  min-height: 250px;
}

img {
  object-fit: cover;
  object-position: center;
}
</style>
