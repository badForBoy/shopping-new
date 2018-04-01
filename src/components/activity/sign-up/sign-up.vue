<template>
  <div class="sign-up">
    <header-bar @back="back" :title="title"></header-bar>
    <div class="add" v-show="selectFlag">
      <div class="content">
        <div class="make">
          <h3 @click="selectPersonalFlag">取消</h3>
          <h3 @click="setConfirmPersonalId">确定</h3>
        </div>
        <router-link to="/addNew" class="action">
          <img src="./main_add.png">
          添加成员
        </router-link>
        <scroll class="personal-list wrapper" :data="personalList" ref="scroll">
          <div>
            <div class="item" v-for="item in personalList">
              <div class="icon" @click="editPersonal(item)">
                <img src="./main_edit.png">
              </div>
              <div class="info" @click="selectPersonal(item)">
                <div class="personal">
                  <h3>{{item.name}}</h3>
                  <p>{{item.type_name}}</p>
                </div>
                <p>身份证 {{item.code}}</p>
              </div>
              <div class="select" :class="{'yes':item.active}" @click="selectPersonal(item)">
              </div>
            </div>
          </div>
        </scroll>
      </div>
    </div>
    <scroll class="wrapper" ref="selected">
      <div>
        <div class="form-wrapper">
          <div class="form-group">
            <label><span class="red">*</span>联系人：</label>
            <input type="text" v-model="contact" placeholder="请输入姓名">
          </div>
          <div class="form-group">
            <label><span class="red">*</span>联系电话：</label>
            <input type="text" v-model="contact_mobile" placeholder="请输入手机号">
          </div>
          <div class="form-group">
            <label><span>*</span>微信号：</label>
            <input type="text" v-model="wx_nickname" placeholder="请输入微信号">
          </div>
          <div class="form-group">
            <label><span>*</span>备注信息：</label>
            <textarea cols="30" rows="6" v-model="note" placeholder="请输入备注信息，不超过50个字"></textarea>
          </div>
        </div>
        <div class="list">
          <div class="item" v-for="item in selectedPersonal">
            <div class="icon" @click="reducePersonal(item.ID)">
              <img src="./main_less.png">
            </div>
            <div>
              <div class="personal">
                <h3>{{item.name}}{{item.id}}</h3>
                <p>{{item.type_name}}</p>
              </div>
              <p>身份证 {{item.code}}{{item.active}}</p>
            </div>
          </div>
        </div>
        <p class="title">*①四年级以下学生免费；②报名费用中已包含相关保险费用</p>
        <div class="action" @click="selectPersonalFlag">
          <img src="./main_add.png">
          添加成员
        </div>
      </div>
    </scroll>
    <div class="custom">
      <div class="total">
        <h3>合计：</h3>
        <h3 class="red">￥{{totalPrice}}元</h3>
      </div>
      <div class="btn" @click="goPay">确认报名并支付</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import headerBar from 'base/header-bar/header-bar'
  import scroll from 'base/scroll/scroll'
  import { mapGetters, mapMutations } from 'vuex'

  export default{
    data() {
      return {
        title: '活动报名',
        selectFlag: false,
        personalList: [],
        contact: '',
        contact_mobile: '',
        wx_nickname: '',
        note: '',
        sign_id_list: [],
        selectedPersonal: [],
        price: 0,
        totalprice: 0
      }
    },
    computed: {
      totalPrice() {
        const self = this
        let p = 0
        this.selectedPersonal.forEach(function (value) {
          if (value.active) {
            if (parseInt(value.type_id) === 1) {
              p += self.price * 1
            } else if (parseInt(value.type_id) === 2) {
              p += self.price * 1 / 2
            } else if (parseInt(value.type_id) === 3) {
              p += self.price * 0
            }
          }
        })
        return p
      },
      ...mapGetters([
        'getToken',
        'activityId',
        'longitude',
        'latitude'
      ])
    },
    mounted() {
      this.getDetail()
    },
    methods: {
      editPersonal(item) {
        /*
         * 重新编辑列表人员信息
         * */
        this.SET_ACTIVITY_PERSONAL(item)
        this.$router.push('/edit')
      },
      reducePersonal(id) {
        /*
         * 减去选中人员
         * */
        const self = this
        this.sign_id_list = []
        this.selectedPersonal.forEach(function (value, index, arr) {
          if (value.ID === id) {
            console.log(arr)
            console.log(index)
            arr.splice(index, 1)
          }
        })
        this.selectedPersonal.forEach(function (value) {
          self.sign_id_list.push(value.ID)
        })
        this.personalList.forEach(function (value) {
          if (value.id === id) {
            value.active = false
          }
        })
//        console.log(this.sign_id_list)
//        console.log(this.selectedPersonal)
      },
      selectPersonal(item) {
        item.active = !item.active
      },
      selectPersonalFlag() {
        this.getPersonalList()
        this.selectFlag = !this.selectFlag
        this.$nextTick(function () {
          this.$refs.scroll.refresh()
        })
      },
      getPersonalList() {
        this.axios({
          method: 'post',
          url: '/api/api/activitySignAndPay.php',
          data: {
            token: this.getToken || 0,
            type: 'list'
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
            if (response.data.code === 0) {
              this.personalList = this._normalizePersonaList(response.data.result)
            }
          })
      },
      setConfirmPersonalId() {
        const self = this
        this.sign_id_list = []
        this.selectedPersonal = []
        this.personalList.forEach(function (value) {
          if (value.active) {
            self.selectedPersonal.push(value)
          }
        })
        this.selectedPersonal.forEach(function (value) {
          self.sign_id_list.push(value.ID)
        })
        this.selectFlag = !this.selectFlag
        this.$nextTick(function () {
          this.$refs.selected.refresh()
        })
        console.log(this.selectedPersonal)
        console.log(this.sign_id_list)
      },
      getDetail() {
        this.axios({
          method: 'post',
          url: '/api/api/activityDetail.php',
          data: {
            activity_id: this.activityId,
            longitude: this.longitude,
            latitude: this.latitude
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
            if (response.data.code === 0) {
              this.price = parseFloat(response.data.result.detail.price)
            } else {
              this.setTimePopurFlag(response.data.msg)
            }
          })
      },
      goPay() {
        this.axios({
          method: 'post',
          url: '/api/api/activitySignAndPay.php',
          data: {
            token: this.getToken || 0,
            type: 'confirm',
            activity_id: this.activityId,
            contact: this.contact,
            contact_mobile: this.contact_mobile,
            wx_nickname: this.wx_nickname,
            note: this.note,
            sign_id_list: this.sign_id_list,
            pay_type: 'wxpay'
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
            console.log('goPay')
          })
      },
      _normalizePersonaList(list) {
        list.forEach(function (value) {
          value.active = false
        })
        return list
      },
      back() {
        this.$router.back()
      },
      ...mapMutations([
        'SET_ACTIVITY_PERSONAL'
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

  .sign-up
    position: fixed
    top: 48px
    bottom: 42px
    width: 100%
    background: $color-background-b
    .wrapper
      height: 100%
      overflow: hidden
      .form-wrapper
        margin-bottom: 10px
        .form-group
          background: $color-background
          display: flex
          align-items: center
          padding: 10px
          font-size: $font-size-medium
          label
            flex: 0 0 92px
            span
              color: $color-background
              margin-right: 4px
            .red
              color: $color-theme-r
          input, textarea
            flex: 1
            padding: 6px
            border: 1px solid $color-text-d
            border-radius: 4px
      .list
        h3
          font-size: $font-size-medium
          color: $color-text
        p
          font-size: $font-size-small
          color: $color-text-d
        .item
          display: flex
          align-items: center
          background: $color-background
          border-1px()
          padding: 10px
          &:last-child::after
            border: none
          .icon
            flex: 0 0 30px
            img
              height: 22px
          .personal
            display: flex
            align-items: center
            margin-bottom: 8px
            h3
              margin-right: 6px
      .title
        font-size: $font-size-small
        color: $color-theme-r
        padding: 10px
    .action
      background: $color-theme
      color: $color-background
      display: flex
      align-items: center
      height: 42px
      justify-content: center
      cursor: pointer
      img
        height: 22px
        margin-right: 8px
    .custom
      position: fixed
      bottom: 0
      width: 100%
      display: flex
      align-items: center
      background: $color-background
      .total
        flex: 1
        color: $color-text
        font-size: $font-size-medium
        display: flex
        padding: 0 10px
        .red
          color: $color-theme-r
      .btn
        flex: 0 0 160px
        background: $color-theme-r
        color: $color-background
        font-size: $font-size-medium
        height: 42px
        line-height: 42px
        text-align: center
    .add
      position: fixed
      bottom: 0
      top: 0
      width: 100%
      background: $color-text-l
      z-index: 300
      .content
        position: absolute
        top: 200px
        bottom: 0
        width: 100%
        display: flex
        flex-direction: column
        .make
          background: #324251
          align-items: center
          justify-content: space-between
          color: $color-background
          font-size: $font-size-medium
          padding: 0 10px
          height: 42px
          display: flex
        .personal-list
          flex: 1
          overflow: hidden
          height: 100%
          background: $color-background-b
          h3
            font-size: $font-size-medium
            color: $color-text
          p
            font-size: $font-size-small
            color: $color-text-d
          .item
            display: flex
            align-items: center
            justify-content: space-between
            background: $color-background
            border-1px()
            padding: 10px
            &:last-child::after
              border: none
            .icon
              flex: 0 0 30px
              img
                height: 22px
            .personal
              display: flex
              align-items: center
              margin-bottom: 8px
              h3
                margin-right: 6px
            .info
              flex: 1
            .select
              flex: 0 0 30px
              width: 22px
              height: 22px
              background: url('./main_select_no.png') no-repeat
              background-size: 22px 22px !important
              &.yes
                background: url('./main_select_yes.png') no-repeat
</style>
