<template>
  <div id="search">
    <div class="search-list-wrapper" v-show="hasNo">
      <scroll :data="searchlist" class="wrapper">
        <div class="search-list">
          <div class="item" @click="selectDetail(item)" v-for="item in searchlist">
            <div class="pic">
              <img :src="item.good_img">
            </div>
            <div class="title">
              <div>
                <h3>{{item.name}}</h3>
                <div class="star-wrapper">
                  <p>好评度：</p>
                  <star :size="12" :score="item.star"></star>
                </div>
                <p>销量：{{item.good_sale}}</p>
                <div class="theme">
                  <p v-for="key in item.hostel_activity">{{key}}</p>
                </div>
              </div>
              <div class="more">
                <div class="left">
                  <p class="red">￥{{item.current_price}}</p>
                </div>
                <div class="right">
                </div>
              </div>
            </div>
          </div>
        </div>
      </scroll>
    </div>
    <header-bar :title="title" @back="back" @cancel="cancel" :cancel="true"></header-bar>
    <div class="search-wrapper">
      <div class="form-group">
        <form action="#" @submit="search">
          <input type="search" v-model="searchWorld" placeholder="搜索商品名称/关键字">
        </form>
      </div>
    </div>
    <div class="hot">
      <h3>热门搜索</h3>
      <div class="hot-list">
        <span>菠萝</span>
        <span>菠萝</span>
        <span>菠萝</span>
        <span>菠萝</span>
        <span>菠萝</span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import headerBar from 'base/header-bar/header-bar'
  import scroll from 'base/scroll/scroll'
  import star from 'base/star/star'
  import { mapGetters } from 'vuex'

  export default{
    data() {
      return {
        title: '搜索',
        searchWorld: '',
        searchlist: [],
        hasNo: false
      }
    },
    computed: {
      ...mapGetters([
        'longitude',
        'latitude'
      ])
    },
    methods: {
      selectDetail(item) {
        let id = ''
        if (item.trip_id) {
          id = item.trip_id
          this.$router.push(`/ruralTourism/${id}`)
        } else if (item.hostel_id) {
          id = item.hostel_id
          this.$router.push(`/accommodation/${id}`)
        } else if (item.good_id) {
          id = item.good_id
          this.$router.push(`/home/${id}`)
        } else {
          id = item.community_id
          this.$router.push(`/interactive/${id}`)
        }
      },
      cancel() {
        this.hasNo = false
        this.searchlist = []
        this.searchWorld = ''
      },
      search() {
        if (this.searchWorld.length === 0) {
          return
        }
        this.axios({
          method: 'post',
          url: '/api/api/search.php',
          data: {
            serach: this.searchWorld,
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
            console.log(response)
            if (parseInt(response.data.code) === 1) {
              this.searchlist = response.data.result
              this.hasNo = true
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
      star
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/base.styl"

  #search
    position: fixed
    top: 48px
    bottom: 0
    width: 100%
    background: $color-background
    z-index: 300
    .search-wrapper
      padding: 6px 10px
      background: $color-background
      display: flex
      align-items: center
      justify-content: space-between
      .form-group
        flex: 1
        display: flex
        align-items: center
        form
          width: 100%
          border-radius: 4px
          overflow: hidden
          input
            padding: 10px
            outline: none
            width: 100%
            background: $color-background-b
            &::-webkit-search-cancel-button
              display: none
      .cancel
        flex: 0 0 38px
        font-size: $font-size-medium
        color: $color-text
        text-align: right
    .hot
      padding: 10px
      h3
        font-size: $font-size-medium
        color: $color-text
        margin: 0px 0 20px 0
      .hot-list
        display: flex
        align-items: center
        flex-wrap: wrap
        span
          padding: 8px 16px
          background: $color-background-b
          margin: 0 10px 10px 0
          font-size: $font-size-small
          color: $color-text
          border-radius: 4px
    .search-list-wrapper
      position: fixed
      top: 48px
      bottom: 0
      width: 100%
      background: $color-background
      .wrapper
        height: 100%
        overflow: hidden
      .search-list
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
</style>
