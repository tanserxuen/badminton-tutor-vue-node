<template>
  <div class="container mx-auto px-4 py-10">
    <h2 class="base-page__heading-short">Detailed Analytics</h2>
  </div>
  <div class="base-page__inner-margin">
    <template v-if="analytics != undefined">
      <div class="grid">
        <div v-for="k in Object.keys(analytics)" :key="k">
          <h3>{{ k }}</h3>
          <AnalyticCharts :chartType="'Line'" :data="analytics[k]" />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { computed } from "vue";
import AnalyticCharts from "./AnalyticCharts.vue";
import { useStore } from "vuex";

export default {
  components: {
    AnalyticCharts,
  },
  setup() {
    const store = useStore();
    const userDetails = computed(() => store.state?.currentUserDetails ?? "");
    const chartTitles = [
      "activeDaysInWeek",
      "growth",
      "movementAccuracy",
      "performance",
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
    const analytics = computed(() => {
      const user = userDetails.value;
      //get values of chartitlte from user
      return chartTitles.reduce((acc, title) => {
        let details = [];
        details = user?.[title].map((day, index) => {
          return { name: months[index], pl: day };
        });
        acc[title] = details;
        return acc;
      }, {});
    });

    return { analytics };
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
  grid-template-columns: repeat(2, 1fr);
  padding: 20px;
}
</style>
