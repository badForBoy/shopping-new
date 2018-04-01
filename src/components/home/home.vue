<template>
  <div class="home">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <header-bar :scrollY="scY" :home="true" :title="title" @category="category" @search="search"></header-bar>
    <scroll
      :pullup="true"
      :data="list"
      :probeType="3"
      :listenScroll="true"
      class="content"
      @scroll="scroll"
      @scrollToEnd="pullups"
      ref="scroll">
      <div>
        <swiper :options="swiperOption" ref="mySwiper">
          <!-- 这部分放你要渲染的那些内容 -->
          <swiper-slide v-for="slider in banner" :key="slider.type">
            <img @click="swiperGo(slider)" :src="slider.ads_img " class="index_img">
          </swiper-slide>
          <!-- 这是轮播的小圆点 -->
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
        <div class="classify">
          <div class="classify-swipe">
            <div class="item" v-for="item in icons" :key="item.ads_id" @click="classify(item.ads_id)">
            <span class="icon ">
              <img :src="item.ads_img">
            </span>
              <p>{{item.ads_name}}</p>
            </div>
          </div>
        </div>
        <div class="activity-box">
          <div class="activity" ref="scrollX">
            <div class="activity-wrapper">
              <div @click="swiperGo(item)" class="item" v-for="item in activity" :key="item.type">
                <img :src="item.ads_img">
              </div>
            </div>
          </div>
        </div>
        <div class="goods-list" v-for="(group, index) in list">
          <line-title @lineTitle="selectType(group.title)" :title="group.title" :types="index"></line-title>
          <div class="goods-wrapper">
            <div class="item" @click="selectDetail(key)" v-for="(key, k) in group.item" :key="k">
              <div class="item-wrapper">
                <div class="pic">
                  <!--<img :src="item.good_img">-->
                  <lazy-component>
                    <img @load="setBannerImgHeight"
                         :src="(index===0 ? key.trip_img : key.hostel_img) ? (index===0 ? key.trip_img : key.hostel_img) : key.img_url_1">
                  </lazy-component>
                </div>
                <div class="title">
                  <h3 v-if="index === 0" class="one">{{key.trip_name}}</h3>
                  <h3 v-if="index === 1" class="one">{{key.hostel_name}}</h3>
                  <h3 v-if="index === 2">{{key.title}}</h3>
                  <p v-if="index !== 2">距离:{{parseFloat(parseInt(key.distance / 10) / 100)}}km</p>
                </div>
              </div>
            </div>
          </div>
          <div class="get-more" @click="selectType(group.title)">
            查看更多
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
  import Classify from './classify/classify.vue'
  import LineTitle from 'base/line-title/line-title'
  import Scroll from 'base/scroll/scroll'
  import loading from 'base/loading/loading'
  import VueSwiper from 'base/slide/vue-swiper'
  import BScroll from 'better-scroll'
  import { mapMutations, mapGetters } from 'vuex'

  export default{
    components: {
      headerBar,
      bottomBar,
      Classify,
      LineTitle,
      Scroll,
      VueSwiper,
      loading,
      swiper,
      swiperSlide,
      BScroll
    },
    data() {
      return {
        title: '首页',
        activity: [],
        banner: [],
        icons: [],
        list: [],
        scrollY: 0,
        scY: 0,
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
        lng: 0,
        lat: 0
      }
    },
    computed: {
      ...mapGetters([
        'longitude',
        'latitude'
      ])
    },
    created() {
      this.$nextTick(() => {
        /* eslint-disable no-new */
        new BScroll(this.$refs.scrollX, {
          scrollX: true,
          eventPassthrough: 'vertical'
        })
      })
      this.timer = setInterval(() => {
        let swiperSlides = this.swiperSlides
        if (swiperSlides.length < 10) swiperSlides.push(swiperSlides.length + 1)
      }, 3000)
    },
    mounted() {
      this.getLocation()
      this.getIndex()
    },
    methods: {
      selectType(title) {
        console.log(title)
        /*
         * 农村旅游
         * 农村名宿
         * 互动社区
         * */
        if (title === '乡村旅游') {
          this.$router.push('/ruralTourism')
        } else if (title === '乡村食宿') {
          this.$router.push('/accommodation')
        } else if (title === '互动社区') {
          this.$router.push('/interactive')
        }
      },
      classify(id) {
        switch (parseInt(id)) {
          case 45: // 民间体验
            this.$router.push('/ruralExperience')
            break
          case 14: // 食材分类
            this.$router.push('/allClassify')
            break
          case 46: // 投资理财
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
        this.axios.get('/api/api/getIndex.php', {
          params: {
            search: '',
            longitude: this.longitude || this.lat,
            latitude: this.latitude || this.lng
          }
        })
          .then((result) => {
            if (result.data.code === 1) {
              this.activity = result.data.result.activity
              this.banner = result.data.result.banner
              this.icons = result.data.result.icons
              this.list = result.data.result.list
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
      },
      scroll(pos) {
        /*
         1.实时获取到better-scroll滚动的Y轴的距离scrollY
         2.scrollY对应的字母列表的位置
         3.每一个字母对应的列表都有一个高度
         4.计算每一个字母对应列表的高度_calculateHeight()
         5.scrollY与listHeight做对比 就可以算出他落在了哪个区间了
         */
        this.scrollY = pos.y
      },
      getLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(this.showPosition)
        } else {
          this.lng = 'Geolocation is not supported by this browser.'
          this.lat = 'Geolocation is not supported by this browser.'
        }
      },
      showPosition(position) {
        this.lng = position.coords.latitude
        this.lat = position.coords.longitude
        this.SET_LONGITUDE(position.coords.longitude)
        this.SET_LATITUDE(position.coords.latitude)
      },
      ...mapMutations([
        'SET_LONGITUDE',
        'SET_LATITUDE'
      ])
    },
    destroyed() {
      clearInterval(this.timer)
    },
    watch: {
      scrollY(newY) {
        if (newY > 0) {
          this.scY = 0
          return
        }
        if (newY < -100) {
          newY = -100
        }
        this.scY = -newY
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/base.styl"

  .home
    position: fixed
    top: 0
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
      .activity-box
        /*overflow: hidden*/
        margin-bottom: 10px
        .activity
          padding: 10px 0
          overflow: hidden
          width: 100%
          background: $color-background
          .activity-wrapper
            background: $color-background
            width: 150%
            display: flex
            .item
              flex: 1
              width: 40%
              margin-right: 10px
              img
                width: 100%
      .goods-list
        border-bottom: 10px solid $color-background-b
        &:last-child
          border: none !important
        .goods-wrapper
          display: flex
          flex-wrap: wrap
          background: $color-background
          .item
            flex: 0 0 33.333%
            border-radius: 2px
            overflow: hidden
            .item-wrapper
              margin: 5px
              background: $color-background
              .pic
                width: 100%
                overflow: hidden
                img
                  height: 109px
                  min-width: 100%
              .title
                color: $color-text
                font-size: $font-size-small
                height: 42px
                h3
                  font-size: $font-size-medium
                  margin: 6px 0 0 0
                  line-height: 1.4
                  &.one
                    text-overflow: ellipsis
                    white-space: nowrap
                    overflow: hidden
                p
                  line-height: 1.6
                  text-overflow: ellipsis
                  overflow: hidden
                  white-space: nowrap
                  color: $color-text-d
                  &.red
                    color: $color-theme-r
                    font-size: $font-size-small
        .get-more
          border-top()
          width: 100%
          height: 48px
          line-height: 48px
          text-align: center
          color: $color-text-d
          font-size: $font-size-medium-x
          background: $color-background
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
