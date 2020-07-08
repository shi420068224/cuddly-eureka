<template>
  <el-card>
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="商品分类"></my-bread>
    <!-- 搜索框 -->
    <el-row>
      <el-col :span="24">
        <el-button type="success" @click.prevent="addGoodsCate()"
          >添加分类</el-button
        >
      </el-col>
    </el-row>
    <!-- 表 -> 字表-->
    <el-table :data="goodscateTable" style="width: 100%">
      <!-- <el-table-column label="分类名称" prop="cat_name"></el-table-column> -->
      <!--
        treeKey     ->  nodeKey    -> 节点唯一标识
        parentKey   ->  父节点 id
        levelKey    ->  当前节点级别
        childKey    ->  子节点
        indentSize
      -->
      <el-tree-grid
        label="分类名称"
        prop="cat_name"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
        childKey="children"
        folderIcon=" "
      ></el-tree-grid>
      <el-table-column label="级别">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level === 0">一级</span>
          <span v-else-if="scope.row.cat_level === 1">二级</span>
          <span v-else>三级</span>
        </template>
      </el-table-column>
      <el-table-column label="是否有效">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_deleted === true">有效</span>
          <span v-else-if="scope.row.cat_deleted === false">无效</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="">
          <el-button
            size="mini"
            plain
            type="primary"
            icon="el-icon-edit"
            circle
          ></el-button>
          <el-button
            size="mini"
            plain
            type="danger"
            icon="el-icon-delete"
            circle
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框 -->
    <!-- 添加分类 -->
    <el-dialog title="添加分类" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="分类名称" label-width="80px">
          <el-input v-model="form.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" label-width="80px">
          <el-cascader
            expand-trigger="click"
            :options="options"
            v-model="selectedOptions"
            :props="defaultProp"
            @change="handleChange"
            style="width:100%"
            clearable
            change-on-select
          >
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addCate()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
// 引入element-tree-grid
var ElTreeGrid = require("element-tree-grid");

export default {
  name: "goodscate",
  components: {
    ElTreeGrid
  },
  data() {
    return {
      goodscateTable: [],
      dialogFormVisibleAdd: false,
      form: {
        cat_pid: -1,
        cat_name: "",
        cat_level: -1
      },
      options: [],
      selectedOptions: [],
      defaultProp: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      }
    };
  },
  mounted() {
    this.getGoodsCate();
  },
  methods: {
    // 获取分类列表
    async getGoodsCate() {
      const res = await this.$http.get(`categories?type=3`);
      console.log(res);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.goodscateTable = data;
        this.$message.success(msg);
      }
    },
    // 添加分类
    async addGoodsCate() {
      // 获取二级
      const res = await this.$http.get(`categories?type=2`);
      this.options = res.data.data;
      this.dialogFormVisibleAdd = true;
    },
    async addCate() {
      // 发送请求
      /*
        一级分类：this.selectedOptions.length === 0 -> form.cat_pid = 0;form.cat_level = 0;
        二级分类：this.selectedOptions.length === 1 -> form.cat_pid = this.selectedOptions[0];form.cat_level = 1;
        三级分类：this.selectedOptions.length === 2 -> form.cat_pid = this.selectedOptions[1];form.cat_level = 2;
      */

      if (this.selectedOptions.length === 0) {
        this.form.cat_pid = 0;
        this.form.cat_level = 0;
      } else if (this.selectedOptions.length === 1) {
        this.form.cat_pid = this.selectedOptions[0];
        this.form.cat_level = 1;
      } else if (this.selectedOptions.length === 2) {
        this.form.cat_pid = this.selectedOptions[1];
        this.form.cat_level = 2;
      }

      const res = await this.$http.post(`categories`, this.form);
      console.log(res);
      if (res.data.meta.status === 201) {
        this.getGoodsCate();
        this.$message.success(res.data.meta.msg);
        this.dialogFormVisibleAdd = false;
      }
    },
    handleChange() {}
  }
};
</script>
<style scoped>
.el-row {
  margin-top: 20px;
}
</style>
