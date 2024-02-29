<template>
  <div class="container">
    <div class="ONE">
      <div class="left">
        <p><span class="link" @click="toIndex">Home</span> > Search History</p>
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
          prop="userId"
          label="ID"
          width="80"
          sortable
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="user_pic"
          label="Profile Photo"
          width="80"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-avatar
              v-if="scope.row.user_pic"
              :size="35"
              :src="require('../../../public/user_pic/' + scope.row.user_pic)"
              style="border: solid 1px black"
            ></el-avatar>
            <el-avatar
              v-if="!scope.row.user_pic"
              :size="35"
              :src="require('../../../public/no_pic/noAvatar.png')"
              style="border: solid 1px black"
            ></el-avatar>
          </template>
        </el-table-column>
        <el-table-column
          prop="nickname"
          label="Username"
          width="80"
          sortable
          header-align="center"
          align="center"
        >
        </el-table-column>

        <el-table-column
          prop="loginDate"
          label="Login Time"
          width="160"
          sortable
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="logoutDate"
          label="Logout Time"
          width="160"
          sortable
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="onlineTime"
          label="Online Duration"
          width="120"
          sortable
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="ps"
          label="Note"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="Operation"
          width="220"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handlePS(scope.$index, scope.row)"
              >Remarks</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >Delete</el-button
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
        :total="historyList.length"
      >
      </el-pagination>
    </div>

    <el-dialog
      class="ps-dialog"
      title="Note"
      :visible.sync="psDialogVisible"
      width="30%"
      top="10px"
    >
      <div class="dialog-container">
        <el-input
          type="text"
          placeholder="Please enter notes"
          v-model="psView.ps"
          clearable
        ></el-input>
        <el-button type="primary" @click="submitHandler">Submit</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import http from "../../utils/request";
export default {
  data() {
    return {
      historyList: [],
      viewList: [],
      keyword: "",
      pageSize: 8,
      currentPage: 1,
      psDialogVisible: false,
      psView: {},
    };
  },
  methods: {
    getHistoryList() {
      http({
        method: "get",
        url: "http://127.0.0.1:3007/admin/getHistoryList",
        headers: {
          Authorization: this.$store.getters.getUserToken,
        },
      })
        .then((res) => {
          if (res.data.status === 0) {
            this.historyList = [...res.data.data];
            this.viewList = [
              ...this.historyList.slice(
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

    handleCurrentChange(val) {
      this.currentPage = val;
      this.viewList = [
        ...this.historyList.slice(
          this.currentPage * this.pageSize - this.pageSize,
          this.currentPage * this.pageSize
        ),
      ];
    },

    search() {
      http({
        method: "get",
        url: "http://127.0.0.1:3007/admin/getKeywordCommentList",
        headers: {
          Authorization: this.$store.getters.getUserToken,
        },
        params: {
          keyword: this.keyword,
        },
      })
        .then((res) => {
          if (res.data.status === 0) {
            this.commentsList = [...res.data.data];
            this.viewList = [...this.commentsList.slice(0, this.pageSize)];
          }
        })
        .catch((err) => {
          console.log(err, "http request failed");
        });
    },
    handlePS(index, row) {
      this.psView = { ...row };
      this.psDialogVisible = true;
    },
    submitHandler() {
      http({
        method: "post",
        url: "http://127.0.0.1:3007/admin/updatePS",
        headers: {
          Authorization: this.$store.getters.getUserToken,
        },
        params: {
          ps: this.psView.ps,
          id: this.psView.id,
        },
      })
        .then((res) => {
          if (res.data.status === 0) {
            this.psDialogVisible = false;
            this.psView = {};
            this.getHistoryList();
            this.$message.success("Remark successful!");
          } else {
            this.$message.warning("Remark failed!");
          }
        })
        .catch((err) => {
          console.log(err, "http request failed");
        });
    },
    handleDelete(index, row) {
      this.$confirm(
        "This operation will permanently delete the record, do you want to continue?",
        "Prompt",
        {
          confirmButtonText: "Confirm",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      )
        .then(() => {
          http({
            method: "post",
            url: "http://127.0.0.1:3007/admin/deleteHistory",
            headers: {
              Authorization: this.$store.getters.getUserToken,
            },
            params: {
              id: row.id,
            },
          })
            .then((res) => {
              if (res.data.status === 0) {
                this.$message.success("Delete successfully!");
                this.getHistoryList();
              } else {
                this.$message.warning("Deletion failed!");
              }
            })
            .catch((err) => {
              console.log(err, "http request failed");
            });
        })
        .catch(() => {
          this.$message.info("Deletion canceled!");
        });
    },
  },
  mounted() {
    this.getHistoryList();
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

  .ps-dialog {
    .dialog-container {
      display: flex;
      flex-direction: row;
      .el-button {
        margin-left: 10px;
      }
    }
  }
}
</style>
