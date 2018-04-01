<template>
  <div class="interactive-comment-list">
    <header-bar @back="back" :title="'全部评价'"></header-bar>
    <setTime-popur v-show="setTimePopur" :popup="setTimePopurTitle"></setTime-popur>
    <scroll class="wrapper" :data="comments" ref="scroll">
      <div>
        <div class="comment-list">
          <div class="item" v-for="item in comments">
            <div class="avatar">
              <div class="pic">
                <div class="pic-wrapper">
                  <img :src="item.head_img">
                </div>
                <p class="theme">{{item.user_name}}</p>
              </div>
              <!--<div class="action" @click="addFollow(item.user_id)" v-show="parseInt(detail.is_follow) === 0">-->
                <!--关注-->
              <!--</div>-->
              <!--<div class="action" v-show="parseInt(detail.is_follow) === 1">-->
              <!--已关注-->
              <!--</div>-->
            </div>
            <div class="comment-content">
              <h4>{{item.content}}</h4>
            </div>
            <div class="more">
              <p class="date">{{item.add_time}}</p>
              <p class="theme" @click="setReplyFlag(item)">回复</p>
            </div>
            <div class="reply-wrapper">
              <div class="reply-item" v-for="key in item.reply">
                <div class="reply-header">
                  <p class="blue">{{key.user_name}}</p>
                  <p>回复</p>
                  <p class="username">{{item.user_name}}:</p>
                </div>
                <div class="reply-content">
                  {{key.content}}
                </div>
                <div class="more">
                  <p class="date">{{key.add_time}}</p>
                  <p class="theme" @click="setReplyFlag(item)">回复</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </scroll>
    <div class="bottom-action">
      <div class="more-action">
        <div class="icon" @click="setCommentFlag()">
          <img src="./main_comment_default.png">
          <!--<p class="red">{{detail.comments_count}}</p>-->
        </div>
        <div class="icon">
          <img src="./main_praise_default.png">
          <!--<p class="red">{{detail.praise_times}}</p>-->
        </div>
        <div class="icon">
          <i class="el-icon-share"></i>
        </div>
      </div>
    </div>
    <div class="reply-text" v-show="replyFlag">
      <div class="line"></div>
      <div class="from-group">
        <textarea cols="30" rows="6" v-model="replyContent" :placeholder="setReplyPd"></textarea>
        <div class="action">
          <span class="btn" @click="setReplyFlag">取消</span>
          <span class="btn theme" @click="selectReCo">发表</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import headerBar from 'base/header-bar/header-bar'
  import scroll from 'base/scroll/scroll'
  import setTimePopur from 'base/setTime-popur/setTime-popur'
  import { mapGetters } from 'vuex'

  export default{
    data() {
      return {
        comments: [],
        setTimePopur: false,
        setTimePopurTitle: '',
        page: 0,
        replyFlag: false,
        replyContent: '',
        replyUser: '',
        user_id: '',
        comment_id: '',
        article_id: '',
        selectType: 1 // 评论1 回复0
      }
    },
    computed: {
      setReplyPd() {
        return `回复${this.replyUser}`
      },
      ...mapGetters([
        'getToken'
      ])
    },
    mounted() {
      this.get()
    },
    methods: {
      selectReCo() {
        /*
         * 发表评论 或 回复
         * selectType: 1评论 0回复
         * */
        if (this.selectType === 1) {
          this.setComment()
        } else if (this.selectType === 0) {
          this.setReply()
        }
      },
      toCommentList() {
        this.$router.push(`/interactive/${this.$route.params.id}/interactiveCommentList`)
      },
      setCommentFlag() {
        /*
         * 评论
         * */
        this.selectType = 1
        this.replyContent = ''
        this.replyUser = ''
        this.replyFlag = !this.replyFlag
      },
      setReplyFlag(item) {
        /*
         * 回复
         * */
        console.log(item)
        this.selectType = 0
        this.replyContent = ''
        this.replyUser = item.user_name
        this.comment_id = item.comment_id
        this.user_id = item.user_id
        this.replyFlag = !this.replyFlag
      },
      setComment() {
        /*
         * 写评论
         * */
        this.replyFlag = !this.replyFlag
        this.axios({
          method: 'post',
          url: '/api/api/addCommunityComment.php',
          data: {
            token: this.getToken || '',
            type: 1,
            content: this.replyContent,
            to_article_id: this.$route.params.id
          },
          transformRequest: [function (data) {
            // Do whatever you want to transform the data
            let ret = ''
            for (let it in data) {
              ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
          }],
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
          .then((response) => {
            if (parseInt(response.data.code) === -1) {
              this.$router.push('/login')
              return
            }
            if (parseInt(response.data.code) === 1) {
              this.get()
              this.$nextTick(function () {
                this.$refs.scroll.refresh()
              })
            }
            this.setTimePopurFlag(response.data.msg)
          })
      },
      setReply() {
        /*
         * 写回复
         * */
        this.replyFlag = !this.replyFlag
        this.axios({
          method: 'post',
          url: '/api/api/addCommunityComment.php',
          data: {
            token: this.getToken || '',
            type: 2,
            content: this.replyContent,
            to_article_id: this.$route.params.id,
            to_user_id: this.to_user_id,
            to_comment_id: this.comment_id
          },
          transformRequest: [function (data) {
            // Do whatever you want to transform the data
            let ret = ''
            for (let it in data) {
              ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
          }],
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
          .then((response) => {
            console.log(response)
            if (parseInt(response.data.code) === -1) {
              this.$router.push('/login')
              return
            }
            if (parseInt(response.data.code) === 1) {
              this.get()
              this.$nextTick(function () {
                this.$refs.scroll.refresh()
              })
            }
            this.setTimePopurFlag(response.data.msg)
          })
      },
      setTimePopurFlag(titie) {
        this.setTimePopurTitle = titie
        this.setTimePopur = true
        setTimeout(() => {
          this.setTimePopur = false
        }, 1000)
      },
      get() {
        this.axios.get('/api/api/getCommunityComments.php', {
          params: {
            token: this.getToken || '',
            community_id: this.$route.params.id,
            page: this.page,
            num: 15
          }
        })
          .then((response) => {
            if (response.data.code === 1) {
              this.comments = response.data.result
            }
          })
      },
      back() {
        this.$router.back()
      }
    },
    components: {
      headerBar,
      scroll,
      setTimePopur
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/base.styl"

  .interactive-comment-list
    position: fixed
    top: 48px
    bottom: 46px
    width: 100%
    z-index: 300
    background: $color-background-b

    .comment-list
      .item
        display: flex
        flex-direction: column
        margin-bottom: 10px
        background: $color-background
        .theme
          color: $color-theme
        .avatar
          display: flex
          align-items: center
          justify-content: space-between
          .pic
            display: flex
            .pic-wrapper
              width: 40px
              height: 40px
              border-radius: 20px
              overflow: hidden
              margin-right: 6px
              img
                width: 40px
                height: 40px
          .action
            padding: 6px 10px
            background: $color-theme-r
            color: $color-background
            font-size: $font-size-small
            border-radius: 4px
        .comment-content
          padding: 10px
        .more
          display: flex
          align-items: center
          justify-content: space-between
          height: 42px
          padding: 0 10px
          .theme
            extend-click()
        .reply-wrapper
          border-top()
          .reply-item
            .reply-header
              display: flex
              padding: 10px 10px 0 60px
              .blue
                color: #03a9f4
                margin-right: 10px
              .username
                margin-left: 10px
            .reply-content
              font-size: $font-size-small
              color: $color-text-6
              padding: 10px 10px 10px 60px
            .more
              padding: 6px 10px 6px 60px
              height: 24px
              border-1px()
              .theme
                extend-click()
    .bottom-action
      position: fixed
      width: 100%
      bottom: 0
      .more-action
        display: flex
        align-items: center
        padding: 10px 10px
        background: $color-background
        border-top()
        .icon
          padding: 4px 0
          display: flex
          align-items: center
          justify-content: center
          flex: 0 0 33.333%
          border-right()
          &:last-child::after
            border: none
          img
            height: 18px
            margin-right: 6px
          .el-icon-share
            font-size: $font-size-large
            color: $color-background-d
          .red
            color: $color-theme-r
    .reply-text
      position: fixed
      bottom: 0
      width: 100%
      background: $color-background
      z-index: 400
      textarea
        margin-bottom: 10px
        border: 1px solid $color-background-d
      .line
        border-1px()
      .from-group
        padding: 10px
        display: flex
        flex-direction: column
        height: 180px
        .action
          display: flex
          justify-content: flex-end
          align-items: center
          .btn
            background: $color-background-d
            padding: 8px 10px
            border-radius: 4px
            font-size: $font-size-small
            color: $color-background
            margin-left: 10px
            extend-click()
            &.theme
              background: $color-theme
</style>
