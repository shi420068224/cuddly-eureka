<template>
  <el-card>
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="分类参数"></my-bread>
    <!-- 消息提示框 -->
    <el-alert
      title="只允许为第三级分类设置参数"
      type="error"
      :closable="false"
    ></el-alert>
    <!-- 级联选择器 -->
    <el-form label-width="80px" size="mini" label-position="left">
      <el-form-item label="商品分类" label-width="100px">
        <el-cascader
          expand-trigger="click"
          :options="options"
          v-model="selectedOptions"
          :props="defaultProp"
          @change="handleChange"
          style="width:50%"
          :show-all-levels="false"
          clearable
        >
        </el-cascader>
      </el-form-item>
    </el-form>
    <!-- 标签页 -->
    <el-tabs v-model="active" type="card" @tab-click="handleClick">
      <el-tab-pane label="动态参数" name="1">
        <el-button type="primary">设置动态参数</el-button>
        <!-- 表格 可展开 -->
        <el-table :data="arrDyparams" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <!-- <el-tag></el-tag> -->
              <el-tag
                :key="tag"
                v-for="tag in scope.row.attr_vals"
                closable
                :disable-transitions="false"
                @close="handleClose(scope.row, tag)"
              >
                {{ tag }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput"
                >+ New Tag</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="#" type="index"> </el-table-column>
          <el-table-column label="属性名称" prop="attr_name"> </el-table-column>
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
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="2">
        <el-button type="primary">设置静态参数</el-button>
        <el-table :data="arrStaticparams" style="width: 100%">
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column prop="attr_name" label="属性名称"></el-table-column>
          <el-table-column prop="attr_vals" label="属性值"> </el-table-column>
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
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  name: "cateparams",
  data() {
    return {
      // 级联选择器要用的数据
      /**
       *  1、:options=数组List[] 数据源
       *  2、v-modal="selectedOptions" 最终选择的label对应的value会在selectedOptions数组中
       *  3、:props={"label":"label","value":"value","children":"children"}
       */
      options: [],
      selectedOptions: [],
      defaultProp: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      // 动态参数的数据数组
      arrDyparams: [],
      // 标签页
      active: "1",
      list: [],
      // 动态编辑标签
      inputVisible: false,
      inputValue: "",
      //静态参数的数据数组
      arrStaticparams: []
    };
  },
  created() {
    this.getGoodsCate();
  },
  methods: {
    async handleChange() {
      if (this.selectedOptions.length === 3) {
        // 获取动态参数
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=many`
        );
        this.arrDyparams = res.data.data;
        this.arrDyparams.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.trim().split(",");
        });
        console.log(this.arrDyparams);
      }
    },
    // 获取三级分类的信息
    async getGoodsCate() {
      const res = await this.$http.get(`categories?type=3`);
      console.log(res);
      this.options = res.data.data;
    },
    // 标签页
    async handleClick() {
      if (this.active === "2") {
        // 获取静态参数的数据
        if (this.selectedOptions.length !== 3) {
          this.$message.error("请先选择三级分类！");
          return;
        } else {
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=only`
          );
          this.arrStaticparams = res.data.data;
          console.log(this.arrStaticparams);
        }
      }
    },
    // 动态编辑标签
    // 点击 X 按钮
    async handleClose(attrRow, attr_id, tag) {
      /*
        发送请求
        URL： PUT  categories/:id/attributes/:attrId
        请求体：
        {attr_name:?, attr_sel:?, attr_vals:?}
        attr_name	参数名称	不能为空
        attr_sel	[only,many]	不能为空
        attr_vals	如果是 many 就需要填写值的选项，以逗号分隔
      */
      //
      let putData = {
        attr_name: attrRow.attr_name,
        attr_sel: "many",
        attr_vals: attrRow.attr_vals.join(",")
      };
      const res = await this.$http.put(
        `categories/${this.selectedOptions[2]}/attributes/${attrRow.attr_id}`,
        putData
      );
      console.log(res);
      const {
        data,
        meta: { msg, status }
      } = res.data;

      if (status === 200) {
        attrRow.attr_vals.splice(attrRow.attr_vals.indexOf(tag), 1);
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    // 点击New Tab+ 按钮
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 触发 回车键 或 失去焦点
    async handleInputConfirm(attrRow) {
      let inputValue = this.inputValue;
      if (inputValue) {
        attrRow.attr_vals.push(inputValue);
        // 发送请求
        let putData = {
          attr_name: attrRow.attr_name,
          attr_sel: "many",
          attr_vals: attrRow.attr_vals.join(",")
        };
        const res = await this.$http.put(
          `categories/${this.selectedOptions[2]}/attributes/${attrRow.attr_id}`,
          putData
        );
        console.log(res);
        const {
          data,
          meta: { msg, status }
        } = res.data;

        if (status === 200) {
          this.$message.success(msg);
        } else {
          this.$message.error(msg);
        }
      }
      this.inputVisible = false;
      this.inputValue = "";
    }
  }
};
</script>

<style>
.el-alert,
.el-form {
  margin-top: 20px;
}
/* 动态编辑标签 */
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
