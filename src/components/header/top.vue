<template>
  <div class="header">
    <div class="buttonL">东营区雨情自动遥测系统</div>
    <div class="buttonR">
      <div class="timeL">
        <span>{{ fromTimeN }}</span>
        <span class="timeSpan">{{ str }}</span>
        <span>{{ fromTimeS }}</span>
      </div>
      <div class="word" @click="screen">
        <span class="span1" v-show="!isFullscreen">
          <span class="iconfont icon-quanpingzuidahua images1"></span>
          <span>全屏</span>
        </span>
        <span v-show="isFullscreen" class="span4">退出全屏</span>
      </div>
      <div class="renovate">
        <span class="span2" @click="reload">
          <span class="iconfont icon-shuaxin images2"></span>
          <span>刷新</span>
        </span>
      </div>
      <div class="people">
        <span class="span3">
          <el-dropdown trigger="hover" @command="handleCommand">
            <span>
              <span class="title">超级管理员</span>
              <span class="iconfont icon-yonghuming images3"></span>
            </span>
            <el-dropdown-menu slot="dropdown" class="dropdownD">
              <el-dropdown-item command="/login">
                <span class="iconfont icon-logout imges4"></span>
                <span>退出登陆</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fromTimeN: null,
      fromTimeS: null,
      timeOur: null,
      isFullscreen: false,
      str: null
    };
  },
  mounted() {
    // 监听屏幕窗口变化用$nextTick()
    let that = this;
    this.$nextTick(() => {
      window.onresize = function temp() {
        that.isFullScreen();
      };
    });
  },
  methods: {
    //判断全屏状态
    isFullScreen() {
      this.isFullscreen =
        document.isFullScreen ||
        document.mozIsFullScreen ||
        document.webkitIsFullScreen;
    },
    // 全屏
    screen() {
      let element = document.documentElement;
      if (this.isFullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.isFullscreen = !this.isFullscreen;
    },
    //退出登陆
    handleCommand(command) {
      // this.$message(command);
      localStorage.clear();
      this.$router.push("/login");
    },
    //初始化时间
    initializationTime() {
      let time = new Date();
      let month = time.getMonth() + 1;
      let date = time.getDate();
      let hours = time.getHours();
      let minutes = time.getMinutes();
      let seconds = time.getSeconds();
      let week = time.getDay(); //获取星期几
      if (week == 0) {
        this.str = "【星期日】";
      } else if (week == 1) {
        this.str = "【星期一】";
      } else if (week == 2) {
        this.str = "【星期二】";
      } else if (week == 3) {
        this.str = "【星期三】";
      } else if (week == 4) {
        this.str = "【星期三】";
      } else if (week == 5) {
        this.str = "【星期五】";
      } else if (week == 6) {
        this.str = "【星期六】";
      }
      const res =
        time.getFullYear() +
        "年" +
        (month < 10 ? "0" + month : month) +
        "月" +
        (date < 10 ? "0" + date : date) +
        "日";
      const resDate =
        (hours < 10 ? "0" + hours : hours) +
        ":" +
        (minutes < 10 ? "0" + minutes : minutes) +
        ":" +
        (seconds < 10 ? "0" + seconds : seconds);
      this.fromTimeN = res;
      this.fromTimeS = resDate;
    },
    timeOpen() {
      clearInterval(this.timeOur);
      this.timeOur = setInterval(() => {
        this.initializationTime();
      }, 1000);
    },
    reload() {
      location.reload();
    }
  },
  created() {
    this.timeOpen();
  },
  destroyed() {
    clearInterval(this.timeOur);
    this.timeOur = null;
  }
};
</script>

<style scoped lang="less">
.buttonL {
  font-size: 24px;
  font-family: PingFang SC;
  font-weight: bold;
  color: rgba(255, 255, 255, 1);
  line-height: 86px;
}
.timeL {
  font-size: 20px;
  font-family: PingFang SC;
  font-weight: bold;
  color: rgba(255, 255, 255, 1);
}
.timeSpan {
  margin: 0 5px;
}
.header {
  display: flex;
  justify-content: space-between;
}
.word,
.renovate {
  cursor: pointer;
  &:hover {
    border-radius: 16px;
  }
}
.buttonR {
  height: 86px;
  line-height: 86px;
  display: flex;
  align-items: center;
  float: right;
  .span1,
  .span2,
  .span4 {
    margin: 0 14px;
    display: inline-block;
    height: 32px;
    line-height: 32px;
    display: flex;
    color: #fff;
    align-items: center;
  }
  .span3 {
    margin: 0 14px;
    display: inline-block;
    height: 40px;
    line-height: 40px;
    color: #fff;
    display: flex;
    align-items: center;
    .title {
      display: inline-block;
      color: #fff;
      margin-right: 10px;
    }
    .images3 {
      font-size: 40px;
      color: #fff;
    }
  }
  .images1,
  .images2 {
    margin-right: 8px;
    font-size: 20px;
    color: #fff;
  }
}
.el-dropdown {
  height: 44px;
  line-height: 44px;
  border-radius: 22px;
  margin-left: 10px;
  // box-shadow: 0px 4px 8px rgba(131, 131, 131, 0.23);
  cursor: pointer;
}

.el-dropdown-selfdefine {
  display: flex;
  align-items: center;
}
.dropdownD {
  width: 120px !important;
  border-radius: 10px;
  font-size: 14px;
  .el-dropdown-menu__item {
    line-height: 24px;
    display: flex;
    align-items: center;
    .imges4 {
      font-size: 24px;
      color: blue !important;
    }
  }
}
</style>
