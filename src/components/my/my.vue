<template>
  <div class="my">
    <popur :popup="popup" @cancel="cancel" @confirm="confirm" v-show="popurFlag"></popur>
    <router-view></router-view>
    <header-bar @back="back" :title="title"></header-bar>
    <scroll class="wrapper">
      <div>
        <div class="personal-info">
          <div class="pic">
            <img :src="userInfo ? userInfo.head_img : ''" alt="">
          </div>
          <router-link to="/login" tag="h3" v-show="!loginType">立即登陆</router-link>
          <h3 v-show="loginType">{{userInfo.user_name}}</h3>
        </div>
        <div class="wallet">
          <router-link to="/my/myWallet" class="item">
            <p class="red">{{userInfo.balance_money}}元</p>
            <p class="sm">钱包</p>
          </router-link>
          <router-link to="/my/myCoupon" class="item">
            <p class="red">{{userInfo.bonus}}个</p>
            <p class="sm">优惠券</p>
          </router-link >
          <router-link to="/my/myScore" class="item">
            <p class="sm">{{userInfo.score }}</p>
            <p class="sm">积分</p>
          </router-link >
        </div>
        <div class="list">
          <router-link to="/my/order" tag="div" class="item">
            <div class="item-left">
              <span class="icon icon21"></span>
              <span>我的订单</span>
            </div>
            <i class="el-icon-arrow-right"></i>
          </router-link>
          <router-link to="/my/myActivity" tag="div" class="item">
            <div class="item-left">
              <span class="icon icon-activity"></span>
              <span>我的活动</span>
            </div>
            <i class="el-icon-arrow-right"></i>
          </router-link>
          <router-link to="/my/myAccommodate" tag="div" class="item">
            <div class="item-left">
              <span class="icon icon-accommodate"></span>
              <span>我的食宿</span>
            </div>
            <i class="el-icon-arrow-right"></i>
          </router-link>
          <router-link to="/my/address" tag="div" class="item">
            <div class="item-left">
              <span class="icon icon11"></span>
              <span>地址管理</span>
            </div>
            <i class="el-icon-arrow-right"></i>
          </router-link>
          <router-link to="/my/collection" tag="div" class="item">
            <div class="item-left">
              <span class="icon icon12"></span>
              <span>我的收藏</span>
            </div>
            <i class="el-icon-arrow-right"></i>
          </router-link>
          <router-link to="/my/notice" tag="div" class="item">
            <div class="item-left">
              <span class="icon icon-message"></span>
              <span>消息通知</span>
            </div>
            <i class="el-icon-arrow-right"></i>
          </router-link>
        </div>
        <div class="list">
          <div class="item" @click="showPopur">
            <div class="item-left">
              <span class="icon icon22"></span>
              <span>我的发布</span>
            </div>
            <i class="el-icon-arrow-right"></i>
          </div>
          <div @click="showPopur" class="item">
            <div class="item-left">
              <span class="icon icon13"></span>
              <span>我的关注</span>
            </div>
            <i class="el-icon-arrow-right"></i>
          </div>
          <router-link to="/my/integralMall" tag="div" class="item">
            <div class="item-left">
              <span class="icon icon23"></span>
              <span>积分商城</span>
            </div>
            <i class="el-icon-arrow-right"></i>
          </router-link>
        </div>
        <div class="list">
          <div @click="showPopur" class="item">
            <div class="item-left">
              <span class="icon icon31"></span>
              <span>加盟合作</span>
            </div>
            <i class="el-icon-arrow-right"></i>
          </div>
          <router-link to="/my/service" tag="div" class="item">
            <div class="item-left">
              <span class="icon icon32"></span>
              <span>服务中心</span>
            </div>
            <i class="el-icon-arrow-right"></i>
          </router-link>
          <router-link to="/my/set" tag="div" class="item" v-if="!!getToken">
            <div class="item-left">
              <span class="icon icon33"></span>
              <span>设置</span>
            </div>
            <i class="el-icon-arrow-right"></i>
          </router-link>
          <router-link to="/login" tag="div" class="item" v-if="!getToken">
            <div class="item-left">
              <span class="icon icon33"></span>
              <span>设置</span>
            </div>
            <i class="el-icon-arrow-right"></i>
          </router-link>
        </div>
      </div>
    </scroll>
    <bottom-bar></bottom-bar>
  </div>
