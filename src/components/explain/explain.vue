<template>
  <div class="explain">
    <header-bar :title="explain.title" @back="back"></header-bar>
    explain
  </div>
</template>

<script type="text/ecmascript-6">
  import headerBar from 'base/header-bar/header-bar'

  export default {
    props: {
      explain: {
        type: Object,
        default: {
          title: '说明',
          content: '说明'
        }
      }
    },
    methods: {
      back() {
        this.$router.back()
      }
    },
    components: {
      headerBar
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/base.styl"

  .explain
    position: fixed
    top: 48px
    bottom: 48px
    width: 100%
    background: $color-background-b
    z-index: 400
</style>
