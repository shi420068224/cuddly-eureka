<template>
  <el-card>
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <el-row class="searchRow">
      <el-col>
        <el-input
          placeholder="请输入内容"
          v-model="query"
          class="inputSearch"
          clearable
          @clear="loadGoodsList()"
        >
          <el-button
            @click="searchGoods()"
            slot="append"
            icon="el-icon-search"
          ></el-button>
        </el-input>
        <el-button
          type="success"
          plain
          @click="$router.push({ name: 'goodsadd' })"
          >添加商品</el-button
        >
      </el-col>
    </el-row>
    <!-- 商品列表 -->
    <el-table :data="goodslist" :height="mainHeight" border style="width: 100%">
      <el-table-column
        label="#"
        width="60"
        type="index"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="goods_name"
        label="商品名称"
        width="423"
        header-align="center"
        align="left"
      ></el-table-column>
      <el-table-column
        prop="goods_price"
        label="价格(元)"
        width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="goods_weight"
        label="重量"
        width="100"
        align="center"
      ></el-table-column>
      <el-table-column label="创建日期" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.add_time | fmdate }}
        </template>
      </el-table-column>
      <el-table-column prop="id" label="操作" width="200" align="center">
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
    <!--
      分页
      @size-change    每页显示条数变化时触发
      @current-change 当前页变化时触发
      current-page    设置当前第几页
      page-sizes      每页多少条数据数组
      page-size       设置显示多少条
      total           数据总数
     -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[10, 30, 50, 100]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </el-card>
</template>

<script>
export default {
  name: "goodslist",
  data() {
    return {
      mainHeight: "-1",
      query: "",
      //分页数据
      total: -1,
      pagenum: 1,
      pagesize: 10,
      goodslist: []
    };
  },
  created() {
    const bodyHeight = document.body.clientHeight;
    console.log(bodyHeight);
    this.mainHeight = bodyHeight - 60 - 80 - 138;
  },
  mounted() {
    this.getGoodsList();
  },
  methods: {
    //获取商品列表
    async getGoodsList() {
      // query    查询条件
      // pagenum  当前页码
      // pagesize 每页显示条数
      const res = await this.$http.get(
        `goods?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      console.log(res);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.goodslist = data.goods;
        this.total = data.total;
      }
    },
    // 分页相关方法
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.getGoodsList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.getGoodsList();
    },
    //搜索框清空
    loadGoodsList() {
      this.getGoodsList();
    },
    //搜索按钮
    searchGoods() {
      this.getGoodsList();
    }
  }
};
</script>

<style>
.searchRow {
  margin-top: 20px;
}
.inputSearch {
  width: 300px;
}
.el-table {
  margin-top: 20px;
  margin-bottom: 10px;
}
</style>
