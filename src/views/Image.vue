<template>
  <div class="images-container">
    <el-card>
      <div slot="header">
        <my-bread>素材管理</my-bread>
      </div>
      <!-- 按钮栏 -->
      <div class="btn_box">
        <el-radio-group @change="changeCollect()" v-model="reqParams.collect" size="small">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <el-button @click="openAddImgDialog()" type="success" size="small" style="float:right">添加素材</el-button>
      </div>
      <!-- 图片列表 -->
      <div class="img_list">
        <div class="img_item" v-for="item in images" :key="item.id">
          <img :src="item.url" alt />
          <div class="option" v-if="!reqParams.collect">
            <span
              @click="toggleStatus(item)"
              class="el-icon-star-off"
              :style="{color:item.is_collected?'red':'#fff'}"
            ></span>
            <span @click="deleteImage(item.id)" class="el-icon-delete"></span>
          </div>
        </div>
      </div>
      <!-- 分页 -->
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="changePager"
        :page-size="reqParams.per_page"
        :current-page="reqParams.page"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 对话框 -->
    <el-dialog title="添加素材" :visible.sync="dialogVisible" width="300px">
      <el-upload
        class="avatar-uploader"
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        name="image"
        :headers="headers"
        :show-file-list="false"
        :on-success="uploadImageSuccess"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import auth from "@/utils/auth";
export default {
  name: "my-image",
  data() {
    return {
      // 查询素材参数
      reqParams: {
        // 默认查询全局 false 收藏 true
        collect: false,
        page: 1,
        per_page: 10
      },
      // 素材列表
      images: [],
      // 总条数
      total: 0,
      // 控制对话框显示隐藏
      dialogVisible: false,
      // 上传成功后图片地址（预览）
      imageUrl: null,
      // 上传组件的请求头
      headers: {
        Authorization: `Bearer ${auth.getUser().token}`
      }
    };
  },
  created() {
    this.getImages();
  },
  methods: {
    // 上传图片成功
    uploadImageSuccess(res) {
      // 预览
      this.imageUrl = res.data.url;
      // 提示
      this.$message.success("上传素材成功");
      // 3s后
      window.setTimeout(() => {
        // 关闭对话框
        this.dialogVisible = false;
        // 更新第一页
        this.reqParams.page = 1;
        this.getImages();
        // 考虑：重新打开对话框的时候，看到加号图标，而不是之前预览的图片
        this.imageUrl = null;
      }, 3000);
    },
    // 打开添加素材对话框
    openAddImgDialog() {
      // 1. 准备对话框
      // 2. 才能打开它
      this.dialogVisible = true;
    },
    // 删除图片素材
    deleteImage(id) {
      this.$confirm("此操作将永久删除该图片素材, 是否继续?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 点击确认
          try {
            // 请求
            await this.$http.delete(`user/images/${id}`);
            // 成功提示
            this.$message.success("删除成功");
            // 更新当前页素材列表
            this.getImages();
          } catch (e) {
            // 失败提示
            this.$message.error("删除失败");
          }
        })
        .catch(() => {});
    },
    // 切换 添加收藏 与 取消收藏
    async toggleStatus(item) {
      try {
        // 修改请求
        const {
          data: { data }
        } = await this.$http.put(`user/images/${item.id}`, {
          collect: !item.is_collected
        });
        // data.collect 修改后的图片状态
        // 提示
        this.$message.success(data.collect ? "添加收藏成功" : "取消收藏成功");
        // 视图：收藏按钮颜色样式
        // item 就是渲染当前图片的，修改item即可驱动视图修改
        item.is_collected = data.collect;
      } catch (e) {
        this.$message.error("操作失败");
      }
    },
    // 切换全局与收藏
    changeCollect() {
      this.reqParams.page = 1;
      this.getImages();
    },
    // 切换分页
    changePager(newPage) {
      this.reqParams.page = newPage;
      this.getImages();
    },
    // 获取素材列表
    async getImages() {
      const {
        data: { data }
      } = await this.$http.get("user/images", { params: this.reqParams });
      this.images = data.results;
      this.total = data.total_count;
    }
  }
};
</script>

<style scoped lang='less'>
// 图片列表
.img_list {
  margin-top: 20px;
  .img_item {
    width: 180px;
    height: 180px;
    border: 1px dashed #ddd;
    display: inline-block;
    position: relative;
    margin-right: 50px;
    margin-bottom: 15px;
    img {
      width: 100%;
      height: 100%;
      display: block;
    }
    .option {
      position: absolute;
      left: 0;
      bottom: 0;
      height: 30px;
      line-height: 30px;
      background: rgba(0, 0, 0, 0.3);
      text-align: center;
      width: 100%;
      color: #fff;
      span {
        margin: 0 30px;
      }
    }
  }
}
</style>