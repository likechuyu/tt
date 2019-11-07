<template>
  <el-container class="home-container">
    <el-aside :width="!isOpen?'200px':'64px'">
      <!-- logo区域 -->
      <div class="logo" :class="{'logoTrigger':isOpen}"></div>
      <!-- logo end -->
      <!-- 侧边导航 -->
      <el-menu
        :default-active="$route.path"
        background-color="#002033"
        text-color="#fff"
        active-text-color="#ffd04b"
        style="border-right:none"
        :collapse-transition="false"
        :collapse="isOpen"
        router
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
      <!-- 侧边导航end -->
    </el-aside>
    <el-container>
      <el-header>
        <span @click="isTrigger" class="el-icon-s-unfold icon"></span>
        <span class="text">xxx公司xxx头条</span>
        <el-dropdown @command="handleClick">
          <span class="el-dropdown-link">
            <img class="userNameImg" :src="imgUrl" alt />
            <span class="userName" v-text="userName"></span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="setting">个人设置</el-dropdown-item>
            <el-dropdown-item command="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import local from '@/utils/local'
import eventBus from '@/utils/eventBus'

export default {

  data () {
    return {
      isOpen: false,
      userName: '',
      imgUrl: ''

    }
  },
  methods: {

    isTrigger () {
      this.isOpen = !this.isOpen
    },
    handleClick (command) {
      // if (command === 'logout') {
      //   this.logout()
      // } else {
      //   this.setting()
      // }
      this[command]()
    },
    setting () {
      this.$router.push('setting')
    },
    logout () {
      local.delUser()
      this.$router.push('/login')
    }
  },
  created () {
    let { name, photo } = local.getUser()
    this.userName = name
    this.imgUrl = photo
    eventBus.$on('updateName', (userName) => {
      this.userName = userName
    })
    eventBus.$on('updatePhoto', (photo) => {
      this.imgUrl = photo
    })
  }

}
</script>

<style scoped lang='less'>
.home-container {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  .el-aside {
    background-color: #002033;
  }
  .el-header {
    border-bottom: 1px solid #ddd;
    line-height: 60px;
    .icon {
      font-size: 30px;
      vertical-align: middle;
    }
    .text {
      margin-left: 10px;
      font-weight: 700;
      vertical-align: middle;
    }
    .el-dropdown {
      float: right;
      .userNameImg {
        width: 40px;
        height: 40px;
        vertical-align: middle;
        margin-right: 10px;
        border-radius: 50%;
      }
      .userName {
        vertical-align: middle;
        font-weight: 700;
      }
    }
  }
}
.el-aside {
  .logo {
    width: 100%;
    height: 60px;
    background: #002244 url(../../assets/logo_admin.png) no-repeat center /
      140px auto;
  }
  .logoTrigger {
    background: #002244 url(../../assets/logo_admin_01.png) no-repeat center /
      36px auto;
  }
}
</style>
