<template>
  <el-card>
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <!-- 消息提示框 -->
    <el-alert title="成功提示的文案" type="success" center show-icon>
    </el-alert>
    <!-- 步骤条 -->
    <el-steps
      :active="1 * active"
      finish-status="success"
      simple
      style="margin-top: 10px"
    >
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!--
      标签页
        最外层是 el-form
    -->
    <el-form label-width="80px" :model="form" size="mini" label-position="top">
      <el-tabs
        v-model="active"
        tab-position="left"
        style="height: auto;"
        @tab-click="tabChange()"
      >
        <!-- 1 -->
        <el-tab-pane label="基本信息" name="1" style="padding-top: 20px;">
          <el-form-item label="商品名称" label-width="100px">
            <el-input v-model="form.goods_name" style="width:50%"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" label-width="100px">
            <el-input v-model="form.goods_price" style="width:50%"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" label-width="100px">
            <el-input v-model="form.goods_weight" style="width:50%"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" label-width="100px">
            <el-input v-model="form.goods_number" style="width:50%"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" label-width="100px">
            <el-cascader
              expand-trigger="click"
              :options="options"
              v-model="selectedOptions"
              :props="defaultProp"
              @change="handleChange"
              style="width:50%"
              clearable
            >
            </el-cascader>
          </el-form-item>
        </el-tab-pane>
        <!-- 2 -->
        <el-tab-pane label="商品参数" name="2">
          <!-- 显示的是该三级分类的商品参数 -->
          <el-form-item
            :label="item1.attr_name"
            label-width="100px"
            v-for="(item1, i) in arrDyparams"
            :key="i"
          >
            <!-- 复选框组 -->
            <el-checkbox-group v-model="item1.attr_vals" size="small">
              <el-checkbox
                :label="item2"
                border
                v-for="(item2, i) in item1.attr_vals"
                :key="i"
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-alert
            title="暂无可配置的商品参数"
            type="info"
            show-icon
            center
            :closable="false"
            v-if="arrDyparams.length === 0"
          >
          </el-alert>
        </el-tab-pane>
        <!-- 3 -->
        <el-tab-pane label="商品属性" name="3">
          <!-- 静态参数的数据 -->
          <el-form-item
            :label="item.attr_name"
            label-width="100px"
            v-for="(item, index) in arrStaticparams"
            :key="index"
          >
            <el-input v-model="item.attr_vals" style="width:50%"></el-input>
          </el-form-item>
          <el-alert
            title="暂无可配置的商品属性"
            type="info"
            show-icon
            center
            :closable="false"
            v-if="arrStaticparams.length === 0"
          >
          </el-alert>
        </el-tab-pane>
        <!-- 4 -->
        <el-tab-pane label="商品图片" name="4">
          <!--
            baseUrl -> axios 的配置路径
           -->
          <el-form-item>
            <el-upload
              action="http://localhost:8888/api/private/v1/upload"
              :headers="headers"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :on-error="handleError"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-form-item>
        </el-tab-pane>
        <!-- 5 -->
        <el-tab-pane label="商品内容" name="5">
          <el-form-item>
            <!-- 表单元素 所有商品参数信息提交按钮 -->
            <el-button size="small" type="primary" @click.prevent="addGoods()"
              >点我-添加商品</el-button
            >
            <!-- 富文本 quillEditor-->
            <quill-editor v-model="form.goods_introduce"></quill-editor>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";

