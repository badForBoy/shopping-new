<template>
  <div class="notice">
    <header-bar :title="title"></header-bar>
    collection
  </div>
</template>

<script type="text/ecmascript-6">
  import headerBar from 'base/header-bar/header-bar'
  export default{
    data() {
      return {
        title: '加盟合作'
      }
    },
    components: {
      headerBar
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
