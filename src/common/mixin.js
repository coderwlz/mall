import BackTop from 'components/content/backTop/BackTop'
// 封装回到顶部按钮
export const backTopMixin = {
    data () {
      return {
        isShowBackTop: false,
      }
    },
    components: {
      BackTop
    },
    methods: {
        backClick () {
        this.$refs.scroll.scrollTo(0,0)
      }
    }
  }