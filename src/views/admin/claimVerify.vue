<template>
  <div class="container">
    <div class="ONE">
      <div class="left">
        <p>
          <span class="link" @click="toIndex">Home</span> > Claim Processing >
          Claim Application
        </p>
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
          prop="article_pic"
          label="Item Image"
          width="110"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-image
              v-if="scope.row.article_pic"
              :preview-src-list="[
                require('../../../public/claim_pic/' + scope.row.article_pic),
              ]"
              style="height: 80px; width: 80px"
              :src="
                require('../../../public/claim_pic/' + scope.row.article_pic)
              "
            ></el-image>
            <el-image
              v-if="!scope.row.article_pic"
              style="height: 60px; width: 60px"
              :src="require('../../../public/no_pic/noArticle.png')"
            ></el-image>
          </template>
        </el-table-column>

        <el-table-column
          prop="initiatorNickname"
          label="Poster "
          width="100"
          header-align="center"
          align="center"
        >
        </el-table-column>

        <el-table-column
          prop=""
          label="Poster Description"
          width
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <p>{{ scope.row.describe }}</p>
          </template>
        </el-table-column>

        <el-table-column
          prop=""
          label="Claimant Description"
          width
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <p>{{ scope.row.handlerDescribe }}</p>
          </template>
        </el-table-column>

        <el-table-column
          prop="handlerNickname"
          label="Claimant"
          width="100"
          header-align="center"
          align="center"
        >
        </el-table-column>

        <el-table-column
          label="Operation"
          width="210"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleView(scope.$index, scope.row)"
              >View</el-button
            >
            <el-button
              size="mini"
              type="success"
              @click="handlePass(scope.$index, scope.row)"
              >Approve</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleFail(scope.$index, scope.row)"
              >Reject</el-button
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
        :total="claimList.length"
      >
      </el-pagination>
    </div>

    <el-dialog
      class="view-dialog"
      title="Lost and Found Information View"
      :visible.sync="dialogVisible"
      width="64%"
      top="10px"
    >
      <div class="dialog-container">
        <div class="top">
          <el-steps
            :space="200"
            align-center
            :active="2"
            finish-status="success"
          >
            <el-step title="Published" :description="view.createDate">
            </el-step>
            <el-step title="Claim Application" :description="view.claimDate">
            </el-step>
            <el-step
              title="Claim Application Approved"
              :description="view.verifyDate"
            >
            </el-step>
            <el-step
              title="Claim Confirmed"
              :description="view.finishDate"
            ></el-step>
          </el-steps>
        </div>
        <div class="bottom">
          <div class="left">
            <el-image
              v-if="view.article_pic"
              :preview-src-list="[
                require('../../../public/claim_pic/' + view.article_pic),
              ]"
              style="height: 200px; width: 200px"
              :src="require('../../../public/claim_pic/' + view.article_pic)"
            ></el-image>
            <el-image
              v-if="!view.article_pic"
              style="height: 200px; width: 200px"
              :src="require('../../../public/no_pic/noArticle.png')"
            ></el-image>
          </div>
          <div class="right">
            <el-descriptions
              title=""
              border
              :column="2"
              :labelStyle="{ width: '20%', 'text-align': 'center' }"
              :contentStyle="{ width: '30%', 'text-align': 'center' }"
            >
              <el-descriptions-item label="Claim ID">{{
                view.id
              }}</el-descriptions-item>
              <el-descriptions-item label="Item Description">{{
                view.resume
              }}</el-descriptions-item>

              <el-descriptions-item label="Item Type">{{
                view.type
              }}</el-descriptions-item>
              <el-descriptions-item label="Lost Location">{{
                view.location
              }}</el-descriptions-item>
            </el-descriptions>

            <el-descriptions
              title=""
              border
              :column="1"
              :labelStyle="{ width: '20%', 'text-align': 'center' }"
              :contentStyle="{ width: '80%', 'text-align': 'center' }"
            >
              <el-descriptions-item label="Lost Time">{{
                view.date
              }}</el-descriptions-item>
              <el-descriptions-item label="Item Details">{{
                view.describe
              }}</el-descriptions-item>
            </el-descriptions>

            <el-descriptions
              title=""
              border
              :column="2"
              :labelStyle="{ width: '20%', 'text-align': 'center' }"
              :contentStyle="{ width: '30%', 'text-align': 'center' }"
            >
              <el-descriptions-item label="Finder ID">{{
                view.initiatorId
              }}</el-descriptions-item>
              <el-descriptions-item label="Claimant ID">{{
                view.handlerId
              }}</el-descriptions-item>

              <el-descriptions-item label="Finder Username">{{
                view.initiatorNickname
              }}</el-descriptions-item>
              <el-descriptions-item label="Claimant Username">{{
                view.handlerNickname
              }}</el-descriptions-item>

              <el-descriptions-item label="Finder Contact">{{
                view.initiatorPhone
              }}</el-descriptions-item>
              <el-descriptions-item label="Claimant Contact">{{
                view.handlerPhone
              }}</el-descriptions-item>

              <el-descriptions-item label="Finder Email">{{
                view.initiatorEmail
              }}</el-descriptions-item>
              <el-descriptions-item label="Claimant Email">{{
                view.handlerEmail
              }}</el-descriptions-item>
            </el-descriptions>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false"
          >Confirm</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCurrentDate } from "@/utils/methods";
