<template>
  <div class="all-classify">
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
    <header-bar @back="back" :title="title"></header-bar>
    <div class="search">
      <div class="search-wrapper">
        <span></span>
        <form action="#" @submit="search(0)">
          <input type="search" v-model="searchKey" placeholder="搜索商品名称/关键字">
        </form>
        {{searchKey}}
      </div>
    </div>
    <div class="wrapper">
      <div class="goods-list">
        <scroll
          :listenScroll="listenScroll"
          :probeType="probeType"
          :data="goodsCategory"
          class="side-bar-wrapper">
          <div>
            <div class="side-bar">
              <div
                class="item"
                :class="{'active':currentIndex===index}"
                ref="list"
                @click="toGroup(index)"
                v-for="(item, index) in goodsCategory"
                :key="item.good_category_id">{{item.category_name}}
              </div>
            </div>
          </div>
        </scroll>
        <scroll
          :listenScroll="listenScroll"
          :probeType="probeType"
          @scroll="scroll"
          :data="goodsCategory"
          ref="goodsContent"
          class="goods-wrapper">
          <div>
            <div class="goods-content">
              <div class="item" v-for="(item, index) in goodsCategory" :key="item.good_category_id" ref="group">
                <h3>{{item.category_name}}</h3>
                <div class="item-wrapper">
                  <div class="goods-box">
                    <div class="goods-item"
                         v-for="goods in item.cate"
                         @click="selectSearchWord(goods.category_name)"
                         :key="goods.good_category_id">
                      <div class="pic">
                        <img :src="goods.category_logo">
                      </div>
                      <p>{{goods.category_name}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </scroll>
      </div>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import headerBar from 'base/header-bar/header-bar'
  import Scroll from 'base/scroll/scroll'
  import star from 'base/star/star'
  import { mapGetters } from 'vuex'

  export default{
    data() {
      return {
        title: '所有分类',
        goodsCategory: [],
        goodsContent: 0,
        probeType: 3,
        listenScroll: true,
        scrollY: 0,
        currentIndex: 0,
        hasNo: false,
        searchlist: [],
        searchKey: ''
      }
    },
    computed: {
      ...mapGetters([
        'longitude',
        'latitude'
      ])
    },
    mounted() {
      this.getGoodsCategory()
    },
    methods: {
      selectSearchWord(searchWorld) {
        this.search(searchWorld)
      },
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
      search(searchWorld) {
        if (!searchWorld.length && !this.searchKey) {
          return
        }
        let search = ''
        if (searchWorld === 0) {
          search = this.searchKey
        } else {
          search = searchWorld
        }
        this.axios({
          method: 'post',
          url: '/api/api/search.php',
          data: {
            serach: search,
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
      toGroup(index) {
        this.currentIndex = index
        this.scrollY = -this.listenScroll[index]
        this.$refs.goodsContent.scrollToElement(this.$refs.group[index], 0)
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
      _calculateHeight() {
        this.listHeight = []
        const height = this.$refs.group
        let groupHeight = 0
        this.listHeight.push(groupHeight)
        for (let i = 0; i < height.length; i++) {
          groupHeight += height[i].clientHeight
          this.listHeight.push(groupHeight)
        }
        return this.listHeight
      },
      getGoodsCategory() {
        this.axios.get('/api/api/getGoodsCategory.php')
          .then((response) => {
            if (response.data.code === 1) {
              this.goodsCategory = response.data.result
              console.log(this.goodsCategory)
            }
          })
      },
      back() {
        this.$router.back()
      }
    },
    watch: {
      scrollY(newY) {
        this._calculateHeight()
        for (let i = 0; i < this.listHeight.length; i++) {
          if (-newY > this.listHeight[i] && -newY < this.listHeight[i + 1]) {
            this.currentIndex = i
            return
          }
        }
      }
    },
    components: {
      headerBar,
      Scroll,
      star
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/base.styl"

  .all-classify
    background: $color-background-b
    height: 100%
    .search
      position: fixed
      top: 48px
      width: 100%
      padding: 10px
      background: $color-background
      z-index: 400
      .search-wrapper
        height: 42px
        line-height: 42px
        font-size: $font-size-medium
        color: $color-text
        background: $color-background-b
        text-align: center
        border-radius: 4px
        cursor: pointer
    .wrapper
      .goods-list
        position: fixed
        top: 110px
        bottom: 0
        width: 100%
        z-index: 300
        display: flex
        background: $color-background-b
        .side-bar-wrapper
          flex: 0 0 90px
          display: flex
          flex-direction: column
          height: 100%
          border-right: 1px solid $color-background-d
          overflow: hidden
          .item
            background: $color-background-b
            border-1px($color-background-d)
            height: 42px
            text-align: center
            line-height: 42px
            font-size: $font-size-small
            color: $color-text
            &.active
              background: $color-background
        .goods-wrapper
          background: $color-background
          flex: 1
          overflow: hidden
          height: 100%
          .item
            h3
              font-size: $font-size-small
              color: $color-text
              background: $color-background-b
              padding: 10px
              &.top-title
                position: fixed
                top: 0
                left: 0
                right: 0
            .item-wrapper
              display: flex
              flex-wrap: wrap
              align-items: center
              .goods-box
                display: flex
                flex-wrap: wrap
                .goods-item
                  flex: 0 0 25%
                  margin-bottom: 10px
                  .pic
                    width: 60px
                    height: 60px
                    overflow: hidden
                    img
                      width: 60px
                      height: 60px
                  p
                    font-size: $font-size-small
                    color: $color-text
                    text-align: center
    .search-list-wrapper
      position: fixed
      top: 48px
      bottom: 0
      width: 100%
      background: $color-background
      z-index: 500
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
