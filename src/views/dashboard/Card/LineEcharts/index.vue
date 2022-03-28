<template>
  <div class="echarts" ref="echarts"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  mounted() {
    let lineEcharts = echarts.init(this.$refs.echarts);
    lineEcharts.setOption({
      xAxis: {
        show: false,
        type: "category",
      },
      yAxis: {
        show: false,
      },
      series: [
        {
          // 平滑曲线
          smooth:true,
          type: "line",
          data: [10, 70, 43, 54, 23, 23, 54, 65, 34, 23, 54],
          // 拐点的样式设置
          itemStyle: {
            opacity: 0,
          },
          // 线条的样式
          lineStyle: {
            color: "purple",
          },
          // 填充颜色设置
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "purple", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#fff", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        },
      ],
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
    });
  },
};
</script>

<style scoped>
.echarts {
  width: 100%;
  height: 100%;
}
</style>