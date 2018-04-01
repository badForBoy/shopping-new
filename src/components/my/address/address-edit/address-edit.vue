<template>
  <div class="address-edit">
    <header-bar :title="title" @back="back"></header-bar>
    <setTime-popur v-show="setTimePopur" :popup="setTimePopurTitle"></setTime-popur>
    <div class="wrapper">
      <div class="form-list">
        <div class="form-group">
          <label class="label">
            <p>收货人姓名</p>
            <input type="text" placeholder="收货人姓名" v-model="linkman">
          </label>
        </div>
        <div class="form-group">
          <label class="label">
            <p>联系人电话</p>
            <input type="text" placeholder="联系人电话" v-model="phone">
          </label>
        </div>
        <!--<div class="form-group">-->
          <!--<label class="label" @click="selectAddress">-->
            <!--<p>所在地区</p>-->
            <!--<input type="text" placeholder="所在地区" disabled class="disabled" :value="address">-->
          <!--</label>-->
        <!--</div>-->
        <div class="form-group">
          <label class="label" @click="showCityPicker">
            <p>所在地区</p>
            <input type="text" placeholder="所在地区" disabled class="disabled" :value="address">
          </label>
        </div>
        <div class="form-group">
          <label class="label">
            <p>详细地址</p>
            <textarea name="" id="" cols="30" rows="4" v-model="detail" placeholder=""></textarea>
          </label>
        </div>
      </div>
      <div class="check-group">
        <label class="label" @click="selectd">
          <input v-model="isDefault" name="select" type="radio">
          <span class="icon" :class="{'icon-selected': isDefault}"></span>
          设为默认地址
        </label>
      </div>
      <div class="add-address" @click="addAddressList">
        保存
      </div>
      selected：{{isDefault}}
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import headerBar from 'base/header-bar/header-bar'
  import myaddress from 'common/js/address.json'
  import setTimePopur from 'base/setTime-popur/setTime-popur'
  import { mapGetters } from 'vuex'
