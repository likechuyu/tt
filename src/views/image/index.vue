<template>
  <div class="container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <my-crumbs>素材管理</my-crumbs>
      </div>
      <div style="margin-top: 0px">
        <el-radio-group @change="toggleList" v-model="reqParams.collect" size="small">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <el-button @click="open" style="float:right" type="success" size="small">添加素材</el-button>
      </div>
      <!-- 列表页面 -->
      <div class="img-list">
        <div class="img-item" v-for="item in results " :key="item.id">
          <img :src="item.url" alt />
          <div class="footer">
            <span
              @click="toggleStatus(item)"
              class="el-icon-star-off"
              :class="{red:item.is_collected}"
            ></span>
            <span @click="delimg(item.id)" class="el-icon-delete"></span>
          </div>
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
    </el-card>
    <el-dialog title="添加素材" :visible.sync="dialogVisible" width="300px">
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
      <span>上传组件</span>
    </el-dialog>
  </div>
</template>

<script>
import local from '@/utils/local'
export default {
  data () {
    return {
      headers: { Authorization: `Bearer ${local.getUser().token}` },
      imageUrl: null,
      dialogVisible: false,
      reqParams: {
        collect: false,
        page: 1,
        per_page: 20
      },
      results: [],
      total: null
    }
  },
  methods: {
    open () {
      this.dialogVisible = true
      this.imageUrl = null
    },
    handleSuccess (res) {
      this.imageUrl = res.data.url
      // 提示
      this.$message.success('上传成功')
      window.setTimeout(() => {
        // 关闭
        this.dialogVisible = false
        // 更新列表
        this.getImgs()
      }, 2000)
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
    async toggleStatus (item) {
      const { data: { data } } = await this.$http.put(`user/images/${item.id}`, {
        collect: !item.is_collected
      })
      // 成功（改当前图片的状态，提示）
      item.is_collected = data.collect
      this.$message.success(data.collect ? '添加收藏成功' : '取消收藏成功')
    },
    toggleList () {
      this.reqParams.page = 1
      this.getImgs()
    },
    delimg (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await this.$http.delete(`user/images/${id}`)
        } catch (error) {
          this.$message.success('删除成功')
          this.getImgs()
        }
      })
    }
  },
  created () {
    this.getImgs()
  }
}
</script>

<style scoped lang='less'>
.img-list {
  margin-top: 20px;
  .img-item {
    width: 180px;
    height: 180px;
    border: 1px dashed #ddd;
    position: relative;
    display: inline-block;
    margin-top: 20px;
    margin-right: 50px;
    img {
      width: 100%;
      height: 100%;
    }
    .footer {
      width: 100%;
      height: 30px;
      position: absolute;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);
      text-align: center;
      color: #fff;
      line-height: 30px;
      span {
        margin: 0 20px;
        &.red {
          color: red;
        }
      }
    }
  }
}
</style>
