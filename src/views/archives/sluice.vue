<template>
  <!-- 雨晴月报表 -->
  <div id="base">
    <!-- 搜索 -->
    <div class="search">
      <div class="searchTop">
        <el-form :inline="true" :model="search">
          <el-form-item label="月份选择">
            <el-date-picker v-model="search.time" type="month" value-format="yyyy-MM"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getAddBook">查询</el-button>
            <el-button @click="empty" type="info">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 按钮 -->
      <div class="searchBot">
        <!-- <el-button style="width:96px" class="buttonBot" type="primary" @click="notice">新增</el-button> -->
        <!-- icon="el-icon-plus" -->
        <!-- <el-button icon="el-icon-upload2" class="buttonBotLast" @click="excellist">导出数据</el-button> -->
      </div>
    </div>
    <div id="ehart1" ref="ehart1"></div>
    <!-- 列表 -->
    <div id="table">
      <el-table
        :data="
          data.list.slice(
            (data.currpage - 1) * data.pagesize,
            data.currpage * data.pagesize
          )
        "
        border
        style="width: 100%"
        :header-cell-style="{ background: 'rgba(237, 242, 246, 1)' }"
      >
      <!-- <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="code" label="编号" width="50"></el-table-column>
        <el-table-column prop="now" label="降雨日期" width="80px"></el-table-column> -->
        <el-table-column prop="deviceName" label="测站名称" width="100px"></el-table-column>
        <el-table-column prop="1" label="01" width="52px"></el-table-column>
        <el-table-column prop="2" label="02" width="52px"></el-table-column>
        <el-table-column prop="3" label="03" width="52px"></el-table-column>
        <el-table-column prop="4" label="04" width="52px"></el-table-column>
        <el-table-column prop="5" label="05" width="52px"></el-table-column>
        <el-table-column prop="6" label="06" width="52px"></el-table-column>
        <el-table-column prop="7" label="07" width="52px"></el-table-column>
        <el-table-column prop="8" label="08" width="52px"></el-table-column>
        <el-table-column prop="9" label="09" width="52px"></el-table-column>
        <el-table-column prop="10" label="10" width="52px"></el-table-column>
        <el-table-column prop="11" label="11" width="52px"></el-table-column>
        <el-table-column prop="12" label="12" width="52px"></el-table-column>
        <el-table-column prop="13" label="13" width="52px"></el-table-column>
        <el-table-column prop="14" label="14" width="52px"></el-table-column>
        <el-table-column prop="15" label="15" width="52px"></el-table-column>
        <el-table-column prop="16" label="16" width="52px"></el-table-column>
        <el-table-column prop="17" label="17" width="52px"></el-table-column>
        <el-table-column prop="18" label="18" width="52px"></el-table-column>
        <el-table-column prop="19" label="19" width="52px"></el-table-column>
        <el-table-column prop="20" label="20" width="52px"></el-table-column>
        <el-table-column prop="21" label="21" width="52px"></el-table-column>
        <el-table-column prop="22" label="22" width="52px"></el-table-column>
        <el-table-column prop="23" label="23" width="52px"></el-table-column>
        <el-table-column prop="24" label="24" width="52px"></el-table-column>
        <el-table-column prop="25" label="25" width="52px"></el-table-column>
        <el-table-column prop="26" label="26" width="52px"></el-table-column>
        <el-table-column prop="27" label="24" width="52px"></el-table-column>
        <el-table-column prop="28" label="28" width="52px"></el-table-column>
        <el-table-column prop="29" label="29" width="52px"></el-table-column>
        <el-table-column prop="30" label="30" width="52px"></el-table-column>
        <el-table-column prop="total" label="合计"></el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        :current-page="data.currpage"
        :page-size="data.pagesize"
        :page-sizes="[5, 10, 15, 20]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="data.list.length"
        @prev-click="nextpage"
        @next-click="nextpage"
        @current-change="nextpage"
        @size-change="sizeChange"
      ></el-pagination>
    </div>

    <!-- 新增/编辑 -->
    <el-dialog
      :title="addedittitle"
      width="450px"
      :visible.sync="showedit"
      @close="resetForm('ruleForm')"
    >
      <markerPoint :region="region" @searchMarker="searchMarker" ref="child"></markerPoint>
      <el-form
        ref="ruleForm"
        :model="msg"
        :rules="rules"
        label-width="auto"
        class="msg"
        hide-required-asterisk
      >
        <el-form-item label="橡胶坝/节制闸名称" prop="name">
          <el-input maxlength="20" v-model="msg.name" placeholder="请输入橡胶坝/节制闸名称"></el-input>
        </el-form-item>
        <el-form-item label="设备编号" prop="addressCode">
          <el-input maxlength="20" v-model="msg.addressCode" placeholder="请输入设备编号"></el-input>
        </el-form-item>
        <el-form-item label="大坝位置" prop="address">
          <el-input
            maxlength="20"
            v-model="msg.address"
            placeholder="请输入大坝位置"
            @focus="getMarkerPint"
          ></el-input>
        </el-form-item>
        <el-form-item label="闸门数量" prop="gateNumber">
          <el-input maxlength="20" v-model="msg.gateNumber" type="number" placeholder="请输入闸门数量"></el-input>
        </el-form-item>
        <el-form-item label="闸门类型" prop="type">
          <el-select v-model="msg.type" placeholder="请选择闸门类型" style="width: 100%">
            <el-option v-for="(item, i) in types" :key="i" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="最后上传时间" prop="reportingTime">
          <el-date-picker
            v-model="msg.reportingTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="请选择上传时间"
            style="width: 280px;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="视频网络" prop="isConnected">
          <el-select v-model="msg.isConnected" placeholder="请选择视频连接" style="width: 100%">
            <el-option
              v-for="(item, i) in isConnecteds"
              :key="i"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="视频连接数" prop="connectionNumber">
          <el-input
            maxlength="20"
            v-model="msg.connectionNumber"
            type="number"
            placeholder="请输入视频连接数"
          ></el-input>
        </el-form-item>
        <el-form-item label="设备所在区域" prop="location">
          <el-input maxlength="20" v-model="msg.location" placeholder="请输入设备所在区域"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input maxlength="20" v-model="msg.remarks" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">取消</el-button>
        <el-button v-if="addedittitle == '设备档案-新增'" type="primary" @click="submitForm">保存</el-button>
        <el-button v-else type="primary" @click="editForm">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getTime } from "../../utils/myMethod";
