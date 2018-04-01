<template>
  <div id="rural-experience-detail">
    <transition name="slide">
      <router-view></router-view>
    </transition>
    <setTime-popur v-show="setTimePopur" :popup="setTimePopurTitle"></setTime-popur>
    <scroll
      class="wrapper"
      :pullup="true"
      @scrollToEnd="pullup"
      ref="scroll">
      <div>
        <div class="banner">
          <img :src="detail.image_url">
          <div class="info">
            <p>{{detail.s_city}}出发</p>
            <p>活动编号：{{detail.activity_number}}</p>
          </div>
          <div class="header">
            <div class="item">
              <img @click="back" src="./nav_back.png">
            </div>
            <div class="item">
              <img @click="share" src="./nav_share.png">
              <img @click="more" src="./nav_more.png">
            </div>
          </div>
        </div>
        <div class="title">
          <h2>{{detail.activity_name}}</h2>
          <div class="title-content">
            <div class="title-info">
              <h3>地址：{{detail.preferential_policies}}</h3>
              <div class="item">
                <p class="red">￥{{detail.price}}元/人</p>
                <p>135人已报名</p>
                <router-link to="/registrationList" class="more">报名列表</router-link>
              </div>
              <div class="item is">
                <div class="item-wrapper">
                  <img src="./main_tag_1.png">
                  <p>亲子游</p>
                </div>
                <div class="item-wrapper" v-if="parseInt(detail.is_security)===1">
                  <img src="./main_tag_2.png">
                  <p>有保险</p>
                </div>
                <div class="item-wrapper" v-if="parseInt(detail.is_charge)===1">
                  <img src="./main_tag_3.png">
                  <p>收费</p>
                </div>
                <div class="item-wrapper" v-if="parseInt(detail.is_shipping)===0">
                  <img src="./main_tag_4.png">
                  <p>无购物</p>
                </div>
              </div>
            </div>
            <div class="flex-right">
              <span class="action">
                开始导航
              </span>
            </div>
          </div>
          <p class="title-more">{{detail.activity_subtitle}}</p>
        </div>
        <div class="explain">
          <h3>优惠政策说明</h3>
          <p>{{detail.preferential_policies}}</p>
        </div>
        <div class="explain">
          <h3>活动行程安排说明</h3>
          <p>{{detail.travel_arrangements}}</p>
        </div>
        <div class="periphery">
          <div class="item">
            <h3>周边景点</h3>
            <div class="list">
              <div class="list-item" v-for="items in trips">
                <div class="item-wrapper" @click="selectDetail(items)">
                  <img :src="items.trip_img">
                  <p>{{items.trip_name}}</p>
                </div>
              </div>
            </div>
            <router-link to="/ruralTourism">
              <i class="el-icon-arrow-right"></i>
            </router-link>
          </div>
          <div class="item">
            <h3>周边食宿</h3>
            <div class="list">
              <div class="list-item" v-for="item in hostels">
                <div class="item-wrapper" @click="selectDetail(item)">
                  <img :src="item.hostel_img">
                  <p>{{item.hostel_name}}</p>
                </div>
              </div>
            </div>
            <router-link to="/accommodation">
              <i class="el-icon-arrow-right"></i>
            </router-link>
          </div>
        </div>
        <div class="comment">
          <div class="comment-count-0">暂无评价</div>
          <div class="comment-count">
            <div class="comment-title">
              <div class="star-wrapper">
                <h3>商品评价</h3>
                <star :size="12" :score="detail.evalution"></star>
              </div>
              <div class="action" @click="goCommentList">
                <div class="item" >
                  <img src="./main_praise_default.png">
                  <p>30</p>
                </div>
                <div class="item">
                  <img src="./main_comment_default.png">
                  <p>{{commentCount}}</p>
                </div>
              </div>
            </div>

            <div class="list">
              <div class="comment-info" v-for="items in comments">
                <div class="info-title">
                  <div class="info-title-left">
                    <h3>{{items.nick_name}}</h3>
                  </div>
                  <div class="info-title-right">
                    {{items.comment_time}}
                  </div>
                </div>
                <div class="info-evaluate">
                  {{items.content}}
                </div>
                <div class="list-pic">
                  <img src="">
                </div>
              </div>
            </div>

            <div class="get-more" @click="goCommentList">
              查看更多评价
            </div>
          </div>
        </div>
        <div class="tab">
          <div class="tab-wrapper">
            <div class="item" :class="{'on':tabFlag===1}" @click="tab(1)">
              <p>千岛湖介绍</p>
              <span class="line"></span>
            </div>
            <div class="item" :class="{'on':tabFlag===2}" @click="tab(2)">
              <p>活动节目介绍</p>
              <span class="line"></span>
            </div>
            <div class="item" :class="{'on':tabFlag===3}" @click="tab(3)">
              <p>其他说明</p>
              <span class="line"></span>
            </div>
          </div>
          <div class="tab-content">
            <div v-show="tabFlag===1">
              1111
            </div>
            <div v-show="tabFlag===2">
              2222
            </div>
            <div v-show="tabFlag===3">
              3333
            </div>
          </div>
        </div>
      </div>
    </scroll>
    <div class="smak" v-show="moreFlag">
      <span class="san"></span>
      <div class="action">
        <router-link to="/my/collection" class="item">
          <img src="./nav_more_collect.png">
          <p>我的收藏</p>
        </router-link>
        <router-link to="/my/myActivity" class="item">
          <img src="./nav_more_my_activities.png">
          <p>我的活动</p>
        </router-link>
        <router-link to="/my" class="item">
          <img src="./nav_more_back_hone.png">
          <p>返回首页</p>
        </router-link>
      </div>
      <div class="sm" @click="more"></div>
    </div>
    <bottomAction
      :is_zan="true"
      :actionType="true"
      :is_collection="isCollect"
      @isZan="isZan"
      @collection="collection"
      @custom="custom"
      :actionTitle="'立即报名'"></bottomAction>
  </div>
