<template>
  <div class="city-select">
    <header-bar :title="title" @back="back"></header-bar>
    <scroll class="wrapper">
      <div>
        <div>lng: {{lng}}</div>
        <div>lat: {{lat}}</div>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import headerBar from 'base/header-bar/header-bar'
  import scroll from 'base/scroll/scroll'
  export default{
    data() {
      return {
        title: '城市选择',
        lng: 0,
        lat: 0,
        address: ''
      }
    },
    mounted() {
      this.getLocation()
    },
    methods: {
      getLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(this.showPosition)
        } else {
          this.lng = 'Geolocation is not supported by this browser.'
          this.lat = 'Geolocation is not supported by this browser.'
        }
      },
      showPosition(position) {
        this.lng = position.coords.latitude
        this.lat = position.coords.longitude
      },
      back() {
        this.$router.back()
      }
    },
    components: {
      headerBar,
      scroll
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/base.styl"
  .city-select
    position: fixed
    top: 48px
    bottom: 0
    z-index: 100
    background: $color-background
</style>
