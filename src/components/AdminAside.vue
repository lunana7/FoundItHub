<template>
  <!-- <h1>AdminAside</h1> -->
  <div class="container">
    <el-menu
      router
      :unique-opened="true"
      :default-active="this.$route.path"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      background-color="#1e2125"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <div class="userInfo">
        <div class="background">
          <el-avatar
            v-if="userInfo.user_pic"
            :size="80"
            :src="require('../../public/user_pic/' + userInfo.user_pic)"
            style="margin-right: 10px"
          ></el-avatar>
          <el-avatar
            v-if="!userInfo.user_pic"
            :size="80"
            :src="require('../../public/no_pic/noAvatar.png')"
            style="margin-right: 10px"
          ></el-avatar>
          <div style="padding: 10px 0">
            {{ userInfo.identity ? "Administrator" : "Administrator" }}
          </div>
        </div>
      </div>

      <el-menu-item index="/adminIndex">
        <i class="el-icon-s-home"></i>
        <span slot="title">Home</span>
      </el-menu-item>

      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-document"></i>
          <span>Application Processing</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/claimVerify">Claim Application</el-menu-item>
          <el-menu-item index="/revertVerify">Return Application</el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-s-custom"></i>
          <span>Data Management</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/adminUserInfoManage"
            >Manage User Profiles</el-menu-item
          >
          <el-menu-item
            index="/adminManagerInfoManage"
            v-if="userInfo.identity === 1"
            >Manage Custodian Profiles</el-menu-item
          >
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-connection"></i>
          <span>Permission Management</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/adminUserLOAManage"
            >User Permission Management</el-menu-item
          >

          <el-menu-item
            index="/adminManagerLOAManage"
            v-if="userInfo.identity === 1"
            >Custodian Permission Management</el-menu-item
          >
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-document"></i>
          <span>Data Management</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/adminClaimManage"
            >Claim Information Management</el-menu-item
          >

          <el-menu-item index="/adminRevertManage"
            >Lost Item Information Management</el-menu-item
          >
        </el-menu-item-group>
      </el-submenu>

      <el-menu-item index="/adminCommentsManage" v-if="userInfo.identity === 1">
        <i class="el-icon-chat-dot-square"></i>
        <span slot="title">Comment Management</span>
      </el-menu-item>

      <el-menu-item index="/adminLoginHistory" v-if="userInfo.identity === 1">
        <i class="el-icon-time"></i>
        <span slot="title">Login History</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {},
    };
  },
  methods: {
    getUserInfo() {
      this.userInfo = { ...this.$store.getters.getUserInfo };
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  },
  mounted() {
    this.getUserInfo();
  },
};
</script>

<style lang="less" scoped>
.container {
  height: 100%;

  .el-menu {
    height: 100%;

    .userInfo {
      height: 20%;
      .background {
        color: white;
        padding: 30px 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>
