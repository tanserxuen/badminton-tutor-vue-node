<template>
  <div class="container mx-auto px-4 py-10">
    <h2 class="base-page__heading-short">Profile</h2>
    <div class="profile">
      <b class="profile__name">{{ userDetails.name }}</b>
      <template v-if="userDetails.image == ''">
        <!-- <lottie-animation path="images/profile.json" :width="220" :height="220" /> -->
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
    </div>
    <div class="base-page__inner-margin">
      <span class="profile__settings_title">Settings</span>
      <!-- <router-link to="/update-password">
        <div class="profile__settings_bar">Update Password
          <i class="fas fa-chevron-right"></i>
        </div>
      </router-link> -->
      <router-link to="/update-profile">
        <div class="profile__settings_bar">
          Update Profile
          <i class="fas fa-chevron-right"></i>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
// import LottieAnimation from "lottie-vuejs/src/LottieAnimation.vue";

export default {
  // components: {
  //   LottieAnimation,
  // },
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

.profile__settings_bar {
  margin-block: 0.5rem;
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

  @media screen and (max-width: 640px) {
    font-size: 16px;
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
.profile_details__text3{
  @media screen and (max-width: 640px) {
    font-size: 14px;
  }
}

.profile__name,
.profile__description {
  font-size: large;
}
</style>
