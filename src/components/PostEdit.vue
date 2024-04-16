<template>
  <div>
    <h1>Edit Post</h1>
    <form>
      <div>
        <label for="title">Title</label>
        <input type="text" id="title" v-model="formData.title" />
      </div>
      <div>
        <label for="description">Description</label>
        <textarea id="description" v-model="formData.description"></textarea>
      </div>
      <div>
        <label for="image">Image</label>
        <input type="file" id="image" @change="uploadImage" />
        <img :src="formData.image" alt="Post Image" />
      </div>
      <button @click.prevent="submitForm">Update Post</button>
    </form>
  </div>
</template>

<script>
import { reactive } from "vue";
import PostService from "@/js/services/post.js";

export default {
  setup() {
    const formData = reactive({
      title: "",
      description: "",
      image: "",
    });

    const uploadImage = (e) => {
      const image = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = () => {
        formData.image = reader.result;
      };
    };

    const submitForm = () => {
      try {
        PostService.updatePost({
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
