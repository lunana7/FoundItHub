<template>
  <div class="userInfo">
    <div class="title"><h2>Basic Information</h2></div>
    <div class="userInfoList">
      <div class="avatar-container">
        <div class="avatar" @click="changeAvatar">
          <el-avatar
            v-if="userInfo.user_pic"
            :size="80"
            :src="require('../../../public/user_pic/' + form.user_pic)"
          ></el-avatar>
          <el-avatar
            v-if="!userInfo.user_pic"
            :size="80"
            :src="require('../../../public/no_pic/noAvatar.png')"
          ></el-avatar>
        </div>
      </div>

      <el-dialog
        title="Change Profile Picture"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
      >
        <span
          >Upload Profile Picture:
          <el-upload
            action="http://127.0.0.1:3007/my/uploadAvatar"
            ref="upload"
            :headers="myHeaders"
            :auto-upload="false"
            :limit="limit"
            :file-list="files"
            list-type="picture-card"
            :on-change="uploadChange"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="changeAvatarOk">Confirm</el-button>
        </span>
      </el-dialog>

      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-descriptions
          title=""
          :column="2"
          border
          :labelStyle="{ width: '12%', 'text-align': 'right' }"
          :contentStyle="{ width: '38%' }"
        >
          <template slot="extra">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="edit()"
              >{{ isEdit ? "Cancel" : "Edit" }}</el-button
            >
          </template>
          <!-- 
          <el-descriptions-item
            label="ID"
            label-class-name="my-label"
            content-class-name="my-content"
          >
            {{ userInfo.id }}
          </el-descriptions-item> -->

          <el-descriptions-item label="Account">
            {{ userInfo.username }}
          </el-descriptions-item>

          <el-descriptions-item label="Username">
            <div>{{ userInfo.nickname }}</div>
          </el-descriptions-item>

          <el-descriptions-item label="Phone Number">
            <div v-if="!isEdit">{{ userInfo.phone }}</div>

            <el-form-item prop="phone" label-width="“0px”" v-if="isEdit">
              <el-input v-model.trim="form.phone"></el-input>
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item label="Email">
            <div v-if="!isEdit">{{ userInfo.email }}</div>

            <el-form-item prop="email" label-width="“0px”" v-if="isEdit">
              <el-input v-model.trim="form.email"></el-input>
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item label="Gender">
            <div v-if="!isEdit">{{ userInfo.gender }}</div>

            <el-form-item label="" label-width="0px" v-if="isEdit">
              <el-select
                v-model="form.gender"
                placeholder="Please select a gender"
                style="width: 100%"
              >
                <el-option label="Male" value="Male"></el-option>
                <el-option label="Female" value="Female"></el-option>
                <el-option label="Non-binary" value="Non-binary"></el-option>
                <el-option
                  label="Prefer not to say"
                  value="Prefer not to say"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item label="Age">
            <div v-if="!isEdit">{{ userInfo.age }}</div>

            <el-form-item prop="age" label-width="“0px”" v-if="isEdit">
              <el-input
                type="text"
                oninput="value=value.replace(/[^\d]/g, '')"
                v-model.number.trim="form.age"
              ></el-input>
            </el-form-item>
          </el-descriptions-item>
        </el-descriptions>
        <div class="btn-container" v-if="isEdit">
          <el-button type="primary" @click="submitForm('form')"
            >Complete</el-button
          >
          <el-button @click="resetForm('form')" style="margin-left: 60px"
            >Recover</el-button
          >
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import http from "../../utils/request";

