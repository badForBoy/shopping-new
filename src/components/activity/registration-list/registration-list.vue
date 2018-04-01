<template>
  <div class="registration-list">
    <header-bar @back="back" :title="title"></header-bar>
    <scroll class="wrapper">
      <div>
        <div class="total-num">
          本活动已报名人数：{{signUpList.totalnumber}}人
        </div>
        <div class="content">
          <div class="title">
            <div class="phone">联系电话</div>
            <div class="num">报名人数</div>
            <div class="time">报名时间</div>
          </div>
          <div class="content-wrapper">
            <div class="item" v-for="item in signUpList.list">
              <div class="phone">{{item.mobile}}</div>
              <div class="num">{{item.number}}</div>
              <div class="time">{{item.add_time}}</div>
            </div>
          </div>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import headerBar from 'base/header-bar/header-bar'
  import scroll from 'base/scroll/scroll'
  export default{
    data() {
      return {
        title: '报名列表',
        signUpList: {}
      }
    },
    mounted() {
      this.getSignUpList()
    },
    methods: {
      back() {
        this.$router.back()
      },
      getSignUpList() {
        this.axios({
          methods: 'post',
          url: 'api/api/signUpList.php',
          data: {
            activity_id: ''
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
            if (response.data.code === 0) {
              this.signUpList = response.data.result
            }
          })
      }
    },
    components: {
      headerBar,
      scroll
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/base.styl"

  .registration-list
    position: fixed
    top: 48px
    bottom: 0
    width: 100%
    background: $color-background-b
    .wrapper
      height: 100%
      overflow: hidden
      .total-num
        background: $color-background
        height: 44px
        line-height: 44px
        padding: 0 10px
        font-size: $font-size-medium
        color: $color-text
      .content
        .title, .content-wrapper .item
          display: flex
          align-items: center
          justify-content: space-between
          height: 40px
          font-size: $font-size-medium
          color: $color-text
          margin: 0 10px
          .phone
            flex: 0 0 80px
          .time
            flex: 0 0 160px
            text-align: right
        .content-wrapper
          background: $color-background
          .item
            color: $color-text-d
            border-1px()
            &:last-child::after
              border: none
</style>
