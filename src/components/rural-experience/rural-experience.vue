<template>
  <div class="rural-experience">
    <header-bar :title="title" @back="back"></header-bar>
    <router-view></router-view>
    <setTime-popur v-show="setTimePopur" :popup="setTimePopurTitle"></setTime-popur>
    <popur :popup="popup" @cancel="cancel" @confirm="confirm" v-show="popurFlag"></popur>
    <div class="tag">
      <div class="tag-wrapper">
        <div class="item" :class="{'active': bigtype===1}" @click="setBigType(1)"><span>喜好</span></div>
        <div class="item" :class="{'active': bigtype===2}" @click="setBigType(2)"><span>目的地</span></div>
        <div class="item" :class="{'active': bigtype===3}" @click="setBigType(3)"><span>周期</span></div>
      </div>
    </div>
    <scroll
      :data="list"
      :pullup="pullup"
      @scrollToEnd="getMoreGoods"
      class="wrapper">
      <div>
        <div class="hot-search">
          <div class="item" :class="{'on': item.active}" v-for="(item, index) in hotSearch" :key="index">
            <div class="item-wrapper" @click="selectType(item)">
              {{item.tag_name}}
            </div>
          </div>
          <div class="item more" @click="addtagPage">
            <div class="item-wrapper">
              换一批
            </div>
          </div>
        </div>
        <div class="list">
          <div class="item" @click="selectDetail(item)" v-for="item in list">
            <div class="pic">
              <img :src="item.image_url">
              <span class="status done" v-show="parseInt(item.status)===1">报名中</span>
              <span class="status end" v-show="parseInt(item.status)===0">已结束</span>
              <div class="pic-title">
                {{item.activity_name}} {{item.time_cycle}}
              </div>
            </div>
            <div class="title">
              <div class="item">
                <span class="icon-action">{{item.lag_name}}</span>
                <p>活动时间：{{item.stime}}~{{item.etime}}</p>
                <p>已报人数：{{item.signnumber}}</p>
              </div>
              <div class="item">
                <p class="red">￥{{item.price}}元/人</p>
                <p class="star-wrapper">好评度:  <star :size="12" :score="item.evalution.toString()"></star> </p>
                <span class="action end" v-if="parseInt(item.status)===0">已结束</span>
                <span class="action done" v-if="parseInt(item.status)===1">立即报名</span>
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
  import setTimePopur from 'base/setTime-popur/setTime-popur'
  import Scroll from 'base/scroll/scroll'
  import loading from 'base/loading/loading'
  import popur from 'base/popur/popur'
  import star from 'base/star/star'
  import { mapGetters, mapMutations } from 'vuex'

  export default{
    data() {
      return {
        title: '民间体验',
        list: [],
        type: '',
        setTimePopur: false,
        setTimePopurTitle: '',
        pullup: true,
        popup: {
//          title: '提示',
//          content: '更多内容请下载APP'
        },
        popurFlag: false,
        hasMore: true,
        hasMoreLags: true,
        page: 0,
        hotSearch: [],
        tag_page: 0,
        bigtype: 1
      }
    },
    computed: {
      ...mapGetters([
        'getToken',
        'orderId'
      ])
    },
    mounted() {
      this.get()
    },
    methods: {
      addtagPage() {
        if (!this.hasMoreLags) {
          this.tag_page = 0
          this.hasMoreLags = true
        } else {
          this.tag_page++
        }
        this.list = []
        this.get()
      },
      setBigType(k) {
        /*
         * 大标签切换
         * */
        if (this.bigtype === k) {
          return
        }
        this.bigtype = k
        this.type = ''
        this.page = 0
        this.tag_page = 0
        this.hasMore = true
        this.get()
      },
      selectType(item) {
        console.log(item)
        /*
         * 标签切换
         * */
        if (item.active) {
          return
        }
        this.hotSearch.forEach(function (value, index) {
          value.active = false
        })
        item.active = true
        this.type = item.ID
        this.get()
      },
      selectDetail(item) {
        this.$router.push(`/ruralExperience/${item.ID}`)
      },
      getMoreGoods() {
        if (!this.hasMore) {
          return
        }
        console.log('getMoreGoods')
        this.page++
        console.log(this.page)
        this.getMore()
      },
      cancel() {
        this.popurFlag = !this.popurFlag
      },
      confirm() {
        console.log('here')
      },
      applyRefunBtn(id) {
        this.popurFlag = true
      },
      get() {
        this.axios({
          method: 'post',
          url: '/api/api/activityList.php',
          data: {
            search: '',
            type: this.type,
            page: this.page,
            num: 10,
            bigtype: this.bigtype,
            tag_page: this.tag_page,
            tag_num: 6
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
              this.hotSearch = this._normalizeLags(response.data.result.lags)
              console.log(this.hotSearch)
              if (response.data.result.lags && response.data.result.lags.length !== 6) {
                /*
                 * 标签默认一次传6个
                 * */
                this.hasMoreLags = false
              }
              if (this.page === 0) {
                this.list = response.data.result.items
              } else {
                this.list = this.list.concat(response.data.result.items)
              }
              if (response.data.result.items.length !== 10) {
                this.hasMore = false
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
      _normalizeLags(list) {
        if (!list) {
          return
        }
        list.forEach(function (value, index) {
          value.active = false
        })
        return list
      },
      back() {
        this.$router.back()
      },
      ...mapMutations([
        'SET_ORDER_ID'
      ])
    },
    components: {
      headerBar,
      Scroll,
      setTimePopur,
      loading,
      popur,
      star
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/base.styl"

  .rural-experience
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
    z-index: 300
    background: $color-background-b
    padding-top: 2px
    .tag
      position: fixed
      top: 48px
      width: 100%
      height: 40px
      z-index: 300
      .tag-wrapper
        background: $color-background
        display: flex
        align-items: center
        border-1px()
        .item
          flex: 1
          font-size: $font-size-medium
          color: $color-text
          text-align: center
          height: 42px
          line-height: 40px
          span
            display: block
            margin: 0 10px
            height: 42px
          &.active
            color: $color-theme
            span
              border-bottom: 2px solid $color-theme
    .wrapper
      background: $color-background
      height: 100%
      overflow: hidden
      .hot-search
        display: flex
        align-items: center
        flex-wrap: wrap
        padding: 10px 0
        border-1px()
        .item
          flex: 0 0 25%
          .item-wrapper
            background: $color-background-b
            margin: 0 5px 5px 5px
            height: 25px
            line-height: 25px
            border-radius: 13px
            text-align: center
            font-size: $font-size-medium
            color: $color-text-d
          &.on
            .item-wrapper
              background: $color-theme
              color: $color-background
          &.more
            .item-wrapper
              background: $color-background
              color: $color-text-d
              border: 1px solid $color-background-b
      .list
        .item
          padding: 10px
          .pic
            position: relative
            height: 160px
            overflow: hidden
            img
              width: 100%
            .status
              position: absolute
              top: 0
              right: 0
              padding: 5px 10px
              color: $color-background
              &.end
                background: $color-text-b
              &.done
                background: $color-theme
            .pic-title
              position: absolute
              bottom: 0
              left: 0
              right: 0
              height: 34px
              line-height: 34px
              color: $color-background
              font-size: $font-size-medium
              background: $color-text-l
              text-align: center
          .title
            padding: 10px 0
            border-1px()
            .item
              display: flex
              align-items: center
              justify-content: space-between
              font-size: $font-size-small
              color: $color-text-6
              padding: 2px 0
              .icon-action
                border: 1px solid $color-theme
                color: $color-theme
                padding: 0 10px
                height: 24px
                line-height: 24px
                border-radius: 4px
              .star-wrapper
                flex: 0 0 142px
                display: flex
                color: $color-text-d
              .red
                color: $color-theme-r
                font-size: $font-size-medium
              .action
                padding: 10px 10px
                background: $color-theme-r
                color: $color-background
                border-radius: 4px
                &.end
                  background: $color-background-d
                &.done
                  background: $color-theme

      .no-data
        display: flex
        align-items: center
        justify-content: center
        font-size: $font-size-medium
        color: $color-text-l
        line-height: 1.6
        text-align: center
    .getMoreStype
      p
        font-size: $font-size-medium
        color: $color-text-l
        margin: 5px
        text-align: center
</style>
