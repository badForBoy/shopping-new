<template>
  <div class="logistic">
    <header-bar :title="title" @back="back"></header-bar>
    <setTime-popur v-show="setTimePopur" :popup="setTimePopurTitle"></setTime-popur>
    <scroll
      ref="scroll"
      :data="hot"
      :pullup="pullup"
      @scrollToEnd="getMore"
      class="wrapper">
      <div>
        <div v-if="express.length > 0">
          <div class="status">
            <div class="status-content">
              <div class="status-title">
                <p :class="{'active':express.length === 1}">已付款</p>
                <p :class="{'active':express.length === 2}">已发货</p>
                <p :class="{'active':express.length === 3}">配送中</p>
                <p :class="{'active':express.length === 4}">已配送</p>
              </div>
              <div class="status-line2">
                <div class="line-warpper">
                  <span class="spot" :class="{'active':express.length === 1}"><span></span></span>
                  <span class="line" :class="{'active':express.length === 2}"></span>
                  <span class="spot" :class="{'active':express.length === 2}"><span></span></span>
                  <span class="line" :class="{'active':express.length === 3}"></span>
                  <span class="spot" :class="{'active':express.length === 3}"><span></span></span>
                  <span class="line" :class="{'active':express.length === 4}"></span>
                  <span class="spot" :class="{'active':express.length === 4}"><span></span></span>
                </div>
              </div>
            </div>
          </div>
          <div class="info">
            <h3>物流信息</h3>
            <div class="item" v-for="item in express">
              <div class="item-state">
                <span class="spot active"><span></span></span>
                <span class="line" v-show="express.length !== 4"></span>
              </div>
              <div class="item-title">
                <p>{{item.title}}</p>
                <p>{{item.add_time}}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="no-info" v-if="express.length = 0">
          暂无物流信息
        </div>
        <line-title :types="chosen" :title="'猜你喜欢'"></line-title>
        <div class="hot-list">
          <div class="hot-item" v-for="item in hot" :key="item.good_id" @click="selectDetail(item.good_id)">
            <div class="item-wrapper">
              <div class="pic">
                <lazy-component>
                  <img :src="item.good_img">
                </lazy-component>
              </div>
              <div class="title">
                <p>{{item.name}}</p>
                <p class="red">￥{{item.current_price}}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="getMoreStype">
          <loading v-show="hasMore"></loading>
          <p v-show="!hasMore">已经到底了</p>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import headerBar from 'base/header-bar/header-bar'
  import Scroll from 'base/scroll/scroll'
  import setTimePopur from 'base/setTime-popur/setTime-popur'
  import LineTitle from 'base/line-title/line-title'
  import loading from 'base/loading/loading'
  import { mapGetters } from 'vuex'

  export default{
    components: {
      headerBar,
      Scroll,
      LineTitle,
      setTimePopur,
      loading
    },
    data() {
      return {
        title: '物流信息',
        express: [],
        hot: [],
        pullup: true,
        chosen: 'chosen',
        setTimePopur: false,
        setTimePopurTitle: '',
        hasMore: true,
        page: 0
      }
    },
    computed: {
      ...mapGetters([
        'getToken'
      ])
    },
    mounted() {
      this.getLogistic()
    },
    methods: {
      getMore() {
        console.log('getMore')
        if (!this.hasMore) {
          return
        }
        this.page++
        console.log(this.page)
        this.getMoreList()
      },
      selectDetail(id) {
        this.$router.push(`/home/${id}`)
      },
      getMoreList() {
        /*
        * 上拉加载
        * */
        let url = `token=${this.getToken}` +
          `&page=${this.page}` +
          `&num=10` +
          `&longitude=120.310849` +
          `&latitude=30.317957` +
          `&order_id=${this.$route.params.id}`
        this.axios(`api/api/userOrderExpress.php?${url}`)
          .then((response) => {
            if (response.data.code === 1) {
              this.express = response.data.result.express
              this.hot = this.hot.concat(response.data.result.hot)
              if (response.data.result.hot.length !== 10) {
                this.hasMore = false
              }
            } else {
              this.setTimePopurFlag(response.data.msg)
            }
          })
      },
      getLogistic() {
        if (!this.$route.params.id) {
          this.$router.back()
        }
        let url = `token=${this.getToken}` +
          `&page=${this.page}` +
          `&num=10` +
          `&longitude=120.310849` +
          `&latitude=30.317957` +
          `&order_id=${this.$route.params.id}`
        this.axios(`api/api/userOrderExpress.php?${url}`)
          .then((response) => {
            if (response.data.code === 1) {
              this.express = response.data.result.express
              this.hot = response.data.result.hot
            } else {
              this.setTimePopurFlag(response.data.msg)
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
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/base.styl"

  .logistic
    position: fixed
    top: 48px
    bottom: 0
    width: 100%
    background: $color-background-b
    z-index: 500
    .wrapper
      .info
        background: $color-background
        padding: 10px
        h3
          font-size: $font-size-medium
          color: $color-theme
          margin-bottom: 20px
        .item
          font-size: $font-size-small
          color: $color-theme
          display: flex
          p
            margin: 4px 0 8px 0
          .item-state
            flex: 0 0 20px
            display: flex
            flex-direction: column
            align-items: center
            .spot
              flex: 0 0 8px
              width: 8px
              height: 8px
              border-radius: 4px
              background: $color-theme
              margin-bottom: 4px
              &.active
                background: $color-theme
                display: flex
                align-items: center
                justify-content: center
                span
                  width: 6px
                  height: 6px
                  border-radius: 3px
                  background: $color-theme
                  border: 1px solid #fff
            .line
              height: 100%
              background: $color-background
              border-right($color-background-d)
      .status
        display: flex
        justify-content: center
        margin: 10px 0
        .status-content
          width: 95%
          background: $color-background
          padding: 20px 10px 10px 10px
          border-radius: 4px
          .status-title
            display: flex
            align-items: center
            margin-bottom: 10px
            p
              flex: 0 0 25%
              text-align: center
              font-size: $font-size-small
              color: $color-text-b
              &.active
                color: $color-theme
          .status-line2
            display: flex
            justify-content: center
            .line-warpper
              width: 80%
              height: 32px
              display: flex
              align-items: center
              justify-content: center
              .spot
                flex: 0 0 8px
                width: 8px
                height: 8px
                border-radius: 4px
                background: $color-background-d
                &.active
                  background: $color-theme
                  display: flex
                  align-items: center
                  justify-content: center
                  span
                    width: 6px
                    height: 6px
                    border-radius: 3px
                    background: $color-theme
                    border: 1px solid #fff
              .line
                width: 100px
                height: 2px
                background: $color-background-d
                margin: 0 6px
                &.active
                  background: $color-theme

      .no-info
        font-size: $font-size-medium
        color: $color-text-b
        margin: 20px
        text-align: center
      .hot-list
        display: flex
        flex-wrap: wrap
        .hot-item
          width: 50%
          margin-bottom: 5px
          &:nth-child(2n)
            .item-wrapper
              margin-left: 2px
          &:nth-child(2n-1)
            .item-wrapper
              margin-right: 2px
          .item-wrapper
            box-sizing: border-box
            background: $color-background
            .pic
              height: 125px
              overflow: hidden
              img
                width: 100%
                min-height: 125px
            .title
              display: flex
              flex-direction: column
              justify-content: space-between
              padding: 5px
              p
                font-size: $font-size-medium
                color: $color-text
                margin: 4px 0
                overflow: hidden
                white-space: nowrap
                text-overflow: ellipsis
                &.red
                  color: $color-theme-r
      .line-title
        background: $color-background-b
        color: $color-text-l
      .getMoreStype
        p
          font-size: $font-size-medium
          color: $color-text-l
          margin: 5px
          text-align: center
</style>
