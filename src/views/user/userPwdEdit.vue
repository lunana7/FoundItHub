<template>
  <div class="userPwdEdit">
    <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
      <el-tab-pane label="Change Password" name="first">
        <div class="form">
          <el-form
            :model="form"
            :rules="rules"
            ref="form"
            label-width="140px"
            class="demo-ruleForm"
          >
            <el-form-item label="Old Password" prop="oldPwd">
              <el-input v-model.trim="form.oldPwd" show-password></el-input>
            </el-form-item>
            <el-form-item label="New Password" prop="newPwd">
              <el-input
                v-model.trim="form.newPwd"
                type="password"
                show-password
              ></el-input>
            </el-form-item>
            <el-form-item label="Enter again" prop="reNewPwd">
              <el-input
                v-model.trim="form.reNewPwd"
                type="password"
                show-password
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('form')"
                >Edit</el-button
              >
              <el-button @click="resetForm('form')">Reset</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>

      <el-tab-pane label="security question" name="second">
        <el-form
          :model="protectForm"
          :rules="protectRules"
          ref="protectForm"
          label-width="80px"
          class="demo-ruleForm"
        >
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="Question 1" prop="question_1">
                <el-select
                  v-model="protectForm.question_1"
                  placeholder="Please select"
                >
                  <el-option
                    v-for="item in options.slice(0, 6)"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="answer" prop="answer_1">
                <el-input
                  v-model.trim="protectForm.answer_1"
                  type="text"
                  show-password
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="Question 2" prop="question_2">
                <el-select
                  v-model="protectForm.question_2"
                  placeholder="answer"
                >
                  <el-option
                    v-for="item in options.slice(6, 11)"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="answer" prop="answer_2">
                <el-input
                  v-model.trim="protectForm.answer_2"
                  type="text"
                  show-password
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="Question 3" prop="question_3">
                <el-select
                  v-model="protectForm.question_3"
                  placeholder="Please select"
                >
                  <el-option
                    v-for="item in options.slice(11, 15)"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="answer" prop="answer_3">
                <el-input
                  v-model.trim="protectForm.answer_3"
                  type="text"
                  show-password
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="20" style="display: flex; justify-content: right">
              <el-form-item>
                <el-button
                  type="primary"
                  @click="submitProtectForm('protectForm')"
                  >Save</el-button
                >
                <el-button type="danger" @click="deleteProtect()"
                  >Clear</el-button
                >
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import http from "@/utils/request";
import { getCurrentDate } from "@/utils/methods";
export default {
  data() {
    return {
      activeName: "first",
      form: {
        oldPwd: "",
        newPwd: "",
        reNewPwd: "",
      },
      rules: {
        oldPwd: [
          {
            required: true,
            message: "Please enter the old password",
            trigger: "blur",
          },
          {
            min: 6,
            max: 18,
            message: "Length should be between 6 to 18 characters",
            trigger: "blur",
          },
        ],
        newPwd: [
          {
            required: true,
            message: "Please enter the new password",
            trigger: "blur",
          },
          {
            min: 6,
            max: 18,
            message: "Length should be between 6 to 18 characters",
            trigger: "blur",
          },
        ],
        reNewPwd: [
          {
            required: true,
            message: "Please re-enter the new password",
            trigger: "blur",
          },
          {
            min: 6,
            max: 18,
            message: "Length should be between 6 to 18 characters",
            trigger: "blur",
          },
        ],
      },
      protectForm: {
        question_1: "",
        answer_1: "",
        question_2: "",
        answer_2: "",
        question_3: "",
        answer_3: "",
      },
      protectRules: {
        question_1: [
          {
            required: true,
            message: "Please select the first security question",
            trigger: "blur",
          },
        ],
        answer_1: [
          {
            required: true,
            message: "Please answer the first security question",
            trigger: "blur",
          },
        ],
        question_2: [
          {
            required: true,
            message: "Please select the second security question",
            trigger: "blur",
          },
        ],
        answer_2: [
          {
            required: true,
            message: "Please answer the second security question",
            trigger: "blur",
          },
        ],
        question_3: [
          {
            required: true,
            message: "Please select the third security question",
            trigger: "blur",
          },
        ],
        answer_3: [
          {
            required: true,
            message: "Please answer the third security question",
            trigger: "blur",
          },
        ],
      },
      options: [
        {
          value: "What is the name of your primary school?",
          label: "What is the name of your primary school?",
        },
        {
          value: "What is the name of your high school?",
          label: "What is the name of your high school?",
        },
        {
          value: "What is the name of your high school headteacher?",
          label: "What is the name of your high school headteacher?",
        },
        {
          value: "What is your father's name?",
          label: "What is your father's name?",
        },
        {
          value: "What is your mother's name?",
          label: "What is your mother's name?",
        },
        {
          value: "What is your spouse's name?",
          label: "What is your spouse's name?",
        },
        {
          value: "What is your grandfather's name?",
          label: "What is your grandfather's name?",
        },
        {
          value: "What is your grandmother's name?",
          label: "What is your grandmother's name?",
        },
        {
          value: "What is your birthday?",
          label: "What is your birthday?",
        },
        {
          value: "What is your father's birthday?",
          label: "What is your father's birthday?",
        },
        {
          value: "What is your mother's birthday?",
          label: "What is your mother's birthday?",
        },
        {
          value: "What is your spouse's birthday?",
          label: "What is your spouse's birthday?",
        },
      ],
    };
  },
  methods: {
    getPswProtect() {
      http({
        method: "get",
        url: "http://127.0.0.1:3007/my/getPswProtect",
        headers: {
          Authorization: this.$store.getters.getUserToken,
        },
      })
        .then((res) => {
          if (res.data.status === 0) {
            this.protectForm = { ...res.data.data[0] };
          }
        })
        .catch((err) => {
          console.log(err, "err");
        });
    },
    submitForm(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (this.form.newPwd !== this.form.reNewPwd) {
            this.$message.warning(
              "The two new password entries do not match, please re-enter!"
            );
            this.form.newPwd = "";
            this.form.reNewPwd = "";
            return;
          }

          http({
            method: "post",
            url: "http://127.0.0.1:3007/my/updatePassword",
            headers: {
              Authorization: this.$store.getters.getUserToken,
            },
            params: {
              oldPwd: this.form.oldPwd,
              newPwd: this.form.newPwd,
            },
          })
            .then((res) => {
              if (res.data.status === 1) {
                this.$message.warning(res.data.message);
              } else if (res.data.status === 0) {
                this.$message.success(res.data.message);
              }
              this.resetForm(form);
            })
            .catch((err) => {
              console.log(err, "err");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(form) {
      this.$refs[form].resetFields();
    },
    handleClick(tab, event) {
      if (tab.name === "second") {
        this.getPswProtect();
      }
    },

    submitProtectForm(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          http({
            method: "post",
            url: "http://127.0.0.1:3007/my/updatePswProtect",
            headers: {
              Authorization: this.$store.getters.getUserToken,
            },
            params: {
              question_1: this.protectForm.question_1,
              answer_1: this.protectForm.answer_1,
              question_2: this.protectForm.question_2,
              answer_2: this.protectForm.answer_2,
              question_3: this.protectForm.question_3,
              answer_3: this.protectForm.answer_3,
              lastEditDate: getCurrentDate(),
            },
          })
            .then((res) => {
              if (res.data.status === 1) {
                this.$message.warning(res.data.message);
              } else if (res.data.status === 0) {
                this.$message.success(res.data.message);
              }
            })
            .catch((err) => {
              console.log(err, "err");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    deleteProtect() {
      this.$confirm(
        "<p>Are you sure you want to delete the security question?</p><p>After deletion, you will not be able to modify the password through the [Retrieve Account] method</p>",
        "Prompt",
        {
          confirmButtonText: "Confirm",
          cancelButtonText: "Cancel",
          type: "warning",
          dangerouslyUseHTMLString: true,
        }
      )
        .then(() => {
          http({
            method: "post",
            url: "http://127.0.0.1:3007/my/deletePswProtect",
            headers: {
              Authorization: this.$store.getters.getUserToken,
            },
            params: {
              lastEditDate: getCurrentDate(),
            },
          })
            .then((res) => {
              if (res.data.status === 1) {
                this.$message.warning(res.data.message);
              } else if (res.data.status === 0) {
                this.$message.success(res.data.message);
                this.getPswProtect();
              }
            })
            .catch((err) => {
              console.log(err, "err");
            });
        })
        .catch(() => {
          this.$message.info("Canceled Clearance");
        });
    },
  },
};
</script>

<style lang="less" scoped>
.userPwdEdit {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  // background-color: aqua;

  .el-tabs {
    width: 100%;
    height: auto;
    margin-top: 10px;
    background: white;
  }

  .title {
    width: 80%;
    text-align: center;
  }

  .form {
    width: 50%;
    .el-input {
      width: 70%;
    }

    .el-button--primary {
      margin-left: 30px;
    }

    .el-button--default {
      margin-left: 30px;
    }
  }
}
</style>
