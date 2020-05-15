<template>
  <!-- 菜单管理 -->
  <div id="base">
    <!-- 搜索 -->
    <div class="search">
      <div class="searchTop">
        <el-form :inline="true" :model="search">
           <el-form-item label="菜单名">
            <el-input v-model="search.name" placeholder="请输入菜单名"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="search.title" placeholder="请选择" clearable>
              <el-option v-for="item in options" :key="item" :label="item" :value="item"></el-option>
            </el-select>
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
        <el-table-column prop="name" label="菜单名"></el-table-column>
        <el-table-column prop="displayName" label="显示名称"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              @change="updateStatus(scope.row, scope.$index)"
              :active-value="0"
              :inactive-value="1"
              v-model="scope.row.state"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
          <!-- <template slot-scope="scope">
            <span v-if="scope.row.state == 0" class="green">启用</span>
            <span v-else class="red">禁用</span>
          </template>-->
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="showdetail(scope.row, scope.$index)">编辑</el-button>
            <!-- <el-button type="danger" size="small" @click="showrelease(scope.row, scope.$index)">切换角色</el-button> -->
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

    <!-- 新增 -->
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
        <el-form-item label="显示菜单名">
          <el-input v-model="msg.display_name" :disabled="editDis" placeholder="请输入用户名称"></el-input>
        </el-form-item>
        <el-form-item label="父id">
          <el-input v-model="msg.parent_id" :disabled="editDis" placeholder="请输入用户名称"></el-input>
        </el-form-item>
        <el-form-item label="菜单名">
          <el-input v-model="msg.name" :disabled="editDis" placeholder="请输入用户名称"></el-input>
        </el-form-item>
        <el-form-item label="菜单顺序">
          <el-input v-model="msg.display_order" :disabled="editDis" placeholder="请输入用户名称"></el-input>
        </el-form-item>
        <el-form-item label="公司id">
          <el-input v-model="msg.company_id" :disabled="editDis" placeholder="请输入用户名称"></el-input>
        </el-form-item>
        <!-- <el-form-item label="角色名称" prop="userId">
          <el-select v-model="msg.userId" placeholder="请选择" style="width: 100%">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.roleId"
            ></el-option>
          </el-select>
        </el-form-item>-->
        <!-- <el-form-item label="状态" prop="type">
          <el-select v-model="msg.status" placeholder="请选择用户状态" style="width: 100%">
            <el-option v-for="(item, i) in types" :key="i" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">取消</el-button>
        <el-button v-if="addedittitle == '菜单管理-新增'" type="primary" @click="submitForm">保存</el-button>
        <el-button v-else type="primary" @click="editForm">保存</el-button>
        <!-- <el-button type="primary" @click="editForm">保存</el-button> -->
      </span>
    </el-dialog>

    <!-- 权限角色切换 -->
    <!-- <el-dialog title="角色切换" :visible.sync="dialogVisible" width="30%">
      <el-form ref="form" :model="switchRole" label-width="80px">
        <el-form-item label="角色名称">
          <el-select v-model="switchRole.roleId" placeholder="请选择" style="width: 100%">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.nickName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="switchRoleSubmit">确 定</el-button>
      </span>
    </el-dialog>-->
  </div>
</template>

<script>
export default {
  data() {
    return {
      addedittitle: null,
      showedit: false,
      editDis: false,
      dialogVisible: false,
      options: ["启用", "禁用"],
      types: [
        {
          name: "启用",
          value: 0
        },
        {
          name: "冻结",
          value: 1
        }
      ],
      isConnecteds: ["连接", "断开"],
      msg: {
        company_id: "",
        display_order: "",
        name: "",
        parent_id: "",
        display_name: ""
      },
      // 新建通知非空验证
      rules: {
        userId: [{ required: true, message: "请选择角色名称", trigger: "blur" }]
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
      },
      // 角色名称列表
      roleList: [],
      switchRole: {
        role: ""
      }
    };
  },
  created() {
    this.getList();
    this.getRoleUser();
  },
  methods: {
    // 获取角色名称
    getRoleUser() {
      // this.$http.get("role/findByCompanyId").then(res => {
      //   console.log(res);
      //   this.roleList = res.data;
      // });
    },
    //获取列表数据
    getList() {
      this.$http.post("rainMenu/getCriteriaQuery").then(res => {
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
          this.$http.post("rainMenu/add", this.msg).then(res => {
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
      console.log(this.msg);
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.$http.post("roleUser/update", this.msg).then(res => {
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
      this.addedittitle = "菜单管理-新增";
    },
    //编辑
    showdetail(row, index) {
      this.editDis = true;
      this.msg = JSON.parse(JSON.stringify(row));
      this.showedit = true;
      this.addedittitle = "菜单管理-编辑";
    },
    //切换
    showrelease(row, index) {
      this.dialogVisible = true;
      this.switchRole = row;
    },
    // 切换保存
    // switchRoleSubmit() {
    //   this.$http.post("roleUser/update", this.switchRole).then(res => {
    //     if (res.code == 1) {
    //       this.dialogVisible = false;
    //       this.getList();
    //       this.$message({
    //         type: "success",
    //         showClose: true,
    //         message: "编辑成功",
    //         offset: 155
    //       });
    //     } else {
    //       this.$message({
    //         type: "warning",
    //         showClose: true,
    //         message: "编辑失败",
    //         offset: 155
    //       });
    //     }
    //   });
    // },
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
    },
    //修改菜单状态
    updateStatus(row, index) {
      // console.log(this.status)
      // console.log(row, index);
      // let { id } = row.id;
      this.$http
        .post("rainMenu/delete", { id: row.id, state: parseInt(row.state) })
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
