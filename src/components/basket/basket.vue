<template>
  <div class="basket">
    <setTime-popur v-show="setTimePopur" :popup="setTimePopurTitle"></setTime-popur>
    <header-bar @back="back" :title="title"></header-bar>
    <scroll
      ref="scroll"
      class="wrapper"
      :data="shop"
      :pullup="pullup"
      @scrollToEnd="getMore">
      <div>
        <!--{{skuDetail}}-->
        <div class="cart-goods">
          <div class="has-goods" v-show="cartGoodsType">
            <div class="cart-item" v-for="goods in shop">
              <div class="header-title">
                <div class="header-left">
                  <label @click="allCheck(goods)" :class="{'active': allSelected}">
                    <span class="icon"></span>
                    <p>{{goods.shop_name}}</p>
                    <input type="checkbox" v-model="allSelected">
                  </label>
                </div>
                <div class="header-right">
                  <span class="" @click="toggleAction" v-show="!actionFlag">编辑</span>
                  <span class="" @click="toggleAction" v-show="actionFlag">完成</span>
                  <span></span>
                </div>
              </div>
              <ul class="cart-list">
                <li class="cart-wrapper" v-for="good in goods.goods">
                  <div class="cart-left">
                    <label :class="{'active': good.active}" @click="oneCheck(good, goods)">
                      <span class="icon"></span>
                      <input type="checkbox" v-model="good.active">
                    </label>
                    <div class="goods-wrapper">
                      <div class="goods-pic" @click="selectDetail(good.goods_id)">
                        <img :src="good.goods_img">
                      </div>
                      <div class="goods-title" v-show="!actionFlag">
                        <h3>{{good.goods_name}}</h3>
                        <p class="sm">规格:{{good.goods_sku}}</p>
                        <p class="red">￥{{good.goods_price * good.goods_number}}</p>
                      </div>
                      <div class="goods-action" v-show="actionFlag">
                        <div class="do-action">
                          <div class="num-action">
                            <span class="icon reduce" @click="reduce(good)">-</span>
                            <input type="text" :value="good.goods_number" disabled>
                            <span class="icon reduce" @click="add(good)">+</span>
                          </div>
                          <div class="format-action" @click="getSku(good.goods_id, good.goods_number, good.cart_id)">
                            <p class="sm">规格:{{good.goods_sku}}</p>
                            <span class="icon_down"> </span>
                          </div>
                        </div>
                        <div class="delete" @click="editCartGoods(good.cart_id, 'delete')">
                          删除
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="cart-right" v-show="!actionFlag">
                    <span>x{{good.goods_number}}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="no-goods" v-show="!cartGoodsType">
          </div>
        </div>
        <div class="line">
          <span class="line-1"></span>
          <p class="icon"><img src="./love.png" alt=""><span>大家都在买</span></p>
          <span class="line-1"></span>
        </div>
        <div class="hot-list">
          <div class="hot-item" v-for="item in hot" :key="item.good_id" @click="selectDetail(item.good_id)">
            <div class="item-wrapper">
              <div class="pic">
                <img :src="item.good_img">
              </div>
              <div class="title">
                <p>{{item.name}}</p>
                <p class="red">￥{{item.current_price}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </scroll>
    <transition name="popover">
      <popover
        :actiontype="99"
        :chooseNum="chooseNum"
        @bgclose="bgclose"
        @confirm="bgclose"
        v-show="showPopover">
      </popover>
    </transition>
    <div class="settlement">
      <div class="wrapper-left">
        <label @click="allCheck()" :class="{'active': allSelected}">
          <span class="icon"></span>
          <p>全选</p>
          <!--<input id="all" type="checkbox" v-model="allSelected">-->
        </label>
        <!--<input v-model="allSelected" id="all" type="checkbox">-->
        <!--<label for="all">全选</label>-->
      </div>
      <div class="wrapper-right">
        <div class="price">
          <p>
            合计
            <span class="red">￥{{totalPrice}}</span>
            <span class="sm">不含配送费</span>
          </p>
        </div>
        <div class="btn" @click="settlement">
          结算
        </div>
      </div>
    </div>
    <bottom-bar></bottom-bar>
  </div>
</template>

<script type="text/ecmascript-6">
  import bottomBar from 'base/bottom-bar/bottom-bar'
  import headerBar from 'base/header-bar/header-bar'
  import Scroll from 'base/scroll/scroll'
  import { mapGetters, mapMutations } from 'vuex'
  import setTimePopur from 'base/setTime-popur/setTime-popur'
  import popover from 'base/popover/popover'

  export default{
    components: {
      bottomBar,
      headerBar,
      Scroll,
      setTimePopur,
      popover
    },
    data() {
      return {
        title: '菜篮',
        hot: [],
        shop: [],
        skuList: [],
        allSelected: false,
        pullup: true,
        hasMore: true,
        page: 0,
        actionFlag: false,
        setTimePopur: false,
        setTimePopurTitle: '',
        showPopover: false,
        chooseNum: 0,
        cartGoodsType: false,
        cartId: null
      }
    },
    computed: {
      totalPrice() {
        let total = 0
        for (let i = 0; i < this.shop.length; i++) {
          for (let j = 0; j < this.shop[i].goods.length; j++) {
            if (this.shop[i].goods[j].active) {
              total += this.shop[i].goods[j].goods_price * this.shop[i].goods[j].goods_number
            }
          }
        }
        return total
      },
      inputChange() {
        if (this.popoverNum) {
          this.$nextTick(() => {
            console.log(this.popoverNum)
            if (this.popoverNum < 0) {
              console.log(66)
              this.setTimePopurFlag()
              this.popoverNum = 0
            }
            return false
          })
        }
      },
      ...mapGetters([
        'getToken',
        'sku',
        'skuDetail'
      ])
    },
    created() {},
    mounted() {
      this.getCartGoods()
      this.loginAgin()
    },
    methods: {
      settlement() {
        /*
        * 结算
        * cartList vuex保存
        * address_id 默认0
        * */
        let cartList = []
        for (let i = 0; i < this.shop.length; i++) {
          for (let j = 0; j < this.shop[i].goods.length; j++) {
            if (this.shop[i].goods[j].active) {
              cartList.push(this.shop[i].goods[j].cart_id)
            }
          }
        }
        if (cartList.length <= 0) {
          this.setTimePopurFlag('请选择商品!')
          return
        }
        this.SET_CART_LIST(cartList)
        setTimeout(() => {
          this.$router.push('/confirmOrder')
        }, 20)
      },
      oneCheck(item, goods) {
        item.active = !item.active
        if (!item.active) {
          this.allSelected = false
          return
        }
        for (let j = 0; j < goods.goods.length; j++) {
          if (!goods.goods[j].active) {
            return
          }
        }
        this.allSelected = true
      },
      allCheck() {
        this.allSelected = !this.allSelected
        if (!this.allSelected) {
          for (let i = 0; i < this.shop.length; i++) {
            for (let j = 0; j < this.shop[i].goods.length; j++) {
              this.shop[i].goods[j].active = false
            }
          }
        } else {
          for (let i = 0; i < this.shop.length; i++) {
            for (let j = 0; j < this.shop[i].goods.length; j++) {
              this.shop[i].goods[j].active = true
            }
          }
        }
      },
      reduce(item) {
        if (item.goods_number <= 1) {
          this.setTimePopurFlag('不能再减少了')
          return
        }
        item.goods_number--
        this.editCartGoods(item.cart_id, 'updatenum', item.goods_number)
      },
      add(item) {
        if (item.goods_number >= parseFloat(this.good_inventory)) {
          this.setTimePopurFlag('超出库存总量了')
          return
        }
        item.goods_number++
        this.editCartGoods(item.cart_id, 'updatenum', item.goods_number)
      },
      bgclose() {
        this.close()
      },
      close() {
        this.showPopover = !this.showPopover
      },
      selectDetail(id) {
        this.$router.push(`/home/${id}`)
      },
      toggleAction() {
        this.actionFlag = !this.actionFlag
      },
      editCartGoods(cartId, type, value) {
        if (!value) {
          value = 0
        }
        this.axios({
          method: 'post',
          url: '/api/api/editCartGoods.php',
          data: {
            token: this.getToken,
            cart_id: cartId,
            act: type,
            value: value
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
      getMore() {
        if (!this.hasMore) {
          this.$nextTick(() => {
            this.$refs.scroll.refresh()
          })
          return
        }
        this.page++
        console.log('page:' + this.page)
        this.getMoreGoods()
      },
      getCartGoods() {
        this.axios.get('/api/api/getCartGoods.php', {
          params: {
            token: this.getToken,
            page: this.page,
            num: 10
          }
        })
          .then((result) => {
            if (result.data.code === 1) {
              this.hot = result.data.result.hot
              if (result.data.result.shop_cart.length > 0) {
                this.cartGoodsType = true
              }
              this.shop = this._normarlizeShop(result.data.result.shop_cart)
              if (result.data.result.hot.length !== 10) {
                this.hasMore = false
              }
            }
          })
      },
      getMoreGoods() {
        this.axios.get('/api/api/getCartGoods.php', {
          params: {
            token: this.getToken,
            page: this.page,
            num: 10
          }
        })
          .then((result) => {
            if (result.data.code === 1) {
              this.hot = this.hot.concat(result.data.result.hot)
              if (result.data.result.shop_cart.length > 0) {
                this.cartGoodsType = true
              }
              if (result.data.result.hot.length !== 10) {
                this.hasMore = false
              }
            }
          })
      },
      getSku(goodsId, goodsNum, cartId) {
        this.loginAgin()
        this.showPopover = true
        this.chooseNum = parseFloat(goodsNum)
        this.cartId = cartId
        this.axios.get('/api/api/getGoodsDetails.php', {
          params: {
            'goods_id': goodsId,
            'token': this.getToken
          }
        })
          .then(function (result) {
            if (result.data.code === 1) {
              this.skuList = this._normarlizeSku(result.data.result.sku)
              this.SET_SKU(this.skuList)
              if (parseInt(result.data.result.type) === 0) {
                this.showChoise = false
                this.actionType = false
                this.popoverType = false
              } else if (parseInt(result.data.result.type) === 6) {
                this.showChoise = true
                this.actionType = true
                this.popoverType = false
              } else if (parseInt(result.data.result.type) === 5) {
                this.showChoise = false
                this.actionType = true
                this.popoverType = true
              }
            }
          }.bind(this))
      },
      setTimePopurFlag(title) {
        this.setTimePopurTitle = title
        this.setTimePopur = true
        setTimeout(() => {
          this.setTimePopur = false
        }, 1000)
      },
      back() {
        this.$router.back()
      },
      loginAgin() {
        console.log(this.getToken)
        if (!this.getToken) {
          this.setTimePopurFlag('登陆过期，请重新登陆')
          return false
        }
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
            active: false,
            goods_num: 0,
            goods_price: 0,
            cart_id: this.cartId
          })
        }
        return ret
      },
      _normarlizeShop(list) {
        /*
         * 添加active
         * 计算这一维度的选中状态 true 选中； false 未选中
         * */
        console.log(list)
        for (let i = 0; i < list.length; i++) {
          for (let j = 0; j < list[i].goods.length; j++) {
            list[i].goods[j] = {
              cart_id: list[i].goods[j].cart_id,
              goods_id: list[i].goods[j].goods_id,
              goods_img: list[i].goods[j].goods_img,
              goods_name: list[i].goods[j].goods_name,
              goods_number: list[i].goods[j].goods_number,
              goods_price: list[i].goods[j].goods_price,
              goods_sku: list[i].goods[j].goods_sku,
              goods_sku_id: list[i].goods[j].goods_sku_id,
              goods_state: list[i].goods[j].goods_state,
              active: false
            }
          }
        }
        console.log(list)
        return list
      },
      ...mapMutations([
        'SET_SKU',
        'SET_CART_LIST'
      ])
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/base.styl"

  .basket
    position: fixed
    top: 48px
    bottom: 94px
    background: $color-background-b
    width: 100%
    .settlement
      position: fixed
      bottom: 52px
      height: 42px
      width: 100%
      background: $color-background
      box-sizing: border-box
      display: flex
      justify-content: space-between
      align-items: center
      font-size: $font-size-medium
      color: $color-text
      .wrapper-left
        padding-left: 10px
        display: flex
        align-items: center
        #all
          margin-right: 6px
      .wrapper-right
        display: flex
        align-items: center
        .btn
          width: 100px
          height: 42px
          text-align: center
          line-height: 42px
          background: $color-theme
          color: $color-background
          margin-left: 6px
    .wrapper
      height: 100%
      overflow: hidden
      .line
        display: flex
        justify-content: space-between
        align-items: center
        margin: 20px 40px
        .line-1
          flex: 1
          height: 1px
          display: block
          background: $color-background-d
        .icon
          flex: 0 0 92px
          margin: 0 12px
          font-size: $font-size-medium
          color: $color-text-b
          display: flex
          align-items: center
          justify-content: space-between
          img
            width: 16px
            display: inline-block
            margin-right: 6px
      .cart-goods
        .no-goods
          background: url("./empty-cart.png") no-repeat
          background-size: 150px
          width: 150px
          height: 150px
          margin: 80px auto
        .has-goods
          .cart-item
            .header-title
              display: flex
              height: 42px
              justify-content: space-between
              align-items: center
              background: $color-background
              border-1px($color-background-b)
              padding: 10px
              label
                padding: 10px 20px 10px 10px
                flex: 0 0 42px
              .header-right
                font-size: $font-size-medium
                color: $color-text
            .cart-list
              .cart-wrapper
                display: flex
                justify-content: space-between
                align-items: center
                background: $color-background
                border-1px($color-background-b)
                padding: 10px
                .cart-left
                  display: flex
                  align-items: center
                  flex: 1
                  width: 100%
                  label
                    padding: 0 20px 0 10px
                    flex: 0 0 42px
                  .goods-wrapper
                    display: flex
                    justify-content: space-between
                    flex: 1
                    .goods-pic
                      height: 60px
                      img
                        height: 100%
                    .goods-title
                      display: flex
                      flex-direction: column
                      justify-content: space-between
                      padding-left: 10px
                      flex: 1
                      h3
                        font-size: $font-size-small
                        color: $color-text
                      p
                        font-size: $font-size-small
                    .goods-action
                      display: flex
                      justify-content: space-between
                      flex: 1
                      .delete
                        flex: 0 0 40px
                        background: #f44336
                        display: flex
                        align-items: center
                        justify-content: center
                        font-size: $font-size-small
                        color: $color-background
                        cursor: pointer
                      .do-action
                        flex: 1
                        display: flex
                        flex-direction: column
                        .num-action
                          display: flex
                          align-items: center
                          justify-content: flex-start
                          padding: 0 0 0 5px
                          .icon
                            flex: 0 0 48px
                            height: 30px
                            display: flex
                            align-items: center
                            justify-content: center
                            background: $color-background-b
                            color: $color-background-d
                          input
                            flex: 1
                            margin: 0 2px
                            background: $color-background-b
                            height: 30px
                            line-height: 30px
                            text-align: center
                            outline: none
                            width: 30px
                            font-size: $font-size-small
                            color: $color-text
                        .format-action
                          padding: 0 2px
                          display: flex
                          height: 30px
                          align-items: center
                          p
                            flex: 1
                          span
                            flex: 0 0 10px
                            text-align: center
                            margin: 10px
                .cart-right
                  font-size: $font-size-small
                  color: $color-text
      .hot-list
        display: flex
        flex-wrap: wrap
        .hot-item
          width: 50%
          margin-bottom: 5px
          &:nth-child(2n)
            .item-wrapper
              margin-left: 2px
          &:nth-child(2n-1)
            .item-wrapper
              margin-right: 2px
          .item-wrapper
            box-sizing: border-box
            background: $color-background
            img
              width: 100%
            .title
              display: flex
              flex-direction: column
              justify-content: space-between
              padding: 5px
              p
                font-size: $font-size-medium
                color: $color-text
                margin: 4px 0
                overflow: hidden
                white-space: nowrap
                text-overflow: ellipsis
                &.red
                  color: $color-theme-r

    label
      display: flex
      .icon
        display: flex
        background: url("./button_select_2.png") no-repeat
        background-size: 16px 16px !important
        width: 16px !important
        height: 16px !important
      &.active
        .icon
          background: url("./button_select_1.png") no-repeat
      input
        display: none
      p
        margin-left: 10px
        font-size: $font-size-medium
        color: $color-text

  .red
    color: $color-theme-r

  .sm
    color: $color-text-b
    font-size: $font-size-small

  .icon_down
    background: url("./icon_down.png") no-repeat
    background-size: 10px 6px
    width: 10px
    height: 6px

  .popover-enter-active, .popover-leave-active
    transition: all 0.3s

  .popover-enter, .popover-leave-active
    transform: translate3d(0, 100%, 0)
</style>
