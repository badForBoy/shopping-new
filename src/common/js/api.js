import Vue from 'vue'

export const userOrdersList = () => {
  let r = {}
  Vue.axios({
    method: 'post',
    url: '/api/git/nobaba_server_PHP/api/userAddressList.php',
    data: {
      token: this.getToken
    },
    transformRequest: [function (data) {
      // Do whatever you want to transform the data
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
    .then((response) => {
      r = response
    })
  console.log(r)
  return r
}
