<template>
  <div class="login">
    <setTime-popur v-show="popupFlag" :popup="popupSuccess"></setTime-popur>
    <header-bar :title="title" @back="back"></header-bar>
    <div class="content">
      <div class="form-group">
        <label for="mobile">手机号</label>
        <input id="mobile" v-model="mobile" type="text" placeholder="请输入您的手机号">
      </div>
      <div class="form-group">
        <label for="password">密码</label>
        <input id="password" v-model="pass" type="password" placeholder="请输入您的手机号">
      </div>
      <div class="btn-wrapper">
        <span class="btn" @click="login">登录</span>
      </div>
      <div class="wx-login" @click="weixinLogin">
        <img src="./wechat@2x.png" alt="">
        <p>微信快捷登陆</p>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import headerBar from 'base/header-bar/header-bar'
  import md5 from 'js-md5'
  import setTimePopur from 'base/setTime-popur/setTime-popur'
  import { mapGetters, mapMutations } from 'vuex'

  export default{
    components: {
      headerBar,
      setTimePopur
    },
    data() {
      return {
        title: '登录',
        mobile: '',
        pass: '',
        info: {},
        popupFlag: false,
        popupSuccess: '登陆成功'
      }
    },
    computed: {
      ...mapGetters([
        'getToken'
      ])
    },
    mounted() {
    },
    methods: {
      clear() {
        console.log('clear')
        window.localStorage.clear()
      },
      weixinLogin() {
        let $openid = ''
        let $uId = ''

        // alert($openid);
        if ($openid) {
          console.log($openid)
          console.log($uId)
          this.axios({
            method: 'post',
            url: '/api/api/search.php',
            data: {
              uId: $uId,
              type: 3
            },
            transformRequest: [function (data) {
              // Do whatever you want to transform the data
              let ret = ''
              for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
              }
              return ret
            }],
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          })
            .then((response) => {
              console.log(response)
            })
        }
      },
      login() {
        const _this = this
        this.axios({
          url: '/api/api/userLogin.php',
          method: 'post',
          data: {
            mobile: this.mobile,
            pass: md5(this.pass),
            login_type: 'up'
          },
          transformRequest: [function (data) {
            // Do whatever you want to transform the data
            let ret = ''
            for (let it in data) {
              ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
          }],
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
          .then(function (response) {
            if (response.data.code === 1) {
              _this.SET_TOKEN(response.data.result.token)
              _this.SET_OPEN_ID(response.data.result.wx)
              _this.popupFlag = true
              setTimeout(() => {
                _this.popupFlag = false
                _this.$router.back()
              }, 1000)
            }
          })
      },
      back() {
        this.$router.back()
      },
      ...mapMutations([
        'SET_TOKEN',
        'SET_OPEN_ID'
      ])
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/base.styl"

  .login
    position: fixed
    top: 48px
    bottom: 0
    width: 100%
    background: $color-background-b
    .content
      .form-group
        background: $color-background
        display: flex
        align-items: center
        height: 42px
        font-size: $font-size-medium
        color: $color-text
        border-1px($color-background-b)
        label
          flex: 0 0 60px
          text-align: right
        input
          flex: 1
          padding: 0 10px
          outline: none
      .btn-wrapper
        padding: 40px 20px 20px
        box-sizing: border-box
        .btn
          display: block
          height: 38px
          line-height: 38px
          text-align: center
          background: $color-theme
          border-radius: 4px
          color: $color-background
          cursor: pointer
      .wx-login
        text-align: center
        font-size: $font-size-medium
        color: $color-text
        img
          height: 36px
</style>
