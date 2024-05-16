<template>
  <div class="container mx-auto px-4 py-10">
    <h2 class="base-page__heading-short">Dashboard</h2>
    <div class="base-page__inner-margin">
      <h3 class="font-semibold">Good Morning, {{ userDetails?.name }}!</h3>
      <div class="d-grid mb-5 p-4 text-center" v-if="userDetails">
        <div class="card" v-for="(activity, i) in activityNames" :key="activity">
          {{ activity }}
          <p v-if="userDetails[activity].length || i == 0">
            {{ i == 0 ? userDetails[activity] : getLatestElement(userDetails[activity], activity) }}
          </p>
          <template v-else><lottie-animation path="images/no_data_found.json" :width="150" :height="150" /></template>
        </div>
      </div>
      <router-link to="/detailed-analytics">Detailed Analytics</router-link><br />
      <router-link to="/feedback-history">Feedback History</router-link>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex"; import LottieAnimation from "lottie-vuejs/src/LottieAnimation.vue";


export default {
  components: {
    LottieAnimation,
  },
  setup() {
    const store = useStore();
    const userDetails = computed(() => store.state?.currentUserDetails ?? "");
    const activityNames = [
      "activeDays",
      "movementAccuracy",
      "performance",
      "growth",
    ];

    const getLatestElement = (arr, activity) => {
      const ele = arr[arr.length - 1];
      return activity != activityNames[0] ? `${ele * 100}%` : ele;
    };
    return { userDetails, activityNames, getLatestElement };
  },
};
</script>

<style scoped>
.d-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.card {
  align-items: center;
  padding: 20px;
  border: 0;
  font-weight: 600;
}

.d-grid .card:nth-child(1) {
  background: #ebf2f4;
}

.d-grid .card:nth-child(2) {
  background: #fcf2ec;
}

.d-grid .card:nth-child(3) {
  background: #faf2e7;
}

.d-grid .card:nth-child(4) {
  background: #e0ffe1;
}

.card p {
  font-size: 3.5rem;
  font-weight: bold;
}
</style>
