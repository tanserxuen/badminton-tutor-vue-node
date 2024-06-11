<template>
  <div class="container px-4 py-10">
    <h2 class="base-page__heading">Edit Post</h2>
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
      <button class="auth-page__submit-button">Update</button>
    </form>
  </div>
</template>

<script>
import { reactive, ref } from "vue";
import PostService from "@/js/services/post.js";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { uploadToFirebase } from "../js/services/firebaseUpload";

export default {
  props: {
    index: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const formData = reactive({
      id: "",
      title: "",
      description: "",
      image: "",
    });
    const imageSize = ref(0);
    const file = ref(null);

    const fetchPost = async () => {
      const { id, title, description, image } = store.getters.getUserPost(
        props.index
      );
      console.log(props.index, store.getters.getUserPost(props.index));
      formData.id = id;
      formData.title = title;
      formData.description = description;
      formData.image = image;
    };

    fetchPost();

    const uploadImage = (e) => {
      const image = e.target.files[0];
      file.value = image;
      const reader = new FileReader();
      imageSize.value = image.size;
      reader.readAsDataURL(image);
      reader.onload = () => {
        formData.image = reader.result;
      };
    };

    const submitForm = async() => {
      if (imageSize.value == 0) {
        alert("Please upload an image");
        return;
      } //empty image file
      
      //upload image to firebase storage
      formData.image = await uploadToFirebase(file.value, "Posts");

      try {
        PostService.updatePost(formData)
          .then((response) => {
            if (response.status == 200) router.push({ name: "PostsIndex" });
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
