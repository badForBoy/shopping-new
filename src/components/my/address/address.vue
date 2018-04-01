<template>
  <div class="address-page">
    <setTime-popur v-show="setTimePopur" :popup="setTimePopurTitle"></setTime-popur>
    <popur :popup="popup" @cancel="cancel" @confirm="confirm" v-show="popurFlag"></popur>
    <router-view></router-view>
    <header-bar :title="title" @back="back"></header-bar>
    <scroll
      @scrollToTop="loadAgin"
      ref="scroll"
      :data="addressList"
      :pulldown="pulldown" class="wrapper">
      <div>
        <!--{{address}}-->
        <div class="loading">松开即可刷新页面</div>
        <div class="item" v-for="(item, index) in addressListMore" :key="item.address_id" v-show="!item.isDelete">
          <div class="title">
            <p class="name">{{item.linkman}}</p>
            <p class="phone">{{item.phone}}</p>
          </div>
          <div class="info">
            {{item.province}}{{item.city}}{{item.area}}{{item.details}}
          </div>
          <div class="action">
            <div class="action-left">
              <label class="label" @click="setDefault(item, index)">
                <span class="icon" :class="{'icon-selected': parseInt(item.is_default)===1}"></span>
                默认地址
              </label>
            </div>
            <div class="action-right">
              <router-link to="/my/address/addressEdit">
                <span class="icon icon-edit"></span>
                <span>编辑</span>
              </router-link>
              <a href="javascript:void(0)" @click="showPopur(item.address_id)" >
                <span class="icon icon-delete"></span>
                <span>删除</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </scroll>
    <router-link to="/my/address/addressEdit" class="add-address">
      新增地址
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
  import headerBar from 'base/header-bar/header-bar'
  import Scroll from 'base/scroll/scroll'
  import popur from 'base/popur/popur'
  import { mapMutations, mapGetters } from 'vuex'
  import setTimePopur from 'base/setTime-popur/setTime-popur'

  export default{
    data() {
      return {
        addressList: [],
        addressId: null,
        title: '地址管理',
        select: '',
        edit: '编辑地址',
        popurFlag: false,
        setTimePopurTitle: '',
        setTimePopur: false,
        pulldown: true,
        popup: {
          title: '温馨提示',
          content: '确定要删除该地址信息吗'
        }
      }
    },
    computed: {
      addressListMore() {
        for (let i = 0; i < this.addressList.length; i++) {
          this.addressList[i].isDelete = false
        }
        return this.addressList
      },
      ...mapGetters([
        'getToken',
        'address'
      ])
    },
    mounted() {
      this.getAddressList()
    },
    methods: {
      loadAgin() {
        console.log('loadAgin')
        this.getAddressList()
      },
      DeleteAddressList(id) {
        /*
        * 删除地址
        * */
        this.axios({
          method: 'post',
          url: '/api/api/userDeleteAddress.php',
          data: {
            address_id: id,
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
          .then((response) => {
            if (response.data.code === 1) {
              this.setTimePopurFlag(response.data.msg)
              for (let i = 0; i < this.addressList.length; i++) {
                if (this.addressList[i].address_id === id) {
                  this.addressList[i].isDelete = true
                }
              }
            } else {
              this.setTimePopurFlag(response.data.msg)
            }
          })
      },
      getAddressList() {
        /*
        * 获取地址列表
        * */
        this.axios({
          method: 'post',
          url: '/api/api/userAddressList.php',
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
          .then((response) => {
            if (response.data.code === 1) {
              this.addressList = response.data.result
            } else if (response.data.code === -102) {
              this.clear(response.data.msg)
            } else {
              this.setTimePopurFlag(response.data.msg)
            }
          })
      },
      setDefault(item, index) {
        let a = null
        if (parseInt(item.is_default) === 1) {
          a = 0
        } else if (parseInt(item.is_default) === 0) {
          a = 1
        }
        this.axios({
          method: 'post',
          url: '/api/api/userSetAddressDefault.php',
          data: {
            token: this.getToken,
            address_id: item.address_id,
            is_default: a
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
            if (response.data.code === 1) {
              if (parseInt(item.is_default) === 1) {
                item.selected = false
              } else if (parseInt(item.is_default) === 0) {
                item.selected = true
                for (let i = 0; i < this.addressList.length; i++) {
                  this.addressList[i].is_default = 0
                  this.addressList[index].is_default = 1
                }
              }
            } else {
              this.setTimePopurFlag(response.data.msg)
            }
          })
      },
      cancel() {
        console.log('cancel')
        this.showPopur()
      },
      confirm() {
        console.log('confirm')
        this.DeleteAddressList(this.addressId)
        this.showPopur()
      },
      showPopur(id) {
        this.addressId = id
        this.popurFlag = !this.popurFlag
      },
      back() {
        this.$router.back()
      },
      clear(title) {
        console.log('clear')
        window.localStorage.clear()
        console.log(localStorage.getItem('getToken'))
        console.log(this.getToken)
        this.setTimePopurFlag(title)
      },
      setTimePopurFlag(titie) {
        this.setTimePopurTitle = titie
        this.setTimePopur = true
        setTimeout(() => {
          this.setTimePopur = false
        }, 1000)
      },
      ...mapMutations([
        'SET_ADDRESS'
      ])
    },
    components: {
      headerBar,
      popur,
      setTimePopur,
      Scroll
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/base.styl"

  .address-page
    position: fixed
    top: 6px
    bottom: 48px
    width: 100%
    background: $color-background-b
    z-index: 300
    .add-address
      height: 48px
      line-height: 48px
      position: fixed
      background: $color-theme
      bottom: 0
      width: 100%
      color: $color-background
      text-align: center
    .wrapper
      height: 100%
      overflow: hidden
      position: relative
      z-index: -1
      .loading
        font-size: $font-size-small
        color: $color-text
        display: flex
        justify-content: center
        align-items: center
        height: 42px
      .item
        margin-bottom: 10px
        background: $color-background
        .title
          display: flex
          align-items: center
          height: 28px
          padding: 0 10px
          p
            margin-right: 15px
            font-size: $font-size-medium
            color: $color-text
        .info
          line-height: 1.4
          font-size: $font-size-medium
          color: $color-text
          border-1px($color-background-b)
          padding: 10px
        .action
          display: flex
          justify-content: space-between
          align-items: center
          font-size: $font-size-small
          color: $color-text-6
          height: 38px
          padding: 0 10px
          .action-left
            display: flex
            align-items: center
            flex: 0 0 100px
            .label
              display: flex
              align-items: center
              .icon
                display: block
                margin-right: 6px
                width: 16px
                height: 16px
                background: url("./address-btn-normal.png") no-repeat
                background-size: 16px 16px !important
                &.icon-selected
                  background: url("./address-btn-selected.png") no-repeat
            input
              display: none
          .action-right
            display: flex
            a
              margin-left: 10px
              display: flex
              align-items: center
              .icon
                display: flex
                background-repeat: no-repeat !important
                width: 16px
                height: 16px
                background-size: 16px 16px !important
                &.icon-edit
                  background: url("./address-btn-edit.png")
                &.icon-delete
                  background: url("./address-btn-delete.png")
</style>
