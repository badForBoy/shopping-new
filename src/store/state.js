const state = {
  setMeal: [],
  token: '',
  openId: '',
  address: {},
  // 产品规格列表
  sku: [],

  // 产品规格详情
  skuDetail: {},

  // 菜篮购买
  cartList: [],

  // 详情直接购买
  goodsId: {},

  // 我的订单跳转ID订单详情
  orderId: '',
  // 经纬度
  latitude: '',
  longitude: '',
  // 定位城市
  myCity: '',
  // 活动报名
  activityId: '',
  // 修改活动报名人信息
  activityPersonal: {},
  // 评价类型列表
  commentType: '',
  // 民宿：0 美食：1
  bigbigtype: 1
}

export default state
