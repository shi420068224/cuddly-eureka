<template>
  <el-card class="box-card">
    <!-- 面包屑导航 -->
    <my-bread level1="数据统计" level2="数据报表"></my-bread>
    <!-- ECharts -->
    <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
    <div id="main" style="width: 100%;height:400px;"></div>
  </el-card>
</template>

<script>
var echarts = require("echarts");
export default {
  name: "report",
  data() {
    return {};
  },
  mounted() {
    this.getReports();
  },
  methods: {
    async getReports() {
      // init Echarts
      var myChart = echarts.init(document.getElementById("main"));

      // get reports data , API: reports/:type
      const res = await this.$http.get(`reports/type/1`);
      console.log(res);

      let option2 = res.data.data;

      // option
      let option1 = {
        title: {
          text: "堆叠区域图"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        }
      };

      let option = { ...option1, ...option2 };

      // setOption
      myChart.setOption(option);
    }
  }
};
</script>

<style>
#main {
  margin-top: 20px;
}
</style>