</template>

<script type="text/ecmascript-6">
  import bottomBar from 'base/bottom-bar/bottom-bar'
  import headerBar from 'base/header-bar/header-bar'
  import Scroll from 'base/scroll/scroll'
  import popur from 'base/popur/popur'
  import { mapGetters } from 'vuex'

  export default{
    components: {
      bottomBar,
      headerBar,
      Scroll,
      popur
    },
    data() {
      return {
        userInfo: {},
        title: '我的',
        list: [],
        showLoginBtnFlag: true,
        popup: {
          title: '提示',
          content: '更多内容请下载APP'
        },
        popurFlag: false,
        loginType: false
      }
    },
    created() {
    },
    computed: {
      judgeType() {
        this.loginType = !!this.userInfo
        console.log('loginType:' + this.loginType)
        return this.loginType
      },
      ...mapGetters([
        'getToken',
        'openId'
      ])
    },
    mounted() {
      console.log('openId:' + this.openId)
      console.log('getToken:' + this.getToken)
      this.getUserInfo()
    },
    methods: {
      getUserInfo() {
        const _this = this
        if (!this.getToken) {
          return
        }
        this.axios({
          url: '/api/api/userMyInfo.php',
          method: 'post',
          data: {
            token: this.getToken
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
              _this.userInfo = response.data.result
              _this.loginType = true
            }
          })
      },
      cancel() {
        this.showPopur()
      },
      confirm() {
        console.log('here')
      },
      showPopur() {
        this.popurFlag = !this.popurFlag
      },
      back() {
        this.$router.back()
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/base.styl"

  .my
    position: fixed
    top: 48px
    bottom: 52px
    width: 100%
    background: $color-background-b
    .wrapper
      height: 100%
      overflow: hidden
      .personal-info
        background: url("./bg.png") no-repeat
        background-size: 100% 178px
        width: 100%
        height: 178px
        display: flex
        align-items: center
        padding: 0 15px
        box-sizing: border-box
        overflow: hidden
        margin-top: 0
        .pic
          width: 80px
          height: 80px
          background: $color-background-b
          border-radius: 40px
          overflow: hidden
          img
            width: 80px
            height: 80px
        h3
          font-size: $font-size-medium-x
          color: $color-background
          font-weight: 700
          margin: 10px
    .wallet
      display: flex
      align-items: center
      height: 42px
      margin-bottom: 10px
      background: $color-background
      .item
        flex: 1
        text-align: center
        line-height: 1.4
        font-size: $font-size-small !important
        border-right($color-background-b)
        display: flex
        flex-direction: column
        align-items: center
        &:last-child
          border: none
    .list
      margin-bottom: 10px
      .item
        height: 44px
        background: $color-background
        display: flex
        justify-content: space-between
        align-items: center
        padding: 0 15px
        box-sizing: border-box
        font-size: $font-size-medium
        color: $color-text
        border-1px($color-background-d)
        &:last-child
          &:after
            border: none
        span
          display: block
        .item-left
          display: flex
          align-items: center
        .icon
          background-repeat: no-repeat !important
          background-size: 18px 18px !important
          width: 18px
          height: 18px
          padding: 0 10px
          margin-right: 4px
          &.icon-cell
            background: url("./cell-arrow.png")
            background-size: 8px 14px !important
            width: 8px
            height: 14px
            padding: 0
          &.icon11
            background: url("./1-1.png")
          &.icon12
            background: url("./1-2.png")
          &.icon13
            background: url("./1-3.png")
          &.icon21
            background: url("./2-1.png")
          &.icon22
            background: url("./2-2.png")
          &.icon23
            background: url("./2-3.png")
          &.icon31
            background: url("./3-1.png")
          &.icon32
            background: url("./3-2.png")
          &.icon33
            background: url("./3-3.png")
          &.icon-message
            background: url("./bai_my_message.png")
          &.icon-accommodate
            background: url("./icon_me_accommodate.png")
          &.icon-activity
            background: url("./icon_me_activity.png")
          &.icon-shop
            background: url("./icon_me_shop.png")

  .red
    color: $color-theme-r

  .sm
    color: $color-text-b
    font-size: $font-size-small

</style>
