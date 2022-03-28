<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <Detail title="总销售量" content="￥ 126560">
          <template slot="charts">
            <div>
              <span>周同比 56.56% &nbsp; 日同比 56.65%</span>
            </div>
          </template>
          <template slot="footer">
            <div>
              <span>日销售额：￥12312</span>
            </div>
          </template>
        </Detail>
      </el-col>
      <el-col :span="6">
        <Detail title="访问量" content="88460">
          <template slot="charts">
            <LineEcharts></LineEcharts>
          </template>
          <template slot="footer">
            <div>
              <span>日访问量：1024</span>
            </div>
          </template>
        </Detail>
      </el-col>
      <el-col :span="6">
        <Detail title="支付笔数">

        </Detail>
      </el-col>
      <el-col :span="6">
        <Detail title="运营活动效果"></Detail>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from "./Detail";
import LineEcharts from "./LineEcharts";
export default {
  name: "card",
  components: {
    Detail,LineEcharts
  },
};
</script>

<style>
</style>