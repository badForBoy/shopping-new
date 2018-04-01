<template>
  <div class="follow">
    <header-bar :title="title"></header-bar>
    address
  </div>
</template>

<script type="text/ecmascript-6">
  import headerBar from 'base/header-bar/header-bar'
  export default{
    data() {
      return {
        title: '我的关注'
      }
    },
    components: {
      headerBar
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/base.styl"

  .follow
    position: fixed
    top: 41px
    bottom: 0
    width: 100%
</style>
