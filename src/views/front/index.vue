<template>
  <div class="container">
    <el-row :gutter="20" class="ONE">
      <el-col :span="11" class="banner">
        <img src="../../assets/hero.png" alt="" />
      </el-col>

      <el-col :span="11">
        <div class="dataShow">
          <p class="title">FOUND IT HUB</p>
          <p class="newText">Latest News:</p>
          <ol>
            <li>
              Currently, there are <font>{{ count.claimCount }}</font> items of
              lost and found information, <br />
              &emsp;&emsp;&emsp;&emsp;with
              <font>{{ count.threeClaimCount }}</font> items waiting to be
              claimed in the past 3 days!
            </li>
            <li>
              Currently, there are <font>{{ count.revertCount }}</font> lost
              item notices, <br />
              &emsp;&emsp;&emsp;&emsp;with
              <font>{{ count.threeRevertCount }}</font> items lost in the past 3
              days!
            </li>
            <li>
              <font>{{ count.foundCount }}</font> items have been successfully
              retrieved, with <font>{{ count.foundClaimCount }}</font> items
              claimed and <font>{{ count.foundRevertCount }}</font> items
              returned.
            </li>
            <li>
              <p style="color: red">
                Note: Scammers may use information from this site for fraud. Be
                vigilant and cautious!
              </p>
            </li>
          </ol>
        </div>

        <div class="newList">
          <div class="title">Lost and Found · Latest Information</div>
          <div class="data">
            <span v-for="item in claimList.slice(0, 4)" :key="item.id">
              ▶{{ item.date }}: [{{ item.initiatorNickname }}] found [{{
                item.resume
              }}] and is waiting for claim.
            </span>
            <span class="nodata" v-if="claimList.length == 0"
              >No data available</span
            >
            <div class="updata-more" v-if="claimList.length != 0">
              <p>{{ getCurrentDate() }}</p>
              <el-button type="text" @click="toFrontClaim">View More</el-button>
            </div>
          </div>
        </div>

        <div class="newList">
          <div class="title">Lost Item Notices · Latest Information</div>
          <div class="data">
            <span v-for="item in revertList.slice(0, 4)" :key="item.id">
              ▶{{ item.date }}: [{{ item.initiatorNickname }}] lost [{{
                item.resume
              }}] and is waiting for return.
            </span>
            <span class="nodata" v-if="revertList.length == 0"
              >No data available</span
            >
            <div class="updata-more" v-if="revertList.length != 0">
              <p>{{ getCurrentDate() }}</p>
              <el-button type="text" @click="toFrontRevert"
                >View More</el-button
              >
            </div>
          </div>
        </div>

        <div class="successCase">
          <div class="title">Success Cases · Claims/Returns</div>
          <div class="data">
            <span v-for="item in foundClaimList.slice(0, 4)" :key="item.id">
              ✔[{{ item.initiatorNickname }}] found and returned [{{
                item.handlerNickname
              }}]'s [{{ item.resume }}].
            </span>
            <span v-for="item in foundRevertList.slice(0, 2)" :key="item.id">
              ✔[{{ item.handlerNickname }}] found and returned [{{
                item.initiatorNickname
              }}]'s [{{ item.resume }}].
            </span>
            <span
              class="nodata"
              v-if="foundClaimList.length == 0 && foundRevertList.length == 0"
              >No data available</span
            >
            <div
              class="updata"
              v-if="foundClaimList.length != 0 || foundRevertList.length != 0"
            >
              <p>{{ getCurrentDate() }}</p>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { set } from "vue";
