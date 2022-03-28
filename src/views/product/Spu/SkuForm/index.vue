<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">
        {{spuName}}
      </el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input placeholder="价格(元)" type="number" v-model="skuInfo.price"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" rows="4" placeholder="规则描述" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form ref="form" :inline="true" label-width="80px" v-for="attrInfo in attrInfoList" :key="attrInfo.id">
          <el-form-item :label="attrInfo.attrName">
            <el-select value="" placeholder="请选择" v-model="attrInfo.attrIdAndValueId">
              <el-option :label="attrValue.valueName" :value="`${attrInfo.id}:${attrValue.id}`" v-for="attrValue in attrInfo.attrValueList" :key="attrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form ref="form" :inline="true" label-width="80px" v-for="saleAttr in spuSaleAttrList" :key="saleAttr.id">
          <el-form-item :label="saleAttr.saleAttrName">
            <el-select value="" placeholder="请选择" v-model="saleAttr.attrIdAndValueId">
              <el-option :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" v-for="saleAttrValue in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table style="width: 100%" border :data="spuImageList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{row}">
              <el-image style="width: 100px; height: 100px" :src="row.imgUrl"></el-image>
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row}">
              <el-button type="primary" size="mini" v-if="!row.defaultImg" @click="setDefault(row)">设为默认</el-button>
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveButton">保存</el-button>
        <el-button @click="cancelButton">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imageList: [],
      spuImageList: [],
      spuSaleAttrList: [],
      attrInfoList: [],
      skuInfo: {
        // 第一类，父组件传过来的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        // 第二类，通过数据双向绑定收集到的数据
        price: 0,
        skuDesc: "",
        skuName: "",
        weight: "",
        // 第三类，需要自己手写代码
        // 平台属性
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   skuId: 0,
          // },
        ],
        skuDefaultImg: "",
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],
        // 销售属性
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ],
      },
      spuName: "",
    };
  },
  methods: {
    async getData(row, categoryId) {
      this.spuName = row.spuName;
      // 收集父组件传来的数据
      this.skuInfo.category3Id = categoryId.category3Id;
      this.skuInfo.spuId = row.id;
      this.skuInfo.tmId = row.tmId;
      let imageListResult = await this.$API.spu.reqGetSpuImageList(row.tmId);
      if (imageListResult.code === 200) {
        imageListResult.data.forEach((element) => {
          element.defaultImg = 0;
        });
        this.spuImageList = imageListResult.data;
      }
      let saleAttrList = await this.$API.spu.reqGetSpuSaleAttrList(row.tmId);
      if (saleAttrList.code === 200) {
        this.spuSaleAttrList = saleAttrList.data;
      }
      let attrInfoList = await this.$API.spu.reqGetAttrInfoList(categoryId);
      if (attrInfoList.code === 200) {
        this.attrInfoList = attrInfoList.data;
      }
    },
    // 将图片设置为默认图片
    setDefault(row) {
      this.spuImageList.forEach((element) => {
        element.defaultImg = 0;
      });
      row.defaultImg = 1;
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    // 当选择项发生变化时会触发该事件
    handleSelectionChange(selection) {
      this.imageList = selection;
    },
    // 取消按钮的回调
    cancelButton() {
      Object.assign(this._data, this.$options.data());
      this.$emit("changeFlag2", 0);
    },
    // 保存按钮的回调
    async saveButton() {
      // 整理skuInfo参数
      this.attrInfoList.forEach((item) => {
        if (item.attrIdAndValueId) {
          const [attrId, skuId] = item.attrIdAndValueId.split(":");
          this.skuInfo.skuAttrValueList.push({ attrId, skuId });
        }
      });
      this.spuSaleAttrList.forEach((item) => {
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] = item.attrIdAndValueId;
          this.skuInfo.skuSaleAttrValueList.push({
            saleAttrId,
            saleAttrValueId,
          });
        }
      });
      this.imageList.forEach((item) => {
        this.skuInfo.skuImageList.push({
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.defaultImg,
          spuImgId: item.id,
        });
      });
      let result = await this.$API.spu.reqSaveSkuInfo(this.skuInfo);
      if (result.code === 200) {
        this.$message({ type: "success", message: "添加成功" });
        Object.assign(this._data, this.$options.data());
        this.$emit("changeFlag2", 0);
      }
    },
  },
};
</script>

<style>
</style>