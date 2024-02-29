<template>
  <div class="container">
    <div class="process" v-if="!isEdit">
      <el-steps :active="4" simple>
        <el-step title="Apply for Claim" icon="el-icon-edit"></el-step>
        <el-step title="Wait for Review" icon="el-icon-s-order"></el-step>
        <el-step
          title="Contact Privately"
          icon="el-icon-phone-outline"
        ></el-step>
        <el-step title="Confirm Claim" icon="el-icon-success"></el-step>
      </el-steps>
    </div>

    <div class="process" v-if="isEdit">
      <el-steps :active="4" simple>
        <el-step title="Publish Information" icon="el-icon-upload2"></el-step>
        <el-step title="Wait for Claim" icon="el-icon-loading"></el-step>
        <el-step title="Wait for Review" icon="el-icon-s-order"></el-step>
        <el-step
          title="Contact Privately"
          icon="el-icon-phone-outline"
        ></el-step>
      </el-steps>
    </div>

    <div class="search" :style="{ display: isEdit ? 'none' : 'flex' }">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="Item Type">
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
              :key="item.id"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Keyword">
          <el-input
            v-model.trim="searchForm.keyword"
            placeholder="Item Name/Lost Location"
            @change="keywordInput()"
            @clear="keywordClear()"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleIssue()"
            >Publish Lost and Found Information</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <!-- Lost and Found Information Publishing Div -->
    <div class="edit-form">
      <el-form
        :model="form"
        :rules="rules"
        ref="ruleForm"
        v-if="isEdit"
        style="width: 100%"
      >
        <div>
          <el-divider content-position="center" style="font-size: 20px"
            >Publish Lost and Found Information</el-divider
          >
        </div>

        <el-row :gutter="20" style="margin-top: 40px">
          <el-col :span="2"> </el-col>
          <el-col :span="10">
            <el-form-item
              label="Summary"
              prop="resume"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model.trim="form.resume"
                placeholder="Please enter item summary"
                type="text"
                maxlength="8"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item
              label="Location"
              prop="location"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model.trim="form.location"
                placeholder="Please enter pickup location"
                type="text"
                maxlength="10"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
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
              >
                <el-option
                  v-for="item in type"
                  :key="item.id"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2"></el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="2"> </el-col>
          <el-col :span="20">
            <el-form-item
              label="Details"
              prop="describe"
              :label-width="formLabelWidth"
            >
              <el-input
                type="textarea"
                resize="none"
                :rows="3"
                placeholder="Please enter detailed features of the item (for admin reference)"
                v-model.trim="form.describe"
                maxlength="50"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2"></el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="2"></el-col>
          <el-col :span="20">
            <el-form-item
              label="Image"
              prop="article_pic"
              :label-width="formLabelWidth"
            >
              Please upload item image, mind your privacy! (At most 1 image)
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
                <div class="el-upload__tip" slot="tip">
                  Only jpg/png files can be uploaded, and no more than 2MB
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="2"></el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="6"></el-col>
          <el-col :span="12">
            <el-form-item style="display: flex; justify-content: center">
              <el-button type="primary" @click="submitForm('ruleForm')"
                >Publish Now</el-button
              >
              <el-button @click="resetForm('ruleForm')">Reset</el-button>
              <el-button type="info" @click="isEdit = false">Cancel</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="6"></el-col>
        </el-row>
      </el-form>
    </div>

    <!-- Lost and Found Information Display Div -->
    <div class="list" v-if="!isEdit">
      <!-- title Title -->
      <div>
        <el-divider content-position="center"
          >Lost and Found Information List</el-divider
        >
      </div>

      <!-- card Card -->
      <el-row
        class="el-row"
        v-infinite-scroll="load"
        infinite-scroll-disabled="disabled"
      >
        <el-card
          class="box-card"
          v-for="item in claimList.slice(0, count)"
          :key="item.id"
          shadow="hover"
        >
          <div class="resume-btn">
            <div class="resume">{{ item.resume }}</div>
            <el-button
              type="primary"
              size="mini"
              @click="handleClaim(item)"
              v-show="isLogin"
              >Claim</el-button
            >
          </div>
          <hr />
          <div class="article_pic" style="text-align: center">
            <el-image
              v-if="item.article_pic"
              :preview-src-list="[
                require('../../../public/claim_pic/' + item.article_pic),
              ]"
              style="height: 120px; width: 120px"
              :src="require('../../../public/claim_pic/' + item.article_pic)"
            ></el-image>
            <el-image
              v-if="!item.article_pic"
              style="height: 120px; width: 120px"
              :src="require('../../../public/no_pic/noArticle.png')"
            ></el-image>
          </div>
          <div class="location-date">
            <div class="location" style="">
              <i class="el-icon-location"></i>{{ item.location }}
            </div>
            <div class="date" style="">{{ item.date }}</div>
          </div>
        </el-card>
      </el-row>

      <p v-if="loading" class="Hint_text">Loading...</p>
      <p v-if="noMore" class="Hint_text">No more</p>
    </div>

    <el-dialog
      class="describe-dialog"
      title="Apply for Verification"
      :visible.sync="describeDialogVisible"
      width="30%"
      top="50px"
    >
      <div class="dialog-container">
        <el-descriptions class="margin-top" title="" :column="1">
          <el-descriptions-item label="Item Summary">{{
            currentItem.resume
          }}</el-descriptions-item>
          <el-descriptions-item label="Pickup Location">{{
            currentItem.location
          }}</el-descriptions-item>
          <el-descriptions-item label="Pickup Time">{{
            currentItem.date
          }}</el-descriptions-item>
        </el-descriptions>
        <el-input
          type="textarea"
          resize="none"
          :rows="5"
          placeholder="Please enter item features (as many and detailed as possible)"
          v-model="describeInput"
        ></el-input>
        <el-button type="primary" @click="submitDescribe">Submit</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import http from "../../utils/request";
