<template>
  <div class="container mx-auto px-4 py-10">
    <h2 class="base-page__heading-short">Trainings</h2>

    <div class="base-page__inner-margin">
      <a href="http://localhost:3000/predict-with-tfjs.html" target="_self">
        Start training now!! Pose Counter
      </a>
      <button class="primary-button" @click="isEdit = !isEdit">
        isEdit {{ isEdit }}
      </button>
      <div v-show="isEdit">
        <button class="primary-button" @click="createTutorials">
          Create Tutorials
        </button>
        <form
          v-if="tutorials"
          style="max-width: 360px"
          encType="multipart/form-data"
          @submit.prevent="submitForm"
        >
          <template v-for="name in tutorialKeys" :key="name">
            <select
              id="type"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lgblock w-full p-2.5 dark:bg-gray-700"
              @change="formData.type = $event.target.value"
            >
              <option selected>Choose a Type</option>
              <option :value="name">
                {{ name }}
              </option>
            </select>
            <select
              id="name"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lgblock w-full p-2.5"
              @change="formData.name = $event.target.value"
            >
              <option selected>Choose a Name</option>
              <option
                v-for="tutorial in Object.keys(tutorials[name])"
                :key="tutorial"
                :value="tutorial"
              >
                {{ tutorial }}
              </option>
            </select>
          </template>
          <div class="flex items-center space-x-6">
            <div class="shrink-0">
              <img
                ref="avatar_preview"
                class="h-32 w-32 object-cover rounded-full"
                :src="formData?.image"
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
          <button class="auth-page__submit-button">Update Training</button>
        </form>
      </div>
      <div v-for="name in tutorialKeys" :key="name">
        <h3 class="font-semibold py-2 text-xl">{{ name }}</h3>
        <div class="grid">
          <div v-for="tutorial in Object.keys(tutorials[name])" :key="tutorial">
            <h4 class="font-semibold py-2 text-sm">{{ tutorial }}</h4>
            <img
              :src="tutorials[name][tutorial].image"
              alt="tutorial"
              class="h-32 w-32 object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TutorialService from "@/js/services/tutorials";
import { onMounted, ref, reactive, computed } from "vue";

export default {
  setup() {
    const tutorials = ref([]);
    const isEdit = ref(false);
    const imageSize = ref(0);
    const formData = reactive({
      type: "",
      name: "",
      image: "",
    });

    const tutorialKeys = computed(() => {
      return Object.keys(tutorials.value).filter((key) => key !== "id");
    });

    onMounted(() => {
      TutorialService.fetchTutorials()
        .then((response) => {
          tutorials.value = response.data[0];
        })
        .catch((e) => {
          console.log(e);
        });
    });

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

    const submitForm = async () => {
      await TutorialService.updateTutorials({
        type: formData.type,
        name: formData.name,
        id: tutorials.value.id,
        image: formData.image,
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
    };
  },
};
</script>

<style scoped>
.grid {
  grid-template-columns: repeat(4, 1fr);
}
</style>
