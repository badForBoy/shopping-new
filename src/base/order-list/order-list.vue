<template>
  <div class="order-list">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  export default{
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/base.styl"

  .order-list
    margin-bottom: 10px
    .item
      margin-bottom: 10px
      background: $color-background
      .date
        display: flex
        justify-content: space-between
        align-items: center
        font-size: $font-size-small
        color: $color-text-6
        height: 32px
        border-1px($color-background-b)
        padding: 0 10px
      .info
        display: flex
        justify-content: space-between
        align-items: center
        border-1px($color-background-b)
        padding: 10px
        margin-bottom: 10px
        .info-left
          flex: 1
          display: flex
          margin-bottom: 10px
          -webkit-box-orient: vertical
          -webkit-line-clamp: 2
          overflow: hidden
          .pic
            width: 80px
            height: 80px
            img
              height: 80px
              width: 80px
          .title
            padding-left: 6px
            font-size: $font-size-medium
            color: $color-text
            display: -webkit-box
            -webkit-box-orient: vertical
            -webkit-line-clamp: 2
            overflow: hidden
            p
              margin-bottom: 10px
              line-height: 1.6
              display: -webkit-box
              -webkit-box-orient: vertical
              -webkit-line-clamp: 2
              overflow: hidden
        .info-right
          flex: 0 0 65px
          display: flex
          flex-direction: column
          justify-content: space-between
          height: 40px
          text-align: right
      .total
        padding: 10px
        font-size: $font-size-small
        color: $color-text-6
        border-1px($color-background-b)
        text-align: right
        span
          margin-left: 10px
      .action
        font-size: 0
        padding: 10px
        text-align: right
        span, a
          display: inline-block
          font-size: $font-size-medium
          color: $color-text-6
          padding: 5px 10px
          border: 1px solid $color-background-b
          margin-left: 5px
          &.active
            background: $color-theme
            color: $color-background
            border: 1px solid $color-theme

    .theme
      color: $color-theme
    .sm
      font-size: $font-size-small

</style>