import { getCurrentDate } from "../../utils/methods";
export default {
  data() {
    return {
      isLogin: "",
      isEdit: false,
      claimList: [],
      count: 12,
      loading: false,
      formLabelWidth: "120px",
      form: {
        resume: "",
        describe: "",
        type: "",
        location: "",
        article_pic: "",
        date: "",
      },
      rules: {
        resume: [
          {
            required: true,
            message: "Please provide a brief description of the item",
            trigger: "blur",
          },
        ],
        describe: [
          {
            required: true,
            message: "Please provide detailed information about the item",
            trigger: "blur",
          },
        ],
        type: [
          {
            required: true,
            message: "Please specify the type of the item",
            trigger: "blur",
          },
        ],
        location: [
          {
            required: true,
            message: "Please specify where the item was found",
            trigger: "blur",
          },
        ],
        date: [
          {
            required: true,
            message: "Please specify when the item was found",
            trigger: "blur",
          },
        ],
      },
      type: [],
      searchForm: {
        keyword: "",
        type: "",
      },
      limit: 1,
      files: [],
      myHeaders: { Authorization: this.$store.getters.getUserToken },
      describeDialogVisible: false,
      describeInput: "",
      currentItem: {},
    };
  },
  methods: {
    getClaimList() {
      http({
        method: "get",
        url: "http://127.0.0.1:3007/api/public/getClaim",
      })
        .then((res) => {
          this.$store.dispatch("asyncUpdateClaimList", res.data.data);

          this.claimList = this.$store.getters.getClaimList;
        })
        .catch((err) => {
          console.log(err, "#failed to get claim list");
        });
    },

    judgeLogin() {
      if (
        this.$store.getters.getUserInfo.id &&
        this.$store.getters.getUserToken
      ) {
        this.isLogin = true;
      } else {
        this.isLogin = false;
      }
    },
    typeSelectClear() {
      if (this.searchForm.keyword) {
        this.claimList = this.$store.getters.getClaimList;
        const claimList_resume = this.claimList.filter((item) =>
          item.resume.includes(this.searchForm.keyword)
        );
        const claimList_location = this.claimList.filter((item) =>
          item.location.includes(this.searchForm.keyword)
        );
        this.claimList = [...claimList_resume, ...claimList_location];
        this.claimList = this.claimList.filter(function (item, index, arr) {
          return arr.indexOf(item, 0) === index;
        }); //data deduplication
      } else {
        this.claimList = this.$store.getters.getClaimList;
      }
    },
    typeSelectChange() {
      if (this.searchForm.keyword) {
        // 1. Initialization
        this.claimList = this.$store.getters.getClaimList;
        // 2. Filter by keyword
        const claimList_resume = this.claimList.filter((item) =>
          item.resume.includes(this.searchForm.keyword)
        );
        const claimList_location = this.claimList.filter((item) =>
          item.location.includes(this.searchForm.keyword)
        );
        this.claimList = [...claimList_resume, ...claimList_location];
        this.claimList = this.claimList.filter(function (item, index, arr) {
          return arr.indexOf(item, 0) === index;
        });

        this.claimList = this.claimList.filter(
          (item) => item.type == this.searchForm.type
        );
      } else {
        this.claimList = this.$store.getters.getClaimList;
        this.claimList = this.claimList.filter(
          (item) => item.type == this.searchForm.type
        );
      }
    },
    keywordClear() {
      if (this.searchForm.type) {
        this.claimList = this.$store.getters.getClaimList;
        this.claimList = this.claimList.filter(
          (item) => item.type == this.searchForm.type
        );
      } else {
        this.claimList = this.$store.getters.getClaimList;
      }
    },
    keywordInput() {
      if (this.searchForm.keyword) {
        if (this.searchForm.type) {
          this.claimList = this.$store.getters.getClaimList;
          this.claimList = this.claimList.filter(
            (item) => item.type == this.searchForm.type
          );

          const claimList_resume = this.claimList.filter((item) =>
            item.resume.includes(this.searchForm.keyword)
          );
          const claimList_location = this.claimList.filter((item) =>
            item.location.includes(this.searchForm.keyword)
          );
          this.claimList = [...claimList_resume, ...claimList_location];
          this.claimList = this.claimList.filter(function (item, index, arr) {
            return arr.indexOf(item, 0) === index;
          });
        } else {
          this.claimList = this.$store.getters.getClaimList;
          const claimList_resume = this.claimList.filter((item) =>
            item.resume.includes(this.searchForm.keyword)
          );
          const claimList_location = this.claimList.filter((item) =>
            item.location.includes(this.searchForm.keyword)
          );
          this.claimList = [...claimList_resume, ...claimList_location];
          this.claimList = this.claimList.filter(function (item, index, arr) {
            return arr.indexOf(item, 0) === index;
          });
        }
      } else {
        if (this.searchForm.type) {
          this.claimList = this.$store.getters.getClaimList;
          this.claimList = this.claimList.filter(
            (item) => item.type == this.searchForm.type
          );
        } else {
          this.claimList = this.$store.getters.getClaimList;
        }
      }
    },
    handleIssue() {
      if (this.isLogin) {
        if (this.$store.getters.getUserInfo.publishLOA == "1") {
          this.isEdit = true;
          this.files = [];
        } else {
          this.$message.warning("You do not have permission to publish!");
        }
      } else {
        this.$message({
          showClose: true,
          message:
            "You haven't signed in yet. Please sign in before proceeding!",
          type: "warning",
        });
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.files.length == 1) {
            this.$refs.upload.submit();
            http({
              method: "post",
              url: "http://127.0.0.1:3007/my/addClaim",
              headers: {
                Authorization: this.$store.getters.getUserToken,
              },
              params: {
                createDate: getCurrentDate(),
                initiatorId: this.$store.getters.getUserInfo.id,
                initiatorNickname: this.$store.getters.getUserInfo.nickname,
                initiatorPhone: this.$store.getters.getUserInfo.phone,
                initiatorWechat: this.$store.getters.getUserInfo.wechat,
                initiatorQQ: this.$store.getters.getUserInfo.qq,
                isFound: 1,
                type: this.form.type,
                date: this.form.date,
                location: this.form.location,
                resume: this.form.resume,
                describe: this.form.describe,
                article_pic: this.files[0].name,
              },
            })
              .then((res) => {
                if (res.data.status == 0) {
                  this.resetForm("ruleForm");
                  this.isEdit = false;
                  this.$message({
                    showClose: true,
                    message: res.data.message,
                    type: "success",
                  });
                  this.getClaimList();
                } else if (res.data.status == 1) {
                  this.$message({
                    showClose: true,
                    message: res.data.message,
                    type: "error",
                  });
                }
              })
              .catch((err) => {
                console.log(
                  err,
                  "# Upload avatar, change the error in article_pic"
                );
              });
          } else {
            http({
              method: "post",
              url: "http://127.0.0.1:3007/my/addClaim",
              headers: {
                Authorization: this.$store.getters.getUserToken,
              },
              params: {
                createDate: getCurrentDate(),
                initiatorId: this.$store.getters.getUserInfo.id,
                initiatorNickname: this.$store.getters.getUserInfo.nickname,
                initiatorPhone: this.$store.getters.getUserInfo.phone,
                initiatorWechat: this.$store.getters.getUserInfo.wechat,
                initiatorQQ: this.$store.getters.getUserInfo.qq,
                isFound: 1,
                type: this.form.type,
                date: this.form.date,
                location: this.form.location,
                resume: this.form.resume,
                describe: this.form.describe,
              },
            })
              .then((res) => {
                if (res.data.status == 0) {
                  this.resetForm("ruleForm");
                  this.isEdit = false;
                  this.$message({
                    showClose: true,
                    message: res.data.message,
                    type: "success",
                  });
                  this.getClaimList();
                } else if (res.data.status == 1) {
                  this.$message({
                    showClose: true,
                    message: res.data.message,
                    type: "error",
                  });
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleClaim(item) {
      if (item.initiatorId == this.$store.getters.getUserInfo.id) {
        this.$message({
          showClose: true,
          message: "Claim failed, this is your published information!",
          type: "error",
        });
        return;
      }

      if (this.$store.getters.getUserInfo.claimLOA == "0") {
        this.$message.warning("You do not have permission to claim!");
        return;
      }

      this.$confirm(
        "Are you sure this item is the one you lost?",
        "Apply for claim",
        {
          distinguishCancelAndClose: true,
          confirmButtonText: "Confirm",
          cancelButtonText: "Cancel",
        }
      ).then(() => {
        this.describeDialogVisible = true;
        this.currentItem = { ...item };
      });
    },
    submitDescribe() {
      http({
        method: "post",
        url: "http://127.0.0.1:3007/my/handleClaim",
        headers: {
          Authorization: this.$store.getters.getUserToken,
        },
        params: {
          id: this.currentItem.id,
          claimDate: getCurrentDate(),
          handlerDescribe: this.describeInput,
          handlerId: this.$store.getters.getUserInfo.id,
          handlerNickname: this.$store.getters.getUserInfo.nickname,
          handlerPhone: this.$store.getters.getUserInfo.phone,
          handlerWechat: this.$store.getters.getUserInfo.wechat,
          handlerQQ: this.$store.getters.getUserInfo.qq,
        },
      })
        .then((res) => {
          if (res.data.status === 0) {
            this.describeDialogVisible = false;
            this.describeInput = "";
            this.$alert(
              "You can view the task details in Personal Center -> Task Management.",
              "Application successful",
              {
                confirmButtonText: "Confirm",
              }
            );
            this.getClaimList();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    uploadChange(file) {
      const isJPGorPNG =
        file.raw.type === "image/jpeg" || file.raw.type === "image/png";
      const isLt2M = file.raw.size / 1024 / 1024 < 2;
      if (!isJPGorPNG) {
        this.$message.error(
          "Only JPG/PNG formats are accepted for uploading profile pictures."
        );
        this.files = [];
        return;
      }
      if (!isLt2M) {
        this.$message.error(
          "The maximum allowable size for uploaded images is 2MB."
        );
        this.files = [];
        return;
      }

      this.files.push(file);
    },
    uploadRemove() {
      this.files.pop();
    },
    load() {
      this.loading = true;
      setTimeout(() => {
        this.count += 8;
        this.loading = false;
      }, 2000);
    },
  },

  mounted() {
    this.getClaimList();
    this.judgeLogin();
    this.type = [...this.$store.getters.getType];
  },

  computed: {
    noMore() {
      return this.count >= this.claimList.length;
    },
    disabled() {
      return this.loading || this.noMore;
    },
  },

  watch: {},
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  .process {
    width: 100%;
    display: flex;
    padding: 10px 0 0 0;
    justify-content: center;
    .el-steps--simple {
      background: white;
    }
    .el-steps {
      width: 80%;
    }
  }

  .search {
    justify-content: center;
    padding: 10px 0 0 0;
  }

  .edit-form {
    display: flex;
    .el-row {
      display: flex;
    }
    .el-form-item {
      margin-bottom: 18px;
    }
  }

  .demo-form-inline {
    .el-form-item {
      margin-bottom: 0px;
    }
  }

  .el-divider {
    background-color: black;

    .el-divider__text {
      font-size: 20px;
      background-color: rgb(244, 244, 244);
    }
  }

  .list {
    width: 100%;
    .el-row {
      // width: 100%;
      margin-left: 0px;
      margin-right: 0px;
      display: flex;
      flex-wrap: wrap;
      overflow-y: auto;
      /deep/ .el-card__header {
        height: 25%;
        padding: 10px 20px;
      }

      /deep/ .el-card__body {
        padding: 10px;
      }

      .box-card {
        width: 23.9%;
        margin: 5px;
      }

      .article_pic {
        .el-image {
          /deep/.el-image__inner {
            object-fit: contain;
          }
        }
      }
      .resume-btn {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        .resume {
          font-size: 15px;
          font-weight: bold;

          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
          -webkit-line-clamp: 1;
          text-overflow: ellipsis;
        }
      }

      .describe {
        font-size: 13px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        -webkit-line-clamp: 3;
        text-overflow: ellipsis;
      }

      .location-date {
        margin-top: 5px;
        font-size: 12px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
    }
  }
  .Hint_text {
    text-align: center;
    font-size: 20px;
    padding: 30px 0;
    color: #9c9c9c;
  }

  .describe-dialog {
    .dialog-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .el-button {
        margin-top: 10px;
      }
    }
  }
}
</style>
