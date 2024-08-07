<template>
  <div>
    <template v-if="!isChart">
      <div class="container mx-auto px-4 pt-10 pb-0">
        <h2 class="base-page__heading-short">
          <BackButton />
          Detailed Analytics
        </h2>
      </div>
      <div class="base-page__inner-margin" v-if="analytics">
        <div class="flex justify-between items-center mx-auto" style="max-width: 400px;">
          <div class="card" style="padding-left: 2rem;">
            <b>{{ snakeToTitleCase(Object.keys(analytics)[0]) }}</b>
            <p>{{ analytics[Object.keys(analytics)[0]] }}</p>
          </div>
          <lottie-animation :path="randomLottie" :width="250" :height="250" />
        </div>
        <h3 style="text-transform: capitalize">{{ snakeToTitleCase(title) }}</h3>
        <div class="card mt-10 pb-10">
          <AnalyticCharts :chartType="'PolarArea'" :data="analytics[Object.keys(analytics)[1]]"
            :title="Object.keys(analytics)[1]" />
          <AnalyticCharts :chartType="'Line'" :data="transformedData" :title="'Accuracy Over Trials'"
            class="mx-auto py-5" style="max-width: 50vw;" />
        </div>
      </div>
      <template v-else>
        <a :href="feedbackLink"
          class="text-amber-500 text-xl font-semibold underline hover:underline-offset-4">Start Training Now!</a>
        <lottie-animation path="images/no_data_found.json" :width="350" :height="350" />
      </template>
    </template>
    <template v-if="isChart">
      <div class="chart-post" id="canvasEl" v-if="analytics">
        <h3 style="text-transform: capitalize">{{ snakeToTitleCase(title) }}</h3>
        <AnalyticCharts :chartType="'PolarArea'" :data="analytics[Object.keys(analytics)[1]]"
          :title="Object.keys(analytics)[1]" class="mx-auto" />
        <AnalyticCharts :chartType="'Line'" :data="transformedData" :title="'Accuracy Over Trials'"
          class="mx-auto py-5" />
      </div>
      <lottie-animation v-else path="images/no_data_found.json" :width="350" :height="350" />
    </template>
  </div>
</template>

<script>
import { computed, defineAsyncComponent } from "vue";
import { useStore } from "vuex";
import LottieAnimation from "lottie-vuejs/src/LottieAnimation.vue";
import { snakeToTitleCase } from "@/js/services/sentence";
import { baseURL } from "@/config.js";

export default {
  components: {
    AnalyticCharts: defineAsyncComponent(() => import("./AnalyticCharts.vue")),
    LottieAnimation,
    BackButton: defineAsyncComponent(() => import("@/components/BackButton.vue")),
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
      "movementAccuracy"
    ];

    const randomLottie = computed(() => {
      const lotties = [
        "images/badminton_clear.json",
        "images/badminton_smash.json",
        "images/badminton_lift.json",
      ];
      return lotties[Math.floor(Math.random() * lotties.length)];
    })

    const feedbackLink = computed(() => `${baseURL}test.html?id=${userDetails.value?.id}`);

    const analytics = computed(() => {
      if (!userDetails.value?.movementAccuracy || Object.keys(userDetails.value?.movementAccuracy).length==0) return null;
      const user = userDetails.value;
      //get values of chartitlte from user
      return chartTitles.reduce((acc, title, i) => {
        // return if the title is 'activeDays' or 'movementAccuracy' or user has no data for the title
        if (i == 0) {
          acc[title] = user[title];
          return acc;
        } else if (i == 1) {
          const keys = Object.keys(user[title]);
          //remove the created_at key of the latest data
          const clone = Object.assign(user[title][keys[0]]);
          delete clone.created_at;
          acc[title] = clone;
          return acc;
        }
      }, {});
    });

    const colorPalette = [
      "#FF0000", // Red
      "#FF7F00", // Orange
      "#FFFF00", // Yellow
      "#00FF00", // Green
      "#0000FF", // Blue
      "#4B0082", // Indigo
      "#8B00FF", // Violet
      "#EE82EE", // Lavender
      "#00FFFF", // Cyan
      "#FF1493", // Deep Pink
      "#FFD700", // Gold
      "#8A2BE2", // Blue Violet
      "#A52A2A", // Brown
      "#5F9EA0", // Cadet Blue
      "#D2691E", // Chocolate
      "#FF4500"  // Orange Red
    ];

    let noOfTrials = [];

    const transformedData = computed(() => {
      const input = userDetails.value?.movementAccuracy
      const labels = new Set();
      const tempData = {};

      for (const key in input) {
        const data = input[key];
        for (const [k, v] of Object.entries(data)) {
          if (k === 'created_at') continue;
          labels.add(k);
          if (!tempData[k]) {
            tempData[k] = [];
          }
          tempData[k].push(v);
        }
      }
      let a = Object.keys(tempData);
      let b = Object.values(tempData).map((data, i) => {
        noOfTrials.push(i + 1);
        return {
          label: a[i],
          data,
          fill: false,
          tension: 0.1,
          borderColor: colorPalette[i],
          backgroundColor: colorPalette[i],
        }
      });
      // let c = Object.values(input).map(data => {
      //   //convert to date in dd-mm-yyyy format
      //   if (!data.created_at) return null;
      //   const date = new Date(data.created_at._seconds * 1000);
      //   return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
      // }).filter(data => !!data);

      return {
        labels: a,
        datasets: b,
        noOfTrials
      };

    })

    return {
      analytics,
      randomLottie,
      snakeToTitleCase,
      transformedData,
      feedbackLink
    };
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
