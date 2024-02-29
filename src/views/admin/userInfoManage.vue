<template>
  <div class="container">
    <div class="ONE">
      <div class="left">
        <p>
          <span class="link" @click="toIndex">Home</span> > Information
          Management > User Information Management
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
          label="Registration Date"
          width="200"
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
          prop="username"
          label="Account"
          header-align="center"
          align="center"
        >
        </el-table-column>

        <el-table-column
          prop="nickname"
          label="Nickname"
          header-align="center"
          align="center"
        >
        </el-table-column>

        <el-table-column
          prop="user_pic"
          label="Avatar"
          width="80"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-avatar
              v-if="scope.row.user_pic"
              :size="35"
              :src="require('../../../public/user_pic/' + scope.row.user_pic)"
              style="border: solid 1px black"
            ></el-avatar>
            <el-avatar
              v-if="!scope.row.user_pic"
              :size="35"
              :src="require('../../../public/no_pic/noAvatar.png')"
              style="border: solid 1px black"
            ></el-avatar>
          </template>
        </el-table-column>

        <el-table-column
          prop="phone"
          label="Contact Number"
          width="120"
          header-align="center"
          align="center"
        >
        </el-table-column>

        <el-table-column
          prop="identity"
          label="Identity"
          width="120"
          header-align="center"
          align="center"
          >Regular User</el-table-column
        >

        <el-table-column
          label="Operation"
          width="220"
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
              :disabled="scope.row.id === userInfo.id"
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
        :total="userList.length"
      >
      </el-pagination>
    </div>

    <el-dialog
      class="view-dialog"
      title="User Info"
      :visible.sync="viewDialogVisible"
      width="40%"
      top="80px"
    >
      <div class="dialog-container">
        <div class="left">
          <el-avatar
            v-if="view.user_pic"
            :size="120"
            :src="require('../../../public/user_pic/' + view.user_pic)"
            style="margin-right: 10px; border: solid 1px black"
          ></el-avatar>
          <el-avatar
            v-if="!view.user_pic"
            :size="120"
            :src="require('../../../public/no_pic/noAvatar.png')"
            style="margin-right: 10px; border: solid 1px black"
          ></el-avatar>
        </div>

        <div class="right">
          <el-descriptions
            title=""
            border
            :column="1"
            :labelStyle="{ width: '40%', 'text-align': 'center' }"
            :contentStyle="{ width: '60%', 'text-align': 'center' }"
          >
            <el-descriptions-item label="User ID">{{
              view.id
            }}</el-descriptions-item>
            <el-descriptions-item label="Account">{{
              view.username
            }}</el-descriptions-item>
            <el-descriptions-item label="Nickname">{{
              view.nickname
            }}</el-descriptions-item>
            <el-descriptions-item label="Gender">{{
              view.gender
            }}</el-descriptions-item>
            <el-descriptions-item label="Age">{{
              view.age
            }}</el-descriptions-item>
            <el-descriptions-item label="Contact Number">{{
              view.phone
            }}</el-descriptions-item>
            <el-descriptions-item label="Email">{{
              view.email
            }}</el-descriptions-item>
            <el-descriptions-item label="Registration Time">{{
              view.createDate
            }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="viewDialogVisible = false"
          >Confirm</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      class="edit-dialog"
      title="User Info"
      :visible.sync="editDialogVisible"
      width="50%"
      top="40px"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="24" style="text-align: center">
            <div class="avatar" @click="changeAvatar">
              <el-avatar
                v-if="form.user_pic"
                :size="80"
                :src="require('../../../public/user_pic/' + form.user_pic)"
                @click="changeAvatar"
              ></el-avatar>
              <el-avatar
                v-if="!form.user_pic"
                :size="80"
                :src="require('../../../public/no_pic/noAvatar.png')"
                @click="changeAvatar"
              ></el-avatar>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="ID" prop="id" :label-width="formLabelWidth"
              >{{ form.id }}
            </el-form-item>

            <el-form-item
              label="Identity"
              prop="identity"
              :label-width="formLabelWidth"
              >Regular User</el-form-item
            >

            <el-form-item
              label="Account"
              prop="username"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model.trim="form.username"
                placeholder="Please enter account"
                type="text"
                maxlength="12"
                show-word-limit
              ></el-input>
            </el-form-item>

            <el-form-item label="age" prop="age" :label-width="formLabelWidth">
              <el-input
                type="text"
                placeholder="age"
                oninput="value=value.replace(/[^\d]/g, '')"
                v-model.number.trim="form.age"
              ></el-input>
            </el-form-item>

            <el-form-item
              label="Phone Number"
              prop="phone"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model.trim="form.phone"
                placeholder="Please enter your phone number"
                type="text"
                maxlength="11"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              label="Resigtation Time"
              prop="createDate"
              :label-width="formLabelWidth"
              >{{ form.createDate }}</el-form-item
            >

            <el-form-item
              label="Avatar"
              prop="user_pic"
              :label-width="formLabelWidth"
              >{{
                form.user_pic ? form.user_pic : "Default Avatar"
              }}</el-form-item
            >

            <el-form-item
              label="Nickname"
              prop="nickname"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model.trim="form.nickname"
                placeholder="Please enter nickname"
                type="text"
                maxlength="8"
                show-word-limit
              ></el-input>
            </el-form-item>

            <el-form-item
              label="Gender"
              prop="gender"
              :label-width="formLabelWidth"
            >
              <el-select
                v-model="form.gender"
                placeholder="Please select gender"
                style="width: 100%"
              >
                <el-option label="Male" value="Male"></el-option>
                <el-option label="Female" value="Female"></el-option>
                <el-option
                  label="Prefer not to say"
                  value="Prefer not to say"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              label="Email"
              prop="email"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model.trim="form.email"
                placeholder="Please enter your email"
                type="email"
              ></el-input>
            </el-form-item>

            <el-form-item
              label="Password"
              prop="password"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model.trim="form.password"
                placeholder="Please enter your password"
                type="text"
                maxlength="12"
                show-word-limit
                show-password
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('form')"
          >Confirm</el-button
        >
        <el-button type="info" @click="editDialogVisible = false"
          >Cancel</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      class="avatar-dialog"
      title="Change Avatar"
      :visible.sync="avatarDialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span
        >Upload Avatar
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
  </div>
</template>

<script>
import http from "../../utils/request";
export default {
  data() {
    return {
      userInfo: {},
      userList: [],
      viewDialogVisible: false,
      view: {},
      viewList: [],
      keyword: "",
      pageSize: 8,
      currentPage: 1,
      editDialogVisible: false,
      form: {},
      formLabelWidth: "80px",
      rules: {
        username: [
          {
            required: true,
            message:
              "Please enter the account number (upper and lower case letters, numbers, underscores)",
            trigger: "blur",
          },
          {
            min: 3,
            max: 12,
            message: "Between 3 and 12 characters",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "Please enter your password",
            trigger: "blur",
          },
          {
            min: 5,
            max: 12,
            message: "Between 5 and 12 characters",
            trigger: "blur",
          },
        ],
        phone: [
          {
            required: true,
            message: "Please enter your phone number",
            trigger: "blur",
          },
          {
            validator: function (rule, value, callback) {
              if (!/^\d{3}-\d{3}-\d{4}$/.test(value)) {
                callback(
                  new Error(
                    "Please enter a valid Canadian phone number in the format XXX-XXX-XXXX"
                  )
                );
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        nickname: [
          {
            required: true,
            message: "Please enter a nickname",
            trigger: "blur",
          },
          {
            min: 1,
            max: 10,
            message: "Length must be between 1 and 10 characters",
            trigger: "blur",
          },
        ],
        email: [
          {
            type: "email",
            message: "Please enter a valid email address",
            trigger: "blur",
          },
        ],
        age: [
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
      avatarDialogVisible: false,
      limit: 1,
      files: [],
      myHeaders: {
        Authorization: this.$store.getters.getUserToken,
      },
    };
  },
  methods: {
    getUserInfo() {
      this.userInfo = { ...this.$store.getters.getUserInfo };
    },
    getUserList() {
      http({
        method: "get",
        url: "http://127.0.0.1:3007/admin/getUserList",
        headers: {
          Authorization: this.$store.getters.getUserToken,
        },
      })
        .then((res) => {
          if (res.data.status === 1) {
            console.log(res.data.message, "fail");
          } else if (res.data.status === 0) {
            this.userList = [...res.data.data];
            this.viewList = [
              ...this.userList.slice(
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
      this.viewDialogVisible = true;
      this.view = row;
    },

    handleEdit(index, row) {
      if (this.$store.getters.getUserInfo.adminUserLOA === "1") {
        this.editDialogVisible = true;
        this.form = { ...row };
      } else {
        this.$message.warning(
          "You do not have user administration privileges!"
        );
      }
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          http({
            method: "post",
            url: "http://127.0.0.1:3007/admin/updateUserInfo",
            headers: {
              Authorization: this.$store.getters.getUserToken,
            },
            params: {
              username: this.form.username,
              nickname: this.form.nickname,
              age: this.form.age,
              gender: this.form.gender,
              qq: this.form.qq,
              wechat: this.form.wechat,
              phone: this.form.phone,
              password: this.form.password,
              id: this.form.id,
            },
          })
            .then((res) => {
              if (res.data.status === 0) {
                if (this.keyword) {
                  this.$store.dispatch("asyncUpdatePage", this.currentPage);
                  this.editDialogVisible = false;
                  this.form = {};
                  this.$message.success(
                    "The user information was modified successfully!"
                  );
                  this.search();
                  this.currentPage = this.$store.getters.getPage;
                  this.$store.dispatch("asyncUpdatePage", "");
                  this.viewList = [
                    ...this.userList.slice(
                      this.currentPage * this.pageSize - this.pageSize,
                      this.currentPage * this.pageSize
                    ),
                  ];
                } else {
                  this.editDialogVisible = false;
                  this.form = {};
                  this.$message.success(
                    "The user information was modified successfully!"
                  );
                  this.getUserList();
                }
              } else {
                this.editDialogVisible = false;
                this.form = {};
                this.$message.warning(res.data.message);
              }
            })
            .catch((err) => {
              console.log(err, "http request failed");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    changeAvatar() {
      this.files = [];
      this.avatarDialogVisible = true;
    },

    uploadChange(file) {
      const isJPG = file.raw.type === "image/jpeg";
      const isLt2M = file.raw.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("Upload avatar image can only be in JPG format!");
        this.files = [];
        return;
      }
      if (!isLt2M) {
        this.$message.error("Upload avatar image size cannot exceed 2MB!");
        this.files = [];
        return;
      }

      this.files.push(file);
    },

    handleClose() {
      this.avatarDialogVisible = false;
      this.files = [];
    },

    changeAvatarOk() {
      if (this.files.length === 1) {
        this.$refs.upload.submit();
        http({
          method: "post",
          url: "http://127.0.0.1:3007/admin/updateAvatar",
          headers: {
            Authorization: this.$store.getters.getUserToken,
          },
          params: {
            user_pic: this.files[0].name,
            id: this.form.id,
          },
        })
          .then((res) => {
            this.$message.success("Upload avatar successful!");
            this.avatarDialogVisible = false;
          })
          .catch((err) => {
            this.$message.error("Upload avatar failed!" + err);
          });
      } else {
        this.$message.warning("Incorrect file count, upload failed!");
      }
    },

    handleDelete(index, row) {
      if (this.$store.getters.getUserInfo.adminUserLOA === "1") {
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
            http({
              method: "post",
              url: "http://127.0.0.1:3007/admin/deleteUser",
              headers: {
                Authorization: this.$store.getters.getUserToken,
              },
              params: {
                id: row.id,
              },
            })
              .then((res) => {
                if (res.data.status === 0) {
                  if (this.keyword) {
                    this.$store.dispatch("asyncUpdatePage", this.currentPage);
                    this.$message.success("Delete successful!");
                    this.search();
                    this.currentPage = this.$store.getters.getPage;
                    this.$store.dispatch("asyncUpdatePage", "");
                    this.viewList = [
                      ...this.userList.slice(
                        this.currentPage * this.pageSize - this.pageSize,
                        this.currentPage * this.pageSize
                      ),
                    ];
                  } else {
                    this.$message.success("Delete successful!");
                    this.getUserList();
                  }
                } else {
                  this.$message.warning("Delete failed!");
                }
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch(() => {
            this.$message.info("Delete cancelled!");
          });
      } else {
        this.$message.warning("You do not have user management permissions!");
      }
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.viewList = [
        ...this.userList.slice(
          this.currentPage * this.pageSize - this.pageSize,
          this.currentPage * this.pageSize
        ),
      ];
    },

    search() {
      http({
        method: "get",
        url: "http://127.0.0.1:3007/admin/getKeywordUserList",
        headers: {
          Authorization: this.$store.getters.getUserToken,
        },
        params: {
          keyword: this.keyword,
        },
      })
        .then((res) => {
          if (res.data.status === 0) {
            this.userList = [...res.data.data];
            this.viewList = [...this.userList.slice(0, this.pageSize)];
          }
        })
        .catch((err) => {
          console.log(err, "HTTP request failed");
        });
    },
  },

  mounted() {
    this.getUserInfo();
    this.getUserList();
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
      flex-direction: row;
      .el-dialog__body {
        padding: 0 20px;
      }
      .left {
        width: 30%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .right {
        width: 70%;
      }
    }
  }

  .edit-dialog {
    .avatar:hover {
      cursor: pointer;
      opacity: 0.5;
    }
  }
}
</style>
