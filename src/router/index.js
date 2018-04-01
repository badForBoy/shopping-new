import Vue from 'vue'
import Router from 'vue-router'
import Home from 'components/home/home.vue'
import specialty from 'components/specialty/specialty'
import Basket from 'components/basket/basket'
import My from 'components/my/my'
import Detail from 'components/detail/detail'
import ChoiseFormat from 'components/detail/choise/choise'
import commentList from 'components/detail/comment-list/comment-list'
import Login from 'components/login/login'
import address from 'components/my/address/address'
import collection from 'components/my/collection/collection'
import cooperation from 'components/my/cooperation/cooperation'
import follow from 'components/my/follow/follow'
import integralMall from 'components/my/integral-mall/integral-mall'
import notice from 'components/my/notice/notice'
import order from 'components/my/order/order'
import myActivity from 'components/my/my-activity/my-activity'
import myAccommodate from 'components/my/my-accommodate/my-accommodate'
import release from 'components/my/release/release'
import service from 'components/my/service/service'
import set from 'components/my/set/set'
import addressEdit from 'components/my/address/address-edit/address-edit'
import explain from 'components/explain/explain'
import allClassify from 'components/all-classify/all-classify'
import search from 'components/search/search'
import healthPackage from 'components/health-package/health-package'
import singleProductackage from 'components/singleProduct-package/singleProduct-package'
import yearReservePackage from 'components/yearReserve-package/yearReserve-package'
import countrysidePackage from 'components/countryside-package/countryside-package'
import confirmOrder from 'components/confirm-order/confirm-order'
import orderDetail from 'components/order-detail/order-detail'
import coupon from 'components/coupon/coupon'
import logistic from 'components/my/logistic/logistic'
import comment from 'components/my/comment/comment'
// 测试demo
import demo from 'components/my/comment/demo'

import gaodeMap from 'base/gaode-map/gaode-map'
import navigationMap from 'components/navigation-map/navigation-map'
import myWallet from 'components/my/my-wallet/my-wallet'
import myCoupon from 'components/my/my-coupon/my-coupon'
import myScore from 'components/my/my-score/my-score'
import shopDetail from 'components/shop-detail/shop-detail'
import ruralExperience from 'components/rural-experience/rural-experience'
import ruralExperienceDetail from 'components/rural-experience-detail/rural-experience-detail'
import registrationList from 'components/activity/registration-list/registration-list'
import addNew from 'components/activity/add-new/add-new'
import edit from 'components/activity/edit/edit'
import signUp from 'components/activity/sign-up/sign-up'
import signUpDetail from 'components/activity/sign-up-detail/sign-up-detail'
import ruralTourism from 'components/rural-tourism/rural-tourism'
import ruralTourismDetail from 'components/rural-tourism-detail/rural-tourism-detail'
import accommodation from 'components/accommodation/accommodation'
import accommodationDetail from 'components/accommodation-detail/accommodation-detail'
import interactive from 'components/interactive/interactive'
import interactiveDetail from 'components/interactive-detail/interactive-detail'
import selectCity from 'components/select-city/select-city'
import searchList from 'components/search-list/search-list'
import interactiveCommentList from 'components/interactive-comment-list/interactive-comment-list'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      component: Home,
      meta: {
        keepAlive: true // 此组件需要被缓存
      },
      children: [
        {
          path: ':goods_id',
          component: Detail,
          meta: {
            keepAlive: false

          },
          children: [
            {
              path: 'choise',
              component: ChoiseFormat
            },
            {
              path: 'commentList',
              component: commentList
            }
          ]
        }
      ]
    },
    {
      path: '/specialty',
      component: specialty,
      meta: {
        keepAlive: true // 此组件需要被缓存
      },
      children: [
        {
          path: ':id',
          component: shopDetail
        }
      ]
    },
    {
      path: '/basket',
      component: Basket
    },
    {
      path: '/my',
      component: My,
      children: [
        {
          path: 'address',
          component: address,
          meta: {
            keepAlive: false // 此组件需要被缓存

          },
          children: [
            {
              path: 'addressEdit',
              component: addressEdit
            }
          ]
        },
        {
          path: 'myWallet',
          component: myWallet
        },
        {
          path: 'myCoupon',
          component: myCoupon
        },
        {
          path: 'myScore',
          component: myScore
        },
        {
          path: 'collection',
          component: collection
        },
        {
          path: 'cooperation',
          component: cooperation
        },
        {
          path: 'follow',
          component: follow
        },
        {
          path: 'integralMall',
          component: integralMall
        },
        {
          path: 'notice',
          component: notice
        },
        {
          path: 'order',
          component: order
        },
        {
          path: 'myActivity',
          component: myActivity
        },
        {
          path: 'myAccommodate',
          component: myAccommodate
        },
        {
          path: 'logistic',
          component: logistic,
          children: [
            {
              path: ':id',
              component: logistic
            }
          ]
        },
        {
          path: 'comment',
          component: comment,
          children: [
            {
              path: ':id',
              component: comment
            }
          ]
        },
        { // 图片上传测试demo
          path: 'demo',
          component: demo
        },
        {
          path: 'service',
          component: service,
          children: [
            {
              path: 'explain',
              component: explain
            }
          ]
        },
        {
          path: 'release',
          component: release
        },
        {
          path: 'set',
          component: set
        }
      ]
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/allClassify',
      component: allClassify
    },
    {
      path: '/search',
      component: search
    },
    {
      path: '/healthPackage',
      component: healthPackage
    },
    {
      path: '/singleProductPackage',
      component: singleProductackage
    },
    {
      path: '/yearReservePackage',
      component: yearReservePackage
    },
    {
      path: '/countrysidePackage',
      component: countrysidePackage
    },
    {
      path: '/confirmOrder',
      component: confirmOrder
    },
    {
      path: '/orderDetail',
      component: orderDetail
    },
    {
      path: '/coupon',
      component: coupon
    },
    {
      path: '/gaodeMap',
      component: gaodeMap
    },
    {
      path: '/navigationMap',
      component: navigationMap
    },
    {
      path: '/ruralExperience',
      component: ruralExperience,
      children: [
        {
          path: ':id',
          component: ruralExperienceDetail,
          children: [
            {
              path: 'commentList',
              component: commentList
            }
          ]
        }
      ]
    },
    {
      path: '/registrationList',
      component: registrationList
    },
    {
      path: '/addNew',
      component: addNew
    },
    {
      path: '/edit',
      component: edit
    },
    {
      path: '/signUp',
      component: signUp
    },
    {
      path: '/signUpDetail',
      component: signUpDetail
    },
    {
      path: '/ruralTourism',
      component: ruralTourism,
      children: [
        {
          path: ':id',
          component: ruralTourismDetail,
          children: [
            {
              path: 'commentList',
              component: commentList
            }
          ]
        }
      ]
    },
    {
      path: '/accommodation',
      component: accommodation,
      children: [
        {
          path: ':id',
          component: accommodationDetail,
          children: [
            {
              path: 'commentList',
              component: commentList
            }
          ]
        }
      ]
    },
    {
      path: '/interactive',
      component: interactive,
      children: [
        {
          path: ':id',
          component: interactiveDetail,
          children: [
            {
              path: 'interactiveCommentList',
              component: interactiveCommentList
            }
          ]
        }
      ]
    },
    {
      path: '/selectCity',
      component: selectCity
    },
    {
      path: '/searchList',
      component: searchList
    }
  ]
})
