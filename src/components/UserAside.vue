<template>
  <div class="container">
    <el-menu
      router
      :default-active="this.$route.path"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
    >
      <el-menu-item index="/user/userInfo">
        <i class="el-icon-user"></i>
        <span slot="title">Basic Information</span>
      </el-menu-item>
      <el-menu-item index="/user/userPwdEdit">
        <i class="el-icon-edit"></i>
        <span slot="title">Change Password</span>
      </el-menu-item>
      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-s-claim"></i>
          <span>Publication Management</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/user/userClaim">Found Information</el-menu-item>
          <el-menu-item index="/user/userRevert">Lost Information</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-s-claim"></i>
          <span>Task Management</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/user/userHandleClaim">Claim Task</el-menu-item>
          <el-menu-item index="/user/userHandleRevert"
            >Return Task</el-menu-item
          >
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  methods: {
    handleOpen(key, keyPath) {},
    handleClose(key, keyPath) {},
  },
};
</script>

<style lang="less" scoped>
.container {
  font-family: "Roboto";
  display: flex;
  justify-content: flex-end;

  .el-menu {
    height: 100%;
    font-size: 20px;
    padding: 20px;
    width: 300px;
    background-color: #93bde9;
  }

  .el-menu-item {
    margin: 10px 0;
    transition: all 0.3s ease;
    color: #000000;
  }

  .el-menu-item:hover {
    background-color: #3577bd;
    color: #ffd04b;
    transform: scale(1.05);
  }

  .el-submenu__title {
    font-weight: bold;
    color: #fff;
  }
}
</style>
