<template>
  <div class="AMapPage">
    <div class="amap-wrapper">
      <!--搜索框-->
      <el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult"></el-amap-search-box>
      <el-amap :vid="'amap-vue'" :map-manager="amapManager" :center="center" :zoom="zoom" :events="events" :plugin="plugins" class="amap-demo"
               style="height:600px;width: 1000px"
      >
        <!--标记-->
        <el-amap-marker v-for="(marker, index) in markers" :key="index" :position="marker.position" :event="marker.events" :visible="marker.visible"
                        :draggable="marker.draggable">
        </el-amap-marker>
        <!--<el-amap-info-window-->
        <!--v-for="(window, index) in windows"-->
        <!--:index="index"-->
        <!--:position="window.position"-->
        <!--:visible="window.visible"-->
        <!--:content="window.content"-->
        <!--:events="window.events"-->
        <!--&gt;</el-amap-info-window>-->
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
  //  let amapManager = new VueAMap.AMapManager()
  import { Message } from 'element-ui'
  export default {
    name: 'amap-page',
    data () {
      let self = this
      return {
        zoom: 14,
        lng: '',
        lat: '',
        center: [116.354095,39.963041],
        // 用来解决多次显示message的问题
        drivingFlag: false,
        markers: [
          {
            position: [116.354095,39.963041],
            events: {
              click: () => {
                alert('your click me')
              },
              dragend: (e) => {
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


<!--<style>-->
<!--.detail .el-tabs__item{padding:0 40px;}-->
<!--</style>-->

<style>
  .AMapPage .setSign .el-row{line-height: 40px;margin-bottom: 10px;}
  .AMapPage .title{text-align: right;}
  .AMapPage .router-link{color:#333;}
  .AMapPage .el-button-primary .router-link{color:#fff;}
  /* dialog 的大小 */
  .AMapPage .el-dialog--small{min-width: 400px;max-width: 500px}
  .list-enter-active, .list-leave-active {
    transition: all 1s;
  }
  .list-enter, .list-leave-active {
    opacity: 0;
    transform: translateY(30px);
  }
  .el-vue-amap-container, .el-vue-amap-container .el-vue-amap{
    height:800px;
  }
  .search-box {
    /*position: absolute;*/
    top: 50px;
    left: 20px;
  }
</style>
