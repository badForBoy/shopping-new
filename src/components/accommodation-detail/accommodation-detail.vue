<template>
  <div class="rural-experience-detail">
    <transition name="slide">
      <router-view></router-view>
    </transition>
    <setTime-popur v-show="setTimePopur" :popup="setTimePopurTitle"></setTime-popur>
    <scroll
      class="wrapper"
      :pullup="true"
      ref="scroll"
      @scrollToEnd="pullups"
      :data="detail.near_hotel">
      <div>
        <div class="banner">
          <img :src="detail.hostel_img">
          <div class="header">
            <div class="item">
              <img @click="back" src="./nav_back.png">
            </div>
            <div class="item">
              <img @click="share" src="./nav_share.png">
              <router-link to="/home">
                <img @click="more" src="./nav_back_hone.png">
              </router-link>
            </div>
          </div>
        </div>
        <div class="title">
          <div class="name">
            <h2>{{detail.hostel_name}}</h2>
            <div class="star-wrapper">
              <p>好评度：</p>
              <star :size="12" :score="detail.star"></star>
            </div>
          </div>
          <div class="title-content">
            <div class="title-info">
              <h3 class="red">￥{{detail.price}}元/晚</h3>
              <h3>地址：{{detail.province}}{{detail.city}}{{detail.area}}{{detail.hostel_address}}</h3>
            </div>
            <div class="flex-right">
              <span class="action">
                开始导航
              </span>
            </div>
          </div>
        </div>
        <div class="data-pick">
          <div class="item" @click="showDatePicker">
            <div class="select-data">
              <img src="./main_date.png">
              <p>请选择入住时间</p>
            </div>
            <div class="selected">
              <p>{{date}}</p>
              <i class="el-icon-arrow-right"></i>
            </div>
          </div>
          <div class="item" @click="showTimePicker" v-if="parseInt(detail.type)===1">
            <div class="select-data">
              <img src="./main_time.png">
              <p>请选择到店时间</p>
            </div>
            <div class="selected">
              <p>{{time}}</p>
              <i class="el-icon-arrow-right"></i>
            </div>
          </div>
        </div>
        <div class="explain">
          <h3>活动行程安排说明</h3>
          <p>{{detail.info}}</p>
        </div>
        <div class="periphery">
          <div class="item" v-if="parseInt(detail.type)===1">
            <h3>周边民宿</h3>
            <div class="list">
              <div class="list-item" v-for="pic in detail.near_hotel">
                <div class="item-wrapper" @click="selectDetail(pic)">
                  <img :src="pic.hostel_img">
                  <p>{{pic.hostel_name}}</p>
                </div>
              </div>
            </div>
            <router-link to="/accommodation">
              <i class="el-icon-arrow-right"></i>
            </router-link>
          </div>
          <div class="item" v-if="parseInt(detail.type)===0">
            <h3>周边美食</h3>
            <div class="list">
              <div class="list-item" v-for="pic in detail.near_hotel_eat">
                <div class="item-wrapper" @click="selectDetail(pic)">
                  <img :src="pic.hostel_img">
                  <p>{{pic.hostel_name}}</p>
                </div>
              </div>
            </div>
            <router-link to="/accommodation">
              <i class="el-icon-arrow-right"></i>
            </router-link>
          </div>
        </div>
        <div class="comment">
          <div class="comment-count-0" v-show="!hasComment">暂无评价</div>
          <div class="comment-count" v-show="hasComment">
            <div class="comment-title">
              <div class="star-wrapper">
                <h3>民宿评论</h3>
              </div>
              <div class="action" @click="toCommentList">
                <h3>{{detail.comment_count}}条评论</h3>
                <i class="el-icon-arrow-right"></i>
              </div>
            </div>

            <div class="list">
              <div class="comment-info" v-for="item in detail.comment">
                <div class="info-title">
                  <div class="info-title-left">
                    <h3>{{item.nick_name}}</h3>
                  </div>
                  <div class="info-title-right">
                    {{item.comment_time}}
                  </div>
                </div>
                <div class="info-evaluate">
                  {{item.content}}
                </div>
                <div class="list-pic">
                  <img src="">
                </div>
              </div>
            </div>

            <div class="get-more" @click="toCommentList">
              查看更多评价
            </div>
          </div>
        </div>
        <div class="tab">
          <div class="tab-wrapper">
            <div class="item" :class="{'on':tabFlag===1}" @click="tab(1)">
              <p>周边景点</p>
              <span class="line"></span>
            </div>
            <div class="item" :class="{'on':tabFlag===2}" @click="tab(2)">
              <p v-if="parseInt(detail.type)===0">周边民宿</p>
              <p v-if="parseInt(detail.type)===1">周边美食</p>
              <span class="line"></span>
            </div>
          </div>
          <div class="tab-content">
            <div v-show="tabFlag===1">
              <div class="accommodations">
                <!--<h3>周边景点</h3>-->
                <div class="list">
                  <div class="item" v-for="h in detail.near_hotel" @click="selectDetail(h)">
                    <div class="icon">
                      <img src="./main_locate.png">
                    </div>
                    <div>
                      <h4>{{h.hostel_name}}</h4>
                      <p>地址：{{h.province}}{{h.city}}{{h.area}}{{h.hostel_address}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-show="tabFlag===2" v-if="parseInt(detail.type)===1">
              <div class="accommodations">
                <!--<h3>周边美食</h3>-->
                <div class="list">
                  <div class="item" v-for="h in detail.near_hotel_eat" @click="selectDetail(h)">
                    <div class="icon">
                      <img src="./main_locate.png">
                    </div>
                    <div>
                      <h4>{{h.hostel_name}}</h4>
                      <p>地址：{{h.province}}{{h.city}}{{h.area}}{{h.hostel_address}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-show="tabFlag===2" v-if="parseInt(detail.type)===0">
              <div class="accommodations">
                <!--<h3>周边民宿</h3>-->
                <div class="list">
                  <div class="item" v-for="h in detail.near_hotel" @click="selectDetail(h)">
                    <div class="icon">
                      <img src="./main_locate.png">
                    </div>
                    <div>
                      <h4>{{h.hostel_name}}</h4>
                      <p>地址：{{h.province}}{{h.city}}{{h.area}}{{h.hostel_address}}</p>
                    </div>
                  </div>
                </div>
              </div>
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
        <div class="item">
          <img src="./nav_more_collect.png">
          <p>我的收藏</p>
        </div>
        <div class="item">
          <img src="./nav_more_my_activities.png">
          <p>我的活动</p>
        </div>
        <div class="item">
          <img src="./nav_more_back_hone.png">
          <p>返回首页</p>
        </div>
      </div>
      <div class="sm" @click="more"></div>
    </div>
    <bottomAction
      :actionType="true"
      @collection="setCollect"
      :is_collection="collectFlag"
      @custom="custom"
      :actionTitle="'预定'"></bottomAction>
    <!--<transition name="popover">-->
      <!--<popover-->
        <!--:detalisType="99"-->
        <!--:actiontype="staffType"-->
        <!--@bgclose="close"-->
        <!--@confirm="close"-->
        <!--v-show="showPopover"></popover>-->
    <!--</transition>-->
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  import scroll from 'base/scroll/scroll'
  import star from 'base/star/star'
  import bottomAction from 'base/bottom-action/bottom-action'
  import setTimePopur from 'base/setTime-popur/setTime-popur'
  import DatePicker from 'components/example/data/date-picker.vue'
  import { createAPI } from 'cube-ui'
  import Popover from 'base/popover/popover'
  import { mapGetters, mapMutations } from 'vuex'

  createAPI(Vue, DatePicker, ['select', 'cancel'], false)

  export default {
    data() {
      return {
        setTimePopur: false,
        setTimePopurTitle: '',
        tabFlag: 1,
        moreFlag: false,
        hasComment: false,
        collectFlag: false,
        date: '',
        time: '',
        staffType: 1, // 1: 确认购买;  2: 加入购物车
        showPopover: false,
        detail: {}
      }
    },
    computed: {
      ...mapGetters([
        'getToken',
        'longitude',
        'latitude',
        'bigbigtype'
      ])
    },
    mounted() {
      this.get()
      // 日期选择器
      this.datePicker = this.$createDatePicker({
        title: '到店日期',
        min: [2018, 1, 1],
        max: [2049, 10, 20],
        onSelect: (selectedVal, selectedIndex, selectedText) => {
          this.date = `${selectedText.join(' ')}`
          console.log(selectedText)
        }
      })
    },
    methods: {
      setCollect() {
        /*
         * 点赞收藏等 / 用户添加、删除收藏
         * type: 商品 1 ; 景点 2； 民宿 3； 视频购 4 民间活动5；美食6
         * */
        this.axios({
          method: 'post',
          url: '/api/api/userAddOrRemoveCollect.php',
          data: {
            token: this.getToken || '',
            type: 3,
            to_id: this.$route.params.id
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
            if (response.data.code === 1) {
              this.collectFlag = !this.collectFlag
            }
            this.setTimePopurFlag(response.data.msg)
          })
      },
      toCommentList() {
        // 商品：goods；景点：trip；民宿：hostel；视频：video；积分商品：score 民宿直接：hostel_to 视频购回复：reply_video  民间体验 activity
        this.SET_COMMENT_TYPE('hostel')
        this.$router.push(`/accommodation/${this.$route.params.id}/commentList`)
      },
      selectDetail(item) {
        console.log(item)
        let id = ''
        if (item.trip_id) {
          id = item.trip_id
          this.$router.push(`/ruralTourism/${id}`)
        } else if (item.hostel_id) {
          id = item.hostel_id
          this.$router.push(`/accommodation/${id}`)
          this.get()
        } else {
          id = item.community_id
          this.$router.push(`/interactive/${id}`)
        }
        console.log(id)
      },
      pullups() {
        console.log('pullups')
        this.$refs.scroll.refresh()
      },
      get() {
        this.axios.get('api/api/getFindHostelDetails.php', {
          params: {
            hostel_id: this.$route.params.id,
            longitude: this.longitude || 0,
            latitude: this.latitude || 0,
            token: this.getToken || ''
          }
        })
          .then((response) => {
            if (response.data.code === 1) {
              this.detail = response.data.result
              if (response.data.result.comment.length !== 0) {
                this.hasComment = true
              }
              if (response.data.result.is_collect === 1) {
                this.collectFlag = true
              } else {
                this.collectFlag = false
              }
            }
          })
      },
      custom() {
        /*
         * 预定
         * */
        console.log('custom')
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
      back() {
        this.$router.back()
      },
      close() {
        this.showPopover = !this.showPopover
      },
      showDatePicker() {
        this.datePicker.show()
      },
      showTimePicker () {
        this.$createTimePicker({
          showNow: true,
          minuteStep: 10,
          delay: 10,
          day: {
            len: 1,
            filter: ['', '明天'],
            format: 'M月d日'
          },
          onSelect: (selectedTime, selectedText) => {
            this.time = selectedText
          },
          onCancel: () => {
            this.$createToast({
              type: 'correct',
              txt: 'Picker canceled',
              time: 1000
            }).show()
          }
        }).show()
      },
      setTimePopurFlag(titie) {
        this.setTimePopurTitle = titie
        this.setTimePopur = true
        setTimeout(() => {
          this.setTimePopur = false
        }, 1000)
      },
      ...mapMutations([
        'SET_COMMENT_TYPE'
      ])
    },
    components: {
      scroll,
      star,
      bottomAction,
      Popover,
      setTimePopur
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/base.styl"

  .cube-popup
    z-index: 1000

  .popover
    bottom: 0 !important

  .rural-experience-detail
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
          color: $color-text
          font-weight: 700
          padding: 10px 0
        .name
          display: flex
          justify-content: space-between
          align-items: center
          .star-wrapper
            display: flex
            align-items: center
            p
              font-size: $font-size-medium
              color: $color-text
        .title-more
          color: $color-theme-r
          font-size: $font-size-small
          padding: 8px 0
        .title-content
          flex: 1
          display: flex
          justify-content: space-between
          padding-bottom: 10px
          align-items: center
          .title-info
            flex: 1
            padding-right: 10px
            h3
              font-size: $font-size-medium
              color: $color-text
              line-height: 1.4
            .red
              font-size: $font-size-medium
              color: $color-theme-r
            .item
              display: flex
              align-items: center
              justify-content: space-between
              margin-bottom: 8px
              p
                font-size: $font-size-small
                color: $color-text-d
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
          text-align: center
          font-size: $font-size-medium
          color: $color-text-b
          padding: 15px 10px
          background: $color-background
      .tab
        background: $color-background
        margin-bottom: 10px
        .tab-wrapper
          display: flex
          justify-content: space-around
          align-items: center
          border-1px()
          .item
            flex: 0 0 28%
            text-align: center
            font-size: $font-size-medium
            color: $color-text
            p
              padding: 10px 0
              height: 40px
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
          .accommodations
            background: $color-background
            h3
              font-size: $font-size-medium
              color: $color-text
              height: 36px
              line-height: 36px
              padding: 0 10px
              border-1px()
            h4
              font-size: $font-size-small
              color: $color-text
              margin-bottom: 6px
            p
              font-size: $font-size-small
              color: $color-text-d
            .list
              .item
                display: flex
                align-items: center
                margin: 0
                padding: 10px
                .icon
                  flex: 0 0 30px
                  img
                    height: 24px
      .data-pick
        margin-bottom: 10px
        background: $color-background
        .item
          display: flex
          align-items: center
          justify-content: space-between
          padding: 10px
          border-1px()
          &:last-child::after
            border: none
          .select-data, .selected
            display: flex
            align-items: center
            img
              height: 20px
              margin-right: 5px
            p
              color: $color-text
              font-size: $font-size-medium
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

  .popover-enter-active, .popover-leave-active
    transition: all 0.3s

  .popover-enter, .popover-leave-active
    transform: translate3d(0, 100%, 0)
</style>