import markerPoint from "../../components/makerPoint/makerPoint.vue";
export default {
  components: {
    markerPoint
  },
  data() {
    return {
      region: "",
      addedittitle: null,
      showedit: false,
      options: [],
      types: ["节制闸", "橡胶坝"],
      isConnecteds: [
        { name: "连接", value: "1" },
        { name: "断开", value: "0" }
      ],
      msg: {
        name: "",
        addressCode: "",
        address: "",
        type: "",
        reportingTime: "",
        isConnected: "",
        connectionNumber: "",
        location: "",
        remarks: "",
        gateNumber: 1
      },
      // 新建通知非空验证
      rules: {
        name: [{ required: true, message: "请输入大坝名称", trigger: "blur" }],
        addressCode: [
          { required: true, message: "请输入设备编号", trigger: "blur" }
        ],
        address: [
          { required: true, message: "请输入大坝位置", trigger: "blur" }
        ],
        type: [{ required: true, message: "请选择闸门类型", trigger: "blur" }],
        reportingTime: [
          { required: true, message: "请选择设备上传时间", trigger: "blur" }
        ],
        isConnected: [
          { required: true, message: "请选择视频连接状态", trigger: "blur" }
        ],
        connectionNumber: [
          { required: true, message: "请输入视频连接数", trigger: "blur" }
        ],
        location: [
          { required: true, message: "请输入设备所处区域", trigger: "blur" }
        ],
        remarks: [{ required: true, message: "请输入备注", trigger: "blur" }],
        gateNumber: [
          { required: true, message: "请输入闸门数量", trigger: "blur" }
        ]
      },
      dialogFormVisible: false,
      // 搜索
      search: {
        time: ""
      },
      // 列表数据
      data: {
        pagesize: 6,
        currpage: 1,
        list: []
      }
    };
  },
  created() {
    const time = new Date();
    this.search.time = getTime(time);
    this.getList();
  },
  mounted() {
    this.getEchart1();
  },
  methods: {
    getEchart1() {
      let myChart = this.$Echarts.init(document.getElementById("ehart1"));
      // 指定图表的配置项和数据
      let option = {
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            //坐标轴竖着显示
            axisLabel: {
              interval: 0,
              formatter: function(value) {
                return value.split(" ");
              }
            },
            data: [
              "01",
              "02",
              "03",
              "04",
              "05",
              "06",
              "07",
              "08",
              "09",
              "10",
              "11",
              "12",
              "13",
              "14",
              "15",
              "16",
              "17",
              "18",
              "19",
              "20",
              "21",
              "22",
              "23",
              "24",
              "25",
              "26",
              "27",
              "28",
              "29",
              "30"
            ],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            max: 120, //设置最大值
            min: 0, //最小值
            splitNumber: 4 //几条刻度线
          }
        ],
        series: [
          {
            name: "降雨量",
            type: "bar",
            barWidth: "30%",
            data: [
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0
            ],
            itemStyle: {
              normal: {
                label: {
                  show: true, //开启显示
                  position: "top", //在上方显示
                  textStyle: {
                    //数值样式
                    color: "blue",
                    fontSize: 14
                  }
                }
              }
            }
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    //获取坐标
    searchMarker(point) {
      console.log(point);
      this.msg.address = point;
    },
    //获取地址坐标
    getMarkerPint() {
      this.$refs.child.callMethod();
    },
    //获取列表数据
    getList() {
      this.$http
        .post("rainMonthData/getAllMonthData", { companyId: localStorage.getItem("companyId") })
        .then(res => {
          console.log(res);
          this.data.list = res.data;
        });
    },
    //取消
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.showedit = false;
      this.msg = {};
    },
    //提交
    submitForm() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          console.log("新增");
          this.$http.post("device/add", this.msg).then(res => {
            if (res.code == 1) {
              this.showedit = false;
              this.getList();
              this.$message({
                type: "success",
                showClose: true,
                message: "新增成功",
                offset: 155
              });
            } else {
              this.$message({
                type: "warning",
                showClose: true,
                message: "新增失败",
                offset: 155
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    editForm() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.$http.post("device/update", this.msg).then(res => {
            if (res.code == 1) {
              this.showedit = false;
              this.getList();
              this.$message({
                type: "success",
                showClose: true,
                message: "编辑成功",
                offset: 155
              });
            } else {
              this.$message({
                type: "warning",
                showClose: true,
                message: "编辑失败",
                offset: 155
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    //新增
    notice() {
      this.showedit = true;
      this.addedittitle = "设备档案-新增";
    },
    //编辑
    showdetail(row, index) {
      this.showedit = true;
      this.addedittitle = "设备档案-编辑";
      this.msg = JSON.parse(JSON.stringify(row));
    },
    //删除
    showrelease(row, index) {
      this.$confirm("此操作将删除此数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http.post("device/delete", { id: row.id }).then(res => {
            // console.log(res);
            this.getList();
            this.$message({
              type: "success",
              message: res.message,
              offset: 155
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //查询
    getAddBook() {
      this.getList();
    },
    //清空
    empty() {
      this.search = {
        name: "",
        type: ""
      };
      this.getList();
    },
    // 翻页
    nextpage(value) {
      this.data.currpage = value;
    },
    // 显示条数切换
    sizeChange(total) {
      this.data.pagesize = total;
    }
  }
};
</script>

<style lang="less" scoped>
.search {
  // overflow: hidden;
  display: flex;
  justify-content: space-between;
}
.table {
  width: 1128px;
  height: 465px;
  margin-top: 16px;
}
.table {
  width: 100%;
}

.tableButton3 {
  color: #fff;
  background-color: #f56c6c;
  border-radius: 3px;
}
.textmsg {
  color: red;
}
.textcc {
  color: #000;
}
.paginationList {
  text-align: center;
  margin-top: 32px;
  padding: 0;
}
.table {
  width: 1128px;
  height: 465px;
  margin-top: 16px;
}
.dialogText {
  .el-input {
    width: 240px;
    height: 32px;
  }
  .selectTop {
    width: 240px;
    height: 32px;
  }
  .selectBot {
    width: 240px;
    height: 32px;
  }
}
.formButon {
  width: 127px;
  height: 40px;
  text-align: center;
}

.pagination {
  text-align: center;
  margin-right: 25px;
  padding-top: 20px;
}
.green {
  color: green;
}
.red {
  color: red;
}
#ehart1 {
  width: 886px;
  height: 252px;
}
.el-table thead.is-group th {
  background: #fff;
}

.el-table thead.is-group tr:first-of-type th:first-of-type:before {
  content: "日期";
  text-align: center;
  position: absolute;
  width: 152px;
  height: 1px;
  bottom: 30px;
  right: 0;
}

.el-table thead.is-group tr:first-of-type th:first-of-type:after {
  content: "配送新增";
  text-align: center;
  position: absolute;
  width: 152px;
  top: 10px;
  left: 0;
}

.el-table thead.is-group tr:first-of-type th:first-of-type .cell {
  position: absolute;
  top: 0;
  left: 0;
  width: 152px;
  height: 1px;
  background-color: #ebeef5;
  display: block;
  text-align: center;
  transform: rotate(38deg);
  transform-origin: top left;
  -ms-transform: rotate(38deg);
  -ms-transform-origin: top left;
  -webkit-transform: rotate(38deg);
  -webkit-transform-origin: top left;
}
</style>