<template>
  <div class="star" :class="{'sm_12':size===12}">
    <span class="icon" :class="cls" v-for="cls in itemClass"></span>
    <span class="score">{{score}}</span>
  </div>
</template>

<script type="text/ecmascript-6">
  const LEN = 5
  const SCL_GRAY = 'star-gray'
  const SCL_YELLOW = 'star-yellow'

  export default{
    props: {
      size: {
        type: Number,
        default: 16
      },
      score: {
        type: String
      }
    },
    computed: {
      itemClass() {
        let ret = []
        let sc = Math.floor(this.score)
        for (let i = 0; i < sc; i++) {
          ret.push(SCL_YELLOW)
        }
        while (ret.length < LEN) {
          ret.push(SCL_GRAY)
        }
        return ret
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable.styl"

  .star
    display: flex
    color: $color-theme-r
    align-items: center
    .score
      margin-left: 5px
      color: #ffce22
      position: relative
      top: 1px
    .icon
      display: block
      background: url("./star_gray.png") no-repeat
      background-size: 16px 16px !important
      width: 16px !important
      height: 16px !important
      margin-right: 5px
      &.star-gray
        background: url("./star_gray.png") no-repeat
      &.star-yellow
        background: url("./star_yellow.png") no-repeat
    &.sm_12
      .icon
        background-size: 12px 12px !important
        width: 12px !important
        height: 12px !important
        margin-right: 3px
</style>
