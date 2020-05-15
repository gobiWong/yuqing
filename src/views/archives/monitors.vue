<template>
  <!--雨晴年报表-->
  <div id="base">
    <!-- 搜索 -->
    <div class="search">
      <div class="searchTop">
        <el-form :inline="true" :model="search">
          <el-form-item label="年份查询">
            <el-date-picker v-model="search.time" type="year" value-format="yyyy"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getAddBook">查询</el-button>
            <el-button @click="empty" type="info">清空</el-button>
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
       <el-table-column prop="code" label="编号" width="80px"></el-table-column>
        <el-table-column prop="now" label="降雨日期" width="80px"></el-table-column> -->
        <el-table-column prop="deviceName" label="设备名称" width="80px"></el-table-column>
        <el-table-column prop="1" label="1月" width="60px"></el-table-column>
        <el-table-column prop="2" label="2月" width="60px"></el-table-column>
        <el-table-column prop="3" label="3月" width="60px"></el-table-column>
        <el-table-column prop="4" label="4月" width="60px"></el-table-column>
        <el-table-column prop="5" label="5月" width="60px"></el-table-column>
        <el-table-column prop="6" label="6月" width="60px"></el-table-column>
        <el-table-column prop="7" label="7月" width="60px"></el-table-column>
        <el-table-column prop="8" label="8月" width="60px"></el-table-column>
        <el-table-column prop="9" label="9月" width="60px"></el-table-column>
        <el-table-column prop="10" label="10月" width="60px"></el-table-column>
        <el-table-column prop="11" label="11月" width=""></el-table-column>
        <el-table-column prop="12" label="12月" width=""></el-table-column>
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
      <el-form
        ref="ruleForm"
        :model="msg"
        :rules="rules"
        label-width="auto"
        class="msg"
        hide-required-asterisk
      >
        <el-form-item label="设备名称" prop="damName">
          <el-input v-model="msg.damName" placeholder="请输入设备名称"></el-input>
        </el-form-item>
        <el-form-item label="设备地址码" prop="addressCode">
          <el-input v-model="msg.addressCode" placeholder="请输入设备地址码"></el-input>
        </el-form-item>
        <el-form-item label="闸门名称" prop="gateName">
          <el-input v-model="msg.gateName" placeholder="请输入闸门名称"></el-input>
        </el-form-item>
        <el-form-item label="闸门编号" prop="gateNumber">
          <el-input v-model="msg.gateNumber" placeholder="请输入闸门编号"></el-input>
        </el-form-item>
        <el-form-item label="闸门视频源地址" prop="gateAddress">
          <el-input v-model="msg.gateAddress" placeholder="请输入闸门视频源地址"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">取消</el-button>
        <el-button v-if="addedittitle == '监控档案-新增'" type="primary" @click="submitForm">保存</el-button>
        <el-button v-else type="primary" @click="editForm">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addedittitle: null,
      showedit: false,
      options: [],
      types: ["节制闸", "橡胶坝"],
      isConnecteds: ["连接", "断开"],
      msg: {
        damName: "",
        addressCode: "",
        gateName: "",
        gateNumber: "",
        gateAddress: ""
      },
      // 新建通知非空验证
      rules: {
        damName: [
          { required: true, message: "请输入大坝名称", trigger: "blur" }
        ],
        addressCode: [
          { required: true, message: "请输入大坝地址码", trigger: "blur" }
        ],
        gateName: [
          { required: true, message: "请输入闸门名称", trigger: "blur" }
        ],
        gateNumber: [
          { required: true, message: "请选择闸门编号", trigger: "blur" }
        ],
        gateAddress: [
          { required: true, message: "请输入闸门视频源地址", trigger: "blur" }
        ]
      },
      dialogFormVisible: false,
      // 搜索
      search: {
        title: ""
      },
      // 列表数据
      data: {
        pagesize: 10,
        currpage: 1,
        list: []
      }
    };
  },
  created() {
    this.getNameList();
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
              "12"
            ],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            max: 300, //设置最大值
            min: 0, //最小值
            splitNumber: 6 //几条刻度线
          }
        ],
        series: [
          {
            name: "降雨量",
            type: "bar",
            barWidth: "30%",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
    //获取下拉框接口
    getNameList() {
      // this.$http
      //   .post("device/getAllDeviceName", {
      //     companyId: localStorage.getItem("companyId")
      //   })
      //   .then(res => {
      //     this.options = res.data;
      //   });
    },
    //获取列表数据
    getList() {
      this.$http
        .post("rainYearData/getAllYearData", {
          companyId: localStorage.getItem("companyId")
        })
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
          this.$http.post("video/add", this.msg).then(res => {
            if (res.code == 1) {
              this.$message({
                type: "success",
                showClose: true,
                message: "新增成功",
                offset: 155
              });
              this.showedit = false;
              this.getList();
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
          console.log("编辑");
          console.log(this.msg);
          this.$http.post("video/update", this.msg).then(res => {
            if (res.code == 1) {
              this.$message({
                type: "success",
                showClose: true,
                message: "编辑成功",
                offset: 155
              });
              this.showedit = false;
              this.getList();
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
      this.addedittitle = "监控档案-新增";
    },
    //编辑
    showdetail(row, index) {
      this.showedit = true;
      this.addedittitle = "监控档案-编辑";
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
          this.$http.post("video/delete", { id: row.id }).then(res => {
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
      (this.search.title = ""), this.getList();
    },
    // 翻页
    nextpage(value) {
      this.data.currpage = value;
    },
    // 显示条数切换
    sizeChange(total) {
      this.data.pagesize = total;
    }
    // 导出
    // excellist() {}
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
</style>
