<template>
  <div class="container">
    <div class="process" v-if="!isEdit">
      <el-steps :active="4" simple>
        <el-step title="Apply for Return" icon="el-icon-edit"></el-step>
        <el-step title="Awaiting Review" icon="el-icon-s-order"></el-step>
        <el-step
          title="Contact Privately"
          icon="el-icon-phone-outline"
        ></el-step>
        <el-step title="Confirm Return" icon="el-icon-success"></el-step>
      </el-steps>
    </div>

    <div class="process" v-if="isEdit">
      <el-steps :active="4" simple>
        <el-step title="Publish Information" icon="el-icon-upload2"></el-step>
        <el-step title="Awaiting Return" icon="el-icon-loading"></el-step>
        <el-step title="Awaiting Review" icon="el-icon-s-order"></el-step>
        <el-step
          title="Contact Privately"
          icon="el-icon-phone-outline"
        ></el-step>
      </el-steps>
    </div>

    <div
      class="search"
      style="justify-content: center; padding-top: 10px"
      :style="{ display: isEdit ? 'none' : 'flex' }"
    >
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
              :key="item.label"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Keyword">
          <el-input
            v-model.trim="searchForm.keyword"
            placeholder="Item Name/Pickup Location"
            @change="keywordInput()"
            @clear="keywordClear()"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleIssue()"
            >I Want to Post Lost Item Information</el-button
          >
        </el-form-item>
      </el-form>
    </div>

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
            >Publish Lost Item Information</el-divider
          >
        </div>

        <el-row :gutter="20" style="margin-top: 40px">
          <el-col :span="2"></el-col>
          <el-col :span="10">
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
              ></el-input>
            </el-form-item>
            <el-form-item
              label="Location"
              prop="location"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model.trim="form.location"
                placeholder="Please enter the lost location"
                type="text"
                maxlength="10"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              label="Lost Time"
              prop="date"
              :label-width="formLabelWidth"
            >
              <el-date-picker
                style="width: 100%"
                v-model="form.date"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="Date"
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
                placeholder="Type"
                style="width: 100%"
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
          <el-col :span="2"></el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="2"></el-col>
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
                placeholder="Please enter detailed features of the item (for administrator reference)"
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
              label="Picture"
              prop="article_pic"
              :label-width="formLabelWidth"
            >
              Please upload a picture of the item, highlighting its features as
              much as possible. Be mindful of privacy! (Maximum 1 picture)
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
                <div class="el-upload__tip" slot="tip">
                  Only jpg/png files can be uploaded and no more than 2MB
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="2"></el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item style="display: flex; justify-content: center">
              <el-button type="primary" @click="submitForm('ruleForm')"
                >Publish</el-button
              >
              <el-button @click="resetForm('ruleForm')">Reset</el-button>
              <el-button type="info" @click="isEdit = false">Cancel</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div v-if="!isEdit">
      <div>
        <el-divider content-position="center"
          >Lost Item Information List</el-divider
        >
      </div>

      <el-row
        class="el-row"
        v-infinite-scroll="load"
        infinite-scroll-disabled="disabled"
      >
        <el-card
          class="box-card"
          v-for="item in revertList.slice(0, count)"
          :key="item.id"
          shadow="hover"
        >
          <div class="resume-btn">
            <div class="resume">{{ item.resume }}</div>
            <el-button
              type="primary"
              size="mini"
              @click="handleRevert(item)"
              v-show="isLogin"
              >Return</el-button
            >
          </div>
          <hr />
          <div class="article_pic" style="text-align: center">
            <el-image
              v-if="item.article_pic"
              :preview-src-list="[
                require('../../../public/revert_pic/' + item.article_pic),
              ]"
              style="height: 120px; width: 120px"
              :src="require('../../../public/revert_pic/' + item.article_pic)"
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
      <p v-if="noMore" class="Hint_text">No more items</p>
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
          <el-descriptions-item label="Item Description">{{
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
          placeholder="Please enter the features of the item (as many and detailed as possible)"
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
      revertList: [],
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
            message: "Please enter the lost location",
            trigger: "blur",
          },
        ],
        date: [
          {
            required: true,
            message: "Please enter the lost time",
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
    getRevertList() {
      http({
        method: "get",
        url: "http://127.0.0.1:3007/api/public/getRevert",
      })
        .then((res) => {
          this.$store.dispatch("asyncUpdateRevertList", res.data.data);

          this.revertList = this.$store.getters.getRevertList;
        })
        .catch((err) => {
          console.log(err, "Fail");
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
        this.revertList = this.$store.getters.getRevertList;
        const revertList_resume = this.revertList.filter((item) =>
          item.resume.includes(this.searchForm.keyword)
        );
        const revertList_location = this.revertList.filter((item) =>
          item.location.includes(this.searchForm.keyword)
        );
        this.revertList = [...revertList_resume, ...revertList_location];
        this.revertList = this.revertList.filter(function (item, index, arr) {
          return arr.indexOf(item, 0) === index;
        });
      } else {
        this.revertList = this.$store.getters.getRevertList;
      }
    },
    typeSelectChange() {
      if (this.searchForm.keyword) {
        this.revertList = this.$store.getters.getRevertList;

        const revertList_resume = this.revertList.filter((item) =>
          item.resume.includes(this.searchForm.keyword)
        );
        const revertList_location = this.revertList.filter((item) =>
          item.location.includes(this.searchForm.keyword)
        );
        this.revertList = [...revertList_resume, ...revertList_location];
        this.revertList = this.revertList.filter(function (item, index, arr) {
          return arr.indexOf(item, 0) === index;
        });

        this.revertList = this.revertList.filter(
          (item) => item.type == this.searchForm.type
        );
      } else {
        this.revertList = this.$store.getters.getRevertList;
        this.revertList = this.revertList.filter(
          (item) => item.type == this.searchForm.type
        );
      }
    },
    keywordClear() {
      if (this.searchForm.type) {
        this.revertList = this.$store.getters.getRevertList;
        this.revertList = this.revertList.filter(
          (item) => item.type == this.searchForm.type
        );
      } else {
        this.revertList = this.$store.getters.getRevertList;
      }
    },
    keywordInput() {
      if (this.searchForm.keyword) {
        if (this.searchForm.type) {
          this.revertList = this.$store.getters.getRevertList;

          this.revertList = this.revertList.filter(
            (item) => item.type == this.searchForm.type
          );

          const revertList_resume = this.revertList.filter((item) =>
            item.resume.includes(this.searchForm.keyword)
          );
          const revertList_location = this.revertList.filter((item) =>
            item.location.includes(this.searchForm.keyword)
          );
          this.revertList = [...revertList_resume, ...revertList_location];
          this.revertList = this.revertList.filter(function (item, index, arr) {
            return arr.indexOf(item, 0) === index;
          });
        } else {
          this.revertList = this.$store.getters.getRevertList;

          const revertList_resume = this.revertList.filter((item) =>
            item.resume.includes(this.searchForm.keyword)
          );
          const revertList_location = this.revertList.filter((item) =>
            item.location.includes(this.searchForm.keyword)
          );
          this.revertList = [...revertList_resume, ...revertList_location];
          this.revertList = this.revertList.filter(function (item, index, arr) {
            return arr.indexOf(item, 0) === index;
          });
        }
      } else {
        if (this.searchForm.type) {
          this.revertList = this.$store.getters.getRevertList;

          this.revertList = this.revertList.filter(
            (item) => item.type == this.searchForm.type
          );
        } else {
          this.revertList = this.$store.getters.getRevertList;
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
          message: "Not logged in. Please log in first!",
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
              url: "http://127.0.0.1:3007/my/addRevert",
              headers: {
                Authorization: this.$store.getters.getUserToken,
              },
              params: {
                createDate: getCurrentDate(),
                initiatorId: this.$store.getters.getUserInfo.id,
                initiatorNickname: this.$store.getters.getUserInfo.nickname,
                initiatorPhone: this.$store.getters.getUserInfo.phone,
                initiatorEmail: this.$store.getters.getUserInfo.email,

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
                  this.getRevertList().then(
                    console.log("Refresh list information successfully")
                  );
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
          } else {
            http({
              method: "post",
              url: "http://127.0.0.1:3007/my/addRevert",
              headers: {
                Authorization: this.$store.getters.getUserToken,
              },
              params: {
                createDate: getCurrentDate(),
                initiatorId: this.$store.getters.getUserInfo.id,
                initiatorNickname: this.$store.getters.getUserInfo.nickname,
                initiatorPhone: this.$store.getters.getUserInfo.phone,
                initiatorEmail: this.$store.getters.getUserInfo.email,

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
                  this.getRevertList();
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
    handleRevert(item) {
      if (item.initiatorId == this.$store.getters.getUserInfo.id) {
        this.$message({
          showClose: true,
          message: "Return failed, this is your published information!",
          type: "error",
        });
        return;
      }
      if (this.$store.getters.getUserInfo.revertLOA == "0") {
        this.$message.warning("You do not have permission to return!");
        return;
      }

      this.$confirm(
        "Are you sure this is the item you found?",
        "Apply for Return",
        {
          distinguishCancelAndClose: true,
          confirmButtonText: "Confirm",
          cancelButtonText: "Cancel",
        }
      )
        .then(() => {
          this.describeDialogVisible = true;
          this.currentItem = { ...item };
        })
        .catch((action) => {});
    },
    submitDescribe() {
      http({
        method: "post",
        url: "http://127.0.0.1:3007/my/handleRevert",
        headers: {
          Authorization: this.$store.getters.getUserToken,
        },
        params: {
          id: this.currentItem.id,
          revertDate: getCurrentDate(),
          handlerDescribe: this.describeInput,
          handlerId: this.$store.getters.getUserInfo.id,
          handlerNickname: this.$store.getters.getUserInfo.nickname,
          handlerPhone: this.$store.getters.getUserInfo.phone,
          handlerEmail: this.$store.getters.getUserInfo.email,
        },
      })
        .then((res) => {
          if (res.data.status === 0) {
            this.describeDialogVisible = false;
            this.describeInput = "";
            this.$alert(
              "You can view the task details in Personal Center -> Task Management.",
              "Application Successful",
              {
                confirmButtonText: "Confirm",
              }
            );
            this.getRevertList();
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
          "The uploaded avatar image can only be in JPG/PNG format!"
        );
        this.files = [];
        return;
      }
      if (!isLt2M) {
        this.$message.error("The uploaded image size cannot exceed 2MB!");
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
    this.getRevertList();
    this.judgeLogin();
    this.type = [...this.$store.getters.getType];
  },

  computed: {
    noMore() {
      return this.count >= this.revertList.length;
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
    padding: 10px 0 0 0;
    display: flex;
    justify-content: center;
    .el-steps--simple {
      background: white;
    }
    .el-steps {
      width: 80%;
    }
  }
  .banner-container {
    width: 100%;

    .banner-left {
      img {
        width: 600px;
        height: 300px;
      }
    }
  }

  .demo-form-inline {
    .el-form-item {
      margin-bottom: 0px;
    }
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

  .el-divider {
    background-color: black;

    .el-divider__text {
      font-size: 20px;
      background-color: rgb(244, 244, 244);
    }
  }

  .el-row {
    margin-left: 0px;
    margin-right: 0px;
    display: flex;
    flex-wrap: wrap;
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
