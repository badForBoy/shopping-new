<template>
  <div class="order">
    <header-bar :title="title" @back="back"></header-bar>
    <router-view></router-view>
    <setTime-popur v-show="setTimePopur" :popup="setTimePopurTitle"></setTime-popur>
    <popur :popup="popup" @cancel="cancel" @confirm="confirm" v-show="popurFlag"></popur>
    <div class="tag">
      <div class="tag-wrapper">
        <div class="item" @click="all" :class="{'active': status===-1}"><span>全部</span></div>
        <div class="item" @click="payment" :class="{'active': status===0}"><span>待付款</span></div>
        <div class="item" @click="deliverGoods" :class="{'active': status===1}"><span>待发货</span></div>
        <div class="item" @click="goodsReceipt" :class="{'active': status===2}"><span>待收货</span></div>
        <div class="item" @click="evaluate" :class="{'active': status===3}"><span>待评价</span></div>
      </div>
    </div>
    <scroll
      :data="orderList"
      :pullup="pullup"
      @scrollToEnd="getMoreGoods"
      class="wrapper">
      <div>
        <order-list v-if="orderList.length > 0">
          <div class="item" v-for="item in order" :key="item.order_id" v-if="item.order_status !== 99">
            <div class="date">
              <p>{{item.add_time}}</p>
              <!--<p class="theme">{{item.order_status}}</p>-->
              <p class="theme">{{item.order_status_text}}</p>
            </div>
            <div class="goods" @click="goOrderDetails(item.order_id)">
              <div class="info" v-for="good in item.order_goods">
                <div class="info-left">
                  <div class="pic">
                    <lazy-component>
                      <img :src="good.good_img">
                    </lazy-component>
                  </div>
                  <div class="title">
                    <p>{{good.good_name}}</p>
                    <p class="sm">{{good.good_attr_name}}</p>
                  </div>
                </div>
                <div class="info-right">
                  <p>￥{{good.good_price}}</p>
                  <p class="sm">x{{good.good_count}}</p>
                </div>
              </div>
            </div>
            <div class="total">
              <span>共 {{item.totalNum}} 件商品</span>
              <span>合计: ￥{{item.totalPrice}}</span>
            </div>
            <!--待付款订单-->
            <div class="action" v-if="parseInt(item.order_status)===0">
              <a :href="'tel:' + item.shop_tel" data-role="button" data-theme="a">联系卖家</a>
              <span @click="cancelOrder(item.order_id)">取消订单</span>
              <span class="active" @click="goOrderDetails(item.order_id)">去付款</span>
            </div>
            <!--待发货-->
            <div class="action" v-if="parseInt(item.order_status)===1">
              <a :href="'tel:' + item.shop_tel" data-role="button" data-theme="a">联系卖家</a>
              <span @click="noticeShop(item.order_id)">提醒卖家</span>
              <span class="active" @click="applyRefunBtn(item.order_id)">退款</span>
            </div>
            <!--待收货-->
            <div class="action" v-if="parseInt(item.order_status)===2">
              <a :href="'tel:' + item.shop_tel" data-role="button" data-theme="a">联系卖家</a>
              <span @click="goLogistic(item.order_id)">查看物流</span>
              <span class="active" @click="confirmGoods(item.order_id)">确认收货</span>
            </div>
            <!--待评价-->
            <div class="action" v-if="parseInt(item.order_status)===3">
              <span @click="deleteOrder(item.order_id)">删除订单</span>
              <span @click="goLogistic(item.order_id)">查看物流</span>
              <span class="active" @click="goComment(item.order_id)">评价</span>
            </div>
            <!--完成-->
            <div class="action" v-if="parseInt(item.order_status)===4">
              <span @click="cancelOrder(item.order_id)">删除订单</span>
            </div>
            <!--已取消订单-->
            <div class="action" v-if="parseInt(item.order_status)===5">
              <span @click="deleteOrder(item.order_id)">删除订单</span>
            </div>
          </div>
        </order-list>
        <div class="getMoreStype" v-if="orderList.length > 0">
          <loading v-show="hasMore"></loading>
          <p v-show="!hasMore">已经到底了</p>
        </div>
        <div class="more-info-wrapper">
          <loading v-show="loadFlag"></loading>
          <div class="no-data" v-if="orderList.length <= 0">
            您还没有订单偶<br/>
            赶快去购物吧
          </div>
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
  import { mapGetters, mapMutations } from 'vuex'

  export default{
    data() {
      return {
        title: '我的订单',
        orderList: [],
        status: -1,
        setTimePopur: false,
        setTimePopurTitle: '',
        loadFlag: true,
        pullup: true,
        popup: {
//          title: '提示',
//          content: '更多内容请下载APP'
        },
        popurFlag: false,
        hasMore: true,
        page: 0
      }
    },
    computed: {
      order() {
        for (let i = 0; i < this.orderList.length; i++) {
          let totalNum = 0
          let totalPrice = 0
          switch (parseInt(this.orderList[i].order_status)) {
            case -1:
              this.orderList[i].order_status_text = '全部'
              break
            case 0:
              this.orderList[i].order_status_text = '待付款'
              break
            case 1:
              this.orderList[i].order_status_text = '待发货'
              break
            case 2:
              this.orderList[i].order_status_text = '待收货'
              break
            case 3:
              this.orderList[i].order_status_text = '待评价'
              break
            case 4:
              this.orderList[i].order_status_text = '完成'
              break
            case 5:
              this.orderList[i].order_status_text = '取消订单'
              break
            case 6:
              this.orderList[i].order_status_text = '申请退款'
              break
            case 7:
              this.orderList[i].order_status_text = '已退款'
              break
            case 8:
              this.orderList[i].order_status_text = '退款失败'
              break
            case 99:
              /*
               * 自定义 用来不刷新页面情况下 删除订单(隐藏)
               * */
              this.orderList[i].order_status_text = '删除订单'
              break
          }
          for (let j = 0; j < this.orderList[i].order_goods.length; j++) {
            totalNum += parseFloat(this.orderList[i].order_goods[j].good_count)
            totalPrice += parseFloat(this.orderList[i].order_goods[j].good_price) * totalNum
          }
          this.orderList[i].totalNum = totalNum
          this.orderList[i].totalPrice = totalPrice
        }
        return this.orderList
      },
      ...mapGetters([
        'getToken',
        'orderId'
      ])
    },
    mounted() {
      this.get(this.status)
    },
    methods: {
      goComment(id) {
        /*
         * 评价
         * */
        this.$router.push(`/my/comment/${id}`)
      },
      goLogistic(id) {
        /*
        * 物流详情
        * */
        this.$router.push(`/my/logistic/${id}`)
      },
      getMoreGoods() {
        if (!this.hasMore) {
          return
        }
        console.log('getMoreGoods')
        this.page++
        console.log(this.page)
        this.getMore()
      },
      goOrderDetails(id) {
        this.SET_ORDER_ID(id)
        this.$router.push('/orderDetail')
      },
      confirmGoods(id) {
        /*
         * 确认收货
         * 修改数据对应参数
         * */
        console.log('confirmgoods')
        this.axios({
          method: 'post',
          url: '/api/api/userConfirm.php',
          data: {
            token: this.getToken,
            order_id: id,
            reason: '' // 退款原因
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
            } else {
              this.setTimePopurFlag(response.data.msg)
            }
          })
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
      applyRefun(id) {
        /*
         * 退款订单
         * 修改数据对应参数
         * */
        console.log('applyRefun')
        this.axios({
          method: 'post',
          url: '/api/api/userApplyRefund.php',
          data: {
            token: this.getToken,
            order_id: id,
            reason: '' // 退款原因
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
            } else {
              this.setTimePopurFlag(response.data.msg)
            }
          })
      },
      noticeShop(id) {
        /*
         * 提醒卖家
         * */
        console.log('noticeShop')
        this.axios({
          method: 'post',
          url: '/api/api/userNoticeShop.php',
          data: {
            token: this.getToken,
            order_id: id
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
            } else {
              this.setTimePopurFlag(response.data.msg)
            }
          })
      },
      deleteOrder(id) {
        console.log('delete:' + id)
        /*
         * 删除订单
         * 自定义order_status=99 用来不刷新页面情况下 删除订单(隐藏)
         * 修改数据对应参数
         * */
        this.axios({
          method: 'post',
          url: '/api/api/userDeleteOrder.php',
          data: {
            token: this.getToken,
            order_id: id
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
              for (let i = 0; i < this.orderList.length; i++) {
                if (this.orderList[i].order_id === id) {
                  this.orderList[i].order_status = 99
                }
              }
            } else {
              this.setTimePopurFlag(response.data.msg)
            }
          })
      },
      cancelOrder(id) {
        /*
         * 取消订单
         * 修改数据对应参数
         * */
        console.log('cancelOrder')
        this.axios({
          method: 'post',
          url: '/api/api/userCancelOrder.php',
          data: {
            token: this.getToken,
            order_id: id
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
              for (let i = 0; i < this.orderList.length; i++) {
                if (this.orderList[i].order_id === id) {
                  this.orderList[i].order_status = 5
                }
              }
            } else {
              this.setTimePopurFlag(response.data.msg)
            }
          })
      },
      all() {
        /*
         * 全部
         * */
        if (this.status === -1) {
          return
        }
        this.status = -1
        this.page = 0
        this.hasMore = true
        this.get(this.status)
      },
      payment() {
        /*
         * 待付款
         * */
        if (this.status === 0) {
          return
        }
        this.status = 0
        this.page = 0
        this.hasMore = true
        this.get(this.status)
      },
      deliverGoods() {
        /*
         * 代发货
         * */
        if (this.status === 1) {
          return
        }
        this.status = 1
        this.page = 0
        this.hasMore = true
        this.get(this.status)
      },
      goodsReceipt() {
        /*
         * 待收货
         * */
        if (this.status === 2) {
          return
        }
        this.status = 2
        this.page = 0
        this.hasMore = true
        this.get(this.status)
      },
      evaluate() {
        /*
         * 待评价
         * */
        if (this.status === 3) {
          return
        }
        this.status = 3
        this.page = 0
        this.hasMore = true
        this.get(this.status)
      },
      get() {
        this.axios({
          method: 'post',
          url: '/api/api/userOrdersList.php',
          data: {
            token: this.getToken,
            order_status: this.status,
            page: this.page
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
            this.loadFlag = false
            if (response.data.code === 1) {
              this.orderList = response.data.result
              if (response.data.result.length !== 12) {
                this.hasMore = false
              }
            } else {
              this.setTimePopurFlag(response.data.msg)
            }
          })
      },
      getMore() {
        this.axios({
          method: 'post',
          url: '/api/api/userOrdersList.php',
          data: {
            token: this.getToken,
            order_status: this.status,
            page: this.page
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
            this.loadFlag = false
            if (response.data.code === 1) {
              this.orderList = this.orderList.concat(response.data.result)
              if (response.data.result.length !== 12) {
                this.hasMore = false
              }
            } else {
              this.setTimePopurFlag(response.data.msg)
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
        this.$router.push('/my')
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
      popur
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/base.styl"

  .order
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
      height: 100%
      overflow: hidden
      .more-info-wrapper
        margin-top: 200px
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
