<template>
  <div class="comment-list">
    <header-bar :title="title" @back="back"></header-bar>
    <setTime-popur v-show="setTimePopur" :popup="setTimePopurTitle"></setTime-popur>
    <scroll class="wrapper" :data="commentList.comments">
      <div>
        <ul id="list-wrapper">
          <li v-for="item in commentList.comments">
            <div class="comment-title">
              <div class="header-info">
                <div class="info-pic"><img
                  :src="item.head_img"></div>
                <h3>{{item.nick_name}}</h3>
              </div>
              <div class="date">{{item.comment_time}}</div>
            </div>
            <div class="text">
              <p>{{item.content}}</p>
              <div class="pic-wrapper">
                <img :src="img" v-for="img in item.img">
              </div>
            </div>
          </li>
        </ul>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import headerBar from 'base/header-bar/header-bar'
  import Scroll from 'base/scroll/scroll'
  import setTimePopur from 'base/setTime-popur/setTime-popur'
  import { mapGetters } from 'vuex'

  export default{
    data() {
      return {
        title: '全部评价',
        commentList: {},
        setTimePopur: false,
        setTimePopurTitle: ''
      }
    },
    computed: {
      ...mapGetters([
        'getToken',
        'commentType'
      ])
    },
    mounted() {
      this.getCommentsList()
    },
    methods: {
      back() {
        this.$router.back()
      },
      getCommentsList() {
        this.axios.get('/api/api/getCommentsList.php', {
          params: {
            token: this.getToken,
            to_id: this.$route.params.goods_id || this.$route.params.id,
            type: this.commentType || 'goods'
          }
        })
          .then((response) => {
            console.log(response)
            if (response.data.code === 1) {
              this.commentList = response.data.result
              return
            }
            this.setTimePopurFlag(response.data.msg)
//            this.$router.back()
          })
      },
      setTimePopurFlag(titie) {
        this.setTimePopurTitle = titie
        this.setTimePopur = true
        setTimeout(() => {
          this.setTimePopur = false
        }, 1000)
      }
    },
    components: {
      headerBar,
      Scroll,
      setTimePopur
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/base.styl"

  .comment-list
    position: fixed
    top: 48px
    bottom: 0
    width: 100%
    z-index: 300
    background: $color-background-b
    #list-wrapper
      li
        border-1px($color-background-b)
        background: $color-background
        &.last-child
          &::after
            border: none
        .comment-title
          display: flex
          align-items: center
          justify-content: space-between
          padding: 10px
          .header-info
            display: flex
            align-items: center
            .info-pic
              width: 60px
              height: 60px
              border-radius: 30px
              overflow: hidden
              img
                width: 60px
                height: 60px
            h3
              font-size: $font-size-medium
              color: $color-text
              margin-left: 10px
          .date
            font-size: $font-size-small
            color: $color-text-b
        .text
          padding: 10px
          p
            font-size: $font-size-small
            color: $color-text-l
            line-height: 1.4
          .pic-wrapper
            display: flex
            flex-wrap: wrap
            padding: 10px 0
            img
              flex: 0 0 25%
              padding: 5px
              box-sizing: border-box
              height: 60px
              width: 20%

</style>
