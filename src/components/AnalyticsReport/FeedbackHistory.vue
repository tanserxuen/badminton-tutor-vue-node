<template>
  <div class="container mx-auto px-4 py-10">
    <h2 class="base-page__heading-short">
      <BackButton />Feedback History
    </h2>

    <div class="base-page__inner-margin">
      <p class="error-text transition-all" v-if="errorText">{{ errorText }}</p>
      <div class="columns-2 my-5">
        <div>
          <label for="startDate" name="startDate">Start Date</label>
          <input type="date" class="datepicker-input" name="startDate" id="startDate" :value="startDate"
            @input="startDate = $event.target.value" @focus="errorText = ''" :min="minDate" :max="maxDate">
        </div>
        <div>
          <label for="endDate" name="endDate">End Date</label>
          <input type="date" name="endDate" id="endDate" :value="endDate" @input="endDate = $event.target.value"
            :min="minDate" :max="maxDate" @focus="errorText = ''">
          <button type="submit" class="float-end">
            <i class="fas fa-search m-auto"></i>
          </button>
        </div>
      </div>
      <template v-if="filteredFeedbacks?.length != 0 && !isLoading">
        <div>
          <ol class="relative border-l-2 border-amber-200">
            <li class="mb-10 ms-4" v-for="(feedback, index) in filteredFeedbacks" :key="index">
              <div class="absolute w-5 h-5 bg-amber-200 rounded-full mt-1.5 -start-2.5 border border-white"></div>
              <h3 class="mb-1 text-lg font-semibold leading-none text-amber-400">{{ feedback?.title }}</h3>
              <p class="text-sm font-semibold text-gray-500 mb-3">{{ getDateFromTimestamp(feedback.created_at) }}</p>
              <ol class="card">
                <li class="text-base font-normal text-gray-500" v-for="(content, i) in feedback.content" :key="i">
                  {{ i + 1 }}. {{ content }} <br><br>
                </li>
              </ol>
            </li>
          </ol>
        </div>
        <lottie-animation path="images/loading.json" v-show="isLoading" :width="150" :height="150" />
      </template>
      <template v-else>
        <a href="http://localhost:80/test.html"
          class="text-amber-500 text-xl font-semibold underline hover:underline-offset-4">Start Training Now!</a>
        <lottie-animation path="images/no_data_found.json" :width="350" :height="350" />
      </template>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref, defineAsyncComponent, watch } from "vue";
import FeedbackService from "@/js/services/feedback";
import { useStore } from "vuex";
import getDateFromTimestamp from "@/js/services/date.js";
import LottieAnimation from "lottie-vuejs/src/LottieAnimation.vue";

export default {
  components: {
    LottieAnimation,
    BackButton: defineAsyncComponent(() => import("@/components/BackButton.vue")),
  },
  setup() {
    const store = useStore();
    const user = computed(() => store.state.currentUserDetails);
    const feedbacks = ref([]);
    const isLoading = ref(true);
    const startDate = ref("");
    const endDate = ref("");
    const errorText = ref("");

    const filteredFeedbacks = computed(() => {
      if (!startDate.value || !endDate.value || !feedbacks.value) {
        return feedbacks.value ?? [];
      }
      return feedbacks.value.filter((feedback) => {
        const feedbackDate = new Date(
          feedback.created_at._seconds * 1000 + feedback.created_at._nanoseconds / 1000000
        ).toISOString().split("T")[0];
        return feedbackDate >= startDate.value && feedbackDate <= endDate.value;
      });
    });

    const minDate = computed(() => {
      if (filteredFeedbacks.value.length == 0) return "";
      const data = Object.assign(filteredFeedbacks.value)
      const min = data.reduce((prev, current) => (prev.created_at._seconds < current.created_at._seconds ? prev : current));
      return min ? new Date(min.created_at._seconds * 1000 + min.created_at._nanoseconds / 1000000).toISOString().split("T")[0] : '';
    })

    const maxDate = computed(() => {
      if (filteredFeedbacks.value.length == 0) return "";
      const data = Object.assign(filteredFeedbacks.value)
      const max = data.reduce((prev, current) => (prev.created_at._seconds > current.created_at._seconds ? prev : current));
      return max ? new Date(max.created_at._seconds * 1000 + max.created_at._nanoseconds / 1000000).toISOString().split("T")[0] : '';
    })

    onMounted(() => {
      FeedbackService.fetchFeedback(user.value?.id).then((res) => {
        feedbacks.value = JSON.stringify(res.data) == '{}' ? [] : res.data;
        isLoading.value = false;
      });
    });

    watch([startDate, endDate], () => {
      if (startDate.value && endDate.value) {
        if (startDate.value > endDate.value)
          errorText.value = "Start date should be less than end date";
        else
          errorText.value = "";
      }
    });

    return {
      getDateFromTimestamp,
      feedbacks,
      isLoading,
      // filterRange,
      startDate,
      endDate,
      filteredFeedbacks,
      errorText,
      minDate,
      maxDate
    };
  },
};
</script>

<style scoped>
input[type="date"] {
  background: #fff url(https://cdn1.iconfinder.com/data/icons/cc_mono_icon_set/blacks/16x16/calendar_2.png) 97% 50% no-repeat;
}

input[type="date"]::-webkit-inner-spin-button {
  display: none;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  opacity: 0;
}

/* custom styles
body {
  padding: 4em;
  background: #e5e5e5;
  font: 13px/1.4 Geneva, 'Lucida Sans', 'Lucida Grande', 'Lucida Sans Unicode', Verdana, sans-serif;
} */

label {
  /* display: block; */
  margin-right: 10px;
}

input {
  border: 1px solid #c4c4c4;
  border-radius: 5px;
  background-color: #fff;
  padding: 3px 5px;
  box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.1);
  width: 190px;
}

input:focus {
  outline: 0;
  border: 0;
}
</style>
