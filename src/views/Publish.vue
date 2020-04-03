<template>
  <div class="publish-container">
    <el-card>
      <div slot="header">
        <my-bread>{{$route.query.id?'修改文章':'发布文章'}}</my-bread>
      </div>
      <!-- 表单 -->
      <el-form label-width="120px">
        <el-form-item label="标题：">
          <el-input v-model="articleForm.title" placeholder="请输入文章标题" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="内容：">
          <quill-editor v-model="articleForm.content" :options="editorOption"></quill-editor>
        </el-form-item>
        <el-form-item label="封面：">
          <el-radio-group @change="articleForm.cover.images=[]" v-model="articleForm.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <!-- 封面图组件 -->
          <div style="margin-top:10px" v-if="articleForm.cover.type===1">
            <my-cover v-model="articleForm.cover.images[0]"></my-cover>
          </div>
          <div style="margin-top:10px" v-if="articleForm.cover.type===3">
            <my-cover
              style="display:inline-block;margin-right:15px"
              v-model="articleForm.cover.images[i-1]"
              v-for="i in 3"
              :key="i"
            ></my-cover>
          </div>
        </el-form-item>
        <el-form-item label="频道：">
          <my-channel v-model="articleForm.channel_id"></my-channel>
        </el-form-item>
        <el-form-item v-if="$route.query.id">
          <el-button type="success">修改文章</el-button>
        </el-form-item>
        <el-form-item v-else>
          <el-button @click="addArticle(false)" type="primary">发布文章</el-button>
          <el-button @click="addArticle(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// 导入样式
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
// 导入组件
import { quillEditor } from "vue-quill-editor";
export default {
  components: {
    quillEditor
  },
  name: "my-publish",
  data() {
    return {
      // 文章表单数据对象
      articleForm: {
        title: null,
        content: null,
        cover: {
          type: 1,
          images: []
        },
        channel_id: null
      },
      // 富文本配置对象
      editorOption: {
        // 占位配置
        placeholder: "",
        modules: {
          // 配置工具栏
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            [{ header: 1 }, { header: 2 }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            ["image"]
          ]
        }
      }
    };
  },
  created() {
    // 如果地址栏上有id就是修改文章，获取文章信息填充表单
    if (this.$route.query.id) {
      this.getArticle();
    }
  },
  watch: {
    "$route.query.id": function() {
      // 监听 this.$route.query.id 的数据变化
      if (this.$route.query.id) {
        // 填充表单
        this.getArticle();
      } else {
        // 清空表单
        this.articleForm = {
          title: null,
          content: null,
          cover: {
            type: 1,
            images: []
          },
          channel_id: null
        };
      }
    }
  },
  methods: {
    // 获取文章
    async getArticle() {
      const {
        data: { data }
      } = await this.$http.get(`articles/${this.$route.query.id}`);
      this.articleForm = data;
    },
    // 添加文章
    async addArticle(draft) {
      // draft 参数，false 发布  true 草稿，正好就是后台接口需要的数据
      try {
        await this.$http.post(`articles?draft=${draft}`, this.articleForm);
        this.$message.success(draft ? "存入草稿成功" : "发布文章成功");
        this.$router.push("/article");
      } catch (e) {
        this.$message.error("操作失败");
      }
    }
  }
};
</script>

<style scoped lang='less'></style>