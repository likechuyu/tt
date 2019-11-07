<template>
  <div class="container-publish">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <my-crumbs v-if="$route.query.id">修改文章</my-crumbs>
        <my-crumbs v-else>发布文章</my-crumbs>
      </div>
      <!-- 表单架构 -->
      <el-form label-width="120px">
        <el-form-item label="标题">
          <el-input placeholder="请输入标题" v-model="articleForm.title" style="width:400px" clearable></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <quill-editor v-model="articleForm.content" :options="editorOption"></quill-editor>
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="articleForm.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <div v-if="articleForm.cover.type==1">
            <my-img v-model="articleForm.cover.images[0]"></my-img>
          </div>
          <div class="img-box" v-if="articleForm.cover.type==3">
            <my-img v-for="i in 3" :key="i" v-model="articleForm.cover.images[i-1]"></my-img>
          </div>
        </el-form-item>
        <el-form-item label="频道：">
          <my-channel v-model="articleForm.channel_id"></my-channel>
        </el-form-item>
        <el-form-item v-if="this.$route.query.id">
          <el-button @click="update(false)" type="primary">修改文章</el-button>
          <el-button @click="update(true)">存入草稿</el-button>
        </el-form-item>
        <el-form-item v-else>
          <el-button @click="create(false)" type="primary">发表</el-button>
          <el-button @click="create(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
export default {
  watch: {
    '$route.query.id': function (newVal, oldVal) {
      if (!newVal) {
        this.articleForm = {
          title: null,
          content: null,
          cover: {
            type: 1,
            images: []
          }
        }
      }
      // if (newVal) {
      //   // 修改 填充表单
      //   this.getArticle(newVal)
      // } else {
      //   // 新建 重置表单
      //   this.articleForm = {
      //     title: null,
      //     content: null,
      //     cover: {
      //       type: 1,
      //       images: []
      //     }
      //   }
      // }
    }
  },
  components: {
    quillEditor
  },
  data () {
    return {
      articleForm: { channel_id: null,
        cover: { type: 1, images: [] },
        title: null,
        content: null
      },
      editorOption: {
        placeholder: '',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            ['image']
          ]
        }
      }
    }
  },
  methods: {
    async create (is) {
      await this.$http.post(`articles?draft=${is}`, this.articleForm)
      // 成功
      this.$message.success(is ? '存入草稿成功' : '发表成功')
      this.$router.push('/article')
    },
    async getArticle (id) {
      const { data: { data } } = await this.$http.get(`articles/${id}`)
      this.articleForm = data
    },
    async update (is) {
      await this.$http.put(`articles/${this.articleForm.id}?draft=${is}`, this.articleForm)
      // 成功
      this.$message.success(is ? '存入草稿成功' : '修改成功')
      this.$router.push('/article')
    }

  },
  created () {
    const id = this.$route.query.id
    if (id) {
      // 存在id为编辑界面  填充表单数据
      this.getArticle(id)
    } else {
      // 不存在则为发布页面

    }
  }
}
</script>

<style scoped lang='less'>
.container {
  display: inline-block;
  margin-right: 20px;
}
</style>
