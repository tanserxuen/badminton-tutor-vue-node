<template>
  <div class="container mx-auto px-4" :class="isConnection ? 'py-1' : 'py-10'">
    <h2 class="base-page__heading-short" v-if="!isConnection">
      <BackButton />
      Post View
      <button class="float-end" @click="deletePost()"><i class="fas fa-trash"></i></button>
      <router-link :to="{ name: 'PostEdit', params: { index: index } }" class="float-end me-3"><i
          class="fas fa-pencil-alt"></i></router-link>
    </h2>
    <div class="bg-white border rounded-sm max-w-md mx-auto">
      <div class="flex items-center px-4 py-3">
        <img class="h-8 w-8 rounded-full"
          :src="postUserDetails?.image == '' ? '/images/placeholderImg.jpg' : postUserDetails?.image" />
        <div class="ml-3">
          <span class="text-sm font-semibold antialiased block leading-tight underline underline-offset-4">
            <router-link :to="{ name: 'Profile', params: { id: post?.userId ?? 0 } }">
              {{ postUserDetails?.name }}
            </router-link></span>
        </div>
      </div>
      <img :src="post?.image" :alt="post?.image" class="post-image" />
      <div class="m-4">
        <b class="underline underline-offset-4">
          <router-link :to="{ name: 'Profile', params: { id: post?.userId ?? 0 } }">
            {{ post?.userName }}
          </router-link>
        </b>
        <br>
        <span>{{ post?.description }}</span>
        <!-- {{ post?.id }} -->
      </div>
      <div class="flex items-center justify-between mx-4 mt-3 mb-2">
        <div class="flex gap-5">
          <i :class="likedPost ? 'fas fa-heart' : 'far fa-heart'" @click="toggleLike"></i>
          <svg fill="#262626" height="24" viewBox="0 0 48 48" width="24"
            @click="isCommentsTabOpen = !isCommentsTabOpen">
            <path clip-rule="evenodd"
              d="M47.5 46.1l-2.8-11c1.8-3.3 2.8-7.1 2.8-11.1C47.5 11 37 .5 24 .5S.5 11 .5 24 11 47.5 24 47.5c4 0 7.8-1 11.1-2.8l11 2.8c.8.2 1.6-.6 1.4-1.4zm-3-22.1c0 4-1 7-2.6 10-.2.4-.3.9-.2 1.4l2.1 8.4-8.3-2.1c-.5-.1-1-.1-1.4.2-1.8 1-5.2 2.6-10 2.6-11.4 0-20.6-9.2-20.6-20.5S12.7 3.5 24 3.5 44.5 12.7 44.5 24z"
              fill-rule="evenodd"></path>
          </svg>
        </div>
      </div>
      <div class="font-semibold text-sm mx-4 mt-2 mb-4">
        {{ post?.current_user_liked?.length ?? 0 }} like{{
          post?.current_user_liked?.length == 0 ? "s" : ""
        }}
        <br />
        <span class="text-gray-500 text-xs">{{ date }}</span>
      </div>
      <div class="max-w-md mx-auto mt-5 px-4" :class="isCommentsTabOpen ? null : 'hidden'">
        <h3 class="block mb-2 text-sm font-semibold">
          {{ post?.comments?.length ?? 0 }} Comments
        </h3>
        <form @submit.prevent="addComment()" class="my-5">
          <div>
            <input class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg mb-2 w-64 me-3"
              id="comment" @input="(event) => (comment = event.target.value)" :value="comment" required />
            <button type="submit"
              class="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center">
              Submit
            </button>
          </div>
        </form>

        <!-- display list of comments -->
        <template v-if="post?.comments?.length > 0">
          <div :class="isCommentsTabOpen ? null : 'hidden'" class="transition-all pt-3 pb-5">
            <div class="px-2.5 row" v-for="(comment, i) in post?.comments" :key="i">
              <div class="mb-2">
                <div class="flex">
                  <img
                    :src="comment.userImg == '' ? 'https://firebasestorage.googleapis.com/v0/b/badmintonposecounter.appspot.com/o/Assets%2FplaceholderImg.jpg?alt=media&token=20cec767-fdf2-4de6-a4e3-7c154f2df6ee' : comment.userImg"
                    :alt="comment?.userName == '' ? 'Unnamed User' : comment?.userName" class="avatar" />
                  <b class="ms-4">{{ comment.userName == '' ? 'Unnamed User' : comment?.userName }}</b>
                </div>
                <p style="padding-left:50px;">{{ comment.message }}</p>
                <!-- <div class="col-sm-10"></div> -->
                <!-- <span class="text-gray-500 text-xs">{{ comment.date }}</span> -->
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <p class="pb-10">No comment yet</p>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, defineAsyncComponent, onMounted } from "vue";
import { useStore } from "vuex";
import PostServices from "@/js/services/post";
import getDateFromTimestamp from "@/js/services/date";
import { useRouter } from "vue-router";
import UserServices from "@/js/services/user";

