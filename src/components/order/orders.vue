<template>
  <el-card class="box-card">
    <!-- 面包屑导航 -->
    <my-bread level1="订单管理" level2="订单列表"></my-bread>
    <!-- 表格 -->
    <el-table :data="list" style="width: 100%">
      <el-table-column label="#" width="60" type="index"> </el-table-column>
      <el-table-column prop="order_number" label="订单编号"> </el-table-column>
      <el-table-column prop="order_price" label="订单价格"></el-table-column>
      <el-table-column label="是否付款">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.order_pay === '0'">已付款</el-tag>
          <el-tag v-if="scope.row.order_pay === '1'">未付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="is_send" label="是否发货"></el-table-column>
      <el-table-column prop="create_time" label="下单时间">
        <template slot-scope="scope">
          {{ scope.row.create_time | fmdate }}
        </template>
      </el-table-column>
      <el-table-column prop="id" label="操作" width="180">
        <template slot-scope="">
          <el-button
            size="mini"
            plain
            type="primary"
            icon="el-icon-edit"
            circle
            @click="editOrder()"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <!-- 编辑 -->
    <el-dialog title="修改订单" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="省市区" label-width="100px">
          <el-cascader
            expand-trigger="click"
            :options="catlist"
            v-model="selectedOptions"
            style="width:85%"
            clearable
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" label-width="100px">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 12 }"
            placeholder="请输入内容"
            style="width:85%"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="setOrder()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import cityData from "@/assets/citydata";

export default {
  name: "orders",
  data() {
    return {
      list: [],
      // 分页相关数据
      query: "",
      total: -1,
      pagenum: 1,
      pagesize: 10,
      // 编辑
      dialogFormVisibleEdit: false,
      //
      form: {},
      catlist: [],
      selectedOptions: []
    };
  },
  created() {
    this.getOrders();
  },
  methods: {
    async getOrders() {
      const res = await this.$http.get(
        `orders?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      console.log(res);
      const {
        data: { goods, total },
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.list = goods;
        this.total = total;
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    // 分页相关方法
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.getOrders();
      // this.pagenum = 1
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.getOrders();
    },
    // 编辑
    editOrder() {
      this.catlist = cityData;
      this.dialogFormVisibleEdit = true;
    },
    setOrder() {}
  }
};
</script>

<style></style>
