<template>
  <div>
    <h1
      class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl"
    >
      Reset Password
    </h1>
    <label for="email">Email</label>
    <input
      type="text"
      name="email"
      placeholder="Email"
      :value="email"
      @input="(event) => (email = event.target.value)"
      required
    />
    <button
      @click="submitForm"
      class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
    >
      Reset Password
    </button>
  </div>
</template>

<script>
import { ref } from "vue";
import { resetPassword } from "@/js/services/auth";
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
