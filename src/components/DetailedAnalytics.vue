<template>
  <div :style="isChart ? 'transform: translateX(-40%);' : null">
    <!-- <button @click="getScreenShot">Get Canvas</button> -->
    <template v-if="!isChart">
      <div class="container mx-auto px-4 pt-10 pb-0">
        <h2 class="base-page__heading-short">
          <BackButton />
          Detailed Analytics
        </h2>
      </div>
      <div class="base-page__inner-margin">
        <div class="flex justify-between items-center mx-auto" style="max-width: 400px;">
          <div class="card" style="padding-left: 2rem;">
            <b>{{ snakeToTitleCase(Object.keys(analytics)[0]) }}</b>
            <p>{{ analytics[Object.keys(analytics)[0]] }}</p>
          </div>
          <lottie-animation :path="randomLottie" :width="250" :height="250" />
        </div>
        <template v-if="analytics">
          <h3 style="text-transform: capitalize">{{ snakeToTitleCase(title) }}</h3>
          <!-- <div class="grid"> -->
          <div class="card mt-10">
            <AnalyticCharts :chartType="'PolarArea'" :data="analytics[Object.keys(analytics)[1]]"
              :title="Object.keys(analytics)[1]" />
          </div>
          <!-- <AnalyticCharts :chartType="'Line'" :data="analytics[Object.keys(analytics)[2]]"
              :title="Object.keys(analytics)[2]" />
            <AnalyticCharts :chartType="'Line'" :data="analytics[Object.keys(analytics)[3]]"
              :title="Object.keys(analytics)[3]" /> -->
          <!-- </div> -->
        </template>
      </div>
    </template>
    <template v-if="isChart">
      <div class="grid" id="canvasEl">
        <div v-for="title in Object.keys(analytics)" :key="title">
          <h3 style="text-transform: capitalize">{{ snakeToTitleCase(title) }}</h3>
          <AnalyticCharts :chartType="'Line'" :data="analytics[title]" v-if="analytics[title].length" />
          <div v-else>
            <lottie-animation path="images/no_data_found.json" :width="250" :height="250" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { computed } from "vue";
import AnalyticCharts from "./AnalyticCharts.vue";
import { useStore } from "vuex";
import LottieAnimation from "lottie-vuejs/src/LottieAnimation.vue";
import { snakeToTitleCase } from "../js/services/sentence";
import BackButton from "./BackButton.vue";

export default {
  components: {
    AnalyticCharts,
    LottieAnimation,
    BackButton,
  },
  props: {
    isChart: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  setup() {
    const store = useStore();
    const userDetails = computed(() => store.state?.currentUserDetails ?? "");
    const chartTitles = [
      "activeDays",
      "movementAccuracyObj",
      // "performance",
      // "growth",
    ];

    const months = [
      "Jan",
      "Feb",
      "Apr",
      "Mar",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const randomLottie = computed(() => {
      const lotties = [
        "images/badminton_clear.json",
        "images/badminton_smash.json",
        "images/badminton_lift.json",
      ];
      return lotties[Math.floor(Math.random() * lotties.length)];
    })

    const analytics = computed(() => {
      if (!userDetails.value) return [];
      const user = userDetails.value;
      //get values of chartitlte from user
      return chartTitles.reduce((acc, title, idx) => {
        // return if the title is 'activeDays' or 'movementAccuracyObj' or user has no data for the title
        if (idx == 0 || idx == 1) {
          acc[title] = user[title];
          return acc;
        }
        if (!user[title] || !user[title]?.length) {
          acc[title] = null;
          return acc;
        }
        let details = [];
        details = user?.[title]?.map((day, index) => {
          return { name: months[index], pl: day };
        });
        acc[title] = details;
        return acc;
      }, {});
    });

    return { analytics, randomLottie, snakeToTitleCase };
  },
};
</script>

<style scoped>
div {
  text-align: center;
}

h3 {
  margin-top: 10px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(250px, 1fr));
  padding: 20px;
  width: fit-content;
  column-gap: 50px;
  row-gap: 30px;
  margin: auto;
}

.card p {
  font-size: 3.5rem;
  font-weight: bold;
}
</style>
