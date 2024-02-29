<template>
  <div>
    <div style="text-align: center">
      <h2>Lost and Found Listings I Posted</h2>
    </div>

    <div class="search" style="display: flex; justify-content: center">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="Item Type" style="margin-bottom: 10px">
          <el-select
            v-model="searchForm.type"
            ref="typeSelect"
            placeholder="Item Type"
            style="width: 110px"
            @change="typeSelectChange()"
            @clear="typeSelectClear()"
            clearable
            filterable
          >
            <el-option
              v-for="item in type"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Keyword" style="margin-bottom: 10px">
          <el-input
            v-model.trim="searchForm.keyword"
            placeholder="Please enter the keyword"
            @change="keywordInput()"
            @clear="keyworkClear()"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="userClaimList" stripe border style="width: 100%">
      <el-table-column
        fixed="left"
        sortable
        prop="date"
        label="Pick-up Date"
        width="110"
      ></el-table-column>
      <el-table-column
        sortable
        prop="createDate"
        label="Publish Date"
        width="110"
      ></el-table-column>
      <!-- <el-table-column sortable prop="type" label="Type" width="80"> </el-table-column> -->
      <el-table-column
        sortable
        prop="location"
        label="Pick-up Location"
        min-width="170"
      ></el-table-column>
      <el-table-column prop="resume" label="Summary (Details)" min-width="140">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>Details: {{ scope.row.describe }}</p>
            <div slot="reference" class="name-wrapper">
              {{ scope.row.resume }}
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="initiatorPhone"
        label="Reserved Number"
        width="120"
      >
      </el-table-column>

      <el-table-column
        sortable
        fixed="right"
        prop="isFound"
        label="status"
        width="80"
      >
        <template slot-scope="scope">
          <el-tag
            :type="
              scope.row.isFound == 1
                ? 'primary'
                : scope.row.isFound == 0
                ? 'success'
                : 'warning'
            "
            disable-transitions
          >
            {{
              scope.row.isFound == 1
                ? "Awaiting Claim"
                : scope.row.isFound == 0
                ? "Claimed"
                : "Processing"
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="Operation" width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            v-if="scope.row.isFound != 1"
            @click="handleView(scope.$index, scope.row)"
            >View</el-button
          >
          <el-button
            size="mini"
            v-if="scope.row.isFound == 1"
            @click="handleEdit(scope.$index, scope.row)"
            >Edit</el-button
          >
          <el-button
            size="mini"
            type="danger"
            v-if="scope.row.isFound == 1"
            @click="handleDelete(scope.$index, scope.row)"
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗 -->
    <el-dialog
      title="hint"
      :visible.sync="dialogVisible"
      width="60%"
      top="10px"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row :gutter="20" style="margin-top: 40px">
          <el-col :span="12">
            <el-form-item
              label="Description"
              prop="resume"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model.trim="form.resume"
                placeholder="Please enter a brief description of the item"
                type="text"
                maxlength="8"
                show-word-limit
                :disabled="dialogDisabled"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="Pick-up Location"
              prop="location"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model.trim="form.location"
                placeholder="Please enter the pick-up location"
                type="text"
                maxlength="10"
                show-word-limit
                :disabled="dialogDisabled"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="Date"
              prop="date"
              :label-width="formLabelWidth"
            >
              <el-date-picker
                :disabled="dialogDisabled"
                style="width: 100%"
                v-model="form.date"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="Choose Date"
              >
              </el-date-picker>
              <!-- <el-input type="date" v-model="form.date" :disabled="dialogDisabled"></el-input> -->
            </el-form-item>
            <el-form-item
              label="type"
              prop="type"
              :label-width="formLabelWidth"
            >
              <el-select
                v-model="form.type"
                placeholder="Please select the type of item"
                style="width: 100%"
                :disabled="dialogDisabled"
              >
                <el-option
                  v-for="item in type"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="Details"
              prop="describe"
              :label-width="formLabelWidth"
            >
              <el-input
                type="textarea"
                resize="none"
                :rows="5"
                placeholder="Please enter the details of the item (within 50 words)"
                v-model.trim="form.describe"
                maxlength="50"
                show-word-limit
                :disabled="dialogDisabled"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              label="image"
              prop="article_pic"
              :label-width="formLabelWidth"
            >
              <el-image
                v-if="form.article_pic"
                :preview-src-list="[
                  require('../../../public/claim_pic/' + form.article_pic),
                ]"
                style="height: 120px; width: 120px"
                :src="require('../../../public/claim_pic/' + form.article_pic)"
              ></el-image>

              <el-image
                v-if="!form.article_pic"
                style="height: 120px; width: 120px"
                :src="require('../../../public/no_pic/noArticle.png')"
              ></el-image>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item
              label="Contact Number"
              prop="initiatorPhone"
              :label-width="80"
            >
              <el-input
                v-model.trim="form.initiatorPhone"
                placeholder="Please enter the contact number"
                type="text"
                maxlength="11"
                show-word-limit
                clearable
                :disabled="dialogDisabled"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="email" prop="initiatorEmail" :label-width="80">
              <el-input
                v-model.trim="form.initiatorEmail"
                placeholder="Please enter the email"
                type="text"
                maxlength="20"
                show-word-limit
                clearable
                :disabled="dialogDisabled"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="dialogDisabled">
          <el-col :span="8">
            <el-form-item
              label="handlerPhone"
              prop="handlerPhone"
              :label-width="80"
            >
              <el-tag type="success" style="font-size: 16px; width: 100%">{{
                form.handlerPhone == "" ? "Not Provided" : form.handlerPhone
              }}</el-tag>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="email" prop="handlerEmail" :label-width="80">
              <el-tag type="success" style="font-size: 16px; width: 100%">{{
                form.handlerEmail == "" ? "Not Provided" : form.handlerEmail
              }}</el-tag>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="22">
            <el-form-item
              style="display: flex; justify-content: center"
              v-if="!dialogDisabled"
            >
              <el-button type="primary" @click="submitForm('form')"
                >Edit</el-button
              >

              <el-button type="info" @click="dialogVisible = false"
                >Cancel</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import http from "../../utils/request";
export default {
  data() {
    return {
      userClaimList: [],
      searchForm: {
        keyword: "",
        type: "",
      },
      type: [],
      dialogVisible: false,
      dialogDisabled: false, // Dialog input box status  true-disabled  false-available
      formLabelWidth: "80px",
      form: {},
      rules: {
        resume: [
          {
            required: true,
            message: "Please enter a brief description of the item",
            trigger: "blur",
          },
        ],
        describe: [
          {
            required: true,
            message: "Please enter detailed information about the item",
            trigger: "blur",
          },
        ],
        type: [
          {
            required: true,
            message: "Please enter the item type",
            trigger: "blur",
          },
        ],
        location: [
          {
            required: true,
            message: "Please enter the pick-up location",
            trigger: "blur",
          },
        ],
        date: [
          {
            required: true,
            message: "Please enter the pick-up date",
            trigger: "blur",
          },
        ],
        initiatorPhone: [
          {
            required: true,
            message: "Please enter the contact information",
            trigger: "blur",
          },
          {
            validator: function (rule, value, callback) {
              if (/^\+(?:[0-9] ?){6,14}[0-9]$/.test(value) == false) {
                callback(
                  new Error("Please enter a valid international phone number")
                );
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    getUserClaimList() {
      http({
        method: "get",
        url: "http://127.0.0.1:3007/my/getUserClaim",
        headers: {
          Authorization: this.$store.getters.getUserToken,
        },
      })
        .then((res) => {
          if (res.data.status === 0) {
            res.data.data.forEach((item) => {
              item.date = item.date.slice(0, 10);
              item.createDate = item.createDate.slice(0, 10);
            });

            this.$store.dispatch("asyncUpdateUserClaim", res.data.data);

            this.userClaimList = [...this.$store.getters.getUserClaim];
          } else {
            this.$message({
              showClose: true,
              message: res.data.message,
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.$message({
            showClose: true,
            message: err,
            type: "error",
          });
        });
    },
    handleClick(row) {},
    handleView(index, row) {
      this.dialogVisible = true;
      this.dialogDisabled = true;

      this.form = { ...row };
    },
    handleEdit(index, row) {
      this.dialogVisible = true;
      this.dialogDisabled = false;

      this.form = { ...row };
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          http({
            method: "post",
            url: "http://127.0.0.1:3007/my/editClaim",
            headers: {
              Authorization: this.$store.getters.getUserToken,
            },
            params: {
              id: this.form.id,
              resume: this.form.resume,
              location: this.form.location,
              date: this.form.date,
              type: this.form.type,
              describe: this.form.describe,
              article_pic: this.form.article_pic,
              initiatorPhone: this.form.initiatorPhone,
              initiatorWechat: this.form.initiatorWechat,
              initiatorQQ: this.form.initiatorQQ,
            },
          })
            .then((res) => {
              if (res.data.status === 0) {
                this.dialogVisible = false;
                this.$message({
                  showClose: true,
                  message: "Modification successful",
                  type: "success",
                });
                this.getUserClaimList();
              } else {
                this.$message({
                  showClose: true,
                  message: res.data.message,
                  type: "warning",
                });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleDelete(index, row) {
      console.log(index, row);
      this.$confirm(
        "This operation will permanently delete this information, do you want to continue?",
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
                this.$message({
                  showClose: true,
                  type: "success",
                  message: "Delete successfully!",
                });
                this.getUserClaimList();
              } else {
                this.$message({
                  showClose: true,
                  type: "warning",
                  message: res.data.message,
                });
              }
            })
            .catch((err) => {
              console.log(err);
            });

          if (row.article_pic != "") {
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
                // console.log(res.data.message)
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch(() => {
          this.$message({
            showClose: true,
            type: "info",
            message: "Deletion cancelled",
          });
        });
    },
    typeSelectClear() {
      if (this.searchForm.keyword) {
        this.userClaimList = this.$store.getters.getUserClaim;

        const claimList_resume = this.userClaimList.filter((item) =>
          item.resume.includes(this.searchForm.keyword)
        );
        const claimList_describe = this.userClaimList.filter((item) =>
          item.describe.includes(this.searchForm.keyword)
        );
        const claimList_location = this.userClaimList.filter((item) =>
          item.location.includes(this.searchForm.keyword)
        );
        const array = [
          ...claimList_resume,
          ...claimList_describe,
          ...claimList_location,
        ];
        this.userClaimList = array.filter(function (item, index, arr) {
          return arr.indexOf(item, 0) === index;
        });
      } else {
        this.userClaimList = this.$store.getters.getUserClaim;
      }
    },
    typeSelectChange() {
      if (this.searchForm.keyword) {
        this.userClaimList = this.$store.getters.getUserClaim;

        const claimList_resume = this.userClaimList.filter((item) =>
          item.resume.includes(this.searchForm.keyword)
        );
        const claimList_describe = this.userClaimList.filter((item) =>
          item.describe.includes(this.searchForm.keyword)
        );
        const claimList_location = this.userClaimList.filter((item) =>
          item.location.includes(this.searchForm.keyword)
        );
        const array = [
          ...claimList_resume,
          ...claimList_describe,
          ...claimList_location,
        ];
        this.userClaimList = array.filter(function (item, index, arr) {
          return arr.indexOf(item, 0) === index;
        });

        this.userClaimList = this.userClaimList.filter(
          (item) => item.type == this.searchForm.type
        );
      } else {
        this.userClaimList = this.$store.getters.getUserClaim;

        this.userClaimList = this.userClaimList.filter(
          (item) => item.type == this.searchForm.type
        );
      }
    },
    keywordClear() {
      if (this.searchForm.type) {
        this.userClaimList = this.$store.getters.getUserClaim;

        this.userClaimList = this.userClaimList.filter(
          (item) => item.type == this.searchForm.type
        );
      } else {
        this.userClaimList = this.$store.getters.getUserClaim;
      }
    },
    keywordInput() {
      if (this.searchForm.keyword) {
        if (this.searchForm.type) {
          this.userClaimList = this.$store.getters.getUserClaim;

          this.userClaimList = this.userClaimList.filter(
            (item) => item.type == this.searchForm.type
          );

          const claimList_resume = this.userClaimList.filter((item) =>
            item.resume.includes(this.searchForm.keyword)
          );
          const claimList_describe = this.userClaimList.filter((item) =>
            item.describe.includes(this.searchForm.keyword)
          );
          const claimList_location = this.userClaimList.filter((item) =>
            item.location.includes(this.searchForm.keyword)
          );
          const array = [
            ...claimList_resume,
            ...claimList_describe,
            ...claimList_location,
          ];
          this.userClaimList = array.filter(function (item, index, arr) {
            return arr.indexOf(item, 0) === index;
          });
        } else {
          this.userClaimList = this.$store.getters.getUserClaim;

          const claimList_resume = this.userClaimList.filter((item) =>
            item.resume.includes(this.searchForm.keyword)
          );
          const claimList_describe = this.userClaimList.filter((item) =>
            item.describe.includes(this.searchForm.keyword)
          );
          const claimList_location = this.userClaimList.filter((item) =>
            item.location.includes(this.searchForm.keyword)
          );
          const array = [
            ...claimList_resume,
            ...claimList_describe,
            ...claimList_location,
          ];
          this.userClaimList = array.filter(function (item, index, arr) {
            return arr.indexOf(item, 0) === index;
          });
        }
      } else {
        if (this.searchForm.type) {
          this.userClaimList = this.$store.getters.getUserClaim;

          this.userClaimList = this.userClaimList.filter(
            (item) => item.type == this.searchForm.type
          );
        } else {
          this.userClaimList = this.$store.getters.getUserClaim;
        }
      }
    },
  },
  mounted() {
    this.getUserClaimList();
    this.type = [...this.$store.getters.getType];
  },
};
</script>

<style lang="less" scoped>
/deep/ .el-dialog__header {
  padding: 20px 20px 0;
}
/deep/.el-dialog__body {
  padding: 0px 20px 20px 20px;
}
</style>
