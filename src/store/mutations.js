import * as types from './mutations-types'

const mutations = {
  [types.SET_TOKEN](state, token) {
    state.token = token
    window.localStorage.setItem('getToken', state.token)
  },
  [types.SET_OPEN_ID](state, openId) {
    state.openId = openId
    window.localStorage.setItem('openId', state.openId)
  },
  [types.SET_ADDRESS](state, address) {
    state.address = address
  },
  [types.SET_SKU](state, sku) {
    state.sku = sku
  },
  [types.SET_SKU_DETAIL](state, skuDetail) {
    state.skuDetail = skuDetail
  },
  [types.SET_CART_LIST](state, cartList) {
    state.setMeal = {}
    state.goodsId = ''
    state.cartList = cartList
  },
  [types.SET_GOODS_ID](state, goodsId) {
    state.setMeal = {}
    state.cartList = []
    state.goodsId = goodsId
  },
  [types.SET_SETMEAL](state, setMeal) {
    state.cartList = []
    state.goodsId = ''
    state.setMeal = setMeal
  },
  [types.SET_ORDER_ID](state, orderId) {
    state.orderId = orderId
  },
  [types.SET_LONGITUDE](state, longitude) {
    state.longitude = longitude
    window.localStorage.setItem('longitude', state.longitude)
  },
  [types.SET_LATITUDE](state, latitude) {
    state.latitude = latitude
    window.localStorage.setItem('latitude', state.latitude)
  },
  [types.SET_ACTIVITY_ID](state, activityId) {
    state.activityId = activityId
    window.localStorage.setItem('activityId', state.activityId)
  },
  [types.SET_ACTIVITY_PERSONAL](state, activityPersonal) {
    state.activityPersonal = activityPersonal
  },
  [types.SET_COMMENT_TYPE](state, commentType) {
    state.commentType = commentType
  },
  [types.SET_MY_CITY](state, myCity) {
    state.myCity = myCity
    window.localStorage.setItem('myCity', state.myCity)
  },
  [types.SET_BIGBIG_TYPE](state, bigbigtype) {
    state.bigbigtype = bigbigtype
  }
}

export default mutations