import http from "../../utils/request";
export default {
  data() {
    return {
      claimList: [],
      viewList: [],
      view: {},
      dialogVisible: false,
      currentPage: 1,
      pageSize: 5,
      keyword: "",
      editDialogVisible: false,
      form: {},
      formLabelWidth: "70px",
    };
  },
  methods: {
    getClaimVerifyList() {
      http({
        method: "get",
        url: "http://127.0.0.1:3007/admin/getClaimVerifyList",
        headers: {
          Authorization: this.$store.getters.getUserToken,
        },
      })
        .then((res) => {
          if (res.data.status === 0) {
            this.claimList = [...res.data.data];
            this.viewList = [
              ...this.claimList.slice(
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
    // View
    handleView(index, row) {
      this.dialogVisible = true;
      this.view = row;
    },
    // Approve
    handlePass(index, row) {
      if (this.$store.getters.getUserInfo.adminVerifyLOA === "1") {
        http({
          method: "post",
          url: "http://127.0.0.1:3007/admin/addResults",
          headers: {
            Authorization: this.$store.getters.getUserToken,
          },
          params: {
            iuid: row.initiatorId,
            huid: row.handlerId,
            claimId: row.id,
            res: 1,
            managerId: this.$store.getters.getUserInfo.id,
            isNotice: 0,
          },
        })
          .then((res) => {
            if (res.data.status === 0) {
            }
          })
          .catch((err) => {
            console.log(err, "http request failed");
          });

        http({
          method: "post",
          url: "http://127.0.0.1:3007/admin/editClaim",
          headers: {
            Authorization: this.$store.getters.getUserToken,
          },
          params: {
            id: row.id,
            isFound: 2,
            verifyDate: getCurrentDate(),
          },
        })
          .then((res) => {
            if (res.data.status === 0) {
              this.getClaimVerifyList();
              this.$message.success("Successfully!");
            }
          })
          .catch((err) => {
            console.log(err, "http request failed");
          });
      } else {
        this.$message.warning("You do not have permission to review!");
      }
    },

    handleFail(index, row) {
      if (this.$store.getters.getUserInfo.adminVerifyLOA === "1") {
        http({
          method: "post",
          url: "http://127.0.0.1:3007/admin/addResults",
          headers: {
            Authorization: this.$store.getters.getUserToken,
          },
          params: {
            iuid: row.initiatorId,
            huid: row.handlerId,
            claimId: row.id,
            res: 0,
            managerId: this.$store.getters.getUserInfo.id,
            isNotice: 0,
          },
        })
          .then((res) => {
            if (res.data.status === 0) {
            }
          })
          .catch((err) => {
            console.log(err, "http request failed");
          });

        http({
          method: "post",
          url: "http://127.0.0.1:3007/admin/failClaim",
          headers: {
            Authorization: this.$store.getters.getUserToken,
          },
          params: {
            id: row.id,
          },
        })
          .then((res) => {
            if (res.data.status === 0) {
              this.getClaimVerifyList();
              this.$message.success("Successfully!");
            }
          })
          .catch((err) => {
            console.log(err, "http request failed");
          });
      } else {
        this.$message.warning("You do not have permission to review!");
      }
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.viewList = [
        ...this.claimList.slice(
          this.currentPage * this.pageSize - this.pageSize,
          this.currentPage * this.pageSize
        ),
      ];
    },
  },
  mounted() {
    this.getClaimVerifyList();
  },
};
</script>

<style lang="less" scoped>
.container {
  background-color: rgb(255, 255, 255);
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

    /deep/ .isFoundTag:hover {
      cursor: pointer;
    }
  }
  .TWO::-webkit-scrollbar {
    display: none;
  }
  .THREE {
    height: 6%;
  }
  .view-dialog {
    .dialog-container {
      display: flex;
      flex-direction: column;
      .el-dialog__body {
        padding: 0 20px;
      }
      .top {
        width: 100%;
        height: 10%;
        display: flex;
        justify-content: center;
        .el-steps {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
        }
      }
      .bottom {
        width: 100%;
        height: 90%;
        margin-top: 20px;
        display: flex;
        flex-direction: row;
        .left {
          width: 30%;
          height: 100%;
          display: flex;
          justify-content: center;
        }
        .right {
          width: 70%;
          height: 100%;
        }
      }
    }
  }
}
</style>
