<template>
  <div class="sign-up-detail">
    <header-bar @back="back" :title="title"></header-bar>
    <scroll class="wrapper">
      <div>

      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import headerBar from 'base/header-bar/header-bar'
  import scroll from 'base/scroll/scroll'
  export default{
    data() {
      return {
        title: '报名列表'
      }
    },
    methods: {
      back() {
        this.$router.back()
      }
    },
    components: {
      headerBar,
      scroll
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/base.styl"

  .sign-up-detail
    position: fixed
    top: 48px
    bottom: 0
    width: 100%
    background: $color-background-b
    .wrapper
      height: 100%
      overflow: hidden

</style>