export default {
  name: "goodsadd",
  components: {
    quillEditor
  },
  data() {
    return {
      tabPosition: "left",
      active: "1",
      /*
        参数名	           参数说明	                 备注
        goods_name	      商品名称	                不能为空
        goods_cat	        以为','分割的分类列表	     不能为空 --> selectedOptions ->逗号分隔字符串
        goods_price	      价格	                    不能为空
        goods_number	    数量	                    不能为空
        goods_weight	    重量	                    不能为空
        goods_introduce	  介绍	                    可以为空
        pics	            上传的图片临时路径（对象）	可以为空
        attrs	            商品的参数（数组）	        可以为空
      */
      form: {
        goods_name: "",
        goods_cat: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "商品简介",
        pics: [],
        attrs: []
      },
      // 级联选择器要用的数据
      /**
       *  1、:options=数组List[] 数据源
       *  2、v-modal="selectedOptions" 最终选择的label对应的value会在selectedOptions数组中
       *  3、:props={"label":"label","value":"value","children":"children"}
       */
      options: [],
      selectedOptions: [52, 64, 84],
      defaultProp: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      // 动态参数的数据数组
      arrDyparams: [],
      //静态参数的数据数组
      arrStaticparams: [],
      headers: {
        Authorization: localStorage.getItem("token")
      }
    };
  },
  created() {
    this.getGoodsCate();
  },
  methods: {
    handleChange() {},
    // 获取三级分类的信息
    async getGoodsCate() {
      const res = await this.$http.get(`categories?type=3`);
      console.log(res);
      this.options = res.data.data;
    },
    // 点击不同的tab
    async tabChange() {
      // 如果点击的是第二个tab是触发，同时判断三级分类有值
      if (this.active === "2") {
        if (this.selectedOptions.length !== 3) {
          this.$message.error("请先选择三级分类！");
          return;
        } else {
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=many`
          );
          console.log(res);
          // attr_name  attr_vals
          this.arrDyparams = res.data.data;

          this.arrDyparams.forEach(item => {
            // if (item.attr_vals.length === 0) {
            //   item.attr_vals = [];
            // } else {
            //   item.attr_vals = item.attr_vals.trim().split(",");
            // }
            item.attr_vals =
              item.attr_vals.length === 0
                ? []
                : item.attr_vals.trim().split(",");
          });
        }
      } else if (this.active === "3") {
        if (this.selectedOptions.length !== 3) {
          this.$message.error("请先选择三级分类！");
          return;
        } else {
          // 获取静态参数的数据
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=only`
          );
          console.log(res);
          // attr_name  attr_vals
          this.arrStaticparams = res.data.data;
        }
      }
    },
    // 图片上传
    // file 形参是当前操作的图片相关信息（图片名称，图片路径等）
    handlePreview(file) {
      console.group("--- 图片上传 点击文件列表中已上传的文件 ---");
      console.log(file);
      console.groupEnd();
    },
    handleRemove(file) {
      console.group("--- 图片上传 移除 ---");
      console.log(file);
      // file.response.data.tmp_path
      console.groupEnd();
      // 从 this.form.pics 移除当前 删除掉的图片
      // this.form.pics.splice(索引，长度)
      // findIndex((item)=>{}) 遍历 ，把符合条件的元素的索引返回
      let Index = this.form.pics.findIndex(item => {
        return item.pic === file.response.data.tmp_path;
      });
      this.form.pics.splice(Index, 1);
      console.log(this.form.pics);
    },
    handleSuccess(response, file) {
      console.group("--- 图片上传 成功 ---");
      console.log(response);
      console.log(file);
      // file.data.response.data.tmp_path
      console.groupEnd();
      this.form.pics.push({
        pic: response.data.tmp_path
      });
    },
    handleError(err, file) {
      console.error(err);
    },
    // 添加商品 所有商品参数信息提交
    /*
      参数名	           参数说明	                 备注
        goods_name	      商品名称	                不能为空
        goods_cat	        以为','分割的分类列表	     不能为空 --> selectedOptions ->逗号分隔字符串
        goods_price	      价格	                    不能为空
        goods_number	    数量	                    不能为空
        goods_weight	    重量	                    不能为空
        goods_introduce	  介绍	                    可以为空
        pics	            上传的图片临时路径（对象）	可以为空
        attrs	            商品的参数（数组）	        可以为空
      form: {
        goods_name: "商品名称",
        goods_cat: "",  -> this.selectedOptions ->string
        goods_price: "价格",
        goods_number: "数量",
        goods_weight: "重量",
        goods_introduce: "介绍",
        pics: [], ->{pic:"图片临时路径"}
        attrs: [] ->商品的动态参数，静态参数
      },
    */
    async addGoods() {
      /*
        请求发送前处理数据 this.form
        1、级联选择器
        this.form.goods_cat = this.selectedOptions
        2、图片临时上传成功，this.form.pics 增加数据
        this.form.pics.push()
        3、
        this.form.attrs[{attr_id:?, attr_value:?}]
        动态参数的数据数组arrDyparams: []
        静态参数的数据数组arrStaticparams: []
      */
      console.group("--- 动态参数的数据数组 ---");
      console.log(this.arrDyparams);
      console.groupEnd();

      console.group("--- 静态参数的数据数组 ---");
      console.log(this.arrStaticparams);
      console.groupEnd();

      // 动态参数的数据数组
      // 遍历 + 取值 + 放在一个新数组中  => arr.map((item)=>{return 返回值})
      let arr1 = this.arrDyparams.map(item => {
        // item.attr_id   和  item.attr_vals
        return { attr_id: item.attr_id, attr_value: item.attr_vals };
      });
      console.log(arr1);

      // 静态参数的数据数组
      let arr2 = this.arrStaticparams.map(item => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals };
      });
      console.log(arr2);

      this.form.goods_cat = this.selectedOptions.join(",");
      this.form.attrs = [...arr1, ...arr2];
      console.log(this.form.attrs);
      const res = await this.$http.post(`goods`, this.form);
      console.log(res);
      //成功 回到商品列表页面
      if(res.data.meta.status === 201){
        this.$router.push({name:'goods'})
      }else{
        this.$message.error(res.data.meta.msg)
      }
    }
  }
};
</script>

<style>
.el-alert,
.el-tabs {
  margin: 10px 0px;
}
.el-steps--simple {
  padding: 10px 8%;
}
.el-step.is-simple .el-step__title {
  font-size: 14px;
}
.quill-editor {
  margin-top: 10px;
}
.ql-editor {
  height: 215px;
}
</style>
