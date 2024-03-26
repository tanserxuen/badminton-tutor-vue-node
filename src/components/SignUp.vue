<template>
  <div>
    <h1>Sign Up</h1>
    <label for="email">Email</label>
    <input
      type="text"
      name="email"
      placeholder="Email"
      :value="email"
      @input="(event) => (email = event.target.value)"
      required
    />
    <label for="password">Password</label>
    <input
      type="password"
      name="password"
      placeholder="Password"
      :value="password"
      @input="(event) => (password = event.target.value)"
      required
    />
    <button @click="submitForm">Sign Up</button>
  </div>
</template>

<script>
import { signup } from "../js/services/auth.js";
import { ref } from "vue";

export default {
  setup() {
    const email = ref("");
    const password = ref("");
    const submitForm = () => signup(email.value, password.value);
    return { email, password, submitForm };
  },
};
</script>

<style></style>
