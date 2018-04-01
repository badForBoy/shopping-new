<template>
  <div class="confirm-order">
    <setTime-popur v-show="setTimePopur" :popup="setTimePopurTitle"></setTime-popur>
    <transition name="slide">
      <div class="pay_way" v-show="payWayFlag" @click="closePayWay">
        <div class="pay-mask"></div>
        <div class="pay-wrapper">
          <h3>请选择支付方式</h3>
          <div class="item" @click="wxPay">
            <img src="./wechat@2x.png">
            <p>微信支付</p>
          </div>
          <div class="item">
            <img src="./qianbao@2x.png">
            <p>钱包支付</p>
          </div>
        </div>
      </div>
    </transition>
    <header-bar :title="title" @back="back"></header-bar>
    <scroll class="wrapper" :data="shop">
      <div>
        <router-link tag="div" to="/my/address" class="basc">
          <div class="basc-left">
            <div class="">
              <img src="./address@2x.png">
            </div>
            <div class="title">
              <p><span class="name">{{address.linkman}}</span> <span class="phone">{{address.phone}}</span></p>
              <p>收货地址：<span class="sm">{{address.province}}{{address.city}}{{address.area}}{{address.details}}</span>
              </p>
            </div>
          </div>
          <span class="basc-right icon icon-cell">
            <img src="./cell-arrow.png">
          </span>
        </router-link>
        <div class="content" v-for="item in shop" :key="item.shop_id">
          <div class="shop">
            <p>{{item.shop_name}}</p>
            <span class="icon icon-cell">
              <img src="./cell-arrow.png">
            </span>
          </div>
          <div class="my-order">
            <div class="item" v-for="good in item.goods">
              <div class="pic">
                <img :src="good.goods_img">
              </div>
              <div class="title">
                <h3>{{good.goods_name}}</h3>
                <p>规格：{{good.goods_sku}}</p>
                <div class="total">
                  <p class="red">￥{{good.goods_price}}</p>
                  <p class="">x{{good.goods_number}}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="score" @click="toggleScore(item)" v-show="item.score">
            <label>
              <span>积分: {{item.score}}</span>
              <input type="checkbox">
            </label>
          </div>
          <div class="score" v-show="!item.score">
            <label>
              <span>积分不可用</span>
              <input type="checkbox" disabled>
            </label>
          </div>
          <div class="coupon" @click="goCoupon(item)">
            <p>店铺优惠</p>
            <div class="coupon-right">
              <p>选择优惠券</p>
              <span class="icon icon-cell">
                <img src="./cell-arrow.png">
              </span>
            </div>
          </div>
          <div class="message">
            <p>买家留言：</p>
            <input type="text" v-model="remark" placeholder="选填：对本次交易的说明">
          </div>
          <div class="total-price">
            <p>共计 <span class="red">{{item.shop_num}}</span> 件商品</p>
            <p>合计 <span class="red">￥
              {{item.score_flag ? (item.shop_price - item.score / item.score_rate) : item.shop_price }}
            </span>
            </p>
          </div>
        </div>
        <div>
        </div>
      </div>
    </scroll>
    <div class="action">
      <div class="total-all">
        合计：<span class="red">￥{{totalPrice}}</span>
      </div>
      <div class="btn" @click="closePayWay">
        确定支付
      </div>
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
        title: '订单确认',
        address: {},
        shop: [],
        score: 0,
        remark: '', // 备注
        payWayFlag: false,
        setTimePopur: false,
        setTimePopurTitle: ''
      }
    },
    computed: {
      goodsIdArr() {
        /*
         * 返回一个所有商品goods_id的数组集合
         * */
        let ret = []
        for (let i = 0; i < this.shop.length; i++) {
          for (let j = 0; j < this.shop[i].goods.length; j++) {
            ret.push(this.shop[i].goods[j].goods_id)
          }
        }
        return ret
      },
      shopPrice() {
        let s = []
        s = this._normalizeShop(this.shop)
        return s
      },
      amount() {
        /*
         * 总价，不包括积分优惠券
         * */
        let price = 0
        for (let i = 0; i < this.shop.length; i++) {
          for (let j = 0; j < this.shop[i].goods.length; j++) {
            price += parseFloat(this.shop[i].goods[j].goods_price) * parseFloat(this.shop[i].goods[j].goods_number)
          }
        }
        return price
      },
      totalPrice() {
        let price = 0
        for (let i = 0; i < this.shop.length; i++) {
          let score = 0
          let rate = parseFloat(this.shop[i].score_rate)
          if (this.shop[i].score_flag) {
            score = parseFloat(this.shop[i].score)
          }
          price += parseFloat(this.shop[i].shop_price) - score / rate
        }
        return price
      },
      totalNumber() {
        let number = 0
        for (let i = 0; i < this.shop.length; i++) {
          for (let j = 0; j < this.shop[i].goods.length; j++) {
            number += parseInt(this.shop[i].goods[j].goods_number)
          }
        }
        return number
      },
      ...mapGetters([
        'getToken',
        'cartList',
        'goodsId',
        'setMeal',
        'openId'
      ])
    },
    mounted() {
      this.getEditOrderInfo()
    },
    methods: {
      toggleScore(item) {
        item.score_flag = !item.score_flag
      },
      goCoupon(item) {
        if (!item.shipping) {
          this.setTimePopurFlag('商家暂无优惠券')
        }
        this.$router.push('/coupon')
      },
      getEditOrderInfo() {
        /*
         * 1：立即购买/立即订制 时的下单 第1种情况
         * a. 第1种情况（立即购买）：接口：editOrderInfo.php  有用参数: address_id、token、goods_id、number、sku_id
         * b. 第1种情况（立即订制）：接口：editOrderInfo.php  有用参数: address_id、token、goods_id、number、sku_id、personal
         * 2：购物车里下订单 第2种情况
         * a. 第2种情况（购物车）：接口：editOrderInfo.php  有用参数：cart_list、address_id、token ，其他为无用参数
         * 三种方式，vuex保存参数
         * cartList：菜篮进入
         * goodsId：商品详情直接购买
         * setMeal：套餐详情购买
         * */
        console.log(this.setMeal)
        console.log(this.goodsId)
        console.log(this.cartList)
        let options = {}
        if (this.cartList && this.cartList.length > 0) {
          options = {
            cart_list: this.cartList,
            token: this.getToken,
            number: 1,
            address_id: 0
          }
        } else if (this.goodsId.goods_id) {
          options = {
            goods_id: this.goodsId.goods_id,
            token: this.getToken,
            number: this.goodsId.number,
            sku_id: this.goodsId.sku_id,
            address_id: 0
          }
        } else if (this.setMeal.personal && this.setMeal.personal.length > 0) {
          options = {
            goods_id: this.setMeal.goods_id,
            token: this.getToken,
            number: 1,
            personal: this.setMeal.personal,
            address_id: 0,
            sku_id: ''
          }
        }
        console.log(options)
        this.axios({
          method: 'post',
          url: '/api/api/editOrderInfo.php',
          data: options,
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
              this.address = response.data.result.address
              this.shop = this._normalizeShop(response.data.result.shop)
              console.log(this.shop)
              this.score = response.data.result.user_score
            } else {
              this.setTimePopurFlag(response.data.msg)
            }
          })
      },
      wxPay() {
        console.log('wxPay')
        /*
         * 微信支付
         * 先提交订单
         * 获取order_total_sn
         * 三种方式，vuex保存参数
         * cartList：菜篮进入
         * goodsId：商品详情直接购买
         * setMeal：套餐详情购买
         * 公共参数 ：address_id remark bonus score amount
         * 1. 立即购买 特有参数 goods_id number sku_id service
         * 2. 立即定制 personal personal_time
         * 3. 购物车购买 cart_list
         * */
        let options = {}
        if (this.goodsId.goods_id) { // 立即购买
          console.log(22)
          options = {
            token: this.getToken,
            address_id: this.address.address_id,
            remark: this.remark, // 备注
            bonus: 0, // 未做 暂时默认为0
            score: 0,
            amount: this.amount,
            channel: 'webwx',
            goods_id: this.goodsId.goods_id,
            number: this.goodsId.number,
            sku_id: this.goodsId.sku_id,
            service: ''
          }
          console.log(options)
        } else if (this.setMeal.personal && this.setMeal.personal.length > 0) { // 立即定制
          console.log(33)
          options = {
            token: this.getToken,
            address_id: this.address.address_id,
            remark: this.remark, // 备注
            bonus: 0, // 未做 暂时默认为0
            score: 0,
            amount: this.amount,
            goods_id: this.setMeal.goods_id,
            number: 1, // 套餐默认为1
            channel: 'webwx',
            personal: this.setMeal.personal,
            personal_time: '' // 未知参数
          }
        } else if (this.cartList && this.cartList.length > 0) { // 购物车购买
          console.log(44)
          options = {
            token: this.getToken,
            address_id: this.address.address_id,
            remark: this.remark, // 备注
            bonus: 0, // 未做 暂时默认为0
            score: 0,
            amount: this.amount,
            channel: 'webwx',
            cart_list: this.cartList
          }
        }
        console.log(options)
        this.payWayFlag = true
        this.axios({
          method: 'post',
          url: '/api/api/addOrder.php',
          data: options,
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
              let sn = response.data.result
              this.goPay(sn)
            }
          })
      },
      goPay(sn) {
        /*
         * 去付款
         * */
        console.log('goPay')
        this.axios({
          method: 'post',
          url: '/api/api/userPayConfirm.php',
          data: {
            money: this.totalPrice,
            token: this.getToken,
            order_total_sn: sn,
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
              alert('appId' + response.data.appId)
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
            }
          })
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
      closePayWay() {
        this.payWayFlag = !this.payWayFlag
      },
      _normalizeShop(list) {
        /*
         * 添加shopNum， shopPrice属性
         * 计算这一维度的商品总数量和总价格（不计算优惠券和积分）
         * */
        for (let i = 0; i < list.length; i++) {
          let shopNum = 0
          let shopPrice = 0

          for (let j = 0; j < list[i].goods.length; j++) {
            shopNum += parseFloat(list[i].goods[j].goods_number)
            shopPrice += parseFloat(list[i].goods[j].goods_number) * parseFloat(list[i].goods[j].goods_price)
          }

          list[i] = {
            able: list[i].able,
            goods: list[i].goods,
            score: list[i].score,
            score_rate: list[i].score_rate,
            shipping: list[i].shipping,
            shop_id: list[i].shop_id,
            shop_name: list[i].shop_name,
            shop_num: shopNum,
            shop_price: shopPrice,
            score_flag: false
          }
        }
        return list
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
        background: $color-background
        margin-bottom: 10px
        .shop
          display: flex
          align-items: center
          height: 42px
          padding: 10px
          border-1px($color-background-b)
          .icon
            margin-left: 20px
        .my-order
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
          display: flex
          justify-content: flex-end
          padding: 10px
          height: 42px
          font-size: $font-size-small
          color: $color-text
          p
            margin-left: 20px
          .red
            color: $color-theme-r
    .action
      position: fixed
      bottom: 0
      width: 100%
      background: $color-background
      height: 42px
      display: flex
      align-items: center
      justify-content: space-between
      font-size: $font-size-medium
      color: $color-text
      padding-left: 10px
      .red
        color: $color-theme-r
      .btn
        background: $color-theme
        height: 42px
        line-height: 42px
        color: $color-background
        padding: 0 20px

    .pay_way
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      z-index: 1000
      .pay-mask
        position: absolute
        bottom: 118px
        top: 0
        width: 100%
        background-color: $color-text-l
      .pay-wrapper
        position: absolute
        bottom: 0
        width: 100%
        background: $color-background
        h3
          font-size: $font-size-medium
          color: $color-text
          padding: 10px
          border-1px($color-background-b)
        .item
          display: flex
          align-items: center
          padding: 10px
          border-1px($color-background-b)
          font-size: $font-size-medium
          color: $color-text
          img
            width: 22px
            margin-right: 20px

    .icon-cell
      display: flex
      align-items: center
      img
        height: 10px

    .slide-enter-active, .slide-leave-active
      transition: all 0.3s

    .slide-enter, .slide-leave-active
      transform: translate3d(0, 100%, 0)

</style>
