<template>
  <div>
    <el-table style="width: 100%" :data="skuList">
      <el-table-column type="index" label="序号" width="width">
      </el-table-column>
      <el-table-column prop="skuName" label="名称" width="width">
      </el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width">
      </el-table-column>
      <el-table-column prop="prop" label="默认图片" width="width">
        <template slot-scope="{row}">
          <el-image style="width: 100px; height: 100px" :src="row.skuDefaultImg"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="width">
      </el-table-column>
      <el-table-column prop="price" label="价格" width="width">
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{row}">
          <el-button type="success" icon="el-icon-bottom" size="mini" v-if="row.isSale === 0" @click="cancelSale(row)"></el-button>
          <el-button type="success" icon="el-icon-top" size="mini" v-else @click="onSale(row)"></el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editting"></el-button>
          <el-button type="info" icon="el-icon-info" size="mini" @click="showDrawerFun(row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- @size-change="handleSizeChange" @current-change="handleCurrentChange" -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" style="text-align:center" :current-page="pageNum" :page-sizes="[3, 5, 7]" :page-size="pageSize" layout="prev, pager, next, jumper,->,sizes,total" :total="totalCount">
    </el-pagination>
    <!-- :before-close="handleClose" :direction="direction"  -->
    <el-drawer :visible.sync="showDrawer" :show-close="false" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{sku.skuName}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{sku.skuDesc}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{sku.price}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <template>
            <el-tag type="success" v-for="attrValue in sku.skuAttrValueList" :key="attrValue.id">{{attrValue.attrId}}:{{attrValue.valueId}}</el-tag>
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <template>
            <div class="block">
              <el-carousel trigger="click" height="500px">
                <el-carousel-item v-for="item in sku.skuImageList" :key="item.id">
                  <el-image style="width: 100%; height: 500px" :src="item.imgUrl"></el-image>
                </el-carousel-item>
              </el-carousel>
            </div>
          </template>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "sku",
  data() {
    return {
      skuList: [],
      pageNum: 1,
      pageSize: 3,
      totalCount: 10,
      showDrawer: false,
      sku: {},
    };
  },
  methods: {
    // 获取数据
    async getData() {
      const result = await this.$API.sku.reqGetSkuList(
        this.pageNum,
        this.pageSize
      );
      if (result.code === 200) {
        this.totalCount = result.data.total;
        this.skuList = result.data.records;
      }
    },
    // 修改每页最大展示数量的回调
    handleSizeChange(pageSize) {
      console.log(pageSize);
      this.pageSize = pageSize;
      this.getData();
    },
    // 修改当前第几页的回调
    handleCurrentChange(currentPage) {
      this.pageNum = currentPage;
      this.getData();
    },
    // 上架Sku
    async onSale(row) {
      const result = await this.$API.sku.reqOnSale(row.id);
      if (result.code === 200) {
        this.$message({ type: "success", message: "上架成功" });
        this.getData();
      }
    },
    // 上架Sku
    async cancelSale(row) {
      const result = await this.$API.sku.reqCancelSale(row.id);
      if (result.code === 200) {
        this.$message({ type: "success", message: "下架成功" });
        this.getData();
      }
    },
    editting() {
      this.$message("正在开发中");
    },
    // 展示抽屉
    async showDrawerFun(row) {
      this.showDrawer = true;
      const result = await this.$API.sku.reqGetSkuListById(row.id);
      console.log(result);
      if (result.code === 200) {
        this.sku = result.data;
      }
    },
  },
  mounted() {
    this.getData();
  },
};
</script>


<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.el-carousel__button {
  height: 10px;
  width: 10px;
  border-radius: 50%;
  background-color: red;
}
</style>

<style scoped>
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
}
.el-col {
  margin: 10px;
}
</style>