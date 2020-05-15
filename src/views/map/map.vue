<template>
  <div id="map">
    <div class="timeOver">刷新倒计时：{{ time }}秒</div>
    <div class="texter" v-if="texterShow">
      <div class="texterTop" style="border-bottom: 1px solid #0AABAB;">
        <el-row>
          <el-col :span="24">
            <span>{{markerTitle.name}}</span>
            <i class="el-icon-close closeIcon" @click="texterShow = false"></i>
          </el-col>
        </el-row>
      </div>
      <div class="title">
        <el-row>
          <el-col :span="24">设备状态：{{markerTitle.rainDeviceStatus}}</el-col>
        </el-row>
      </div>
      <div class="title">
        <el-row>
          <el-col :span="24">信号强度：{{markerTitle.isConnected}}</el-col>
        </el-row>
      </div>
      <div class="title">
        <el-row>
          <el-col :span="24">流量卡号：{{markerTitle.codeNumber}}</el-col>
        </el-row>
      </div>
      <div class="title">
        <el-row>
          <el-col :span="24">RTU编号：{{markerTitle.addressCode}}</el-col>
        </el-row>
      </div>
      <div class="title">
        <el-row>
          <el-col :span="24">蓄电池状态：{{markerTitle.addressCode}}</el-col>
        </el-row>
      </div>
      <div class="title">
        <el-row>
          <el-col :span="24">是否下雨：{{markerTitle.rainWeatherStatus}}</el-col>
        </el-row>
      </div>
      <div class="title">
        <el-row>
          <el-col :span="24">传输状态：{{markerTitle.rainDeviceStatus}}</el-col>
        </el-row>
      </div>
      <div class="title">
        <el-row>
          <el-col :span="24">最后下雨时间：{{markerTitle.rainLasttime}}</el-col>
        </el-row>
      </div>
      <div class="title" style="border-bottom: 0px">
        <el-row>
          <el-col :span="24">最后接收数据时间：{{markerTitle.rainUpdateTime}}</el-col>
        </el-row>
      </div>
    </div>
    <div class="status">
      <div class="topText">设备状态</div>
      <div class="listone">
        正常
        <span class="blue"></span>
      </div>
      <div class="listtown">
        下雨
        <span class="violet"></span>
      </div>
      <div class="listthree">
        故障
        <span class="red"></span>
      </div>
    </div>
    <baidu-map id="all_map" :center="region" :zoom="12" :scroll-wheel-zoom="true" :dragging="true">
      <bm-map-type :map-types="types" anchor="BMAP_ANCHOR_BOTTOM_RIGHT"></bm-map-type>
      <bm-navigation anchor="BMAP_ANCHOR_BOTTOM_LEFT"></bm-navigation>
      <bm-boundary
        :name="region"
        :strokeWeight="2"
        strokeColor="#D89544"
        :strokeOpacity="1"
        strokeStyle="dashed"
        fillColor="#F8DAB6"
        :fillOpacity="0.7"
      ></bm-boundary>
      <!-- 正常 -->
      <div v-for="item in normalList" :key="item.sid">
        <bm-marker
          :position="{lng:item.address[0],lat:item.address[1]}"
          :icon="{url: 'http://47.110.160.217:10071/img/red2.png', size: {width: 26, height: 39}}"
          @click="monitorDetails(item)"
        >
          <bm-label
            :content="item.name"
            :labelStyle="labelStyle"
            :offset="{width: -15, height: 40}"
          />
          <bm-label
            :content="item.gateNumber"
            :labelStyle="labelStyle"
            :offset="{width: 5, height: 60}"
          />
        </bm-marker>
      </div>
      <!-- 下雨 -->
      <div v-for="item in rainList" :key="item.sid">
        <bm-marker
          :position="{lng:item.address[0],lat:item.address[1]}"
          :icon="{url: 'http://47.110.160.217:10071/img/red1.png', size: {width: 26, height: 39}}"
          @click="monitorDetails(item)"
        >
          <bm-label
            :content="item.name"
            :labelStyle="labelStyle"
            :offset="{width: -15, height: 40}"
          />
          <bm-label
            :content="item.gateNumber"
            :labelStyle="labelStyle"
            :offset="{width: 5, height: 60}"
          />
        </bm-marker>
      </div>
      <!-- 故障 -->
      <div v-for="item in faultList" :key="item.sid">
        <bm-marker
          :position="{lng:item.address[0],lat:item.address[1]}"
          :icon="{url: 'http://47.110.160.217:10071/img/red3.png', size: {width: 26, height: 39}}"
          @click="monitorDetails(item)"
        >
          <bm-label
            :content="item.name"
            :labelStyle="labelStyle"
            :offset="{width: -15, height: 40}"
          />
          <bm-label
            :content="item.gateNumber"
            :labelStyle="labelStyle"
            :offset="{width: 5, height: 60}"
          />
        </bm-marker>
      </div>
    </baidu-map>
  </div>
