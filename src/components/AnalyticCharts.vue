<template>
  <div>
    <b>{{ title }}</b>
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

    const testData = computed(() => {
      if (!props.data) return null;
      if (props.title !== 'movementAccuracyObj') return null;
      const arrLength = Object.keys(props.data).length;
      return {
        labels: Object.keys(props.data),
        datasets: [
          {
            data: Object.values(props.data),
            backgroundColor: Array.from({ length: arrLength }, () => ['#77CEFF', '#0079AF', '#123E6B', '#97B0C4', '#A5C8ED'][Math.floor(Math.random() * 5)]),
          },
        ],
      }
    });

    return {
      direction, margin,
      testData
    };
  },
};
</script>

<style scoped>
:deep .chart {
  text-align: center;
}
</style>
