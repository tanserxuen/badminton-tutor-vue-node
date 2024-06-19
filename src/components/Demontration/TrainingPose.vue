<template>
  <div class="container mx-auto px-4 py-10">
    <h2 class="base-page__heading-short" style="margin-bottom:0px">Trainings</h2>

    <div class="base-page__inner-margin">
      <!-- <button class="primary-button" @click="isEdit = !isEdit">
        isEdit {{ isEdit }}
      </button> -->
      <div v-show="isEdit">
        <button class="primary-button" @click="createTutorials">
          Create Tutorials
        </button>
        <form v-if="tutorials" style="max-width: 360px" encType="multipart/form-data" @submit.prevent="submitForm">
          <select name="img" id="img"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            @change="formData.img = $event.target.value">
            <option selected>Choose a Img</option>
            <option value="image">image</option>
            <option value="video">video</option>
          </select>
          <template v-for="name in tutorialKeys" :key="name">
            <select id="type"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
              @change="formData.type = $event.target.value">
              <option selected>Choose a Type</option>
              <option :value="name">
                {{ name }}
              </option>
            </select>
            <select id="name"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
              @change="formData.name = $event.target.value">
              <option selected>Choose a Name</option>
              <option v-for="tutorial in Object.keys(tutorials[name])" :key="tutorial" :value="tutorial">
                {{ tutorial }}
              </option>
            </select>
          </template>
          <div class="flex items-center space-x-6">
            <div class="shrink-0">
              <img ref="avatar_preview" class="h-32 w-32 object-cover rounded-full" :src="formData?.image"
                alt="Current profile photo" />
            </div>
            <label class="block">
              <span class="sr-only">Choose profile photo</span>
              <input ref="fileInput" type="file" name="image" @change="uploadImage" required
                accept="image/png, image/gif, image/jpeg, video/mp4,video/x-m4v,video/*"
                class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
            </label>
          </div>
          <button class="auth-page__submit-button">Update Training</button>
        </form>
      </div>
      <!-- <lottie-animation path="images/loading.json" v-show="isLoading" :width="150" :height="150" /> -->
      <div v-for="name in tutorialKeys" :key="name" v-show="!isEdit && !isLoading">
        <h3 class="py-2 text-lg font-extrabold capitalize pt-10">{{ name }}</h3>
        <div class="grid">
          <div v-for="tutorial in Object.keys(tutorials[name])" :key="tutorial">
            <h4 class="font-semibold py-2 text-sm capitalize">{{ tutorial }}</h4>
            <router-link :to="{ name: 'TutorialDisplay', params: { tutorial: tutorial, name: name } }">
              <img :src="tutorials[name][tutorial].image" alt="tutorial" class="h-32 w-32 object-cover" /></router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TutorialService from "@/js/services/tutorials";
import { onMounted, ref, reactive, computed } from "vue";
import { uploadToFirebase } from "@/js/services/firebaseUpload";
// import LottieAnimation from "lottie-vuejs/src/LottieAnimation.vue";

export default {
  // components: {
  //   LottieAnimation,
  // },
  setup() {
    const tutorials = ref([]);
    const isEdit = ref(false);
    const imageSize = ref(0);
    const file = ref(null);
    const formData = reactive({
      type: "",
      name: "",
      image: "",
      img: "", //video or image
    });
    const isLoading = ref(true);

    const tutorialKeys = computed(() => {
      return Object.keys(tutorials.value).filter((key) => key !== "id");
    });

    onMounted(() => {
      isLoading.value = true;
      TutorialService.fetchTutorials()
        .then((response) => {
          tutorials.value = response.data[0];
          setTimeout(() => {
            isLoading.value = false;
          }, 1500);
        })
        .catch((e) => {
          console.log(e);
        });
    });

    const uploadImage = (e) => {
      const image = e.target.files[0];
      file.value = image;
      const reader = new FileReader();
      imageSize.value = image.size;
      reader.readAsDataURL(image);
      reader.onload = () => {
        formData.image = reader.result;
        // this.$refs.avatar_preview.src = reader.result;
      };
    };

    const submitForm = async () => {
      //upload image to firebase storage
      formData.image = await uploadToFirebase(file.value, "Avatar");
      await TutorialService.updateTutorials({
        type: formData.type,
        name: formData.name,
        id: tutorials.value.id,
        image: formData.image,
        img: formData.img,
      }).then((response) => {
        console.log(response.data);
      });
    };

    const createTutorials = async () => {
      await TutorialService.createTutorials({
        type: formData.type,
        name: formData.name,
      }).then((response) => {
        console.log(response.data);
      });
    };

    return {
      tutorials,
      submitForm,
      uploadImage,
      formData,
      tutorialKeys,
      createTutorials,
      isEdit,
      isLoading
    };
  },
};
</script>

<style scoped>
.grid {
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
}
</style>
