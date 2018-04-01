<template>
  <div class="amap-page-container">
    <!--<el-amap vid="amap" :plugin="plugin" class="amap-demo" :zoom="11" :center="center"></el-amap>-->

    <el-amap vid="amap" :plugin="plugin" class="amap-demo" :center="setCenter">
    </el-amap>

    <div class="toolbar">
        <span v-if="!loaded">
          location: lng = {{ lng }} lat = {{ lat }}
        </span>
      <span v-else>正在定位</span>
    </div>
  </div>
</template>

<style>
  .amap-demo {
    height: 200px;
  }
</style>

<script>
  export default{
    data() {
      let self = this
      return {
        center: [121.59996, 31.197646],
        lng: 0,
        lat: 0,
        loaded: false,
        plugin: [{
          pName: 'Geolocation',
          showButton: false,
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
      setCenter() {
        return [this.lng, this.lat]
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
      }
    }
  }
</script>
