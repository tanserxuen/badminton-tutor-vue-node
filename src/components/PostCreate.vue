<template>
  <div class="container px-4 py-10">
    <h2 class="base-page__heading">Create Post</h2>
    <form
      class="mx-auto"
      style="max-width: 360px"
      encType="multipart/form-data"
      @submit.prevent="submitForm"
    >
      <label class="auth-page__label" for="title">Title</label>
      <input
        type="text"
        name="title"
        placeholder="title"
        :value="formData.title"
        class="auth-page__input"
        @input="(event) => (formData.title = event.target.value)"
        required
      /><label class="auth-page__label" for="description">Description</label>
      <input
        type="text"
        name="description"
        placeholder="description"
        :value="formData.description"
        class="auth-page__input"
        @input="(event) => (formData.description = event.target.value)"
        required
      />
      <div class="flex items-center space-x-6">
        <div class="shrink-0">
          <img
            ref="avatar_preview"
            class="h-32 w-32 object-cover rounded-full"
            :src="formData.image ?? '/images/placeholderImg.jpg'"
            alt="Current profile photo"
          />
        </div>
        <label class="block">
          <span class="sr-only">Choose profile photo</span>
          <input
            ref="fileInput"
            type="file"
            name="image"
            @change="uploadImage"
            class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          />
        </label>
      </div>
      <button class="auth-page__submit-button">Create Post</button>
    </form>
  </div>
</template>

<script>
import { computed, reactive } from "vue";
import { useStore } from "vuex";
import UserService from "@/js/services/user";

export default {
  setup() {
    const store = useStore();
    const formData = reactive({
      title: "",
      description: "",
      image: "",
    });
    const userDetails = computed(() => store.state?.currentUserDetails ?? "");
    const uploadImage = (e) => {
      const image = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = () => {
        formData.image = reader.result;
        // this.$refs.avatar_preview.src = reader.result;
      };
    };

    const submitForm = () => {
      try {
        UserService.createPost({
          userId: userDetails.value.id,
          userName: userDetails.value.name,
          ...formData,
        })
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.error(error);
          });
      } catch (error) {
        console.error(error);
      }
    };

    return {
      formData,
      submitForm,
      uploadImage,
    };
  },
};
</script>

<style></style>
