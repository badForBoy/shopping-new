<template>
  <div class="detail">
    <transition name="slide">
      <router-view></router-view>
    </transition>
    <header-bar :home="false" :title="title" @back="back"></header-bar>
    <scroll
      class="wrapper"
      ref="scroll"
      :data="details.link"
      :pullup="pullup"
      @scrollToEnd="getMore"
    >
      <div>
        <vue-swiper :sliders="details.show_img"></vue-swiper>
        <div class="title">
          <div class="h-title">
            <h3>{{details.name}}</h3>
            <p v-show="showChoise">每周配送{{parseInt(details.now_num)}}次</p>
          </div>
          <div class="star-wrapper">
            <span>好评度:</span>
            <star :size="12" :score="details.shop_star"></star>
          </div>
          <p class="price">{{details.current_price}}/{{details.good_unit}}</p>
          <div class="format">
            <p>销量:{{details.good_sale}}</p>
            <p v-show="showChoise">总配送次数: {{parseInt(details.need_num)}} 次</p>
            <p v-show="!showChoise">运费: {{details.shipping}} 元</p>
          </div>
        </div>
        <div class="info" v-html="details.info"></div>

        <div v-show="showChoise" @click="toChoise()" class="choise" ref="choise">
          <div class="no-choise" v-show="!setMealLen">
            <span>选择套餐规格</span>
            <span>
            <img src="./icon_more.png">
          </span>
          </div>
          <div class="has-choise" v-show="setMealLen">
            <span v-for="(item, index) in setMeal.personal" @load="setChoiseHeight">{{item}}</span>
          </div>
        </div>
        <div class="comment">
          <div class="comment-count-0" v-show="showComment">暂无评价</div>
          <div @click="toComment" class="comment-count" v-show="!showComment">
            <div class="comment-title">
              <h3>商品评价</h3>
              <p>{{details.comment_count}}条评价</p>
            </div>

            <div class="comment-info" >
              <div class="info-title">
                <div class="info-title-left">
                  <div class="pic">
                    <img :src="commentList.head_img">
                  </div>
                  <h3>{{commentList.nick_name}}</h3>
                </div>
                <div class="info-title-right">
                  {{commentList.comment_time}}
                </div>
              </div>
              <div class="info-evaluate">
                {{commentList.content}}
              </div>
            </div>

            <div class="get-more">
              查看更多评价
            </div>
          </div>
        </div>
        <div class="goods" ref="goods">
          <!--<ifream :src="details.description"></ifream>-->
          <iframe @load="setIframeHeight" ref="iframe" frameborder=0  width=100%  height=100%  marginheight=0 marginwidth=0  scrolling=no  :src="details.description"></iframe>
        </div>
      </div>
    </scroll>
    <bottom-action
      @joinBasket="joinBasket"
      @custom="custom"
      @collection="setCollect"
      :is_collection="collectFlag"
      @buyNow="buyNow"
      @phone="phone"
      :actionType="actionType"></bottom-action>
    <transition name="popover">
      <popover
        :detalisType="detailsType"
        :actiontype="staffType"
        @bgclose="bgclose"
        @confirm="bgclose"
        @collection="setCollect"
        :is_collection="collectFlag"
        v-show="showPopover"></popover>
    </transition>
    <setTime-popur :popup="setTimePopurTitle" v-show="setTimePopur"></setTime-popur>
  </div>
</template>

