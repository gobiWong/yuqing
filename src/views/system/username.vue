<template>
  <!--用户管理-->
  <div id="base">
    <!-- 搜索 -->
    <div class="search">
      <div class="searchTop">
        <el-form :inline="true" :model="search">
          <el-form-item label="用户名">
            <!-- <el-select v-model="search.title" placeholder="请选择" clearable>
              <el-option v-for="item in options" :key="item" :label="item" :value="item"></el-option>
            </el-select>-->
            <el-input v-model="search.name" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getAddBook">搜索</el-button>
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
        <el-table-column label="序号" type="index" width="40"></el-table-column>
        <el-table-column prop="name" label="用户名" width="150"></el-table-column>
        <!-- <el-table-column prop="damName" label="角色名"></el-table-column> -->
        <el-table-column prop="gender" label="性别"></el-table-column>
        <!-- <el-table-column prop="gateAddress" label="部门"></el-table-column> -->
        <el-table-column prop="tel" label="电话"></el-table-column>
        <!-- <el-table-column prop="phone" label="手机号"></el-table-column> -->
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column label="用户状态">
          <template slot-scope="scope">
            <el-switch
              @change="updateStatus(scope.row, scope.$index)"
              active-value="1"
              inactive-value="0"
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
            <!-- <el-button type="primary" size="small" @click="showdetail(scope.row, scope.$index)">编辑</el-button>
            <el-button type="danger" size="small" @click="showrelease(scope.row, scope.$index)">删除</el-button>-->
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="showdetail(scope.row, scope.$index)">编辑</el-button>
            <el-button type="success" size="small" @click="showPeizhi(scope.row, scope.$index)">分配角色</el-button>
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
    >
      <el-form
        ref="ruleForm"
        :model="msg"
        :rules="rules"
        label-width="auto"
        class="msg"
        hide-required-asterisk
      >
        <el-form-item label="用户" prop="name">
          <el-input v-model="msg.name" placeholder="请输入账户" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="msg.gender" placeholder="请选择" style="width: 100%">
            <el-option v-for="(item, i) in isConnecteds" :key="i" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户电话" prop="tel">
          <el-input v-model="msg.tel" placeholder="用户电话" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="msg.email" placeholder="用户邮箱"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">取消</el-button>
        <el-button v-if="addedittitle == '用户管理-新增'" type="primary" @click="submitForm">保存</el-button>
        <el-button v-else type="primary" @click="editForm">保存</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog
      title="分配角色"
      width="450px"
      :visible.sync="showRole"
      @close="resetForm('ruleFormRole')"
    >
      <el-form
        ref="ruleFormRole"
        :model="roleOptions"
        label-width="auto"
        class="msg"
        hide-required-asterisk
      >
        <el-form-item label="用户名" prop="name">
          <el-input v-model="roleOptions.name" placeholder="请输入账户" disabled maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="roleOptions.role" placeholder="请选择" style="width: 100%">
            <el-option v-for="(item, i) in types" :key="i" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleFormRole')">取消</el-button>
        <el-button type="primary" @click="editRole">保存</el-button>
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
      showRole: false,
      options: ["闸门名称"],
      roleOptions: {
        name: "",
        role: ""
      },
      types: ["超级管理员", "管理员", "普通用户", "测试角色1", "测试角色2"],
      isConnecteds: ["男", "女"],
      msg: {
        name: "",
        email: "",
        gender: "",
        tel: ""
      },
      // 新建通知非空验证
      rules: {
        name: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          {
            pattern: 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/,
            required: true,
            message: "请填写正确的手机号",
            trigger: "blur"
          }
        ],
        email: [
          { required: true, message: "请输入用户邮箱", trigger: "blur" },
          {
            pattern: /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/, //通用邮箱正则表达式
            required: true,
            message: "请填写正确的邮箱地址",
            trigger: "blur"
          }
        ],
        gender: [{ required: true, message: "请选择用户性别", trigger: "blur" }],
        tel: [
          { required: true, message: "请输入用户电话", trigger: "blur" },
          {
            pattern: 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/,
            required: true,
            message: "请填写正确的手机号",
            trigger: "blur"
          }
        ]
      },
      dialogFormVisible: false,
      // 搜索
      search: {
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
  },
  methods: {
    //获取列表数据
    getList() {
      this.$http
        .post("user/getCriteriaQuery", {
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
      this.$refs[formName].resetFields();
      this.showedit = false;
      this.showRole = false;
      this.msg = {};
    },
    //提交
    submitForm() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          console.log("新增");
          this.$http
            .post("user/add", {
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
          let { id, tel, gender, email, name } = this.msg;
          this.$http
            .post("user/update", { id, tel, gender, email, name })
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
      this.addedittitle = "用户管理-新增";
    },
    //编辑
    showdetail(row, index) {
      this.showedit = true;
      this.addedittitle = "用户管理-编辑";
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
          this.$http.post("user/delete", { id: row.id }).then(res => {
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
      (this.search.name = ""), this.getList();
    },
    // 分配角色
    showPeizhi(row, index) {
      this.roleOptions.name = row.name;
      this.showRole = true;
    },
    // 确定分配角色
    editRole() {
      console.log(this.roleOptions);
    },
    // 翻页
    nextpage(value) {
      this.data.currpage = value;
    },
    // 显示条数切换
    sizeChange(total) {
      this.data.pagesize = total;
    },
    //修改用户状态
    updateStatus(row, index) {
      // console.log(this.status)
      // console.log(row, index);
      // let { id } = row.id;
      this.$http
        .post("user/updateStatus", { id: row.id, status: row.status })
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
