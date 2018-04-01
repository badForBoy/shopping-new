<template>
  <div class="collection">
    <header-bar :title="title" @back="back"></header-bar>
    <div class="tab">
      <div class="tab-wrapper">
        <div class="item" :class="{'active':type===0}" @click="selectType(0)"><span>全部</span></div>
        <div class="item" :class="{'active':type===1}" @click="selectType(1)"><span>待评价</span></div>
        <div class="item" :class="{'active':type===2}" @click="selectType(2)"><span>已评价</span></div>
      </div>
    </div>
    <scroll
      :pullup="pullup"
      @scrollToEnd="getMore"
      class="wrapper"
      :data="list">
      <div>
        <div class="collection-list" v-if="type===0">
          <div class="item" v-for="item in list">
            <div class="header-title">
              <p class="title">报名订单号：{{item.activity_order_sn}}</p>
              <p class="status theme-r" v-if="parseInt(item.status)===1">待评价</p>
              <p class="status" v-if="parseInt(item.status)===2">已评价</p>
            </div>
            <div class="item-list">
              <div class="group" @click="selectDetail(item)">
                <div class="pic">
                  <img :src="item.image_url">
                </div>
                <div class="title">
                  <h3>{{item.activity_name}}</h3>
                  <div class="date">
                    <span class="theme">{{item.lag_name}}</span>
                    <p>活动时间：{{}}</p>
                  </div>
                  <p class="red">￥{{item.price}}元/人</p>
                </div>
              </div>
            </div>
            <div class="action">
              <div>
                合计:
                <p class="red"></p>
              </div>
              <div>
                <span class="btn theme">查看详情</span>
                <span class="btn red">去评价</span>
              </div>
            </div>
            <div></div>
          </div>
        </div>
        <div class="collection-list" v-if="type===1">
          <div class="item" v-for="item in list">
            <div class="header-title">
              <p class="title">报名订单号：{{item.activity_order_sn}}</p>
              <p class="status theme-r" v-if="parseInt(item.status)===1">待评价</p>
              <p class="status" v-if="parseInt(item.status)===2">已评价</p>
            </div>
            <div class="item-list">
              <div class="group" @click="selectDetail(item)">
                <div class="pic">
                  <img :src="item.image_url">
                </div>
                <div class="title">
                  <h3>{{item.activity_name}}</h3>
                  <div class="date">
                    <span class="theme">{{item.lag_name}}</span>
                    <p>活动时间：{{item.stime}}~{{item.etime}}</p>
                  </div>
                  <p class="red">￥{{item.price}}元/人</p>
                </div>
              </div>
            </div>
            <div class="action">
              <div>
                合计:
                <p class="red"></p>
              </div>
              <div>
                <span class="btn theme">查看详情</span>
                <span class="btn red">去评价</span>
              </div>
            </div>
            <div></div>
          </div>
        </div>
        <div class="collection-list" v-if="type===2">
          <div class="item" v-for="item in list">
            <div class="header-title">
              <p class="title">报名订单号：{{item.activity_order_sn}}</p>
              <p class="status theme-r" v-if="parseInt(item.status)===1">待评价</p>
              <p class="status" v-if="parseInt(item.status)===2">已评价</p>
            </div>
            <div class="item-list">
              <div class="group" @click="selectDetail(item)">
                <div class="pic">
                  <img :src="item.image_url">
                </div>
                <div class="title">
                  <h3>{{item.activity_name}}</h3>
                  <div class="date">
                    <span class="theme">{{item.lag_name}}</span>
                    <p>活动时间：{{item.stime}}~{{item.etime}}</p>
                  </div>
                  <p class="red">￥{{item.price}}元/人</p>
                </div>
              </div>
            </div>
            <div class="action">
              <div>
                合计:
                <p class="red"></p>
              </div>
              <div>
                <span class="btn theme">查看详情</span>
              </div>
            </div>
            <div></div>
          </div>
        </div>
        <div class="getMoreStype" v-show="hasCollect">
          <loading v-show="hasMore"></loading>
          <p v-show="!hasMore">已经到底了</p>
        </div>
        <div class="no-data" v-show="!hasCollect">
          <p>您还没有订单哦</p>
          <p>赶紧去选择吧</p>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import headerBar from 'base/header-bar/header-bar'
  import scroll from 'base/scroll/scroll'
  import star from 'base/star/star'
  import loading from 'base/loading/loading'
  import { mapGetters } from 'vuex'

  export default{
    data() {
      return {
        title: '我的活动',
        pullup: true,
        page: 0,
        list: [],
        type: 0,
        hasCollect: true,
        hasMore: true
      }
    },
    computed: {
      ...mapGetters([
        'getToken'
      ])
    },
    mounted() {
      this.get()
    },
    methods: {
      getMore() {
        if (!this.hasMore) {
          return
        }
        console.log('getMoreGoods')
        this.page++
        console.log(this.page)
        this.get()
      },
      selectDetail(item) {
        console.log(item)
        this.$router.push(`/ruralExperience/${item.cycle_ID}`)
      },
      selectType(type) {
        /*
         * 商品 1 ; 景点 2； 民宿 3； 视频购 4； 民间体验 5 ；美食6
         * */
        if (type === this.type) {
          return
        }
        this.type = type
        this.list = []
        this.get()
      },
      get() {
        //        alert(this.longitude)
        this.axios({
          method: 'post',
          url: '/api/api/mySignActivityList.php',
          data: {
            type: this.type,
            token: this.getToken || '',
            page: this.page,
            num: 10
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
            if (parseInt(response.data.code) === 0) {
              console.log(response.data.result)
              if (response.data.result.length !== 10) {
                this.hasMore = false
              } else {
                this.hasMore = true
              }
              if (this.page === 0) {
                this.list = response.data.result
              } else {
                this.list = this.list.concat(response.data.result)
              }
              if (this.list.length === 0) {
                this.hasCollect = false
              } else {
                this.hasCollect = true
              }
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
      star,
      loading
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/base.styl"

  .collection
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
    background: $color-background-b
    z-index: 300
    .tab
      position: fixed
      top: 48px
      width: 100%
      z-index: 400
      .tab-wrapper
        display: flex
        align-items: center
        height: 40px
        background: $color-background
        border-1px()
      .item
        flex: 1
        text-align: center
        font-size: $font-size-medium
        color: $color-text
        margin-bottom: 10px
        &.active
          color: $color-theme
    .collection-list
      background: $color-background
      .item
        .header-title
          display: flex
          justify-content: space-between
          align-items: center
          font-size: $font-size-medium
          color: $color-text
          height: 40px
          border-1px()
          padding: 0 10px
          .status
            color: $color-text-l
            &.theme-r
              color: $color-theme-r
        .item-list
          h3
            font-size: $font-size-medium
            color: $color-text
          p
            font-size: $font-size-small
            color: $color-text-l
          .group
            display: flex
            padding: 10px
            border-1px()
            .pic
              width: 75px
              height: 75px
              overflow: hidden
              margin-right: 10px
              img
                width: 75px
                min-height: 75px
            .title
              font-size: $font-size-medium
              color: $color-text
              .date
                padding: 8px 0
              .date
                display: flex
                align-items: center
                .theme
                  border: 1px solid $color-theme
                  font-size: $font-size-small
                  color: $color-theme
                  padding: 4px 6px
                  border-radius: 4px
                  margin-right: 10px
              .red
                color: $color-theme-r
                font-size: $font-size-medium
        .action
          display: flex
          padding: 10px
          height: 48px
          align-items: center
          justify-content: space-between
          font-size: $font-size-small
          .btn
            padding: 6px 10px
            margin-left: 10px
            border-radius: 4px
            extend-click()
            &.theme
              background: $color-theme
              color: $color-background
            &.red
              background: $color-theme-r
              color: $color-background

    .no-data
      display: flex
      align-items: center
      justify-content: center
      flex-direction: column
      font-size: $font-size-medium
      color: $color-text-l
      line-height: 1.6
      text-align: center
      padding: 30px 0
    .getMoreStype
      p
        font-size: $font-size-medium
        color: $color-text-l
        margin: 5px
        text-align: center
</style>
