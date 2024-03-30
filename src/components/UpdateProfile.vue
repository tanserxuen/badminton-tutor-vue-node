<template>
  <div>
    <h1
      class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl"
    >
      Update Profile
    </h1>
    <p>{{ store.state?.currentUserDetails?.email }}</p>
    <label for="name">Name</label>
    <input
      type="text"
      name="name"
      placeholder="Name"
      :value="formData.name"
      @input="(event) => (formData.name = event.target.value)"
      required
    />
    <label for="description">Description</label>
    <input
      type="text"
      name="description"
      placeholder="Description"
      :value="formData.description"
      @input="(event) => (formData.description = event.target.value)"
      required
    />
    <label for="linkedin">LinkedIn</label>
    <input
      type="text"
      name="linkedin"
      placeholder="LinkedIn"
      :value="formData.linkedin"
      @input="(event) => (formData.linkedin = event.target.value)"
      required
    />
    <label for="facebook">Facebook</label>
    <input
      type="text"
      name="facebook"
      placeholder="Facebook"
      :value="formData.facebook"
      @input="(event) => (formData.facebook = event.target.value)"
      required
    />
    <label for="instagram">Instagram</label>
    <input
      type="text"
      name="instagram"
      placeholder="Instagram"
      :value="formData.instagram"
      @input="(event) => (formData.instagram = event.target.value)"
      required
    />
    <label for="twitter">Twitter</label>
    <input
      type="text"
      name="twitter"
      placeholder="Twitter"
      :value="formData.twitter"
      @input="(event) => (formData.twitter = event.target.value)"
      required
    />
    <label for="image">Image</label>
    <input
      type="text"
      name="image"
      placeholder="Image"
      :value="formData.image"
      @input="(event) => (formData.image = event.target.value)"
      required
    />
    <button @click="submitForm" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Update Profile</button>
  </div>
</template>

<script>
import UserService from "@/js/services/user";
import { computed, onMounted, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const formData = reactive({});
    const userDetails = computed(() => store.state?.currentUserDetails ?? "");
    const submitForm = () => {
      try {
        UserService.update(userDetails.value.id, {
          name: formData.name,
          description: formData.description,
          linkedin: formData.linkedin,
          facebook: formData.facebook,
          instagram: formData.instagram,
          twitter: formData.twitter,
          image: formData.image,
        })
          .then(() => {
            router.push({ name: "Profile" });
          })
          .catch((error) => {
            throw new Error(error);
          });
      } catch (error) {
        console.error(error);
      }
    };

    onMounted(() => {
      const {
        name,
        description,
        linkedin,
        facebook,
        instagram,
        twitter,
        image,
      } = userDetails.value;
      formData.name = name;
      formData.description = description;
      formData.linkedin = linkedin;
      formData.facebook = facebook;
      formData.instagram = instagram;
      formData.twitter = twitter;
      formData.image = image;
    });

    return {
      formData,
      submitForm,
      store,
    };
  },
};
</script>

<style></style>
