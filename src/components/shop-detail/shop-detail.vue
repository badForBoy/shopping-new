<template>
  <div class="shop-detail">
    <router-view></router-view>
    <header-bar :title="shop.shop_name" @back="back"></header-bar>
    <div class="shop-info">
      <div class="title-left">
        <div class="avatar">
          <img :src="shop.shop_img">
        </div>
      </div>
      <div class="title-right">
        <div class="goods-info">
          <h3>{{shop.shop_name}}</h3>
          <!--<p>地址:浙江省杭州市桐庐</p>-->
          <p class="star-wrapper">好评度:
            <star :size="12" :score="shop.star"></star>
          </p>
        </div>
        <div class="address">
          <p>{{shop.distance}}</p>
          <!--<p>月销:12</p>-->
        </div>
      </div>
    </div>
    <div class="search-wrapper">
      <form action="#" @submit="getIndex">
        <input type="search" v-model="search" placeholder="请输入关键词搜索">
      </form>
    </div>
    <div class="wrapper">
      <scroll
        class="left"
        :data="category">
        <div>
          <div class="item" :class="{'on': item.active}" v-for="(item, index) in category"
               @click="goGroup(index, item, category)">
            {{item.name}}
          </div>
        </div>
      </scroll>
      <scroll
        class="right"
        :data="goodsList"
        :probeType="3"
        :listenScroll="true"
        ref="scroll"
        @scroll="scroll"
      >
        <div>
          <div class="item" v-for="(item, index) in goodsList" ref="group">
            <h3 class="header" >{{category[index].name}}</h3>
            <div class="list">
              <div class="item-wrapper" v-for="key in item">
                <div class="pic" @click="selectDetail(key.good_id)">
                  <img :src="key.good_img">
                </div>
                <div class="title" @click="selectDetail(key.good_id)">
                  <h3>{{key.name}}</h3>
                  <p class="star-wrapper">好评度:
                    <star :size="12" :score="key.star"></star>
                  </p>
                  <p class="red">￥{{key.row_price}}元</p>
                </div>
                <div class="icon basket" @click="setSku(key.good_id)">
                  <img src="./main_join_the_basket.png">
                </div>
              </div>
            </div>
          </div>
        </div>
      </scroll>
    </div>
    <transition name="popover">
      <popover
        :detalisType="detailsType"
        :actiontype="staffType"
        :skuList="skuList"
        @bgclose="showpopover"
        @confirm="showpopover"
        v-show="showPopover"></popover>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import headerBar from 'base/header-bar/header-bar'
  import star from 'base/star/star'
  import scroll from 'base/scroll/scroll'
  import Popover from 'base/popover/popover'
  import { mapGetters, mapMutations } from 'vuex'

  export default{
    components: {
      headerBar,
      star,
      scroll,
      Popover
    },
    data() {
      return {
        shop: {},
        category: [],
        goodsList: [],
        search: '',
        scrollY: 0,
        currentIndex: 0,
        showPopover: false,
        staffType: 1, // 1: 确认购买;  2: 加入购物车
        detailsType: 0,
        showChoise: false, // 判断是否为套餐
        skuList: []
      }
    },
    computed: {
      ...mapGetters([
        'longitude',
        'latitude',
        'getToken'
      ])
    },
    mounted() {
      this.getIndex()
    },
    methods: {
      setSku(id) {
        this.showpopover()
        this.axios.get('/api/api/getGoodsDetails.php', {
          params: {
            'goods_id': id,
            'token': this.getToken
          }
        })
          .then(function (result) {
            if (result.data.code === 1) {
              this.skuList = this._normarlizeSku(result.data.result.sku)
              this.SET_SKU(this.skuList)
              if (parseInt(result.data.result.type) === 0) { // 普通商品详情
                this.detailsType = 0
                this.showChoise = false
                this.actionType = false
              } else if (parseInt(result.data.result.type) === 6) { // 套餐商品详情
                this.detailsType = 6
                this.showChoise = true
                this.actionType = true
              } else if (parseInt(result.data.result.type) === 5) { // 种我喜欢详情
                this.detailsType = 5
                this.showChoise = false
                this.actionType = true
              }
            }
          }.bind(this))
      },
      selectDetail(goodsid) {
        this.$router.push(`/home/${goodsid}`)
      },
      getIndex() {
        this.axios.get('/api/api/getGoodsList.php', {
          params: {
            shop_id: this.$route.params.id,
            longitude: this.longitude,
            latitude: this.latitude,
            search: this.search
          }
        })
          .then((result) => {
            if (result.data.code === 1) {
              this.shop = result.data.result
              this.category = this._calculateLeft(result.data.result.category)
              this.goodsList = result.data.result.goods_list
              this.$nextTick(() => {
                this.$refs.scroll.refresh()
              })
            }
          })
      },
      goGroup(index, item, category) {
        if (item.active) {
          return
        }
        this.currentIndex = index
        for (let i = 0; i < category.length; i++) {
          category[i].active = false
        }
        item.active = true
        this.$refs.scroll.scrollToElement(this.$refs.group[index], 0)
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      back() {
        this.$router.back()
      },
      _calculateLeft(list) {
        let ret = []
        for (let i = 0; i < list.length; i++) {
          if (i === this.currentIndex) {
            ret.push({
              name: list[i],
              active: true
            })
            continue
          }
          ret.push({
            name: list[i],
            active: false
          })
        }
        return ret
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
      _normarlizeSku(list) {
        list.forEach(function (value) {
          value.active = false
        })
        return list
      },
      showpopover() {
        this.showPopover = !this.showPopover
      },
      ...mapMutations([
        'SET_SKU'
      ])
    },
    watch: {
      scrollY(newY) {
        this._calculateHeight()
        for (let i = 0; i < this.listHeight.length; i++) {
          if (-newY > this.listHeight[i] && -newY < this.listHeight[i + 1]) {
            this.currentIndex = i
            for (let j = 0; j < this.category.length; j++) {
              this.category[j].active = false
            }
            this.category[i].active = true
            return
          }
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/base.styl"

  .shop-detail
    position: fixed
    top: 48px
    bottom: 0
    width: 100%
    background: $color-background-b
    z-index: 200
    .popover
      bottom: 0
    .shop-info
      display: flex
      width: 100%
      justify-content: space-between
      padding: 10px
      align-items: center
      background: $color-background
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
        h3
          font-size: $font-size-medium
          color: $color-text
          margin-bottom: 8px
        p
          font-size: $font-size-small
          color: $color-text-d
          margin-bottom: 5px
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
    .search-wrapper
      height: 48px
      display: flex
      justify-content: center
      align-items: center
      form
        flex: 0 0 90%
        input
          width: 100%
          padding: 6px 10px
          border-radius: 16px
          font-size: $font-size-medium
          color: $color-text
          background: $color-background
          &::-webkit-search-cancel-button
            display: none
    .wrapper
      position: absolute
      top: 134px
      bottom: 0
      left: 0
      right: 0
      overflow: hidden
      display: flex
      background: $color-background
      .left
        flex: 0 0 90px
        background: #F8F8F8
        height: 100%
        overflow: hidden
        no-wrap()
        .item
          height: 40px
          line-height: 40px
          text-align: center
          font-size: $font-size-medium-x
          color: $color-text
          no-wrap()
          &.on
            background: $color-background
            color: $color-theme
            border-left: 2px solid $color-theme
      .right
        height: 100%
        overflow: hidden
        flex: 1
        h3
          font-size: $font-size-medium
          color: $color-text
          line-height: 1.2
        p
          font-size: $font-size-small
          color: $color-text-d
          &.red
            color: $color-theme-r
        .item
          display: flex
          flex-direction: column
          background: $color-background
          .header
            padding: 10px
            margin-left: 0
            background: #F8F8F8
          .list
            padding: 0 10px
            .item-wrapper
              display: flex
              border-1px()
              padding: 10px 0
              &:last-child::after
                border: none
              .pic
                flex: 0 0 65px
                img
                  width: 65px
                  height: 65px
              .basket
                flex: 0 0 22px
                align-self: flex-end
                img
                  width: 22px
              .title
                flex: 1
                padding: 0 10px
                .star-wrapper
                  display: flex
                  padding: 6px 0
  .popover-enter-active, .popover-leave-active
    transition: all 0.3s

  .popover-enter, .popover-leave-active
    transform: translate3d(0, 100%, 0)
</style>
