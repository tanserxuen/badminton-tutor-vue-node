<template>
  <div>
    <form class="auth_main-container" @submit.prevent="submitForm()">
      <img class="auth_logo object-cover rounded-full m-auto" src="@/assets/images/logo.png" alt="Badminton Tutor" />
      <h1 class="auth-page__heading">Sign In</h1>

      <template v-if="error">
        <div class="error-text" role="alert">
          {{ error }}
        </div>
      </template>
      <template v-if="success">
        <div class="success-text" role="info">
          {{ success }}
        </div>
      </template>

      <label for="email" class="auth-page__label">Email</label>
      <input type="text" name="email" placeholder="Email" class="auth-page__input" :value="email" @input="(event) => {
        email = event.target.value;
        error = null;
      }
        " required />
      <label for="password" class="auth-page__label">Password</label>
      <input type="password" name="password" placeholder="Password" class="auth-page__input" :value="password" @input="(event) => {
        password = event.target.value;
        error = null;
      }
        " required />
      <button class="auth-page__submit-button">
        Sign in
      </button>

      <p class="auth-page__link">
        <router-link to="/signup">Register</router-link>
        <router-link to="/reset-password">Forget Password</router-link>
      </p>
    </form>
  </div>
</template>

<script>
import AuthService from "@/js/services/auth.js";
import { ref } from "vue";
import store from "@/js/store.js";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    const email = ref("");
    const password = ref("");
    const error = ref(null);
    const success = ref(null);

    const submitForm = () =>
      AuthService.signin(email.value, password.value)
        .then((res) => {
          console.log(res)
          if (res.status === 200) {
            success.value = res.data.message;
            setTimeout(() => {
              router.push({ name: "DashBoard" });
              store.commit("setCurrentUser", res.data);
              store.dispatch("fetchUserDetails", res.data.uid);
              store.dispatch("fetchPosts", res.data.uid);
              store.dispatch("updateActiveDays");
            }, 1500);
          } else {
            throw new Error(res.response.data.code);
          }
        })
        .catch((e) => {
          error.value = e;
          console.error(e);
        });
    return { email, password, submitForm, error, success };
  },
};
</script>

<style></style>