import http from "../../utils/request";
export default {
  data() {
    return {
      count: {
        claimCount: 0,
        threeClaimCount: 0,
        threeRevertCount: 0,
        revertCount: 0,
        foundCount: 0,
        foundClaimCount: 0,
        foundRevertCount: 0,
      },
      claimList: [],
      revertList: [],
      foundClaimList: [],
      foundRevertList: [],
      managerList: [],
    };
  },
  methods: {
    getClaimList() {
      http({
        method: "get",
        url: "http://127.0.0.1:3007/api/public/getClaim",
      })
        .then((res) => {
          // this.count.claimCount = res.data.data.length
          this.claimList = [...res.data.data];
          this.count.claimCount = this.claimList.length;
        })
        .catch((err) => {
          // console.log(err, "#获取claimList失败")
        });
    },
    getThreeClaimList() {
      http({
        method: "get",
        url: "http://127.0.0.1:3007/api/public/getThreeClaim",
      })
        .then((res) => {
          this.count.threeClaimCount = res.data.data.length;
        })
        .catch((err) => {
          console.log(err, "#获取threeClaimList失败");
        });
    },
    getRevertList() {
      http({
        method: "get",
        url: "http://127.0.0.1:3007/api/public/getRevert",
      })
        .then((res) => {
          // this.count.revertCount = res.data.data.length
          this.revertList = [...res.data.data];
          this.count.revertCount = this.revertList.length;
        })
        .catch((err) => {
          // console.log(err, "#获取revertList失败")
        });
    },
    getThreeRevertList() {
      http({
        method: "get",
        url: "http://127.0.0.1:3007/api/public/getThreeRevert",
      })
        .then((res) => {
          this.count.threeRevertCount = res.data.data.length;
        })
        .catch((err) => {
          console.log(err, "#获取threeClaimRevert失败");
        });
    },
    getFoundClaimList() {
      http({
        method: "get",
        url: "http://127.0.0.1:3007/api/public/getFoundClaim",
      })
        .then((res) => {
          this.count.foundClaimCount = res.data.data.length;
          this.count.foundCount = this.count.foundCount + res.data.data.length;
          this.foundClaimList = [...res.data.data];
        })
        .catch((err) => {
          console.log(err, "#获取foundClaimList失败");
        });
    },
    getFoundRevertList() {
      http({
        method: "get",
        url: "http://127.0.0.1:3007/api/public/getFoundRevert",
      })
        .then((res) => {
          this.count.foundRevertCount = res.data.data.length;
          this.count.foundCount = this.count.foundCount + res.data.data.length;
          this.foundRevertList = [...res.data.data];
        })
        .catch((err) => {
          console.log(err, "#获取foundClaimList失败");
        });
    },
    toFrontClaim() {
      this.$router.push("/frontClaim");
    },
    toFrontRevert() {
      this.$router.push("/frontRevert");
    },
    getManagerList() {
      http({
        method: "get",
        url: "http://127.0.0.1:3007/api/public/getManagerList",
        headers: {
          Authorization: this.$store.getters.getUserToken,
        },
      })
        .then((res) => {
          if (res.data.status === 0) {
            this.managerList = [...res.data.data];
          }
        })
        .catch((err) => {
          console.log(err, "http请求失败");
        });
    },
    // 获取当前时间
    getCurrentDate() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hour = date.getHours(); // 时
      let minutes = date.getMinutes(); // 分
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (day >= 0 && day <= 9) {
        day = "0" + day;
      }
      if (hour >= 0 && hour <= 9) {
        hour = "0" + hour;
      }
      if (minutes >= 0 && minutes <= 9) {
        minutes = "0" + minutes;
      }
      const currentDate =
        year + "-" + month + "-" + day + " " + hour + ":" + minutes;
      // console.log(currentDate, "日期")
      return currentDate;
    },
  },
  mounted() {
    this.getClaimList();
    this.getThreeClaimList();
    this.getRevertList();
    this.getThreeRevertList();
    this.getFoundClaimList();
    this.getFoundRevertList();
    this.getManagerList();
  },
};
</script>
<style scoped>
.container {
  width: 100%;
  padding: 20px;
}
.banner {
  display: flex;
  justify-content: center;
  align-items: center;
}

.banner img {
  max-width: 100%;
  height: auto;
  padding: 20px;
}
.ONE {
  display: flex;
  justify-content: space-between;
  align-items: stretch; /* 添加这一行 */
}

.dataShow {
  background-color: #f0f8ff; /* 添加一个淡蓝色的背景 */
  border-radius: 10px; /* 添加圆角 */
  padding: 20px; /* 添加内边距 */
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); /* 添加阴影 */
  transition: all 0.3s ease; /* 添加过渡效果 */
}

.dataShow:hover {
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2); /* 鼠标悬停时增加阴影 */
}

.dataShow .title {
  color: #1e90ff;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.dataShow .newText {
  color: #4169e1;
  font-size: 18px;
}

.dataShow ol li {
  margin-bottom: 10px;
}

.dataShow ol li font {
  color: #0000ff;
}
.newList .data,
.successCase .data,
.seekHelp .managerList {
  background-color: #f0f8ff; /* 添加一个淡蓝色的背景 */
  border-radius: 10px; /* 添加圆角 */
  padding: 20px; /* 添加内边距 */
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); /* 添加阴影 */
  transition: all 0.3s ease; /* 添加过渡效果 */
}

.newList .data:hover,
.successCase .data:hover,
.seekHelp .managerList:hover {
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2); /* 鼠标悬停时增加阴影 */
}

.newList .title,
.successCase .title,
.seekHelp .title {
  color: #1e90ff; /* 将标题颜色改为深蓝色 */
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.newList .data span,
.successCase .data span,
.seekHelp .managerList .item {
  color: #4169e1; /* 将文本颜色改为蓝色 */
  font-size: 18px;
}

.newList .data span,
.successCase .data span,
.managerList .item {
  color: #4169e1; /* 将文本颜色改为蓝色 */
  font-size: 18px;
  margin-bottom: 50px !important; /* 添加列表项之间的间距 */
}
.successCase {
  margin-bottom: 50px !important;
}
</style>
