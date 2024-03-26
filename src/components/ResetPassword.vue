<template>
  <div>
    <h1>Reset Password</h1>
    <label for="email">Email</label>
    <input
      type="text"
      name="email"
      placeholder="Email"
      :value="email"
      @input="(event) => (email = event.target.value)"
      required
    />
    <button @click="submitForm">Reset Password</button>
  </div>
</template>

<script>
import { ref } from "vue";
import { resetPassword } from '@/js/services/auth';
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
