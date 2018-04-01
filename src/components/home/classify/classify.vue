<template>
  <div class="classify">
    <div class="classify-swipe">
      <div class="item" v-for="item in icons" :key="item.ads_id" @click="classify(item.ads_id)">
            <span class="icon ">
              <img :src="item.ads_img">
            </span>
        <p>{{item.ads_name}}</p>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default{
    props: {
      icons: {
        type: Array
      }
    },
    methods: {
      classify(id) {
        this.$emit('classify', id)
      }
    },
    components: {
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/variable.styl"

  .classify
    height: 100px
    background: $color-background
    .classify-swipe
      display: flex
      align-items: center
      .item
        flex: 0 0 25%
        text-align: center
        font-size: $font-size-medium
        color: $color-text
        .icon
          display: block
          img
            width: 60%
</style>
