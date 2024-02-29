<template>
  <div class="container">
    <div class="ONE">
      <div class="left">
        <p>
          <span class="link" @click="toIndex">Home</span> > Permission
          Management > User Permission Management
        </p>
      </div>
      <div class="right">
        <el-input
          v-model.trim="keyword"
          clearable
          @keyup.enter.native="search()"
        ></el-input>
        <el-button plain type="primary" @click="search()">Search</el-button>
      </div>
    </div>

    <div class="TWO">
      <el-table
        :data="viewList"
        border
        highlight-current-row
        style="width: 100%; text-algin: center"
      >
        <el-table-column
          prop="id"
          label="ID"
          width="80"
          sortable
          header-align="center"
          align="center"
        ></el-table-column>

        <el-table-column
          prop="username"
          label="account"
          header-align="center"
          align="center"
        >
        </el-table-column>

        <el-table-column
          prop="nickname"
          label="nickname"
          header-align="center"
          align="center"
        >
        </el-table-column>

        <el-table-column
          prop="identity"
          label="identity"
          width="100"
          header-align="center"
          align="center"
          >General User</el-table-column
        >

        <el-table-column
          label="Identity Change"
          width="120"
          header-align="center"
          align="center"
          v-if="this.$store.getters.getUserInfo.identity === 0"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="warning"
              @click="handleSet(scope.$index, scope.row)"
              >Set as Administrator</el-button
            >
          </template>
        </el-table-column>

        <el-table-column
          prop="loginLOA"
          label="login credentials"
          width="100"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.loginLOA"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="1"
              inactive-value="0"
              @change="switchLoginLOA($event, scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column
          prop="publishLOA"
          label="Publishing Privileges"
          width="100"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.publishLOA"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="1"
              inactive-value="0"
              @change="switchPublishLOA($event, scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column
          prop="claimLOA"
          label="claim rights"
          width="100"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.claimLOA"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="1"
              inactive-value="0"
              @change="switchClaimLOA($event, scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column
          prop="revertLOA"
          label="Permission to return items"
          width="100"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.revertLOA"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="1"
              inactive-value="0"
              @change="switchRevertLOA($event, scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column
          prop="commentsLOA"
          label="Permission to leave a message"
          width="100"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.commentsLOA"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="1"
              inactive-value="0"
              @change="switchCommentsLOA($event, scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column
          prop=""
          label="Operation"
          width="150"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleOpen(scope.$index, scope.row)"
              >Open</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleClose(scope.$index, scope.row)"
              >Close</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="THREE">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="userList.length"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import http from "../../utils/request";
