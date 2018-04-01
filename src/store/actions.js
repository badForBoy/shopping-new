import Vue from 'vue'

export const seedUserInfo = function ({commit}, data) {
  Vue.axios({
    url: '/api/git/nobaba_server_PHP/api/userLogin.php',
    method: 'post',
    data: data,
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
    .then(function (response) {
      console.log(response)
      if (response.data.code === 1) {
      }
    })
}
