<template>
  <div class="navMenu">
    <label v-for="(navMenu,index) in navMenus" :key="index">
      <el-menu-item v-if="!navMenu.children" :index="navMenu.url">
        <span slot="title">{{navMenu.displayName}}</span>
      </el-menu-item>
      <el-submenu
        v-if="navMenu.children&&navMenu.children.length>0"
        :key="index"
        :index="navMenu.url"
        
      >
        <template slot="title">
          <span>{{navMenu.displayName}}</span>
        </template>

        <nav-menu :navMenus="navMenu.children" :index="navMenu.url"></nav-menu>
      </el-submenu>
    </label>
    <!-- <label v-for="navMenu in navMenus">
   <el-menu-item v-if="navMenu.childs==null&&navMenu.entity&&navMenu.entity.state==='ENABLE'"
          :key="navMenu.entity.id" :data="navMenu" :index="navMenu.entity.name" :route="navMenu.entity.value"
          disabled="">
    <i :class="navMenu.entity.icon"></i>
    <span slot="title">{{navMenu.entity.alias}}</span>
   </el-menu-item>
  
   <el-submenu v-if="navMenu.childs&&navMenu.entity&&navMenu.entity.state==='ENABLE'"
         :key="navMenu.entity.id" :data="navMenu" :index="navMenu.entity.name">
    <template slot="title">
     <i :class="navMenu.entity.icon"></i>
     <span> {{navMenu.entity.alias}}</span>
    </template>
    <NavMenu :navMenus="navMenu.childs"></NavMenu>
   </el-submenu>
    </label>-->
    <!--  <label v-for="(navMenu,index) in navMenus" :key="index">
   <el-menu-item v-if="!navMenu.children"
          :key="navMenu.id" 
          disabled="">
    <i :class="navMenu.entity.icon"></i>
    <span slot="title">{{navMenu.displayName}}</span>
   </el-menu-item>
  
   <el-submenu v-if="navMenu.children"
         :key="navMenu.entity.id" :data="navMenu" :index="navMenu.entity.name">
    <template slot="title">
     <i :class="navMenu.entity.icon"></i>
     <span> {{navMenu.displayName}}</span>
    </template>
    <NavMenu :navMenus="navMenu.childs"></NavMenu>
   </el-submenu>
    </label>-->
  </div>
</template>
 
<script>
export default {
  name: "NavMenu", //使用递归组件必须要有
  props: ["navMenus"], // 传入子组件的数据
  data() {
    return {};
  },
  methods: {
    name(){

    }
  }
};
</script>
 
<style scoped>
</style>