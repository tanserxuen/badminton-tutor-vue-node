<template>
  <div class="container mx-auto px-4 py-10">
    <h2 class="base-page__heading-short">Tutorial Display - {{ tutorial }}</h2>

    <div class="base-page__inner-margin">
      <video controls name="media" width="480" height="640" loop v-if="tutorial != 'ready-position'">
        <source :src="getVideo" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div v-else>
        <img :src="tutorials[name][tutorial].image" alt="tutorial" class="object-cover" />
      </div>
    </div>
  </div>
</template>

<script>

import tutorialsJson from "../../backend/config/tutorialJson.json"
import { ref, computed } from "vue";
export default {
  props: {
    tutorial: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
  },
  setup(props) {
    const tutorials = ref({});
    tutorials.value = tutorialsJson;

    const getVideo = computed(() => {
      return tutorials.value?.[props.name]?.[props.tutorial]?.video
    })
    return { getVideo, tutorials };
  },
};
</script>

<style scoped>
video,
img {
  height: 270px;
  width: 480px;
}

video {
  object-fit: contain;
}
</style>