</template>

<script>
// import { getBoundary, getEarth, getMap } from "../../utils/map";
export default {
  data() {
    return {
      time: 15,
      timer: null,
      types: ["BMAP_NORMAL_MAP", "BMAP_HYBRID_MAP"],
      markerTitle: {},
      region: "东营区",
      InfoAdree: [],
      normalList: [], //正常
      rainList: [], //下雨
      faultList: [], //故障
      texterShow: false,
      labelStyle: {
        color: "#4D4D4D",
        fontSize: "14px",
        backgroundColor: "transparent",
        borderRadius: "4px",
        padding: "2px",
        border: "0",
        cursor: "pointer"
      }
    };
  },
  created() {
    this.getList();
    // if (localStorage.getItem("companyId") == 1) {
    //   this.region = "东营区";
    // } else if (localStorage.getItem("companyId") == 2) {
    //   this.region = "滨城区";
    // } else {
    //   this.region = "铅山县";
    // }
  },
  mounted() {
    this.$nextTick(() => {
      this.postTime();
    });
  },
  destroyed() {
    clearInterval(this.timer);
    this.timer = null;
  },
  methods: {
    postTime() {
      this.time = 15;
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        if (this.time <= 0) {
          this.getList();
          this.time = 16;
        }
        this.time--;
      }, 1000);
    },
    // 页面刷新
    handleSelect() {},
    //获取数据
    getList() {
      this.$http
        .post("rainDevice/getCriteriaQuery", {
          companyId: localStorage.getItem("companyId")
        })
        .then(res => {
          this.InfoAdree = res.data;
          if (this.InfoAdree) {
            this.InfoAdree.forEach(item => {
              item.address = item.address.split(",");
              item.gateNumber = item.gateNumber.toString();
            });
          }
          console.log(this.InfoAdree);
          this.normalList = this.InfoAdree.filter(v => {
            return (
              v.rainDeviceStatus === "正常" && v.rainWeatherStatus === "未下雨"
            );
          });
          console.log(this.normalList);
          this.rainList = this.InfoAdree.filter(item => {
            return (
              item.rainDeviceStatus == "正常" &&
              item.rainWeatherStatus == "下雨"
            );
          });
          this.faultList = this.InfoAdree.filter(item => {
            return item.rainDeviceStatus == "故障";
          });
        });
    },
    monitorDetails(item) {
      this.markerTitle = item;
      this.texterShow = true;
    }
  }
};
</script>
<style lang="less" scoped>
#map {
  width: 100%;
  height: 100%;
  position: relative;
}
#all_map {
  width: 100%;
  height: 100%;
}
.texter {
  position: absolute;
  width: 320px;
  top: 20px;
  right: 20px;
  background-color: #0d9595;
  z-index: 999;
  border-radius: 4px;
  color: #fff;
  .title {
    height: 36px;
    line-height: 36px;
    border-bottom: 1px solid #0aabab;
    padding: 0 17px 0 15px;
    text-align: left;
  }
  .texterTop {
    background-color: #0aabab;
    height: 36px;
    line-height: 36px;
    text-align: left;
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    padding: 0 17px 0 15px;
    border-radius: 4px 4px 0px 0px;
  }
}
.el-menu-item {
  height: 36px;
  line-height: 36px;
  padding: 0 15px;
}

.closeIcon {
  float: right;
  margin-top: 10px;
  cursor: pointer;
}
.status {
  position: absolute;
  z-index: 99999;
  left: 90px;
  bottom: 15px;
  width: 108px;
  height: 128px;
  background: rgba(10, 171, 171, 1);
  border: 2px solid rgba(16, 162, 162, 1);
  border-radius: 10px;
  color: #fff;
  .topText {
    height: 44px;
    line-height: 44px;
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: bold;
  }
  .listone,
  .listtown,
  .listthree {
    height: 24px;
    line-height: 24px;
    display: flex;
    justify-content: space-around;
    justify-items: center;
  }
  .blue,
  .violet,
  .red {
    display: block;
    width: 30px;
    height: 4px;
    margin-top: 8px;
  }
  .blue {
    background-color: #198aea;
  }
  .violet {
    background-color: #9e19ea;
  }
  .red {
    background-color: #ea1985;
  }
}
.timeOver {
  z-index: 9999;
  position: absolute;
  left: 15px;
  top: 15px;
  font-size: 16px;
  height: 32px;
  line-height: 32px;
}
</style>
