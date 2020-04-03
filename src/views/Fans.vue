<template>
  <div class="fans-container">
    <el-card>
      <div slot="header">
        <my-bread>粉丝管理</my-bread>
      </div>
      <!-- tabs组件 -->
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="粉丝列表" name="list">
          <!-- 列表 -->
          <div class="fans_list">
            <div class="fans_item" v-for="item in list" :key="item.id.toString()">
              <el-avatar :size="80" :src="item.photo"></el-avatar>
              <p>{{item.name}}</p>
              <el-button type="primary" plain size="small">+关注</el-button>
            </div>
          </div>
          <!-- 分页 -->
          <el-pagination
            background
            layout="prev, pager, next"
            :page-size="reqParams.per_page"
            :current-page="reqParams.page"
            @current-change="changePager"
            :total="total"
          ></el-pagination>
        </el-tab-pane>
        <el-tab-pane label="粉丝画像" name="img">
          <div ref="main" style="width: 600px;height:400px;"></div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "my-fans",
  data() {
    return {
      // tabs的当前激活选项卡的name属性值
      activeName: "img",
      reqParams: {
        page: 1,
        per_page: 24
      },
      list: [],
      total: 0
    };
  },
  created() {
    this.getFansList();
  },
  // dom生成完毕后会执行的回调函数（钩子函数）
  mounted() {
    this.initBar();
  },
  methods: {
    // 初始化 柱状图
    async initBar() {
      const myChart = echarts.init(this.$refs.main);
      const option = {
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            // x坐标的刻度说明文字
            data: [],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "直接访问",
            type: "bar",
            barWidth: "60%",
            // 图表的每一个柱子需要数据
            data: []
          }
        ]
      };

      // 1. 获取后台统计数据
      const {
        data: { data }
      } = await this.$http.get("statistics/followers");
      // 2. 修改配置项中的数据
      // data === {age:{le18:200,...}}
      // xAxis[0].data 追加选项  series[0].data 追加选项
      for (const key in data.age) {
        option.xAxis[0].data.push(
          key.replace("le", "小于").replace("gt", "大于") + "岁"
        );
        option.series[0].data.push(data.age[key]);
      }
      // 3. 使用这个配置绘制
      myChart.setOption(option);
    },
    // 分页
    changePager(newPage) {
      this.reqParams.page = newPage;
      this.getFansList();
    },
    // 获取素材列表
    async getFansList() {
      const {
        data: { data }
      } = await this.$http.get("followers", { params: this.reqParams });
      this.list = data.results;
      this.total = data.total_count;
    }
  }
};
</script>

<style scoped lang='less'>
.fans_list {
  .fans_item {
    width: 120px;
    height: 170px;
    border: 1px dashed #ddd;
    text-align: center;
    padding-top: 10px;
    display: inline-block;
    margin-right: 30px;
    margin-bottom: 30px;
    p {
      margin: 10px 0;
    }
  }
}
</style>