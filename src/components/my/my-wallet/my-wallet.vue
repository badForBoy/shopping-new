<template>
  <div class="my-wallet">
    <header-bar @back="back" :title="title"></header-bar>
    my-wallet
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
        title: '我的钱包'
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
  @import "../../../common/stylus/base.styl"

  .my-wallet
    position: fixed
    top: 48px
    bottom: 0
    width: 100%
    background: $color-background-b
    z-index: 400

</style>
