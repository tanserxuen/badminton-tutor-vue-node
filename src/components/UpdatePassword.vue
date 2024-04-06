<template>
  <div class="container px-4 py-10">
    <h2 class="base-page__heading">Update Password</h2>
    <div class="mx-auto" style="max-width: 360px">
      <template v-if="error - text">
        <p class="error">{{ error }}</p>
      </template>

      <label for="old-password" class="auth-page__label">Old Password</label>
      <input
        type="password"
        name="old-password"
        placeholder="Old Password"
        class="auth-page__input"
        :value="oldPassword"
        @input="(event) => (oldPassword = event.target.value)"
      />
      <label for="new-password" class="auth-page__label">New Password</label>
      <input
        type="password"
        name="new-password"
        placeholder="New Password"
        class="auth-page__input"
        :value="newPassword"
        @input="(event) => (newPassword = event.target.value)"
      />
      <label for="confirm-password" class="auth-page__label"
        >Confirm Password</label
      >
      <input
        type="password"
        name="confirm-password"
        placeholder="Confirm Password"
        class="auth-page__input"
        :value="confirmPassword"
        @input="(event) => (confirmPassword = event.target.value)"
      />
      <button @click="submitForm" class="auth-page__submit-button">
        Update Password
      </button>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { updatePassword } from "@/js/services/auth";
import store from "@/js/store";

export default {
  setup() {
    const oldPassword = ref("");
    const newPassword = ref("");
    const confirmPassword = ref("");
    const error = ref(null);

    const currentUser = computed(() => store.getters.getCurrentUser);
    const submitForm = () => {
      if (newPassword.value !== confirmPassword.value) {
        error.value = "Passwords do not match";
        return;
      } else if (newPassword.value == oldPassword.value) {
        error.value = "New password cannot be the same as the old password";
        return;
      }
      console.log(currentUser.value.email, newPassword.value);
      updatePassword(currentUser.value.email, newPassword.value)
        .then((response) => {
          if (response.status === 200) {
            console.log("Password updated");
          }
        })
        .catch((e) => {
          error.value = e;
          console.error(e);
        });
    };
    return { oldPassword, newPassword, confirmPassword, submitForm, error };
  },
};
</script>

<style></style>
