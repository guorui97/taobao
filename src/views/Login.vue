<template>
  <div class="login-container">
    <el-card class="my-card">
      <img src="../assets/logo_index.png" alt />
      <!-- 表单 -->
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" status-icon>
        <el-form-item prop="mobile">
          <el-input v-model="loginForm.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input
            v-model="loginForm.code"
            placeholder="请输入验证码"
            style="width:240px;margin-right:8px"
          ></el-input>
          <el-button>发送验证码</el-button>
        </el-form-item>
        <el-form-item>
          <el-checkbox :value="true">我已阅读并同意用户协议和隐私条款</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button @click="login()" type="primary" style="width:100%">登 录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// 导入工具模块
import auth from "@/utils/auth";
export default {
  name: "my-login",
  data() {
    // 自定义校验函数
    const checkMobile = (rule, value, callback) => {
      // 校验value的值，它必须符合手机格式
      // 格式：1 开头，第二个数字 3-9 之间，9个数字结尾
      if (/^1[3-9]\d{9}$/.test(value)) {
        callback();
      } else {
        callback(new Error("手机号格式不对"));
      }
    };
    return {
      // 登录表单数据对象
      loginForm: {
        mobile: "13911111111",
        code: "246810"
      },
      // 校验规则对象
      loginRules: {
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" }, // 必填
          // 指定一个自定义校验函数，失去焦点后触发。
          { validator: checkMobile, trigger: "blur" }
        ],
        code: [
          { required: true, message: "请输入验证码", trigger: "blur" }, // 必填
          { len: 6, message: "验证码6个字符", trigger: "blur" } // 长度是6
        ]
      }
    };
  },
  methods: {
    // 登录函数
    login() {
      // 登录前，对整体表单进行校验
      // this.$refs.loginForm  就是组件实例
      this.$refs.loginForm.validate(valid => {
        // valid 代表整体表单是否校验成功
        if (valid) {
          // 校验成功，进行登录
          // console.log('进行登录')
          this.$http
            .post("authorizations", this.loginForm)
            .then(res => {
              // 登录成功
              // 存储用户信息 res === {data:{message:'提示信息',data:'用户信息对象'}}
              // res.data 是响应主体，响应主体才是后台返回的数据
              auth.setUser(res.data.data);
              // 跳转到首页
              this.$router.push("/");
            })
            .catch(() => {
              // 错误提示
              this.$message.error("手机号或验证码错误");
            });
        }
      });
    }
  }
};
</script>

<style scoped lang='less'>
// 全屏容器
.login-container {
  position: absolute;
  left: 0;
  top: 0;
  // 让高度和宽度直接继承窗口大小
  width: 100%;
  height: 100%;
  background: url(../assets/login_bg.jpg) no-repeat center / cover;
  .my-card {
    width: 400px;
    height: 350px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -60%);
    img {
      display: block;
      width: 200px;
      margin: 0 auto 20px;
    }
  }
}
</style>