</template>

<script type="text/ecmascript-6">
  import scroll from 'base/scroll/scroll'
  import setTimePopur from 'base/setTime-popur/setTime-popur'
  import star from 'base/star/star'
  import bottomAction from 'base/bottom-action/bottom-action'
  import { mapGetters, mapMutations } from 'vuex'

  export default {
    data() {
      return {
        tabFlag: 1,
        moreFlag: false,
        setTimePopur: false,
        setTimePopurTitle: '',
        detail: {},
        comments: [],
        commentCount: '',
        hostels: [],
        trips: [],
        isCollect: false
      }
    },
    computed: {
      ...mapGetters([
        'latitude',
        'longitude',
        'getToken'
      ])
    },
    mounted() {
      this.getDetail()
    },
    methods: {
      goCommentList() {
        // 商品：goods；景点：trip；民宿：hostel；视频：video；积分商品：score 民宿直接：hostel_to 视频购回复：reply_video  民间体验 activity
        this.SET_COMMENT_TYPE('activity')
        this.$router.push(`/ruralExperience/${this.$route.params.id}/commentList`)
      },
      selectDetail(item) {
        let id = ''
        if (item.trip_id) {
          id = item.trip_id
          this.$router.push(`/ruralTourism/${id}`)
        } else if (item.hostel_id) {
          id = item.hostel_id
          this.$router.push(`/accommodation/${id}`)
        } else {
          id = item.community_id
          this.$router.push(`/interactive/${id}`)
        }
      },
      pullup() {
        this.$nextTick(function () {
          this.$refs.scroll.refresh()
        })
      },
      getDetail() {
        this.axios({
          method: 'post',
          url: '/api/api/activityDetail.php',
          data: {
            activity_id: this.$route.params.id,
            longitude: this.longitude,
            latitude: this.latitude
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
            if (response.data.code === 0) {
              this.detail = response.data.result.detail
              this.hostels = response.data.result.hostels
              this.trips = response.data.result.trips
              this.comments = response.data.result.comments
              this.commentCount = response.data.result.commentCount
              if (parseInt(response.data.result.is_collect) === 0) {
                this.isCollect = false
              } else {
                this.isCollect = true
              }
            } else {
              this.setTimePopurFlag(response.data.msg)
            }
          })
      },
      collection() {
        /*
        * type: 商品 1 ; 景点 2； 民宿 3； 视频购 4 民间活动5；美食6
        * */
        console.log('collection')
        this.axios({
          method: 'post',
          url: '/api/api/userAddOrRemoveCollect.php',
          data: {
            token: this.getToken,
            type: 5,
            to_id: this.detail.ID
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
            if (response.data.code === 0) {
              this.setTimePopurFlag(response.data.msg)
              this.isCollect = !this.isCollect
            } else {
              this.setTimePopurFlag(response.data.msg)
            }
          })
      },
      isZan() {
        console.log('isZan')
      },
      custom() {
        /*
        * 活动报名
        * 保存活动id
        * */
        this.SET_ACTIVITY_ID(this.$route.params.id)
        this.$router.push('/signUp')
      },
      tab(k) {
        if (this.tabFlag === k) {
          return
        }
        this.tabFlag = k
      },
      share() {
        console.log('share')
      },
      more() {
        this.moreFlag = !this.moreFlag
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
      },
      ...mapMutations([
        'SET_ACTIVITY_ID',
        'SET_COMMENT_TYPE'
      ])
    },
    components: {
      scroll,
      star,
      bottomAction,
      setTimePopur
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/base.styl"

  #rural-experience-detail
    position: fixed
    top: 0
    bottom: 52px
    width: 100%
    background: $color-background-b
    z-index: 400
    .wrapper
      background: $color-background-b
      .banner
        height: 240px
        overflow: hidden
        position: relative
        img
          width: 100%
          min-height: 240px
        .info
          position: absolute
          bottom: 0
          width: 100%
          display: flex
          justify-content: space-between
          align-items: center
          background: $color-text-l
          height: 28px
          padding: 0 10px
          font-size: $font-size-medium
          color: $color-background
        .header
          position: absolute
          top: 0
          width: 100%
          height: 48px
          display: flex
          justify-content: space-between
          align-items: center
          padding: 0 10px
          .item
            img
              height: 28px
              width: 28px
              min-height: inherit
              margin-right: 8px
              extend-click()
              &:last-child
                margin: 0
      .title
        padding: 0 10px
        background: $color-background
        margin-bottom: 10px
        h2
          font-size: $font-size-large
          content: $color-text
          font-weight: 700
          padding: 10px 0
        .title-more
          color: $color-theme-r
          font-size: $font-size-small
          padding: 8px 0
        .title-content
          flex: 1
          display: flex
          justify-content: space-between
          border-1px()
          .title-info
            flex: 1
            padding-right: 10px
            h3
              font-size: $font-size-medium
              color: $color-text
              margin-bottom: 8px
              line-height: 1.4
            .item
              display: flex
              align-items: center
              justify-content: space-between
              margin-bottom: 8px
              &.is
                justify-content: flex-start
                .item-wrapper
                  margin-right: 12px
              p
                font-size: $font-size-small
                color: $color-text-d
              .red
                font-size: $font-size-medium
                color: $color-theme-r
              .more
                font-size: $font-size-medium
                color: $color-theme
                text-decoration: underline
                cursor: pointer
              .item-wrapper
                display: flex
                align-items: center
                img
                  height: 12px
                  margin-right: 6px
          .flex-right
            flex: 0 0 80px
            .action
              display: block
              border: 1px solid $color-theme-r
              color: $color-theme-r
              font-size: $font-size-medium
              width: 80px
              text-align: center
              height: 28px
              line-height: 28px
              border-radius: 4px
      .explain
        background: $color-background
        padding: 10px
        margin-bottom: 10px
        h3
          font-size: $font-size-medium
          color: $color-text
          margin-bottom: 8px
        p
          font-size: $font-size-small
          color: $color-text-d
          line-height: 1.4
      .periphery
        background: $color-background
        margin-bottom: 10px
        padding: 0 10px
        .item
          display: flex
          align-items: center
          border-1px()
          padding: 10px 0
          &:last-child::after
            border: none
          h3
            font-size: $font-size-medium
            color: $color-text
            margin-right: 6px
            flex: 0 0 60px
          .el-icon-arrow-right
            flex: 0 0 30px
            text-align: right
          .list
            flex: 1
            display: flex
            overflow: hidden
            .list-item
              flex: 0 0 20%
              height: 40px
              .item-wrapper
                position: relative
                width: 40px
                height: 40px
              img
                width: 40px
                height: 40px
              p
                position: absolute
                bottom: 0
                width: 100%
                background-color: $color-text-l
                font-size: $font-size-small
                color: $color-background
                text-align: center
                line-height: 16px
                no-wrap()
      .comment
        margin-bottom: 10px
        .comment-count
          .comment-title
            display: flex
            align-items: center
            justify-content: space-between
            background: #fff
            padding: 0 10px
            border-1px()
            margin-bottom: 0
            height: 36px
            .star-wrapper
              display: flex
              align-items: center
              h3
                font-size: $font-size-medium
                color: $color-text
                margin-right: 5px
            .action
              display: flex
              align-items: center
              .item
                display: flex
                align-items: center
                margin-left: 24px
                img
                  height: 15px
                  margin-right: 4px
                p
                  font-size: $font-size-small
                  color: $color-text-d
          .list
            background: $color-background
            .comment-info
              margin: 0 10px
              border-1px()
              &:last-child::after
                border: none
              .info-title
                display: flex
                align-items: center
                justify-content: space-between
                padding: 10px 0
                .info-title-right
                  font-size: 12px
                  color: $color-text-d
                .info-title-left
                  display: flex
                  flex: 1
                  align-items: center
                  h3
                    font-size: $font-size-medium
                    color: $color-text
                    margin-left: 0
                  .pic
                    width: 60px
                    height: 60px
                    border-radius: 30px
                    overflow: hidden
                    img
                      width: 60px
                      height: 60px
              .info-evaluate
                padding: 10px 0
                line-height: 1.4
                color: $color-text-6
                overflow: hidden
                text-overflow: ellipsis
                white-space: nowrap
                font-size: $font-size-small
          .get-more
            text-align: center
            background: $color-background
            height: 48px
            line-height: 48px
            color: $color-text-6
            font-size: $font-size-medium
            border-top()
        .comment-count-0
          font-size: $font-size-medium
          color: $color-text-b
          padding: 15px 10px
          background: $color-background
      .tab
        background: $color-background
        margin-bottom: 10px
        padding: 0 10px
        .tab-wrapper
          display: flex
          justify-content: space-around
          align-items: center
          height: 40px
          .item
            flex: 0 0 28%
            text-align: center
            font-size: $font-size-medium
            color: $color-text
            p
              padding: 10px 0
            .line
              display: block
              width: 100%
              height: 2px
              background: $color-background
            &.on
              p
                padding: 10px 0
                color: $color-theme
              .line
                display: block
                width: 100%
                height: 2px
                background: $color-theme
        .tab-content
          padding: 10px 0
          font-size: $font-size-small
          color: $color-text-d
    .smak
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      z-index: 200
      background: $color-text-l
      .sm
        height: 100%
      .san
        display: block
        width: 0
        height: 0
        border: 20px solid transparent
        border-bottom: 10px solid $color-background
        position: absolute
        top: 28px
        right: 6px
      .action
        position: absolute
        display: flex
        flex-direction: column
        background: $color-background
        width: 120px
        top: 55px
        right: 0
        .item
          display: flex
          align-items: center
          font-size: $font-size-medium
          color: $color-text
          padding: 10px
          border-1px()
          &:last-child:after
            border: none
          img
            height: 24px
            margin-right: 8px

  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-active
    transform: translate3d(100%, 0, 0)

  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-active
    transform: translate3d(100%, 0, 0)
</style>
