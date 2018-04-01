<template>
  <div class="add-new">
    <header-bar @back="back" :title="title"></header-bar>
    <setTime-popur v-show="setTimePopur" :popup="setTimePopurTitle"></setTime-popur>
    <scroll class="wrapper">
      <div>
        <div class="form-wrapper">
          <div class="form-group">
            <label>成员类型{{value}}</label>
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.ID"
                :label="item.type_name"
                :value="item.ID">
              </el-option>
            </el-select>
          </div>
          <div class="form-group">
            <label>姓名</label>
            <input type="text" v-model="name" placeholder="请输入成员的真实姓名">
          </div>
          <div class="form-group">
            <label>身份证号</label>
            <input type="text" v-model="code" placeholder="请输入成员的身份证号">
          </div>
        </div>
        <p class="title">*①四年级以下学生免费；②报名费用中已包含相关保险费用</p>
        <div class="action" @click="addNew">
          确定
        </div>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import headerBar from 'base/header-bar/header-bar'
  import scroll from 'base/scroll/scroll'
  import setTimePopur from 'base/setTime-popur/setTime-popur'
  import { mapGetters } from 'vuex'

  export default{
    data() {
      return {
        title: '新增人员',
        setTimePopur: false,
        setTimePopurTitle: '',
        options: [
          {
            value: '1',
            label: '成人'
          },
          {
            value: '2',
            label: '四年级以下学生'
          }
        ],
        name: '',
        code: '',
        value: ''
      }
    },
    computed: {
      ...mapGetters([
        'getToken'
      ])
    },
    mounted() {
      this.getTypeList()
    },
    methods: {
      addNew() {
        this.axios({
          method: 'post',
          url: '/api/api/activitySignAndPay.php',
          data: {
            token: this.getToken || 0,
            type: 'add',
            numbertypeid: this.value,
            name: this.name,
            code: this.code
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
            } else {
              this.setTimePopurFlag(response.data.msg)
            }
          })
      },
      getTypeList() {
        this.axios({
          method: 'post',
          url: '/api/api/activitySignAndPay.php',
          data: {
            token: this.getToken || 0,
            type: 'numberType'
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
              this.options = response.data.result
            }
          })
      },
      setTimePopurFlag(titie) {
        this.setTimePopurTitle = titie
        this.setTimePopur = true
        setTimeout(() => {
          this.setTimePopur = false
        }, 1000)
      },
      back() {
        this.$router.back()
      }
    },
    components: {
      headerBar,
      scroll,
      setTimePopur
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/base.styl"

  .add-new
    position: fixed
    top: 48px
    bottom: 0
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
            border: none
            outline: none
            border-radius: 4px
            font-size: $font-size-medium
            color: $color-text
          .el-select
            flex: 1
            font-size: $font-size-medium
            color: $color-text
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
      background: $color-theme-r
      color: $color-background
      display: flex
      align-items: center
      height: 42px
      justify-content: center
      cursor: pointer
      img
        height: 22px
        margin-right: 8px

</style>
