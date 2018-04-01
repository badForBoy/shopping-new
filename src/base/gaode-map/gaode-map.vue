<template>
  <div class="map">
    <header-bar :title="title" @back="back"></header-bar>
    <div class="amap-page-container">
      <el-amap vid="amap" :plugin="plugin" class="amap-demo" :center="center">
      </el-amap>

      <div class="toolbar">
        <span v-if="loaded">
          location: lng = {{ lng }} lat = {{ lat }}
        </span>
        <span v-else>正在定位</span>
      </div>
      longitude:{{lng}}
      latitude: {{lat}}
      <router-link to="/navigationMap">导航</router-link>
    </div>
  </div>
</template>

<style lang="stylus" rel="stylesheet/stylus">
  /*.amap-page-container
    position: fixed
    top: 48px
    bottom: 200px
    width: 100%
    background: #fff
    z-index: 1000*/

  .amap-demo
    height: 300px

  .toolbar
    position: fixed
    bottom: 0
</style>

<script>
  import headerBar from 'base/header-bar/header-bar'

  export default{
    components: {
      headerBar
    },
    data () {
      return {
        title: '导航',
        center: [121.59996, 31.197646],
        lng: 0,
        lat: 0,
        loaded: false,
        plugin: [{
          pName: 'Geolocation',
          events: {
            init(o) {
              // o 是高德地图定位插件实例
              o.getCurrentPosition((status, result) => {
                if (result && result.position) {
                  self.lng = result.position.lng
                  self.lat = result.position.lat
                  self.center = [self.lng, self.lat]
                  self.loaded = true
                  self.$nextTick()
                }
              })
            }
          }
        }]
      }
    },
    computed: {
    },
    mounted() {
      this.$nextTick(() => {
        this.getLocation()
      })
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
    }
  }
</script>
