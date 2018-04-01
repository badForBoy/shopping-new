<template>
  <div class="rural-tourism">
    <header-bar :title="title" @back="back"></header-bar>
    <router-view></router-view>
    <setTime-popur v-show="setTimePopur" :popup="setTimePopurTitle"></setTime-popur>
    <popur :popup="popup" @cancel="cancel" @confirm="confirm" v-show="popurFlag"></popur>
    <div class="tag">
      <div class="tag-wrapper">
        <div class="item" :class="{'active': bigType===1}" @click="setBigType(1)"><span>项目主题</span></div>
        <div class="item" :class="{'active': bigType===2}" @click="setBigType(2)"><span>综合排序</span></div>
      </div>
    </div>
    <scroll
      :data="list"
      :pullup="pullup"
      @scrollToEnd="getMoreGoods"
      class="wrapper">
      <div>
        <div class="hot-search">
          <div
            class="item"
            :class="{'on': item.active}"
            @click="selectType(item)"
            v-for="(item, index) in hotSearch"
            :key="index">
            <div class="item-wrapper">
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
          <div class="item" @click="selectDetail" v-for="item in list">
            <div class="pic">
              <img :src="item.trip_img">
            </div>
            <div class="title">
              <div>
                <h3>{{item.trip_name}}</h3>
                <p>地址：{{item.province}}{{item.city}}{{item.area}}{{item.hostel_address}}</p>
                <div class="theme">
                  <p v-for="key in item.trip_activity">{{key}}</p>
                </div>
              </div>
              <div class="more">
                <div class="left">
                  <div>
                    <img src="./main_praise_default.png">
                    <p>30</p>
                  </div>
                  <div>
                    <img src="./main_comment_default.png">
                    <p>3</p>
                  </div>
                  <div>
                    <img src="./main_see.png">
                    <p>125</p>
                  </div>
                </div>
                <div class="right">
                  17.41km
                </div>
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
  import OrderList from 'base/order-list/order-list'
  import Scroll from 'base/scroll/scroll'
  import loading from 'base/loading/loading'
  import popur from 'base/popur/popur'
  import star from 'base/star/star'
  import { mapGetters, mapMutations } from 'vuex'

  export default{
    data() {
      return {
        title: '农村旅游',
        setTimePopur: false,
        setTimePopurTitle: '',
        pullup: true,
        popup: {
//          title: '提示',
//          content: '更多内容请下载APP'
        },
        popurFlag: false,
        hasMore: true,
        page: 0,
        list: [],
        hotSearch: [],
        bigType: 1,
        type: ''
      }
    },
    computed: {
      ...mapGetters([
        'getToken',
        'longitude',
        'latitude'
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
        if (this.bigType === k) {
          return
        }
        this.bigType = k
        this.type = ''
        this.page = 0
        this.tag_page = 0
        this.hasMore = true
        this.get()
      },
      selectType(item) {
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
        console.log('selectDetail')
        this.$router.push(`/ruralTourism/${1}`)
      },
      getMoreGoods() {
        if (!this.hasMore) {
          return
        }
        this.page++
        this.get()
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
        this.axios.get('/api/api/getFindTripsList.php', {
          params: {
            longitude: this.longitude || 0,
            latitude: this.latitude || 0,
            page: this.page,
            tag_page: this.tag_page,
            num: 10,
            tag_num: 6,
            search: '',
            bigtype: this.bigType,
            type: this.type
          }
        })
          .then((response) => {
            if (response.data.code === 1) {
              this.hotSearch = this._normalizeLags(response.data.result.lags)
              if (response.data.result.lags.length !== 6) {
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
      OrderList,
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

  .rural-tourism
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
      background: $color-background-b
      height: 100%
      overflow: hidden
      .hot-search
        display: flex
        align-items: center
        flex-wrap: wrap
        padding: 10px 0
        border-1px()
        background: $color-background
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
        background: $color-background
        .item
          padding: 10px 0
          margin: 0 10px
          display: flex
          border-1px()
          &:last-child::after
            border: none
          .pic
            flex: 0 0 110px
            height: 110px
            overflow: hidden
            img
              width: 110px
              min-height: 110px
          .title
            display: flex
            flex-direction: column
            justify-content: space-between
            padding-left: 10px
            h3
              font-size: $font-size-medium
              color: $color-text
              margin-bottom: 6px
            p
              font-size: $font-size-small
              color: $color-text
              line-height: 1.4
            .theme
              display: flex
              flex-wrap: wrap
              p
                color: $color-theme
                margin-right: 5px
            .more
              display: flex
              justify-content: space-between
              align-items: center
              .left
                display: flex
                div
                  display: flex
                  align-items: center
                  margin-right: 10px
                  img
                    width: 15px
                    margin-right: 4px
              .right
                font-size: $font-size-small
                color: $color-text-d
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
