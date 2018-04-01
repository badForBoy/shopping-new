<template>
  <div class="swipe">
    <div class="classify-swipe">
      <mt-swipe :auto="5000">
        <mt-swipe-item>
         1
        </mt-swipe-item>
        <mt-swipe-item>
          2
        </mt-swipe-item>
      </mt-swipe>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { Swipe, SwipeItem } from 'mint-ui'

  export default{
    components: {
      mtSwipe: Swipe,
      mtSwipeItem: SwipeItem
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/variable.styl"

  .swipe
    height: 100px

</style>
