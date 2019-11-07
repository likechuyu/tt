<template>
  <div class="container">
    <div class="btn_box" @click="open">
      <img :src="value||defaultImage" alt />
    </div>
    <el-dialog :visible.sync="dialogVisible" width="750px">
      <el-tabs v-model="activeName" type="card">
        <!-- tab栏容器 -->
        <el-tab-pane label="素材库" name="image">
          <!-- 素材库 -->
          <div style="margin-top: 0px">
            <el-radio-group @change="toggleList" v-model="reqParams.collect" size="small">
              <el-radio-button :label="false">全部</el-radio-button>
              <el-radio-button :label="true">收藏</el-radio-button>
            </el-radio-group>
          </div>
          <!-- 列表页面 -->
          <div class="img-list">
            <div
              class="img-item"
              @click="selectedImage(item.url)"
              v-for="item in results "
              :key="item.id"
            >
              <img :src="item.url" alt />
              <div :class="{isshade:item.url==selectedImageUrl}"></div>
            </div>
          </div>
          <!-- 分页 -->
          <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            :page-size="reqParams.per_page"
            :current-page="reqParams.page"
            @current-change="pager"
          ></el-pagination>
          <!-- 素材end -->
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="upload">
          <el-upload
            class="avatar-uploader"
            :headers="headers"
            action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
            :show-file-list="false"
            name="image"
            :on-success="handleSuccess"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="okImg">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import defaultImage from '../assets/default.png'
import local from '@/utils/local'

export default {
  props: ['value'],
  name: 'my-img',
  data () {
    return {
      headers: { Authorization: `Bearer ${local.getUser().token}` },
      reqParams: {
        collect: false,
        page: 1,
        per_page: 20
      },
      selectedImageUrl: null,
      imageUrl: null,
      total: null,
      results: [],
      dialogVisible: false,
      activeName: 'image',
      defaultImage
    }
  },
  methods: {
    handleSuccess (res) {
      this.imageUrl = res.data.url
      console.log(this.imageUrl)
      this.$message.success('上传成功')
    },
    open () {
      this.dialogVisible = true
      this.getImgs()
      this.imageUrl = null
    },
    toggleList () {
      this.reqParams.page = 1
      this.getImgs()
    },
    async getImgs () {
      const { data: { data } } = await this.$http.get('user/images', { params: this.reqParams })
      this.results = data.results
      console.log(data)
      this.total = data.total_count
    },
    pager (page) {
      this.reqParams.page = page
      this.getImgs()
    },
    selectedImage (url) {
      console.log(url)
      this.selectedImageUrl = url
    },
    okImg () {
      if (this.activeName === 'image') {
        if (!this.selectedImageUrl) return this.$message.warning('请选中一张图片')
        // this.defaultImage = this.selectedImageUrl
        this.$emit('input', this.selectedImageUrl)
        this.dialogVisible = false
      } else {
        if (!this.imageUrl) {
          return this.$message.warning('请上传一张图2片')
        }
        // 给img的src赋值图片地址
        // this.defaultImage = this.imageUrl
        this.$emit('input', this.imageUrl)

        this.dialogVisible = false
      }
    }

  }

}
</script>

<style scoped lang='less'>
.btn_box {
  width: 150px;
  height: 150px;
  border: 1px dashed #ddd;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
.dialog-footer {
  width: 100%;
  display: inline-block;
  text-align: center;
}
.img-list {
  margin-top: 20px;
  position: relative;
  .img-item {
    width: 120px;
    height: 120px;
    border: 1px dashed #ddd;
    position: relative;
    display: inline-block;
    margin-top: 20px;
    margin-right: 50px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.isshade {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0px;
  top: 0;
  background: rgba(0, 0, 0, 0.3) url(../assets/selected.png) no-repeat center /
    50px 50px;
}
</style>
