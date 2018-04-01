<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'

  export default{
    props: {
      // 以下多个属性数据都可由上级组件传递过来
      probeType: {
        // 1是截留滚动 3实时滚动的位置
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      scrollX: {
        type: Boolean,
        default: false
      },
      eventPassthrough: {
        type: String,
        default: 'horizontal'
      },
      data: {
        type: Array,
        default: null
      },
      listenScroll: {
        // 让scroll要不要去监听滚动事件
        type: Boolean,
        default: false
      },
      /**
       * 是否派发滚动到底部的事件，用于上拉加载
       */
      pullup: {
        type: Boolean,
        default: false
      },
      /**
       * 是否派发顶部下拉的事件，用于下拉刷新
       */
      pulldown: {
        type: Boolean,
        default: false
      }
    },
    mounted() {
      setTimeout(() => {
        this._initScroll()
      }, 20)
    },
    methods: {
      _initScroll() {
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click
        })

        /**
         * 是否派发滚动到底部的事件，用于上拉加载
         */
        if (this.pullup) {
          this.scroll.on('scrollEnd', () => {
            if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
              this.$emit('scrollToEnd')
            }
          })
        }

        /**
         * 是否派发滚动到顶部的事件，用于下拉刷新
         */
        if (this.pulldown) {
          this.scroll.on('scrollEnd', () => {
            if (this.scroll.y > -10) {
              this.$emit('scrollToTop')
            }
          })
        }

        // 如果监听了 scroll  也就是listenScroll 默认值为true
        if (this.listenScroll) {
          let me = this
          /*
           监听scroll的滚动事件， 回调 pos 会拿到位置，然后需要派发一个事件出去，调用$emit()
           在vue2.0中
           $on: 监听当前实例上的自定义事件
           $emiit: 触发当前实例上的事件,附加参数都会传给监听器回调
           */
          this.scroll.on('scroll', (pos) => {
            me.$emit('scroll', pos)
          })
        }
      },
      disable() {
        this.scroll && this.scroll.disable()
      },
      enable() {
        this.scroll && this.scroll.enable()
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      scrollTo() {
        // 代理better-scroll的scrollTo方法
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement() {
        // 代理better-scroll的scrollToElement方法
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this.refresh()
        }, 20)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
