<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spuInfo">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spuInfo.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spuInfo.tmId">
          <el-option :label="item.tmName" :value="item.id" v-for="item in tradeMarkInfo" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input type="textarea" placeholder="SPU描述" rows="4" v-model="spuInfo.description"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload action="/dev-api//admin/product/fileUpload" list-type="picture-card" :file-list="spuImageInfo" :on-success="handleSuccess" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select :placeholder="`还有${unSelectSaleAttr.length}未选择`" v-model="saleObject">
          <el-option :label="unSelect.name" :value="{id:unSelect.id,name:unSelect.name}" v-for="(unSelect) in unSelectSaleAttr" :key="unSelect.id"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" :disabled="saleObject === null" @click="addSaleAttr">添加销售属性</el-button>
        <el-table style="width: 100%" border :data="spuInfo.spuSaleAttrList">
          <el-table-column type="index" align="center" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="200">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{row}">
              <el-tag :key="tag.id" v-for="(tag,index) in row.spuSaleAttrValueList" closable :disable-transitions="true" @close="row.spuSaleAttrValueList.splice(index,1)">
                {{tag.saleAttrValueName}}
              </el-tag>
              <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(row)" @blur="handleInputConfirm(row)">
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="200">
            <template slot-scope="{$index}">
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="spuInfo.spuSaleAttrList.splice($index,1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpuInfo">保存</el-button>
        <el-button @click="cancelButton">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      spuInfo: {
        category3Id: 0,
        description: "",
        tmId: "",
        spuName: "",
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
      },
      tradeMarkInfo: [],
      spuImageInfo: [],
      saleInfo: [],
      saleObject: null,
    };
  },
  methods: {
    // 上传照片成功触发
    handleSuccess(response, file, fileList) {
      if (response.code === 200) {
        this.spuImageInfo = fileList;
      }
    },
    // 删除照片触发
    handleRemove(file, fileList) {
      this.spuImageInfo = fileList;
    },
    // 预览照片触发
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    async request(row) {
      let spuInfoResult = await this.$API.spu.reqSpuInfo(row.id);
      if (spuInfoResult.code === 200) {
        this.spuInfo = spuInfoResult.data;
      }
      let tradeMarkInfoResult = await this.$API.spu.reqTradeMarkInfo();
      if (tradeMarkInfoResult.code === 200) {
        this.tradeMarkInfo = tradeMarkInfoResult.data;
      }
      let spuImageInfoResult = await this.$API.spu.reqSpuImageInfo(row.id);
      if (spuImageInfoResult.code === 200) {
        this.spuImageInfo = spuImageInfoResult.data;
        this.spuImageInfo.map((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
      }
      let saleInfoResult = await this.$API.spu.reqSaleInfo();
      if (saleInfoResult.code === 200) {
        this.saleInfo = saleInfoResult.data;
      }
    },
    // 添加销售属性按钮的回调函数
    addSaleAttr() {
      let saleAttrName = this.saleObject.name;
      let spuId = this.saleObject.id;
      let spuSaleAttrValueList = [];
      this.spuInfo.spuSaleAttrList.push({
        saleAttrName,
        spuId,
        spuSaleAttrValueList,
      });
      this.saleObject = null;
    },

    // tag变input框以及处理数据
    showInput(row) {
      this.$set(row, "inputVisible", true);
      this.$set(row, "inputValue", "");
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // input框变tag
    handleInputConfirm(row) {
      const { saleAttrName, inputValue } = row;
      if (inputValue.trim() === "") {
        this.$message("请输入有效的属性值");
        return;
      }
      const result = row.spuSaleAttrValueList.every(
        (item) => item.saleAttrValueName !== inputValue.trim()
      );
      if (!result) {
        this.$message("该属性已存在");
        return;
      }
      row.spuSaleAttrValueList.push({
        saleAttrName,
        saleAttrValueName: inputValue,
      });
      row.inputVisible = false;
    },
    // 保存按钮的回调
    async addOrUpdateSpuInfo() {
      this.spuInfo.spuImageList = this.spuImageInfo.map((item) => {
        return {
          imgName: item.name,
          imgUrl: (item.response && item.response.data) || item.imgUrl,
        };
      });
      const result = await this.$API.spu.reqAddOrUpdateSpuInfo(this.spuInfo);
      if (result.code === 200) {
        this.$message({ type: "success", message: "保存成功" });
        if (this.spuInfo.id) {
          this.$emit("changeFlag", { flag: 0, type: "update" });
        } else {
          this.$emit("changeFlag", { flag: 0, type: "add" });
        }
        Object.assign(this._data, this.$options.data());
      }
    },
    // 取消按钮，不保存修改的按钮
    cancelButton() {
      Object.assign(this._data, this.$options.data());
      this.$emit("changeFlag", { flag: 0, type: "cancel" });
    },
    // 添加spu按钮的回调
    async getData(category3Id) {
      this.spuInfo.category3Id = category3Id;
      let tradeMarkInfoResult = await this.$API.spu.reqTradeMarkInfo();
      if (tradeMarkInfoResult.code === 200) {
        this.tradeMarkInfo = tradeMarkInfoResult.data;
      }
      let saleInfoResult = await this.$API.spu.reqSaleInfo();
      if (saleInfoResult.code === 200) {
        this.saleInfo = saleInfoResult.data;
      }
    },
  },
  computed: {
    unSelectSaleAttr() {
      return this.saleInfo.filter((item) => {
        return this.spuInfo.spuSaleAttrList.every((item1) => {
          return item.name !== item1.saleAttrName;
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
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