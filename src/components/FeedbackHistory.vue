<template>
  <div class="container mx-auto px-4 py-10">
    <h2 class="base-page__heading-short">Feedback History</h2>

    <div class="base-page__inner-margin">
      <ol class="relative border-l-2 border-amber-200">
      <li
        class="mb-10 ms-4"
        v-for="(feedback, index) in feedbacks"
        :key="index"
      >
        <div
          class="absolute w-5 h-5 bg-amber-200 rounded-full mt-1.5 -start-2.5 border border-white"
        ></div>
        <time class="mb-1 text-sm font-medium leading-none text-amber-400">{{
          getDateFromTimestamp(feedback.created_at)
        }}</time>
        <h3 class="text-lg font-semibold text-gray-900">
          {{ feedback.title }}
        </h3>
        <p class="text-base font-normal text-gray-500">
          {{ feedback.content }}
        </p>
      </li>
    </ol>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import FeedbackService from "@/js/services/feedback";
import { useStore } from "vuex";
import getDateFromTimestamp from "@/js/services/date.js";

export default {
  setup() {
    const store = useStore();
    const user = computed(() => store.state.currentUserDetails);
    const feedbacks = ref([]);
    onMounted(() => {
      FeedbackService.fetchFeedback(user.value?.id).then((res) => {
        console.log(res.data);
        feedbacks.value = res.data;
      });
    });
    return { getDateFromTimestamp, feedbacks };
  },
};
</script>

<style></style>
