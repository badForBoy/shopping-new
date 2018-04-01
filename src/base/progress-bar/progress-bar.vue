<template>
  <div class="progress-bar">
    <div class="progress-box">
      <span class="progress" :style="{width: progress}"></span>
    </div>
    <div class="progress-num">{{progress}}</div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default{
    props: {
      need_num: {
        type: String,
        default: 0
      },
      now_num: {
        type: String,
        default: 0
      }
    },
    computed: {
      progress() {
        let a = parseFloat(this.need_num)
        let b = parseFloat(this.now_num)
        let c = parseInt(b / a * 100 * 100) / 100

//        return `${b / a * 100}%`
        return `${c}%`
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable.styl"

  .progress-bar
    display: flex
    align-items: center
    .progress-box
      width: 120px
      height: 12px
      border: 1px solid $color-theme-r
      border-radius: 6px
      .progress
        width: 20%
        height: 10px
        display: flex
        background: $color-theme-r
        border-radius: 5px
    .progress-num
      color: $color-theme-r
      font-size: $font-size-small
      margin-left: 6px

</style>
