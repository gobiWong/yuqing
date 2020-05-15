<template>
  <!-- 组织结构 -->
  <div id="base">
    <!-- 搜索 -->
    <div class="search">
      <div class="searchTop">
        <el-form :inline="true" :model="search">
          <el-form-item label="用户名">
            <el-input v-model="search.name" placeholder="请输入用户名"></el-input>
            <!-- <el-select v-model="search.name" placeholder="请选择" clearable>
              <el-option
                v-for="item in options"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>-->
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getAddBook">查询</el-button>
            <el-button @click="empty" type="info">清空</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 按钮 -->
      <div class="searchBot">
        <el-button
          style="width:96px;margin-bottom: 20px"
          class="buttonBot"
          type="primary"
          @click="notice"
        >新增</el-button>
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
        <el-table-column type="index" label="序号" width="40px"></el-table-column>
        <el-table-column prop="name" label="用户名"></el-table-column>
        <el-table-column prop="tel" label="手机号"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column label="是否接收">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1" class="green">是</span>
            <span v-else class="red">否</span>
          </template>
        </el-table-column>
        <el-table-column prop="messageType" label="预警级别"></el-table-column>
        <el-table-column prop="reciveStatus" label="状态">
          <!-- <template slot-scope="scope">
            <span v-if="scope.row.status == 0" class="green">启用</span>
            <span v-else class="red">禁用</span>
          </template>-->
        </el-table-column>
        <el-table-column prop="createName" label="创建人"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
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
        <el-form-item label="用户名" prop="name">
          <el-input v-model="msg.name" maxlength="20" placeholder="短信接收人姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="tel">
          <el-input v-model="msg.tel" maxlength="11" placeholder="电话"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="msg.email" maxlength="20" placeholder="邮箱"></el-input>
        </el-form-item>
        <el-form-item label="预警类别">
          <el-select v-model="msg.messageType" style="width:342px" placeholder="请选择">
            <el-option label="故障预警" value="故障预警"></el-option>
            <el-option label="降雨预警" value="降雨预警"></el-option>
            <el-option label="降雨日报" value="降雨日报"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否接收">
          <el-select v-model="msg.status" style="width:342px" placeholder="请选择">
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="msg.reciveStatus" style="width:342px" placeholder="请选择">
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="	创建人" prop="createName">
          <el-input v-model="msg.createName" maxlength="20" placeholder="	创建人"></el-input>
        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">取消</el-button>
        <el-button v-if="addedittitle == '短信接收人-新增'" type="primary" @click="submitForm">保存</el-button>
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
      options: ["闸门名称"],
      types: ["节制闸", "橡胶坝"],
      isConnecteds: ["连接", "断开"],
      msg: {
        name: "",
        tel: "",
        // createName: "",
        reciveStatus: 1,
        email: "",
        status: 1,
        messageType: ""
      },
      // 新建通知非空验证
      rules: {
        name: [
          { required: true, message: "请输入短信接收人姓名", trigger: "blur" }
        ],
        tel: [
          {
            required: true,
            message: "请输入短信接收人姓名电话",
            trigger: "blur"
          },
          {
            pattern: 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/,
            required: true,
            message: "请填写正确的手机号",
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            message: "请输入短信接收人姓名邮箱",
            trigger: "blur"
          },
          {
            pattern: /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/, //通用邮箱正则表达式
            required: true,
            message: "请填写正确的邮箱地址",
            trigger: "blur"
          }
        ],
        createName: [
          { required: true, message: "请输入创建人", trigger: "blur" }
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
        .post("rainMessageReceiver/getCriteriaQuery", {
          //  companyId: localStorage.getItem("companyId"),
          name: this.search.name
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
          this.$http.post("rainMessageReceiver/add", this.msg).then(res => {
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
          // let { tel, name, id } = this.msg;
          console.log(this.msg);
          // this.$http
          //   .post("rainMessageReceiver/update", {...this.msg})
          //   .then(res => {
          //     if (res.code == 1) {
          //       this.showedit = false;
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
        } else {
          return false;
        }
      });
    },
    //新增
    notice() {
      this.showedit = true;

      this.addedittitle = "短信接收人-新增";
    },
    //编辑
    showdetail(row, index) {
      this.showedit = true;
      this.addedittitle = "短信接收人-编辑";
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
          this.$http.post("company/delete", { id: row.id }).then(res => {
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
