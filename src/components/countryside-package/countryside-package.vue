<template>
  <div class="country-side">
    <header-bar :title="title" @back="back"></header-bar>
    <div class="header-tab">
      <div class="header-tab-wrapper">
        <div
          @click="selectType(item)"
          class="header-tab-item"
          :class="{'active':item.active}"
          v-for="item in headerTab">{{item.key}}
        </div>
      </div>
    </div>
    <div class="tab">
      <div class="tab-item" @click="all(item,index, tab)" :class="{'active':item.active}" v-for="(item, index) in tab">
        <p>{{item.key}}</p>
        <span class="icon"></span>
      </div>
    </div>
    <scroll
      :data="goods"
      :pullup="pullup"
      @scrollToEnd="getMoreGoods"
      ref="scroll"
      class="wrapper">
      <div>
        <div class="wrapper-list">
          <div class="list-item" v-for="(item, index) in goods" :key="item.index" @click="selectDetail(item)">
            <div class="item-left">
              <div class="pic">
                <lazy-component>
                  <img :src="item.good_img">
                </lazy-component>
              </div>
              <!--养你喜欢-->
              <div class="title" v-show="PAGE_TYPE===9">
                <h3>{{item.name}}</h3>
                <p class=" flex">好评度：
                  <star :size="12" :score="item.star"></star>
                </p>
                <p class="red">{{item.now_price}}/{{item.good_unit}}</p>
                <p class="">养殖数量: <span class="red">{{parseInt(item.need_num)}} 只</span> </p>
                <p class="sm">{{parseInt(item.min_num)}}{{item.good_unit}}起养</p>
              </div>
              <!--种你喜欢-->
              <div class="title" v-show="PAGE_TYPE===10">
                <h3>{{item.name}}</h3>
                <p class=" flex">好评度：
                  <star :size="12" :score="item.star"></star>
                </p>
                <p class="">租田价格：<span class="red">{{item.current_price}}/{{item.good_unit}}/月</span> </p>
                <p class="">租田面积：<span class="red">{{item.need_num}}{{item.good_unit}}</span> </p>
                <p class="">已租：<span class="red">{{item.now_num}}{{item.good_unit}}</span> </p>
                <p class="red">{{item.min_num}}{{item.good_unit}}起租</p>
              </div>
            </div>
            <div class="item-right">
              <p class="sm">{{parseFloat(parseInt(item.distance / 100) / 10)}}km</p>
            </div>
          </div>
        </div>
        <loading v-show="loading"></loading>
        <div class="no-data" v-show="!loading">没有更多数据了</div>
      </div>
    </scroll>
    <transition name="slide">
      <!--<screen-popur v-show="showScreen" :screen="screen" @close="close" @selectWord="selectWord"></screen-popur>-->
      <div class="screen-popur" v-show="showScreen">
        <div class="popur-wrapper">
          <div class="popur-item" v-for="item in screen" @click="selectWord(item.fid)" :key="item.fid">{{item.key}}
          </div>
        </div>
        <div class="mask" @click="close"></div>
      </div>
    </transition>
    <transition name="left">
      <div class="screen-left" v-show="showScreenLeft">
        <div class="mask" @click="close"></div>
        <scroll class="popur-screen" :pullup="pullup" :data="goods" @scrollToEnd="leftreset" ref="left">
          <div>
            <div class="popur-box" v-for="item in chooseList">
              <h3>{{item.key}}</h3>
              <div class="screen-wrapper">
              <span :class="{'active':list.active}" v-for="(list, index) in item.category"
                    @click="toggleChooseClass(list)">{{list.title}}</span>
              </div>
            </div>
          </div>
        </scroll>
        <div class="action">
          <div class="btn reset" @click="resetChoose">重置</div>
          <div class="btn confirm" @click="selectChoose">确认</div>
        </div>
      </div>
    </transition>
    <setTime-popur v-show="setTimePopur" :popup="setTimePopurTitle"></setTime-popur>
  </div>
</template>

