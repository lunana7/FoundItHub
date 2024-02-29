<template>
  <div class="container">
    <div class="ONE">
      <div class="left">
        <p>
          <span class="link" @click="toIndex">Home</span> > Data Management >
          Found Item Information Management
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
          prop="createDate"
          label="Publish Date"
          width="190"
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
          label="Publisher"
          sortable
          width="100"
          header-align="center"
          align="center"
        >
        </el-table-column>

        <el-table-column
          prop=""
          label="Item Description"
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
          label="Item Image"
          width="110"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-image
              v-if="scope.row.article_pic"
              :preview-src-list="[
                require('../../../public/revert_pic/' + scope.row.article_pic),
              ]"
              style="height: 80px; width: 80px"
              :src="
                require('../../../public/revert_pic/' + scope.row.article_pic)
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
          label="Founder"
          sortable
          width="100"
          header-align="center"
          align="center"
        >
        </el-table-column>

        <el-table-column
          prop="isFound"
          label="Status"
          sortable
          width="80"
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
                  ? "To be returned"
                  : scope.row.isFound == 0
                  ? "Returned"
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
          width="190"
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
        :total="revertList.length"
      >
      </el-pagination>
    </div>

    <el-dialog
      class="view-dialog"
      title="Lost Item Information"
      :visible.sync="dialogVisible"
      width="64%"
      top="10px"
    >
      <div class="dialog-container">
        <div class="top">
          <el-steps
            :space="200"
            align-center
            :active="
              view.isFound === 0
                ? 4
                : view.isFound === 1
                ? 1
                : view.isFound === 2
                ? 3
                : 2
            "
            finish-status="success"
          >
            <el-step title="Published" :description="view.createDate">
            </el-step>
            <el-step title="Apply for Return" :description="view.revertDate">
            </el-step>
            <el-step
              title="Return Application Approved"
              :description="view.verifyDate"
            >
            </el-step>
            <el-step
              title="Confirm Return"
              :description="view.finishDate"
            ></el-step>
          </el-steps>
        </div>
        <div class="bottom">
          <div class="left">
            <el-image
              v-if="view.article_pic"
              :preview-src-list="[
                require('../../../public/revert_pic/' + view.article_pic),
              ]"
              style="height: 280px; width: 200px"
              :src="require('../../../public/revert_pic/' + view.article_pic)"
            ></el-image>
            <el-image
              v-if="!view.article_pic"
              style="height: 280px; width: 200px"
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
              <el-descriptions-item label="Found Item ID">{{
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
              <el-descriptions-item label="Owner ID">{{
                view.initiatorId
              }}</el-descriptions-item>
              <el-descriptions-item label="Returner ID">{{
                view.handlerId
              }}</el-descriptions-item>

              <el-descriptions-item label="Owner Nickname">{{
                view.initiatorNickname
              }}</el-descriptions-item>
              <el-descriptions-item label="Returner Nickname">{{
                view.handlerNickname
              }}</el-descriptions-item>

              <el-descriptions-item label="Owner Contact">{{
                view.initiatorPhone
              }}</el-descriptions-item>
              <el-descriptions-item label="Returner Contact">{{
                view.handlerPhone
              }}</el-descriptions-item>

              <el-descriptions-item label="Owner Email">{{
                view.initiatorEmail
              }}</el-descriptions-item>
              <el-descriptions-item label="Returner Wechat">{{
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
      title="Found Item Information"
      :visible.sync="editDialogVisible"
      width="90%"
      top="80px"
    >
      <el-form ref="form" :model="form">
        <el-row :gutter="20">
          <el-col :span="4">
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
                  Item Image
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <div
                  class="article_pic"
                  style="display: flex; justify-content: center"
                  @click="changePic"
                >
                  <el-image
                    v-if="form.article_pic"
                    style="height: 200px; width: 200px"
                    :src="
                      require('../../../public/revert_pic/' + form.article_pic)
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

          <el-col :span="10" style="border-left: solid 1px black">
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

              <el-col :span="12">
                <el-form-item
                  label="Type"
                  prop="type"
                  :label-width="formLabelWidth"
                >
                  <el-select
                    v-model="form.type"
                    placeholder="Please select the item type"
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
                  label="Summary"
                  prop="resume"
                  :label-width="formLabelWidth"
                >
                  <el-input
                    v-model.trim="form.resume"
                    placeholder="Please enter a brief description of the item"
                    type="text"
                    maxlength="8"
                    show-word-limit
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item
                  label="Details"
                  prop="describe"
                  :label-width="formLabelWidth"
                >
                  <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="Please enter detailed information about the item"
                    v-model.trim="form.describe"
                    maxlength="30"
                    show-word-limit
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item
                  label="Pickup Time"
                  prop="date"
                  :label-width="formLabelWidth"
                >
                  <el-date-picker
                    style="width: 100%"
                    v-model="form.date"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="Select date"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item
                  label="Return Time"
                  prop="revertDate"
                  :label-width="formLabelWidth"
                  >{{ form.claimDate }}
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item
                  label="Publication Time"
                  prop="createDate"
                  :label-width="formLabelWidth"
                  >{{ form.createDate }}
                </el-form-item>
                <el-form-item
                  label="Completion Time"
                  prop="finishDate"
                  :label-width="formLabelWidth"
                  >{{ form.finishDate }}
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>

          <el-col :span="10" style="border-left: solid 1px black">
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
                  Related User Information
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item
                  label="Finder ID"
                  prop="initiatorId"
                  :label-width="formLabelWidth"
                  >{{ form.initiatorId }}
                </el-form-item>
                <el-form-item
                  label="Nickname"
                  prop="initiatorNickname"
                  :label-width="formLabelWidth"
                  >{{ form.initiatorNickname }}
                </el-form-item>
                <el-form-item
                  label="Phone Number"
                  prop="initiatorPhone"
                  :label-width="formLabelWidth"
                >
                  <el-input
                    v-model.trim="form.initiatorPhone"
                    placeholder="Please enter your phone number"
                    type="text"
                    maxlength="11"
                    show-word-limit
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="Email"
                  prop="initiatorEmail"
                  :label-width="formLabelWidth"
                >
                  <el-input
                    v-model.trim="form.initiatorEmail"
                    placeholder="Please enter your email"
                    type="email"
                  ></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item
                  label="Claimer ID"
                  prop="handlerId"
                  :label-width="formLabelWidth"
                  >{{ form.handlerId }}
                </el-form-item>
                <el-form-item
                  label="Nickname"
                  prop="handlerNickname"
                  :label-width="formLabelWidth"
                  >{{ form.handlerNickname }}
                </el-form-item>
                <el-form-item
                  label="Contact Method"
                  prop="handlerPhone"
                  :label-width="formLabelWidth"
                >
                  <el-input
                    v-model.trim="form.handlerPhone"
                    placeholder="Please enter the contact method"
                    type="text"
                    maxlength="11"
                    show-word-limit
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="email"
                  prop="handlerEmail"
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
      title="Modify Item Picture"
      :visible.sync="articlePicDialogVisible"
      width="30%"
    >
      <span
        >Upload Item Picture
        <el-upload
          action="http://127.0.0.1:3007/my/uploadRevertPic"
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
        <el-button @click="articlePicDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="sureChangePic">Confirm</el-button>
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
          @click="editStatusRevert"
          >To be Returned</el-button
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
          @click="editStatusReverted"
          >Returned</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      class="status-input-dialog"
      title="Claimer ID/Account"
      :visible.sync="statusEditDialogVisible"
      width="30%"
      top="10px"
    >
      <div class="dialog-container">
        <el-input
          type="text"
          placeholder="Please enter the claimer's ID or account"
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
      revertList: [],
      dialogVisible: false,
      viewList: [],
      view: {},
      keyword: "",
      currentPage: 1,
      pageSize: 5,
      editDialogVisible: false,
      form: {},
      formLabelWidth: "70px",
      type: [
        { label: "Keys", value: "Keys" },
        { label: "Pets", value: "Pets" },
        { label: "Documents", value: "Documents" },
        { label: "Digital", value: "Digital" },
        { label: "Makeup", value: "Makeup" },
        { label: "Clothes", value: "Clothes" },
        { label: "Jewelry", value: "Jewelry" },
        { label: "Appliances", value: "Appliances" },
        { label: "Bags", value: "Bags" },
        { label: "Express", value: "Express" },
        { label: "Books", value: "Books" },
        { label: "Others", value: "Others" },
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
            this.viewList = [
              ...this.revertList.slice(
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
      if (this.$store.getters.getUserInfo.adminDataLOA === "2") {
        this.form = { ...row };
        this.editDialogVisible = true;
      } else {
        this.$message.warning("You do not have data management permissions!");
      }
    },

    handleDelete(index, row) {
      if (this.$store.getters.getUserInfo.adminDataLOA === "1") {
        this.$confirm(
          "This operation will permanently delete this file, do you want to continue?",
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
                url: "http://127.0.0.1:3007/my/deleteRevertPic",
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
                    console.log("File deleted successfully");
                  } else {
                    console.log(res.data.data);
                  }
                })
                .catch((err) => {
                  console.log(err, "http request failed");
                });
            }

            http({
              method: "post",
              url: "http://127.0.0.1:3007/my/deleteRevert",
              headers: {
                Authorization: this.$store.getters.getUserToken,
              },
              params: {
                id: row.id,
              },
            })
              .then((res) => {
                if (res.data.status === 0) {
                  this.$message.success(
                    "Successfully deleted found information!"
                  );
                  this.getRevertList();
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
        this.$message.warning("You do not have data management permissions!");
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.viewList = [
        ...this.revertList.slice(
          this.currentPage * this.pageSize - this.pageSize,
          this.currentPage * this.pageSize
        ),
      ];
    },
    search() {
      http({
        method: "get",
        url: "http://127.0.0.1:3007/admin/getKeywordRevertList",
        headers: {
          Authorization: this.$store.getters.getUserToken,
        },
        params: {
          keyword: this.keyword,
        },
      })
        .then((res) => {
          if (res.data.status === 0) {
            this.revertList = [...res.data.data];
            this.viewList = [...this.revertList.slice(0, this.pageSize)];
          }
        })
        .catch((err) => {
          console.log(err, "http request failed");
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          http({
            method: "post",
            url: "http://127.0.0.1:3007/admin/editRevert",
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
              initiatorEmail: this.form.initiatorEmail,
              handlerPhone: this.form.handlerPhone,
              handlerEmail: this.form.handlerEmail,
              id: this.form.id,
            },
          })
            .then((res) => {
              if (res.data.status === 0) {
                this.editDialogVisible = false;
                this.getRevertList();
                this.$message.success(
                  "Successfully modified found information!"
                );
              } else {
                this.$message.warning("Failed to modify found information!");
              }
            })
            .catch((err) => {
              console.log(err, "HTTP request failed");
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
        this.$message.error(
          "Uploaded avatar images can only be in JPG/PNG format!"
        );
        this.files = [];
        return;
      }
      if (!isLt2M) {
        this.$message.error("Uploaded image size cannot exceed 2MB!");
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
        this.$refs.upload.submit();

        http({
          method: "post",
          url: "http://127.0.0.1:3007/admin/editRevert",
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
              this.$message.success("Item image modification successful!");
              this.getRevertList();
              this.articlePicDialogVisible = false;
              this.editDialogVisible = false;
            } else {
              this.$message.warning("Item image modification failed!");
              this.articlePicDialogVisible = false;
            }
          })
          .catch((err) => {
            console.log(err, "HTTP request failed");
          });
      } else {
        this.$message.warning(
          "Upload failed, you did not select an item image!"
        );
        this.articlePicDialogVisible = false;
      }
    },

    cancelEdit() {
      this.editDialogVisible = false;
      this.form = {};
    },

    editStatus(row) {
      this.status = { ...row };
      if (row.isFound === 3) {
        this.$message.warning(
          "Please go to [Application Processing] -> [Return Application] for processing!"
        );
      } else {
        this.statusDialogVisible = true;
      }
    },

    editStatusRevert() {
      if (this.status.finishDate) {
        http({
          method: "post",
          url: "http://127.0.0.1:3007/admin/statusRevertedToRevert",
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
              this.getRevertList();
              this.$message.success("Status modification successful!");
            } else {
              this.$message.warning("Status modification failed!");
            }
          })
          .catch((err) => {
            console.log(err, "HTTP request failed");
          });
      } else {
        http({
          method: "post",
          url: "http://127.0.0.1:3007/admin/statusProcessingToRevert",
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
              this.getRevertList();
              this.$message.success("Status modification successful!");
            } else {
              this.$message.warning("Status modification failed!");
            }
          })
          .catch((err) => {
            console.log(err, "HTTP request failed");
          });
      }
    },
    editStatusProcessing() {
      if (this.status.handlerId) {
        http({
          method: "post",
          url: "http://127.0.0.1:3007/admin/statusRevertedToProcessing",
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
              this.getRevertList();
              this.$message.success("Status modification successful!");
            } else {
              this.$message.warning("Status modification failed!");
            }
          })
          .catch((err) => {
            console.log(err, "HTTP request failed");
          });
      } else {
        this.statusInput = "";
        this.statusEditDialogVisible = true;
      }
    },

    submitHandler() {
      http({
        method: "post",
        url: "http://127.0.0.1:3007/admin/statusRevertToProcessing",
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
            this.getRevertList();
            this.$message.success("Status modification successful!");
          } else {
            this.$message.warning(
              res.data.message || "Status modification failed!"
            );
          }
        })
        .catch((err) => {
          console.log(err, "HTTP request failed");
        });
    },

    editStatusReverted() {
      http({
        method: "post",
        url: "http://127.0.0.1:3007/admin/statusProcessingToReverted",
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
            this.getRevertList();
            this.$message.success("Status modification successful!");
          } else {
            this.$message.warning("Status modification failed!");
          }
        })
        .catch((err) => {
          console.log(err, "HTTP request failed");
        });
    },
  },
  mounted() {
    this.getRevertList();
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
</style>