//  import { city } from 'common/js/city'
  import { provinceList, cityList, areaList } from 'components/example/data/area'

  const cityData = provinceList
  cityData.forEach(province => {
    province.children = cityList[province.value]
    province.children.forEach(city => {
      city.children = areaList[city.value]
    })
  })

  export default{
    props: {
      title: {
        type: String,
        default: '编辑地址'
      }
    },
    computed: {
      address() {
        if (this.myAddressCity === '市辖区') {
          this.myAddressCity = ''
        }
        return `${this.myAddressProvince}${this.myAddressCity}${this.myAddresscounty}`
      },
      ...mapGetters([
        'getToken',
        'longitude',
        'latitude'
      ])
    },
    data() {
      return {
        pickerFlag: true,
        isDefault: false,
        linkman: '',
        phone: '',
        detail: '',
        setTimePopurTitle: '',
        setTimePopur: false,
        myAddressSlots: [
          {
            flex: 1,
            defaultIndex: 1,
            values: Object.keys(myaddress),  // 省份数组
            className: 'slot1',
            textAlign: 'center'
          }, {
            divider: true,
            content: '-',
            className: 'slot2'
          }, {
            flex: 1,
            values: [],
            className: 'slot3',
            textAlign: 'center'
          },
          {
            divider: true,
            content: '-',
            className: 'slot4'
          },
          {
            flex: 1,
            values: [],
            className: 'slot5',
            textAlign: 'center'
          }
        ],
        myAddressProvince: '', // 省
        myAddressCity: '', // 市
        myAddresscounty: '' // 区/县
      }
    },
    mounted() {
      this.$nextTick(() => { // vue里面全部加载好了再执行的函数  （类似于setTimeout）
        this.myAddressSlots[0].defaultIndex = 0
        // 这里的值需要和 data里面 defaultIndex 的值不一样才能够初始化
        // 因为我没有看过源码（我猜测是因为数据没有改变，不会触发更新）
      })
      this.cityPicker = this.$createCascadePicker({
        title: 'xuanz',
        data: cityData,
        onSelect: (selectedVal, selectedIndex, selectedText) => {
          console.log(selectedText)
          selectedText.forEach(function (value, index) {
            if (index === 0) {
              console.log(value)
              this.myAddressProvince = value
            } else if (index === 1) {
              this.myAddressCity = value
            } else if (index === 2) {
              this.myAddresscounty = value
            }
          })
        }
      })
    },
    methods: {
      confirm() {
        this.selectAddress()
      },
      selectAddress() {
        this.pickerFlag = !this.pickerFlag
      },
      addAddressList() {
        /*
         * 新增地址
         * */
        let d = null
        if (this.isDefault) {
          d = 1
        } else {
          d = 0
        }
        this.axios({
          method: 'post',
          url: '/api/api/userAddAddress.php',
          data: {
            linkman: this.linkman, // 联系人
            phone: this.phone, // 手机号
            province: this.myAddressProvince, // 省
            city: this.myAddressCity, // 市
            area: this.myAddresscounty, // 区
            details: this.detail, // 详细地址
            is_default: d, // 是否是默认地址 0 不是 1 是
            longitude: this.longitude, // 经度
            latitude: this.latitude, // 纬度
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
              this.$router.push('/my/address')
            } else {
              this.setTimePopurFlag(response.data.msg)
            }
          })
      },
      onMyAddressChange(picker, values) {
        if (myaddress[values[0]]) {  // 这个判断类似于v-if的效果（可以不加，但是vue会报错，很不爽）
          picker.setSlotValues(1, Object.keys(myaddress[values[0]])) // Object.keys()会返回一个数组，当前省的数组
          picker.setSlotValues(2, myaddress[values[0]][values[1]]) // 区/县数据就是一个数组
          this.myAddressProvince = values[0]
          this.myAddressCity = values[1]
          this.myAddresscounty = values[2]
        }
      },
      onValuesChange(picker, values) {
        if (values[0] > values[1]) {
          picker.setSlotValue(1, values[0])
        }
      },
      setTimePopurFlag(titie) {
        this.setTimePopurTitle = titie
        this.setTimePopur = true
        setTimeout(() => {
          this.setTimePopur = false
        }, 1000)
      },
      selectd() {
        if (this.isDefault) {
          return
        }
        this.isDefault = !this.isDefault
      },
      showCityPicker() {
        this.cityPicker.show()
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
  @import "../../../../common/stylus/base.styl"

  .cube-popup
    z-index: 1000

  .address-edit
    position: fixed
    top: 48px
    bottom: 0
    width: 100%
    background: $color-background-b
    z-index: 400
    .form-list
      background: $color-background
      margin-bottom: 40px
      .form-group
        padding: 0 10px
        border-1px($color-background-b)
        .label
          display: flex
          align-items: center
          font-size: $font-size-medium
          color: $color-text
          p
            flex: 0 0 80px
          input, textarea
            outline: none
            flex: 1
            padding: 10px
            border: none
          .disabled
            background: $color-background
    .check-group
      display: flex
      background: $color-background
      height: 36px
      align-items: center
      padding: 0 10px
      .label
        display: flex
        font-size: $font-size-medium
        color: $color-text
        input
          display: none
        .icon
          display: flex
          margin-right: 6px
          background-repeat: no-repeat !important
          width: 16px
          height: 16px
          background-size: 16px 16px !important
          background: url("./address-btn-normal.png")
          &.icon-selected
            background: url("./address-btn-selected.png")
    .my-picker
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-text-l
      z-index: 500
      .picker-btn
        position: absolute
        bottom: 180px
        width: 100%
        height: 42px
        background: $color-background-b
        display: flex
        align-items: center
        justify-content: space-between
        .btn
          padding: 5px 10px
          border: 1px solid $color-background
          border-radius: 4px
          font-size: $font-size-small
          color: $color-text
          margin: 0 10px
          background: $color-background
          &.btn-confirm
            background: $color-theme
            color: $color-background
            border: none
      .picker
        position: absolute
        bottom: 0
        width: 100%
        background: $color-background
    .slide-enter-active, .slide-leave-active
      transition: all 0.3s
    .slide-enter, .slide-leave-active
      transform: translate3d(0, 100%, 0)
</style>