<script type="text/ecmascript-6">
  import headerBar from 'base/header-bar/header-bar'
  import screenPopur from 'base/screen-popur/screen-popur'
  import Scroll from 'base/scroll/scroll'
  import Star from 'base/star/star'
  import loading from 'base/loading/loading'
  import setTimePopur from 'base/setTime-popur/setTime-popur'

  const DEFAULT_PAGE_NUM = 10
  //  let PAGE_TYPE = 9
  // 10-种你喜欢 9-养你喜欢

  export default{
    data() {
      return {
        title: '共享田园',
        screen: [],
        showScreenLeft: false,
        showScreen: false,
        goods: [],
        getAllGoods: {},
        chooseList: [],
        pullup: true,
        hasMore: true,
        page: 0,
        loading: true,
        goodsMoreLen: 0,
        tab: [
          {
            key: '分类',
            active: false
          },
          {
            key: '地区',
            active: false
          },
          {
            key: '排序',
            active: false
          },
          {
            key: '筛选',
            active: false
          }
        ],
        headerTab: [
          {
            key: '养你喜欢',
            active: true
          },
          {
            key: '种你喜欢',
            active: false
          }
        ],
        selectWordType: 0,
        category: 0,
        sort: 0,
        area: 0,
        choose: '',
        setTimePopur: false,
        setTimePopurTitle: '',
        PAGE_TYPE: 9
      }
    },
    create() {},
    computed: {},
    mounted() {
      this.getAllGoodsList()
    },
    methods: {
      leftreset() {
        this.$refs.left.refresh()
      },
      selectType(item) {
        for (let i = 0; i < this.headerTab.length; i++) {
          this.headerTab[i].active = false
        }
        item.active = !item.active
        if (item.key === '养你喜欢') {
          this.PAGE_TYPE = 9
        } else if (item.key === '种你喜欢') {
          this.PAGE_TYPE = 10
        }
        this.category = 0
        this.sort = 0
        this.area = 0
        this.choose = ''
        this.getAllGoodsList()
      },
      resetChoose() {
        for (let i = 0; i < this.chooseList.length; i++) {
          for (let k = 0; k < this.chooseList[i].category.length; k++) {
            this.chooseList[i].category[k].active = false
          }
        }
      },
      selectChoose() {
        let ret = []
        for (let i = 0; i < this.chooseList.length; i++) {
          for (let k = 0; k < this.chooseList[i].category.length; k++) {
            if (this.chooseList[i].category[k].active) {
              ret.push(this.chooseList[i].category[k].title)
            }
          }
        }
        if (ret.length === 0) {
          this.setTimePopurTitle = '请选择!'
          this.setTimePopur = true
          setTimeout(() => {
            this.setTimePopur = false
          }, 1000)
          return
        }
        this.choose = ret
        this.close()
        this.getAllGoodsList()
      },
      toggleChooseClass(item) {
        item.active = !item.active
      },
      selectWord(fid) {
        this.type = 2
        this.sort = 0
        this.category = 0
        this.area = 0
        this.choose = ''

        switch (this.selectWordType) {
          case 0: // 分类
            this.category = fid
            break
          case 1: // 地区
            this.area = fid
            break
          case 2: // 排序
            this.sort = fid
            break
        }

        this.close()

//        console.log(fid)
//        console.log('area' + this.area)
//        console.log('sort' + this.sort)
//        console.log('category' + this.category)

        this.getAllGoodsList()
      },
      getMoreGoods() {
        /*
         * 下拉刷新
         * */
        if (!this.hasMore) {
          return
        }
        this.page++
        console.log('page:' + this.page)
        this.getGoodsList()
      },
      selectDetail(item) {
        this.$router.push(`/home/${item.good_id}`)
      },
      scroll() {},
      all(item, index, tab) {
        tab.forEach((i, k) => {
          if (index !== k) {
            i.active = false
          }
        })

        item.active = !item.active
        this.showScreen = item.active

        switch (index) {
          case 0:
            this.screen = this.getAllGoods.where[0] // 分类
            this.selectWordType = 0
            break
          case 1:
            this.screen = this.getAllGoods.where[1] // 地区
            this.selectWordType = 1
            break
          case 2:
            this.screen = this.getAllGoods.where[2] // 排序
            this.selectWordType = 2
            break
          case 3:
            this.showScreenLeft = !this.showScreenLeft
            this.showScreen = false
            break
        }
      },
      close() {
        this.showScreen = false
        this.showScreenLeft = false
        this.tab.forEach((i) => {
          i.active = false
        })
      },
      back() {
        this.$router.back()
      },
      getAllGoodsList() {
        this.hasMore = true
        let url = '/api/api/getAllGoodsList.php?' +
          `longitude=120.310849` +
          `&latitude=30.317957` +
          `&token=7c5cd427de6044e20b1c4c707586a44e` +
          `&page=0` +
          `&num=${DEFAULT_PAGE_NUM}` +
          `&type=${this.PAGE_TYPE}` +
          `&category=${this.category}` +
          `&sort=${this.sort}` +
          `&area=${this.area}` +
          `&choose=${this.choose}`
        this.axios.get(url)
          .then((response) => {
            if (response.data.code === 1) {
              this.goods = response.data.result.goods
              this.getAllGoods = response.data.result
              this.chooseList = this._chosseDataNormalize(response.data.result.choose)
              if (response.data.result.goods.length === DEFAULT_PAGE_NUM) {
                this.loading = true
              } else {
                this.loading = false
                this.hasMore = false
              }
              this.$nextTick(() => {
                this.$refs.scroll.refresh()
              })
            }
          })
      },
      getGoodsList() {
        let url = '/api/api/getAllGoodsList.php?' +
          `longitude=120.310849` +
          `&latitude=30.317957` +
          `&token=7c5cd427de6044e20b1c4c707586a44e` +
          `&page=${this.page}` +
          `&num=${DEFAULT_PAGE_NUM}` +
          `&type=${this.PAGE_TYPE}` +
          `&category=${this.category}` +
          `&sort=${this.sort}` +
          `&choose=${this.choose}`
        this.axios.get(url)
          .then((response) => {
            if (response.data.code === 1) {
              this.goods = this.goods.concat(response.data.result.goods)
              if (response.data.result.goods.length === DEFAULT_PAGE_NUM) {
                this.loading = true
              } else {
                this.loading = false
                this.hasMore = false
              }
              this.$nextTick(() => {
                this.$refs.scroll.refresh()
              })
            }
          })
      },
      _chosseDataNormalize(data) {
        let arr = []
        for (let i = 0; i < data.length; i++) {
          let ret = {
            category: [],
            key: data[i].key
          }
          for (let key in data[i].category) {
            ret.category.push({
              title: data[i].category[key],
              active: false
            })
          }
          arr.push(ret)
        }
        return arr
      }
    },
    components: {
      headerBar,
      screenPopur,
      Scroll,
      Star,
      loading,
      setTimePopur
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/base.styl"

  .country-side
    position: fixed
    top: 48px
    bottom: 0
    width: 100%
    z-index: 300
    background: $color-background-b
    .header-tab
      position: fixed
      top: 0
      height: 48px
      display: flex
      align-items: center
      justify-content: center
      width: 200px
      left: calc(50% - 100px)
      .header-tab-wrapper
        display: flex
        align-items: center
        justify-content: center
        width: 200px
        height: 28px
        border-radius: 14px
        border: 1px solid $color-theme
        background: $color-background
        .header-tab-item
          flex: 1
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
          height: 28px
          border-radius: 14px
          line-height: 28px
          &.active
            background: $color-theme
            color: $color-background
    .tab
      display: flex
      align-items: center
      height: 40px
      background: $color-background
      border-1px($color-background-b)
      .icon
        width: 10px !important
        height: 8px !important
        display: block
        background: url("./triangle-down.png") no-repeat
        background-size: 10px 8px !important
        margin-left: 4px
      .tab-item
        flex: 1
        text-align: center
        display: flex
        justify-content: center
        align-items: center
        &.active
          color: $color-theme
          .icon
            display: block
            background: url("./triangle-up.png") no-repeat
    .wrapper
      height: 100%
      overflow: hidden
      .no-data
        font-size: $font-size-medium
        color: $color-text-b
        margin: 10px
        text-align: center
      .wrapper-list
        padding: 0 10px
        background: $color-background
        .list-item
          display: flex
          justify-content: space-between
          border-1px($color-background-b)
          padding: 10px 0
          .item-left
            flex: 1
            display: flex
            align-items: center
            .pic
              height: 80px
              overflow: hidden
              flex: 0 0 100px
              div
                width: 100%
                height: 100%
                overflow: hidden
              img
                width: 100%
                height: 100%
            .title
              margin-left: 10px
              display: flex
              flex-direction: column
              justify-content: space-between
              height: 80px
              flex: 1
              overflow: hidden
              white-space: nowrap
              text-overflow: ellipsis
              h3
                font-size: $font-size-medium
                color: $color-text
                text-overflow: ellipsis
                overflow: hidden
              p
                font-size: $font-size-small
                color: $color-text
                &.sm
                  font-size: $font-size-small
                  color: $color-text-b
                &.red
                  font-size: $font-size-small
                  color: $color-theme-r
                &.flex
                  display: flex
                .red
                  font-size: $font-size-small
                  color: $color-theme-r
          .item-right
            flex: 0 0 60px
            text-align: right
            .sm
              font-size: $font-size-medium
              color: $color-text-b
            .red
              font-size: $font-size-medium
              color: $color-theme-r
            .flex
              display: flex
    .screen-left
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      z-index: 1000
      display: flex
      .popur-screen
        position: absolute
        left: 100px
        top: 0
        bottom: 0
        overflow: hidden
        flex: 1
        background: $color-background
        .popur-box
          margin: 10px
          border-1px($color-background-b)
          &:first-child
            padding-top: 40px
          &:last-child
            padding-bottom: 50px
        h3
          font-size: $font-size-small
          color: $color-text-b
          margin-bottom: 10px
        .screen-wrapper
          display: flex
          flex-wrap: wrap
          justify-content: space-between
          span
            margin-bottom: 10px
            padding: 8px 0
            background: $color-background-b
            border-radius: 4px
            font-size: $font-size-small
            color: $color-text
            flex: 0 0 30%
            text-align: center
            &.active
              background: $color-theme
              color: $color-background
      .action
        position: fixed
        bottom: 0
        left: 100px
        right: 0
        display: flex
        z-index: 1000
        .btn
          flex: 0 0 50%
          text-align: center
          cursor: pointer
          height: 40px
          line-height: 40px
          &.confirm
            background: $color-theme-r
            color: $color-background
          &.reset
            background: $color-dialog-background
            color: $color-theme-r

      .mask
        flex: 0 0 100px
        background: $color-text-l
        position: fixed
        left: 0
        right: 0
        top: 0
        bottom: 0
    .screen-popur
      position: fixed
      top: 88px
      bottom: 0
      width: 100%
      display: flex
      align-items: center
      justify-content: center
      z-index: 1000
      .popur-wrapper
        display: flex
        flex-direction: column
        align-items: center
        justify-content: center
        width: 100%
        background: $color-background
        position: absolute
        top: 0
        padding: 0 10px
        .popur-item
          background: $color-background
          border-1px($color-background-b)
          font-size: $font-size-medium
          color: $color-text
          height: 38px
          line-height: 38px
          width: 100%
          text-align: center
          &:last-child
            &::aafter
              border: none
      .mask
        position: absolute
        top: 0
        bottom: 0
        width: 100%
        background: $color-text-l
        z-index: -1

    .slide-enter-active, .slide-leave-active
      transition: all 0.3s
    .slide-enter, .slide-leave-active
      transform: translate3d(0, 100%, 0)

    .left-enter-active, .left-leave-active
      transition: all 0.3s
    .left-enter, .left-leave-active
      transform: translate3d(100%, 0, 0)
</style>
