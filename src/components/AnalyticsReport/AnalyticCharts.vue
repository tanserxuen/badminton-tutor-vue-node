<template>
  <div class="mt-5">
    <b>{{ snakeToTitleCase(title) }}</b>
    <template v-if="!data || Object.values(data).length === 0">
      <a href="http://localhost:80/test.html"
        class="text-amber-500 text-xl font-semibold underline hover:underline-offset-4">Start Training Now!</a>
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
      <canvas id="myLineChart" width="380" height="180">
      </canvas>
    </template>
    <template v-else-if="chartType === 'PolarArea' && data">
      <PolarAreaChart :chartData="polarAreaData" />
    </template>
  </div>
</template>

<script>
import {
  Chart as VueChart,
  Grid,
  Bar,
} from "vue3-charts";
import { computed, onMounted, ref } from "vue";
import { PolarAreaChart } from 'vue-chart-3';
import { Chart, registerables } from "chart.js";
import { snakeToTitleCase } from "@/js/services/sentence";

Chart.register(...registerables);

export default {
  components: {
    VueChart,
    Grid,
    Bar,
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

    const polarAreaData = computed(() => {
      const arrLength = Object.keys(props.data).length;
      return {
        labels: Object.keys(props.data),
        datasets: [
          {
            data: Object.values(props.data),
            backgroundColor: [...colorPalette].slice(0, arrLength),
          },
        ],
      }
    });

    const createLineChart = () => {
      const ctx = document.getElementById('myLineChart').getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: props.data.noOfTrials,
          datasets: props.data.datasets
        }, options: {
          scales: {
            y: {
              display: true,
            },
            x: {
              display: true, ticks: {
                // Include a dollar sign in the ticks
                callback: function (value) {
                  return '#' + value;
                }
              }
            }
          }
        }
      });
    }

    onMounted(() => {
      if (props.chartType === 'Line') {
        createLineChart();
      }
    });

    return {
      direction,
      margin,
      polarAreaData,
      snakeToTitleCase,
    };
  },
};
</script>

<style scoped>
:deep.chart {
  text-align: center;
}
</style>
