<template>
  <div class="container px-4 py-10">
    <h2 class="base-page__heading-short">
      <BackButton />Update Profile</h2>
    <form
      class="mx-auto"
      style="max-width: 360px"
      encType="multipart/form-data"
      @submit.prevent="submitForm"
    >
      <label class="auth-page__label" for="name">Email</label>
      <input
        class="auth-page__input"
        :value="store.state?.currentUserDetails?.email"
        readonly
        disabled
      />
      <label class="auth-page__label" for="name">Name</label>
      <input
        type="text"
        name="name"
        placeholder="Name"
        :value="formData.name"
        class="auth-page__input"
        @input="(event) => (formData.name = event.target.value)"
        required
      />
      <label class="auth-page__label" for="description">Description</label>
      <input
        type="text"
        name="description"
        placeholder="Description"
        :value="formData.description"
        class="auth-page__input"
        @input="(event) => (formData.description = event.target.value)"
        required
      />
      <label class="auth-page__label" for="linkedin">LinkedIn</label>
      <input
        type="text"
        name="linkedin"
        placeholder="LinkedIn"
        :value="formData.linkedin"
        class="auth-page__input"
        @input="(event) => (formData.linkedin = event.target.value)"
        required
      />
      <label class="auth-page__label" for="facebook">Facebook</label>
      <input
        type="text"
        name="facebook"
        placeholder="Facebook"
        :value="formData.facebook"
        class="auth-page__input"
        @input="(event) => (formData.facebook = event.target.value)"
        required
      />
      <label class="auth-page__label" for="instagram">Instagram</label>
      <input
        type="text"
        name="instagram"
        placeholder="Instagram"
        :value="formData.instagram"
        class="auth-page__input"
        @input="(event) => (formData.instagram = event.target.value)"
        required
      />
      <label class="auth-page__label" for="twitter">Twitter</label>
      <input
        type="text"
        name="twitter"
        placeholder="Twitter"
        :value="formData.twitter"
        class="auth-page__input"
        @input="(event) => (formData.twitter = event.target.value)"
        required
      />
      <div class="flex items-center space-x-6">
        <div class="shrink-0">
          <img
            ref="avatar_preview"
            class="h-32 w-32 object-cover rounded-full"
            :src="formData.image"
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
            required
            accept="image/png, image/gif, image/jpeg"
            class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          />
        </label>
      </div>
      <button class="auth-page__submit-button">Update Profile</button>
    </form>
  </div>
</template>

<script>
import UserService from "@/js/services/user";
import { computed, onMounted, reactive, ref, defineAsyncComponent } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
// import BackButton from "./BackButton.vue";

export default {
  components: {
    BackButton: defineAsyncComponent(() => import("./BackButton.vue")),
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const formData = reactive({});
    const userDetails = computed(() => store.state?.currentUserDetails ?? "");
    const imageSize = ref(0);

    const uploadImage = (e) => {
      const image = e.target.files[0];
      if (image.size > 66000) {
        alert("Image size should be less than 66 kb");
        e.preventDefault();
        return;
      }
      const reader = new FileReader();
      imageSize.value = image.size;
      reader.readAsDataURL(image);
      reader.onload = () => {
        formData.image = reader.result;
        // this.$refs.avatar_preview.src = reader.result;
      };
    };

    const submitForm = () => {
      if (imageSize.value == 0) {
        alert("Please upload an image");
        return;
      } //empty image file

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
          .then((response) => {
            if (response.status === 200) {
              router.push({ name: "Profile" });
            }
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
      uploadImage,
    };
  },
};
</script>

<style></style>
