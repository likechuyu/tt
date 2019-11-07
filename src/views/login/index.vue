<template>
  <div class="container">
    <el-card class="box-card">
      <img src="../../assets/logo_index.png" alt />
      <el-form status-icon :model="loginForm" ref="loginForm" :rules="formis">
        <el-form-item prop="mobile">
          <el-input v-model="loginForm.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input
            style="width:240px;margin-right:8px;"
            v-model="loginForm.code"
            placeholder="请输入验证码"
          ></el-input>
          <el-button>发送验证码</el-button>
        </el-form-item>
        <el-form-item>
          <el-checkbox :value="true">我已阅读并同意用户协议和隐私条款</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button style="width:100%;" @click="logIn('loginForm')" type="primary">登陆</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import local from '@/utils/local'
export default {
  data () {
    const mobileIs = (rule, value, callback) => {
      if (/^1(3|4|5|7|8)\d{9}$/.test(value)) { callback() } else { callback(new Error('手机号格式不正确')) }
    }
    return {
      loginForm: { mobile: '13911111111', code: '246810' },
      formis: {
        mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { validator: mobileIs, trigger: 'blur' }],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { len: 6, message: '验证码是6位', trigger: 'blur' }
        ]
      }

    }
  },
  methods: {
    logIn (loginForm) {
      this.$refs[loginForm].validate(async (valid) => {
        if (valid) {
          try {
            const { data: { data } } = await this.$http.post('authorizations', this.loginForm)
            // 获取数据了
            local.setUser(data)
            this.$router.push('/')
          } catch (err) {
            this.$message.error('手机号或验证码错误')
          }
        }
      })
    }

  }
}
</script>
<style lang="less" scoped>
.container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: url("../../assets/login_bg.jpg") no-repeat center / cover;
  .el-card {
    width: 400px;
    height: 350px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    img {
      width: 200px;
      display: block;
      margin: 0 auto 30px;
    }
  }
}
</style>
