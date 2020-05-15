<template>
  <el-menu
    :default-active="$route.path"
    :unique-opened="true"
    collapse-transition
    router
    class="el-menu-vertical-demo"
    text-color="#000"
    active-text-color="#1db3b3"
  >
    <NavMenu :navMenus="data1"></NavMenu>
  </el-menu>
  <!-- <div> {{ $route.path}}</div> -->
</template>

<script>
import NavMenu from "./NavMenu.vue";
export default {
  name: "Aside",
  components: { NavMenu },
  data() {
    return {
      jurisdiction: localStorage.getItem("jurisdiction"), //权限\
      list: [],
      path: "",
      gateNumber: 1,
      // treeData:this.$store.state.userInfo,
      // treeData: JSON.parse(localStorage.getItem("tree")),
      data1: [
        {
          id: 1,
          name: "map",
          parentId: 0,
          displayName: "站点分布图",
          displayOrder: 1,
          url: "/home/map",
          state: 0,
          imgUrl: null,
          companyId: 4,
          createTime: "2020-03-31 13:46:19"
        },
        {
          id: 2,
          name: "equipment",
          parentId: 0,
          displayName: "设备管理",
          displayOrder: 2,
          url: "/home/equipment",
          state: 0,
          imgUrl: null,
          companyId: 4,
          createTime: "2020-03-31 13:48:34",
          children: [
            {
              id: 6,
              name: "equipment",
              parentId: 2,
              displayName: "设备档案",
              displayOrder: 0,
              url: "/home/equipment",
              state: 0,
              imgUrl: null,
              companyId: 4,
              createTime: "2020-03-31 13:50:31"
            },
            {
              id: 7,
              name: "rainfall",
              parentId: 2,
              displayName: "降雨统计",
              displayOrder: 0,
              url: "/home/rainfall",
              state: 0,
              imgUrl: null,
              companyId: 4,
              createTime: "2020-03-31 13:50:49"
            },
            {
              id: 8,
              name: "monitor",
              parentId: 2,
              displayName: "雨量检测",
              displayOrder: 0,
              url: "/home/monitor",
              state: 0,
              imgUrl: null,
              companyId: 4,
              createTime: "2020-03-31 13:51:17"
            },
            {
              id: 9,
              name: "modify",
              parentId: 2,
              displayName: "数据修改",
              displayOrder: 0,
              url: "/home/modify",
              state: 0,
              imgUrl: null,
              companyId: 4,
              createTime: "2020-03-31 13:51:19"
            }
          ]
        },
        {
          id: 3,
          name: "archives",
          parentId: 0,
          displayName: "雨情报表",
          displayOrder: 3,
          name: "/home/archives",
          url: "archives",
          state: 0,
          imgUrl: null,
          companyId: 4,
          createTime: "2020-03-31 13:48:51",
          children: [
            {
              id: 10,
              name: "archives",
              parentId: 3,
              displayName: "雨情日报表",
              displayOrder: 0,
              url: "/home/archives",
              state: 0,
              imgUrl: null,
              companyId: 4,
              createTime: "2020-03-31 13:52:06"
            },
            {
              id: 11,
              name: "sluice",
              parentId: 3,
              displayName: "雨情月报表",
              displayOrder: 0,
              url: "/home/sluice",
              state: 0,
              imgUrl: null,
              companyId: 4,
              createTime: "2020-03-31 13:52:23"
            },
            {
              id: 12,
              name: "monitors",
              parentId: 3,
              displayName: "雨情年报表",
              displayOrder: 0,
              url: "/home/monitors",
              state: 1,
              imgUrl: null,
              companyId: 4,
              createTime: "2020-04-25 09:02:12"
            },
            {
              id: 13,
              name: "rain",
              parentId: 3,
              displayName: "降雨日统计",
              displayOrder: 0,
              url: "/home/rain",
              state: 0,
              imgUrl: null,
              companyId: 1,
              createTime: "2020-04-27 17:25:30"
            }
          ]
        },
        {
          id: 5,
          name: "journal",
          parentId: 0,
          displayName: "系统管理",
          displayOrder: 5,
          url: "/home/journal",
          state: 0,
          imgUrl: null,
          companyId: 4,
          createTime: "2020-03-31 13:50:12",
          children: [
            {
              id: 16,
              name: "journal",
              parentId: 5,
              displayName: "组织结构",
              displayOrder: 0,
              url: "/home/journal",
              state: 0,
              imgUrl: null,
              companyId: 4,
              createTime: "2020-04-27 17:30:28"
            },
            {
              id: 17,
              name: "jurisdiction",
              parentId: 5,
              displayName: "菜单管理",
              displayOrder: 0,
              url: "/home/jurisdiction",
              state: 0,
              imgUrl: null,
              companyId: 4,
              createTime: "2020-04-27 17:32:08"
            },
            {
              id: 18,
              name: "username",
              parentId: 5,
              displayName: "用户管理",
              displayOrder: 0,
              url: "/home/username",
              state: 0,
              imgUrl: null,
              companyId: 4,
              createTime: "2020-05-14 11:01:34"
            },
            {
              id: 19,
              name: "roles",
              parentId: 5,
              displayName: "角色管理",
              displayOrder: 0,
              url: "/home/roles",
              state: 0,
              imgUrl: null,
              companyId: 4,
              createTime: "2020-05-14 11:02:27"
            },
            {
              id: 20,
              name: "logs",
              parentId: 5,
              displayName: "日志报表",
              displayOrder: 0,
              url: "/home/logs",
              state: 1,
              imgUrl: null,
              companyId: 4,
              createTime: "2020-05-14 11:03:10"
            }
          ]
        },
        {
          id: 4,
          name: "structure",
          parentId: 0,
          displayName: "短信预警",
          displayOrder: 4,
          url: "/home/structure",
          state: 0,
          imgUrl: null,
          companyId: 4,
          createTime: "2020-03-31 13:49:22",
          children: [
            {
              id: 14,
              name: "structure",
              parentId: 4,
              displayName: "短信接收人",
              displayOrder: 0,
              url: "/home/structure",
              state: 0,
              imgUrl: null,
              companyId: 4,
              createTime: "2020-04-27 17:28:31"
            },
            {
              id: 15,
              name: "record",
              parentId: 4,
              displayName: "发送记录",
              displayOrder: 0,
              url: "/home/record",
              state: 0,
              imgUrl: null,
              companyId: 4,
              createTime: "2020-04-27 17:29:25"
            }
          ]
        }
      ]
    };
  },
  methods: {
    select(val){
      console.log(val)
    },
    names(name){
      console.log("werwer",name)
      this.$router.push(name)
    },
    onMenu(val) {
      console.log(val, "xxxx");
    },
    //路由传值
    searchVideo(item) {
      this.gateNumber = item.num;
      this.$router.push({
        path: "/home/surveillance",
        query: {
          nameId: item.name,
          addressCode: item.addressCode,
          number: item.gateNumber,
          type: item.type,
          companyId: item.companyId
        }
      });
    },
    //监听router的事件
    parentMsg(path) {
      // console.log(path);
      this.keyValue = path;
    },
    //展开
    // handleOpen(key, keyPath) {
    //   this.$router.push(key);
    //   this.keyValue = key;
    //   // console.log(2);
    // },
    selectOpen(key, keyPath) {
      this.keyValue = key;
      // console.log(1);
    },
    //获取权限
    getJurisdiction() {
      this.$http.post("menu/menuAll").then(res => {
        console.log(res);
        localStorage.setItem("jurisdiction", res.data);
      });
    }
  },
  computed: {
    active() {
      return this.$route.path.replace("/", "");
    },
    treeData() {
      return JSON.parse(localStorage.getItem("tree"));
    }
  },
  created() {
    // this.getJurisdiction();
    this.keyValue = this.$route.path;
    console.log(this.$route);
  }
};
</script>

