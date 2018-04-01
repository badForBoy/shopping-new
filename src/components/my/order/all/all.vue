<template>
  <div class="all">
    <setTime-popur v-show="setTimePopur" :popup="setTimePopurTitle"></setTime-popur>
    <order-list :order="order"></order-list>
  </div>
</template>

<script type="text/ecmascript-6">
  import OrderList from 'base/order-list/order-list'
  import { mapGetters } from 'vuex'
  import setTimePopur from 'base/setTime-popur/setTime-popur'
  //  import { userOrdersList } from '../../../../common/js/api.js'

  export default{
    components: {
      OrderList,
      setTimePopur
    },
    data() {
      return {
        orderList: [],
        setTimePopur: false,
        setTimePopurTitle: ''
      }
    },
    computed: {
      order() {
        for (let i = 0; i < this.orderList.length; i++) {
          let totalNum = 0
          let totalPrice = 0
          switch (parseInt(this.orderList[i].order_status)) {
            case 0:
              this.orderList[i].order_status = '待付款'
              break
            case 1:
              this.orderList[i].order_status = '待发货'
              break
            case 2:
              this.orderList[i].order_status = '待收货'
              break
            case 3:
              this.orderList[i].order_status = '待评价'
              break
            case 4:
              this.orderList[i].order_status = '完美完成'
              break
            case 5:
              this.orderList[i].order_status = '取消订单'
              break
            case 6:
              this.orderList[i].order_status = '申请退款'
              break
            case 7:
              this.orderList[i].order_status = '已退款'
              break
            case 8:
              this.orderList[i].order_status = '退款失败'
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
        'getToken'
      ])
    },
    mounted() {
      this.get()
    },
    methods: {
      get() {
        this.axios({
          method: 'post',
          url: '/api/api/userOrdersList.php',
          data: {
            token: this.getToken,
            order_status: -1,
            page: 0
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
              this.orderList = response.data.result
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
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
