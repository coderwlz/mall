<template>
  <div class="category-menu">
    <scroll class="content">
      <div
        v-for="(item, index) in categories"
        :key="index"
        class="title"
        :class="{ active: index === currentIndex }"
        @click="titleClick(index)"
      >
        {{ item.title }}
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from "components/common/scroll/Scroll";
export default {
  components: { Scroll },
  name: "CategoryMenu",
  props: {
    categories: {
      type: Array,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      currentIndex: 0,
    };
  },
  methods: {
    titleClick(index) {
      this.currentIndex = index;
      this.$emit("selectItem", index);
    },
  },
};
</script>

<style scoped>
.category-menu {
  width: 26%;
  height: calc(100vh - 44px - 49px);
  background-color: aqua;
  text-align: center;
}
.content {
  height: calc(100vh - 44px - 49px);
  overflow: hidden;
  background: #f6f6f6;
  height: 100%;
  width: 100px;
  box-sizing: border-box;
}

.title {
  line-height: 45px;
  /* text-align: center; */
  font-size: 14px;
  background: #f6f6f6;
}
.active {
  background: #fff;
  color: var(--color-high-text);
  border-left: 3px solid var(--color-high-text);
  font-weight: 700;
}
</style>