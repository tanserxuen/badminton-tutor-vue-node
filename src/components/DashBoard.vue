<template>
  <div>
    <h1
      class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl"
    >
      Dashboard
    </h1>
    <h3 class="font-semibold">Good Morning, {{ userDetails?.name }}!</h3>
    <div class="d-grid mb-5 p-4 text-center">
      <div class="card" v-for="activity in activityNames" :key="activity">
        {{ activity }}
        <p>
          {{ userDetails[activity]?.last ?? 0 }}
        </p>
      </div>
    </div>
    <router-link to="/feedback-history">Feedback History</router-link><br>
    <router-link to="/detailed-analytics">Detailed Analytics</router-link>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const userDetails = computed(() => store.state?.currentUserDetails ?? "");
    const activityNames = [
      "activeDaysInWeek",
      "movementAccuracy",
      "performance",
      "growth",
    ];
    return { userDetails, activityNames };
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
