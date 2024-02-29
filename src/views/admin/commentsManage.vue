<template>
  <div class="container">
    <div class="ONE">
      <div class="left">
        <p>
          <span class="link" @click="toIndex">Home</span> > Message Management
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
          prop="date"
          label="Comment Date"
          width="200"
          sortable
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.date }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="authorId"
          label="User ID"
          width="100"
          sortable
          header-align="center"
          align="center"
        ></el-table-column>

        <el-table-column
          prop="user_pic"
          label="Avatar"
          width="80"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-avatar
              v-if="scope.row.author_pic"
              :size="35"
              :src="require('../../../public/user_pic/' + scope.row.author_pic)"
              style="border: solid 1px black"
            ></el-avatar>
            <el-avatar
              v-if="!scope.row.author_pic"
              :size="35"
              :src="require('../../../public/no_pic/noAvatar.png')"
              style="border: solid 1px black"
            ></el-avatar>
          </template>
        </el-table-column>
        <el-table-column
          prop="authorNickname"
          label="Username"
          width="120"
          header-align="center"
          align="center"
        >
        </el-table-column>

        <el-table-column
          prop="comments"
          label="Message"
          header-align="center"
          align="center"
        >
        </el-table-column>

        <el-table-column
          prop="support"
          label="Likes"
          width="80"
          sortable
          header-align="center"
          align="center"
        >
        </el-table-column>

        <el-table-column
          prop="reply"
          label="Reply"
          width="80"
          sortable
          header-align="center"
          align="center"
        >
        </el-table-column>

        <el-table-column
          label="Operation"
          width="200"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleViewReply(scope.$index, scope.row)"
              >Reply</el-button
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
        :total="commentsList.length"
      >
      </el-pagination>
    </div>

    <el-dialog
      class="reply-dialog"
      title="Reply List"
      :visible.sync="replyDialogVisible"
      width="80%"
      height="80%"
      top="40px"
      modal="false"
    >
      <div class="dialog-container">
        <div class="ONE">
          <div class="left">
            <p>Reply List Management</p>
          </div>
          <div class="right">
            <el-input
              v-model.trim="replyKeyword"
              clearable
              @keyup.enter.native="searchReply()"
            ></el-input>
            <el-button plain type="primary" @click="searchReply()"
              >Search</el-button
            >
          </div>
        </div>

        <div class="TWO">
          <el-table
            :data="replyViewList"
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
              prop="date"
              label="Reply Date"
              width="200"
              sortable
              header-align="center"
              align="center"
            >
              <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{ scope.row.date }}</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="authorId"
              label="User ID"
              width="100"
              sortable
              header-align="center"
              align="center"
            ></el-table-column>

            <el-table-column
              prop="user_pic"
              label="Profile Picture"
              width="80"
              header-align="center"
              align="center"
            >
              <template slot-scope="scope">
                <el-avatar
                  v-if="scope.row.author_pic"
                  :size="35"
                  :src="
                    require('../../../public/user_pic/' + scope.row.author_pic)
                  "
                  style="border: solid 1px black"
                ></el-avatar>
                <el-avatar
                  v-if="!scope.row.author_pic"
                  :size="35"
                  :src="require('../../../public/no_pic/noAvatar.png')"
                  style="border: solid 1px black"
                ></el-avatar>
              </template>
            </el-table-column>

            <el-table-column
              prop="authorNickname"
              label="Username"
              width="120"
              header-align="center"
              align="center"
            >
            </el-table-column>

            <el-table-column
              prop="comments"
              label="Reply"
              header-align="center"
              align="center"
            >
            </el-table-column>

            <el-table-column
              label="Operation"
              width="100"
              header-align="center"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDeleteReply(scope.$index, scope.row)"
                  >Delete</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="THREE">
          <el-pagination
            @current-change="handleReplyCurrentChange"
            :current-page="currentReplyPage"
            :page-size="replyPageSize"
            layout="total, prev, pager, next, jumper"
            :total="replyList.length"
          >
          </el-pagination>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="replyDialogVisible = false"
          >Confirm</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import http from "../../utils/request";
