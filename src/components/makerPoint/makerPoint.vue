<template>
  <div id="marker">
    <el-dialog
      width="780px"
      title="设备位置"
      :visible.sync="innerVisible"
      append-to-body
      @closed="closed"
    >
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="请选择地理位置">
          <el-cascader
            size="large"
            :options="options"
            v-model="formInline.selectedOptions"
            @change="addressChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="请输入详细地址">
          <el-input v-model="formInline.address"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
      <div id="all_map"></div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addMarker">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { regionData, CodeToText } from "element-china-area-data";
export default {
  props: ["region"],
  data() {
    return {
      options: regionData,
      innerVisible: false,
      point: "",
      formInline: {
        selectedOptions: [],
        address: ""
      },
      search: null,
      Map: null
    };
  },

  methods: {
    addressChange(arr) {
      this.search = `${CodeToText[arr[0]]}${CodeToText[arr[1]]}${
        CodeToText[arr[2]]
      }`;
      console.log(this.search);
    },
    onSubmit() {
      let city = `${this.search}${this.formInline.address}`;
      this.Map.centerAndZoom(city, 15);
    },
    //父级的点击时间
    callMethod() {
      this.innerVisible = !this.innerVisible;
      setTimeout(() => {
        this.creatMap();
      }, 1000);
    },
    //创建地图
    creatMap() {
      var city = this.region;
      var map = new BMap.Map("all_map");
      map.centerAndZoom(city, 13);
      map.enableScrollWheelZoom(true);
      this.Map = map;
      map.addEventListener("click", function(e) {
        // console.log(e);
        if (localStorage.getItem("point")) {
          localStorage.removeItem("point");
        }
        var allOverlay = map.getOverlays(); //获取所有覆盖物
        // console.log(allOverlay);
        if (allOverlay) {
          //循坏所有覆盖物点
          for (var i = 0; i < allOverlay.length; i++) {
            // console.log(allOverlay[i].imei);
            if (allOverlay[i].imei) {
              map.removeOverlay(allOverlay[i]); //清除指定的覆盖物
            }
          }
        }
        this.point = e.point.lng + "," + e.point.lat;
        // console.log(this.point);
        localStorage.setItem("point", this.point);
        var pt = new BMap.Point(e.point.lng, e.point.lat);
        let marker = new BMap.Marker(pt);
        marker.imei = pt; //给覆盖物加上标识好对其清除
        if (pt.type !== null) {
          marker.imei = pt;
        } else {
          pt.type = true;
        }
        map.addOverlay(marker);
      });
    },
    addMarker() {
      this.$emit("searchMarker", localStorage.getItem("point"));
      this.innerVisible = !this.innerVisible;
    },
    closed() {
      if (localStorage.getItem("point")) {
        localStorage.removeItem("point");
      }
      this.innerVisible = false;
    }
  }
};
</script>

<style lang="less" scoped>
#all_map {
  width: 100%;
  height: 400px;
}
.el-button {
  text-align: right;
}
</style>
