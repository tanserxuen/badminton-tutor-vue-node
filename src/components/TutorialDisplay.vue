<template>
  <div class="container mx-auto px-4 py-10">
    <h2 class="base-page__heading-short">Tutorial Display - {{ tutorial }}</h2>

    <div class="base-page__inner-margin">
      <a href="http://localhost:3000/predict-with-tfjs.html" target="_self">
        Start training now!! Pose Counter
      </a><br><br>
      <video controls name="media" width="480" height="640" loop>
        <source
          src="https://firebasestorage.googleapis.com/v0/b/badmintonposecounter.appspot.com/o/Tutorials%2FVID_20231202_223410.mp4?alt=media&amp;token=0f3bc259-89c6-4bf8-a92f-d32ddf72a577"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tutorial: String,
  },
  setup() {
    return {};
  },
};
</script>

<style scoped>
video {
  object-fit: contain;
  width: 270px;
  height: 480px;
}
</style>
