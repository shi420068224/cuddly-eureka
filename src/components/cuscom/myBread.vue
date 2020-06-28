<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item>首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{ level1 }}</el-breadcrumb-item>
    <el-breadcrumb-item>{{ level2 }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name:'my-bread',
  data() {
    return {
      // level1: "",
      // level2: ""
    };
  },

  // props 值字符串数组
  // props 中的值的用法和data数据用法一样
  // props 中的数据的值 来源于使用组件时，传的值
  // props 中的数据也是该组件的属性 <child-1 :msg="abc">
  // 父 -> 子 组件之间传传值
  props: [
    'level1','level2'
  ]
};
</script>

<style></style>
