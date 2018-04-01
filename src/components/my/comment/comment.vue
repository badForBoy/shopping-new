<template>
  <div class="comment">
    <header-bar :title="title" @back="back"></header-bar>
    <setTime-popur v-show="setTimePopur" :popup="setTimePopurTitle"></setTime-popur>
    <scroll class="wrapper">
      <div>
        <div class="list-wrapper">
          <div class="item" v-for="item in commentDetail">
            <div class="item-head">
              <div class="pic">
                <img :src="item.good_img">
              </div>
              <div class="score">
                <h3>商品评分:</h3>
                <div class="star">
                  <span v-for="k in star" :class="{'active': k.active}" class="icon" @click="selectStar(k)"></span>
                </div>
                <p class="starScore">{{starScore}}</p>
              </div>
            </div>
            <div class="detail">
              <textarea name="" id="" cols="30" rows="5" placeholder="写下对宝贝的评价吧" v-model="commentText"></textarea>
            </div>
            <div class="tag">
              <h3>标签</h3>
              <div class="tag-wrapper">
                <span
                  v-for="tag in item.keywords"
                  @click="selectTag(tag, item.keywords)"
                  :class="{'active': tag.active}">{{tag.comment_keyword}}</span>
              </div>
            </div>
            <div class="sub">
              <button
                :class="{'able': !$refs.upload || !$refs.upload.active}"
                @click.prevent="pushEvaluate(item)"
                type="button">发表评论
              </button>
            </div>
            <div class="upload">
              <el-upload
                ref="upload22"
                action="http://192.168.0.131:8080/api/api/pushevaluateimage.php"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible" size="tiny">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </div>
          </div>
        </div>
      </div>
      <div class="upload">
        <!--<el-upload
          class="upload-demo"
          ref="upload22"
          action="http://192.168.0.131:8080/api/git/nobaba_server_PHP/api/pushevaluateimage.php"
          :on-preview="handlePreview"
          :data="{'comment_id':comment_id}"
          :on-remove="handleRemove"
          :auto-upload="false"
          list-type="picture"
        >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>-->
      </div>
      {{comment_id}}
      <router-link to="/my/demo" class="demo">
        demo
      </router-link>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import headerBar from 'base/header-bar/header-bar'
  import Scroll from 'base/scroll/scroll'
  import setTimePopur from 'base/setTime-popur/setTime-popur'
  import LineTitle from 'base/line-title/line-title'
  import loading from 'base/loading/loading'
  import VueUploadComponent from 'vue-upload-component'
  import { mapGetters } from 'vuex'

  export default{
    components: {
      headerBar,
      Scroll,
      LineTitle,
      setTimePopur,
      loading,
      FileUpload: VueUploadComponent
    },
    data() {
      return {
        title: '评价',
        setTimePopur: false,
        setTimePopurTitle: '',
        commentDetail: [],
        star: [
          {
            active: false,
            score: 1
          },
          {
            active: false,
            score: 2
          },
          {
            active: false,
            score: 3
          },
          {
            active: false,
            score: 4
          },
          {
            active: false,
            score: 5
          }
        ],
        starScore: 0,
        commentText: '',
        label: [],
        comment_id: 0,
        dialogImageUrl: '',
        dialogVisible: false
      }
    },
    computed: {
      ...mapGetters([
        'getToken'
      ])
    },
    mounted() {
      this.getComment()
    },
    methods: {
      handleRemove(file, fileList) {
        console.log(file, fileList)
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      submitUpload() {
        this.$refs.upload22.submit()
      },
      handlePreview(file) {
        console.log(file)
      },
      starUpload() {
        console.log('starUpload')
        console.log('commentId:' + this.comment_id)
        if (this.comment_id === 0) {
          return
        }
        this.$refs.upload.active = true
      },
      selectStar(k) {
        k.active = !k.active
        this.starScore = k.score
        for (let i = 0; i < this.star.length; i++) {
          this.star[i].active = false
        }
        for (let i = 0; i < this.starScore; i++) {
          this.star[i].active = true
        }
      },
      selectTag(tag, items) {
        console.log(items)
        this.label = []
        let ret = []
        tag.active = !tag.active
        for (let i = 0; i < items.length; i++) {
          if (items[i].active) {
            ret.push(items[i].ID)
          }
        }
        this.label = ret
      },
      getComment() {
        console.log('getComment')
        this.axios({
          method: 'post',
          url: '/api/api/evaluate.php',
          data: {
            token: this.getToken,
            order_id: this.$route.params.id
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
            console.log(response)
            if (response.data.code === 1) {
              this.commentDetail = this._normalizeComment(response.data.result)
            } else {
              this.setTimePopurFlag(response.data.msg)
            }
          })
      },
      pushEvaluate(item) {
        /*
         * 评论接口分两步进行
         * 1. 先pushevaluate.php 获取返回值 comment_id
         * 2. 再pushevaluateimage.php 上传图片
         * */
        if (this.starScore === 0) {
          this.setTimePopurFlag('请给商品评分')
          return
        } else if (!this.commentText) {
          this.setTimePopurFlag('请写商品评价')
          return
        } else if (this.label.length <= 0) {
          this.setTimePopurFlag('请选择标签')
          return
        }
        console.log('pushEvaluate')
        this.axios({
          method: 'post',
          url: '/api/api/pushevaluate.php',
          data: {
            token: this.getToken,
            good_id: item.good_id,
            good_type: item.type,
            score: this.starScore,
            comment: this.commentText,
            label: this.label
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
            console.log(response)
            if (response.data.code !== 1) {
              this.setTimePopurFlag(response.data.msg)
              return
            }
            this.comment_id = parseInt(response.data.result)
            if (this.comment_id !== 0) {
              console.log('comment_id !=0:' + this.comment_id)
              this.$refs.upload.submit()
            }
          })
      },
      setTimePopurFlag(titie) {
        this.setTimePopurTitle = titie
        this.setTimePopur = true
        setTimeout(() => {
          this.setTimePopur = false
        }, 1000)
      },
      _normalizeComment(list) {
        for (let i = 0; i < list.length; i++) {
          for (let j = 0; j < list[i].keywords.length; j++) {
            list[i].keywords[j].active = false
          }
        }
        return list
      },
      back() {
        this.$router.back()
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/base.styl"

  .comment
    position: fixed
    top: 48px
    bottom: 0
    width: 100%
    background: $color-background-b
    z-index: 500
    .wrapper
      .list-wrapper
        .item
          background: $color-background
          .item-head
            display: flex
            align-items: center
            padding: 10px
            border-1px($color-background-d)
            .pic
              width: 90px
              height: 60px
              overflow: hidden
              img
                width: 100%
            .score
              margin-left: 10px
              font-size: $font-size-medium
              color: $color-text
              display: flex
              align-items: center
              .star
                display: flex
                align-items: center
                margin-left: 12px
                .icon
                  background: url("./star_gray.png") no-repeat
                  width: 16px
                  height: 16px
                  background-size: 16px 16px
                  margin-right: 8px
                  extend-click()
                  &.active
                    background: url("./star_yellow.png") no-repeat
                    width: 16px
                    height: 16px
                    background-size: 16px 16px
              .starScore
                font-size: $font-size-medium
                color: #ffce22
          .tag
            display: flex
            padding: 10px
            h3
              font-size: $font-size-medium
              color: $color-text
              font-weight: 600
              flex: 0 0 60px
            .tag-wrapper
              display: flex
              flex-wrap: wrap
              span
                font-size: $font-size-small
                padding: 10px 14px
                background: $color-background-b
                text-align: center
                margin: 0 6px 6px 0
                border-radius: 4px
                color: $color-text-6
                extend-click()
                &.active
                  background: $color-theme
                  color: $color-background
          .detail
            padding: 10px
            border-1px($color-background-d)
            textarea
              border: none
              outline: none
              width: 100%
          .upload
            display: flex
            padding: 10px
            flex-direction: column
            border-1px($color-background-d)
            ul
              display: flex
              flex-wrap: wrap
              align-items: center
              justify-content: space-between
              li
                flex: 0 0 24%
                overflow: hidden
                height: 132px
                margin: 0
                margin-bottom: 10px
                .pic
                  padding: 4px
                  position: relative
                  p
                    position: absolute
                    bottom: 7px
                    left: 4px
                    right: 4px
                    background-color: $color-text-l
                    color: $color-background
                    font-size: $font-size-small
                    height: 18px
                    line-height: 18px
                  img
                    width: 100%
                    height: 80px
                .title
                  overflow: hidden
                  p
                    font-size: $font-size-medium
                    color: $color-text-6
                    overflow: hidden
                    text-overflow: ellipsis
                    white-space: nowrap
                    margin: 6px 0

          .sub
            background: #fff
            width: 100%
            margin-bottom: 12px
            padding: 10px 10px
            .btn, button
              cursor: pointer
              display: block
              padding: 12px 24px
              width: 100%
              text-align: center
              border-radius: 5px
              border: none
              font-size: $font-size-medium
              color: $color-background
              background: $color-background-d
              outline: none
              &.able
                color: $color-background
                background: #FF4F02
    .el-upload-list--picture
      .el-upload-list__item
        padding: 0
        display: flex
        align-items: center
        justify-content: center
        img
          margin-left: 0
          width: 100%
          height: 100%
      .el-upload-list__item-name
        display: none
    .el-upload--picture-card
      width: 100%
      height: 42px
      line-height: 42px
      i
        font-size: $font-size-large
</style>
