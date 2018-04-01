<template>
  <div class="specialty">
    <router-view></router-view>
    <header-bar :address="true" :title="title" @category="category" @search="search"></header-bar>
    <scroll
      :pullup="true"
      :data="specialty.shops"
      class="content"
      @scrollToEnd="pullups"
      ref="scroll">
      <div>
        <swiper :options="swiperOption" ref="mySwiper">
          <!-- 这部分放你要渲染的那些内容 -->
          <swiper-slide>
            <img @click="swiperGo(slider)" :src="top_mid.ads_img " class="index_img">
          </swiper-slide>
          <!-- 这是轮播的小圆点 -->
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
        <div class="activity-sell">
          <div class="sell-left">
            <div class="left-title">
              <h2 class="red">{{left.ads_name}}</h2>
            </div>
            <img :src="left.ads_img">
          </div>
          <div class="sell-right">
            <div class="right-top">
              <div class="title">
                <h3>{{top.ads_name}}</h3>
                <p>{{top.ads_label}}</p>
              </div>
              <div class="pic">
                <img :src="top.ads_img">
              </div>
            </div>
            <div class="right-bottom">
              <div class="bottom-item">
                <h3>{{mid.ads_name}}</h3>
                <p>{{mid.ads_label}}</p>
                <img :src="mid.ads_img">
              </div>
              <div class="bottom-item">
                <h3>{{right.ads_name}}</h3>
                <p>{{right.ads_label}}</p>
                <img :src="right.ads_img">
              </div>
            </div>
          </div>
        </div>
        <div class="goods">
          <h3 class="goods-header">附近的农户</h3>
          <div class="goods-list" v-for="item in specialty.shops" @click="selectDetail(item.shop_id)">
            <div class="goods-title">
              <div class="title-left">
                <div class="avatar">
                  <img :src="item.shop_img">
                </div>
              </div>
              <div class="title-right">
                <div class="goods-info">
                  <h3>{{item.shop_name}}</h3>
                  <p>地址:{{item.province}}{{item.city}}{{item.area}}{{item.address}}</p>
                  <p class="star-wrapper">好评度:  <star :size="12" :score="item.star"></star> </p>
                </div>
                <div class="address">
                  <p>{{item.distance}}</p>
                  <p>月销:{{item.month_sales}}</p>
                </div>
              </div>
            </div>
            <div class="goods-pic">
              <div class="item" v-for="pic in item.shop_goods_info">
                <div class="pic-wrapper">
                  <div class="pic-list">
                    <img :src="pic.shop_real_img">
                  </div>
                  <h3>{{pic.name}}</h3>
                  <p class="red">￥{{pic.current_price}}元</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <loading v-show="!hasMore"></loading>
      </div>
    </scroll>
    <bottom-bar></bottom-bar>
  </div>
</template>

