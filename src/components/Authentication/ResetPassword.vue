<template>
  <div>
    <form class="auth_main-container" @submit.prevent="submitForm()" > <img class="auth_logo object-cover rounded-full m-auto"
        src="@/assets/images/logo.png" alt="Badminton Tutor" />
      <h1 class="auth-page__heading">Reset Password</h1>

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
      <input type="email" name="email" placeholder="Email" class="auth-page__input" :value="email" @input="(event) => {
        email = event.target.value;
        error = null;
      }
        " required />
      <button class="auth-page__submit-button">
        Submit
      </button>

      <p class="auth-page__link">
        <router-link to="/signup">Register</router-link>
        <router-link to="/signin">Login</router-link>
      </p>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import AuthService from "@/js/services/auth";
import { useRouter } from "vue-router";

export default {
  setup() {
    const email = ref("");
    const router = useRouter();
    const error = ref(null);
    const success = ref(null);

    const submitForm = () => {
      AuthService.resetPassword(email.value)
        .then((response) => {
          if (response.status === 200) {
            success.value = response.data;
            setTimeout(() => {
              router.push({ name: "UpdatePassword", params: { email: email.value } });
            }, 1500);
          } else {
            throw new Error(response);
          }
        })
        .catch((e) => {
          error.value = "Error: No user found with this email";
          console.error(e);
        });
    };
    return { email, submitForm, error, success };
  },
};
</script>

<style></style>
