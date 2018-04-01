// export const setMeal = function (state) {
//   return state.setMeal
// }

export const setMeal = (state) => state.setMeal

export const getToken = (state) => {
  // 先从state里面获取用户登录信息
  let token = state.token
  // 如果 state 里面获取不到，那么从localStorage里面获取
  if (!token) {
    // loginInfo = JSON.parse(window.localStorage.getItem('userInfo') || null)
    token = window.localStorage.getItem('getToken') || null
  }
  return token
}

export const openId = (state) => {
  // 先从state里面获取用户登录信息
  let openId = state.openId
  // 如果 state 里面获取不到，那么从localStorage里面获取
  if (!openId) {
    // loginInfo = JSON.parse(window.localStorage.getItem('userInfo') || null)
    openId = window.localStorage.getItem('openId') || null
  }
  return openId
}

export const address = (state) => state.address

export const sku = (state) => state.sku

export const skuDetail = (state) => state.skuDetail

export const cartList = (state) => state.cartList

export const goodsId = (state) => state.goodsId

export const orderId = (state) => state.orderId

export const latitude = (state) => {
  let latitude = state.latitude
  if (!latitude) {
    latitude = window.localStorage.getItem('latitude') || null
  }
  return latitude
}

export const longitude = (state) => {
  let longitude = state.longitude
  if (!longitude) {
    longitude = window.localStorage.getItem('longitude') || null
  }
  return longitude
}

export const activityId = (state) => {
  let activityId = state.activityId
  if (!activityId) {
    activityId = window.localStorage.getItem('activityId') || null
  }
  return activityId
}

export const activityPersonal = (state) => state.activityPersonal

export const commentType = (state) => state.commentType

export const myCity = (state) => {
  let myCity = state.myCity
  if (!myCity) {
    myCity = window.localStorage.getItem('myCity') || null
  }
  return myCity
}

export const bigbigtype = (state) => state.bigbigtype
