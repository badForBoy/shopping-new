<template>
  <div class="set">
    <setTime-popur v-show="popupFlag" :popup="popup"></setTime-popur>
    <header-bar :title="title" @back="back"></header-bar>
    <div class="clear" @click="clear" v-show="!!getToken">
      退出登录
    </div>
    <router-link to="/login" tag="div" class="clear" v-show="!getToken">
      账号登陆
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
  import headerBar from 'base/header-bar/header-bar'
  import setTimePopur from 'base/setTime-popur/setTime-popur'
  import { mapGetters } from 'vuex'

  export default{
    data() {
      return {
        title: '设置',
        popup: '已退出账号登陆',
        popupFlag: false
      }
    },
    computed: {
      ...mapGetters([
        'getToken'
      ])
    },
    mounted() {
//      this.goBack()
    },
    methods: {
      goBack() {
        this.$nextTick(() => {
          if (!this.getToken) {
            this.back()
          }
        })
      },
      clear() {
        window.localStorage.clear()
        if (!this.getToken) {
          return
        }
        this.popupFlag = true
        setTimeout(() => {
          this.popupFlag = false
          window.location.reload().then(() => {
            this.back()
          })
        }, 1000)
      },
      back() {
        this.$router.back()
      }
    },
    components: {
      headerBar,
      setTimePopur
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/base.styl"

  .set
    position: fixed
    top: 48px
    bottom: 0
    width: 100%
    background: $color-background-b
    z-index: 300
    .clear
      text-align: center
      font-size: $font-size-small
      color: $color-background
      background: $color-theme
      height: 42px
      line-height: 42px
      cursor: pointer
</style>
