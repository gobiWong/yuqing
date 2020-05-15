<template>
  <div class="login">
    <div class="center">
      <div class="centerL" @click="switchLogin"></div>
      <div class="centerR">
        <div class="inputCenter">
          <div class="inputTop">
            <img src="../../assets/png/dlog.png" alt>
            <div class="title">
              <div class="text1">智慧雨情</div>
              <div class="text2">东营区雨情自动遥测系统</div>
            </div>
          </div>
          <div class="input">
            <el-input
              placeholder="请输入公司编号"
              v-model="canpanyCode"
              clearable
              maxlength="6"
              @blur="blurUser(canpanyCode)"
            ></el-input>
            <!-- <div v-show="loginshow">
              <el-input
                placeholder="请输入手机号"
                v-model="username"
                clearable
                @change="changeUser(username)"
              ></el-input>
              <el-input placeholder="请输入密码" v-model="password" show-password></el-input>
            </div>-->
            <div v-show="!loginshow">
              <el-input placeholder="请输入手机号" maxlength="11" v-model="number" clearable></el-input>
              <el-input placeholder="请输验证码" v-model="code" class="input-with-select">
                <el-button
                  slot="append"
                  class="bottonSerch"
                  v-show="codeshow"
                  @click="getCode"
                >获取验证码</el-button>
                <el-button slot="append" class="bottonSerch" v-show="!codeshow">{{ codeMit }}秒</el-button>
              </el-input>
            </div>
            <el-checkbox-group v-model="type">
              <el-checkbox label="7天内免密码登录" name="type"></el-checkbox>
            </el-checkbox-group>
            <div class="primary" @click="login">登录</div>
            <div class="flooter">
              <span class="iconfont icon-diannaodefuben icon"></span>
              <span class="text3">东营区水利局</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <span class="text5">系统开发：东营市旭瑞智能科技股份有限公司</span>
      技术支持：0546-7773897
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  components: {},
  data() {
    return {
      loginshow: false,
      codeshow: true,
      options: [],
      canpanyCode: localStorage.getItem("canpanyCode"),
      companyId: localStorage.getItem("companyId"),
      // username: null,
      // password: null,
      number: null,
      code: null,
      type: [],
      freeLogin: null,
      codeMit: 60
    };
  },
  methods: {
    toTree(data) {
      // 删除 所有 children,以防止多次调用
      data.forEach(function(item) {
        delete item.children;
      });

      // 将数据存储为 以 id 为 KEY 的 map 索引数据列
      var map = {};
      data.forEach(function(item) {
        map[item.id] = item;
      });
      //        console.log(map);
      var val = [];
      data.forEach(function(item) {
        // parentId,去map对象中找到索引的id
        var parent = map[item.parentId];
        // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
        if (parent) {
          (parent.children || (parent.children = [])).push(item);
        } else {
          //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
          val.push(item);
        }
      });
      return val;
    },
    //获取公司id下拉列表
    blurUser(code) {
      this.$http.post("login/getCompanyId", { code: code }).then(res => {
        console.log(res);
        if (res.code == 1) {
          localStorage.setItem("companyCode", this.canpanyCode);
          localStorage.setItem("companyId", res.data);
        } else {
          this.$message({
            message: "公司编号不存在",
            type: "error",
            center: true
          });
        }
      });
    },
    //切换
    switchLogin() {
      this.loginshow = !this.loginshow;
    },
    //用户名验证
    changeUser(user) {
      this.$http.post("login/checkTel", { username: user }).then(res => {
        console.log(res);
        if (res) {
          console.log("用户名存在");
        } else {
          this.$message({
            message: "用户名不存在",
            type: "error",
            center: true
          });
        }
      });
    },
    //手机号验证
    changeNumber(num) {
      let regular = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!regular.test(num)) {
        this.$message({
          message: "请输入正确的手机号",
          type: "error",
          center: true
        });
      } else {
        this.$http.post("login/checkTel", { username: num }).then(res => {
          console.log(res);
          if (res) {
            console.log("用户存在");
          } else {
            this.$message({
              message: "该用户没有权限",
              type: "error",
              center: true
            });
          }
        });
      }
    },
    //获取验证码
    getCode() {
      this.$http
        .post("login/sendUsername ", {
          username: this.number,
          companyId: localStorage.getItem("companyId")
        })
        .then(res => {
          console.log(res);
          if (res.code == 1) {
            this.$message({
              message: res.message,
              type: "success",
              center: true
            });
            this.codeshow = false;
            clearInterval(interval);
            this.codeMit = 60;
            let interval = setInterval(() => {
              if (this.codeMit <= 0) {
                this.codeshow = true;
                clearInterval(interval);
              }
              this.codeMit--;
            }, 1000);
          }
        });
    },
    //登陆
    login() {
      // this.$router.push("/");
      if (this.type[0]) {
        this.freeLogin = 1;
      } else {
        this.freeLogin = 0;
      }
      this.$http
        .post("login/login", {
          name: this.number,
          password: this.code,
          companyId: this.companyId,
          freeLogin: this.freeLogin
        })
        .then(res => {
          console.log(res);

          if (res.code == 1) {
            let id = res.data.id;
            localStorage.setItem("token", res.data.token);
            // localStorage.setItem("companyId", res.data.companyId);

            //登录成功后通过当前登陆用户的id获取用户信息
            this.$http
              .post("rainRole/findRoleByUserId", {
                id
              })
              .then(res => {
                console.log("userInfo", this.toTree(res.data));
                // res.data.
                let treeData = this.toTree(res.data);
                localStorage.setItem("tree", treeData);
                this.$store.commit("tree", this.toTree(res.data));
                this.$router.push("/");
              });
          } else {
            this.$message({
              message: "请核对用户信息",
              type: "error",
              center: true
            });
          }
        });
    }
  }
};
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 100vh;
  background: url("../../assets/png/登录背景.png") no-repeat;
  background-size: cover;
  display: flex;
  justify-content: center;
  flex-direction: column;
}
.center {
  width: 768px;
  height: 420px;
  background-color: #fff;
  margin: 0 auto;
  border-radius: 8px;
  display: flex;
}
.centerL {
  width: 302px;
  height: 420px;
  background: url("../../assets/png/登录log.png") no-repeat;
  background-size: cover;
}
.centerR {
  width: 466px;
  height: 420px;
}
.inputCenter {
  padding: 36px 50px 21px;
}
.inputTop {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 22px;
  img {
    width: 44px;
    height: 100%;
  }
  .title {
    margin-left: 4.3%;
    .text1 {
      width: 240px;
      text-align: left;
      font-size: 24px;
      font-family: PingFang SC;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
    }
    .text2 {
      width: 240px;
      text-align: left;
      font-size: 20px;
      font-family: PingFang SC;
      font-weight: 400;
      color: rgba(77, 77, 77, 1);
    }
  }
}
.el-input {
  width: 100%;
  height: 36px;
  background-color: rgba(245, 245, 245, 1) !important;
  margin-bottom: 20px;
}
.el-checkbox-group {
  text-align: left;
  margin-bottom: 20px;
}
.el-button {
  width: 100%;
}
.flooter {
  color: #35a9e5;
  text-align: left;
  margin-top: 20px;
  height: 22px;
  line-height: 22px;
  display: flex;
  justify-items: center;
  .icon {
    font-size: 21px;
  }
  .text3 {
    font-size: 14px;
  }
}
.footer {
  margin-top: 54px;
  color: rgba(255, 255, 255, 1);
}
.text5 {
  display: inline-block;
  margin-right: 50px;
}
.bottonSerch {
  display: inline-block;
  padding: 0;
  margin: 0;
}
.primary {
  width: 366px;
  height: 36px;
  line-height: 36px;
  background-color: #35a9e5;
  color: #fff;
  border-radius: 4px;
}
</style>
