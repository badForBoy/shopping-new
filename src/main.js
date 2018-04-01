// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios'
import VueAxios from 'vue-axios'
import router from './router'
import store from './store'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import VueLazyload from 'vue-lazyload'
import fastclick from 'fastclick'
import { Upload, Dialog, Progress, Icon, Select, Option, OptionGroup, Button, ButtonGroup } from 'element-ui'
import VueAMap from 'vue-amap'
// import {CascadePicker} from 'cube-ui'
import CubeUi from 'cube-ui'

import 'element-ui/lib/theme-chalk/index.css'
import 'cube-ui/style.css'

import 'swiper/dist/css/swiper.css'

Vue.config.productionTip = false

fastclick.attach(document.body)

Vue.use(VueAxios, axios)
Vue.use(VueAwesomeSwiper)
Vue.use(VueLazyload, {
  lazyComponent: true
})
Vue.use(Upload)
Vue.use(Dialog)
Vue.use(Progress)
Vue.use(Icon)
Vue.use(Select)
Vue.use(Option)
Vue.use(OptionGroup)
Vue.use(Button)
Vue.use(ButtonGroup)
Vue.use(CubeUi)
// Vue.use(CascadePicker)

Vue.use(VueAMap)
VueAMap.initAMapApiLoader({
  key: '4645abb9137708f914915fb71d86d346',
  plugin: ['AMap.Geolocation', 'AMap.PlaceSearch', 'AMap.Autocomplete', 'AMap.Driving']
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})
