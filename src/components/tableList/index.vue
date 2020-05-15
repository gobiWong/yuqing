<template>
  <el-table class="se-table" height="100%" :data="data.data" tooltip-effect="dark">
    <!-- item -->
    <el-table-column
      v-for="(item, index) in data.labels"
      :key="index"
      :prop="item.prop"
      :label="item.label"
      :width="item.width"
      show-overflow-tooltip
    >
      <template v-if="!item.type" v-slot="{row}">{{row[item.prop] || '暂无'}}</template>
      <template v-else v-slot="{row}">
        <template v-if="item.type === 'date'">{{$tool.getDate(row[item.prop])}}</template>
        <template
          v-else-if="item.type === 'dateRange'"
        >{{$tool.getDate(row[item.prop.split(',')[0]])}}-{{$tool.getDate(row[item.prop.split(',')[1]])}}</template>
        <template v-else-if="item.type === 'dateTime'">{{$tool.getDateTime(row[item.prop])}}</template>
        <template v-else-if="item.type === 'time'">{{$tool.getDateTime(row[item.prop], true)}}</template>
        <template
          v-else-if="item.type === 'timeRange'"
        >{{$tool.getDateTime(row[item.prop.split(',')[0]])}}-{{$tool.getDateTime(row[item.prop.split(',')[1]], true)}}</template>
        <template v-else>{{item.type[row[item.prop]] || '暂无'}}</template>
      </template>
    </el-table-column>
    <!-- btns -->
    <el-table-column v-if="btns" label="操作" :width="width">
      <template v-slot="{row, $index}">
        <template v-for="(item, index) in Object.keys(btns)">
          <el-button
            v-if="typeof btns[item] === 'string'"
            :key="index"
            type="text"
            @click="action(item, row, $index)"
          >{{btns[item]}}</el-button>
          <el-button
            v-else
            :key="index"
            type="text"
            :disabled="disabled(btns[item], row)"
            @click="action(item, row, $index)"
          >{{btns[item].lable}}</el-button>
        </template>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
const btns = {
  check: "查看",
  fix: "修改",
  del: "删除"
};

export default {
  props: {
    data: {
      type: Object,
      default() {
        return {
          data: [],
          labels: []
        };
      }
    },

    btns: {
      type: Object | Boolean,
      default() {
        return btns;
      }
    }
  },

  computed: {
    width() {
      return Object.keys(this.btns).length * 80;
    }
  },

  methods: {
    disabled(data, row) {
      let values = data.value.split(",");
      return !values.some(v => v === row[data.key]);
    },

    del(row, index) {
      this.$popup({
        type: "del",
        content: "确定要删除吗?",
        click: () => this.$emit("del", row, index)
      });
    },

    action(item, row, index) {
      item === "del" && this.del(row);
      item !== "del" && this.$emit(item, row, index);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
