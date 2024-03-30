<template>
  <div class="bg-[#fffcf9]">
    <div class="main-container">
    <h1
      class="auth-page__heading"
    >
      Update Profile
    </h1>
    <p>{{ store.state?.currentUserDetails?.email }}</p>
    <label  class="auth-page__label" for="name">Name</label>
    <input
      type="text"
      name="name"
      placeholder="Name"
      :value="formData.name"
      
        class="auth-page__input"
      @input="(event) => (formData.name = event.target.value)"
      required
    />
    <label  class="auth-page__label" for="description">Description</label>
    <input
      type="text"
      name="description"
      placeholder="Description"
      :value="formData.description"
      
        class="auth-page__input"
      @input="(event) => (formData.description = event.target.value)"
      required
    />
    <label  class="auth-page__label" for="linkedin">LinkedIn</label>
    <input
      type="text"
      name="linkedin"
      placeholder="LinkedIn"
      :value="formData.linkedin"
      
        class="auth-page__input"
      @input="(event) => (formData.linkedin = event.target.value)"
      required
    />
    <label  class="auth-page__label" for="facebook">Facebook</label>
    <input
      type="text"
      name="facebook"
      placeholder="Facebook"
      :value="formData.facebook"
      
        class="auth-page__input"
      @input="(event) => (formData.facebook = event.target.value)"
      required
    />
    <label  class="auth-page__label" for="instagram">Instagram</label>
    <input
      type="text"
      name="instagram"
      placeholder="Instagram"
      :value="formData.instagram"
      
        class="auth-page__input"
      @input="(event) => (formData.instagram = event.target.value)"
      required
    />
    <label  class="auth-page__label" for="twitter">Twitter</label>
    <input
      type="text"
      name="twitter"
      placeholder="Twitter"
      :value="formData.twitter"
      
        class="auth-page__input"
      @input="(event) => (formData.twitter = event.target.value)"
      required
    />
    <label  class="auth-page__label" for="image">Image</label>
    <input
      type="text"
      name="image"
      placeholder="Image"
      :value="formData.image"
      class="auth-page__input"
      @input="(event) => (formData.image = event.target.value)"
      required
    />
    <button @click="submitForm" class="auth-page__submit-button">Update Profile</button>
  </div>
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
