<template>
  <div class="category">
    <nav-bar class="nav-bar">
      <div slot="center">商品分类</div>
    </nav-bar>
    <div class="category-center">
      <category-menu :categories="categories" @selectItem="selectItem" />
      <div class="right">
        <scroll class="scroll" :probe-type="3" :data="[categoryData]">
          <menu-detail :subcategories="showSubcategory" />
          <tab-control
            :titles="['综合', '新品', '销量']"
            @tabClick="tabClick"
          />
          <!-- <content-detail :content-detail="showContentDetail" /> -->
          <goods-list :goods="showContentDetail" />
        </scroll>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getCategory,
  getsubcategory,
  getContentDetail,
} from "network/category.js";
import NavBar from "../../components/common/navbar/NavBar.vue";
import CategoryMenu from "./childComps/CategoryMenu.vue";
import Scroll from "../../components/common/scroll/Scroll.vue";
import MenuDetail from "./childComps/MenuDetail.vue";
import TabControl from "../../components/content/tabControl/TabControl.vue";

// import ContentDetail from "./childComps/ContentDetail.vue";
import GoodsList from "../../components/content/goods/GoodsList.vue";

export default {
  components: {
    NavBar,
    CategoryMenu,
    Scroll,
    MenuDetail,
    TabControl,
    // ContentDetail,
    GoodsList,
  },
  name: "Category",
  data() {
    return {
      categories: [],
      categoryData: [],
      currentIndex: -1,
      subcategories: {},
      currentType: "pop",
    };
  },
  created() {
    this.getCategorys();
  },
  methods: {
    getCategorys() {
      getCategory().then((res) => {
        // 1.获取分类数据
        this.categories = res.data.category.list;
        // 2.初始化每个类别的子数据
        for (let i = 0; i < this.categories.length; i++) {
          this.categoryData[i] = {
            subcategories: {},
            categoryDetail: {
              pop: [],
              new: [],
              sell: [],
            },
          };
        }
        //   主数据请求到之后才能接着请求后面的子数据
        this.getsubcategorys(0);
      });
    },
    getsubcategorys(index) {
      this.currentIndex = index;
      const mailKey = this.categories[index].maitKey;
      getsubcategory(mailKey).then((res) => {
        console.log(res);
        this.categoryData[index].subcategories = res.data;
        this.categoryData = { ...this.categoryData };
        this.getContentDetail("pop");
        this.getContentDetail("new");
        this.getContentDetail("sell");
        console.log(this.categoryData);
      });
    },
    selectItem(index) {
      this.getsubcategorys(index);
    },
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
      }
    },
    getContentDetail(type) {
      const miniWallkey = this.categories[this.currentIndex].miniWallkey;
      console.log(miniWallkey);
      getContentDetail(miniWallkey, type).then((res) => {
        this.categoryData[this.currentIndex].categoryDetail[type] = res;
        this.categoryData = { ...this.categoryData };
      });
    },
  },
  computed: {
    showSubcategory() {
      if (this.currentIndex === -1) return {};
      return this.categoryData[this.currentIndex].subcategories;
    },
    showContentDetail() {
      if (this.currentIndex === -1) return [];
      return this.categoryData[this.currentIndex].categoryDetail[
        this.currentType
      ];
    },
  },
};
</script>

<style scoped>
.nav-bar {
  background-color: var(--color-tint);
  color: #fff;
  font-weight: 700;
}
.category-center {
  height: calc(100vh - 44px - 49px);
  display: flex;
}
.right {
  width: 74%;
  height: 100%;
}
.scroll {
  height: calc(100vh - 44px - 49px);
  overflow: hidden;
}
</style>