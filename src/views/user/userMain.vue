<template>
  <div class="container">
    <el-container>
      <el-aside width="180px">
        <user-aside />
      </el-aside>

      <el-main>
        <user-main />
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import UserAside from "../../components/UserAside.vue";
import UserMain from "../../components/UserMain.vue";
export default {
  data() {
    return {};
  },
  components: { UserAside, UserMain },
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;

  .el-container {
    height: 100%;

    .el-main {
      padding: 0 20px;
    }
  }

  .el-aside::-webkit-scrollbar {
    display: none;
  }
}
</style>
