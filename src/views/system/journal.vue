<template>
  <!--操作日志-->
  <div id="base">
    <!-- 搜索 -->
    <div class="search">
      <div class="searchTop">
        <el-form :inline="true" :model="search">
          <el-form-item label="操作人">
            <el-input v-model="search.name" placeholder="请输入操作人"></el-input>
          </el-form-item>
          <!-- <el-form-item label="操作详情">
            <el-input v-model="search.action" placeholder="请输入操作详情"></el-input>
          </el-form-item> -->
          <!-- <el-form-item label="操作时间">
            <el-date-picker type="date" v-model="search.createTime" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item> -->
          <el-form-item>
            <el-button type="primary" @click="getAddBook">查询</el-button>
            <el-button @click="empty" type="info">清空</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 按钮 -->
      <div class="searchBot">
        <!-- <el-button
          style="width:96px"
          class="buttonBot"
          type="primary"
          @click="notice"
          >新增</el-button
        >-->
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
        <el-table-column type="index" label="序号" width="40"></el-table-column>
        <el-table-column prop="name" label="操作人"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column prop="createTime" label="操作时间"></el-table-column>
        <el-table-column prop="code" label="编号"></el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="showdetail(scope.row, scope.$index)">编辑</el-button>
            <!-- <el-button type="danger" size="small" @click="showrelease(scope.row, scope.$index)">删除</el-button> -->
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
    >
      <el-form
        ref="ruleForm"
        :model="msg"
        :rules="rules"
        label-width="auto"
        class="msg"
        hide-required-asterisk
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="msg.name" placeholder="名称"></el-input>
        </el-form-item>
        <!-- <el-form-item label="设备编号" prop="addressCode">
          <el-input v-model="msg.addressCode" placeholder="请输入设备编号"></el-input>
        </el-form-item>-->
        <el-form-item label="地址" prop="address">
          <el-input v-model="msg.address" :disabled="editDis" placeholder="地址"></el-input>
        </el-form-item>
        <!-- <el-form-item label="闸门类型" prop="type">
          <el-select v-model="msg.type" placeholder="请选择闸门类型" style="width: 100%">
            <el-option v-for="(item, i) in types" :key="i" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>-->
        <!-- <el-form-item label="上传时间" prop="reportingTime">
          <el-date-picker
            v-model="msg.reportingTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="请选择上传时间"
            style="width: 314px;"
          ></el-date-picker>
        </el-form-item>-->
        <!-- <el-form-item label="视频连接" prop="isConnected">
          <el-select v-model="msg.isConnected" placeholder="请选择视频连接" style="width: 100%">
            <el-option v-for="(item, i) in isConnecteds" :key="i" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="状态" prop="status">
          <el-input v-model="msg.status" :disabled="editDis" placeholder="请输入视频连接数"></el-input>
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
          <el-input v-model="msg.createTime" :disabled="editDis" placeholder="请输入设备所在区域"></el-input>
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="msg.code" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">取消</el-button>
        <el-button v-if="addedittitle == '组织结构-新增'" type="primary" @click="submitForm">保存</el-button>
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
      editDis: false,
      options: ["闸门名称"],
      types: ["节制闸", "橡胶坝"],
      isConnecteds: ["连接", "断开"],
      msg: {
        name: "",
        addressCode: "",
        address: "",
        type: "",
        reportingTime: "",
        isConnected: "",
        connectionNumber: "",
        location: "",
        remarks: ""
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
        remarks: [{ required: true, message: "请输入备注", trigger: "blur" }]
      },
      dialogFormVisible: false,
      // 搜索
      search: {
        name: "",
        // action: "",
        // createTime: "",
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
    this.getList();
  },
  methods: {
    //获取列表数据
    getList() {
      this.$http.post("rainCompany/getCriteriaQuery",{
        name:this.search.name,
         companyId: localStorage.getItem("companyId")
      }).then(res => {
        // for (const key in res.data) {
        //   res.data[key].num = parseInt(key) + 1;
        // }
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
          // console.log("编辑");
          // console.log(this.msg);
          let { code, name, id } = this.msg;
          this.$http
            .post("rainCompany/update", { code, name, id })
            .then(res => {
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
      this.addedittitle = "组织结构-新增";
    },
    //编辑
    showdetail(row, index) {
      this.showedit = true;
      this.editDis = true;
      this.addedittitle = "组织结构-编辑";
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
      this.search = {
        name: "",
        action: "",
        list: "",
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
</style>
