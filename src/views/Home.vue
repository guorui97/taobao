<template>
  <!-- 全屏容器 -->
  <el-container class="home-container">
    <!-- 侧边栏 -->
    <el-aside class="my-aside" :width="isOpen?'200px':'64px'">
      <!-- logo -->
      <div class="logo" :class="{minLogo:!isOpen}"></div>
      <!-- 导航菜单 -->
      <el-menu
        router
        :collapse="!isOpen"
        :collapse-transition="false"
        style="border-right:none"
        :default-active="$route.path"
        background-color="#002233"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
        <el-menu-item index="/">
          <i class="el-icon-s-home"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-menu-item index="/article">
          <i class="el-icon-document"></i>
          <span slot="title">内容管理</span>
        </el-menu-item>
        <el-menu-item index="/image">
          <i class="el-icon-picture"></i>
          <span slot="title">素材管理</span>
        </el-menu-item>
        <el-menu-item index="/publish">
          <i class="el-icon-s-promotion"></i>
          <span slot="title">发布文章</span>
        </el-menu-item>
        <el-menu-item index="/comment">
          <i class="el-icon-chat-dot-round"></i>
          <span slot="title">评论管理</span>
        </el-menu-item>
        <el-menu-item index="/fans">
          <i class="el-icon-present"></i>
          <span slot="title">粉丝管理</span>
        </el-menu-item>
        <el-menu-item index="/setting">
          <i class="el-icon-setting"></i>
          <span slot="title">个人设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <!-- 右侧主体 -->
    <el-container>
      <!-- 头部内容 -->
      <el-header class="my-header">
        <!-- 图标 -->
        <span class="el-icon-s-fold icon" @click="toggleAside()"></span>
        <!-- 文字 -->
        <span class="text">江苏传智播客科技教育有限公司</span>
        <!-- 下拉菜单组件 -->
        <el-dropdown class="my-dropdown" @command="handleClick">
          <span class="el-dropdown-link">
            <!-- 头像 -->
            <img class="user-avatar" :src="userPhoto" />
            <!-- 名字 -->
            <span class="user-name">{{userName}}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="setting" icon="el-icon-setting">个人设置</el-dropdown-item>
            <el-dropdown-item command="logout" icon="el-icon-unlock">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <!-- 主体内容 -->
      <el-main>
        <!-- 二级路由对应组件显示的容器 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import eventBus from "@/utils/eventBus";
import auth from "@/utils/auth";
export default {
  name: "my-home",
  data() {
    return {
      // 侧边栏是不是展开状态，默认展开
      isOpen: true,
      // 用户名
      userName: "",
      // 用户头像
      userPhoto: ""
    };
  },
  created() {
    // 1. 从本地存储中获取数据
    const user = auth.getUser();
    // 2. 给data中数据赋值
    this.userName = user.name;
    this.userPhoto = user.photo;
    // 接收Setting组件的传的用户名称的值
    eventBus.$on("updateUserName", data => {
      this.userName = data;
    });
    // 接收Setting组件的传的用户头像的值
    eventBus.$on("updateUserPhoto", data => {
      this.userPhoto = data;
    });
  },
  methods: {
    // 切换侧边栏展开与收起
    toggleAside() {
      this.isOpen = !this.isOpen;
    },
    // 跳转个人设置
    setting() {
      this.$router.push("/setting");
    },
    // 进行退出
    logout() {
      // 1. 清除用户信息
      auth.delUser();
      // 2. 跳转到登录页面
      this.$router.push("/login");
    },
    // 点击下拉选项处理函数
    handleClick(command) {
      // 判断你点击的是 个人设置还是退出登录
      // console.log(command)
      // 逻辑：if (command==='setting') 设置
      // 逻辑：if (command==='logout') 登录
      // command 正好就是你要执行的函数名称
      this[command]();
    }
  }
};
</script>

<style scoped lang='less'>
.home-container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  .my-aside {
    background: #002233;
    .logo {
      width: 100%;
      height: 60px;
      background: #002244 url(../assets/logo_admin.png) no-repeat center / 140px
        auto;
    }
    // 覆盖background 的图片和大小，类书写在logo的下方。
    .minLogo {
      background-image: url(../assets/logo_admin_01.png);
      background-size: 36px auto;
    }
  }
  .my-header {
    border-bottom: 1px solid #ddd;
    line-height: 60px;
    .icon {
      font-size: 24px;
      vertical-align: middle;
    }
    .text {
      vertical-align: middle;
      padding-left: 10px;
    }
    .my-dropdown {
      float: right;
      .user-avatar {
        width: 30px;
        height: 30px;
        vertical-align: middle;
      }
      .user-name {
        font-weight: bold;
        vertical-align: middle;
        padding-left: 5px;
      }
    }
  }
}
</style>