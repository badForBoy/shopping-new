<template>
  <div class="select-city">
    <header-bar @back="back" :title="'城市选择'"></header-bar>
    <div class="header-title">
      当前选择城市
    </div>
    <div class="my-address"  @click="showCascadePicker">
      <h3>{{myCity || '请选择城市'}}</h3>
      <p class="theme">重新选择<i class="el-icon-arrow-right"></i></p>
    </div>
    <div class="hot-serch">
      <h3>热门城市</h3>
      <div class="content">
        <div class="list">
          <div class="item" @click="selectCity(item)" v-for="item in hotSearch">
            <span>{{item.text}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import headerBar from 'base/header-bar/header-bar'
  import scroll from 'base/scroll/scroll'
  import { mapGetters, mapMutations } from 'vuex'
  import { city } from 'common/js/city'

  export default{
    data() {
      return {
        citys: [],
        hotSearch: [
          {
            'text': '北京',
            'log': '116.46',
            'lat': '39.92'
          },
          {
            'text': '上海',
            'log': '121.48',
            'lat': '31.22'
          },
          {
            'text': '杭州',
            'log': '120.19',
            'lat': '30.26'
          },
          {
            'text': '淳安',
            'log': '119.05',
            'lat': '29.61'
          },
          {
            'text': '安吉',
            'log': '119.68',
            'lat': '30.68'
          },
          {
            'text': '青田',
            'log': '120.28',
            'lat': '28.45'
          },
          {
            'text': '金华',
            'log': '119.64',
            'lat': '29.12'
          },
          {
            'text': '衢州',
            'log': '118.88',
            'lat': '28.97'
          }
        ],
        area: '热门城市'
      }
    },
    computed: {
      setCity() {
        return city
      },
      ...mapGetters([
        'latitude',
        'longitude',
        'myCity'
      ])
    },
    mounted() {
      this.cascadePicker = this.$createCascadePicker({
        title: '城市选择',
        data: city,
        selectedIndex: [1, 0],
        cancelTxt: '取消',
        confirmTxt: '确认',
        onSelect: (selectedVal, selectedIndex, selectedText) => {
          const self = this
          selectedText.forEach(function (value, index) {
            if (index === 0) {
              self.area = value
            }
          })
          let areakey = 0
          let citykey = 0
          selectedIndex.forEach(function (value, index) {
            if (index === 0) {
              areakey = value
            }
            if (index === 1) {
              citykey = value
            }
          })
          city.forEach(function (value, index) {
            if (index === areakey) {
              value.children.forEach(function (val, index) {
                if (index === citykey) {
                  self.SET_LONGITUDE(val.log)
                  self.SET_LATITUDE(val.lat)
                  self.SET_MY_CITY(val.text)
                }
              })
            }
          })
        }
      })
    },
    methods: {
      selectCity(item) {
        this.SET_LONGITUDE(item.log)
        this.SET_LATITUDE(item.lat)
        this.SET_MY_CITY(item.text)
      },
      back() {
        this.$router.back()
      },
      showCascadePicker() {
        this.cascadePicker.show()
      },
      ...mapMutations([
        'SET_LONGITUDE',
        'SET_LATITUDE',
        'SET_MY_CITY'
      ])
    },
    components: {
      headerBar,
      scroll
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/base.styl"

  .select-city
    position: fixed
    top: 48px
    bottom: 0
    width: 100%
    background: $color-background
    .header-title
      height: 32px
      line-height: 32px
      background: $color-background-b
      padding: 0 10px
      font-size: $font-size-medium
      color: $color-text-6
      border-1px()
    .my-address
      display: flex
      justify-content: space-between
      align-items: center
      background: $color-background
      height: 48px
      border-1px()
      padding: 0 10px
      .theme
        color: $color-theme
      h3
        font-size: $font-size-medium
        color: $color-text
      p
        font-size: $font-size-medium
        color: $color-text
    .hot-serch
      background: $color-background-b
      .content
        overflow: hidden
        background: $color-background
      h3
        font-size: $font-size-medium
        color: $color-text-6
        height: 42px
        line-height: 42px
        padding: 0 10px
        border-1px()
      .list
        display: flex
        flex-wrap: wrap
        align-items: center
        padding: 15px 10px
        .item
          flex: 0 0 25%
          display: flex
          align-items: center
          margin-bottom: 10px
          span
            font-size: $font-size-small
            color: $color-text
            padding: 7px 0
            min-width: 68px
            background: $color-background-b
            border-radius: 4px
            text-align: center
</style>
