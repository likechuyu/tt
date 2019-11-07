<template>
  <div class="container">
    <el-row>
      <el-col :span="12">
        <el-form label-width="120px">
          <el-form-item label="编号：">{{userInfo.id}}</el-form-item>
          <el-form-item label="手机：">{{userInfo.mobile}}</el-form-item>
          <el-form-item label="媒体名称：">
            <el-input v-model="userInfo.name"></el-input>
          </el-form-item>
          <el-form-item label="媒体介绍：">
            <el-input v-model="userInfo.intro" type="textarea" :rows="3"></el-input>
          </el-form-item>
          <el-form-item label="邮箱：">
            <el-input v-model="userInfo.email"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="save">保存设置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <el-upload
          :http-request="updatePhoto"
          class="avatar-uploader"
          action=" "
          :show-file-list="false"
          name="image"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <p class="text-p">修改头像</p>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import local from '@/utils/local'
import eventBus from '@/utils/eventBus'

export default {
  data () {
    return {
      userInfo: { intro: null, email: null, name: null },
      imageUrl: null
    }
  },
  methods: {
    async   getInfo () {
      const { data: { data } } = await this.$http.get('user/profile')
      this.userInfo = data
      this.imageUrl = data.photo
    },
    async save () {
      await this.$http.patch('user/profile', { name: this.userInfo.name, intro: this.userInfo.intro, email: this.userInfo.email })
      this.$message.success('保存用户信息成功')
      const user = local.getUser()
      user.name = this.userInfo.name
      local.setUser(user)
      eventBus.$emit('updateName', this.userInfo.name)
    },
    async updatePhoto (result) {
      const file = result.file
      const formData = new FormData()
      formData.append('photo', file)
      const { data: { data } } = await this.$http.patch('user/photo', formData)
      this.imageUrl = data.photo
      this.$message.success('修改头像成功')
      eventBus.$emit('updatePhoto', data.photo)
      const user = local.getUser()
      user.photo = data.photo
      local.setUser(user)
    }
  },
  created () {
    this.getInfo()
  }
}
</script>

<style scoped lang='less'>
.text-p {
  text-align: center;
}
</style>
