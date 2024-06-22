<template>
  <div>
    <form class="auth_main-container" @submit.prevent="submitForm()"> <img
        class="auth_logo object-cover rounded-full m-auto" src="@/assets/images/logo.png" alt="Badminton Tutor" />
      <h1 class="auth-page__heading">Update Password</h1>
      <template v-if="error - text">
        <p class="error">{{ error }}</p>
      </template>
      <template v-if="success">
        <div class="success-text" role="info">
          {{ success }}
        </div>
      </template>

      <label for="old-password" class="auth-page__label">Old Password</label>
      <input type="password" name="old-password" placeholder="Old Password" class="auth-page__input"
        :value="oldPassword" @input="(event) => (oldPassword = event.target.value)" />
      <label for="new-password" class="auth-page__label">New Password</label>
      <input type="password" name="new-password" placeholder="New Password" class="auth-page__input"
        :value="newPassword" @input="(event) => (newPassword = event.target.value)" />
      <button @click="submitForm" class="auth-page__submit-button">
        Update Password
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
  props: {
    email: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const oldPassword = ref("");
    const newPassword = ref("");
    const error = ref(null);
    const router = useRouter();
    const success = ref(null);

    const submitForm = () => {
      if (newPassword.value == oldPassword.value) {
        error.value = "New password cannot be the same as the old password";
        return;
      }
      console.log(props.email, newPassword.value);
      AuthService.updatePassword(props.email, newPassword.value, oldPassword.value)
        .then((response) => {
          if (response.status === 200) {
            console.log("Password updated");
            success.value = response.data;
            setTimeout(() => {
              router.push({ name: "SignIn" });
            }, 1500);
          } else {
            throw new Error(response);
          }
        })
        .catch((e) => {
          error.value = e;
          console.error(e);
        });
    };
    return { oldPassword, newPassword, submitForm, error, success };
  },
};
</script>

<style></style>
