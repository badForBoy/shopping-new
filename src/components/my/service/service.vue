<template>
  <div class="service">
    <router-view></router-view>
    <header-bar :title="title" @back="back"></header-bar>
    <div class="wrapper">
      <div>
        <div class="service--list">
          <div class="service-item no-border">
            <div class="item-left">
              平台热线
            </div>
            <div class="item-right">
              13857187843
              <span class="icon"></span>
            </div>
          </div>
        </div>
        <div class="line-title">
          热门问题
        </div>
        <div class="service--list">
          <router-link  to="/my/service/explain" class="service-item">
            <div class="item-left">
              支付问题
            </div>
            <div class="item-right">
              <span class="icon"></span>
            </div>
          </router-link >
          <router-link to="/my/service/explain" class="service-item">
            <div class="item-left">
              余额问题
            </div>
            <div class="item-right">
              <span class="icon"></span>
            </div>
          </router-link>
          <router-link to="/my/service/explain" class="service-item">
            <div class="item-left">
              积分问题
            </div>
            <div class="item-right">
              <span class="icon"></span>
            </div>
          </router-link>
          <router-link to="/my/service/explain" class="service-item">
            <div class="item-left">
              活动问题
            </div>
            <div class="item-right">
              <span class="icon"></span>
            </div>
          </router-link>
          <router-link to="/my/service/explain" class="service-item no-border">
            <div class="item-left">
              其他问题
            </div>
            <div class="item-right">
              <span class="icon"></span>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import headerBar from 'base/header-bar/header-bar'
  export default{
    data() {
      return {
        title: '服务中心'
      }
    },
    methods: {
      back() {
        this.$router.back()
      }
    },
    components: {
      headerBar
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/base.styl"

  .service
    position: fixed
    top: 48px
    bottom: 48px
    width: 100%
    background: $color-background-b
    z-index: 300
    .service--list
      background: $color-background
      .service-item
        height: 42px
        margin: 0 10px
        display: flex
        justify-content: space-between
        align-items: center
        font-size: $font-size-medium
        color: $color-text
        border-1px($color-background-b)
        &.no-border::after
          border: none
        .item-right
          display: flex
          align-items: center
          .icon
            display: block
            width: 8px
            height: 14px
            background: url("./cell-arrow.png") no-repeat
            background-size: 8px 14px
            margin-left: 10px
    .line-title
      font-size: $font-size-medium
      color: $color-text
      margin: 20px 10px 10px 10px
</style>
