<template>
  <div class="container">
    <div class="one">
      <div class="box zero" @click="toUserInfoManage">
        <div class="center">
          <div class="left">
            <el-image
              style="width: 80px; height: 80px"
              :src="require('../../assets/user.png')"
            ></el-image>
          </div>
          <div class="right">
            <p class="count">{{ userList.length }}</p>
            <p class="title">Number of Users</p>
          </div>
        </div>
      </div>

      <div class="box two" @click="toManagerInfoManage">
        <div class="center">
          <div class="left">
            <el-image
              style="width: 80px; height: 80px"
              :src="require('../../assets/manager.png')"
            ></el-image>
          </div>
          <div class="right">
            <p class="count">{{ managerList.length }}</p>
            <p class="title">Number of Administrators</p>
          </div>
        </div>
      </div>

      <div class="box three" @click="toClaimManage">
        <div class="center">
          <div class="left">
            <el-image
              style="width: 80px; height: 80px"
              :src="require('../../assets/list.png')"
            ></el-image>
          </div>
          <div class="right">
            <p class="count">{{ claimList.length }}</p>
            <p class="title">Number of Lost and Found Ads</p>
          </div>
        </div>
      </div>

      <div class="box four" @click="toRevertManage">
        <div class="center">
          <div class="left">
            <el-image
              style="width: 80px; height: 80px"
              :src="require('../../assets/list.png')"
            ></el-image>
          </div>
          <div class="right">
            <p class="count">{{ revertList.length }}</p>
            <p class="title">Number of Lost Item Notices</p>
          </div>
        </div>
      </div>
    </div>
    <div class="TWO">
      <div class="left">
        <div class="lineEcharts" ref="lineEcharts"></div>
      </div>

      <div class="right top">
        <div class="claimPieEcharts" ref="claimPieEcharts"></div>
      </div>

      <div class="right bottom">
        <div class="revertPieEcharts" ref="revertPieEcharts"></div>
      </div>
    </div>

    <div class="THREE">
      <div class="three_left">
        <div class="newUser">
          <div class="newUser_title">
            <p>New</p>
            <p>User</p>
          </div>
          <div class="newUser_data">
            <div
              class="item"
              v-for="item in newUserList.slice(0, 3)"
              :key="item.id"
            >
              <div class="item_container">
                <div class="avatar">
                  <el-avatar
                    v-if="item.user_pic"
                    :size="50"
                    :src="require('../../../public/user_pic/' + item.user_pic)"
                    style="border: solid 1px black"
                  ></el-avatar>
                  <el-avatar
                    v-if="!item.user_pic"
                    :size="50"
                    :src="require('../../../public/no_pic/noAvatar.png')"
                    style="border: solid 1px black"
                  ></el-avatar>
                </div>
                <div class="nickname">{{ item.nickname }}</div>
                <div class="phone">{{ item.phone }}</div>
                <div class="createDate">{{ item.createDate.slice(0, 10) }}</div>
                <div class="createTime">
                  {{ item.createDate.slice(11, 19) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="finishRate" ref="finishRate"></div>
      </div>

      <div class="three_right">
        <div class="login_title">
          <p>Recent</p>
          <p>Admin Login</p>
        </div>
        <div class="login_data">
          <div
            class="item"
            v-for="item in loginHistory.slice(0, 3)"
            :key="item.id"
          >
            <div class="item_container">
              <div class="avatar">
                <el-avatar
                  v-if="item.user_pic"
                  :size="50"
                  :src="require('../../../public/user_pic/' + item.user_pic)"
                  style="border: solid 1px black"
                ></el-avatar>
                <el-avatar
                  v-if="!item.user_pic"
                  :size="50"
                  :src="require('../../../public/no_pic/noAvatar.png')"
                  style="border: solid 1px black"
                ></el-avatar>
              </div>
              <div class="nickname">{{ item.nickname }}</div>
              <div class="identity">
                {{
                  item.identity == 0
                    ? "Platform Administrator"
                    : "Administrator"
                }}
              </div>
              <div class="loginDate">{{ item.loginDate.slice(0, 10) }}</div>
              <div class="loginTime">{{ item.loginDate.slice(11, 19) }}</div>
              <div class="onlineTime">Online{{ calOnlineTime(item) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import http from "../../utils/request";
import * as echarts from "echarts";
import vue from "vue";
vue.prototype.$echarts = echarts;
export default {
  data() {
    return {
      userList: [],
      managerList: [],
      claimList: [],
      revertList: [],
      newUserList: [],
      loginHistory: [],
    };
  },
  methods: {
    getUserList() {
      http({
        method: "get",
        url: "http://127.0.0.1:3007/admin/getUserList",
        headers: {
          Authorization: this.$store.getters.getUserToken,
        },
      })
        .then((res) => {
          if (res.data.status === 1) {
            console.log(res.data.message, "Execution failed");
          } else if (res.data.status === 0) {
            this.userList = [...res.data.data];
          }
        })
        .catch((err) => {
          console.log(err, "HTTP request failed");
        });
    },
    getManagerList() {
      http({
        method: "get",
        url: "http://127.0.0.1:3007/admin/getManagerList",
        headers: {
          Authorization: this.$store.getters.getUserToken,
        },
      })
        .then((res) => {
          if (res.data.status === 1) {
            console.log(res.data.message, "Execution failed");
          } else if (res.data.status === 0) {
            this.managerList = [...res.data.data];
          }
        })
        .catch((err) => {
          console.log(err, "HTTP request failed");
        });
    },
    getClaimList() {
      http({
        method: "get",
        url: "http://127.0.0.1:3007/admin/getClaimList",
        headers: {
          Authorization: this.$store.getters.getUserToken,
        },
      })
        .then((res) => {
          if (res.data.status === 0) {
            this.claimList = [...res.data.data];
          }
        })
        .catch((err) => {
          console.log(err, "HTTP request failed");
        });
    },
    getRevertList() {
      http({
        method: "get",
        url: "http://127.0.0.1:3007/admin/getRevertList",
        headers: {
          Authorization: this.$store.getters.getUserToken,
        },
      })
        .then((res) => {
          if (res.data.status === 0) {
            this.revertList = [...res.data.data];
          }
        })
        .catch((err) => {
          console.log(err, "HTTP request failed");
        });
    },
    toUserInfoManage() {
      this.$router.push("/adminUserInfoManage");
    },
    toManagerInfoManage() {
      if (this.$store.getters.getUserInfo.identity === 0) {
        this.$router.push("/adminManagerInfoManage");
      } else {
        this.$message.warning(
          "Looks like you're missing the admin permissions."
        );
      }
    },
    toClaimManage() {
      this.$router.push("/adminClaimManage");
    },
    toRevertManage() {
      this.$router.push("/adminRevertManage");
    },

    drawLineEcharts() {
      var userCount = [];
      var claimCount = [];
      var revertCount = [];
      var commentsCount = [];

      http({
        method: "get",
        url: "http://127.0.0.1:3007/admin/getUserCount",
        headers: {
          Authorization: this.$store.getters.getUserToken,
        },
      })
        .then((res) => {
          if (res.data.status === 0) {
            for (var i in res.data.data) {
              userCount.push({ value: res.data.data[i] });
            }
          }
        })
        .catch((err) => {
          console.log(err, "HTTP request failed");
        });

      http({
        method: "get",
        url: "http://127.0.0.1:3007/admin/getClaimCount",
        headers: {
          Authorization: this.$store.getters.getUserToken,
        },
      })
        .then((res) => {
          if (res.data.status === 0) {
            for (var i in res.data.data) {
              claimCount.push({ value: res.data.data[i] });
            }
          }
        })
        .catch((err) => {
          console.log(err, "HTTP request failed");
        });

      http({
        method: "get",
        url: "http://127.0.0.1:3007/admin/getRevertCount",
        headers: {
          Authorization: this.$store.getters.getUserToken,
        },
      })
        .then((res) => {
          if (res.data.status === 0) {
            for (var i in res.data.data) {
              revertCount.push({ value: res.data.data[i] });
            }
          }
        })
        .catch((err) => {
          console.log(err, "HTTP request failed");
        });

      http({
        method: "get",
        url: "http://127.0.0.1:3007/admin/getCommentsCount",
        headers: {
          Authorization: this.$store.getters.getUserToken,
        },
      })
        .then((res) => {
          if (res.data.status === 0) {
            for (var i in res.data.data) {
              commentsCount.push({ name: i, value: res.data.data[i] });
            }
            const lineEcharts = echarts.init(this.$refs.lineEcharts);
            var lineEchartsOption = {
              title: {
                text: "First Half Year Input Data Statistics",
                top: "2%", // Changed position
                left: "center", // Changed position
                textStyle: {
                  // Added text style
                  color: "#333",
                  fontStyle: "italic",
                  fontWeight: "bold",
                  fontSize: 20,
                },
              },
              tooltip: { trigger: "axis" },
              legend: {
                data: [
                  "New Users",
                  "Lost and Found",
                  "Lost Property Notice",
                  "Message",
                ],
                top: "10%", // Changed position
                right: "10%", // Changed position
                textStyle: {
                  // Added text style
                  color: "#333",
                  fontSize: 14,
                },
              },
              xAxis: {
                data: commentsCount.map((item) => item.name),
                axisLine: {
                  // Added axis line style
                  lineStyle: {
                    color: "#333",
                  },
                },
              },
              yAxis: {
                axisLine: {
                  // Added axis line style
                  lineStyle: {
                    color: "#333",
                  },
                },
              },
              grid: {
                show: false,
                top: "20%", // Changed position
                right: "10%", // Changed position
                bottom: "10%", // Changed position
                left: "10%", // Changed position
              },
              series: [
                {
                  name: "New User",
                  type: "line",
                  data: userCount.map((item) => item.value),
                },
                {
                  name: "Lost and Found",
                  type: "line",
                  data: claimCount.map((item) => item.value),
                },
                {
                  name: "Lost Property Notice",
                  type: "line",
                  data: revertCount.map((item) => item.value),
                },
                {
                  name: "Message",
                  type: "line",
                  data: commentsCount.map((item) => item.value),
                },
              ],
            };
            lineEcharts.setOption(lineEchartsOption);
          }
        })
        .catch((err) => {
          console.log(err, "http request failed");
        });
    },

    drawPieEcharts() {
      var claimStatus = [];
      var revertStatus = [];
      http({
        method: "get",
        url: "http://127.0.0.1:3007/admin/getClaimStatus",
        headers: {
          Authorization: this.$store.getters.getUserToken,
        },
      })
        .then((res) => {
          if (res.data.status === 0) {
            for (var i in res.data.data) {
              claimStatus.push({ value: res.data.data[i], name: i });
            }

            const claimPieEcharts = echarts.init(this.$refs.claimPieEcharts);
            var claimPieEchartsOption = {
              title: {
                text: "Lost and Found",
                top: "5%",
                left: "center",
              },
              tooltip: {
                trigger: "item",
              },
              legend: {
                top: "15%",
                left: "center",
              },
              color: ["#67C23A", "#409EFF", "#FFD700"],
              series: [
                {
                  name: "Lost and Found Status",
                  type: "pie",
                  radius: ["40%", "70%"],
                  center: ["50%", "60%"],
                  avoidLabelOverlap: false,
                  itemStyle: {
                    borderRadius: 10,
                    borderColor: "#fff",
                    borderWidth: 2,
                  },
                  label: {
                    show: false,
                    position: "center",
                  },
                  emphasis: {
                    label: {
                      show: true,
                      fontSize: 20,
                      fontWeight: "bold",
                    },
                  },
                  labelLine: {
                    show: false,
                  },
                  data: claimStatus,
                },
              ],
            };
            claimPieEcharts.setOption(claimPieEchartsOption);
          }
        })
        .catch((err) => {
          console.log(err, "HTTP request failed");
        });
      //chart for revert status
      http({
        method: "get",
        url: "http://127.0.0.1:3007/admin/getRevertStatus",
        headers: {
          Authorization: this.$store.getters.getUserToken,
        },
      })
        .then((res) => {
          if (res.data.status === 0) {
            for (var i in res.data.data) {
              revertStatus.push({ value: res.data.data[i], name: i });
            }
            const revertPieEcharts = echarts.init(this.$refs.revertPieEcharts);
            var revertPieEchartsOption = {
              title: {
                text: "Lost Item Notice",
                top: "5%",
                left: "center",
              },
              tooltip: {
                trigger: "item",
              },
              legend: {
                top: "15%",
                left: "center",
              },
              color: ["#FF5733", "#C70039", "#900C3F"], // Changed colors
              series: [
                {
                  name: "Lost Item Notice Status",
                  type: "pie",
                  radius: ["40%", "70%"],
                  center: ["50%", "60%"],
                  avoidLabelOverlap: false,
                  itemStyle: {
                    borderRadius: 10,
                    borderColor: "#fff",
                    borderWidth: 2,
                  },
                  label: {
                    show: false,
                    position: "center",
                  },
                  emphasis: {
                    label: {
                      show: true,
                      fontSize: 20,
                      fontWeight: "bold",
                    },
                  },
                  labelLine: {
                    show: false,
                  },
                  data: revertStatus,
                },
              ],
            };
            revertPieEcharts.setOption(revertPieEchartsOption);
          }
        })
        .catch((err) => {
          console.log(err, "HTTP request failed");
        });
    },

    getNewUserList() {
      http({
        method: "get",
        url: "http://127.0.0.1:3007/admin/getNewUserList",
        headers: {
          Authorization: this.$store.getters.getUserToken,
        },
      })
        .then((res) => {
          if (res.data.status === 0) {
            this.newUserList = [...res.data.data];
          }
        })
        .catch((err) => {
          console.log(err, "HTTP request failed");
        });
    },

    getFinishRate() {
      var finishClaim = [];
      var finishRevert = [];
      var finishRate = [];

      http({
        method: "get",
        url: "http://127.0.0.1:3007/admin/getClaimNearMonth",
        headers: {
          Authorization: this.$store.getters.getUserToken,
        },
      })
        .then((res) => {
          if (res.data.status === 0) {
            finishClaim = [...res.data.data];
          }
        })
        .catch((err) => {
          console.log(err, "HTTP request failed");
        });

      http({
        method: "get",
        url: "http://127.0.0.1:3007/admin/getRevertNearMonth",
        headers: {
          Authorization: this.$store.getters.getUserToken,
        },
      })
        .then((res) => {
          if (res.data.status === 0) {
            finishRevert = [...res.data.data];
            finishRate.push({
              value: finishClaim.length,
              name: "Lost and Found",
            });
            finishRate.push({
              value: finishRevert.length,
              name: "Lost Item Notice",
            });
            const finishRatePie = echarts.init(this.$refs.finishRate);
            var finishRateOption = {
              title: {
                text: "Completion rate statistics for the past month",
                top: "2%",
                left: "center",
              },
              tooltip: {
                trigger: "item",
              },
              legend: {
                top: "13%",
                left: "center",
              },
              color: ["#67C23A", "#409EFF"],
              series: [
                {
                  name: "Completion rate statistics",
                  type: "pie",
                  radius: ["40%", "70%"],
                  center: ["50%", "62%"],
                  avoidLabelOverlap: false,
                  itemStyle: {
                    borderRadius: 10,
                    borderColor: "#fff",
                    borderWidth: 2,
                  },
                  label: {
                    show: false,
                    position: "center",
                  },
                  emphasis: {
                    label: {
                      show: true,
                      fontSize: 14,
                      fontWeight: "bold",
                    },
                  },
                  labelLine: {
                    show: false,
                  },
                  data: finishRate,
                },
              ],
            };
            finishRatePie.setOption(finishRateOption);
          }
        })
        .catch((err) => {
          console.log(err, "HTTP request failed");
        });
    },
    getLoginHistory() {
      http({
        method: "get",
        url: "http://127.0.0.1:3007/admin/getLoginHistory",
        headers: {
          Authorization: this.$store.getters.getUserToken,
        },
      })
        .then((res) => {
          if (res.data.status === 0) {
            this.loginHistory = [...res.data.data];
          }
        })
        .catch((err) => {
          console.log(err, "HTTP request failed");
        });
    },
    calOnlineTime(item) {
      var login = new Date(item.loginDate);
      var logout = new Date(item.logoutDate);
      var second = parseInt(logout - login) / 1000;
      if (0 < second && second < 60) {
        return second + "s";
      } else if (60 <= second && second < 3600) {
        return parseInt(second / 60) + "m" + (second % 60) + "s";
      } else if (3600 <= second) {
        return (
          parseInt(second / 3600) +
          "h" +
          parseInt(parseInt(second % 3600) / 60) +
          "m" +
          parseInt(parseInt(second % 3600) % 60) +
          "s"
        );
      }
    },
  },
  mounted() {
    this.getUserList();
    this.getManagerList();
    this.getClaimList();
    this.getRevertList();
    this.drawLineEcharts();
    this.getNewUserList();
    this.drawPieEcharts();
    this.getLoginHistory();
    this.getFinishRate();
  },
};
</script>

<style lang="less" scoped>
.one {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 20px;
}

.box {
  width: calc(50% - 10px);
  background-color: #f9f9f9;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.box:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.center {
  display: flex;
  align-items: center;
  padding: 20px;
}

.left {
  flex: 0 0 auto;
}

.right {
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.count {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  color: #333;
}

.title {
  font-size: 16px;
  color: #666;
  margin: 5px 0 0;
}

.box.zero {
  background-color: #e9f5ff;
}
.box.two {
  background-color: #ffeff1;
}
.box.three {
  background-color: #e9ffe9;
}
.box.four {
  background-color: #fff8e1;
}

.TWO {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}

.left {
  grid-row: span 2;
  display: flex;
  justify-content: center;
  align-items: center;
}

.right.top {
  grid-row: 1;
}

.right.bottom {
  grid-row: 2;
}

.lineEcharts,
.claimPieEcharts,
.revertPieEcharts {
  width: 100%;
  height: 300px;
}
.THREE {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background-color: #f8f9fa;
}

.three_left,
.three_right {
  width: 45%;
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  background-color: #cae6f8;
}

.newUser_title,
.login_title {
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
}

.newUser_data,
.login_data {
  overflow-y: auto;
  max-height: 300px;
}

.item {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding: 10px 0;
}

.item:last-child {
  border-bottom: none;
}

.item_container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-left: 10px;
}

.avatar {
  flex-shrink: 0;
}

.nickname,
.phone,
.createDate,
.createTime,
.identity,
.loginDate,
.loginTime,
.onlineTime {
  flex-grow: 1;
  text-align: center;
}
</style>
