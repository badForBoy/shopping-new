<template>
  <swiper :options="swiperOption" ref="mySwiper">
    <!-- 这部分放你要渲染的那些内容 -->
    <swiper-slide v-for="slider in sliders" :key="slider.type">
      <img @click="swiperGo(slider)" @load="loadImge" :src="slider.ads_img ? slider.ads_img : slider" class="index_img">
    </swiper-slide>
    <!-- 这是轮播的小圆点 -->
    <div class="swiper-pagination" slot="pagination"></div>
  </swiper>
</template>

<script type="text/ecmascript-6">
  import { swiper, swiperSlide } from 'vue-awesome-swiper'

  export default {
    name: 'carrousel',
    props: ['sliders'],
    components: {
      swiper,
      swiperSlide
    },
    data() {
      return {
        swiperOption: {
          autoplay: 3500,
          setWrapperSize: true,
          pagination: '.swiper-pagination',
          paginationClickable: true,
          mousewheelControl: true,
          observeParents: true,
          loop: true
        },
        swiperSlides: []
      }
    },
    created() {
      this.timer = setInterval(() => {
        let swiperSlides = this.swiperSlides
        if (swiperSlides.length < 10) swiperSlides.push(swiperSlides.length + 1)
      }, 3000)
    },
    methods: {
      swiperGo(slider) {
        this.$emit('swiperGo', slider)
      },
      loadImge() {
//        if (!this.checkloaded) {
//          this.checkloaded = true
//          setTimeout(() => {
//            this.$refs.scroll.refresh()
//          }, 20)
//        }
      }
    },
    destroyed() {
      clearInterval(this.timer)
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .swiper-slide
    img
      width: 100%
</style>
