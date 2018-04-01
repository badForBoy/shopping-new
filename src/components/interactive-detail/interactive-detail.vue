<template>
  <div class="interactive-detail">
    <router-view></router-view>
    <header-bar @back="back" :title="detail.title"></header-bar>
    <setTime-popur v-show="setTimePopur" :popup="setTimePopurTitle"></setTime-popur>
    <scroll
      class="wrapper"
      :pullup="pullup"
      @scrollToEnd="getMore"
      ref="scroll"
      :data="detail.img">
      <div>
        <div class="avatar">
          <div class="pic">
            <div class="avatar-wrapper">
              <img :src="detail.head_img">
            </div>
            <h4>{{detail.user_name}}</h4>
          </div>
          <div class="icon">
            <img src="./main_see.png">
            <p>{{detail.view_times}}</p>
            <div class="btn" @click="addFollow" v-show="parseInt(detail.is_follow) === 0">
              关注
            </div>
            <div class="btn" v-show="parseInt(detail.is_follow) === 1">
              已关注
            </div>
          </div>
        </div>
        <div class="content" ref="goods">
          <iframe
            @load="setIframeHeight"
            ref="iframe"
            frameborder=0 width=100% height=100% marginheight=0 marginwidth=0 scrolling=no :src="detail.content"></iframe>
        </div>
        <div class="line-10"></div>
        <div class="comment" v-if="hasComments">
          <div class="header-title" @click="toCommentList">
            <h4>全部评论</h4>
            <i class="el-icon-arrow-right"></i>
          </div>
          <div class="comment-list">
            <div class="item" v-for="item in detail.comments">
              <div class="avatar">
                <div class="pic">
                  <div class="pic-wrapper">
                    <img :src="item.head_img">
                  </div>
                  <p class="theme">{{item.user_name}}</p>
                </div>
                <div class="action" @click="addFollow(item.user_id)" v-show="parseInt(detail.is_follow) === 0">
                  关注
                </div>
                <div class="action" v-show="parseInt(detail.is_follow) === 1">
                  已关注
                </div>
              </div>
              <div class="comment-content">
                <h4>{{item.content}}</h4>
              </div>
              <div class="more">
                <p class="date">{{item.add_time}}</p>
                <p class="theme" @click="setReplyFlag(item)">回复</p>
              </div>
              <!--<div class="reply-wrapper">
                <div class="reply-item">
                  <div class="reply-header">
                    <p class="blue">sdsd</p>
                    <p>回复</p>
                    <p class="username">sss:</p>
                  </div>
                  <div class="reply-content">
                   fdfdfd
                  </div>
                  <div class="more">
                    <p class="date">2222</p>
                    <p class="theme" @click="setReplyFlag(item)">回复</p>
                  </div>
                </div>
              </div>-->
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
        <div class="line-10"></div>
      </div>
    </scroll>
    <div class="bottom-action">
      <div class="more-action">
        <div class="icon" @click="setCommentFlag()">
          <img src="./main_comment_default.png">
          <p class="red">{{detail.comments_count}}</p>
        </div>
        <div class="icon" @click="setLike">
          <img src="./main_praise_default.png">
          <p class="red">{{detail.praise_times}}</p>
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
        title: '',
        setTimePopur: false,
        setTimePopurTitle: '',
        pullup: true,
        detail: {},
        hasComments: false,
        isCollect: false,
        isLike: false,
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
      setLike() {
        /*
         * 点赞
         * like: 1:赞 -1 踩
         * type: 1 视频购 2 评论 3互动社区文章 4 景点
         * */
        this.axios({
          method: 'post',
          url: '/api/api/addLike.php',
          data: {
            token: this.getToken || '',
            type: 3,
            to_id: this.detail.community_id,
            like: 1
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
            this.setTimePopurFlag(response.data.msg)
          })
      },
      addFollow() {
        /*
         * 关注
         * */
        this.axios({
          method: 'post',
          url: '/api/api/addFollow.php',
          data: {
            token: this.getToken || '',
            to_id: this.detail.community_id
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
            this.setTimePopurFlag(response.data.msg)
          })
      },
      getMore() {
        console.log('getMore')
        this.$nextTick(function () {
          this.$refs.scroll.refresh()
        })
      },
      setIframeHeight() {
        let iframe = this.$refs.iframe
        iframe.style.height = `${document.documentElement.clientHeight + 100}px`
        let subWeb = document.frames ? iframe.document : iframe.contentDocument
        if (iframe != null && subWeb != null) {
          iframe.style.height = subWeb.body.scrollHeight
        }
        let bHeight = iframe.contentWindow.document.body.scrollHeight
        let dHeight = iframe.contentWindow.document.documentElement.scrollHeight
        let height = Math.max(bHeight, dHeight)
        this.$refs.goods.style.height = `${height}px`
        this.$nextTick(function () {
          this.$refs.scroll.refresh()
        })
      },
      get() {
        this.axios.get('/api/api/getCommunityDetails.php', {
          params: {
            token: this.getToken || '',
            page: this.page,
            num: 10,
            community_id: this.$route.params.id
          }
        })
          .then((response) => {
            if (response.data.code === 1) {
              this.detail = response.data.result
              if (response.data.result.comments.length !== 0) {
                this.hasComments = true
              }
            } else {
//              this.setTimePopurFlag(response.data.msg)
            }
          })
      },
      setTimePopurFlag(titie) {
        this.setTimePopurTitle = titie
        this.setTimePopur = true
        setTimeout(() => {
          this.setTimePopur = false
        }, 1000)
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

  .interactive-detail
    position: fixed
    top: 48px
    bottom: 42px
    width: 100%
    background: $color-background
    z-index: 300
    .wrapper
      height: 100%
      overflow: hidden
      h3
        font-size: $font-size-medium-x
      h4
        font-size: $font-size-medium
        color: $color-text
      p
        font-size: $font-size-small
        color: $color-background-d
        line-height: 1.4
      .avatar
        display: flex
        justify-content: space-between
        align-items: center
        padding: 6px 10px
        border-1px()
        .pic
          display: flex
          align-items: center
          height: 40px
          .avatar-wrapper
            width: 40px
            height: 40px
            overflow: hidden
            border-radius: 20px
            margin-right: 6px
            img
              width: 40px
              height: 40px
        .icon
          display: flex
          align-items: center
          img
            height: 14px
            margin-right: 6px
          .btn
            background: $color-theme-r
            padding: 6px 10px
            font-size: $font-size-small
            color: $color-background
            border-radius: 4px
            margin-left: 12px
      .content
        padding: 10px
        iframe
          position: relative
          z-index: -1
      .line-10
        background: $color-background-b
        height: 10px
      .comment
        background: $color-background-b
        .header-title
          display: flex
          justify-content: space-between
          align-items: center
          border-top()
          border-1px()
          height: 42px
          padding: 0 10px
          background: $color-background
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
