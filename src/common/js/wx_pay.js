export const pay = function () {
  if (typeof WeixinJSBridge === 'undefined') {
    if (document.addEventListener) {
      document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false)
    } else if (document.attachEvent) {
      document.attachEvent('WeixinJSBridgeReady', onBridgeReady)
      document.attachEvent('onWeixinJSBridgeReady', onBridgeReady)
    }
  } else {
    /* eslint-disable no-undef */
    onBridgeReady(option)
  }
}

export const onBridgeReady = function (option) {
  WeixinJSBridge.invoke(
    'getBrandWCPayRequest', option,

    function (res) {
      if (res.err_msg === 'get_brand_wcpay_request:ok') {
        alert('支付成功')  // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
        // 回到用户订单列表
        // alert("哈哈岛主");
        window.location.href = './order.html'
      } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
        alert('支付过程中用户取消')
      } else {
        // 支付失败
        alert(res.err_msg)
      }
    }
  )
}