export default {
  data() {
    return {
      commentsList: [],
      viewList: [],
      viewDialogVisible: false,
      view: {},
      keyword: "",
      replyKeyword: "",
      pageSize: 8,
      replyPageSize: 5,
      currentPage: 1,
      currentReplyPage: 1,
      replyDialogVisible: false,
      replyList: [],
      replyViewList: [],
      currentData: {},
    };
  },
  methods: {
    getCommentsList() {
      http({
        method: "get",
        url: "http://127.0.0.1:3007/api/public/getCommentsList",
        headers: {
          Authorization: this.$store.getters.getUserToken,
        },
      })
        .then((res) => {
          if (res.data.status === 0) {
            this.commentsList = [...res.data.data];
            this.viewList = [
              ...this.commentsList.slice(
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

    handleViewReply(index, row) {
      this.replyDialogVisible = true;
      this.currentData = { ...row };
      http({
        method: "get",
        url: "http://127.0.0.1:3007/api/public/getReplyList",
        params: {
          higherLevelId: row.id,
        },
      })
        .then((res) => {
          if (res.data.status === 0) {
            this.replyList = [...res.data.data];
            this.replyViewList = [
              ...this.replyList.slice(
                this.currentReplyPage * this.replyPageSize - this.replyPageSize,
                this.currentReplyPage * this.replyPageSize
              ),
            ];
          } else {
            this.$message.warning("获取回复列表失败！");
          }
        })
        .catch((err) => {
          console.log(err, "http request failed");
        });
    },

    handleDelete(index, row) {
      console.log(row, "row");

      if (this.$store.getters.getUserInfo.adminCommentLOA === "1") {
        this.$confirm(
          "This operation will permanently delete the comment and its replies, do you want to continue?",
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
              url: "http://127.0.0.1:3007/my/deleteComment",
              headers: {
                Authorization: this.$store.getters.getUserToken,
              },
              params: {
                id: row.id,
                higherLevelId: row.id,
              },
            })
              .then((res) => {
                if (res.data.status === 1) {
                  this.$message.warning(
                    "Failed to delete the comment, please try again later!"
                  );
                } else if (res.data.status === 0) {
                  if (this.keyword) {
                    this.$store.dispatch("asyncUpdatePage", this.currentPage);
                    this.$message.success("Comment deleted successfully!");
                    this.search();
                    this.currentPage = this.$store.getters.getPage;
                    this.$store.dispatch("asyncUpdatePage", "");
                    this.viewList = [
                      ...this.commentsList.slice(
                        this.currentPage * this.pageSize - this.pageSize,
                        this.currentPage * this.pageSize
                      ),
                    ];
                  } else {
                    this.$message.success("Comment deleted successfully!");
                    this.getCommentsList();
                  }
                }
              })
              .catch((err) => {
                console.log(err, "http request failed");
              });
          })
          .catch(() => {
            this.$message.info("Deletion cancelled!");
          });
      } else {
        this.$message.warning(
          "You do not have comment management permissions!"
        );
      }
    },

    handleDeleteReply(index, row) {
      console.log(row, "row");

      if (this.$store.getters.getUserInfo.adminCommentLOA === "1") {
        this.$confirm(
          "This operation will permanently delete the reply, do you want to continue?",
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
              url: "http://127.0.0.1:3007/my/deleteReply",
              headers: {
                Authorization: this.$store.getters.getUserToken,
              },
              params: {
                id: row.higherLevelId,
              },
            })
              .then((res) => {})
              .catch((err) => {
                console.log(err, "http request failed");
              });

            http({
              method: "post",
              url: "http://127.0.0.1:3007/my/deleteComment",
              headers: {
                Authorization: this.$store.getters.getUserToken,
              },
              params: {
                id: row.id,
                higherLevelId: row.id,
              },
            })
              .then((res) => {
                if (res.data.status === 1) {
                  this.$message.warning(
                    "Failed to delete the comment, please try again later!"
                  );
                } else if (res.data.status === 0) {
                  this.$message.success("Comment deleted successfully!");
                  this.replyDialogVisible = false;
                  this.replyKeyword = "";
                }
              })
              .catch((err) => {
                console.log(err, "HTTP request failed");
              });
          })
          .catch(() => {
            this.$message.info("Deletion cancelled!");
          });
      } else {
        this.$message.warning(
          "You do not have comment management permissions!"
        );
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.viewList = [
        ...this.commentsList.slice(
          this.currentPage * this.pageSize - this.pageSize,
          this.currentPage * this.pageSize
        ),
      ];
    },

    handleReplyCurrentChange(val) {
      this.currentReplyPage = val;
      this.replyViewList = [
        ...this.replyList.slice(
          this.currentReplyPage * this.replyPageSize - this.replyPageSize,
          this.currentReplyPage * this.replyPageSize
        ),
      ];
    },
    // Search
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
    // searchReply
    searchReply() {
      console.log(this.currentData, "row");
      http({
        method: "get",
        url: "http://127.0.0.1:3007/admin/getKeywordReplyList",
        headers: {
          Authorization: this.$store.getters.getUserToken,
        },
        params: {
          keyword: this.replyKeyword,
          higherLevelId: this.currentData.id,
        },
      })
        .then((res) => {
          if (res.data.status === 0) {
            this.replyList = [...res.data.data];
            this.replyViewList = [
              ...this.replyList.slice(0, this.replyPageSize),
            ];
          }
        })
        .catch((err) => {
          console.log(err, "http request failed");
        });
    },
  },
  mounted() {
    this.getCommentsList();
  },
};
</script>

<style>
.el-table {
  background-color: #fff;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
}

.el-table-column {
  text-align: center;
}

.el-pagination {
  margin-top: 20px;
  text-align: center;
}

.el-pagination .el-pager li:not(.active) {
  color: #409eff;
}

.el-pagination .el-pager li.active {
  background-color: #409eff;
  color: white;
}
</style>
