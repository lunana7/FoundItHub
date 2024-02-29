<template>
  <div class="header">
    <div class="left">
      <el-button icon="el-icon-back" circle @click="backBtn"></el-button>
      Login Time:{{ loginDate }}
    </div>

    <div class="middle">
      <i class="el-icon-s-home"></i>
      Admin Dashboard
    </div>

    <div class="right">
      <el-avatar
        v-if="userInfo.user_pic"
        :size="40"
        :src="require('../../public/user_pic/' + userInfo.user_pic)"
        style="margin-right: 15px; border: solid 1px rgb(255, 255, 255)"
      ></el-avatar>
      <el-avatar
        v-if="!userInfo.user_pic"
        :size="40"
        :src="require('../../public/no_pic/noAvatar.png')"
        style="margin-right: 10px; border: solid 1px rgb(255, 255, 255)"
      ></el-avatar>
      Welcome,{{ userInfo.nickname }}
      <el-button
        icon="el-icon-switch-button"
        circle
        @click="quitBtn"
      ></el-button>
    </div>
  </div>
</template>

<script>
import { getCurrentDate } from "../utils/methods";
import http from "../utils/request";
export default {
  data() {
    return {
      userInfo: {},
      loginDate: "",
      data: {},
    };
  },
  methods: {
    getUserInfo() {
      this.userInfo = { ...this.$store.getters.getUserInfo };
      this.data = {
        loginDate: this.$store.getters.getLoginDate,
        logoutDate: getCurrentDate(),
        userId: this.userInfo.id,
        user_pic: this.userInfo.user_pic,
        nickname: this.userInfo.nickname,
        identity: this.userInfo.identity,
      };
    },
    backBtn() {
      this.$router.push("/frontIndex");
    },
    calOnlineTime(loginDate, logoutDate) {
      var login = new Date(loginDate);
      var logout = new Date(logoutDate);
      var second = parseInt(logout - login) / 1000;
      if (0 < second && second < 60) {
        if (second < 10) {
          return "00:00:0" + second;
        } else {
          return "00:00:" + second;
        }
      } else if (60 <= second && second < 3600) {
        if (parseInt(second / 60) < 10) {
          if (second % 60 < 10) {
            return "00:0" + parseInt(second / 60) + ":0" + (second % 60);
          } else {
            return "00:0" + parseInt(second / 60) + ":" + (second % 60);
          }
        } else {
          if (second % 60 < 10) {
            return "00:" + parseInt(second / 60) + ":0" + (second % 60);
          } else {
            return "00:" + parseInt(second / 60) + ":" + (second % 60);
          }
        }
        // return parseInt(second/60) + '分' + second%60 + '秒'
      } else if (3600 <= second) {
        if (parseInt(second / 3600) < 10) {
          if (parseInt(parseInt(second % 3600) / 60) < 10) {
            if (parseInt(parseInt(second % 3600) % 60) < 10) {
              return (
                "0" +
                parseInt(second / 3600) +
                ":0" +
                parseInt(parseInt(second % 3600) / 60) +
                ":0" +
                parseInt(parseInt(second % 3600) % 60)
              );
            } else {
              return (
                "0" +
                parseInt(second / 3600) +
                ":0" +
                parseInt(parseInt(second % 3600) / 60) +
                ":" +
                parseInt(parseInt(second % 3600) % 60)
              );
            }
          } else {
            if (parseInt(parseInt(second % 3600) % 60) < 10) {
              return (
                "0" +
                parseInt(second / 3600) +
                ":" +
                parseInt(parseInt(second % 3600) / 60) +
                ":0" +
                parseInt(parseInt(second % 3600) % 60)
              );
            } else {
              return (
                "0" +
                parseInt(second / 3600) +
                ":" +
                parseInt(parseInt(second % 3600) / 60) +
                ":" +
                parseInt(parseInt(second % 3600) % 60)
              );
            }
          }
        } else {
          if (parseInt(parseInt(second % 3600) / 60) < 10) {
            if (parseInt(parseInt(second % 3600) % 60) < 10) {
              return (
                parseInt(second / 3600) +
                ":0" +
                parseInt(parseInt(second % 3600) / 60) +
                ":0" +
                parseInt(parseInt(second % 3600) % 60)
              );
            } else {
              return (
                parseInt(second / 3600) +
                ":0" +
                parseInt(parseInt(second % 3600) / 60) +
                ":" +
                parseInt(parseInt(second % 3600) % 60)
              );
            }
          } else {
            if (parseInt(parseInt(second % 3600) % 60) < 10) {
              return (
                parseInt(second / 3600) +
                ":" +
                parseInt(parseInt(second % 3600) / 60) +
                ":0" +
                parseInt(parseInt(second % 3600) % 60)
              );
            } else {
              return (
                parseInt(second / 3600) +
                ":" +
                parseInt(parseInt(second % 3600) / 60) +
                ":" +
                parseInt(parseInt(second % 3600) % 60)
              );
            }
          }
        }
      }
    },
    quitBtn() {
      this.$confirm("Are you sure you want to log out?", "Confirmation", {
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(() => {
          http({
            method: "post",
            url: "http://127.0.0.1:3007/admin/addHistory",
            headers: {
              Authorization: this.$store.getters.getUserToken,
            },
            params: {
              loginDate: this.$store.getters.getLoginDate,
              logoutDate: getCurrentDate(),
              userId: this.userInfo.id,
              user_pic: this.userInfo.user_pic,
              nickname: this.userInfo.nickname,
              identity: this.userInfo.identity,
              onlineTime: this.calOnlineTime(
                this.$store.getters.getLoginDate,
                getCurrentDate()
              ),
            },
          })
            .then((res) => {
              if (res.data.status === 0) {
                console.log("Successfully added historical data!");
              }
            })
            .catch((err) => {
              console.log(err, "HTTP request failed");
            });
          // Clear the loginDate in the store
          this.$store.dispatch("asyncUpdateLoginDate", "");
          // Clear the UserToken in the store
          this.$store.dispatch("asyncUpdateUserToken", "");
          // Clear the userInfo in the store (initial value is an Object)
          this.$store.dispatch("asyncUpdateUserInfo", {});
          // Clear the Token in sessionStorage
          sessionStorage.removeItem("Token");
          // Route jump
          this.$router.push("/loginRegister");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Cancelled logout",
          });
        });
    },
  },
  mounted() {
    this.getUserInfo();
    this.loginDate = this.$store.getters.getLoginDate;
  },
};
</script>

<style lang="less" scoped>
.header {
  font-family: "Open Sans" !important;
  width: 100%;
  height: 100%;
  background-color: #f8f9fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 3px solid #6c757d;
  .left {
    padding-left: 20px;
    display: flex;
    align-items: center;
    .el-button {
      margin-right: 10px;
      background-color: #007bff;
      color: white;
    }
  }
  .middle {
    font-size: 1.5em;
    font-weight: bolder;
    color: #343a40;
  }
  .right {
    padding-right: 20px;
    display: flex;
    align-items: center;
    .el-button {
      margin-left: 10px;
      background-color: #28a745;
      color: white;
    }
  }
}
</style>