<script type="text/ecmascript-6">
  import headerBar from 'base/header-bar/header-bar'
  import bottomBar from 'base/bottom-bar/bottom-bar'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import Scroll from 'base/scroll/scroll'
  import loading from 'base/loading/loading'
  import BScroll from 'better-scroll'
  import star from 'base/star/star'
  import { mapGetters } from 'vuex'

  export default{
    data() {
      return {
        title: '特产',
        specialty: {},
        page: 1,
        hasMore: true,
        swiperOption: {
          autoplay: 3500,
          setWrapperSize: true,
          pagination: '.swiper-pagination',
          paginationClickable: true,
          mousewheelControl: true,
          observeParents: true,
          loop: true
        },
        swiperSlides: [],
        left: {},
        mid: {},
        right: {},
        top: {},
        top_mid: {}
      }
    },
    computed: {
      ...mapGetters([
        'longitude',
        'latitude'
      ])
    },
    created() {
    },
    mounted() {
      this.getIndex()
    },
    methods: {
      classify(id) {
        switch (parseInt(id)) {
          case 7: // 健康套餐
            this.$router.push('/healthPackage')
            break
          case 11: // 甄选单品
            this.$router.push('/singleProductPackage')
            break
          case 6: // 年味预定
            this.$router.push('/yearReservePackage')
            break
          case 5: // 共享田园
            this.$router.push('/countrysidePackage')
            break
          default:
            console.log('here')
        }
      },
      swiperGo(slider) {
        console.log(11)
        this.$router.push(`/home/${slider.ads_url}`)
      },
      selectDetail(id) {
        this.$router.push(`/specialty/${id}`)
      },
      category() {
        this.$router.push('/allClassify')
      },
      search() {
        this.$router.push('/search')
      },
      setBannerImgHeight() {
        if (!this.checkloaded) {
          this.checkloaded = true
          setTimeout(() => {
            this.$refs.scroll.refresh()
          }, 20)
        }
      },
      getIndex() {
        this.axios.get('/api/api/getFindIndex.php', {
          params: {
            search: '',
            longitude: `${this.longitude}`,
            latitude: `${this.latitude}`,
            page: 0,
            numb: 10
          }
        })
          .then((result) => {
            console.log(result)
            if (result.data.code === 1) {
              this.specialty = result.data.result
              this.left = result.data.result.left
              this.mid = result.data.result.mid
              this.right = result.data.result.right
              this.top = result.data.result.top
              this.top_mid = result.data.result.top_mid
              this.$nextTick(() => {
                this.$refs.scroll.refresh()
              })
            }
          })
      },
      pullups() {
        console.log('pullups')
        this.$refs.scroll.refresh()
//        this.$nextTick(() => {
//          this.$refs.scroll.refresh()
//        })
      },
      back() {
        this.$router.back()
      }
    },
    destroyed() {
      clearInterval(this.timer)
    },
    watch: {
    },
    components: {
      headerBar,
      bottomBar,
      Scroll,
      loading,
      swiper,
      swiperSlide,
      BScroll,
      star
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/base.styl"

  .specialty
    position: fixed
    top: 48px
    bottom: 52px
    width: 100%
    background: $color-background-b
    .content
      height: 100%
      overflow: hidden
      .swipe
        height: 200px
        background: #e2e2e2
        .banner-item
          img
            width: 100%
            height: 235px
      .classify
        height: 100px
        background: $color-background
        display: flex
        align-items: center
        .classify-swipe
          flex: 1
          display: flex
          align-items: center
          .item
            flex: 0 0 25%
            text-align: center
            font-size: $font-size-medium
            color: $color-text
            p
              font-size: $font-size-medium
            .icon
              display: block
              margin-bottom: 10px
              img
                width: 35px
                height: 35px
      .activity-sell
        display: flex
        overflow: hidden
        height: 180px
        background: $color-background
        margin: 8px 0 10px
        h2
          font-size: $font-size-medium-x
          color: $color-text
          margin-bottom: 6px
        h3
          font-size: $font-size-medium
          color: $color-text
          margin-bottom: 6px
        p
          font-size: $font-size-small
          color: $color-text-d
        .red
          color: $color-theme-r
        .sell-left
          flex: 0 0 40%
          overflow: hidden
          display: flex
          flex-direction: column
          align-items: center
          padding-top: 20px
          border-right()
          .left-title
            width: 100%
            padding: 0 10px
          img
            height: 120px
        .sell-right
          flex: 1
          display: flex
          flex-direction: column
          overflow: hidden
          .right-top
            display: flex
            align-items: center
            padding: 0 10px
            border-1px()
            height: 90px
            .title, .pic
              flex: 0 0 50%
              align-self: center
              img
                height: 90px
          .right-bottom
            display: flex
            height: 90px
            .bottom-item
              flex: 0 0 50%
              overflow: hidden
              display: flex
              flex-direction: column
              align-items: center
              border-right()
              padding: 6px 0 0 0
              &:last-child::after
                border: none
              img
                height: 50px
      .goods
        .goods-header
          background: $color-background
          padding: 10px
          color: $color-text
          font-size: $font-size-medium-x
          border-1px()
        .goods-list
          display: flex
          flex-direction: column
          align-items: center
          background: $color-background
          padding: 0 10px
          margin-bottom: 10px
          .goods-title
            display: flex
            width: 100%
            justify-content: space-between
            padding: 10px 0
            align-items: center
            border-1px()
            .title-left
              display: flex
              flex: 0 0 72px
              align-items: center
              .avatar
                flex: 0 0 66px
                height: 66px
                border-radius: 33px
                overflow: hidden
                img
                  width: 66px
                  height: 66px
              .goods-info
                display: flex
                flex-direction: column
                justify-content: flex-start
                margin-left: 10px
            .title-right
              flex: 1
              font-size: $font-size-small
              color: $color-text-d
              display: flex
              justify-content: space-between
              overflow: hidden
              .goods-info
                no-wrap()
              h3
                font-size: $font-size-medium
                color: $color-text
                margin-bottom: 8px
              p
                font-size: $font-size-small
                color: $color-text-d
                margin-bottom: 5px
                no-wrap()
              .address
                flex: 0 0 72px
                align-self: flex-end
                text-align: right
              .goods-info
                flex: 1
              .star-wrapper
                display: flex
                .star
                  margin-left: 6px
          .goods-pic
            display: flex
            width: 100%
            padding: 10px 0
            overflow: hidden
            .item
              flex: 0 0 33.33%
              no-wrap()
              .pic-wrapper
                margin-right: 10px
                no-wrap()
                .pic-list
                  height: 108px
                  overflow: hidden
                  img
                    width: 100%
                    min-height: 100%
              h3
                font-size: $font-size-medium
                color: $color-text
                margin: 6px 0
                no-wrap()
              p
                font-size: $font-size-small
                color: $color-text-d
                margin-bottom: 3px
                &.red
                  color: $color-theme-r
              &:last-child
                .pic-wrapper
                  margin-right: 0

      .load
        text-align: center
        font-size: $font-size-medium
        color: $color-text
        margin: 10px

    .swiper-slide
      img
        width: 100%

  .scrollX-box
    /*overflow: hidden*/
    position: fixed
    left: 0
    right: 0
    height: 80px
    z-index: 1000
    .activity
      overflow: hidden
      width: 100%
      .activity-wrapper
        background: $color-background
        width: 600px
        display: flex
        .item
          flex: 1
          width: 40%
          margin-right: 10px
          img
            width: 100%
</style>
