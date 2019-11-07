<template>
  <div class="comment">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <my-crumbs>评论管理</my-crumbs>
      </div>
      <el-table :data="articles" style="width: 100%">
        <el-table-column prop="title" label="标题" width="400"></el-table-column>
        <el-table-column prop="total_comment_count" label="总评论数"></el-table-column>
        <el-table-column prop="fans_comment_count" label="粉丝评论数"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">{{scope.row.comment_status?'正常':'关闭'}}</template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.comment_status"
              type="danger"
              size="small"
              @click="trigger(scope.row)"
            >关闭评论</el-button>
            <el-button v-else type="success" size="small" @click="trigger(scope.row)">打开评论</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top:20px"
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="reqParams.per_page"
        :current-page="reqParams.page"
        @current-change="pager"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      articles: null,
      reqParams: {
        response_type: 'comment',
        page: 1,
        per_page: 10
      },
      // 总条数
      total: 0
    }
  },
  methods: {
    async getArticles () {
      const {
        data: { data }
      } = await this.$http.get('articles', { params: this.reqParams })
      this.articles = data.results
      this.total = data.total_count
    },
    pager (newPage) {
      this.reqParams.page = newPage
      // 重新获取数据
      this.getArticles()
    },
    trigger (row) {
      this.$confirm(row.comment_status ? '确认关闭评论' : '确认打开评论')
        .then(async () => {
          await this.$http.put(`comments/status?article_id=${row.id}`, {
            allow_comment: !row.comment_status
          })
          // 更新当前文章的状态
          row.comment_status = !row.comment_status
        })
        .catch(() => { })
    }
  },
  created () {
    this.getArticles()
  }
}
</script>

<style scoped lang='less'></style>
