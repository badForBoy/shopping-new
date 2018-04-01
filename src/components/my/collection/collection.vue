<template>
  <div class="collection">
    <header-bar :title="title" @back="back"></header-bar>
    <div class="tab">
      <div class="item" :class="{'active':type===1}" @click="selectType(1)"><span>商品</span></div>
      <div class="item" :class="{'active':type===4}" @click="selectType(4)"><span>视屏购</span></div>
      <div class="item" :class="{'active':type===3}" @click="selectType(3)"><span>民宿</span></div>
      <div class="item" :class="{'active':type===2}" @click="selectType(2)"><span>景点</span></div>
    </div>
    <scroll
      :pullup="pullup"
      @scrollToEnd="getMore"
      class="wrapper"
      :data="list">
      <div>
        <div class="collection-list" v-if="type===2">
          <div class="item" @click="selectDetail(item)" v-for="item in list">
            <div class="pic">
              <img :src="item.img">
            </div>
            <div class="title">
              <div>
                <h3>{{item.trip_name}}</h3>
                <div class="text-wrap">
                  {{item.info}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="collection-list" v-if="type===1">
          <div class="item" @click="selectDetail(item)" v-for="item in list">
            <div class="pic">
              <img :src="item.img">
            </div>
            <div class="title">
              <div>
                <h3>{{item.trip_name}}</h3>
                <div class="star-wrapper">
                  <p>好评度：</p>
                  <star :size="12" :score="item.star"></star>
                </div>
                <p>地址：{{item.address}}</p>
                <div class="theme">
                  <p v-for="key in item.hostel_activity">{{key}}</p>
                </div>
              </div>
              <div class="more">
                <div class="left">
                  <p class="red">￥{{item.price}}元/晚</p>
                </div>
                <div class="right">
                  {{parseFloat(parseInt(item.distance / 10) / 100)}}km
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="collection-list" v-if="type===3">
          <div class="item" @click="selectDetail(item)" v-for="item in list">
            <div class="pic">
              <img :src="item.img">
            </div>
            <div class="title">
              <div>
                <h3>{{item.hostel_name}}</h3>
                <div class="star-wrapper">
                  <p>好评度：</p>
                  <star :size="12" :score="item.star"></star>
                </div>
              </div>
              <div class="text-wrap text-wrap-3">
                {{item.info}}
              </div>
              <div class="more">
                <div class="left">
                  <p class="red">￥{{item.price}}元/晚</p>
                </div>
                <!--<div class="right">
                  {{parseFloat(parseInt(item.distance / 10) / 100)}}km
                </div>-->
              </div>
            </div>
          </div>
        </div>
        <div class="getMoreStype" v-show="hasCollect">
          <loading v-show="hasMore"></loading>
          <p v-show="!hasMore">已经到底了</p>
        </div>
        <div class="no-data" v-show="!hasCollect">
          <p>您还没有收藏东西哦</p>
          <p>赶紧去收藏吧</p>
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
        title: '我的收藏',
        pullup: true,
        page: 0,
        list: [],
        type: 1,
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
        let id = ''
        if (this.type === 1) {
          id = item.to_id
          this.$router.push(`/home/${id}`)
        } else if (this.type === 2) {
          id = item.to_id
          this.$router.push(`/ruralTourism/${id}`)
        } else if (this.type === 3) {
          id = item.to_id
          this.$router.push(`/accommodation/${id}`)
        }
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
          url: '/api/api/userCollectsList.php',
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
            if (parseInt(response.data.code) === 1) {
              console.log(response.data.result.length)
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
      height: 40px
      width: 100%
      display: flex
      align-items: center
      z-index: 400
      background: $color-background
      .item
        flex: 1
        text-align: center
        font-size: $font-size-medium
        color: $color-text
        &.active
          color: $color-theme
    .collection-list
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
          flex: 1
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
          .text-wrap
            font-size: $font-size-small
            color: $color-text
            line-height: 1.4
            line-wrap(5)
            margin-top: 15px
            text-align: justify
            &.text-wrap-3
              line-wrap(3)
              margin-top: 0
          .star-wrapper
            display: flex
            align-items: center
          .theme
            display: flex
            flex-wrap: wrap
            p
              color: $color-theme
              margin-right: 5px
          .red
            font-size: $font-size-small
            color: $color-theme-r
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
