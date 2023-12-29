<script lang="ts">
import { use } from "echarts/core";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import { GridComponent } from "echarts/components";
import VChart from "vue-echarts";
import { ref, defineComponent } from "vue";

use([GridComponent, LineChart, CanvasRenderer, UniversalTransition]);

export default defineComponent({
  // A type helper for defining a Vue component with type inference
  name: "AreaChart",
  components: {
    VChart,
  },

  props: ["values", "width", "height", "color"],

  setup(props) {
    // Constitution des groupes de valeurs pour les deux axes
    props.values.sort(function (a: any, b: any) {
      return a.timestamp - b.timestamp; // On trie les mesures chronologiquement (la plus ancienne sera à gauche du graphique)
    });

    const date_mesure: string = props.values.map((v: any) => {
      const row: string = v.date_mesure.substr(5, 2) + "-" + v.date_mesure.substr(0, 4);
      return row;
    });

    const profondeur_nappe: number = props.values.map((v: any) => {
      const row: number = Number(v.profondeur_nappe_eau);
      return row;
    });

    const option = ref({
      grid: {
        left: 30,
        bottom: 20,
        right: 45,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: date_mesure,
      },
      yAxis: {
        type: "value",
        position: "right",
        min: "0",
        max: "dataMax",
      },
      textStyle: {
        fontFamily: "gotham-Book",
        color: "#000",
      },
      series: [
        {
          data: profondeur_nappe,
          symbol: "none",
          type: "line",
          lineStyle: {
            color: props.color,
            opacity: 1,
            width: 1,
          },
          areaStyle: {
            color: props.color,
            opacity: 0.05,
          },
        },
      ],
    });
    const init_options = ref({
      width: props.width,
      height: props.height,
    });

    return { option, init_options };
  },
});
</script>

<template>
  <v-chart class="chart" :option="option" :init-options="init_options" />
</template>

<style scoped>
.chart {
  height: 100vh;
}
</style>
