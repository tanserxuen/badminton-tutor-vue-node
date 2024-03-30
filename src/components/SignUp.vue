<template>
  <div>
    <h1>Sign Up</h1>

    <template v-if="error">
      <p class="error">{{ error }}</p>
    </template>

    <label for="email">Email</label>
    <input
      type="text"
      name="email"
      placeholder="Email"
      :value="email"
      @input="(event) => {
          email = event.target.value;
          error = null;
        }"
      required
    />
    <label for="password">Password</label>
    <input
      type="password"
      name="password"
      placeholder="Password"
      :value="password"
      @input="(event) => {
          password = event.target.value;
          error = null;
        }"
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
    const error = ref(null);

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
        .catch((e) => {
          error.value = e;
          console.error(e);
        });
    return { email, password, submitForm, error };
  },
};
</script>

<style></style>
