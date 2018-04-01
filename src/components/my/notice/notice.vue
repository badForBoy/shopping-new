<template>
  <div class="notice">
    <header-bar :title="title" @back="back"></header-bar>
    <div class="notice-item">
      <div class="pic">
        <img src="./bai_tongzhi_message.png">
      </div>
      <div class="title">
        <h3>通知消息</h3>
        <p>还没有消息哦~ 快去买点东西吧</p>
      </div>
    </div>
    <div class="notice-item">
      <div class="pic">
        <img src="./bai_bill_message.png">
      </div>
      <div class="title">
        <h3>通知消息</h3>
        <p>还没有消息哦~ 快去买点东西吧</p>
      </div>
    </div>
    <div class="notice-item">
      <div class="pic">
        <img src="./bai_wuliu_message.png">
      </div>
      <div class="title">
        <h3>通知消息</h3>
        <p>还没有消息哦~ 快去买点东西吧</p>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import headerBar from 'base/header-bar/header-bar'
  export default{
    data() {
      return {
        title: '消息通知'
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
  @import "../../../common/stylus/base.styl"

  .notice
    position: fixed
    top: 48px
    bottom: 0
    width: 100%
    background: $color-background-b
    z-index: 300
    .notice-item
      display: flex
      align-items: center
      padding: 10px
      background :$color-background
      border-1px($color-background-b)
      .pic
        width: 40px
        height: 40px
        border-radius: 4px
        overflow: hidden
        img
          width: 40px
          height: 40px
      .title
        display: flex
        justify-content: space-between
        flex-direction: column
        height: 36px
        margin-left: 6px
        h3
          font-size: $font-size-medium
          color: $color-text
        p
          font-size: $font-size-small
          color: $color-text-b

</style>
