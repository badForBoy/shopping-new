<template>
  <div class="interactive">
    <router-view></router-view>
    <header-bar @back="back" :title="'互动社区'"></header-bar>
    <div class="tag" ref="scrollX">
      <div class="tag-wrapper">
        <div class="item" :class="{'on': item.active}" @click="selectTag(item, category, index)"
             v-for="(item, index) in category">
          <h3>{{item.content.community_name}}</h3>
          <span v-show="item.content.category_two.length!==0">
            <i v-if="item.active" class="el-icon-caret-top"></i>
            <i v-else class="el-icon-caret-bottom"></i>
          </span>
        </div>
      </div>
      <div class="border"></div>
    </div>
    <scroll
      :data="list"
      :pullup="pullup"
      @scrollToEnd="getMore"
      class="content">
      <div>
        <div class="list">
          <div class="item" v-for="item in list" @click="selectDetail(item.community_id)">
            <div class="avatar">
              <div class="pic">
                <div class="avatar-wrapper">
                  <img :src="item.head_img">
                </div>
                <h4>{{item.user_name}}</h4>
              </div>
              <div class="icon">
                <img src="./main_see.png">
                <p>{{item.view_times}}</p>
                <div class="btn">
                  关注
                </div>
              </div>
            </div>
            <div class="item-content">
              <h4>{{item.title}}</h4>
              <p>{{item.intro}}</p>
              <div class="pic-list">
                <div class="pic-item" v-for="pic in item.img">
                  <div>
                    <img :src="pic">
                  </div>
                </div>
              </div>
            </div>
            <div class="more-action">
              <div class="icon">
                <img src="./main_comment_default.png">
                <p class="red">{{item.comments_count}}</p>
              </div>
              <div class="icon">
                <img src="./main_praise_default.png">
                <p class="red">{{item.praise_times}}</p>
              </div>
              <div class="icon">
                <i class="el-icon-share"></i>
              </div>
            </div>
          </div>
        </div>
        <loading v-show="hasMore"></loading>
        <p class="hasNo" v-show="!hasMore">已经到底了！</p>
      </div>
    </scroll>
    <div class="more-select" v-show="selectFlag">
      <div class="select-content">
        <div class="select-left">
          <scroll class="wrapper" ref="selectLeft">
            <div class="list">
              <div class="item" :class="{'on': item.active}" v-for="item in category_two"
                   @click="selectTwo(item, category_two)">
                <h4>{{item.content.community_name}}</h4>
                <i v-show="item.content.category_three.length!==0" class="el-icon-arrow-right"></i>
              </div>
            </div>
          </scroll>
        </div>
        <div class="select-right">
          <scroll class="wrapper" ref="selectRight">
            <div class="list">
              <div class="item" v-for="item in categoryThree" @click="selectThree(item)">
                <h4>{{item.community_name}}</h4>
                <p>{{item.count}}</p>
              </div>
            </div>
          </scroll>
        </div>
      </div>
      <div class="mask" @click="closeSelect"></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import headerBar from 'base/header-bar/header-bar'
  import BScroll from 'better-scroll'
  import scroll from 'base/scroll/scroll'
  import loading from 'base/loading/loading'
  import { mapGetters } from 'vuex'

  export default{
    data() {
      return {
        pullup: true,
        selectFlag: false,
        category: [],
        list: [],
        category_two: [],
        categoryThree: [],
        page: 0,
        one: '',
        two: '',
        three: '',
        hasMore: true
      }
    },
    computed: {
      ...mapGetters([
        'getToken'
      ])
    },
    created() {
      this.$nextTick(() => {
        /* eslint-disable no-new */
        new BScroll(this.$refs.scrollX, {
          scrollX: true,
          eventPassthrough: 'vertical'
        })
      })
    },
    mounted() {
      this.get()
    },
    methods: {
      getMore() {
        if (!this.hasMore) {
          return
        }
        this.page++
        this.get()
      },
      selectDetail(id) {
        this.$router.push(`/interactive/${id}`)
      },
      selectThree(item) {
        this.three = item.community_category_id || ''
        this.get()
        this.closeSelect()
      },
      selectTwo(item, categoryTwo) {
        if (item.content.category_three.length === 0) {
          this.two = item.content.community_category_id
          this.three = ''
          this.get()
          this.closeSelect()
          return
        }
        this.two = item.content.community_category_id
        if (item.active) {
          this.categoryThree = item.content.category_three
          return
        }
        categoryTwo.forEach(function (value) {
          value.active = false
        })
        item.active = true
        this.categoryThree = item.content.category_three
        this.$nextTick(function () {
          this.$refs.selectLeft.refresh()
          this.$refs.selectRight.refresh()
        })
      },
      selectTag(item, category, index) {
        const self = this
        if (item.content.category_two.length === 0) {
          this.one = item.content.community_category_id
          this.two = ''
          this.three = ''
          this.get()
          return
        }
        this.one = item.content.community_category_id
        category.forEach(function (value) {
          value.active = false
        })
        item.active = true
        if (this.selectFlag) {
          this.category_two = this._normalizeCategory(item.content.category_two)
          this.category_two.forEach(function (value, index) {
            console.log(value)
            if (index === 1) {
              value.active = true
            }
            if (value.active) {
              self.categoryThree = value.content.category_three
              self.two = value.content.community_category_id
            }
          })
          this.$nextTick(function () {
            this.$refs.selectLeft.refresh()
            this.$refs.selectRight.refresh()
          })
          return
        }
        this.selectFlag = !this.selectFlag
        this.category_two = this._normalizeCategory(item.content.category_two)
        this.category_two.forEach(function (value, index) {
          if (index === 1) {
            value.active = true
          }
          if (value.active) {
            self.categoryThree = value.content.category_three
            self.two = value.content.community_category_id
          }
        })
        this.$nextTick(function () {
          this.$refs.selectLeft.refresh()
          this.$refs.selectRight.refresh()
        })
      },
      closeSelect() {
        this.selectFlag = !this.selectFlag
        if (!this.selectFlag) {
          this.category.forEach(function (value, index) {
            value.active = false
          })
        }
      },
      get() {
        this.axios.get('/api/api/getCommunityList.php', {
          params: {
            token: this.getToken || '',
            page: this.page,
            num: 10,
            category_one_id: this.one,
            category_two_id: this.two,
            category_three_id: this.three
          }
        })
          .then((response) => {
            if (response.data.code === 1) {
              this.category = this._normalizeCategory(response.data.result.category)
              if (this.page === 0) {
                this.list = response.data.result.list
              } else {
                this.list = this.list.concat(response.data.result.list)
              }
              if (response.data.result.list.length !== 10) {
                console.log('fa')
                this.hasMore = false
              }
            } else {
//              this.setTimePopurFlag(response.data.msg)
            }
          })
      },
      _normalizeCategory(list) {
        let ret = []
        list.forEach(function (valus, index) {
          ret.push({
            active: false,
            content: valus
          })
        })
        return ret
      },
      back() {
        this.$router.back()
      }
    },
    components: {
      headerBar,
      scroll,
      loading
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/base.styl"
  .interactive
    position: fixed
    top: 90px
    bottom: 0
    width: 100%
    background: $color-background-b
    z-index: 200
    .tag
      position: fixed
      top: 48px
      width: 100%
      overflow: hidden
      background: $color-background
      .tag-wrapper
        width: 180%
        display: flex
        align-items: center
        background: $color-background
        border-1px()
        .item
          display: flex
          align-items: center
          justify-content: center
          flex: 0 0 16.66667%
          border-right()
          height: 42px
          extend-click()
          &:last-child::after
            border: none
          .el-icon-caret-bottom
            color: $color-text-6
          h3
            font-size: $font-size-medium
            color: $color-text
          &.on
            h3
              color: $color-theme
            i
              color: $color-theme
    .content
      height: 100%
      overflow: hidden
      .list
        .item
          display: flex
          flex-direction: column
          background: $color-background
          margin-bottom: 10px
          h4
            font-size: $font-size-medium
            color: $color-text
          p
            font-size: $font-size-small
            color: $color-background-d
            line-height: 1.4
          .avatar
            display: flex
            justify-content: space-between
            align-items: center
            padding: 6px 10px
            border-1px()
            .pic
              display: flex
              align-items: center
              height: 40px
              .avatar-wrapper
                width: 40px
                height: 40px
                overflow: hidden
                border-radius: 20px
                margin-right: 6px
                img
                  width: 40px
                  height: 40px
            .icon
              display: flex
              align-items: center
              img
                height: 14px
                margin-right: 6px
              .btn
                background: $color-theme-r
                padding: 6px 10px
                font-size: $font-size-small
                color: $color-background
                border-radius: 4px
                margin-left: 12px
          .item-content
            padding: 6px 10px
            width: 100%
            border-1px()
            h4
              margin-bottom: 6px
            p
              margin-bottom: 6px
            .pic-list
              display: flex
              width: 100%
              .pic-item
                flex: 0 0 33.333333%
                height: 100px
                overflow: hidden
                &:last-child
                  div
                    margin-right: 0
                div
                  margin-right: 5px
                img
                  width: 100%
                  min-height: 100px

          .more-action
            display: flex
            align-items: center
            padding: 10px
            .icon
              display: flex
              align-items: center
              justify-content: center
              flex: 0 0 33.333%
              border-right()
              &:last-child::after
                border: none
              img
                height: 18px
                margin-right: 6px
              .el-icon-share
                font-size: $font-size-large
                color: $color-background-d
              .red
                color: $color-theme-r
      .hasNo
        font-size: $font-size-small
        color: $color-text-6
        text-align: center
        margin: 8px
    .more-select
      position: fixed
      top: 90px
      width: 100%
      z-index: 300
      h4
        font-size: $font-size-medium
        color: $color-text
      p
        font-size: $font-size-small
        color: $color-background-d
      .mask
        position: fixed
        width: 100%
        top: 90px
        bottom: 0
        background: $color-text-l
        z-index: -1
      .select-content
        display: flex
        height: 280px
        overflow: hidden
        .select-left, .select-right
          flex: 0 0 50%
          display: flex
          flex-direction: column
          background: $color-background-b
          .wrapper
            height: 100%
            overflow: hidden
          .item
            display: flex
            align-items: center
            justify-content: space-between
            height: 42px
            padding: 0 10px
            border-1px()
            &.on
              background: $color-background
        .select-right
          background: $color-background
        .select-left
          .item
            display: flex
            align-items: center
            h4
              flex: 1
              text-align: center
            i
              flex: 0 0 28px
              color: $color-background-d
              text-align: right

</style>
