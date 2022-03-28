<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId" :show="flag !== 0"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="flag===0">
        <el-button type="primary" icon="el-icon-plus" :disabled="!categoryId.category3Id" @click="addSpu">添加spu</el-button>
        <el-table style="width: 100%" border :data="spuList">
          <el-table-column type="index" align="center" label="序号" width="80px">
          </el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="spu描述" width="width">
          </el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="{row}">
              <el-button type="success" icon="el-icon-plus" size="mini" title="添加sku" @click="addSku(row)"></el-button>
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="editSpu(row)" title="修改spu"></el-button>
              <el-button type="info" icon="el-icon-info" size="mini" title="查看当前spu所有sku列表" @click="showSkuList(row)"></el-button>
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)">
                <el-button type="danger" icon="el-icon-delete" size="mini" title="删除" style="margin-left:10px" slot="reference"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination style="text-align:center" :current-page="currentPage" :page-sizes="[3, 5, 7]" :page-size="limit" :total="total" layout="prev, pager, next, jumper ,->,sizes,total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
        </el-pagination>
      </div>
      <SkuForm v-show="flag===1" @changeFlag2="changeFlag2" ref="sku"></SkuForm>
      <SpuForm v-show="flag===2" @changeFlag="changeFlag" ref="spu"></SpuForm>
    </el-card>

    <el-dialog :title="spuName" :visible.sync="dialogVisible" width="width" :before-close="dialogBeforeClose" v-loading="loading">
      <el-table :data="skuList" style="width: 100%">
        <el-table-column prop="skuName" label="名称" width="width">
        </el-table-column>
        <el-table-column prop="price" label="价格" width="width">
        </el-table-column>
        <el-table-column prop="weight" label="重量" width="width">
        </el-table-column>
        <el-table-column prop="prop" label="默认图片" width="width">
          <template slot-scope="{row}">
            <el-image style="width: 100px; height: 100px" :src="row.skuDefaultImg"></el-image>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SkuForm from "./SkuForm";
import SpuForm from "./SpuForm";
export default {
  name: "spu",
  components: {
    SkuForm,
    SpuForm,
  },
  data() {
    return {
      dialogVisible: false,
      spuName: "",
      categoryId: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      limit: 3,
      currentPage: 1,
      total: 0,
      spuList: [],
      flag: 0, //0 首页   1 sku   2 spu
      skuList: [],
      // sku列表展示的加载框
      loading: true,
    };
  },
  methods: {
    // 从categoryId组件中获取categoryId
    getCategoryId(categoryId) {
      this.categoryId = categoryId;
      this.getSpuList();
    },
    // 获取服务器数据
    async getSpuList() {
      const { categoryId, limit, currentPage } = this;
      let result = await this.$API.spu.reqSpuList(
        limit,
        currentPage,
        categoryId.category3Id
      );
      if (result.code === 200) {
        this.spuList = result.data.records;
        this.total = result.data.total;
      }
    },
    // 当每页的展示个数改变时触发
    handleSizeChange(pageSize) {
      this.limit = pageSize;
      this.getSpuList();
    },
    // 当前页改变时触发
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getSpuList();
    },
    // 添加spu
    addSpu() {
      this.flag = 2;
      // 触发子组件spu的事件，并将3id传过去。
      this.$refs.spu.getData(this.categoryId.category3Id);
    },
    // 修改spu
    editSpu(row) {
      this.flag = 2;
      this.$refs.spu.request(row);
    },
    // 修改flag值，spu子组件的事件回调
    changeFlag(object) {
      const { flag, type } = object;
      this.flag = flag;
      if (type === "add") {
        this.currentPage = 1;
        this.getSpuList();
      } else {
        this.getSpuList();
      }
    },
    // 修改flag值，sku子组件的事件回调
    changeFlag2(flag) {
      this.flag = flag;
    },
    // 删除Spu
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code === 200) {
        this.$message("删除成功");
        this.getSpuList();
      }
    },
    // 添加Sku
    addSku(row) {
      this.flag = 1;
      this.$refs.sku.getData(row, this.categoryId);
    },
    // 使用dialog展示spu的sku列表
    async showSkuList(spu) {
      this.spuName = spu.spuName;
      this.dialogVisible = true;
      const result = await this.$API.spu.reqGetSkuList(spu.tmId);
      if (result.code === 200) {
        this.skuList = result.data;
        this.loading = false;
      }
    },
    dialogBeforeClose(done) {
      this.spuName = "";
      this.skuList = [];
      this.loading = true;
      done();
    },
  },
};
</script>

<style>
</style>