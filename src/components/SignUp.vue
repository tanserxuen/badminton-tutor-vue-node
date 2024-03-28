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
import { useRouter } from "vue-router";

export default {
  setup() {
    const email = ref("");
    const password = ref("");
    const router = useRouter();
    const submitForm = () =>
      signup(email.value, password.value)
        .then((response) => {
          console.log(response.data.code !== undefined);
          if (response.data.code !== undefined) {
            throw new Error(response.data.code);
          } else {
            console.log("Signed up");
            //logout before signin
            router.push({ name: "SignIn" });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    return { email, password, submitForm };
  },
};
</script>

<style></style>
