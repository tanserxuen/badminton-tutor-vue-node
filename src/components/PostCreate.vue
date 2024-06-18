<template>
  <div class="container px-4 py-10">
    <h2 class="base-page__heading-short">
      <BackButton />
      Create Post
      <button class="float-end">
        <i @click="isChart = !isChart" :class="isChart ? 'fas fa-image' : 'fa fa-bar-chart'"
          :title="isChart ? 'Share Selected Image' : 'Share Your Analytics'" aria-hidden="true"></i>
      </button>
    </h2>

    <form class="mx-auto" style="max-width: 360px" encType="multipart/form-data">
      <div v-show="isChart">
        <DetailedAnalytics :isChart="isChart" />
      </div>
      <div v-show="!isChart">
        <img ref="avatar_preview" class="object-cover rounded-full m-auto" style="height: 250px; width: 250px"
          :src="formData.image ? formData.image : '/images/placeholderImg.jpg'" alt="Current profile photo" />
        <label class="block">
          <span class="sr-only">Choose profile photo</span>
          <input ref="fileInput" :required="!isChart" accept="image/png, image/gif, image/jpeg" type="file" name="image"
            @change="uploadImage"
            class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 mb-5" />
        </label>
      </div>
      <label class="auth-page__label" for="title">Title</label>
      <input type="text" name="title" placeholder="title" :value="formData.title" class="auth-page__input"
        @input="(event) => (formData.title = event.target.value)" required /><label class="auth-page__label"
        for="description">Description</label>
      <input type="text" name="description" placeholder="description" :value="formData.description"
        class="auth-page__input" @input="(event) => (formData.description = event.target.value)" required />

      <button class="auth-page__submit-button" @click.prevent.stop="submitForm">
        Create
      </button>
    </form>
  </div>
</template>

<script>
import { computed, reactive, ref, defineAsyncComponent } from "vue";
import { useStore } from "vuex";
import PostService from "@/js/services/post.js";
// import DetailedAnalytics from "./DetailedAnalytics.vue";
import html2canvas from "html2canvas";
// import BackButton from "./BackButton.vue";
import { uploadToFirebase } from "../js/services/firebaseUpload";
import { useRouter } from "vue-router";

export default {
  components: {
    DetailedAnalytics: defineAsyncComponent(() => import("./DetailedAnalytics.vue")),
    BackButton: defineAsyncComponent(() => import("./BackButton.vue")),
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const formData = reactive({
      title: "",
      description: "",
      image: "",
    });
    const file = ref(null);
    const isChart = ref(false);
    const userDetails = computed(() => store.state?.currentUserDetails ?? "");

    const uploadImage = (e) => {
      const image = e.target.files[0];
      file.value = image;
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = () => {
        formData.image = reader.result;
      };
    };

    const getScreenShot = async () => {
      let c = document.getElementById("canvasEl"); // or document.getElementById('canvas');
      await html2canvas(c).then((canvas) => {
        var t = canvas.toDataURL().replace("data:image/png;base64,", "");
        formData.image = createBase64File("image/png", t);
      });
    };

    const createBase64File = (contentType, base64Data) => {
      const linkSource = `data:${contentType};base64,${base64Data}`;
      return linkSource;
    };

    const submitForm = async () => {
      if (isChart.value) {
        // dont upload to firebase storage sebab i cannot do that
        await getScreenShot()
        //upload data url string to firebase storage
        // formData.image = await uploadStringToFirebase(formData.image, "Posts");
      }

      //upload image to firebase storage
      else formData.image = await uploadToFirebase(file.value, "Posts");

      try {
        PostService.createPost({
          userId: userDetails.value.id,
          userName: userDetails.value.name,
          ...formData,
        })
          .then((response) => {
            console.log(response);
            if (response.status === 200) {
              router.push({ name: "PostsIndex" });
            }
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
      isChart,
    };
  },
};
</script>

<style></style>
