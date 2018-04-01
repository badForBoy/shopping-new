<template>
  <div class="setTime-popur">
    <div class="info">
      <p>{{popup}}</p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default{
    props: {
      popup: {
        type: String,
        default: '自定义文本内容!'
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/base.styl"

  .setTime-popur
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    background: $color-text-l
    display: flex
    align-items: center
    justify-content: center
    z-index: 1000
    .info
      width: 200px
      background: $color-highlight-background
      border-radius: 8px
      padding: 20px 10px
      color: $color-background
      font-size: $font-size-small
      text-align: center
      .title
        text-align: center
        color: $color-text
        border-1px($color-background-b)
        padding: 10px 0
        h3
          font-size: $font-size-medium-x
          margin-bottom: 10px
          font-weight: 700
        p
          font-size: $font-size-small
          padding: 10px
          line-height: 1.2

</style>
