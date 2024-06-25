<template>
  <div class="container mx-auto px-4 py-10">
    <h2 class="base-page__heading-short">Dashboard</h2>
    <div class="base-page__inner-margin">
      <h3 class="font-semibold">Good Morning, {{ userDetails?.name }}!</h3>
      <div class="d-grid mb-5 py-4 text-center" v-if="userDetails && !isLoading">
        <div class="card" v-for="(activity, i) in activityNames" :key="activity">
          {{ snakeToTitleCase(activity) }}
          <template v-if="userDetails[activity]?.length && i > 1">
            <p> {{ getLatestElement(userDetails[activity], activity) }}</p>
          </template>
          <template v-else-if="i == 0">
            <p>{{ userDetails[activity] }}</p>
            <small>per {{ totalRegisteredDays }} days</small>
          </template>
          <template v-else-if="i == 1">
            <p> {{ getHighestScore.maxValue }} </p>
            <small>{{ snakeToTitleCase(getHighestScore.maxKey) }}</small>
          </template>
          <template v-else>
            <lottie-animation path="images/no_data_found.json" :width="350" :height="350" />
          </template>
        </div>
      </div>
      <lottie-animation path="images/loading.json" v-show="isLoading" :width="150" :height="150" />

      <router-link to="/detailed-analytics">
        <div class="bar">Detailed Analytics
          <i class="fas fa-chevron-right"></i>
        </div>
      </router-link>
      <router-link to="/feedback-history">
        <div class="bar">
          Feedback History
          <i class="fas fa-chevron-right"></i>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import LottieAnimation from "lottie-vuejs/src/LottieAnimation.vue";
import { snakeToTitleCase } from "@/js/services/sentence";

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
    ];
    const isLoading = computed(() => !userDetails.value);

    const getLatestElement = (arr, activity) => {
      const ele = arr[arr.length - 1];
      return activity != activityNames[0] ? `${ele * 100}%` : ele;
    };

    const totalRegisteredDays = computed(() => {
      const registeredDate = new Date(userDetails.value.created_at._seconds * 1000);
      const today = Date.now();
      // calculate the difference between the two dates in days
      const diffInTime = today - registeredDate;
      const diffInDays = diffInTime / (1000 * 3600 * 24);
      return Math.floor(diffInDays);
    });

    const getHighestScore = computed(() => {
      if (!userDetails.value?.movementAccuracy) return {
        maxKey: 'No data found',
        maxValue: 0
      };
      let maxKey = '';
      let maxValue = -Infinity;
      const data = userDetails.value.movementAccuracy

      for (const key in data) { // eslint-disable-next-line
        if (data.hasOwnProperty(key)) {
          const entry = data[key];
          for (const subKey in entry) { // eslint-disable-next-line
          console.log(entry.hasOwnProperty(subKey), subKey)// eslint-disable-next-line
            if (entry.hasOwnProperty(subKey) && subKey !== 'created_at') {
              if (entry[subKey] > maxValue) {
                maxValue = entry[subKey].toFixed(2);
                maxKey = subKey;
              }
            }
          }
        }
      }
      return { maxKey, maxValue };
    });

    return {
      userDetails,
      isLoading,
      activityNames,
      getLatestElement,
      getHighestScore,
      totalRegisteredDays,
      snakeToTitleCase
    };
  },
};
</script>

<style scoped>
.d-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 250px));
  gap: 20px;
  overflow-x: auto;
}

.card {
  align-items: center;
  padding: 20px;
  border: 0;
  font-weight: 600;
  min-width: 195px;
  min-height: 175px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
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

.card small {
  font-size: 0.8rem;
  font-weight: normal;
}

.bar {
  display: flex;
  padding: 10px 16px;
  font-weight: 600;
  font-size: 0.9rem;
  background: white;
  border-radius: 5px;
  margin-bottom: 0.75rem;
  align-items: center;
  justify-content: space-between;
  font-family: var(--default-font-family);
}


@media screen and (max-width: 640px) {
  .card p {
    font-size: 1.8rem;
    font-weight: bold;
  }

  .card small {
    font-size: 0.7rem;
    font-weight: normal;
  }

  .card {
    font-size: 0.9rem;
    min-width: 175px;
    min-height: 165px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  .d-grid {
    grid-template-columns: repeat(auto-fit, minmax(100px, 160px));
  }
}
</style>
