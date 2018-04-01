<template>
  <div class="bottom-action">
    <div class="action-item"  @click="phone">
      <span class="icon icon-phone"></span>
      <p>联系</p>
    </div>
    <div class="action-item" :class="{'on':is_collection}"  @click="collection">
      <span class="icon icon-star"></span>
      <p>收藏</p>
    </div>
    <div class="action-item" :class="{'on':is_zan_right}"  @click="isZan" v-show="is_zan">
      <span class="icon icon-praise"></span>
      <p>赞一个</p>
    </div>
    <div class="action-item btn" >
      <div class="type-1" v-show="actionType" @click="custom">
        {{actionTitle}}
      </div>
      <div class="type-2" v-show="!actionType">
        <div class="bg-red" @click="joinBasket">加入菜篮</div>
        <div class="bg-or" @click="buyNow">立即购买</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default{
    props: {
      actionType: {
        type: Boolean,
        default: false
      },
      actionTitle: {
        type: String,
        default: '立即定制'
      },
      is_zan: {
        type: Boolean,
        default: false
      },
      is_zan_right: {
        type: Boolean,
        default: false
      },
      is_collection: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      isZan() {
        this.$emit('isZan')
      },
      custom() {
        this.$emit('custom')
      },
      phone() {
        this.$emit('phone')
      },
      collection() {
        this.$emit('collection')
      },
      joinBasket() {
        this.$emit('joinBasket')
      },
      buyNow() {
        this.$emit('buyNow')
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/base.styl"

  .bottom-action
    position: fixed
    bottom: 0
    width: 100%
    height: 52px
    display: flex
    background: #f5f5f5
    align-items: center
    .action-item
      flex: 0 0 60px
      text-align: center
      font-size: $font-size-small
      border-right: 1px solid #ddd
      &.btn
        flex: 1
        height: 52px
        line-height: 52px
        text-align: center
        font-size: $font-size-medium
        color: $color-background
        background: $color-theme-r
        .type-2
          display: flex
          .bg-red
            flex: 0 0 50%
            background: $color-theme
          .bg-or
            flex: 0 0 50%
            background: $color-theme-r
      .icon
        display: inline-block
        background-repeat: no-repeat !important
        background-size: 18px 18px !important
        width: 18px
        height: 18px
        margin: 2px
        &.icon-phone
          background: url("./phone.png")
        &.icon-star
          background: url("./star.png")
        &.icon-praise
          background: url("./main_praise_default.png")
      &.on
        color: $color-theme-r
        .icon-praise
          background: url("./main_praise_select.png")
        .icon-star
          background: url("./tool_collect.png")

</style>
