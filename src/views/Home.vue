<template>
  <div class="home">
    <el-container>
      <el-header>
        <Top></Top>
      </el-header>
      <el-container>
        <transition name="fade">
          <el-aside v-show="drawer">
            <Aside ref="child"></Aside>
          </el-aside>
        </transition>
        <transition name="switch">
          <div class="animation" v-show="drawer">
            <img v-show="drawer" src="../assets/png/left.png" @click="animationLetf" alt />
            <img v-show="!drawer" src="../assets/png/right.png" @click="animationRight" alt />
          </div>
        </transition>
        <transition name="switchL">
          <div class="animationL" v-show="!drawer">
            <img v-show="drawer" src="../assets/png/left.png" @click="animationLetf" alt />
            <img v-show="!drawer" src="../assets/png/right.png" @click="animationRight" alt />
          </div>
        </transition>
        <el-main>
          <!-- <Tab class="Tab"></Tab> -->
          <router-view class="routerview" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Top from "@/components/header/top";
import Aside from "@/components/Aside/Aside";
import Tab from "@/components/table/table";
export default {
  name: "Home",
  data() {
    return {
      drawer: true
    };
  },
  components: {
    Top,
    Aside,
    Tab
  },
  methods: {
    animationLetf() {
      this.drawer = false;
    },
    animationRight() {
      this.drawer = true;
    }
  },
  watch: {
    $route(to) {
      //向子组件注册事件
      this.$refs.child.parentMsg(to.path);
    }
  },
  created() {}
};
</script>

<style lang="less">
.home {
  width: 100%;
  height: 100%;
}
.el-header {
  width: 100%;
  height: 86px !important;
  background: linear-gradient(
    90deg,
    rgba(11, 178, 178, 1),
    rgba(29, 179, 179, 1)
  );
}
.is-vertical {
  height: 100% !important;
}
.el-container {
  width: 100%;
  height: calc(100vh - 86px);
  position: relative;
  .animation {
    position: absolute;
    left: 265px;
    top: 38%;
    width: 24px;
    height: 12%;
    background-color: #fff;
    z-index: 10;
    border-radius: 0 10px 10px 0;
    box-shadow: 2px 2px 0px #ccc;
    img {
      width: 80%;
      position: relative;
      top: 50%; /*偏移*/
      transform: translateY(-50%);
    }
  }
  .animationL {
    position: absolute;
    left: 0;
    top: 38%;
    width: 24px;
    height: 12%;
    background-color: #fff;
    border-radius: 0 10px 10px 0;
    z-index: 99999;
    box-shadow: 2px 2px 0px #ccc;
    img {
      width: 80%;
      position: relative;
      top: 50%; /*偏移*/
      transform: translateY(-50%);
    }
  }
}
.el-aside {
  height: 100%;
  width: 265px !important;
  background: url("../assets/png/aside.png") no-repeat;
  background-size: 100% 100%;
}
.el-menu-item {
  width: 265px !important;
  height: 56px !important;
  line-height: 56px !important;
  text-align: left;
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  padding-left: 40px;
  padding: 0px 0px 0px 20px !important;
}
.el-submenu {
  text-align: left !important;
}
.el-main {
  padding: 20px 24px !important;
  width: 100%;
  height: 100%;
  background-color: rgba(245, 246, 250, 1);
  position: relative;
  .Tab {
    position: absolute;
    left: 24px;
    top: 0;
  }
}
.routerview {
  width: 100%;
  height: 100%;
}
.el-submenu.is-active .el-submenu__title {
  background-color: #fff !important;
}
.el-form-item__error {
  left: 15% !important;
}
.fade-enter-active {
  animation: bounce-in 1s linear;
}
.fade-leave-active {
  animation: bounce-leave 1s linear;
}
@keyframes bounce-in {
  0% {
    width: 0px;
  }
  100% {
    width: 265px;
  }
}
@keyframes bounce-leave {
  0% {
    width: 265px;
  }
  100% {
    width: 0px;
  }
}
.switch-enter-active {
  animation: switch-in 1s linear;
}
.switch-leave-active {
  animation: switch-leave 1s linear;
}
@keyframes switch-in {
  0% {
    left: 0;
  }
  100% {
    left: 265px;
  }
}
@keyframes switch-leave {
  0% {
    left: 265px;
  }
  100% {
    left: 0;
  }
}
.switchL-enter-active {
  animation: switchl-in 1s linear;
}
.switchL-leave-active {
  animation: switchl-leave 1s linear;
}
@keyframes switchl-in {
  0% {
    left: 265px;
  }
  100% {
    left: 0;
  }
}
@keyframes switchl-leave {
  0% {
    left: 0;
  }
  100% {
    left: 265px;
  }
}
.el-submenu__title {
  font-size: 16px !important;
  width: 265px !important;
  height: 56px !important;
  line-height: 56px !important;
}

.el-breadcrumb__item:last-child .el-breadcrumb__inner {
  color: #303133 !important;
  font-weight: 700 !important;
}

.el-breadcrumb__inner.is-link:hover {
  color: #409eff !important;
  cursor: pointer !important;
}

.el-progress--circle {
  width: 100%;
  .el-progress-circle {
    width: 100% !important;
    height: 100% !important;
  }
}

.anchorBL {
  display: none;
}

.BMap_stdMpCtrl {
  display: block;
}
</style>