export default {
  data() {
    return {
      userList: [],
      viewList: [],
      keyword: "",
      pageSize: 10,
      currentPage: 1,
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
            this.viewList = [
              ...this.userList.slice(
                this.currentPage * this.pageSize - this.pageSize,
                this.currentPage * this.pageSize
              ),
            ];
          }
        })
        .catch((err) => {
          console.log(err, "HTTP request failed");
        });
    },
    toIndex() {
      this.$router.push("/adminIndex");
    },

    handleSet(index, row) {
      if (this.$store.getters.getUserInfo.adminUserLOA === "1") {
        this.$confirm(
          "Are you sure you want to upgrade this user to a custodian?<br>(Backend permissions, user management permissions, data management permissions, etc. will be enabled by default)",
          "Prompt",
          {
            dangerouslyUseHTMLString: true,
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
            type: "info",
          }
        )
          .then(() => {
            http({
              method: "post",
              url: "http://127.0.0.1:3007/admin/setIdentity",
              headers: {
                Authorization: this.$store.getters.getUserToken,
              },
              params: {
                identity: 1,
                adminLOA: 1,
                adminVerifyLOA: 1,
                adminUserLOA: 1,
                adminDataLOA: 1,
                adminCommentLOA: 1,
                id: row.id,
              },
            })
              .then((res) => {
                if (res.data.status === 0) {
                  if (this.keyword) {
                    this.$store.dispatch("asyncUpdatePage", this.currentPage);
                    this.$message.success("Setup successful!");
                    this.search();
                    this.currentPage = this.$store.getters.getPage;
                    this.$store.dispatch("asyncUpdatePage", "");
                    this.viewList = [
                      ...this.userList.slice(
                        this.currentPage * this.pageSize - this.pageSize,
                        this.currentPage * this.pageSize
                      ),
                    ];
                  } else {
                    this.$message.success("Setup successful!");
                    this.getUserList();
                  }
                }
              })
              .catch((err) => {
                console.log(err, "HTTP request failed");
              });
          })
          .catch(() => {});
      } else {
        this.$message.warning(
          "You do not have user administration privileges!"
        );
      }
    },

    switchLoginLOA(val, row) {
      if (this.$store.getters.getUserInfo.adminUserLOA === "1") {
        http({
          method: "post",
          url: "http://127.0.0.1:3007/admin/editUserLOA",
          headers: {
            Authorization: this.$store.getters.getUserToken,
          },
          params: {
            loginLOA: val,
            id: row.id,
          },
        })
          .then((res) => {
            if (res.data.status === 0) {
              this.$message.success(
                "Login permission modification successful!"
              );
            }
          })
          .catch((err) => {
            console.log(err, "HTTP request failed");
          });
      } else {
        this.$message.warning("You do not have user management permissions!");
        this.getUserList();
      }
    },

    switchPublishLOA(val, row) {
      if (this.$store.getters.getUserInfo.adminUserLOA === "1") {
        http({
          method: "post",
          url: "http://127.0.0.1:3007/admin/editUserLOA",
          headers: {
            Authorization: this.$store.getters.getUserToken,
          },
          params: {
            publishLOA: val,
            id: row.id,
          },
        })
          .then((res) => {
            if (res.data.status === 0) {
              this.$message.success(
                "Publish permission modification successful!"
              );
            }
          })
          .catch((err) => {
            console.log(err, "HTTP request failed");
          });
      } else {
        this.$message.warning("You do not have user management permissions!");
        this.getUserList();
      }
    },

    switchClaimLOA(val, row) {
      if (this.$store.getters.getUserInfo.adminUserLOA === "1") {
        http({
          method: "post",
          url: "http://127.0.0.1:3007/admin/editUserLOA",
          headers: {
            Authorization: this.$store.getters.getUserToken,
          },
          params: {
            claimLOA: val,
            id: row.id,
          },
        })
          .then((res) => {
            if (res.data.status === 0) {
              this.$message.success(
                "Claim permission modification successful!"
              );
            }
          })
          .catch((err) => {
            console.log(err, "HTTP request failed");
          });
      } else {
        this.$message.warning("You do not have user management permissions!");
        this.getUserList();
      }
    },

    switchRevertLOA(val, row) {
      if (this.$store.getters.getUserInfo.adminUserLOA === "1") {
        http({
          method: "post",
          url: "http://127.0.0.1:3007/admin/editUserLOA",
          headers: {
            Authorization: this.$store.getters.getUserToken,
          },
          params: {
            revertLOA: val,
            id: row.id,
          },
        })
          .then((res) => {
            if (res.data.status === 0) {
              this.$message.success(
                "Return permission modification successful!"
              );
            }
          })
          .catch((err) => {
            console.log(err, "HTTP request failed");
          });
      } else {
        this.$message.warning("You do not have user management permissions!");
        this.getUserList();
      }
    },

    switchCommentsLOA(val, row) {
      if (this.$store.getters.getUserInfo.adminUserLOA === "1") {
        http({
          method: "post",
          url: "http://127.0.0.1:3007/admin/editUserLOA",
          headers: {
            Authorization: this.$store.getters.getUserToken,
          },
          params: {
            commentsLOA: val,
            id: row.id,
          },
        })
          .then((res) => {
            if (res.data.status === 0) {
              this.$message.success(
                "Comment permission modification successful!"
              );
            }
          })
          .catch((err) => {
            console.log(err, "HTTP request failed");
          });
      } else {
        this.$message.warning("You do not have user management permissions!");
        this.getUserList();
      }
    },

    handleOpen(index, row) {
      if (this.$store.getters.getUserInfo.adminUserLOA === "1") {
        http({
          method: "post",
          url: "http://127.0.0.1:3007/admin/editUserLOA",
          headers: {
            Authorization: this.$store.getters.getUserToken,
          },
          params: {
            loginLOA: 1,
            publishLOA: 1,
            claimLOA: 1,
            revertLOA: 1,
            commentsLOA: 1,
            id: row.id,
          },
        })
          .then((res) => {
            if (res.data.status === 0) {
              if (this.keyword) {
                this.$store.dispatch("asyncUpdatePage", this.currentPage);
                this.$message.success("Permissions have all been turned off!");
                this.search();
                this.currentPage = this.$store.getters.getPage;
                this.$store.dispatch("asyncUpdatePage", "");
                this.viewList = [
                  ...this.userList.slice(
                    this.currentPage * this.pageSize - this.pageSize,
                    this.currentPage * this.pageSize
                  ),
                ];
              } else {
                this.$message.success("Permissions are all turned on!");
                this.getUserList();
              }
            }
          })
          .catch((err) => {
            console.log(err, "HTTP request failed");
          });
      } else {
        this.$message.warning("You do not have user management permissions!");
      }
    },

    handleClose(index, row) {
      if (this.$store.getters.getUserInfo.adminUserLOA === "1") {
        http({
          method: "post",
          url: "http://127.0.0.1:3007/admin/editUserLOA",
          headers: {
            Authorization: this.$store.getters.getUserToken,
          },
          params: {
            loginLOA: 0,
            publishLOA: 0,
            claimLOA: 0,
            revertLOA: 0,
            commentsLOA: 0,
            id: row.id,
          },
        })
          .then((res) => {
            if (res.data.status === 0) {
              if (this.keyword) {
                this.$store.dispatch("asyncUpdatePage", this.currentPage);
                this.$message.success("Permissions have all been turned off!");
                this.search();
                this.currentPage = this.$store.getters.getPage;
                this.$store.dispatch("asyncUpdatePage", "");
                this.viewList = [
                  ...this.userList.slice(
                    this.currentPage * this.pageSize - this.pageSize,
                    this.currentPage * this.pageSize
                  ),
                ];
              } else {
                this.$message.success("Permissions have all been turned off!");
                this.getUserList();
              }
            }
          })
          .catch((err) => {
            console.log(err, "HTTP request failed");
          });
      } else {
        this.$message.warning("You do not have user management permissions!");
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.viewList = [
        ...this.userList.slice(
          this.currentPage * this.pageSize - this.pageSize,
          this.currentPage * this.pageSize
        ),
      ];
    },
    search() {
      http({
        method: "get",
        url: "http://127.0.0.1:3007/admin/getKeywordUserList",
        headers: {
          Authorization: this.$store.getters.getUserToken,
        },
        params: {
          keyword: this.keyword,
        },
      })
        .then((res) => {
          if (res.data.status === 0) {
            this.userList = [...res.data.data];
            this.viewList = [...this.userList.slice(0, this.pageSize)];
          }
        })
        .catch((err) => {
          console.log(err, "HTTP request failed");
        });
    },
  },
  mounted() {
    this.getUserList();
  },
};
</script>

<style lang="less" scoped>
.container {
  background-color: white;
  animation: scale 0.5s linear 1 forwards;

  @keyframes scale {
    0% {
      margin-left: 100px;
    }
    100% {
      margin-left: 0px;
    }
  }
  .ONE {
    height: 6%;
    padding: 2px 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .left {
      height: 100%;
      display: flex;
      align-items: center;
      color: black;
      .link {
        color: black;
      }
      .link:hover {
        cursor: pointer;
        text-decoration: underline;
      }
    }
    .right {
      display: flex;
      flex-direction: row;
      .el-input {
        margin-right: 20px;
      }
    }
  }
  .TWO {
    height: 88%;
    overflow-y: scroll;
  }
  .TWO::-webkit-scrollbar {
    display: none;
  }
  .THREE {
    height: 6%;
  }
}
</style>