export default {
  components: {
    BackButton: defineAsyncComponent(() => import("@/components/BackButton.vue")),
  },
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
    const router = useRouter();
    const store = useStore();
    const comment = ref("");
    const post = ref(null);
    const user = computed(() => store.state?.currentUserDetails ?? "");
    const isCommentsTabOpen = ref(false);
    const postUserDetails = ref(null);

    const fetchPostUserDetails = async () => {
      if (!post.value) return;
      postUserDetails.value = await UserServices.view(post.value.userId);
      return postUserDetails;
    };

    const fetchPost = async () => {
      post.value = (await props.isConnection)
        ? store.getters.getNonUserPost(props.index)
        : store.getters.getUserPost(props.index);
    };

    const date = computed(() => {
      if (!post.value) return;
      return getDateFromTimestamp(post.value?.created_at);
    });

    const deletePost = async () => {
      if (!post.value) return;
      console.log("del post");
      PostServices.deletePost({ postId: post.value.id }).then((res) => {
        console.log(res);
        router.push({ name: "PostsIndex" })
      });
    };

    const updatePost = () => {
      if (!post.value) return;
      PostServices.updateLikeComment({
        postId: post.value.id,
        comments: post.value.comments,
        current_user_liked: post.value.current_user_liked,
      }).then((res) => {
        console.log(res);
      });
    };

    const likedPost = computed(() => {
      if (!post.value) return;
      return post.value?.current_user_liked.includes(user.value.id);
    });

    const addComment = async () => {
      if (comment.value == "") return;
      console.log(user.value.name, user.value.image, user.value);
      post.value.comments = post.value.comments ?? [];
      post.value?.comments.push({
        message: comment.value,
        userId: user.value.id,
        userImg: user.value.image,
        userName: user.value.name,
      });
      comment.value = "";

      await updatePost();
    };

    const toggleLike = async () => {
      const userId = user.value.id;
      if (post.value.current_user_liked.includes(userId)) {
        const index = post.value.current_user_liked.indexOf(userId);
        if (index > -1)  // only splice array when item is found
          post.value.current_user_liked.splice(index, 1); // 2nd parameter means remove one item only
      }
      else post.value.current_user_liked.push(userId);
      await updatePost();
    };

    onMounted(() => {
      fetchPost().then(() => {
        fetchPostUserDetails();
      });
    });

    return {
      post,
      user,
      toggleLike,
      addComment,
      isCommentsTabOpen,
      comment,
      date,
      likedPost,
      deletePost,
      postUserDetails,
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

.m-4 {
  @media screen and (max-width: 640px) {
    margin-block: 10px;
  }
}

.m-4 b {
  font-size: 16px;

  @media screen and (max-width: 640px) {
    font-size: 14px;
  }
}

.m-4 span {
  font-size: 12px;

  @media screen and (max-width: 640px) {
    font-size: 10px;
  }
}

.text-gray-500.text-xs {
  font-size: 12px;

  @media screen and (max-width: 640px) {
    font-size: 10px;
  }
}

.font-semibold.text-sm.mx-4.mt-2.mb-4 {
  font-size: 14px;

  @media screen and (max-width: 640px) {
    font-size: 12px;
  }
}

.avatar {
  width: 30px;
  height: 30px;
  object-fit: cover;
}
</style>