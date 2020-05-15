import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue"),
    redirect: "/home/map",
    children: [
      {
        path: "/home/map",
        name: "map",
        component: () => import("../views/map/map.vue"),
        meta: {
          title: "首页"
        }
      },
      // 设备管理
      {
        path: "/home/equipment",
        name: "equipment",
        component: () => import("../views/equipment/index.vue"),
        meta: {
          title: "设备档案"
        }
      },
      {
        path: "/home/rainfall",
        name: "rainfall",
        component: () => import("../views/equipment/rainfall.vue"),
        meta: {
          title: "降雨统计"
        }
      },
      {
        path: "/home/monitor",
        name: "monitor",
        component: () => import("../views/equipment/monitor.vue"),
        meta: {
          title: "雨量监测"
        }
      },
      {
        path: "/home/modify",
        name: "modify",
        component: () => import("../views/equipment/modify.vue"),
        meta: {
          title: "数据修改"
        }
      },
      // 雨晴报表

      {
        path: "/home/archives",
        name: "archives",
        component: () => import("../views/archives/archives.vue"),
        meta: {
          title: "雨晴日报表"
        }
      },
      {
        path: "/home/sluice",
        name: "sluice",
        component: () => import("../views/archives/sluice.vue"),
        meta: {
          title: "雨晴月报表"
        }
      },
      {
        path: "/home/monitors",
        name: "monitors",
        component: () => import("../views/archives/monitors.vue"),
        meta: {
          title: "雨晴年报表"
        }
      },
      {
        path: "/home/rain",
        name: "rain",
        component: () => import("../views/archives/rain.vue"),
        meta: {
          title: "降雨日统计"
        }
      },
      // 短信预警
      {
        path: "/home/structure",
        name: "structure",
        component: () => import("../views/structure/structure.vue"),
        meta: {
          title: "短信接收人"
        }
      },
      {
        path: "/home/record",
        name: "record",
        component: () => import("../views/structure/record.vue"),
        meta: {
          title: "发送记录"
        }
      },
      // 系统管理
      {
        path: "/home/journal",
        name: "journal",
        component: () => import("../views/system/journal.vue"),
        meta: {
          title: "组织结构"
        }
      },
      {
        path: "/home/jurisdiction",
        name: "jurisdiction",
        component: () => import("../views/system/jurisdiction.vue"),
        meta: {
          title: "菜单管理"
        }
      },
      {
        path: "/home/username",
        name: "username",
        component: () => import("../views/system/username.vue"),
        meta: {
          title: "用户管理"
        }
      },
      {
        path: "/home/roles",
        name: "roles",
        component: () => import("../views/system/roles.vue"),
        meta: {
          title: "角色管理"
        }
      },
      {
        path: "/home/logs",
        name: "logs",
        component: () => import("../views/system/logs.vue"),
        meta: {
          title: "日志报表"
        }
      }
    ]
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/login/login.vue")
  }
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
});

export default router;
