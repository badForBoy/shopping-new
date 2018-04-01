<template>
  <div class="line-title" @click="lineTitle">
    <span class="icon icon-left">
      <img src="./icon_line_left.png">
    </span>
    <span class="title">
      <span class="icon icon-hot" :class="{'travel': types===0,'accommodate': types===1,'interactive-img': types===2}">
      </span>
      <span>{{title}}</span>
    </span>
    <span class="icon icon-right">
      <img src="./icon_line_rigft.png">
    </span>

  </div>
</template>

<script type="text/ecmascript-6">
  export default{
    props: {
      types: {
        type: Number
      },
      title: {
        type: String
      }
    },
    methods: {
      lineTitle() {
        this.$emit('lineTitle')
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable.styl"

  .line-title
    display: flex
    width: 100%
    font-size: $font-size-medium
    color: $color-text
    justify-content: space-between
    align-content: center
    text-align: center
    padding: 22px 0
    height: 24px
    background: $color-background
    .title
      flex: 0 0 98px
      display: flex
      align-items: center
      padding: 0 10px
      .icon
        padding: 0
      .hot
        background: url("./home_new_hot.png") no-repeat
        background-size: 12px 18px
        width: 12px
        height: 18px
      .chosen
        background: url("./home_new_chosen.png") no-repeat
        background-size: 18px 18px
        width: 18px
        height: 18px
      .travel
        background: url("./icon_travel.png") no-repeat
        background-size: 18px 18px
        width: 18px
        height: 18px
      .accommodate
        background: url("./icon_accommodate.png") no-repeat
        background-size: 18px 18px
        width: 18px
        height: 18px
      .interactive-img
        background: url("./icon_interactive.png") no-repeat
        background-size: 18px 18px
        width: 18px
        height: 18px
    .icon
      flex: 1
      display: flex
      align-items: center
      img
        width: 16px
      &.icon-left
        justify-content: flex-end
      &.icon-right
        justify-content: flex-start

</style>
