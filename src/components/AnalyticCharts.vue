<template>
  <div>
    <b>{{ snakeToTitleCase(title) }}</b>
    <template v-if="!data">
      <lottie-animation path="images/no_data_found.json" :width="150" :height="150" />
    </template>
    <template v-else-if="chartType === 'Bar' && data">
      <VueChart :data="data" :margin="margin" :direction="direction" :size="{ width: 300, height: 210 }">
        <template #layers>
          <Grid strokeDasharray="2,2" />
          <Bar :dataKeys="['name', 'pl']" :barStyle="{ fill: '#90e0ef' }" />
        </template>
      </VueChart>
    </template>
    <template v-else-if="chartType === 'Line' && data">
      <VueChart :size="{ width: 300, height: 210 }" :data="data" :margin="margin" :direction="direction" :axis="axis">
        <template #layers>
          <Grid strokeDasharray="2,2" />
          <Area :dataKeys="['name', 'pl']" type="monotone" :areaStyle="{ fill: 'url(#grad)' }" />
          <Line :dataKeys="['name', 'pl']" type="monotone" :lineStyle="{
            stroke: '#9f7aea',
          }" />
          <Marker v-if="marker" :value="1000" label="Mean." color="green" strokeWidth="2" strokeDasharray="6 6" />
          <defs>
            <linearGradient id="grad" gradientTransform="rotate(90)">
              <stop offset="0%" stop-color="#be90ff" stop-opacity="1" />
              <stop offset="100%" stop-color="white" stop-opacity="0.4" />
            </linearGradient>
          </defs>
        </template>

        <template #widgets>
          <Tooltip borderColor="#48CAE4" :config="{
            pl: { color: '#9f7aea' },
            avg: { hide: true },
            inc: { hide: true },
          }" />
        </template>
      </VueChart>
    </template>
    <template v-else-if="chartType === 'PolarArea' && data">
      <PolarAreaChart :chartData="testData" />
    </template>
  </div>
</template>

<script>
import {
  Chart as VueChart,
  Grid,
  Bar,
  Line,
  Tooltip,
  Marker,
  Area,
} from "vue3-charts";
import { computed, ref } from "vue";
import LottieAnimation from "lottie-vuejs/src/LottieAnimation.vue";
import { PolarAreaChart } from 'vue-chart-3';
import { Chart, registerables } from "chart.js";
import { snakeToTitleCase } from "@/js/services/sentence";


Chart.register(...registerables);

//create a props named type
export default {
  components: {
    VueChart,
    Grid,
    Bar,
    Line,
    Tooltip,
    Marker,
    Area,
    LottieAnimation,
    PolarAreaChart
  },
  props: {
    chartType: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    data: {
      type: Array,
      required: false,
    },
  },
  setup(props) {
    const direction = ref("horizontal");
    const margin = ref({
      left: 0,
      top: 20,
      right: 0,
      bottom: 20,
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

    const testData = computed(() => {
      if (!props.data) return null;
      if (props.title !== 'movementAccuracyObj') return null;
      const arrLength = Object.keys(props.data).length;
      return {
        labels: Object.keys(props.data).map(e => snakeToTitleCase(e).replace("-", " ")),
        datasets: [
          {
            data: Object.values(props.data),
            backgroundColor: [...colorPalette].slice(0, arrLength),
          },
        ],
      }
    });

    return {
      direction,
      margin,
      testData,
      snakeToTitleCase
    };
  },
};
</script>

<style scoped>
:deep .chart {
  text-align: center;
}
</style>
