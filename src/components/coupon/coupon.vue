<template>
  <div class="coupon-page">
    <header-bar :title="title" @back="back"></header-bar>
  </div>
</template>

<script type="text/ecmascript-6">
  import headerBar from 'base/header-bar/header-bar'

  export default{
    components: {
      headerBar
    },
    data() {
      return {
        title: '优惠券'
      }
    },
    methods: {
      back() {
        this.$router.back()
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/base.styl"

  .coupon-page
    position: fixed
    top: 48px
    bottom: 0
    width: 100%
    background: $color-background-b
</style>
