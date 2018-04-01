<template>
  <div class="search-list">
    <header-bar @back="back" :title="'dfdsf'"></header-bar>
    search-list
  </div>
</template>

<script type="text/ecmascript-6">
  import headerBar from 'base/header-bar/header-bar'

  export default{
    methods: {
      back() {
        this.$router.back()
      }
    },
    components: {
      headerBar
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
