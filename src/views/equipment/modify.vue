<template>
  <!-- 数据修改 -->
  <div id="modify">
    <!-- 搜索 -->
    <div class="search">
      <div class="searchTop">
        <el-form :inline="true" :model="search">
          <el-form-item label="日期选择">
            <el-date-picker
              v-model="search.time"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <!-- <el-form-item label="测站名称">
            <el-input v-model="search.name" placeholder="请输入测站名称"></el-input>
          </el-form-item>-->
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
        @row-click="rowClick"
      >
        <el-table-column type="index" label="序号" width="40"></el-table-column>
        <el-table-column prop="now" label="降雨日期">
          <!-- {{dataNow}} -->
          <!-- <template>
            <el-date-picker
              v-model="search.time"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </template>-->
        </el-table-column>
        <el-table-column prop="deviceName" label="测站名称" width="100px"></el-table-column>
        <el-table-column label="0时" width="52px" prop="0">
          <!-- <template slot-scope="scope">
            <div @click="modifyData(scope.row.channelNumber,scope.row)">{{scope.row.channelNumber}}</div>
          </template>-->
        </el-table-column>
        <el-table-column prop="1" label="1时" width="52px"></el-table-column>
        <el-table-column prop="2" label="2时" width="52px"></el-table-column>
        <el-table-column prop="3" label="3时" width="52px"></el-table-column>
        <el-table-column prop="4" label="4时" width="52px"></el-table-column>
        <el-table-column prop="5" label="5时" width="52px"></el-table-column>
        <el-table-column prop="6" label="6时" width="52px"></el-table-column>
        <el-table-column prop="7" label="7时" width="52px"></el-table-column>
        <el-table-column prop="8" label="8时" width="52px"></el-table-column>
        <el-table-column prop="9" label="9时" width="52px"></el-table-column>
        <el-table-column prop="10" label="10时" width="52px"></el-table-column>
        <el-table-column prop="11" label="11时" width="52px"></el-table-column>
        <el-table-column prop="12" label="12时" width="52px"></el-table-column>
        <el-table-column prop="13" label="13时" width="52px"></el-table-column>
        <el-table-column prop="14" label="14时" width="52px"></el-table-column>
        <el-table-column prop="15" label="15时" width="52px"></el-table-column>
        <el-table-column prop="16" label="16时" width="52px"></el-table-column>
        <el-table-column prop="17" label="17时" width="52px"></el-table-column>
        <el-table-column prop="18" label="18时" width="52px"></el-table-column>
        <el-table-column prop="19" label="19时" width="52px"></el-table-column>
        <el-table-column prop="20" label="20时" width="52px"></el-table-column>
        <el-table-column prop="21" label="21时" width="52px"></el-table-column>
        <el-table-column prop="22" label="22时" width="52px"></el-table-column>
        <el-table-column prop="23" label="23时" width="52px"></el-table-column>
        <el-table-column prop="dayTotal" label="降雨量" width="52px"></el-table-column>
        <!-- <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="showdetail(scope.row, scope.$index)">编辑</el-button>
            <el-button type="danger" size="small" @click="showrelease(scope.row, scope.$index)">删除</el-button>
          </template>
        </el-table-column>-->
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

    <!-- 修改数据 -->
    <el-dialog
      :title="addedittitle"
      width="450px"
      :visible.sync="showedit"
      @close="resetForm('ruleForm')"
      center
    >
      <el-form
        ref="ruleForm"
        :model="msg"
        :rules="rules"
        label-width="auto"
        class="msg"
        hide-required-asterisk
      >
        <el-form-item label="编号" prop="code">
          <el-input v-model="msg.code" disabled maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="日期" prop="createDate">
          <!-- <el-input v-model="msg.createDate" disabled maxlength="20"></el-input> -->
          <!-- <el-input v-model="msg.createDate" maxlength="20"></el-input> -->
          <el-date-picker
            v-model="msg.createDate"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="时间" prop="rainHour">
          <el-select v-model="msg.rainHour" placeholder="请选择" clearable>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <!-- <el-input v-model="msg.rainHour" maxlength="20"></el-input> -->
        </el-form-item>
        <el-form-item label="降雨量" prop="rainCount">
          <el-input v-model="msg.rainCount"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getTime } from "../../utils/myMethod";
