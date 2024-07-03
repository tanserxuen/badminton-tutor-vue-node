<template>
  <div class="container mx-auto px-4 py-10">
    <h2 class="base-page__heading-short">
      <BackButton v-if="otherUserId" />
      Profile
    </h2>
    <div class="profile" v-show="!isLoading">
      <b class="profile__name">{{ user?.name }}</b>
      <template v-if="user?.image == ''">
        <LottieAnimation path="images/profile.json" :width="300" :height="300" />
      </template>
      <template v-else>
        <img :src="user?.image" :alt="user?.name" class="profile__avatar" />
      </template>

      <span class="profile__description">{{ user?.description }}</span>
      <div class="profile_details">
        <div class="profile_details__text1">Posts</div>
        <div class="profile_details__text2">Followers</div>
        <div class="profile_details__text3">Following</div>
        <div class="profile_details__numbers1">{{ user?.noOfPosts }}</div>
        <div class="profile_details__numbers2">
          {{ user?.noOfFollowers }}
        </div>
        <div class="profile_details__numbers3">
          {{ user?.noOfFollowing }}
        </div>
      </div>
      <div class="gap-5 grid grid-cols-4 grid-flow-row-dense mb-10 text-center">
        <span class="profile__description--icon"><i class="fab fa-linkedin"></i><br><a :href="user?.linkedin"
            class="text-blue-500 underline hover:underline-offset-4">linkedin.com/in/{{ user?.linkedin }}</a></span>

        <span class="profile__description--icon"><i class="font-lg fab fa-square-instagram"></i><br><a
            :href="user?.instagram" class="text-blue-500 underline hover:underline-offset-4">instagram.com/{{
              user?.instagram }}</a></span>
        <span class="profile__description--icon"><i class="fab fa-twitter"></i><br><a :href="user?.twitter"
            class="text-blue-500 underline hover:underline-offset-4">twitter.com/{{ user?.twitter }}</a></span>
        <span class="profile__description--icon"><i class="fab fa-facebook"></i><br><a :href="user?.facebook"
            class="text-blue-500 underline hover:underline-offset-4">facebook.com/profile/{{ user?.facebook
            }}</a></span>
      </div>
    </div>
    <lottie-animation path="images/loading.json" v-show="isLoading" :width="150" :height="150" />
    <div class="base-page__inner-margin" v-if="otherUserId=='me'">
      <p class="profile__settings_title">Settings</p>
      <router-link to="/post-create" v-if="!user?.noOfPosts">
        <div class="profile__settings_bar">Create a Post
          <i class="fas fa-chevron-right"></i>
        </div>
      </router-link>
      <router-link to="/update-profile">
        <div class="profile__settings_bar">
          Update Profile
          <i class="fas fa-chevron-right"></i>
        </div>
      </router-link>
      <div class="profile__settings_bar" @click="logoutUser" style="cursor : pointer">
        Logout
        <i class="fas fa-chevron-right"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, onMounted } from "vue";
import { useStore } from "vuex";
import AuthService from "@/js/services/auth.js";
import { useRouter } from "vue-router";
import LottieAnimation from "lottie-vuejs/src/LottieAnimation.vue";
import UserServices from "@/js/services/user.js";
import BackButton from "../BackButton.vue";

export default {
  components: {
    LottieAnimation,
    BackButton,
  },
  props: {
    id: {
      type: String,
      default: "me",
      required: false,
    },
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    // const user = ref("me");
    // const isLoading = ref(true);
    const otherUser = ref("me");

    const logoutUser = (e) => {
      e.preventDefault();
      const choice = confirm("Are you sure you want to logout?");
      if (!choice) return;
      AuthService.logout()
        .then((response) => {
          if (response.status === 200) {
            store.commit("setCurrentUser", null);
            console.log({ currentUser: store.getters.getCurrentUser });
            console.log("Logged out");
            router.push({ name: "SignIn" });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    };

    const user = computed(() => props.id !== "me" ? otherUser.value : store.state.currentUserDetails);

    const isLoading = computed(() => user.value === "me");

    onMounted(async () => {
      if (props.id !== "me") {
        otherUser.value = (await UserServices.view(props.id)).data
      } else {
        // user.value = store.state.currentUserDetails;
        isLoading.value = false;
      }
    });

    return {
      user,
      logoutUser,
      isLoading,
      otherUserId: props.id,
    };
  },
};
</script>

<style scoped>
.profile,
.profile__settings {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.profile {
  align-items: center;
  max-width: 360px;
  margin: auto;
}

.profile__settings_bar {
  margin-bottom: 0.75rem;
  padding-inline: 1.5rem;
  padding-block: 0.5rem;
  background: white;
  border-radius: 0.325rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media screen and (max-width: 640px) {
    font-size: 14px;
  }
}

.profile__settings_title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;

  @media screen and (max-width: 640px) {
    font-size: 16px;
    margin-bottom: 0.5rem;
  }
}

.profile__avatar {
  border-radius: 50%;
  background: white;
  margin-block: 40px;
  width: 250px;
  height: 250px;
  object-fit: cover;

  @media screen and (max-width: 640px) {
    margin-block: 30px;
  }
}

/* .styling {
  position: relative;
}

.styling::after,
.styling::before {
  content: "";
  position: absolute;
  background: white;
  width: 300px;
  height: 300px;
  z-index: 1;
} 

.styling::before {
  top: -140px;
  transform: rotate(-35deg);
}

.styling::after {
  transform: rotate(35deg);
  top: -140px;
  left: -300px;
} */

.profile_details {
  display: grid;
  grid-template-areas:
    "text1 text2 text3"
    "numbers1 numbers2 numbers3";
  row-gap: 1rem;
  column-gap: 2rem;
  text-align: center;
  margin-block: 40px;

  @media screen and (max-width: 640px) {
    row-gap: 0.5rem;
    margin-block: 30px;
  }
}

.profile_details__text1 {
  grid-area: text1;
}

.profile_details__text2 {
  grid-area: text2;
}

.profile_details__text3 {
  grid-area: text3;
}

.profile_details__numbers1 {
  grid-area: numbers1;
  font-family: var(--default-font-family);
}

.profile_details__numbers2 {
  grid-area: numbers2;
  font-family: var(--default-font-family);
}

.profile_details__numbers3 {
  grid-area: numbers3;
  font-family: var(--default-font-family);
}

.profile_details__numbers1,
.profile_details__numbers2,
.profile_details__numbers3 {
  font-size: 4.5rem;
  font-weight: 500;

  @media screen and (max-width: 640px) {
    font-size: 2.5rem;
  }
}

.profile_details__text1,
.profile_details__text2,
.profile_details__text3 {
  @media screen and (max-width: 640px) {
    font-size: 14px;
  }
}

.profile__name,
.profile__description,
.profile__description--icon {
  font-size: large;
  word-break: break-word;
}

.fa-square-instagram {
  color: #c32aa3;
}

.fa-facebook {
  color: #1877f2;
}

.linkedin {
  color: #0a66c2;
}

.fa-twitter {
  color: #1da1f2;
}

[class^="fab"],
.fa-square-instagram {
  padding-right: 10px;
  font-size: 30px;
  margin-block: 3px;
}
</style>
