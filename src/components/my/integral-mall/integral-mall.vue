<template>
  <div class="integral-mall">
    <header-bar :title="title" @back="back"></header-bar>
    <scroll
      ref="scroll"
      class="wrapper"
      :data="goodsList"
      :pullup="pullup"
      @scrollToEnd="getMore"
    >
      <div>
        <div class="mall-wrapper">
          <div class="mall-item" v-for="item in goodsList" :key="item.goods_score_id">
            <div class="mall-box">
              <div class="pic">
                <img :src="item.goods_score_img">
                <p>
                  {{item.goods_score_money > 0 ? item.goods_score_money + '元' + ' +' : ''}} {{item.goods_score_sum}}积分</p>
              </div>
              <div class="title">
                {{item.goods_score_name}}
              </div>
            </div>
          </div>
        </div>
        <div class="bottom-tick">{{bottomTick}}</div>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import headerBar from 'base/header-bar/header-bar'
  import Scroll from 'base/scroll/scroll'

  export default{
    data() {
      return {
        title: '积分商城',
        goodsList: [],
        pullup: true,
        page: 0,
        hasMore: true,
        bottomTick: ''
      }
    },
    computed: {},
    mounted() {
      this.getScoreGoodsList()
    },
    methods: {
      back() {
        this.$router.back()
      },
      getMore() {
        if (!this.hasMore) {
          this.$nextTick(() => {
            this.$refs.scroll.refresh()
          })
          return
        }
        this.page++
        this.bottomTick = '加载中'
        console.log('page:' + this.page)
        this.getScoreGoodsList()
        this.$nextTick(() => {
          this.$refs.scroll.refresh()
        })
      },
      getScoreGoodsList() {
        this.axios.get('/api/api/getScoreGoodsList.php', {
          params: {
            num: 10,
            page: this.page
          }
        })
          .then((respose) => {
            if (respose.data.code === 1) {
              this.goodsList = respose.data.result.concat(this.goodsList)
              if (respose.data.result.length < 10) {
                this.hasMore = false
                this.bottomTick = '已经到底了'
              }
              console.log(this.hasMore)
              console.log(this.goodsList)
            }
          })
      }
    },
    components: {
      headerBar,
      Scroll
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/base.styl"

  .integral-mall
    position: fixed
    top: 48px
    bottom: 0
    width: 100%
    background: $color-background-b
    z-index: 300
    .mall-wrapper
      display: flex
      flex-wrap: wrap
      .mall-item
        flex: 0 0 50%
        .mall-box
          margin: 5px
          background: $color-background
          .pic
            position: relative
            img
              width: 100%
            p
              font-size: $font-size-small
              color: $color-background
              line-height: 36px
              text-align: center
              background: $color-text-l
              position: absolute
              bottom: 0
              width: 100%
          .title
            font-size: $font-size-small
            color: $color-text
            padding: 10px
            line-height: 1.4
            height: 48px
            overflow: hidden

    .bottom-tick
      height: 40px
      line-height: 40px
      text-align: center
      font-size: $font-size-medium
      color: $color-text-6
</style>
