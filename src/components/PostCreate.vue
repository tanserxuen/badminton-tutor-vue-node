<template>
  <div class="container px-4 py-10">
    <h2 class="base-page__heading-short">Create Post</h2>
    <form
      class="mx-auto"
      style="max-width: 360px"
      encType="multipart/form-data"
      @submit.prevent="submitForm"
    >
      <div>
        <img
          ref="avatar_preview"
          class="object-cover rounded-full m-auto"
          style="height: 250px; width: 250px"
          :src="formData.image ? formData.image : '/images/placeholderImg.jpg'"
          alt="Current profile photo"
        />
        <label class="block">
          <span class="sr-only">Choose profile photo</span>
          <input
            ref="fileInput"
            required
            accept="image/png, image/gif, image/jpeg"
            type="file"
            name="image"
            @change="uploadImage"
            class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 mb-5"
          />
        </label>
      </div>
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

      <button class="auth-page__submit-button">Create</button>
    </form>
  </div>
</template>

<script>
import { computed, reactive } from "vue";
import { useStore } from "vuex";
import PostService from "@/js/services/post.js";

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
      if (image.size > 66000) {
        alert("Image size should be less than 66 kb");
        e.preventDefault();
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = () => {
        formData.image = reader.result;
        // this.$refs.avatar_preview.src = reader.result;
      };
    };

    const submitForm = () => {
      try {
        PostService.createPost({
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
