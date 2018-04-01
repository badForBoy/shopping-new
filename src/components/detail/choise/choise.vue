<template>
  <div class="choise-format">
    <header-bar :title="title" @back="back"></header-bar>
    <scroll class="wrapper" :data="list">
      <div>
        <p class="notice">温馨提示：默认商品全选，点击可取消选中商品</p>
        <div class="item" v-for="group in list">
          <h3>{{group.k}}至少保留{{group.count}}件</h3>
          <div class="count-item">
            <span
              v-for="item in group.items"
              :class="{'delete':item.active}"
              @click="toggleClass(item, group, group.count)">
              {{item.title}}
            </span>
          </div>
        </div>
      </div>
    </scroll>
    <div class="btn" @click="makeChoise">确定</div>
  </div>
</template>

<script type="text/ecmascript-6">
  import headerBar from 'base/header-bar/header-bar'
  import Scroll from 'base/scroll/scroll'
  import { mapMutations } from 'vuex'

  export default{
    components: {
      headerBar,
      Scroll
    },
    data() {
      return {
        title: '选择套餐规格',
        list: []
      }
    },
    mounted() {
      this.getList()
      this.getComments()
    },
    computed: {},
    methods: {
      makeChoise() {
        // jisuan
        let obj = {
          personal: [],
          goods_id: this.$route.params.goods_id
        }

        for (let i = 0; i < this.list.length; i++) {
          for (let j = 0; j < this.list[i].items.length; j++) {
            if (!this.list[i].items[j].active) {
              obj.personal.push(this.list[i].items[j].title)
              continue
            }
          }
        }
        this.setMeal(obj)
        this.$router.push('/confirmOrder')
      },
      toggleClass(item, items, count) {
        let num = items.items.length
        item.active = !item.active

        for (let i = 0; i < items.items.length; i++) {
          if (items.items[i].active) {
            if (num <= items.count) {
              item.active = !item.active
            }
            num--
          }
        }
      },
      _normarlizeData(list) {
        let ret = []
        for (let i = 0; i < list.length; i++) {
          ret.push({
            k: list[i].key,
            count: list[i].count,
            items: []
          })
          for (let j = 0; j < list[i].category.length; j++) {
            ret[i].items.push({
              active: false,
              title: list[i].category[j]
            })
          }
        }
        return ret
      },
      back() {
        this.$router.back()
      },
      getList() {
        this.axios.get('/api/api/getPersonalTailor.php', {params: {goods_id: this.$route.params.goods_id}})
          .then((response) => {
            if (response.data.code === 1) {
              this.list = this._normarlizeData(response.data.result)
//              console.log(this.list)
            }
          })
      },
      getComments() {
        this.axios.get('/api/api/evaluate.php', {params: {order_id: 405}})
          .then((data) => {
//            console.log(data)
          })
      },
      ...mapMutations({
        setMeal: 'SET_SETMEAL'
      })
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/variable.styl"

  .choise-format
    position: fixed
    top: 41px
    bottom: 0
    width: 100%
    z-index: 200
    padding-bottom: 40px
    background: $color-background-b
    .notice
      font-size: $font-size-medium
      color: $color-text
      line-height: 38px
      padding: 0 10px
    .item
      padding: 10px
      border-bottom: 1px solid $color-background-b
      background: $color-background
      h3
        font-size: $font-size-medium
        color: $color-text
        line-height: 36px
      .count-item
        display: flex
        flex-wrap: wrap
        span
          padding: 8px 12px
          margin: 0 10px 10px 0
          border-radius: 4px
          font-size: $font-size-medium
          color: $color-background
          background: $color-theme
          &.delete
            background: $color-text-b
    .btn
      position: fixed
      bottom: 0
      width: 100%
      text-align: center
      height: 40px
      line-height: 40px
      background: $color-theme-r
      font-size: $font-size-medium
      color: $color-background

</style>
