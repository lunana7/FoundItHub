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
            placeholder="Please enter your keyword"
            @change="keywordInput()"
            @clear="keywordClear()"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="userHandleRevertList" stripe border style="width: 100%">
      <el-table-column
        fixed="left"
        sortable
        prop="date"
        label="Lost Date"
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
        label="Lost Location"
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
      <el-table-column prop="handlerPhone" label="Phone Number" width="120">
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
                ? "Returned"
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
              label="Lost Location"
              prop="location"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model.trim="form.location"
                placeholder="Please enter the lost location"
                type="text"
                maxlength="10"
                show-word-limit
                :disabled="true"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="Lost Time"
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
              <!-- <el-input type="date" v-model="form.date" :disabled="true"></el-input> -->
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
              label="Details"
              prop="describe"
              :label-width="formLabelWidth"
            >
              <el-input
                type="textarea"
                resize="none"
                :rows="5"
                placeholder="Please enter detailed information about the item"
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
                >Visible after application approval</el-tag
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
                  require('../../../public/revert_pic/' + form.article_pic),
                ]"
                style="height: 120px; width: 120px"
                :src="require('../../../public/revert_pic/' + form.article_pic)"
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
              label="phonenumber"
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
                v-model.trim="form.handlerWechat"
                placeholder="Please enter your email"
                type="text"
                maxlength="20"
                show-word-limit
                clearable
                :disabled="dialogDisabled"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item
              label="Owner's Phone Number"
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
              label="Owner's Email"
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
          <el-col :span="8"> </el-col>
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
                @click="sureHandleRevert()"
                v-if="dialogDisabled && !finished && form.isFound == 2"
                >I Have Returned</el-button
              >
              <el-button
                type="info"
                @click="cancelHandleRevert()"
                v-if="dialogDisabled && !finished"
                >Cancel Return</el-button
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
      userHandleRevertList: [],
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
        url: "http://127.0.0.1:3007/my/getUserHandleRevert",
        headers: {
          Authorization: this.$store.getters.getUserToken,
        },
      })
        .then((res) => {
          if (res.data.status === 0) {
            res.data.data.forEach((item) => {
              item.date = item.date.slice(0, 10);
              item.createDate = item.createDate.slice(0, 10);
              // console.log(item.createDate, "foreach item")
            });

            this.$store.dispatch("asyncUpdateUserHandleRevert", res.data.data);

            this.userHandleRevertList = this.$store.getters.getUserHandleRevert;
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
    handleClick(row) {
      // console.log(row);
    },
    handleView(index, row) {
      this.dialogVisible = true;
      this.dialogDisabled = true;
      if (row.isFound == 2) {
        this.finished = false;
      } else if (row.isFound == 0) {
        this.finished = true;
      }
      // 数据回显
      this.form = row;
    },
    handleEdit(index, row) {
      // console.log(index, row, "#handleEdit");
      this.dialogVisible = true;
      this.dialogDisabled = false;
      // 数据回显
      this.form = row;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          http({
            method: "post",
            url: "http://127.0.0.1:3007/my/editRevert",
            headers: {
              Authorization: this.$store.getters.getUserToken,
            },
            params: {
              id: this.form.id,
              handlerPhone: this.form.handlerPhone,
              handlerWechat: this.form.handlerWechat,
              handlerQQ: this.form.handlerQQ,
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

    sureHandleRevert() {
      http({
        method: "post",
        url: "http://127.0.0.1:3007/my/editRevert",
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
              message: "Successful return",
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
    cancelHandleRevert() {
      http({
        method: "post",
        url: "http://127.0.0.1:3007/my/cancelHandleRevert",
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
              message: "Cancel restitution success!",
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
        // 1.初始化
        this.userHandleRevertList = this.$store.getters.getUserHandleRevert;
        // 2.对关键词进行筛选
        const revertList_resume = this.userHandleRevertList.filter((item) =>
          item.resume.includes(this.searchForm.keyword)
        );
        const revertList_location = this.userHandleRevertList.filter((item) =>
          item.location.includes(this.searchForm.keyword)
        );
        this.userHandleRevertList = [
          ...revertList_resume,
          ...revertList_location,
        ]; // 存在重复数据
        this.userHandleRevertList = this.userHandleRevertList.filter(function (
          item,
          index,
          arr
        ) {
          return arr.indexOf(item, 0) === index;
        }); // 数据去重
      } else {
        // 1.初始化
        this.userHandleRevertList = this.$store.getters.getUserHandleRevert;
      }
    },
    typeSelectChange() {
      if (this.searchForm.keyword) {
        // 1.初始化
        this.userHandleRevertList = this.$store.getters.getUserHandleRevert;
        // 2.对关键词进行筛选
        const revertList_resume = this.userHandleRevertList.filter((item) =>
          item.resume.includes(this.searchForm.keyword)
        );
        const revertList_location = this.userHandleRevertList.filter((item) =>
          item.location.includes(this.searchForm.keyword)
        );
        this.userHandleRevertList = [
          ...revertList_resume,
          ...revertList_location,
        ]; // 存在重复数据
        this.userHandleRevertList = this.userHandleRevertList.filter(function (
          item,
          index,
          arr
        ) {
          return arr.indexOf(item, 0) === index;
        }); // 数据去重
        // 3.对类型进行筛选
        this.userHandleRevertList = this.userHandleRevertList.filter(
          (item) => item.type == this.searchForm.type
        );
      } else {
        // 1.初始化
        this.userHandleRevertList = this.$store.getters.getUserHandleRevert;
        // 2.对类型进行筛选
        this.userHandleRevertList = this.userHandleRevertList.filter(
          (item) => item.type == this.searchForm.type
        );
      }
    },
    keywordClear() {
      if (this.searchForm.type) {
        // 1.初始化
        this.userHandleRevertList = this.$store.getters.getUserHandleRevert;
        // 2.对类型进行筛选
        this.userHandleRevertList = this.userHandleRevertList.filter(
          (item) => item.type == this.searchForm.type
        );
      } else {
        // 1.初始化
        this.userHandleRevertList = this.$store.getters.getUserHandleRevert;
      }
    },
    keywordInput() {
      if (this.searchForm.keyword) {
        if (this.searchForm.type) {
          // 1.初始化
          this.userHandleRevertList = this.$store.getters.getUserHandleRevert;
          // 2.对类型进行筛选
          this.userHandleRevertList = this.userHandleRevertList.filter(
            (item) => item.type == this.searchForm.type
          );
          // 3.对关键词进行筛选
          const revertList_resume = this.userHandleRevertList.filter((item) =>
            item.resume.includes(this.searchForm.keyword)
          );
          const revertList_location = this.userHandleRevertList.filter((item) =>
            item.location.includes(this.searchForm.keyword)
          );
          this.userHandleRevertList = [
            ...revertList_resume,
            ...revertList_location,
          ]; // 存在重复数据
          this.userHandleRevertList = this.userHandleRevertList.filter(
            function (item, index, arr) {
              return arr.indexOf(item, 0) === index;
            }
          ); // 数据去重
        } else {
          // 1.初始化
          this.userHandleRevertList = this.$store.getters.getUserHandleRevert;
          // 2.对关键词进行筛选
          const revertList_resume = this.userHandleRevertList.filter((item) =>
            item.resume.includes(this.searchForm.keyword)
          );
          const revertList_location = this.userHandleRevertList.filter((item) =>
            item.location.includes(this.searchForm.keyword)
          );
          this.userHandleRevertList = [
            ...revertList_resume,
            ...revertList_location,
          ]; // 存在重复数据
          this.userHandleRevertList = this.userHandleRevertList.filter(
            function (item, index, arr) {
              return arr.indexOf(item, 0) === index;
            }
          ); // 数据去重
        }
      } else {
        if (this.searchForm.type) {
          // 1.初始化
          this.userHandleRevertList = this.$store.getters.getUserHandleRevert;
          // 2.对类型进行筛选
          this.userHandleRevertList = this.userHandleRevertList.filter(
            (item) => item.type == this.searchForm.type
          );
        } else {
          // 1.初始化
          this.userHandleRevertList = this.$store.getters.getUserHandleRevert;
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
