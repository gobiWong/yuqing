<template>
  <div id="table">
    <el-breadcrumb class="breadcrumb-container" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item v-for="(item, i) in levelList" :key="i" :to="item.path">
        <span :class="{ 'is-active': isActive(item.path) }">{{item.meta.title}}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: "Navbar",
  data() {
    return {
      levelList: []
    };
  },
  watch: {
    $route() {
      this.getBreadcrumb();
    }
  },
  created() {
    this.getBreadcrumb();
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.name);
      let status = true;
      const first = matched[1];
      this.levelList[0] = { path: "/home/map", meta: { title: "首页" } };
      if (first && first.name != "map") {
        this.levelList.forEach(item => {
          if (item.path === first.path) {
            status = false;
          }
        });
        if (status) {
          this.levelList.push(first);
          status = true;
        }
      }
    },
    isActive(path) {
      return !this.$route.fullPath.indexOf(path);
    }
  }
};
</script>

<style lang="less" scoped>
.breadcrumb {
  height: 20px;
  line-height: 20px;
}
.is-active {
  color: #409eff !important;
}
</style>