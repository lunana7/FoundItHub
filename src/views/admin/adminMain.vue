<template>
  <div class="container">
    <el-container>
      <el-aside width="290px">
        <admin-aside />
      </el-aside>
      <el-container>
        <el-header height="100px">
          <admin-header />
        </el-header>
        <el-main class="main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import AdminAside from "../../components/AdminAside.vue";
import AdminHeader from "../../components/AdminHeader.vue";
export default {
  data() {
    return {};
  },
  components: { AdminAside, AdminHeader },
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  .el-container {
    width: 100%;
    height: 100%;
    .el-header {
      padding: 0;
    }
    .el-main {
      margin-top: 40px;
      padding: 10px;
      overflow-x: hidden;
    }
  }
}
</style>
