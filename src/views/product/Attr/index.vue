<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button type="primary" icon="el-icon-plus" @click="addAttrInfo" :disabled="!category3Id">添加属性</el-button>
        <el-table :data="attrList" style="width: 100%" border>
          <el-table-column type="index" label="序号" width="100px" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="200px">
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row }">
              <el-tag type="success" v-for="attrValue in row.attrValueList" :key="attrValue.id" style="margin: 0 20px">{{ attrValue.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150px">
            <template slot-scope="{ row }">
              <el-button type="warning" size="mini" icon="el-icon-edit" @click="editAttrInfo(row)"></el-button>
              <el-button type="danger" size="mini" icon="el-icon-delete"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" v-model="attrInfo">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" @click="addValueName" :disabled="!attrInfo.attrName">添加属性值</el-button>
        <el-button>取消</el-button>
        <el-table style="width: 100%; margin: 20px 0" border :data="attrInfo.attrValueList">
          <el-table-column type="index" align="center" label="序号" width="80px">
          </el-table-column>
          <el-table-column prop="index" label="属性值名称" width="width">
            <template slot-scope="{ row,$index }">
              <el-input v-model="row.valueName" :ref="$index" v-if="row.flag === true" size="mini" placeholder="请输入属性值名称" @blur="toLook(row)" @keyup.native.enter="toLook(row)"></el-input>
              <span v-else @click="toEdit(row,$index)" style="display:block">{{row.valueName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="index" label="操作" width="width">
            <template slot-scope="{ $index }">
              <el-popconfirm title="`确定删除${row.valueName}?`" @onConfirm="deleteValueName($index)">
                <el-button type="danger" icon="el-icon-delete" slot="reference" size="mini"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addOrUpdateAttr">保存</el-button>
        <el-button @click="cancelAdd">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "attr",
  data() {
    return {
      attrList: [],
      isShowTable: true,
      category3Id: "",
      categoryId: {},
      attrInfo: {
        attrName: "",
        attrValueList: [],
        categoryId: "",
        catetoryLevel: 3,
      },
    };
  },
  methods: {
    getCategoryId(categoryId) {
      this.categoryId = categoryId;
      this.category3Id = categoryId.category3Id;
      this.getAttrList();
    },
    // 获取数据
    async getAttrList() {
      let result = await this.$API.attr.reqAttrList(this.categoryId);
      console.log(result.data);
      if (result.code === 200) {
        this.attrList = result.data;
      }
    },
    // 显示添加属性组件和收集category3Id，并隐藏展示属性组件
    addAttrInfo() {
      this.isShowTable = false;
      this.attrInfo.categoryId = this.category3Id;
    },
    // 添加属性
    addValueName() {
      this.attrInfo.attrValueList.unshift({
        attrId: this.attrInfo.id,
        attrName: "",
        flag: true,
      });
      this.$nextTick(() => {
        this.$refs[0].focus();
      });
    },
    // 取消添加属性
    cancelAdd() {
      this.isShowTable = true;
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: "",
        catetoryLevel: 3,
      };
    },
    // 修改属性
    editAttrInfo(row) {
      this.isShowTable = false;
      this.attrInfo = JSON.parse(JSON.stringify(row));
      this.attrInfo.attrValueList.forEach((item) => {
        this.$set(item, "flag", false);
      });
    },
    // 将判断是否为输入框的flag置为false,变为查看模式
    toLook(row) {
      // 判断用户是否输入的是空格
      if (row.valueName.trim() === "") {
        this.$message("请你输入一个正常的属性值");
        return;
      }
      row.valueName = row.valueName.trim();
      // 判断用户输入的是否与之前的重复
      let isRepat = this.attrInfo.attrValueList.some((item) => {
        if (row !== item) {
          return row.valueName === item.valueName;
        }
      });
      if (isRepat) return;
      row.flag = false;
    },
    // 变成编辑模式
    toEdit(row, index) {
      row.flag = true;
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    // 删除某个属性
    deleteValueName(index) {
      this.attrInfo.attrValueList.splice(index, 1);
    },
    // 保存数据提交服务器
    async addOrUpdateAttr() {
      console.log(111);
      // 过滤掉空白属性值
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          if (item.valueName !== "") {
            delete item.flag;
            return true;
          }
        }
      );
      try {
        // 发送保存请求
        await this.$API.attr.reqAddOrUpdateAttrInfo(this.attrInfo);
        // 显示table
        this.isShowTable = true;
        // 提示保存成功信息
        this.$message({ type: "success", message: "保存成功" });
        // 重新拉取数据
        this.getAttrList();
        // 将attrInfo置空，反正下次进入还保留了上次的数据
        this.attrInfo = {
          attrName: "",
          attrValueList: [],
          categoryId: "",
          catetoryLevel: 3,
        };
      } catch (error) {}
    },
  },
};
</script>

<style>
</style>