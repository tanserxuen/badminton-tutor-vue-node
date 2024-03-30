<template>
  <div>
    <h1
      class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl"
    >
      Sign Up
    </h1>

    <template v-if="error">
      <p class="error">{{ error }}</p>
    </template>

    <label for="email">Email</label>
    <input
      type="text"
      name="email"
      placeholder="Email"
      :value="email"
      @input="
        (event) => {
          email = event.target.value;
          error = null;
        }
      "
      required
    />
    <label for="password">Password</label>
    <input
      type="password"
      name="password"
      placeholder="Password"
      :value="password"
      @input="
        (event) => {
          password = event.target.value;
          error = null;
        }
      "
      required
    />
    <button
      @click="submitForm"
      class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
    >
      Sign Up
    </button>
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
