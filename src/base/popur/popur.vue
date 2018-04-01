<template>
  <div class="popur">
    <div class="info">
      <div class="title">
        <h3>{{popup.title}}</h3>
        <p>{{popup.content}}</p>
      </div>
      <div class="action">
        <a @click="confirm" class="action-btn sure" href="javascript:void(0)">确定</a>
        <a @click="cancel" class="action-btn close" href="javascript:void(0)">取消</a>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default{
    props: {
      popup: {
        type: Object,
        default: {
          title: '标题',
          content: '弹窗内容'
        }
      }
    },
    methods: {
      confirm() {
        this.$emit('confirm')
      },
      cancel() {
        this.$emit('cancel')
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/base.styl"

  .popur
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
      width: 240px
      background: $color-background
      border-radius: 12px
      .title
        text-align: center
        color: $color-text
        border-1px($color-background-d)
        padding: 10px 0
        h3
          font-size: $font-size-medium-x
          margin-bottom: 10px
          font-weight: 700
        p
          font-size: $font-size-small
          padding: 10px
          line-height: 1.2
      .action
        display: flex
        align-items: center
        font-size: $font-size-medium
        .action-btn
          flex: 1
          align-items: center
          text-align: center
          padding: 13px 10px
          color: $color-text-blue
          font-weight: 700
          &:nth-child(1)
            border-right($color-background-d)

</style>
