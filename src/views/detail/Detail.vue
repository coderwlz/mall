<template>
  <div id="detail">
    <detail-nav-bar
      class="detail-nav"
      @titleClick="titleClick"
      ref="nav"
    ></detail-nav-bar>
    <scroll class="content" ref="scroll" @scroll="contentScroll" :probeType="3">
      <detail-swiper :topImages="topImages"></detail-swiper>
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detailInfo="detailInfo" @imgLoad="imgLoad" />
      <detail-param-info
        ref="params"
        :paramInfo="paramInfo"
      ></detail-param-info>
      <detail-comment-info ref="comment" :commentInfo="commentInfo" />
      <goods-list ref="recommend" :goods="recommends" />
    </scroll>
    <detail-bottom-bar @addCart="addToCart" />
    <back-top @click.native="backClick" v-show="isShowBackTop" />
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar.vue";
import DetailSwiper from "./childComps/DetailSwiper.vue";
import {
  getDetail,
  Goods,
  Shop,
  GoodsParam,
  getRecommend,
} from "network/detail.js";
import DetailBaseInfo from "./childComps/DetailBaseInfo.vue";
import DetailShopInfo from "./childComps/DetailShopInfo.vue";
import Scroll from "../../components/common/scroll/Scroll.vue";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo.vue";
import DetailParamInfo from "./childComps/DetailParamInfo.vue";
import DetailCommentInfo from "./childComps/DetailCommentInfo.vue";
import GoodsList from "../../components/content/goods/GoodsList.vue";
import { debounce } from "common/utils.js";
import DetailBottomBar from "./childComps/DetailBottomBar.vue";
// import BackTop from "../../components/content/backTop/BackTop.vue";
import { backTopMixin } from "@/common/mixin.js";
export default {
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    Scroll,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    GoodsList,
    DetailBottomBar,
  },
  name: "Detail",
  mixins: [backTopMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themsTopYs: [],
      getTopYs: null,
      currentIndex: 0,
      // isShowBackTop: false,
    };
  },
  created() {
    //保存传入进来的iid
    this.iid = this.$route.params.iid;
    //根据iid请求数据
    getDetail(this.iid).then((res) => {
      //1.获取顶部的图片轮播数据
      console.log(res);
      const data = res.result;
      this.topImages = data.itemInfo.topImages;
      //2.获取商品信息
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );
      //3.创建店铺信息的对象
      this.shop = new Shop(data.shopInfo);
      //4.获取商品详情信息
      this.detailInfo = data.detailInfo;
      //5.获取参数信息
      this.paramInfo = new GoodsParam(
        data.itemParams.info,
        data.itemParams.rule
      );
      //6.获取评论信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0];
      }
    });
    //请求推荐数据
    getRecommend().then((res) => {
      //   console.log(res);
      this.recommends = res.data.list;
    });
    // 4. 为topYs设置防抖
    this.getTopYs = debounce(() => {
      let navHeight = 44;
      this.themsTopYs = [];
      this.themsTopYs.push(0);
      this.themsTopYs.push(this.$refs.params.$el.offsetTop - navHeight);
      this.themsTopYs.push(this.$refs.comment.$el.offsetTop - navHeight);
      this.themsTopYs.push(this.$refs.recommend.$el.offsetTop - navHeight);
      this.themsTopYs.push(Number.MAX_VALUE);
      console.log(this.themsTopYs);
    }, 100);
  },
  methods: {
    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themsTopYs[index], 200);
    },
    imgLoad() {
      this.$refs.scroll.refresh();
      this.getTopYs();
    },
    contentScroll(position) {
      // 1.获取y值
      const positionY = -position.y;
      let length = this.themsTopYs.length;
      for (let i = 0; i < length - 1; i++) {
        if (
          this.currentIndex !== i &&
          i < length - 1 &&
          positionY >= this.themsTopYs[i] &&
          positionY < this.themsTopYs[i + 1]
        ) {
          this.currentIndex = i;
          //console.log(i); // 因为此时打印非常频繁，所以将当前index保存为一个变量，在两个不等的情况下才打印，就不会很频繁
          //console.log(this.themsTopYs[i]); // 此处的值是正值
          this.$refs.nav.currentIndex = this.currentIndex;
        }
      }
      // 是否显示回到底部按钮的判断
      this.isShowBackTop = positionY > 1000;
    },
    // backClick() {
    //   this.$refs.scroll.scrollTo(0, 0);
    // },
    addToCart() {
      // 1.获取购物车需要展示的信息，因为有多个信息，所以可以放在一个对象里
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid; // id一定要传，因为id是商品的唯一标识，是将id传给服务器获取到对应的商品

      // 2.将商品添加到购物车里
      // this.$store.commit('addCart',product) commit是将product提交到store中mutations里的方法addCart
      this.$store.dispatch("addCart", product).then((res) => {
        this.$toast.show(res, 2000);
      }); // dispatch是提交到actions里去，再由actions分发commit到mutations里不同的方法中去
      // 3.如果添加购物车成功（用promise监视成功与否）
    },
  },
};
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}
.content {
  height: calc(100% - 44px - 44px);
}
.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}
</style>