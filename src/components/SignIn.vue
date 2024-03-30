<template>
  <div>
    <h1>Sign in</h1>

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
    <button @click="submitForm">Sign in</button>
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