<style lang="less" scoped>
// .sidebar-container {
//   transition: width 0.28s;
//   width: 180px !important;
//   height: 100%;
//   position: fixed;
//   font-size: 0px;
//   bottom: 0;
//   left: 0;
//   z-index: 1001;
//   overflow: hidden;

//   .horizontal-collapse-transition {
//     transition: 0s width ease-in-out, 0s padding-left ease-in-out,
//       0s padding-right ease-in-out;
//   }
//   .el-scrollbar {
//     height: 100%;
//   }
//   .scrollbar-wrapper {
//     overflow-x: hidden !important;
//     .el-scrollbar__view {
//       height: 100%;
//     }
//   }
//   .el-scrollbar__bar.is-vertical {
//     right: 0px;
//   }
//   .is-horizontal {
//     display: none;
//   }
//   a {
//     display: inline-block;
//     width: 100%;
//     overflow: hidden;
//   }
//   .el-menu {
//     border: none;
//     height: 100%;
//     width: 100% !important;
//   }
//   .is-active > .el-submenu__title {
//     color: #f4f4f5 !important;
//   }
// }

// ----------------
.iconfont {
  margin-right: 8px !important;
}
.el-menu {
  border-right: 0;
}
.bgcList {
  background-color: #ebf1fa !important;
}
.huiList {
  background-color: #fff !important;
}
.span {
  font-size: 16px !important;
  font-family: PingFang SC;
  font-weight: 400;
  color: #fff;
}
.num {
  display: inline-block;
  padding: 0 15px;
}
.el-scrollbar__wrap.default-scrollbar__wrap {
  overflow-x: hidden;
}

.aside {
  overflow: scroll;
  overflow-x: hidden;
}
.townlist {
  margin-left: 40px;
}
</style>
