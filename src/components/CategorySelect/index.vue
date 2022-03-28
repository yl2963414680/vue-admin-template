<template>
  <el-form :inline="true" class="demo-form-inline">
    <el-form-item label="一级分类">
      <el-select placeholder="请选择" v-model="categoryId.category1Id" @change="handler1">
        <el-option :label="c1.name" :value="c1.id" v-for="c1 in categoryList.categoryList1" :key="c1.id" :disabled="show"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="二级分类">
      <el-select placeholder="请选择" v-model="categoryId.category2Id" @change="handler2">
        <el-option :label="c2.name" :value="c2.id" v-for="c2 in categoryList.categoryList2" :key="c2.id" :disabled="show"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="三级分类">
      <el-select placeholder="请选择" v-model="categoryId.category3Id" @change="handler3">
        <el-option :label="c3.name" :value="c3.id" v-for="c3 in categoryList.categoryList3" :key="c3.id" :disabled="show"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "CategorySelect",
  props: ["show"],
  data() {
    return {
      categoryList: {
        categoryList1: [],
        categoryList2: [],
        categoryList3: [],
      },
      categoryId: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      attrList: [],
    };
  },
  mounted() {
    this.getCategoryList1();
  },
  methods: {
    // 获取一级分类信息
    async getCategoryList1() {
      let result = await this.$API.attr.reqCategory1Id();
      if (result.code === 200) {
        this.categoryList.categoryList1 = result.data;
      }
    },
    // 获取二级分类信息
    async handler1() {
      this.categoryId.category2Id = "";
      this.categoryId.category3Id = "";
      this.categoryList.categoryList2 = [];
      this.categoryList.categoryList3 = [];

      let result = await this.$API.attr.reqCategory2Id(
        this.categoryId.category1Id
      );
      if (result.code === 200) {
        this.categoryList.categoryList2 = result.data;
      }
    },
    // 获取三级分类信息
    async handler2() {
      this.categoryId.category3Id = "";
      this.categoryList.categoryList3 = [];
      let result = await this.$API.attr.reqCategory3Id(
        this.categoryId.category2Id
      );
      if (result.code === 200) {
        this.categoryList.categoryList3 = result.data;
      }
    },
    // 给父组件发送categoryId信息
    async handler3() {
      this.$emit("getCategoryId", this.categoryId);
    },
  },
};
</script>

<style>
</style>