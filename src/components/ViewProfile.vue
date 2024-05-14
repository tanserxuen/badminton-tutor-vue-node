<template>
  <div class="container mx-auto px-4 py-10">
    <h2 class="base-page__heading-short">Profile</h2>
    <div class="profile">
      <span class="profile__name">{{ userDetails.name }}</span>
      <template v-if="userDetails.image == ''">
        <lottie-animation path="images/profile.json" :width="220" :height="220" />
      </template>
      <template v-else>
        <img :src="userDetails.image" :alt="userDetails.name" class="profile__avatar" />
      </template>

      <!-- <span class="styling"></span> -->
      <span class="profile__description">{{ userDetails.description }}</span>
      <div class="profile_details">
        <div class="profile_details__text1">Posts</div>
        <div class="profile_details__text2">Followers</div>
        <div class="profile_details__text3">Following</div>
        <div class="profile_details__numbers1">{{ userDetails.noOfPosts }}</div>
        <div class="profile_details__numbers2">
          {{ userDetails.noOfFollowers }}
        </div>
        <div class="profile_details__numbers3">
          {{ userDetails.noOfFollowing }}
        </div>
      </div>

      <div class="profile__settings">
        <span class="profile__settings_title">Settings</span>
        <div class="profile__settings_bar">
          <router-link to="/update-password">Update Password</router-link>
          <i class="fas fa-chevron-right"></i>
        </div>
        <div class="profile__settings_bar">
          <router-link to="/update-profile">Update Profile</router-link>
          <i class="fas fa-chevron-right"></i>
        </div>
      </div>
    </div>
    <!-- <div v-if="userDetails">
      <pre>userDetails {{ userDetails }}</pre>
    </div> -->
  </div>
  <!-- <div>
    <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">Profile</h1>
    <router-link class="font-medium text-blue-600 dark:text-blue-500 hover:underline" to="/update-password"
      >Update Password</router-link
    >
    <router-link class="font-medium text-blue-600 dark:text-blue-500 hover:underline" to="/update-profile"
      >Update Profile</router-link
    >
    <p>View your profile here</p>

  </div> -->
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
    const userDetails = computed(() => store.state?.currentUserDetails ?? "");
    return { userDetails };
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

.profile__settings {
  width: -webkit-fill-available;
}

.profile__settings_bar {
  margin-block: 1rem;
  padding-inline: 1.5rem;
  padding-block: 0.5rem;
  background: white;
  border-radius: 0.325rem;
}

.profile__settings_title {
  font-size: 1.5rem;
  font-weight: 700;
}

.profile__avatar {
  border-radius: 50%;
  background: white;
  margin-block: 40px;
  width: 250px;
  height: 250px;
  object-fit: cover;
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
}

.profile__name,
.profile__description {
  font-size: large;
}
</style>
