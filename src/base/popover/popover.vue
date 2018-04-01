<template>
  <div class="popover">
    <setTime-popur v-show="setTimePopur" :popup="setTimePopurTitle"></setTime-popur>
    <div class="bgclose" @click="bgclose"></div>
    <div class="popover-wrapper">
      <div class="goods-info">
        <div class="goods-info-left">
          <div class="pic">
            <img :src="sku.length > 0 ? sku[0].sku_img : ''">
          </div>
          <div class="title">
            <p class="red">￥ {{sku.length > 0 ? sku[0].sku_price * popoverNum : null}}</p>
            <p>库存：{{sku.length > 0 ? sku[0].sku_inventory : ''}} 件</p>
            <p>已选：{{sku.length > 0 ? sku[0].sku_name : ''}}</p>
          </div>
        </div>
        <div class="goods-info-right">
          <span class="icon-close" @click="bgclose">关闭</span>
        </div>
      </div>
      <!--<div class="goods-type" v-show="popoverType">-->
      <!--<h3>我想种(可多选)</h3>-->
      <!--<div class="type-wrapper">-->
      <!--<span :class="{'active': extraIndex === index}" @click="chooseExtra(item, index)" v-for="(item, index) in skuList">{{item.k}}</span>-->
      <!--</div>-->
      <!--</div>-->
      <div class="service_price" v-show="service">
        <p>
          服务费(劳动力价值) <span class="red">{{servicePrice}}</span> 元
        </p>
        <input type="radio">
      </div>
      <div class="format-choise">
        <h3>规格选择</h3>
        <div class="type-wrapper">
          <span :class="{'active': item.active}" @click="chooseFormat(item, index)"
                v-for="(item, index) in sku" :key="item.index">{{item.sku_name}}</span>
        </div>
      </div>
      <div class="num-choise" v-show="numBtn">
        <h3 class="num-left">购买数量</h3>
        <div class="form-group">
          <span @click="reduce(sku[currentIndex])">-</span>
          <input type="text" v-model="popoverNum" disabled>
          <slot></slot>
          <span @click="add">+</span>
        </div>
      </div>
      <div></div>
      actiontype: {{actiontype}}
      <div class="btn" @click="joinBasket" v-show="actiontype===2">加入菜篮</div>
      <div class="btn" @click="buy" v-show="actiontype===1">购买</div>
      <div class="btn" @click="confirm" v-show="actiontype===99">选择规格</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapGetters, mapMutations } from 'vuex'
  import setTimePopur from 'base/setTime-popur/setTime-popur'

  export default{
    components: {
      setTimePopur
    },
    props: {
      actiontype: {
        /*
         * 1: 确认购买;  2: 加入购物车
         * 99: 菜篮：选择规格
         * */
        type: Number,
        default: 1
      },
      /*
       * 详情页类型 0: 普通商品详情 ; 6: 套餐商品详情 ; 5: 种我喜欢详情
       * 99: 自定义，菜篮规格选择弹窗 不需要数量修改 隐藏此功能
       * */
      detalisType: {
        type: Number,
        default: 99
      },
      skuList: {
        type: Array
      },
      chooseNum: {
        type: Number,
        default: 0
      }
    },
    computed: {
      servicePrice() {
        const self = this
        let p = ''
        this.sku.forEach(function (value, index) {
          if (index === self.currentIndex) {
            p = value.sku_price
          }
        })
        return p
      },
      service() {
        let flag = true
        if (this.detalisType !== 5) {
          flag = false
        }
        return flag
      },
      numBtn() {
        let flag = true
        if (this.detalisType === 99) {
          flag = false
        }
        return flag
      },
      inputChange() {
        if (this.popoverNum) {
          this.$nextTick(() => {
            if (this.popoverNum < 0) {
              this.setTimePopurFlag()
              this.popoverNum = 0
            }
            return false
          })
        }
      },
      ...mapGetters([
        'getToken',
        'sku'
      ])
    },
    created() {
    },
    data() {
      return {
        popoverNum: 0,
        setTimePopur: false,
        setTimePopurTitle: '',
        currentIndex: null
      }
    },
    methods: {
      editCartGoods(skuId, skuName) {
        console.log(skuId)
        this.axios({
          method: 'post',
          url: '/api/api/editCartGoods.php',
          data: {
            token: this.getToken,
            cart_id: this.sku[0].cart_id,
            act: 'sku', // updatenum sku
            value: skuId
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
              this.SET_SKU_DETAIL(skuName)
            } else {
              this.setTimePopurFlag(response.data.msg)
            }
          })
      },
      joinBasket() {
        console.log('joinBasket')
        if (!this.getToken) {
          this.$router.push('/login')
          return
        }
        if (this.popoverNum < 1) {
          this.setTimePopurFlag('请选择购买数量')
          return
        }
        let skuId = ''
        for (let i = 0; i < this.sku.length; i++) {
          if (this.sku[i].active) {
            skuId = this.sku[i].goods_sku_id
          }
        }
        if (!skuId) {
          this.setTimePopurFlag('请选择规格')
          return
        }
        let obj = {
          goods_id: this.$route.params.goods_id,
          token: this.getToken,
          number: this.popoverNum,
          sku_id: this.skuId
        }
        this.axios({
          method: 'post',
          url: '/api/api/addCartGoods.php',
          data: obj,
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
            if (response.data.code !== 1) {
              this.setTimePopurFlag(response.data.msg)
            }
          })
        this.$emit('bgclose')
      },
      buy() {
        console.log('buy')
        console.log(this.sku)
        console.log(this.$route.params.goods_id)
        if (!this.getToken) {
          this.$router.push('/login')
          return
        }
        this.loginAgin()
        if (this.popoverNum < 1) {
          this.setTimePopurFlag('请选择购买数量')
          return
        }
        let skuId = ''
        let skuName = ''
        for (let i = 0; i < this.sku.length; i++) {
          if (this.sku[i].active) {
            skuId = this.sku[i].goods_sku_id
            skuName = this.sku[i].sku_name
          }
        }
        if (!skuId) {
          this.setTimePopurFlag('请选择规格')
          return
        }
        let obj = {
          goods_id: this.$route.params.goods_id,
          sku_name: skuName,
          sku_id: skuId,
          number: this.popoverNum
        }
        this.SET_GOODS_ID(obj)
        setTimeout(() => {
          this.$router.push('/confirmOrder')
        })
        this.$emit('bgclose')
      },
      confirm() {
        console.log(this.sku)
        let skuId = ''
        let skuName = ''
        for (let i = 0; i < this.sku.length; i++) {
          if (this.sku[i].active) {
            skuId = this.sku[i].goods_sku_id
            skuName = this.sku[i].sku_name
          }
        }
        console.log(skuId)
        if (!skuId) {
          this.setTimePopurFlag('请选择规格')
          return
        }
        this.loginAgin()
        this.editCartGoods(skuId, skuName)
        this.$emit('confirm')
      },
      chooseFormat(item, index) {
        for (let i = 0; i < this.sku.length; i++) {
          this.sku[i].active = false
        }
        this.currentIndex = index
        let skuId = null
        let skuName = null
        item.active = !item.active
        if (!item.active) {
          skuId = null
          skuName = null
          return
        }
        skuId = item.goods_sku_id
        skuName = item.sku_name
        console.log(skuId)
        console.log(skuName)
        console.log(this.currentIndex)
        this.skuId = skuId
      },
      bgclose() {
        this.$emit('bgclose')
      },
      close() {
        this.$emit('close')
      },
      reduce() {
        if (this.popoverNum <= 1) {
          this.setTimePopurFlag('不能再减少了')
          return
        }
        this.popoverNum--
      },
      add() {
        if (this.popoverNum >= parseFloat(this.sku[0].sku_inventory)) {
          this.setTimePopurTitle = '超出库存总量了'
          this.setTimePopurFlag()
          return
        }
        this.popoverNum++
      },
      setTimePopurFlag(titie) {
        this.setTimePopurTitle = titie
        this.setTimePopur = true
        setTimeout(() => {
          this.setTimePopur = false
        }, 1000)
      },
      toggleAction() {
        this.actionFlag = !this.actionFlag
      },
      selectDetail(item) {
        this.$router.push(`/home/${item.good_id}`)
      },
      loginAgin() {
        console.log(this.getToken)
        if (!this.getToken) {
          this.setTimePopurFlag('登陆过期，请重新登陆')
          return false
        }
      },
      ...mapMutations([
        'SET_SKU_DETAIL',
        'SET_GOODS_ID'
      ])
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/base.styl"

  .popover
    position: fixed
    top: 0
    bottom: 52px
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
      top: 120px
      bottom: 0
      width: 100%
      background: $color-background
      .goods-info
        display: flex
        justify-content: space-between
        align-items: center
        padding: 10px
        border-1px()
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
      .service_price
        display: flex
        align-items: center
        justify-content: space-between
        padding: 15px 10px
        font-size: $font-size-medium
        color: $color-text
        border-1px()
        .red
          color: $color-theme-r
      .goods-type, .format-choise
        padding: 10px
        border-1px()
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
      .num-choise
        padding: 10px
        display: flex
        align-items: center
        justify-content: space-between
        border-1px()
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
</style>
