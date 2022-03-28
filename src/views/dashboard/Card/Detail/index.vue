<template>
  <div>
    <el-card>
      <div class="header">
        {{title}}
        <svg t="1648382500878" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2208" width="16" height="16">
          <path d="M536 480v192a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16V480a16 16 0 0 1 16-16h16a16 16 0 0 1 16 16z m-32-128h16a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16v-32a16 16 0 0 1 16-16z m8 448c159.056 0 288-128.944 288-288s-128.944-288-288-288-288 128.944-288 288 128.944 288 288 288z m0 48c-185.568 0-336-150.432-336-336s150.432-336 336-336 336 150.432 336 336-150.432 336-336 336z" p-id="2209"></path>
        </svg>
      </div>
      <div class="content">{{content}}
      </div>
      <div class="charts">
        <slot name="charts"></slot>
      </div>
      <div class="footer">
        <slot name="footer"></slot>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "detail",
  data() {
    return {};
  },
  props: ["title", "content"],
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  color: #d9d9d9;
}
.content{
  font-size: 30px;
  padding: 10px 0;
}
.charts{
  height: 40px;
}
.footer {
  border-top: 1px solid;
  margin-top: 10px;
  padding: 5px 0px;
}
</style>