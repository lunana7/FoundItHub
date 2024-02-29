<template>
  <div class="container">
    <div class="ONE">
      <div class="left">
        <p>
          <span class="link" @click="toIndex">Home Page</span> > Data Management
          > Claim Information Management
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
        style="width: 100%; text-algin: left"
      >
        <el-table-column
          prop="id"
          label="ID"
          width="60"
          sortable
          header-align="center"
          align="center"
        ></el-table-column>

        <el-table-column
          prop="createDate"
          label="Publish date"
          width="180"
          sortable
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.createDate }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="initiatorNickname"
          label="publisher"
          sortable
          width="100"
          header-align="center"
          align="center"
        >
        </el-table-column>

        <el-table-column
          prop=""
          label="description"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <p>{{ scope.row.resume }}</p>
            <p>{{ scope.row.describe }}</p>
          </template>
        </el-table-column>

        <el-table-column
          prop="article_pic"
          label="item image"
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
          prop="handlerNickname"
          label="claimant"
          sortable
          width="100"
          header-align="center"
          align="center"
        >
        </el-table-column>

        <el-table-column
          prop="isFound"
          label="status"
          sortable
          width="110"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag
              class="isFoundTag"
              :type="
                scope.row.isFound == 1
                  ? 'info'
                  : scope.row.isFound == 0
                  ? 'success'
                  : scope.row.isFound == 2
                  ? 'warning'
                  : 'primary'
              "
              disable-transitions
              @click="editStatus(scope.row)"
            >
              {{
                scope.row.isFound == 1
                  ? "Awaiting Claim"
                  : scope.row.isFound == 0
                  ? "Claimed"
                  : scope.row.isFound == 2
                  ? "Processing"
                  : "Applying"
              }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          prop="finishDate"
          label="Completion Date"
          sortable
          width="180"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <i class="el-icon-time" v-if="scope.row.finishDate"></i>
            <span style="margin-left: 10px">{{ scope.row.finishDate }}</span>
          </template>
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
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
              >Edit</el-button
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
        :total="claimList.length"
      >
      </el-pagination>
    </div>

    <el-dialog
      class="view-dialog"
      title="Lost & Found Information"
      :visible.sync="dialogVisible"
      width="80%"
      top="10px"
    >
      <div class="dialog-container">
        <div class="top">
          <el-steps
            :space="200"
            align-center
            :active="
              view.isFound == 0
                ? 4
                : view.isFound == 1
                ? 1
                : view.isFound == 2
                ? 3
                : 2
            "
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
              title="Claim Confirmation"
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
              style="height: 200px; width: 100px"
              :src="require('../../../public/claim_pic/' + view.article_pic)"
            ></el-image>
            <el-image
              v-if="!view.article_pic"
              style="height: 200px; width: 100px"
              :src="require('../../../public/no_pic/noArticle.png')"
            ></el-image>
          </div>
          <div class="right">
            <el-descriptions
              title=""
              border
              :column="1"
              :labelStyle="{ width: '30%', 'text-align': 'center' }"
              :contentStyle="{ width: '70%', 'text-align': 'center' }"
            >
              <el-descriptions-item label="Claim ID">{{
                view.id
              }}</el-descriptions-item>
              <el-descriptions-item label="Item Summary">{{
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
              :labelStyle="{ width: '30%', 'text-align': 'center' }"
              :contentStyle="{ width: '80%', 'text-align': 'center' }"
            >
              <el-descriptions-item label="Lost">{{
                view.date
              }}</el-descriptions-item>
              <el-descriptions-item label="Email">{{
                view.describe
              }}</el-descriptions-item>
            </el-descriptions>

            <el-descriptions
              title=""
              border
              :column="2"
              :labelStyle="{ width: '30%', 'text-align': 'center' }"
              :contentStyle="{ width: '30%', 'text-align': 'center' }"
            >
              <el-descriptions-item label="Finder ID">{{
                view.initiatorId
              }}</el-descriptions-item>
              <el-descriptions-item label="Claimer ID">{{
                view.handlerId
              }}</el-descriptions-item>

              <el-descriptions-item label="Finder Nickname">{{
                view.initiatorNickname
              }}</el-descriptions-item>
              <el-descriptions-item label="Claimer Nickname">{{
                view.handlerNickname
              }}</el-descriptions-item>

              <el-descriptions-item label="Finder Contact">{{
                view.initiatorPhone
              }}</el-descriptions-item>
              <el-descriptions-item label="Claimer Contact">{{
                view.handlerPhone
              }}</el-descriptions-item>

              <el-descriptions-item label="Finder Email">{{
                view.initiatorEmail
              }}</el-descriptions-item>
              <el-descriptions-item label="Claimer Email">{{
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

    <el-dialog
      class="edit-dialog"
      title="edit"
      :visible.sync="editDialogVisible"
      width="80%"
      top="80px"
    >
      <el-form ref="form" :model="form">
        <el-row :gutter="20">
          <el-col :span="2">
            <!-- image-->
            <el-row :gutter="20">
              <el-col :span="22">
                <div
                  style="
                    text-align: center;
                    font-size: 1.2em;
                    font-weight: bolder;
                    margin-bottom: 10px;
                  "
                >
                  image
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="15">
                <div
                  class="article_pic"
                  style="display: flex; justify-content: center"
                  @click="changePic"
                >
                  <el-image
                    v-if="form.article_pic"
                    style="height: 200px; width: 200px"
                    :src="
                      require('../../../public/claim_pic/' + form.article_pic)
                    "
                  ></el-image>
                  <el-image
                    v-if="!form.article_pic"
                    style="height: 200px; width: 200px"
                    :src="require('../../../public/no_pic/noArticle.png')"
                  ></el-image>
                </div>
              </el-col>
            </el-row>
          </el-col>

          <el-col :span="10" style="border-left: solid 1px rgb(0, 146, 237)">
            <!-- left-->
            <el-row :gutter="20">
              <el-col :span="24">
                <div
                  style="
                    text-align: center;
                    font-size: 1.2em;
                    font-weight: bolder;
                    margin-bottom: 10px;
                  "
                >
                  Item Information
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <!-- first colunm -->
              <el-col :span="12">
                <el-form-item label="ID" prop="id" :label-width="formLabelWidth"
                  >{{ form.id }}
                </el-form-item>
                <el-form-item
                  label="Location"
                  prop="location"
                  :label-width="formLabelWidth"
                >
                  <el-input
                    v-model.trim="form.location"
                    placeholder="Please enter the pickup location"
                    type="text"
                    maxlength="10"
                    show-word-limit
                  ></el-input>
                </el-form-item>
              </el-col>
              <!-- second colunm -->
              <el-col :span="12">
                <el-form-item
                  label="type"
                  prop="type"
                  :label-width="formLabelWidth"
                >
                  <el-select
                    v-model="form.type"
                    placeholder="item type"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in type"
                      :key="item.index"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="description"
                  prop="resume"
                  :label-width="formLabelWidth"
                >
                  <el-input
                    v-model.trim="form.resume"
                    placeholder="description"
                    type="text"
                    maxlength="20"
                    show-word-limit
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item
                  label="details"
                  prop="describe"
                  :label-width="formLabelWidth"
                >
                  <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="please enter the details of the item"
                    v-model.trim="form.describe"
                    maxlength="50"
                    show-word-limit
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <!-- first column -->
              <el-col :span="12">
                <el-form-item
                  label="拾取时间"
                  prop="date"
                  :label-width="formLabelWidth"
                >
                  <el-date-picker
                    style="width: 100%"
                    v-model="form.date"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item
                  label="认领时间"
                  prop="claimDate"
                  :label-width="formLabelWidth"
                  >{{ form.claimDate }}
                </el-form-item>
              </el-col>
              <!-- 第二列 -->
              <el-col :span="12">
                <el-form-item
                  label="发布时间"
                  prop="createDate"
                  :label-width="formLabelWidth"
                  >{{ form.createDate }}
                </el-form-item>
                <el-form-item
                  label="完成时间"
                  prop="finishDate"
                  :label-width="formLabelWidth"
                  >{{ form.finishDate }}
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>

          <el-col :span="10" style="border-left: solid 1px rgb(0, 146, 237)">
            <!-- 表格 右 -->
            <el-row :gutter="20">
              <el-col :span="24">
                <div
                  style="
                    text-align: center;
                    font-size: 1.2em;
                    font-weight: bolder;
                    margin-bottom: 10px;
                  "
                >
                  相关用户信息
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <!-- 第一列 -->
              <el-col :span="12">
                <el-form-item
                  label="拾物者ID"
                  prop="initiatorId"
                  :label-width="formLabelWidth"
                  >{{ form.initiatorId }}
                </el-form-item>
                <el-form-item
                  label="昵称"
                  prop="initiatorNickname"
                  :label-width="formLabelWidth"
                  >{{ form.initiatorNickname }}
                </el-form-item>
                <el-form-item
                  label="联系方式"
                  prop="initiatorPhone"
                  :label-width="formLabelWidth"
                >
                  <el-input
                    v-model.trim="form.initiatorPhone"
                    placeholder="请输入联系方式"
                    type="text"
                    maxlength="11"
                    show-word-limit
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="微信"
                  prop="initiatorWechat"
                  :label-width="formLabelWidth"
                >
                  <el-input
                    v-model.trim="form.initiatorWechat"
                    placeholder="请输入微信"
                    type="text"
                  ></el-input>
                </el-form-item>
              </el-col>
              <!-- 第二列 -->
              <el-col :span="12">
                <el-form-item
                  label="认领者ID"
                  prop="handlerId"
                  :label-width="formLabelWidth"
                  >{{ form.handlerId }}
                </el-form-item>
                <el-form-item
                  label="Username"
                  prop="handlerNickname"
                  :label-width="formLabelWidth"
                  >{{ form.handlerNickname }}
                </el-form-item>
                <el-form-item
                  label="Phone Number"
                  prop="handlerPhone"
                  :label-width="formLabelWidth"
                >
                  <el-input
                    v-model.trim="form.handlerPhone"
                    placeholder="Please enter your phone number"
                    type="text"
                    maxlength="11"
                    show-word-limit
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="Email"
                  prop="handlerWechat"
                  :label-width="formLabelWidth"
                >
                  <el-input
                    v-model.trim="form.handlerEmail"
                    placeholder="Please enter your email"
                    type="email"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('form')"
          >Confirm</el-button
        >
        <el-button type="info" @click="cancelEdit()">Cancel</el-button>
      </span>
    </el-dialog>

    <el-dialog
      class="articlePic-dialog"
      title="修改物品图片"
      :visible.sync="articlePicDialogVisible"
      width="30%"
    >
      <span
        >上传物品图片
        <el-upload
          action="http://127.0.0.1:3007/my/uploadClaimPic"
          ref="upload"
          :headers="myHeaders"
          :auto-upload="false"
          :limit="limit"
          :file-list="files"
          list-type="picture-card"
          :on-change="uploadChange"
          :on-remove="uploadRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="articlePicDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureChangePic">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      class="status-dialog"
      title="Status Modification"
      :visible.sync="statusDialogVisible"
      width="30%"
      top="10px"
    >
      <div class="dialog-container">
        <el-button
          type="primary"
          :disabled="status.isFound == 1"
          @click="editStatusClaim"
          >Awaiting Claim</el-button
        >
        <el-button
          type="warning"
          :disabled="status.isFound == 2"
          @click="editStatusProcessing"
          >Processing</el-button
        >
        <el-button
          type="success"
          :disabled="status.isFound == 0 || status.isFound == 1"
          @click="editStatusClaimed"
          >Claimed</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      class="status-input-dialog"
      title="Claimant ID/Account"
      :visible.sync="statusEditDialogVisible"
      width="30%"
      top="10px"
    >
      <div class="dialog-container">
        <el-input
          type="text"
          placeholder="Please enter the claimant ID or account"
          v-model="statusInput"
        ></el-input>
        <el-button type="primary" @click="submitHandler">Submit</el-button>
      </div>
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
      type: [
        { label: "Key", value: "Key" },
        { label: "Pet", value: "Pet" },
        { label: "Document", value: "Document" },
        { label: "Digital", value: "Digital" },
        { label: "Makeup", value: "Makeup" },
        { label: "Clothes", value: "Clothes" },
        { label: "Jewelry", value: "Jewelry" },
        { label: "Appliance", value: "Appliance" },
        { label: "Bag", value: "Bag" },
        { label: "Express", value: "Express" },
        { label: "Book", value: "Book" },
        { label: "Other", value: "Other" },
      ],
      statusDialogVisible: false,
      status: {},
      statusEditDialogVisible: false,
      statusInput: "",
      articlePicDialogVisible: false,
      myHeaders: { Authorization: this.$store.getters.getUserToken },
      limit: 1,
      files: [],
    };
  },
  methods: {
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

    handleView(index, row) {
      console.log(index, row);
      this.dialogVisible = true;
      this.view = row;
    },
    handleEdit(index, row) {
      console.log(index, row);
      if (this.$store.getters.getUserInfo.adminDataLOA === "1") {
        // TODO
        this.form = { ...row };
        this.editDialogVisible = true;
      } else {
        this.$message.warning("You do not have data management privileges！");
      }
    },
    // 删除
    handleDelete(index, row) {
      // console.log(index, row)
      if (this.$store.getters.getUserInfo.adminDataLOA === "1") {
        this.$confirm(
          "This operation will permanently delete the file, do you want to continue?",
          "Prompt",
          {
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
            type: "warning",
          }
        )
          .then(() => {
            if (row.article_pic) {
              http({
                method: "post",
                url: "http://127.0.0.1:3007/my/deleteClaimPic",
                headers: {
                  Authorization: this.$store.getters.getUserToken,
                },
                params: {
                  article_pic: row.article_pic,
                  id: row.id,
                },
              })
                .then((res) => {
                  if (res.data.status === 0) {
                    console.log("File deleted successfully!");
                  }
                })
                .catch((err) => {
                  console.log(err, "HTTP request failed");
                });
            }
            //delete database data

            http({
              method: "post",
              url: "http://127.0.0.1:3007/my/deleteClaim",
              headers: {
                Authorization: this.$store.getters.getUserToken,
              },
              params: {
                id: row.id,
              },
            })
              .then((res) => {
                if (res.data.status === 0) {
                  this.$message.success("删除招领信息成功！");
                  this.getClaimList();
                }
              })
              .catch((err) => {
                console.log(err, "http请求失败");
              });
          })
          .catch(() => {
            this.$message.info("已取消删除！");
          });
      } else {
        this.$message.warning("您没有数据管理权限！");
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
    // search
    search() {
      http({
        method: "get",
        url: "http://127.0.0.1:3007/admin/getKeywordClaimList",
        headers: {
          Authorization: this.$store.getters.getUserToken,
        },
        params: {
          keyword: this.keyword,
        },
      })
        .then((res) => {
          if (res.data.status === 0) {
            this.claimList = [...res.data.data];
            this.viewList = [...this.claimList.slice(0, this.pageSize)];
          }
        })
        .catch((err) => {
          console.log(err, "http请求失败");
        });
    },
    // 提交修改信息的表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          http({
            method: "post",
            url: "http://127.0.0.1:3007/admin/editClaim",
            headers: {
              Authorization: this.$store.getters.getUserToken,
            },
            params: {
              type: this.form.type,
              location: this.form.location,
              resume: this.form.resume,
              describe: this.form.describe,
              date: this.form.date,
              initiatorPhone: this.form.initiatorPhone,
              initiatorWechat: this.form.initiatorWechat,
              initiatorQQ: this.form.initiatorQQ,
              handlerPhone: this.form.handlerPhone,
              handlerWechat: this.form.handlerWechat,
              handlerQQ: this.form.handlerQQ,
              id: this.form.id,
            },
          })
            .then((res) => {
              if (res.data.status === 0) {
                this.editDialogVisible = false;
                this.getClaimList();
                this.$message.success("修改招领信息成功！");
              } else {
                this.$message.warning("修改招领信息失败！");
              }
            })
            .catch((err) => {
              console.log(err, "http请求失败");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    changePic() {
      this.files = [];
      this.articlePicDialogVisible = true;
    },
    uploadChange(file) {
      const isJPGorPNG =
        file.raw.type === "image/jpeg" || file.raw.type === "image/png";
      const isLt2M = file.raw.size / 1024 / 1024 < 2;
      if (!isJPGorPNG) {
        this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
        this.files = [];
        return;
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
        this.files = [];
        return;
      }

      this.files.push(file);
    },
    uploadRemove() {
      this.files.pop();
    },
    sureChangePic() {
      if (this.files.length == 1) {
        // 上传图片
        this.$refs.upload.submit();
        // 改写数据库数据
        http({
          method: "post",
          url: "http://127.0.0.1:3007/admin/editClaim",
          headers: {
            Authorization: this.$store.getters.getUserToken,
          },
          params: {
            article_pic: this.files[0].name,
            id: this.form.id,
          },
        })
          .then((res) => {
            if (res.data.status === 0) {
              this.$message.success("修改物品图片成功！");
              this.getClaimList();
              this.articlePicDialogVisible = false;
              this.editDialogVisible = false;
            } else {
              this.$message.warning("修改物品图片失败！");
              this.articlePicDialogVisible = false;
            }
          })
          .catch((err) => {
            console.log(err, "http请求失败");
          });
      } else {
        this.$message.warning("上传失败，您未选择物品图片！");
        this.articlePicDialogVisible = false;
      }
    },
    // 取消修改信息
    cancelEdit() {
      this.editDialogVisible = false;
      this.form = {};
    },
    // 修改状态
    editStatus(row) {
      // console.log(row, 'row')
      this.status = { ...row };
      if (row.isFound === 3) {
        this.$message.warning("请到【申请处理】->【认领申请】中处理！");
      } else {
        this.statusDialogVisible = true;
      }
    },
    // 修改状态 处理中/已认领 -> 待认领 的按钮
    editStatusClaim() {
      console.log(this.currentPage, "当前页 1");
      // true: 已认领 -> 待认领，  false: 处理中 -> 待认领
      if (this.status.finishDate) {
        http({
          method: "post",
          url: "http://127.0.0.1:3007/admin/statusClaimedToClaim",
          headers: {
            Authorization: this.$store.getters.getUserToken,
          },
          params: {
            id: this.status.id,
          },
        })
          .then((res) => {
            if (res.data.status === 0) {
              this.statusDialogVisible = false;
              this.getClaimList();
              this.$message.success("状态修改成功！");
              console.log(this.currentPage, "当前页 2");
            } else {
              this.$message.warning("状态修改失败！");
            }
          })
          .catch((err) => {
            console.log(err, "http请求失败");
          });
      } else {
        http({
          method: "post",
          url: "http://127.0.0.1:3007/admin/statusProcessingToClaim",
          headers: {
            Authorization: this.$store.getters.getUserToken,
          },
          params: {
            id: this.status.id,
          },
        })
          .then((res) => {
            if (res.data.status === 0) {
              this.statusDialogVisible = false;
              this.getClaimList();
              this.$message.success("状态修改成功！");
            } else {
              this.$message.warning("状态修改失败！");
            }
          })
          .catch((err) => {
            console.log(err, "http请求失败");
          });
      }
    },

    editStatusProcessing() {
      if (this.status.handlerId) {
        http({
          method: "post",
          url: "http://127.0.0.1:3007/admin/statusClaimedToProcessing",
          headers: {
            Authorization: this.$store.getters.getUserToken,
          },
          params: {
            id: this.status.id,
          },
        })
          .then((res) => {
            if (res.data.status === 0) {
              this.statusDialogVisible = false;
              this.getClaimList();
              this.$message.success("状态修改成功！");
            } else {
              this.$message.warning("状态修改失败！");
            }
          })
          .catch((err) => {
            console.log(err, "http请求失败");
          });
      } else {
        this.statusInput = "";
        this.statusEditDialogVisible = true;
      }
    },

    submitHandler() {
      http({
        method: "post",
        url: "http://127.0.0.1:3007/admin/statusClaimToProcessing",
        headers: {
          Authorization: this.$store.getters.getUserToken,
        },
        params: {
          input: this.statusInput,
          date: getCurrentDate(),
          id: this.status.id,
        },
      })
        .then((res) => {
          if (res.data.status === 0) {
            this.statusEditDialogVisible = false;
            this.statusDialogVisible = false;
            this.statusInput = "";
            this.getClaimList();
            this.$message.success("状态修改成功！");
          } else {
            this.$message.warning(res.data.message || "状态修改失败！");
          }
        })
        .catch((err) => {
          console.log(err, "http请求失败");
        });
    },

    editStatusClaimed() {
      http({
        method: "post",
        url: "http://127.0.0.1:3007/admin/statusProcessingToClaimed",
        headers: {
          Authorization: this.$store.getters.getUserToken,
        },
        params: {
          date: getCurrentDate(),
          id: this.status.id,
        },
      })
        .then((res) => {
          if (res.data.status === 0) {
            this.statusDialogVisible = false;
            this.getClaimList();
            this.$message.success("状态修改成功！");
          } else {
            this.$message.warning("状态修改失败！");
          }
        })
        .catch((err) => {
          console.log(err, "http请求失败");
        });
    },
  },
  mounted() {
    this.getClaimList();
  },
};
</script>

<style lang="less" scoped>
.container {
  font-family: "Open Sans";
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
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background-color: #f5f5f5;
  }

  .left {
    flex: 0.5;
  }

  .right {
    display: flex;
    align-items: center;
  }

  p {
    margin: 0;
    color: #333;
  }

  .link {
    color: #3498db;
    cursor: pointer;
  }

  .el-input {
    margin-right: 10px;
  }
  .TWO {
    height: 88%;
    overflow-y: scroll;
    // background: firebrick;
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

  .status-dialog {
    .dialog-container {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
    }
  }
  .status-input-dialog {
    .dialog-container {
      display: flex;
      flex-direction: row;
      .el-button {
        margin-left: 10px;
      }
    }
  }
  .edit-dialog {
    .article_pic:hover {
      cursor: pointer;
      opacity: 0.5;
    }
  }
}
.el-button--primary {
  background-color: #8e44ad;
  border-color: #8e44ad;
  color: #fff;
}

.el-button--warning {
  background-color: #e67e22;
  border-color: #e67e22;
  color: #fff;
}

.el-button--success {
  background-color: #27ae60;
  border-color: #27ae60;
  color: #fff;
}
.isFoundTag {
  cursor: pointer;
  color: #fff;
  font-weight: bold;
}

.el-tag--info {
  background-color: #3498db;
}

.el-tag--success {
  background-color: #2ecc71;
}

.el-tag--warning {
  background-color: #e67e22;
}

.el-tag--primary {
  background-color: #9b59b6;
}
</style>