export default {
  data() {
    return {
      addedittitle: null,
      // dataNow: "",
      showedit: false,
      options: [
        {
          value: "0",
          label: "0时"
        },
        {
          value: "1",
          label: "1时"
        },
        {
          value: "2",
          label: "2时"
        },
        {
          value: "3",
          label: "4时"
        },
        {
          value: "4",
          label: "4时"
        },
        {
          value: "5",
          label: "5时"
        },
        {
          value: "6",
          label: "6时"
        },
        {
          value: "7",
          label: "7时"
        },
        {
          value: "8",
          label: "8时"
        },
        {
          value: "9",
          label: "9时"
        },
        {
          value: "10",
          label: "10时"
        },
        {
          value: "11",
          label: "11时"
        },
        {
          value: "12",
          label: "12时"
        },
        {
          value: "13",
          label: "13时"
        },
        {
          value: "14",
          label: "14时"
        },
        {
          value: "15",
          label: "15时"
        },
        {
          value: "16",
          label: "16时"
        },
        {
          value: "17",
          label: "17时"
        },
        {
          value: "18",
          label: "18时"
        },
        {
          value: "19",
          label: "19时"
        },
        {
          value: "20",
          label: "20时"
        },
        {
          value: "21",
          label: "21时"
        },
        {
          value: "22",
          label: "22时"
        },
        {
          value: "23",
          label: "23时"
        }
      ],
      types: ["节制闸", "橡胶坝"],
      isConnecteds: ["连接", "断开"],
      msg: {
        code: "",
        createDate: this.dataNow,
        rainCount: "",
        rainHour: ""
      },
      // 新建通知非空验证
      rules: {
        code: [{ required: true, message: "请输入编号", trigger: "blur" }],
        createDate: [
          { required: true, message: "请输入日期", trigger: "blur" }
        ],
        rainCount: [
          { required: true, message: "请输入降雨量", trigger: "blur" },
          {
            required: true,
            pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
            message: "请输入正确的降雨量",
            trigger: "blur"
          }
        ],
        rainHour: [{ required: true, message: "请选择时间", trigger: "blur" }]
      },
      // 搜索
      search: {
        time: "",
        name: "",
        companyId: localStorage.getItem("companyId")
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
    const time = new Date();
    this.search.time = getTime(time);
    this.getList();
  },
  computed: {
    dataNow: function() {
      let time = new Date();
      let month = time.getMonth() + 1;
      let date = time.getDate();
      let str =
        time.getFullYear() +
        "-" +
        (month < 10 ? "0" + month : month) +
        "-" +
        (date < 10 ? "0" + date : date);

      return str;
    }
  },
  methods: {
    //修改数据
    rowClick(row, column, event) {
      this.addedittitle = "数据修改";
      this.showedit = true;
      // this.msg.createDate = row.createDate;
      this.msg.code = row.code;
      // this.msg.rainHour = column.label.slice(0,2);
      // this.msg.rainCount = row[column.property];
      console.log(row);
    },
    // 模糊搜索名字
    querySearch(queryString, cb) {
      var restaurants = this.options;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    //获取列表数据
    getList() {
      this.$http.post("rainDayData/getAllDayData", this.search).then(res => {
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
          this.$http
            .post("rainDayData/update", {
              ...this.msg,
              rainCount: Number(this.msg.rainCount),
              companyId: localStorage.getItem("companyId")
            })
            .then(res => {
              if (res.code == 1) {
                this.$message({
                  type: "success",
                  showClose: true,
                  message: "修改成功",
                  offset: 155
                });
                this.showedit = false;
                this.getList();
              } else {
                this.$message({
                  type: "warning",
                  showClose: true,
                  message: "修改失败",
                  offset: 155
                });
              }
            });
        } else {
          return false;
        }
      });
    },
    //查询
    getAddBook() {
      this.getList();
    },
    //清空
    empty() {
      this.search = {
        damName: "",
        addressCode: "",
        gateName: "",
        companyId: localStorage.getItem("companyId")
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
</style>
