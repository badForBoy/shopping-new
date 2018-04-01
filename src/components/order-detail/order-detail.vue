<template>
  <div class="confirm-order">
    <setTime-popur v-show="setTimePopur" :popup="setTimePopurTitle"></setTime-popur>
    <header-bar :title="title" @back="back"></header-bar>
    <scroll class="wrapper" :data="detail.order_goods">
      <div>
        <div class="basc">
          <div class="basc-left">
            <div class="">
              <img src="./address@2x.png">
            </div>
            <div class="title">
              <p><span class="name">{{detail.consignee}}</span> <span class="phone">{{detail.mobile}}</span></p>
              <p>收货地址：<span class="sm">{{detail.address}}</span></p>
            </div>
          </div>
          <!--<span class="basc-right icon icon-cell">-->
          <!--<img src="./cell-arrow.png">-->
          <!--</span>-->
        </div>
        <div class="content">
          <div class="shop">
            <p>{{detail.shop_name}}</p>
            <span class="icon icon-cell">
              <img src="./cell-arrow.png">
            </span>
          </div>
          <div class="my-order">
            <div class="item" v-for="item in detail.order_goods" :key="item.good_id">
              <div class="pic">
                <img :src="item.good_img">
              </div>
              <div class="title">
                <h3>{{item.good_name}}</h3>
                <p>规格：{{item.good_attr_name}}</p>
                <div class="total">
                  <p class="red">￥{{item.good_price}}</p>
                  <p class="">x{{item.good_count}}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="coupon">
            <p>积分抵扣金额</p>
            <p class="sm">￥{{detail.score_money}}</p>
          </div>
          <div class="coupon">
            <p>店铺优惠</p>
            <p class="sm">￥{{detail.bonus_money}}</p>
          </div>
          <div class="coupon">
            <p>配送费</p>
            <p class="sm">{{parseInt(detail.shipping_fee) === 0 ? '免费配送' : detail.shipping_fee}}</p>
          </div>
          <div class="message">
            <p>买家留言：</p>
            <p>{{detail.pay_note}}</p>
          </div>
          <div class="total-price" v-if="detail">
            <p>共计 <span class="red">{{totalNum}}</span> 件商品</p>
            <p>合计 <span class="red">￥{{detail.order_money}}</span>
            </p>
          </div>
          <div class="order-d">
            <p>订单编号：{{detail.order_sn}}</p>
            <p>下单时间：{{detail.add_time}}</p>
          </div>
        </div>
      </div>
    </scroll>
    <div class="order-action">
      <a :href="'tel:' + detail.mobile" data-role="button" data-theme="a">联系卖家</a>
      <span @click="cancelOrder">取消订单</span>
      <span class="active" @click="goPay">去付款</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import headerBar from 'base/header-bar/header-bar'
  import Scroll from 'base/scroll/scroll'
  import setTimePopur from 'base/setTime-popur/setTime-popur'
  import { mapGetters } from 'vuex'

  //  const SCORE_RATE = 100

  export default{
    components: {
      headerBar,
      Scroll,
      setTimePopur
    },
    data() {
      return {
        title: '订单详情',
        detail: {},
        score: 0,
        setTimePopur: false,
        setTimePopurTitle: ''
      }
    },
    computed: {
      totalNum () {
        if (!this.detail.order_goods) {
          return
        }
        let totalNum = 0
        for (let i = 0; i < this.detail.order_goods.length; i++) {
          totalNum += parseFloat(this.detail.order_goods[i].good_count)
        }
        this.detail.total_num = totalNum
        return totalNum
      },
      ...mapGetters([
        'getToken',
        'orderId',
        'openId'
      ])
    },
    mounted() {
      console.log('openId:' + this.openId)
      this.getOrderDetails()
    },
    methods: {
      toggleScore(item) {
        item.score_flag = !item.score_flag
      },
      getOrderDetails() {
        if (!this.orderId) {
          this.$router.back()
        }
        console.log(this.orderId)
        this.axios({
          method: 'post',
          url: '/api/api/userOrderDetails.php',
          data: {
            token: this.getToken,
            order_id: this.orderId
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
            if (response.data.code === 1) {
              this.detail = response.data.result
              console.log(this.detail)
            }
          })
      },
      cancelOrder() {
        /*
         * 取消订单
         * */
        console.log('cancelOrder')
        this.axios({
          method: 'post',
          url: '/api/api/userCancelOrder.php',
          data: {
            token: this.getToken,
            order_id: this.orderId
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
              this.setTimePopurFlag(response.data.msg)
              this.$router.back()
            } else {
              this.setTimePopurFlag(response.data.msg)
            }
          })
      },
      goPay() {
        /*
         * 去付款
         * */
        console.log('goPay')
        this.axios({
          method: 'post',
          url: '/api/api/userPayConfirm.php',
          data: {
            money: this.detail.order_money,
            token: this.getToken,
            order_total_sn: this.detail.order_total_sn,
            openid: this.openId
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
            if (response) {
              console.log(response)
              alert(response.data.appId)
              let option = {
//                debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: response.data.appId, // 必填，公众号的唯一标识
                timeStamp: response.data.timeStamp, // 必填，生成签名的时间戳
                nonceStr: response.data.nonceStr, // 必填，生成签名的随机串
                package: response.data.package,
                signType: response.data.signType,
                paySign: response.data.paySign // 必填，签名，见附录1
              }
              this.pay(option)
//              function pay(option) {
//                console.log(option)
//                if (typeof WeixinJSBridge === 'undefined') {
//                  if (document.addEventListener) {
//                    document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false)
//                  } else if (document.attachEvent) {
//                    document.attachEvent('WeixinJSBridgeReady', onBridgeReady)
//                    document.attachEvent('onWeixinJSBridgeReady', onBridgeReady)
//                  }
//                } else {
//                  onBridgeReady(option)
//                }
//              }
//              function onBridgeReady(option) {
//                console.log(option)
//                WeixinJSBridge.invoke(
//                  'getBrandWCPayRequest', option,
//
//                  function (res) {
//                    if (res.err_msg === 'get_brand_wcpay_request:ok') {
//                      alert('支付成功') // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
//                      // 回到用户订单列表
//                      // alert("哈哈岛主");
//                      window.location.href = './order.html'
//                    } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
//                      alert('支付过程中用户取消')
//                    } else {
//                      // 支付失败
//                      alert(res.err_msg)
//                    }
//                  }
//                )
//              }
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
      },
      pay(option) {
        console.log(option)
        if (typeof WeixinJSBridge === 'undefined') {
          if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false)
          } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady)
            document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady)
          }
        } else {
          this.onBridgeReady(option)
        }
      },
      onBridgeReady(option) {
        console.log(option)
        /* eslint-disable no-undef */
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest', option,

          function (res) {
            if (res.err_msg === 'get_brand_wcpay_request:ok') {
              alert('支付成功') // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
              // 回到用户订单列表
              // alert("哈哈岛主");
              window.location.href = './order.html'
            } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
              alert('支付过程中用户取消')
            } else {
              // 支付失败
              alert(res.err_msg)
            }
          }
        )
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/base.styl"

  .confirm-order
    position: fixed
    z-index: 300
    top: 48px
    bottom: 42px
    width: 100%
    background: $color-background-b
    .wrapper
      height: 100%
      overflow: hidden
      .basc
        display: flex
        justify-content: space-between
        align-items: center
        padding: 10px
        background: $color-background
        margin-bottom: 10px
        .basc-left
          flex: 1
          display: flex
          align-items: center
          overflow: hidden
          .title
            display: flex
            flex-direction: column
            font-size: $font-size-small
            color: $color-text
            overflow: hidden
            padding-left: 10px
            p
              overflow: hidden
              text-overflow: ellipsis
              white-space: nowrap
              margin: 5px 0
              line-height: 1.4
            .sm
              color: $color-text-b
          img
            height: 60px
        .basc-right
          flex: 0 0 40px
          text-align: right
          justify-content: flex-end
      .content
        margin-bottom: 10px
        .shop
          display: flex
          align-items: center
          height: 42px
          padding: 10px
          background: $color-background
          border-1px($color-background-b)
          .icon
            margin-left: 20px
        .my-order
          margin-bottom: 10px
          background: $color-background
          .item
            padding: 10px
            display: flex
            border-1px($color-background-b)
            .pic
              flex: 0 0 60px
              img
                height: 60px
            .title
              flex: 1
              display: flex
              flex-direction: column
              justify-content: space-between
              padding: 4px 10px
              overflow: hidden
              h3
                font-size: $font-size-medium
                color: $color-text
                overflow: hidden
                text-overflow: ellipsis
                white-space: nowrap
              p
                font-size: $font-size-small
                color: $color-text-b
                overflow: hidden
                text-overflow: ellipsis
                white-space: nowrap
              .total
                display: flex
                align-items: center
                justify-content: space-between
                font-size: $font-size-small
                color: $color-text
                .red
                  color: $color-theme-r

        .score
          border-1px($color-background-b)
          label
            display: flex
            justify-content: space-between
            align-items: center
            height: 42px
            padding: 10px
            font-size: $font-size-small
            color: $color-text
        .coupon
          background: $color-background
          border-1px($color-background-b)
          display: flex
          justify-content: space-between
          align-items: center
          height: 42px
          padding: 10px
          font-size: $font-size-small
          color: $color-text
          .coupon-right
            display: flex
            color: $color-text-b
            align-items: center
            .icon
              margin-left: 20px
        .message
          background: $color-background
          display: flex
          height: 42px
          align-items: center
          font-size: $font-size-small
          color: $color-text
          padding: 10px
          border-1px($color-background-b)
          input
            outline: none
            padding: 6px
            flex: 1
        .total-price
          background: $color-background
          display: flex
          justify-content: flex-end
          padding: 10px
          height: 42px
          font-size: $font-size-small
          color: $color-text
          align-items: center
          margin-bottom: 10px
          p
            margin-left: 20px
          .red
            color: $color-theme-r
        .order-d
          display: flex
          flex-direction: column
          height: 60px
          justify-content: space-between
          background: $color-background
          padding: 10px
          font-size: $font-size-small
          color: $color-text
    .order-action
      position: fixed
      bottom: 0
      width: 100%
      background: $color-background
      height: 42px
      display: flex
      align-items: center
      justify-content: flex-end
      font-size: $font-size-medium
      color: $color-text
      padding: 10px
      span, a
        display: inline-block
        font-size: $font-size-medium
        color: $color-text-6
        padding: 5px 10px
        border: 1px solid $color-background-b
        margin-left: 5px
        &.active
          background: $color-theme
          color: $color-background
          border: 1px solid $color-theme

  .icon-cell
    display: flex
    align-items: center
    img
      height: 10px

</style>
