<template>
  <div>
    <h1
      class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl"
    >
      Update Password
    </h1>

    <template v-if="error">
      <p class="error">{{ error }}</p>
    </template>

    <label for="old-password">Old Password</label>
    <input
      type="password"
      name="old-password"
      placeholder="Old Password"
      :value="oldPassword"
      @input="(event) => (oldPassword = event.target.value)"
    />
    <label for="new-password">New Password</label>
    <input
      type="password"
      name="new-password"
      placeholder="New Password"
      :value="newPassword"
      @input="(event) => (newPassword = event.target.value)"
    />
    <label for="confirm-password">Confirm Password</label>
    <input
      type="password"
      name="confirm-password"
      placeholder="Confirm Password"
      :value="confirmPassword"
      @input="(event) => (confirmPassword = event.target.value)"
    />
    <button
      class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      @click="submitForm"
    >
      Update Password
    </button>
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
