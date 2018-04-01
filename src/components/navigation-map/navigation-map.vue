<template>
  <div class="na-map">
    <header-bar :title="title" @back="back"></header-bar>
    <div class="amap-page-container">
      <div id="panel"></div>
      <el-amap
        vid="amap"
        :plugin="plugin"
        class="amap-demo"
        :zoom="zoom"
        :resizeEnable="resizeEnable"
        :center="setCenter">
      </el-amap>

      <div class="toolbar">
        <span v-if="loaded">
          location: lng = {{ lng }} lat = {{ lat }}
        </span>
        <span v-else>正在定位</span>
      </div>

      <el-button
        class="gotoAmap"
        @click="searchOnAMap"
      >searchOnAMap
      </el-button>
      <!--  longitude:{{lng}}
        latitude: {{lat}}-->
    </div>
  </div>
</template>

<script>
  import headerBar from 'base/header-bar/header-bar'
  import { Message } from 'element-ui'

  export default{
    components: {
      headerBar
    },
    data () {
      let self = this
      return {
        title: '导航',
        center: [116.354095, 39.963041],
        lng: 0,
        lat: 0,
        zoom: 12,
        resizeEnable: true,
        loaded: false,
        // 用来解决多次显示message的问题
        drivingFlag: false,
        plugin: [
          {
            pName: 'Geolocation',
            events: {
              init(o) {
                // o 是高德地图定位插件实例
                o.getCurrentPosition((status, result) => {
                  if (result && result.position) {
                    self.lng = result.position.lng
                    self.lat = result.position.lat
//                    self.center = [self.lng, self.lat]
                    self.loaded = true
                    self.$nextTick()
                  }
                })
              }
            }
          },
          {
            pName: 'AMap.Driving'
          }
        ],
        events: {
          init(o) {
            // 导航，报错 INVALID_USER_DOMAIN 需要有域名白名单
            console.log(o)
            let {lng, lat} = o.lnglat
            self.lng = lng
            self.lat = lat
            // 这里用高德 SDK 完成
            /* eslint-disable no-undef */
            let driving = new AMap.Driving({
              policy: AMap.DrivingPolicy.LEAST_TIME,
              map: self.amapManager.getMap(),
              panel: 'panel'
            })
            self.driving = driving
            driving.search([{keyword: '客运中心', city: '杭州'}, {keyword: '八堡家园', city: '杭州'}], function (status, result) {
              console.log(result)
              self.result = result
              alert(result)
              if (!self.drivingFlag) {
                Message.success('路径规划成功')
              }
              self.drivingFlag = true
            })
          },
          click() {
            alert(33)
          }
        },
        searchOption: {
          city: '秦皇岛',
          citylimit: true
        }
      }
    },
    computed: {
      setCenter() {
        return [this.lng, this.lat]
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.getLocation()
      })
    },
    methods: {
      searchOnAMap () {
        if (!this.driving) {
          Message.info('请先规划路径')
        } else {
          this.driving.searchOnAMAP({
            origin: this.result.origin,
            destination: this.result.destination
          })
        }
      },
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

<style lang="stylus" rel="stylesheet/stylus">
  .na-map
    .amap-page-container
      position: fixed
      top: 48px
      bottom: 100px
      width: 100%
      background: #fff
      z-index: 2 000

  .amap-demo
    height: 300px

  .toolbar
    position: fixed
    bottom: 0

  #panel
    position: fixed
    background-color: white
    max-height: 90%
    overflow-y: auto
    top: 10px
    right: 10px
    width: 280px
</style>

<!--<template>
  <div class="map">
    <h3 class="title">{{ msg }}</h3>
    <div class="amap-wrapper">
      <el-amap-search-box
        class="amap-search-box"
        :search-option="searchOption"
        :on-search-result="onSearchResult"
      >
      </el-amap-search-box>
      <el-amap
        :vid="'amap-vue'"
        :map-manager="amapManager"
        :center="center"
        :zoom="zoom"
        :events="events"
        :plugin="plugins"
        class="amap-demo">
        <el-amap-marker
          v-for="(marker, index) in markers"
          :key="index"
          :position="marker.position"
          :event="marker.events"
          :visible="marker.visible"
          :draggable="marker.draggable"
        ></el-amap-marker>
        &lt;!&ndash;<el-amap-info-window&ndash;&gt;
        &lt;!&ndash;v-for="(window, index) in windows"&ndash;&gt;
        &lt;!&ndash;:index="index"&ndash;&gt;
        &lt;!&ndash;:position="window.position"&ndash;&gt;
        &lt;!&ndash;:visible="window.visible"&ndash;&gt;
        &lt;!&ndash;:content="window.content"&ndash;&gt;
        &lt;!&ndash;:events="window.events"&ndash;&gt;
        &lt;!&ndash;&gt;</el-amap-info-window>&ndash;&gt;
      </el-amap>
      <div class="toolbar">
        <el-button
          class="toolbar-button"
          @click="toggleVisible">
          toggle first marker
        </el-button>
        <el-button
          class="toolbar-button"
          @click="changePosition">
          change position
        </el-button>
        <el-button
          class="toolbar-button"
          @click="changeDraggle">
          change draggle
        </el-button>
        <el-button
          type="primary"
          class="toolbar-button"
          @click="addMarker">
          add marker
        </el-button>
        <el-button
          class="toolbar-button"
          @click="removeMarker">
          remove marker
        </el-button>
        <el-button
          class="gotoAmap"
          @click="searchOnAMap"
        >searchOnAMap
        </el-button>
      </div>
      <div class="geocoder-bar">
        position: [{{lng}},{{lat}}] address: {{address}}
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  /* eslint-disable no-duplicate-imports */
  import VueAMap from 'vue-amap'
  import { Message } from 'element-ui'
  let amapManager = new VueAMap.AMapManager()
  export default {
    name: 'amap-page',
    data () {
      let self = this
      return {
        msg: 'vue-amap say hello',
        amapManager,
        zoom: 14,
        lat: '',
        lng: '',
        center: [119.547204, 39.919205],
        // 用来解决多次显示message的问题
        drivingFlag: false,
        markers: [
          {
            position: [119.547204, 39.919205],
            events: {
              click: () => {
                alert('your click me')
              },
              dragend: (e) => {
                // 使用es6中额解构赋值
                const {lng, lat} = e.target.getPosition()
                this.markers[0].position = [lng, lat]
              }
            },
            visible: true,
            draggable: false
          }
        ],
//        windows: [
//          {
//            position: [119.547204, 39.919205],
//            visible: true,
//            content: 'hello'
//          }
//        ],
        address: '',
        plugins: [
          {
            pName: 'AMap.OverView',
            events: {
              init (instance) {
                console.log(instance)
              }
            }
          },
          {
            pName: 'AMap.Scale',
            events: {
              init (instance) {
                console.log(instance)
              }
            }
          },
          {
            pName: 'AMap.ToolBar',
            events: {
              init (instance) {
                console.log(instance)
              }
            }
          },
          {
            pName: 'AMap.MapType',
            defaultType: 0,
            events: {
              init (instance) {
                console.log(instance)
              }
            }
          },
          {
            pName: 'AMap.Driving'
          }
        ],
        events: {
          click (e) {
            let {lng, lat} = e.lnglat
            self.lng = lng
            self.lat = lat
            // 这里用高德 SDK 完成
            /* eslint-disable no-undef */
            let geocoder = new AMap.Geocoder({
              radius: 1000,
              extensions: 'all'
            })
            geocoder.getAddress([lng, lat], function (status, result) {
              if (status === 'complete' && result.info === 'OK') {
                if (result && result.regeocode) {
                  self.address = result.regeocode.formattedAddress
                  self.$nextTick()
//                  Message.success('位置成功确认')
                }
              }
            })
            let driving = new AMap.Driving({
              policy: AMap.DrivingPolicy.LEAST_TIME,
              map: self.amapManager.getMap()
            })
            self.driving = driving
            driving.search(
              [{keyword: '秦皇岛站'}, {keyword: '东北大学秦皇岛分校'}],
              function (status, result) {
                self.result = result
                if (!self.drivingFlag) {
                  Message.success('路径规划成功')
                }
                self.drivingFlag = true
              }
            )
          }
        },
        searchOption: {
          city: '秦皇岛',
          citylimit: true
        },
        result: []
      }
    },
    methods: {
      searchOnAMap () {
        if (!this.driving) {
          Message.info('请先规划路径')
        } else {
          this.driving.searchOnAMAP({
            origin: this.result.origin,
            destination: this.result.destination
          })
        }
      },
      changePosition () {
        let position = this.markers[0].position
        this.markers[0].position = [position[0] + 0.002, position[1] - 0.002]
      },
      changeDraggle () {
        let draggable = this.markers[0].draggable
        this.markers[0].draggable = !draggable
      },
      toggleVisible () {
        let visibleVar = this.markers[0].visible
        this.markers[0].visible = !visibleVar
      },
      addMarker () {
        let lng = 119.547204 + (Math.random() - 0.5) * 0.02
        let lat = 39.919205 + (Math.random() - 0.5) * 0.02
        let marker = {
          position: [lng, lat]
        }
        let window = {
          position: [lng, lat],
          visible: true,
          content: 'hello',
          event: {
            click (e) {
              e.target.visible = true
            }
          }
        }
        this.markers.push(marker)
        this.windows.push(window)
      },
      removeMarker () {
        if (!this.markers.length) return
        this.markers.splice(this.markers.length - 1, 1)
      },
      onSearchResult (pois) {
        let latSum = 0
        let lngSum = 0
        if (pois.length > 0) {
          pois.forEach(poi => {
            let {lng, lat} = poi
            lngSum += lng
            latSum += lat
            this.markers.push({position: [poi.lng, poi.lat]})
          })
          let center = {
            lng: lngSum / pois.length,
            lat: latSum / pois.length
          }
          this.center = [center.lng, center.lat]
        }
      }
    }
  }
</script>

&lt;!&ndash; Add "scoped" attribute to limit CSS to this component only &ndash;&gt;
<style scoped lang="stylus" rel="stylesheet/stylus">
  .amap-wrapper {
    position relative
    .amap-search-box {
      position absolute
      top 25px
      left 100px
      color #4db3ff
    }
    .amap-demo {
      height 400px
      border 1px #333 solid
    }
  }
</style>-->
