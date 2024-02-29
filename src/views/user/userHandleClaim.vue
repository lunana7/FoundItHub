<template>
  <div>
    <div style="text-align: center"><h2>My Found</h2></div>

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
            no-match-text
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
            placeholder="Please enter keyword"
            @change="keywordInput()"
            @clear="keywordClear()"
            clearable
          ></el-input>
        </el-form-item>

        \
      </el-form>
    </div>

    <el-table :data="userHandleClaimList" stripe border style="width: 100%">
      <el-table-column
        fixed="left"
        sortable
        prop="date"
        label="Pick Up Date"
        width="110"
      ></el-table-column>
      <el-table-column
        sortable
        prop="createDate"
        label="Publish Date"
        width="110"
      >
      </el-table-column>

      <el-table-column
        sortable
        prop="location"
        label="Location"
        min-width="170"
      >
      </el-table-column>
      <el-table-column prop="resume" label="Brief (Details)" min-width="140">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p v-if="scope.row.isFound === 2">
              Details: {{ scope.row.describe }}
            </p>
            <p v-if="scope.row.isFound === 3">
              Details: (Can be viewed after application is approved)
            </p>
            <div slot="reference" class="name-wrapper">
              {{ scope.row.resume }}
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="handlerPhone" label="Reserved Number" width="120">
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
              scope.row.isFound == 0
                ? 'success'
                : scope.row.isFound == 2
                ? 'warning'
                : 'primary'
            "
            disable-transitions
          >
            {{
              scope.row.isFound == 0
                ? "Claimed"
                : scope.row.isFound == 2
                ? "Processing"
                : "Applying"
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
            v-if="scope.row.isFound != 0"
            @click="handleEdit(scope.$index, scope.row)"
            >Edit</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="Hint"
      :visible.sync="dialogVisible"
      width="60%"
      top="10px"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row :gutter="20" style="margin-top: 40px">
          <el-col :span="12">
            <el-form-item
              label="Brief Description"
              prop="resume"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model.trim="form.resume"
                placeholder="Please enter a brief description of the item"
                type="text"
                maxlength="8"
                show-word-limit
                :disabled="true"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="Pickup Location"
              prop="location"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model.trim="form.location"
                placeholder="Please enter the pickup location"
                type="text"
                maxlength="10"
                show-word-limit
                :disabled="true"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="Pickup Time"
              prop="date"
              :label-width="formLabelWidth"
            >
              <el-date-picker
                :disabled="true"
                style="width: 100%"
                v-model="form.date"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="Select Date"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              label="Type"
              prop="type"
              :label-width="formLabelWidth"
            >
              <el-select
                v-model="form.type"
                placeholder="Please select item type"
                style="width: 100%"
                :disabled="true"
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
              label="description"
              prop="describe"
              :label-width="formLabelWidth"
            >
              <el-input
                type="textarea"
                resize="none"
                :rows="5"
                placeholder="Please enter item details"
                v-model.trim="form.describe"
                maxlength="30"
                show-word-limit
                :disabled="true"
                v-if="form.isFound == 2"
              ></el-input>
              <el-tag
                type="success"
                style="font-size: 16px; width: 100%"
                v-if="form.isFound == 3"
                >Viewable after the application is approved</el-tag
              >
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
              label="phone number"
              prop="handlerPhone"
              :label-width="80"
            >
              <el-input
                v-model.trim="form.handlerPhone"
                placeholder="Please enter your phone number"
                type="text"
                maxlength="11"
                show-word-limit
                clearable
                :disabled="dialogDisabled"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="Email" prop="handlerEmail" :label-width="80">
              <el-input
                v-model.trim="form.handlerEmail"
                placeholder="Please enter your email"
                type="email"
                maxlength="20"
                show-word-limit
                clearable
                :disabled="dialogDisabled"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8"> </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item
              label="Finder's Phone Number"
              prop="initiatorPhone"
              :label-width="80"
            >
              <el-tag
                type="success"
                style="font-size: 16px; width: 100%"
                v-if="form.isFound == 2 || form.isFound == 0"
                >{{ form.initiatorPhone }}</el-tag
              >
              <el-tag
                type="success"
                style="font-size: 16px; width: 100%"
                v-if="form.isFound == 3"
                >Visible after application approval</el-tag
              >
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item
              label="Finder's Email"
              prop="initiatorEmail"
              :label-width="80"
            >
              <el-tag
                type="success"
                style="font-size: 16px; width: 100%"
                v-if="form.isFound == 2 || form.isFound == 0"
                >{{ form.initiatorWechat }}</el-tag
              >
              <el-tag
                type="success"
                style="font-size: 16px; width: 100%"
                v-if="form.isFound == 3"
                >Visible after application approval</el-tag
              >
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="22">
            <el-form-item style="display: flex; justify-content: center">
              <el-button
                type="primary"
                @click="submitForm('form')"
                v-if="!dialogDisabled && !finished"
                >Edit</el-button
              >
              <el-button
                type="info"
                @click="dialogVisible = false"
                v-if="!dialogDisabled && !finished"
                >Cancel</el-button
              >

              <el-button
                type="primary"
                @click="sureHandleClaim()"
                v-if="dialogDisabled && !finished && form.isFound == 2"
                >I Have Claimed</el-button
              >

              <el-button
                type="info"
                @click="cancelHandleClaim()"
                v-if="dialogDisabled && !finished"
                >Cancel Claim</el-button
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
import { getCurrentDate } from "../../utils/methods";
export default {
  data() {
    return {
      userHandleClaimList: [],
      searchForm: {
        keyword: "",
        type: "",
      },
      type: [],
      dialogVisible: false,
      dialogDisabled: false,
      finished: "",
      formLabelWidth: "80px",
      form: {},
      rules: {
        handlerPhone: [
          // Validation for required field
          {
            required: true,
            message: "Please enter your contact number",
            trigger: "blur",
          },
          {
            // Custom validator function
            validator: function (rule, value, callback) {
              // Regular expression to match xxx-xxx-xxxx format
              if (/^(\d{3}-\d{3}-\d{4})$/.test(value)) {
                // If format matches, callback without errors
                callback();
              } else {
                // If format doesn't match, callback with error message
                callback(
                  new Error(
                    "Please enter a valid phone number in the format xxx-xxx-xxxx"
                  )
                );
              }
            },
            // Trigger the validation on blur event
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    getUserHandleClaimList() {
      http({
        method: "get",
        url: "http://127.0.0.1:3007/my/getUserHandleClaim",
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

            this.$store.dispatch("asyncUpdateUserHandleClaim", res.data.data);

            this.userHandleClaimList = this.$store.getters.getUserHandleClaim;
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
      if (row.isFound == 2) {
        this.finished = false;
      } else if (row.isFound == 0) {
        this.finished = true;
      }

      this.form = row;
    },
    handleEdit(index, row) {
      this.dialogVisible = true;
      this.dialogDisabled = false;

      this.form = row;
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
              handlerPhone: this.form.handlerPhone,
              handlerEmail: this.form.handlerEmail,
            },
          })
            .then((res) => {
              if (res.data.status === 0) {
                this.dialogVisible = false;
                this.$message({
                  showClose: true,
                  message: "修改成功！",
                  type: "success",
                });
                this.getUserHandleClaimList();
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

    sureHandleClaim() {
      http({
        method: "post",
        url: "http://127.0.0.1:3007/my/editClaim",
        headers: {
          Authorization: this.$store.getters.getUserToken,
        },
        params: {
          id: this.form.id,
          isFound: 0,
          finishDate: getCurrentDate(),
        },
      })
        .then((res) => {
          if (res.data.status === 0) {
            this.dialogVisible = false;
            this.$message({
              showClose: true,
              message: "认领成功！",
              type: "success",
            });
            this.getUserHandleClaimList();
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
    },
    cancelHandleClaim() {
      http({
        method: "post",
        url: "http://127.0.0.1:3007/my/cancelHandleClaim",
        headers: {
          Authorization: this.$store.getters.getUserToken,
        },
        params: {
          id: this.form.id,
        },
      })
        .then((res) => {
          if (res.data.status === 0) {
            this.dialogVisible = false;
            this.$message({
              showClose: true,
              message: "取消认领成功！",
              type: "success",
            });
            this.getUserHandleClaimList();
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
    },
    typeSelectClear() {
      if (this.searchForm.keyword) {
        this.userHandleClaimList = this.$store.getters.getUserHandleClaim;
        const claimList_resume = this.userHandleClaimList.filter((item) =>
          item.resume.includes(this.searchForm.keyword)
        );
        const claimList_location = this.userHandleClaimList.filter((item) =>
          item.location.includes(this.searchForm.keyword)
        );
        this.userHandleClaimList = [...claimList_resume, ...claimList_location];
        this.userHandleClaimList = this.userHandleClaimList.filter(function (
          item,
          index,
          arr
        ) {
          return arr.indexOf(item, 0) === index;
        });
      } else {
        this.userHandleClaimList = this.$store.getters.getUserHandleClaim;
      }
    },
    typeSelectChange() {
      if (this.searchForm.keyword) {
        this.userHandleClaimList = this.$store.getters.getUserHandleClaim;

        const claimList_resume = this.userHandleClaimList.filter((item) =>
          item.resume.includes(this.searchForm.keyword)
        );
        const claimList_location = this.userHandleClaimList.filter((item) =>
          item.location.includes(this.searchForm.keyword)
        );
        this.userHandleClaimList = [...claimList_resume, ...claimList_location];
        this.userHandleClaimList = this.userHandleClaimList.filter(function (
          item,
          index,
          arr
        ) {
          return arr.indexOf(item, 0) === index;
        });
        this.userHandleClaimList = this.userHandleClaimList.filter(
          (item) => item.type == this.searchForm.type
        );
      } else {
        this.userHandleClaimList = this.$store.getters.getUserHandleClaim;

        this.userHandleClaimList = this.userHandleClaimList.filter(
          (item) => item.type == this.searchForm.type
        );
      }
    },
    keywordClear() {
      if (this.searchForm.type) {
        this.userHandleClaimList = this.$store.getters.getUserHandleClaim;

        this.userHandleClaimList = this.userHandleClaimList.filter(
          (item) => item.type == this.searchForm.type
        );
      } else {
        this.userHandleClaimList = this.$store.getters.getUserHandleClaim;
      }
    },
    keywordInput() {
      if (this.searchForm.keyword) {
        if (this.searchForm.type) {
          this.userHandleClaimList = this.$store.getters.getUserHandleClaim;

          this.userHandleClaimList = this.userHandleClaimList.filter(
            (item) => item.type == this.searchForm.type
          );

          const claimList_resume = this.userHandleClaimList.filter((item) =>
            item.resume.includes(this.searchForm.keyword)
          );
          const claimList_location = this.userHandleClaimList.filter((item) =>
            item.location.includes(this.searchForm.keyword)
          );
          this.userHandleClaimList = [
            ...claimList_resume,
            ...claimList_location,
          ];
          this.userHandleClaimList = this.userHandleClaimList.filter(function (
            item,
            index,
            arr
          ) {
            return arr.indexOf(item, 0) === index;
          });
        } else {
          this.userHandleClaimList = this.$store.getters.getUserHandleClaim;

          const claimList_resume = this.userHandleClaimList.filter((item) =>
            item.resume.includes(this.searchForm.keyword)
          );
          const claimList_location = this.userHandleClaimList.filter((item) =>
            item.location.includes(this.searchForm.keyword)
          );
          this.userHandleClaimList = [
            ...claimList_resume,
            ...claimList_location,
          ];
          this.userHandleClaimList = this.userHandleClaimList.filter(function (
            item,
            index,
            arr
          ) {
            return arr.indexOf(item, 0) === index;
          });
        }
      } else {
        if (this.searchForm.type) {
          this.userHandleClaimList = this.$store.getters.getUserHandleClaim;

          this.userHandleClaimList = this.userHandleClaimList.filter(
            (item) => item.type == this.searchForm.type
          );
        } else {
          this.userHandleClaimList = this.$store.getters.getUserHandleClaim;
        }
      }
    },
  },
  mounted() {
    this.getUserHandleClaimList();
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