export default {
  data() {
    return {
      isEdit: true,
      userInfo: {},
      form: {},
      rules: {
        phone: [
          {
            required: true,
            message: "Please enter your phone number",
            trigger: "blur",
          },
          {
            validator: function (rule, value, callback) {
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
            trigger: "blur",
          },
        ],
        email: [
          // { required: true, message: 'Please enter your email', trigger: 'blur' },
          {
            min: 1,
            max: 18,
            message: "Length must be between 1 and 18 characters",
            trigger: "blur",
          },
        ],

        age: [
          // { required: true, message: 'Please enter your age', trigger: 'blur' },
          { type: "number", message: "Age must be a numeric value" },
          {
            validator: function (rule, value, callback) {
              if (value) {
                if (value < 3 || value > 120) {
                  callback(new Error("Please enter a valid age"));
                } else {
                  callback();
                }
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
      },
      dialogVisible: false,
      limit: 1,
      files: [],
      myHeaders: {
        Authorization: this.$store.getters.getUserToken,
      },
    };
  },
  methods: {
    getUserInfo() {
      http({
        method: "get",
        url: "http://127.0.0.1:3007/my/getUserInfo",
        headers: {
          Authorization: this.$store.getters.getUserToken,
        },
      })
        .then((res) => {
          this.$store.dispatch("asyncUpdateUserInfo", res.data.data);

          this.userInfo = { ...this.$store.getters.getUserInfo };
        })
        .catch((err) => {
          console.log("User information modification failed to get user data!");
        });
    },
    edit() {
      if (this.isEdit === true) {
        this.form = { ...this.userInfo };
      }
      this.isEdit = !this.isEdit;
    },
    submitForm(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          http({
            method: "post",
            url: "http://127.0.0.1:3007/my/updateUserInfo",
            headers: {
              Authorization: this.$store.getters.getUserToken,
            },
            params: {
              phone: this.form.phone,
              nickname: this.form.nickname,
              email: this.form.email,

              gender: this.form.gender,
              age: this.form.age,
            },
          })
            .then((res) => {
              if (res.data.status === 1) {
                this.$message.warning(res.data.message);
              } else if (res.data.status === 0) {
                this.$message.success(res.data.message);

                this.getUserInfo();

                this.isEdit = false;
              } else {
                alert("Unknown error!");
              }
            })
            .catch((err) => {
              console.log(
                "User data update failed on personal information page!"
              );
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    resetForm() {
      this.form = { ...this.userInfo };
    },

    handleClose() {
      this.dialogVisible = false;
      this.files = [];
    },

    uploadChange(file) {
      const isJPG = file.raw.type === "image/jpeg";
      const isLt2M = file.raw.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error(
          "The uploaded avatar image can only be in JPG format!"
        );
        this.files = [];
        return;
      }
      if (!isLt2M) {
        this.$message.error(
          "The size of the uploaded avatar image cannot exceed 2MB!"
        );
        this.files = [];
        return;
      }

      console.log(file, "file");
      this.files.push(file);
      console.log(this.files, "#files");
    },

    changeAvatar() {
      this.files = [];
      this.dialogVisible = true;
    },

    changeAvatarOk() {
      if (this.files.length === 1) {
        this.$refs.upload.submit();
        http({
          method: "post",
          url: "http://127.0.0.1:3007/my/updateAvatar",
          headers: {
            Authorization: this.$store.getters.getUserToken,
          },
          params: {
            user_pic: this.files[0].name,
          },
        })
          .then((res) => {
            this.$message.success(
              "Avatar uploaded successfully!",
              res.data.message
            );
            this.getUserInfo();
            // Force page refresh
            location.reload();
            this.dialogVisible = false;
          })
          .catch((err) => {
            this.$message.error("Avatar upload failed!" + err);
          });
      } else {
        this.$message.warning("Incorrect number of files, upload failed!");
      }
    },
  },
  mounted() {
    console.log(this.$store.getters.getUserInfo, "# User Information Page");

    this.isEdit = false;

    this.userInfo = { ...this.$store.getters.getUserInfo };

    this.form = { ...this.userInfo };
  },
};
</script>

<style lang="less" scoped>
.userInfo {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .title {
    width: 80%;
    text-align: center;
  }

  .userInfoList {
    width: 80%;

    .avatar-container {
      display: flex;
      justify-content: center;

      .avatar {
        display: flex;
        flex-direction: column;
      }

      .avatar:hover {
        cursor: pointer;
        opacity: 0.5;
      }
    }

    .btn-container {
      display: flex;
      justify-content: center;
      margin-top: 10px;
    }
  }
}
</style>