<script type="text/ecmascript-6">
  import headerBar from 'base/header-bar/header-bar'
  import Scroll from 'base/scroll/scroll'
  import Star from 'base/star/star'
  import VueSwiper from 'base/slide/vue-swiper'
  import bottomAction from 'base/bottom-action/bottom-action'
  import Popover from 'base/popover/popover'
  import setTimePopur from 'base/setTime-popur/setTime-popur'
  import { mapGetters, mapMutations } from 'vuex'

  export default{
    components: {
      headerBar,
      Scroll,
      Star,
      VueSwiper,
      bottomAction,
      Popover,
      setTimePopur
    },
    data() {
      return {
        detailsType: 0,
        title: '',
        details: {},
        commentList: {},
        pullup: true,
        actionType: false,
        staffType: 1, // 1: 确认购买;  2: 加入购物车
        showPopover: false,
        showChoise: false, // 判断是否为套餐
        popoverNum: 1,
        popupShow: false,
        setTimePopur: false,
        setTimePopurTitle: '',
        skuList: [],
        extraList: [],
        currentIndex: 0,
        extraIndex: 0,
        sku_id: 0,
        sku_name: null,
        collectFlag: false
      }
    },
    computed: {
      skuId() {
        return this.skuList[this.currentIndex].goods_sku_id
      },
      comment() {
        let ret = []
        const list = this.details.comment
        ret = list[0]
        return ret
      },
      showComment() {
        let conflag = false
        if (this.details.comment_count > 0) {
          conflag = false
        } else {
          conflag = true
        }
        return conflag
      },
      setMealLen() {
        let flag = false
        if (this.setMeal.goods_id) {
          flag = true
        }
        return flag
      },
      ...mapGetters([
        'setMeal',
        'getToken'
      ])
    },
    mounted() {
      this.getDetail()
    },
    methods: {
      setCollect() {
        /*
         * 点赞收藏等 / 用户添加、删除收藏
         * type: 商品 1 ; 景点 2； 民宿 3； 视频购 4 民间活动5；美食6
         * */
        this.axios({
          method: 'post',
          url: '/api/api/userAddOrRemoveCollect.php',
          data: {
            token: this.getToken || '',
            type: 1,
            to_id: this.$route.params.goods_id
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
            if (response.data.code === 1) {
              this.collectFlag = !this.collectFlag
            }
            this.setTimePopurFlag(response.data.msg)
          })
      },
      chooseExtra(item, index) {
        item.active = !item.active
        this.extraIndex = index
      },
      toChoise() {
        this.$router.push(`/home/${this.$route.params.goods_id}/choise`)
      },
      toComment() {
        // 商品：goods；景点：trip；民宿：hostel；视频：video；积分商品：score 民宿直接：hostel_to 视频购回复：reply_video  民间体验 activity
        this.SET_COMMENT_TYPE('goods')
        this.$router.push(`/home/${this.$route.params.goods_id}/commentList`)
      },
      setTimePopurFlag(title) {
        this.setTimePopurTitle = title
        this.setTimePopur = true
        setTimeout(() => {
          this.setTimePopur = false
        }, 1000)
      },
      bgclose() {
        this.close()
      },
      close() {
        this.showPopover = !this.showPopover
      },
      custom() {
        if (parseFloat(this.details.type) === 6) {
          this.toChoise()
          return
        }
        console.log('custom')
        this.close()
      },
      joinBasket() {
        console.log('joinBasket')
        this.staffType = 2
        this.close()
      },
      buyNow() {
        console.log('buyNow')
        this.staffType = 1
        this.close()
      },
      buy() {
        console.log('buy')
        if (!this.getToken) {
          this.$router.push('/login')
          return
        }
        let obj = {
          goods_id: this.details.good_id,
          sku_name: this.sku_name,
          sku_id: this.sku_id,
          number: this.popoverNum
        }
        if (!obj.sku_id) {
          this.setTimePopurFlag('请选择规格')
          return
        }
        this.SET_GOODS_ID(obj)
        setTimeout(() => {
          this.$router.push('/confirmOrder')
        })
      },
      phone() {
        console.log('phone')
        window.location.href = `tel:${10086}`
      },
      getMore() {
        console.log(1111)
        this.$refs.scroll.refresh()
      },
      setChoiseHeight() {
        console.log(11)
        setTimeout(() => {
          this.$refs.scroll.refresh()
        }, 20)
      },
      setIframeHeight() {
//        let iframe = this.$refs.iframe
//        iframe.style.height = `${document.documentElement.clientHeight + 100}px`
//        console.log(iframe.style.height)
//        let subWeb = document.frames ? iframe.document : iframe.contentDocument
//        if (iframe != null && subWeb != null) {
//          iframe.style.height = subWeb.body.scrollHeight
//        }
//        let bHeight = iframe.contentWindow.document.body.scrollHeight
//        console.log(bHeight)
//        let dHeight = iframe.contentWindow.document.documentElement.scrollHeight
//        let height = Math.max(bHeight, dHeight)
//        console.log(height)
//        this.$refs.goods.style.height = `${height}px`
      },
      setSwipeHeight() {
        if (!this.checkloaded) {
          this.checkloaded = true
          setTimeout(() => {
            this.$refs.swipe.style.height = `${this.$refs.swipeImg[0].clientHeight}px`
            this.$refs.scroll.refresh()
          }, 20)
        }
      },
      back() {
        this.$router.back()
      },
      getDetail() {
        this.axios.get('/api/api/getGoodsDetails.php', {
          params: {
            'goods_id': this.$route.params.goods_id,
            'token': this.getToken
          }
        })
          .then(function (result) {
            if (result.data.code === 1) {
              this.title = result.data.result.name
              this.details = result.data.result
              let l = []
              l.push(result.data.result.comment[0])
              this.skuList = this._normarlizeSku(result.data.result.sku)
              this.SET_SKU(this.skuList)
              this.extraList = this._normarlizeExtra(result.data.result.extra)
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
              if (result.data.result.is_collect === 1) {
                this.collectFlag = true
              } else {
                this.collectFlag = false
              }
              this.commentList = result.data.result.comment
              let setMeal = []
              this.SET_SETMEAL(setMeal)
            }
          }.bind(this))
      },
      addCartGoods() {
        if (!this.sku_id) {
          this.setTimePopurFlag('请选择规格')
          return
        }
        this.axios({
          method: 'post',
          url: '/api/api/addCartGoods.php',
          data: {
            goods_id: this.$route.params.goods_id,
            token: this.getToken,
            number: this.popoverNum,
            sku_id: this.skuId
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
            if (response.data.code === 1) {
              console.log(response)
            }
          })
      },
      _normarlizeSku(list) {
        let ret = []
        for (let i = 0; i < list.length; i++) {
          ret.push({
            goods_sku_id: list[i].goods_sku_id,
            service_price: list[i].service_price,
            sku_img: list[i].sku_img,
            sku_inventory: list[i].sku_inventory,
            sku_name: list[i].sku_name,
            sku_price: list[i].sku_price,
            active: false
          })
        }
        return ret
      },
      _normarlizeExtra(list) {
        let ret = []
        for (let i = 0; i < list.length; i++) {
          ret.push({
            k: list[i],
            active: false
          })
        }
        return ret
      },
      ...mapMutations([
        'SET_SETMEAL',
        'SET_GOODS_ID',
        'SET_SKU',
        'SET_COMMENT_TYPE'
      ])
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/base.styl"

  .detail
    position: fixed
    top: 48px
    bottom: 52px
    width: 100%
    z-index: 500
    background: $color-background-b
    .wrapper
      height: 100%
      overflow: hidden
      .swipe
        height: 235px
        .mint-swipe-items-wrap
          .mint-swipe-item
            img
              width: 100%
              height: 235px
      .title
        background: $color-background
        padding: 10px
        margin-bottom: 10px
        .h-title
          display: flex
          justify-content: space-between
          align-items: center
          margin-bottom: 10px
          h3
            font-size: $font-size-medium-x
            color: $color-text
          p
            font-size: $font-size-small
            color: $color-text-b
        .star-wrapper
          display: flex
          margin-bottom: 6px
        .price
          font-size: $font-size-medium
          color: $color-theme-r
          margin-bottom: 6px
        .format
          display: flex
          justify-content: space-between
          font-size: $font-size-small
          color: $color-text-b
      .info
        background: $color-background
        font-size: $font-size-medium
        color: $color-text-6
        line-height: 1.4
        padding: 10px
        text-align: justify
        margin-bottom: 10px
      .choise
        margin-bottom: 10px
        .no-choise
          display: flex
          justify-content: space-between
          background: $color-background
          padding: 10px
          color: $color-text-b
          font-size: $font-size-medium
        .has-choise
          display: flex
          flex-wrap: wrap
          padding: 10px
          background: $color-background
          span
            padding: 5px 8px
            margin: 0 6px 6px 0
            border-radius: 4px
            font-size: $font-size-medium
            color: $color-background
            background: $color-theme
        img
          height: 16px
      .comment
        margin-bottom: 10px
        .comment-count
          .comment-title
            display: flex
            align-items: center
            justify-content: space-between
            background: #fff
            padding: 0 10px
            border-1px($color-background-b)
            margin-bottom: 0
            height: 36px
            h3
              font-size: $font-size-medium
              color: $color-text
          .comment-info
            margin-bottom: 1px
            background: #fff
            padding: 0 10px
            .info-title
              display: flex
              align-items: center
              justify-content: space-between
              padding: 10px 0
              .info-title-right
                font-size: 12px
                color: #666
              .info-title-left
                display: flex
                flex: 1
                align-items: center
                .pic
                  width: 60px
                  height: 60px
                  border-radius: 30px
                  overflow: hidden
                  img
                    width: 60px
                    height: 60px
                h3
                  color: $color-text
                  margin-left: 6px
                  font-size: $font-size-medium
            .info-evaluate
              padding: 10px 0
              line-height: 1.4
              color: $color-text-6
              overflow: hidden
              text-overflow: ellipsis
              white-space: nowrap
              font-size: $font-size-small
          .get-more
            text-align: center
            background: #fff
            padding: 8px
            color: $color-text-6
            font-size: $font-size-medium
        .comment-count-0
          font-size: $font-size-medium
          color: $color-text-b
          padding: 15px 10px
          background: $color-background
      .goods
        height: 3150px
        overflow: hidden
        iframe
          position: relative
          z-index: -1
          background: $color-background
          padding: 0 10px

    .popover
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      z-index: 600
      .bgclose
        position: absolute
        top: 0
        bottom: 0
        width: 100%
        background-color: $color-text-l
      .popover-wrapper
        position: absolute
        top: 200px
        bottom: 0
        width: 100%
        background: $color-background
        .goods-info
          display: flex
          justify-content: space-between
          align-items: center
          padding: 10px
          border-1px($color-background-b)
          .goods-info-left
            display: flex
            .pic
              position: relative
              top: -30px
              width: 80px
              height: 80px
              border-radius: 4px
              border: 2px solid $color-background
              margin-right: 10px
              overflow: hidden
              img
                width: 80px
                height: 80px
            .title
              display: flex
              height: 46px
              flex-direction: column
              justify-content: space-between
              font-size: $font-size-small
              color: $color-text
              .red
                color: $color-theme-r
                margin-bottom: 6px
          .goods-info-right
            font-size: $font-size-small
            color: $color-text
            span
              display: block
              padding: 10px
              position: relative
              top: -30px
        .goods-type, .format-choise
          padding: 10px
          border-1px($color-background-b)
          h3
            font-size: $font-size-small
            color: $color-text
            margin-bottom: 10px
          .type-wrapper
            display: flex
            flex-wrap: wrap
            span
              display: block
              padding: 4px 8px
              font-size: $font-size-small
              color: $color-text
              background: $color-background-b
              margin: 0 10px 10px 0
              border-radius: 4px
              &.active
                background: $color-theme
                color: $color-background
        .service_price
          display: flex
          align-items: center
          justify-content: space-between
          padding: 15px 10px
          font-size: $font-size-medium
          color: $color-text
          border-1px($color-background-b)
          .red
            color: $color-theme-r
        .num-choise
          padding: 10px
          display: flex
          align-items: center
          justify-content: space-between
          border-1px($color-background-b)
          .num-left
            font-size: $font-size-medium
            color: $color-text
          .form-group
            display: flex
            input
              outline: none
              background: $color-background-b
              text-align: center
              padding: 4px 10px
              width: 60px
              margin: 0 6px
            span
              background: $color-background-b
              text-align: center
              line-height: 26px
              width: 48px
              text-align: center
        .btn
          background: $color-theme-r
          position: absolute
          bottom: 0
          width: 100%
          height: 36px
          line-height: 36px
          color: $color-background
          text-align: center

  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-active
    transform: translate3d(100%, 0, 0)

  .popover-enter-active, .popover-leave-active
    transition: all 0.3s

  .popover-enter, .popover-leave-active
    transform: translate3d(0, 100%, 0)

</style>
