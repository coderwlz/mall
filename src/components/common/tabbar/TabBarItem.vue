<template>
  <div class="tab-bar-item" @click="tabClick">
    <div v-if="!isActive"><slot name="item-icon"></slot></div>
    <div v-else><slot name="item-icon-active"></slot></div>
    <div :style="avtiveStyle"><slot name="item-text"></slot></div>
  </div>
</template>

<script>
export default {
  name: "TabBarItem",
  data() {
    return {
      //   isActive: true,
    };
  },
  props: {
    path: String,
    activeColor: {
      type: String,
      default: "red",
    },
  },
  methods: {
    tabClick() {
      this.$router.push(this.path).catch((err) => console.log(err));
    },
  },
  computed: {
    isActive() {
      return this.$route.path.indexOf(this.path) !== -1;
    },
    avtiveStyle() {
      return this.isActive ? { color: this.activeColor } : {};
    },
  },
};
</script>

<style scoped>
.tab-bar-item {
  flex: 1;
  height: 49px;
  text-align: center;
  font-size: 14px;
}
.tab-bar-item img {
  width: 24px;
  height: 24px;
  margin-top: 3px;
  vertical-align: middle;
  margin-bottom: 2px;
}
</style>