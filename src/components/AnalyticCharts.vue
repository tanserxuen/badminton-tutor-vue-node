<template>
  <div>
    <template v-if="chartType === 'Bar' && data.length != 0">
      <VueChart :data="data" :margin="margin" :direction="direction">
        <template #layers>
          <Grid strokeDasharray="2,2" />
          <Bar :dataKeys="['name', 'pl']" :barStyle="{ fill: '#90e0ef' }" />
        </template>
      </VueChart>
    </template>
    <template v-else-if="chartType === 'Line' && data.length != 0">
      <VueChart
        :size="{ width: 300, height: 210 }"
        :data="data"
        :margin="margin"
        :direction="direction"
        :axis="axis"
      >
        <template #layers>
          <Grid strokeDasharray="2,2" />
          <Area
            :dataKeys="['name', 'pl']"
            type="monotone"
            :areaStyle="{ fill: 'url(#grad)' }"
          />
          <Line
            :dataKeys="['name', 'pl']"
            type="monotone"
            :lineStyle="{
              stroke: '#9f7aea',
            }"
          />
          <Marker
            v-if="marker"
            :value="1000"
            label="Mean."
            color="green"
            strokeWidth="2"
            strokeDasharray="6 6"
          />
          <defs>
            <linearGradient id="grad" gradientTransform="rotate(90)">
              <stop offset="0%" stop-color="#be90ff" stop-opacity="1" />
              <stop offset="100%" stop-color="white" stop-opacity="0.4" />
            </linearGradient>
          </defs>
        </template>

        <template #widgets>
          <Tooltip
            borderColor="#48CAE4"
            :config="{
              pl: { color: '#9f7aea' },
              avg: { hide: true },
              inc: { hide: true },
            }"
          />
        </template>
      </VueChart>
    </template>
    <template v-else>
      <div class="chart">No data available</div>
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
import { ref } from "vue";

//create a props named type
export default {
  components: { VueChart, Grid, Bar, Line, Tooltip, Marker, Area },
  props: {
    chartType: {
      type: String,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
  },
  setup() {
    const direction = ref("horizontal");
    const margin = ref({
      left: 0,
      top: 20,
      right: 0,
      bottom: 20,
    });

    return { direction, margin };
  },
};
</script>

<style scoped>
:deep .chart {
  text-align: center;
}
</style>
