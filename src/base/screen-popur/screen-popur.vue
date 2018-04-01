<template>
  <div class="screen-popur">
    <div class="popur-wrapper">
      <div class="popur-item" v-for="item in screen" @click="selectWord">{{item.key}}</div>
    </div>
    <div class="mask" @click="close"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default{
    props: {
      screen: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    methods: {
      selectWord() {
        this.$emit('selectWord')
      },
      close() {
        this.$emit('close')
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/base.styl"

  .screen-popur
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
    display: flex
    align-items: center
    justify-content: center
    z-index: 1000
    .popur-wrapper
      display: flex
      flex-direction: column
      align-items: center
      justify-content: center
      width: 100%
      background: $color-background
      position: absolute
      top: 0
      padding: 0 10px
      .popur-item
        background: $color-background
        border-1px($color-background-b)
        font-size: $font-size-medium
        color: $color-text
        height: 38px
        line-height: 38px
        width: 100%
        text-align: center
        &:last-child
          &::aafter
            border: none
    .mask
      position: absolute
      top: 0
      bottom: 0
      width: 100%
      background: $color-text-l
      z-index: -1
</style>
