<template>
  <div class="container">
    <div class="ONE">
      <div class="left">
        <p>
          <span class="link" @click="toIndex">Home</span> > Permissions
          Management > Administrator Permissions Management
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
          fixed="left"
        ></el-table-column>

        <el-table-column
          prop="nickname"
          label="nickname"
          width="140"
          header-align="center"
          align="center"
          fixed="left"
        >
        </el-table-column>

        <el-table-column
          prop="username"
          label="username"
          width="140"
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
          >Administrator</el-table-column
        >

        <el-table-column
          label="Change of identity"
          width="130"
          header-align="center"
          align="center"
          v-if="this.$store.getters.getUserInfo.identity === 1"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="warning"
              @click="handleSet(scope.$index, scope.row)"
              >Set as a regular user</el-button
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
          label="Message privileges"
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
          prop="adminLOA"
          label="Backend login privileges"
          width="120"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.adminLOA"
              active-color="#E6A23C"
              inactive-color="#ff4949"
              active-value="1"
              inactive-value="0"
              @change="switchAdminLOA($event, scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column
          prop="adminVerifyLOA"
          label="Audit Privileges"
          width="100"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.adminVerifyLOA"
              active-color="#E6A23C"
              inactive-color="#ff4949"
              active-value="1"
              inactive-value="0"
              @change="switchAdminVerifyLOA($event, scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column
          prop="adminUserLOA"
          label="User management privileges"
          width="120"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.adminUserLOA"
              active-color="#E6A23C"
              inactive-color="#ff4949"
              active-value="1"
              inactive-value="0"
              @change="switchAdminUserLOA($event, scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column
          prop="adminDataLOA"
          label="Data management privileges"
          width="120"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.adminDataLOA"
              active-color="#E6A23C"
              inactive-color="#ff4949"
              active-value="1"
              inactive-value="0"
              @change="switchAdminDataLOA($event, scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column
          prop="adminCommentLOA"
          label="Comment management privileges"
          width="120"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.adminCommentLOA"
              active-color="#E6A23C"
              inactive-color="#ff4949"
              active-value="1"
              inactive-value="0"
              @change="switchAdminCommentLOA($event, scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column
          prop=""
          label="operation "
          width="150"
          header-align="center"
          align="center"
          fixed="right"
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
        :total="managerList.length"
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
      managerList: [],
      viewList: [],
      keyword: "",
      pageSize: 10,
      currentPage: 1,
    };
  },
  methods: {
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
            console.log(res.data.message, "fail");
          } else if (res.data.status === 0) {
            this.managerList = [...res.data.data];
            this.viewList = [
              ...this.managerList.slice(
                this.currentPage * this.pageSize - this.pageSize,
                this.currentPage * this.pageSize
              ),
            ];
          }
        })
        .catch((err) => {
          console.log(err, "http request failed");
        });
    },
    toIndex() {
      this.$router.push("/adminIndex");
    },
    handleSet(index, row) {
      this.$confirm(
        "确定将此用户升级为普通用户吗?<br>(将关闭后台权限、用户管理权限、数据管理权限等权限)",
        "提示",
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
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
              identity: 2,
              adminLOA: 0,
              adminVerifyLOA: 0,
              adminUserLOA: 0,
              adminDataLOA: 0,
              adminCommentLOA: 0,
              id: row.id,
            },
          })
            .then((res) => {
              if (res.data.status === 0) {
                if (this.keyword) {
                  this.$store.dispatch("asyncUpdatePage", this.currentPage);
                  this.$message.success("Setup successful!！");
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
                  this.$message.success("Setup successful!！");
                  this.getManagerList();
                }
              }
            })
            .catch((err) => {
              console.log(err, "http request failed");
            });
        })
        .catch(() => {});
    },

    switchLoginLOA(val, row) {
      console.log(val, row, "val , row");
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
            this.$message.success("Login privileges modified successfully!");
          }
        })
        .catch((err) => {
          console.log(err, "http request failed");
        });
    },

    switchPublishLOA(val, row) {
      console.log(val, row, "val , row");
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
              "Publishing permissions modified successfully!"
            );
          }
        })
        .catch((err) => {
          console.log(err, "http request failed");
        });
    },

    switchClaimLOA(val, row) {
      console.log(val, row, "val , row");
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
              "The modification of the recognition privilege was successful!"
            );
          }
        })
        .catch((err) => {
          console.log(err, "http request failed");
        });
    },

    switchRevertLOA(val, row) {
      console.log(val, row, "val , row");
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
            this.$message.success("Permission modification successful!");
          }
        })
        .catch((err) => {
          console.log(err, "HTTP request failed");
        });
    },

    switchCommentsLOA(val, row) {
      console.log(val, row, "val , row");
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
    },

    switchAdminLOA(val, row) {
      console.log(val, row, "val , row");
      http({
        method: "post",
        url: "http://127.0.0.1:3007/admin/editUserLOA",
        headers: {
          Authorization: this.$store.getters.getUserToken,
        },
        params: {
          adminLOA: val,
          id: row.id,
        },
      })
        .then((res) => {
          if (res.data.status === 0) {
            this.$message.success(
              "Backend login permission modification successful!"
            );
          }
        })
        .catch((err) => {
          console.log(err, "HTTP request failed");
        });
    },

    switchAdminVerifyLOA(val, row) {
      http({
        method: "post",
        url: "http://127.0.0.1:3007/admin/editUserLOA",
        headers: {
          Authorization: this.$store.getters.getUserToken,
        },
        params: {
          adminVerifyLOA: val,
          id: row.id,
        },
      })
        .then((res) => {
          if (res.data.status === 0) {
            this.$message.success("Audit permission modification successful!");
          }
        })
        .catch((err) => {
          console.log(err, "HTTP request failed");
        });
    },

    switchAdminUserLOA(val, row) {
      console.log(val, row, "val , row");
      http({
        method: "post",
        url: "http://127.0.0.1:3007/admin/editUserLOA",
        headers: {
          Authorization: this.$store.getters.getUserToken,
        },
        params: {
          adminUserLOA: val,
          id: row.id,
        },
      })
        .then((res) => {
          if (res.data.status === 0) {
            this.$message.success(
              "User management permission modification successful!"
            );
          }
        })
        .catch((err) => {
          console.log(err, "HTTP request failed");
        });
    },

    switchAdminDataLOA(val, row) {
      console.log(val, row, "val , row");
      http({
        method: "post",
        url: "http://127.0.0.1:3007/admin/editUserLOA",
        headers: {
          Authorization: this.$store.getters.getUserToken,
        },
        params: {
          adminDataLOA: val,
          id: row.id,
        },
      })
        .then((res) => {
          if (res.data.status === 0) {
            this.$message.success(
              "Data management permission modification successful!"
            );
          }
        })
        .catch((err) => {
          console.log(err, "HTTP request failed");
        });
    },

    switchAdminCommentLOA(val, row) {
      http({
        method: "post",
        url: "http://127.0.0.1:3007/admin/editUserLOA",
        headers: {
          Authorization: this.$store.getters.getUserToken,
        },
        params: {
          adminCommentLOA: val,
          id: row.id,
        },
      })
        .then((res) => {
          if (res.data.status === 0) {
            this.$message.success(
              "Comment management permission modification successful!"
            );
          }
        })
        .catch((err) => {
          console.log(err, "HTTP request failed");
        });
    },

    handleOpen(index, row) {
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
              this.$message.success("PPermissions are all open.");
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
              this.$message.success("Permissions are all open.");
              this.getManagerList();
            }
          }
        })
        .catch((err) => {
          console.log(err, "http request failed");
        });
    },

    handleClose(index, row) {
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
          adminLOA: 0,
          adminVerifyLOA: 0,
          adminUserLOA: 0,
          adminDataLOA: 0,
          adminCommentLOA: 0,
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
              this.getManagerList();
            }
          }
        })
        .catch((err) => {
          console.log(err, "http request failed");
        });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.viewList = [
        ...this.managerList.slice(
          this.currentPage * this.pageSize - this.pageSize,
          this.currentPage * this.pageSize
        ),
      ];
    },
    search() {
      http({
        method: "get",
        url: "http://127.0.0.1:3007/admin/getKeywordManagerList",
        headers: {
          Authorization: this.$store.getters.getUserToken,
        },
        params: {
          keyword: this.keyword,
        },
      })
        .then((res) => {
          if (res.data.status === 0) {
            this.managerList = [...res.data.data];
            this.viewList = [...this.managerList.slice(0, this.pageSize)];
          }
        })
        .catch((err) => {
          console.log(err, "http request failed");
        });
    },
  },
  mounted() {
    this.getManagerList();
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
