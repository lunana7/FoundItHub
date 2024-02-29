<template>
  <div class="header">
    <div class="container">
      <!-- <h1>header</h1> -->
      <div class="logo-container">
        <div class="img" @click="toIndex">
          <img src="../assets/logo.png" alt="" />
        </div>
        <div class="text" @click="toIndex">
          <p class="title">FoundIt</p>
          <p class="describe">Hub</p>
        </div>
      </div>

      <div class="menu-container">
        <el-menu
          router
          :default-active="this.$route.path"
          class="el-menu-demo"
          mode="horizontal"
          background-color="#ddd"
          text-color="#333"
          active-text-color="#666"
        >
          <el-menu-item
            v-for="item in menuData"
            :key="item.name"
            :index="item.index"
            >{{ item.label }}</el-menu-item
          >
        </el-menu>
      </div>

      <div class="login-container" v-if="isLogin">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link" style="color: rgb(0, 0, 0)">
            <i class="el-icon-s-home"></i>
            <el-avatar
              v-if="userInfo.user_pic"
              :size="40"
              :src="require('../../public/user_pic/' + userInfo.user_pic)"
            ></el-avatar>
            <el-avatar
              v-if="!userInfo.user_pic"
              :size="40"
              :src="require('../../public/no_pic/noAvatar.png')"
            ></el-avatar>
            {{ this.$store.getters.getUserInfo.nickname
            }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-user" command="my"
              >Personal Center</el-dropdown-item
            >

            <el-dropdown-item
              icon="el-icon-monitor"
              command="admin"
              v-if="this.$store.getters.getUserInfo.identity != 2"
              >Backend Management System</el-dropdown-item
            >
            <el-dropdown-item icon="el-icon-switch-button" command="logout"
              >Log out</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <div class="noLogin-container" v-if="!isLogin">
        <p>Guest</p>
        <el-button plain @click="goLoginRegister">Login</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import http from "../utils/request";
import { getCurrentDate } from "../utils/methods";
export default {
  data() {
    return {
      userInfo: {},
      isLogin: false,

      taskCount: 0,
      menuData: [
        {
          path: "/",
          name: "frontIndex",
          label: "Home Page",
          index: "/frontIndex",
        },
        {
          path: "/",
          name: "frontClaim",
          label: "Lost and Found",
          index: "/frontClaim",
        },
        {
          path: "/",
          name: "frontRevert",
          label: "Post Lost Item",
          index: "/frontRevert",
        },
        {
          path: "/",
          name: "frontComments",
          label: "Comments",
          index: "/frontComments",
        },
        {
          path: "/",
          name: "frontNav",
          label: "Contact Us",
          index: "/frontNav",
        },
      ],
    };
  },
  methods: {
    getUserInfo() {
      this.userInfo = { ...this.$store.getters.getUserInfo };
    },
    toIndex() {
      this.$router.push("/frontIndex");
    },
    handleCommand(command) {
      if (command === "my") {
        this.$router.push("/user/userInfo");
      }

      if (command === "logout") {
        if (this.$store.getters.getLoginDate) {
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
                console.log("Historical data added successfully!");
              }
            })
            .catch((err) => {
              console.log(err, "HTTP request failed");
            });
        }
        // Clear the loginDate in the store
        this.$store.dispatch("asyncUpdateLoginDate", "");
        // Clear the Token in the store
        this.$store.dispatch("asyncUpdateUserToken", "");
        // Clear the value of userInfo in the store (initial value is an Object)
        this.$store.dispatch("asyncUpdateUserInfo", {});
        // Clear the Token in sessionStorage
        sessionStorage.removeItem("Token");
        // Change the login status this.isLogin to false
        this.isLogin = false;
        // Route jump, if the current page is not the homepage, then jump to the homepage
        if (this.$route.path !== "/frontIndex") {
          this.$router.push("/");
        }
      }
      // Enter the backend
      if (command === "admin") {
        if (this.$store.getters.getUserInfo.adminLOA === "1") {
          if (this.$store.getters.getLoginDate == "") {
            this.$store.dispatch("asyncUpdateLoginDate", getCurrentDate());
          }
          this.$router.push("/adminMain");
          this.getVerifyTask();
        } else {
          this.$message.warning("You do not have backend permissions!");
        }
      }
    },

    goLoginRegister() {
      this.$router.push("/loginRegister");
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
    getVerifyTask() {
      let claimTask = [];
      let revertTask = [];
      http({
        method: "get",
        url: "http://127.0.0.1:3007/admin/getClaimVerifyList",
        headers: {
          Authorization: this.$store.getters.getUserToken,
        },
      })
        .then((res) => {
          if (res.data.status === 0) {
            claimTask = [...res.data.data];
            http({
              method: "get",
              url: "http://127.0.0.1:3007/admin/getRevertVerifyList",
              headers: {
                Authorization: this.$store.getters.getUserToken,
              },
            })
              .then((res) => {
                if (res.data.status === 0) {
                  revertTask = [...res.data.data];
                  if (claimTask.length != 0 || revertTask != 0) {
                    this.$notify.info({
                      title: "Pending Applications",
                      dangerouslyUseHTMLString: true,
                      duration: 5000, // Display time in milliseconds 1000ms == 1s
                      message:
                        claimTask.length +
                        " claim task applications, </p><p>" +
                        revertTask.length +
                        ' return task applications.</p><p>Please handle in the following "Application Handling"</P>',
                      offset: 78,
                      position: "top-left",
                    });
                  }
                }
              })
              .catch((err) => {
                console.log(err, "HTTP request failed");
              });
          }
        })
        .catch((err) => {
          console.log(err, "HTTP request failed");
        });
    },
  },
  mounted() {
    this.getUserInfo();
    this.activeIndex = this.$route.path;

    if (
      this.$store.getters.getUserInfo.nickname != "" &&
      this.$store.getters.getUserToken
    ) {
      this.isLogin = true;
    }
  },
};
</script>

<style lang="less" scoped>
.header {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(255, 255, 255);
  font-family: "Titillium Web", sans-serif;

  .container {
    width: 98%;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: "Titillium Web", sans-serif;
    .logo-container {
      width: 25%;
      display: flex;
      flex-direction: row;
      align-items: center;

      .img {
        width: 50px;
        height: 50px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: #d8c1ed;
        }
      }
      .img:hover {
        cursor: pointer;
        transform: scale(1.1);
      }
      .text {
        margin-left: 10px;
        color: #000000;
        font-size: 20px;
        font-weight: bold;
        text-transform: uppercase;
      }
      .text:hover {
        cursor: pointer;
        transform: scale(1.1);
      }
    }

    .menu-container {
      width: 80%;
      .el-menu {
        .el-menu-item {
          width: 20%;
          text-align: center;
          font-size: 18px;
        }
      }
    }

    .login-container {
      height: 100%;
      width: 25%;
      padding: 0 10px 0 0;
      display: flex;
      flex-direction: row;
      justify-content: flex-end; /* 调整为右对齐 */
      align-items: center;
      font-size: 17px;

      .el-dropdown {
        font-size: 16px;
        /deep/.el-avatar {
          position: relative;
          top: 10px;
        }
      }

      .loginBtn {
        line-height: 60px;
      }
    }

    .noLogin-container {
      width: 25%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      font-size: 16px;

      p {
        padding: 0 20px;
        color: rgb(0, 0, 0);
      }
    }
  }
}
</style>
