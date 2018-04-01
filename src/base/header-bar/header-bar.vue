<template>
  <div>
    <div v-show="address">
      <div class="header-bar">
        <router-link to="/selectCity" class="city" @click="selectCity">
          <img src="./nav_locate.png">
          <p class="address">{{myCity || '请选择城市'}}</p>
        </router-link>
        <div class="search-to" @click="search">
          <img src="./nav_search_1.png">
          请输入关键字
        </div>
        <!--<p>{{title}}</p>-->
        <p class="address">取消</p>
      </div>
    </div>
    <div v-show="!address">
      <div class="home-header" v-show="home">
        <div class="wrapper">
        <span class="shaomiao icon">
          <img src="./nav_home_scan.png">
        </span>
          <router-link to="/selectCity" class="address">
            <p>{{myCity || '请选择城市'}}</p>
            <img src="./nav_home_more.png">
          </router-link>
          <span class="search icon" @click="search">
            <img src="./nav_home_search.png">
          </span>
        </div>
        <div class="mask" :style="{opacity: setOpacity}"></div>
      </div>
      <div class="header-bar" v-show="!home">
        <span class="icon icon-back" @click="back">
          <i class="el-icon-arrow-left"></i>
          <!--<img src="./icon_back.png" >-->
        </span>
          <p class="title">{{title}}</p>
        <span v-if="!cancel" class="icon icon-back"></span>
        <p class="address" v-if="cancel" @click="doCancel">取消</p>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  export default{
    props: {
      home: {
        type: Boolean,
        default: false
      },
      address: {
        type: Boolean,
        default: false
      },
      title: {
        type: String
      },
      scrollY: {
        type: Number
      },
      cancel: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      setOpacity() {
        return `${parseInt((this.scrollY)) / 100}`
      },
      ...mapGetters([
        'myCity'
      ])
    },
    methods: {
      doCancel() {
        this.$emit('cancel')
      },
      selectCity() {
        this.$router.push('/citySelect')
      },
      back() {
        this.$emit('back')
      },
      category() {
        this.$emit('category')
      },
      search() {
        this.$emit('search')
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/base.styl"

  .header-bar
    position: fixed !important
    justify-content: space-between
    top: 0
    height: 48px
    width: 100%
    display: flex
    align-items: center
    background: $color-background
    box-sizing: border-box
    padding: 0 10px
    font-size: $font-size-large
    color: $color-text
    font-weight: 700
    &.home
      background: $color-theme
      color: $color-background
    border-1px($color-text-b)
    .title
      no-wrap()
    .search-to
      flex: 0 0 60%
      background: $color-background-b
      height: 32px
      display: flex
      align-items: center
      padding: 0 10px
      border-radius: 16px
      font-size: $font-size-medium
      color: $color-text-d
      img
        height: 12px
        margin-right: 10px
    .address
      font-size: $font-size-medium
      color: $color-text
      extend-click()
    .city
      display: flex
      align-items: center
      img
        height: 16px
        margin-right: 6px
    .icon
      display: inline-block
      flex: 0 0 20px
      height: 48px
      line-height: 48px
      padding-right: 20px
      extend-click()
      img
        width: 8px
        height: 14px
      &.icon-category, &.icon-search
        img
          width: 22px
          height: 22px

  .home-header
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    .mask
      position: absolute
      left: 0
      right: 0
      top: 0
      height: 52px
      z-index: -1
      background-color: $color-theme
    .wrapper
      display: flex
      justify-content: space-between
      align-items: center
      padding: 0 10px
      height: 52px
      .icon
        img
          height: 20px
      .address
        flex: 0 0 60%
        display: flex
        align-items: center
        padding: 10px
        height: 36px
        border-radius: 10px
        background: $color-background-d
        p
          flex: 1
          overflow: hidden
          text-overflow: ellipsis
          white-space: nowrap
          color: $color-background
        img
          flex: 0 0 14px
          height: 6px

</style>
