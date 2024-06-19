<template>
  <div>
    <div class="auth_main-container"> <img class="auth_logo object-cover rounded-full m-auto"
        src="@/assets/images/logo.png" alt="Badminton Tutor" />
      <h1 class="auth-page__heading">Sign Up</h1>

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
      <button @click="submitForm" class="auth-page__submit-button">
        Submit
      </button>

      <p class="auth-page__link">
        <router-link to="/signin">Login</router-link>
        <router-link to="/reset-password">Forget Password</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import AuthService from "@/js/services/auth.js";
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const email = ref("");
    const password = ref("");
    const router = useRouter();
    const error = ref(null);
    const success = ref(null);

    const submitForm = () =>
      AuthService.signup(email.value, password.value)
        .then((response) => {
          if (response.status !== 200) {
            throw new Error(response.response?.data?.code);
          } else {
            console.log("Signed up");
            // logout before signin
            success.value = response.data;
            setTimeout(() => {
              router.push({ name: "SignIn" });
            }, 1500);
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
