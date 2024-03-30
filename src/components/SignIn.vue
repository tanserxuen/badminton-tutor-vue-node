<template>
  <div>
    <h1
      class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl"
    >
      Sign in
    </h1>

    <template v-if="error">
      <div
        class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
        role="alert"
      >
        {{ error }}
      </div>
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
      Sign in
    </button>
  </div>
</template>

<script>
import { signin } from "../js/services/auth.js";
import { ref } from "vue";
import store from "@/js/store.js";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    const email = ref("");
    const password = ref("");
    const error = ref(null);

    const submitForm = () =>
      signin(email.value, password.value)
        .then((response) => {
          console.log(response.data.code !== undefined);
          if (response.data.code !== undefined) {
            throw new Error(response.data.code);
          } else {
            console.log("Signed in", response.data.uid);
            store.commit("setCurrentUser", response.data);
            console.log({ currentUser: store.getters.getCurrentUser });
            store.dispatch("fetchUserDetails", response.data.uid);
            console.log({
              currentUserDetails: store.getters.getCurrentUserDetails,
            });
            router.push({ name: "DashBoard" });
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
