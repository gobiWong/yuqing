<template>
  <!-- 设备档案 -->
  <div id="base">
    <!-- 搜索 -->
    <div class="search">
      <div class="searchTop">
        <el-form :inline="true" :model="search">
          <el-form-item label="编号">
            <el-input v-model="search.addressCode" placeholder="请输入设备编号"></el-input>
          </el-form-item>
          <el-form-item label="名称">
            <el-input v-model="search.name" placeholder="请输入设备名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getAddBook">查询</el-button>
            <el-button @click="empty" type="info">清空</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 按钮 -->
      <div class="searchBot">
        <el-button style="width:96px" class="buttonBot" type="primary" @click="notice">新增</el-button>
        <!-- icon="el-icon-plus" -->
        <!-- <el-button icon="el-icon-upload2" class="buttonBotLast" @click="excellist">导出数据</el-button> -->
      </div>
    </div>

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
        <el-table-column type="index" label="序号" width="50">
        </el-table-column>
        <el-table-column prop="addressCode" label="设备编号" width="100"></el-table-column>
        <el-table-column prop="name" label="设备名称"></el-table-column>
          <el-table-column prop="remarks" label="备注"></el-table-column>
        <!-- <el-table-column prop="deviceId" label="设备卡号"></el-table-column> -->
        <el-table-column prop="rainWeatherStatus" label="雨晴状态">
          <!-- <template slot-scope="scope">
            <span :class="scope.row.type == 0?'green':'red'">{{scope.row.type == 0?'下雨':'晴天'}}</span>
          </template> -->
        </el-table-column>
        <el-table-column label="运行状态">
          <template slot-scope="scope">
            <span :class="scope.row.rainDeviceStatus === '正常'?'green':'red'">{{scope.row.rainDeviceStatus === '正常'?'正常':'故障'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="reportingTime" label="最后回传时间"></el-table-column>
        <el-table-column label="设备状态">
          <!-- <template slot-scope="scope">
            <span
              :class="scope.row.isConnected == 1?'green':'red'"
            >{{scope.row.isConnected == 1?'启用':'停用'}}</span>
          </template> -->
          <template slot-scope="scope">
            <span :class="scope.row.rainDeviceStatus === '正常'?'green':'red'">{{scope.row.rainDeviceStatus === '正常'?'启用':'禁用'}}</span>
          </template>
        </el-table-column>
      
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="showdetail(scope.row, scope.$index)">编辑</el-button>
            <el-button type="danger" size="small" @click="showrelease(scope.row, scope.$index)">删除</el-button>
          </template>
        </el-table-column>
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
      center
    >
      <markerPoint :region="region" @searchMarker="searchMarker" ref="child"></markerPoint>
      <el-form
        ref="ruleForm"
        :model="msg"
        :rules="rules"
        label-width="auto"
        class="msg"
        label-position="right"
        hide-required-asterisk
      >
        <el-form-item label="设备编号" prop="addressCode">
          <el-input v-model="msg.addressCode" :disabled="editDis" placeholder="请输入设备编号"></el-input>
        </el-form-item>
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="msg.name" placeholder="请输入设备名称"></el-input>
        </el-form-item>
        <el-form-item label="设备卡号" prop="deviceId">
          <el-input v-model="msg.deviceId" :disabled="editDis" placeholder="请输入设备卡号"></el-input>
        </el-form-item>
        <el-form-item label="设备位置" prop="address">
          <el-input
            maxlength="20"
            v-model="msg.address"
            placeholder="请输入大坝位置"
            @focus="getMarkerPint"
          ></el-input>
        </el-form-item>
        <el-form-item label="设备状态" prop="rainDeviceStatus">
          <el-select
            v-model="msg.gateNumber"
            :disabled="editDis"
            placeholder="请选择设备状态"
            style="width:332px"
          >
            <el-option
              v-for="item in status"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="序号？" prop="num">
          <el-input maxlength="20" v-model="msg.num" type="number" placeholder="请输入序号"></el-input>
        </el-form-item>-->
        <el-form-item label="备注" style>
          <el-input
            maxlength="20"
            type="textarea"
            :rows="2"
            v-model="msg.remarks"
            placeholder="请输入备注"
          ></el-input>
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
import markerPoint from "../../components/makerPoint/makerPoint.vue";
export default {
  components: {
    markerPoint
  },
  data() {
    return {
      region: null,
      addedittitle: null,
      showedit: false,
      editDis: false,
      status: [
        { label: "启用", value: "1" },
        { label: "禁用", value: "0" }
      ],
      msg: {
        name: "", //设备名称
        addressCode: "", //	设备地址码
        address: "", //坐标
        location: "", //	所在的行政单位
        rainDeviceStatus: "", //设备状态
        deviceId: "" //用作设备卡号
      },
      // 新建通知非空验证
      rules: {
        name: [{ required: true, message: "请输入设备名称", trigger: "blur" }],
        addressCode: [
          { required: true, message: "请输入设备编号", trigger: "blur" }
        ],
        address: [
          { required: true, message: "请输入设备位置坐标", trigger: "blur" }
        ],
        remarks: [{ required: true, message: "请输入备注", trigger: "blur" }],
        num: [{ required: true, message: "请输入序号", trigger: "blur" }],
        gateNumber: [
          { required: true, message: "请输入闸门数量", trigger: "blur" }
        ]
      },
      // 搜索
      search: {
        addressCode: "",
        name: ""
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
    this.getList();
    if (localStorage.getItem("companyId") == 1) {
      this.region = "东营市";
    } else if (localStorage.getItem("companyId") == 2) {
      this.region = "滨州市";
    } else {
      this.region = "上绕市";
    }
  },
  methods: {
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
        .post("rainDevice/getCriteriaQuery", {
          ...this.search,
          companyId: localStorage.getItem("companyId")
        })
        .then(res => {
          console.log(res);
          this.data.list = res.data;
        });
    },
    //取消
    resetForm(formName) {
      if (localStorage.getItem("point")) {
        localStorage.removeItem("point");
      }
      this.$refs[formName].resetFields();
      this.showedit = false;
      this.msg = {};
    },
    //提交
    submitForm() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          console.log("新增");
          this.$http
            .post("rainDevice/add", {
              ...this.msg,
              companyId: localStorage.getItem("companyId")
            })
            .then(res => {
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
          let { address, remarks, name, id } = this.msg;
          this.$http
            .post("rainDevice/update", {
              address,
              remarks,
              name,
              id
            })
            .then(res => {
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
      this.editDis = false;
      this.addedittitle = "设备档案-新增";
    },
    //编辑
    showdetail(row, index) {
      this.showedit = true;
      this.editDis = true;
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
          this.$http.post("rainDevice/delete", { id: row.id }).then(res => {
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
.dialog-footer {
  justify-content: center;
}
</style>
