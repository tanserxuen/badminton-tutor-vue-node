<template>
  <div class="bg-[#fffcf9]">
    <div class="auth_main-container">
      <h1 class="auth-page__heading">Reset Password</h1>
      <label for="email" class="auth-page__label">Email</label>
      <input
        type="text"
        name="email"
        placeholder="Email"
        class="auth-page__input"
        :value="email"
        @input="(event) => (email = event.target.value)"
        required
      />
      <button @click="submitForm" class="auth-page__submit-button">
        Reset Password
      </button>

      <p class="auth-page__link">
        <router-link to="/signup">Register</router-link>
        <router-link to="/signin">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { resetPassword } from "@/js/services/auth";
import { useRouter } from "vue-router";

export default {
  setup() {
    const email = ref("");
    const router = useRouter();
    const submitForm = () => {
      console.log(email.value);
      resetPassword(email.value)
        .then((response) => {
          if (response.status === 200) {
            console.log("Password reset email sent");
            router.push({ name: "SignIn" });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    };
    return { email, submitForm };
  },
};
</script>

<style></style>
