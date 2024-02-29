<template>
  <div class="login-register">
    <div class="contain">
      <div class="big-box" :class="{ active: isLogin }">
        <div class="big-contain" key="bigContainLogin" v-if="isLogin">
          <div class="btitle" style="margin-bottom: 20px">Sign In</div>
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="80px"
            class="demo-ruleForm"
            style="width: auto"
          >
            <el-form-item label="Username" prop="username">
              <el-input
                v-model.trim="ruleForm.username"
                ref="inputUsername"
                @keyup.enter.native="submitLoginForm('ruleForm')"
                onkeyup="this.value=this.value.replace(/[^\w_]/g,'');"
              ></el-input>
            </el-form-item>
            <el-form-item label="Password" prop="password">
              <div
                class="pswInput"
                style="
                  display: flex;
                  flex-direction: row;
                  justify-content: space-between;
                "
              >
                <el-input
                  v-model.trim="ruleForm.password"
                  type="password"
                  style="width: 200px"
                  @keyup.enter.native="submitLoginForm('ruleForm')"
                ></el-input>
                <span
                  style="
                    font-size: 12px;
                    cursor: pointer;
                    background-color: rgb(255, 255, 255);
                  "
                  @click="dialogVisible = true"
                  >Forgot Password?</span
                >
              </div>
            </el-form-item>
            <el-form-item label="Validation Code" prop="code">
              <div
                class="pswInput"
                style="
                  display: flex;
                  flex-direction: row;
                  justify-content: space-between;
                "
              >
                <el-input
                  v-model.trim="ruleForm.code"
                  type="text"
                  style="width: 100px"
                  @keyup.enter.native="submitLoginForm('ruleForm')"
                ></el-input>
                <div
                  @click="getCode"
                  v-html="checkCode.code"
                  title="Click to refresh"
                ></div>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitLoginForm('ruleForm')"
                >Log In</el-button
              >
              <el-button @click="resetForm('ruleForm')">Reset</el-button>
              <el-button type="success" @click="visitor">Visitor</el-button>
            </el-form-item>
          </el-form>
        </div>

        <div class="big-contain" key="bigContainRegister" v-else>
          <div class="btitle" style="margin-bottom: 20px">
            Create an account
          </div>
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="130px"
            class="demo-ruleForm"
          >
            <el-form-item label="Account" prop="username">
              <el-input
                v-model.trim="ruleForm.username"
                @keyup.enter.native="submitRegisterForm('ruleForm')"
                onkeyup="this.value=this.value.replace(/[^\w_]/g,'');"
              ></el-input>
            </el-form-item>
            <el-form-item label="Password" prop="password">
              <el-input
                v-model.trim="ruleForm.password"
                type="password"
                show-password
                @keyup.enter.native="submitRegisterForm('ruleForm')"
              ></el-input>
            </el-form-item>
            <el-form-item label="Phone Number" prop="phone">
              <el-input
                v-model.trim="ruleForm.phone"
                @keyup.enter.native="submitRegisterForm('ruleForm')"
              ></el-input>
            </el-form-item>
            <el-form-item label="Username" prop="nickname">
              <el-input
                v-model.trim="ruleForm.nickname"
                @keyup.enter.native="submitRegisterForm('ruleForm')"
              ></el-input>
            </el-form-item>
            <el-form-item label="Verification Code" prop="code">
              <div
                class="pswInput"
                style="
                  display: flex;
                  flex-direction: row;
                  justify-content: space-between;
                "
              >
                <el-input
                  v-model.trim="ruleForm.code"
                  type="text"
                  style="width: 100px"
                  @keyup.enter.native="submitRegisterForm('ruleForm')"
                ></el-input>
                <div
                  @click="getCode"
                  v-html="checkCode.code"
                  title="Can't see clearly? Click to change"
                ></div>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitRegisterForm('ruleForm')"
                >Register Now</el-button
              >
              <el-button @click="resetForm('ruleForm')">Reset</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="small-box" :class="{ active: isLogin }">
        <div class="small-contain" key="smallContainRegister" v-if="isLogin">
          <div class="stitle">Welcome!</div>
          <p class="scontent">Start registering and travel with us</p>
          <button class="sbutton" @click="changeType">Register</button>
        </div>
        <div class="small-contain" key="smallContainLogin" v-else>
          <div class="stitle">Welcome back!</div>
          <p class="scontent">
            Stay in touch with us, please log in to your account
          </p>
          <button class="sbutton" @click="changeType">Log in</button>
        </div>
      </div>
    </div>

    <el-dialog
      class="forgotpsw_dialog"
      title="hint"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose"
    >
      <el-steps :active="active" finish-status="success" align-center>
        <el-step title="Retrieve Account"></el-step>
        <el-step title="Security Question"></el-step>
        <el-step title="Change Password"></el-step>
      </el-steps>
      <hr />
      <div class="dialog_content_1" v-if="active === 0">
        Retrieve Your Account:
        <el-input
          type="text"
          v-model.trim="forgotpswForm.username"
          placeholder="Please input the account you wish to recover."
        ></el-input>
      </div>

      <div class="dialog_content_2" v-if="active === 1">
        <h3>Please answer the following questions</h3>
        <div class="question_answer">
          Question 1: {{ question.question_1 }}
          <el-input
            type="text"
            v-model.trim="forgotpswForm.answerInput_1"
            placeholder="Please enter the answer"
          ></el-input>
        </div>
        <div class="question_answer">
          Question 2: {{ question.question_2 }}
          <el-input
            type="text"
            v-model.trim="forgotpswForm.answerInput_2"
            placeholder="Please enter the answer"
          ></el-input>
        </div>
        <div class="question_answer">
          Question 3: {{ question.question_3 }}
          <el-input
            type="text"
            v-model.trim="forgotpswForm.answerInput_3"
            placeholder="Please enter the answer"
          ></el-input>
        </div>
      </div>

      <div class="dialog_content_3" v-if="active === 2">
        <h3>Change Password</h3>
        <div class="editNewPwd">
          New Password:
          <el-input
            type="password"
            show-password
            v-model.trim="forgotpswForm.newPwd"
            placeholder="New Password:"
          ></el-input>
        </div>
        <div class="editNewPwd">
          Confirm Password:
          <el-input
            type="password"
            show-password
            v-model.trim="forgotpswForm.reNewPwd"
            placeholder="Please enter the new password again"
          ></el-input>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose()">Cancel</el-button>
        <el-button type="primary" @click="next()">Next</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import http from "../utils/request";
export default {
  name: "login-register",
  data() {
    return {
      isLogin: true,
      ruleForm: {
        username: "",
        password: "",
        phone: "",
        nickname: "",
        code: "",
      },
      rules: {
        username: [
          {
            required: true,
            message: "Please enter username (letters, numbers, underscore)",
            trigger: "blur",
          },
          {
            min: 3,
            max: 12,
            message: "Length should be 3 to 12 characters",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "Please enter password", trigger: "blur" },
          {
            min: 5,
            max: 12,
            message: "Length should be 5 to 12 characters",
            trigger: "blur",
          },
        ],
        phone: [
          {
            required: true,
            message: "Please enter contact number",
            trigger: "blur",
          },
          {
            validator: function (rule, value, callback) {
              if (
                /^(?:\+1)?\s?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(
                  value
                ) == false
              ) {
                callback(new Error("Please enter a valid phone number"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        nickname: [
          { required: true, message: "Please enter nickname", trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "Length should be 1 to 10 characters",
            trigger: "blur",
          },
        ],
        code: [
          {
            required: true,
            message: "Please enter verification code",
            trigger: "blur",
          },
        ],
      },
      dialogVisible: false,
      active: 0,
      forgotpswForm: {
        username: "",
        answerInput_1: "",
        answerInput_2: "",
        answerInput_3: "",
        newPwd: "",
        reNewPwd: "",
      },
      question: {},
      checkCode: {
        code: "",
        codeText: "",
      },
    };
  },
  methods: {
    // changeType
    changeType() {
      this.isLogin = !this.isLogin;
      Object.keys(this.ruleForm).forEach((key) => {
        this.ruleForm[key] = "";
      });
    },
    // visitor
    visitor() {
      this.$router.push("/frontIndex");
    },

    submitLoginForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (
            this.ruleForm.code.toLowerCase() !==
            this.checkCode.codeText.toLowerCase()
          ) {
            this.$message.error("Verification code error!");
            this.ruleForm.code = "";
            this.getCode();
            return;
          }
          http({
            method: "post",
            url: "http://127.0.0.1:3007/api/login",
            params: {
              username: this.ruleForm.username,
              password: this.ruleForm.password,
            },
          })
            .then((res) => {
              if (res.data.status == 1) {
                this.$message({
                  showClose: true,
                  message: res.data.message,
                  type: "warning",
                });
                this.ruleForm.password = "";
                this.ruleForm.code = "";
                this.getCode();
              } else if (res.data.status == 0) {
                this.$store.dispatch("asyncUpdateUserToken", res.data.token);

                sessionStorage.setItem("Token", res.data.token);
                http({
                  method: "get",
                  url: "http://127.0.0.1:3007/my/getUserInfo",
                  headers: {
                    Authorization: res.data.token,
                  },
                })
                  .then((res) => {
                    if (res.data.data.loginLOA == "0") {
                      this.$message.warning(
                        "Your account has been deactivated!"
                      );
                      return;
                    }

                    this.$store.dispatch("asyncUpdateUserInfo", res.data.data);
                    sessionStorage.setItem(
                      "state",
                      JSON.stringify(res.data.data)
                    );
                    console.log(this.$store.getters.getUserInfo, "#userInfo");

                    this.$router.push("/frontIndex");
                    this.$message.success("Login successful!", true);
                    this.getUserTask();
                    this.getUserNotice();
                  })
                  .catch((err) => {
                    console.log(
                      "Failed to get user data on the login registration page!"
                    );
                  });
              }
            })
            .catch((err) => {
              // console.log(err)
              this.$message({
                showClose: true,
                message: err,
                type: "error",
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // register
    submitRegisterForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (
            this.ruleForm.code.toLowerCase() !==
            this.checkCode.codeText.toLowerCase()
          ) {
            this.$message.error("Verification code error!");
            this.ruleForm.code = "";
            this.getCode();
            return;
          }
          http({
            method: "post",
            url: "http://127.0.0.1:3007/api/register",
            params: {
              username: this.ruleForm.username,
              password: this.ruleForm.password,
              phone: this.ruleForm.phone,
              nickname: this.ruleForm.nickname,
              identity: 2,
              createDate: this.getCurrentDate(),
            },
          })
            .then((res) => {
              if (res.data.status == 1) {
                this.$message({
                  showClose: true,
                  message: res.data.message,
                  type: "warning",
                });
              } else if (res.data.status == 0) {
                this.$message({
                  showClose: true,
                  message: res.data.message,
                  type: "success",
                });

                this.resetForm(formName);

                this.isLogin = true;

                this.getCode();
              }
            })
            .catch((err) => {
              this.$message({
                showClose: true,
                message: err,
                type: "error",
              });
            });
          // axios.post('http://127.0.0.1:3007/api/login', { username: this.ruleForm.username, password: this.ruleForm.password })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //get image verification
    getCode() {
      http({
        method: "get",
        url: "http://127.0.0.1:3007/api/public/checkCode",
      })
        .then((res) => {
          if (res.data.status === 0) {
            // console.log(res.data, 'res.data');
            this.checkCode.code = res.data.data.data;
            this.checkCode.codeText = res.data.data.text;
          }
        })
        .catch((err) => {
          console.log(err, "err");
        });
    },
    // get current time
    getCurrentDate() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hour = date.getHours();
      let minutes = date.getMinutes();
      let seconds = date.getSeconds();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (day >= 0 && day <= 9) {
        day = "0" + day;
      }
      if (hour >= 0 && hour <= 9) {
        hour = "0" + hour;
      }
      if (minutes >= 0 && minutes <= 9) {
        minutes = "0" + minutes;
      }
      if (minutes >= 0 && minutes <= 9) {
        minutes = "0" + minutes;
      }
      if (seconds >= 0 && seconds <= 9) {
        seconds = "0" + seconds;
      }
      const currentDate =
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hour +
        ":" +
        minutes +
        ":" +
        seconds;
      return currentDate;
    },

    getUserTask() {
      let claimTask = [];
      let revertTask = [];
      http({
        method: "get",
        url: "http://127.0.0.1:3007/my/getUserClaimTask",
        headers: {
          Authorization: this.$store.getters.getUserToken,
        },
      })
        .then((res) => {
          if (res.data.status === 0) {
            claimTask = [...res.data.data];
            http({
              method: "get",
              url: "http://127.0.0.1:3007/my/getUserRevertTask",
              headers: {
                Authorization: this.$store.getters.getUserToken,
              },
            })
              .then((res) => {
                if (res.data.status === 0) {
                  revertTask = [...res.data.data];
                  if (claimTask.length != 0 || revertTask != 0) {
                    this.$notify.info({
                      title: "Kind Reminder",
                      dangerouslyUseHTMLString: true,
                      duration: 10000, // Display time in milliseconds 1000ms == 1s
                      message:
                        "<p>You currently have pending:</p><p>&emsp;" +
                        claimTask.length +
                        " claim tasks,</p><p>&emsp;" +
                        revertTask.length +
                        " return tasks.</p><p>You can view them in Personal Center -> Task Management</P>",
                      offset: 50,
                    });
                  }
                }
              })
              .catch((err) => {
                console.log(err, "HTTP request failed");
              });
          }
        })
        .catch((err) => {
          console.log(err, "HTTP request failed");
        });
    },
    toView() {
      this.$route.push("/userHandleClaim");
    },

    getUserNotice() {
      let claimNotice = [];
      let revertNotice = [];
      http({
        method: "get",
        url: "http://127.0.0.1:3007/my/getUserClaimNotice",
        headers: {
          Authorization: this.$store.getters.getUserToken,
        },
      })
        .then((res) => {
          if (res.data.status === 0) {
            claimNotice = [...res.data.data];
            http({
              method: "get",
              url: "http://127.0.0.1:3007/my/getUserRevertNotice",
              headers: {
                Authorization: this.$store.getters.getUserToken,
              },
            })
              .then((res) => {
                if (res.data.status === 0) {
                  revertNotice = [...res.data.data];
                  let claimYes = claimNotice.filter((item) => {
                    return item.res == 1;
                  });
                  let claimNo = claimNotice.filter((item) => {
                    return item.res == 0;
                  });
                  let revertYes = revertNotice.filter((item) => {
                    return item.res == 1;
                  });
                  let revertNo = revertNotice.filter((item) => {
                    return item.res == 0;
                  });
                  if (claimYes.length != 0) {
                    this.$notify({
                      dangerouslyUseHTMLString: true,
                      duration: 10000, // Display time in milliseconds 1000ms == 1s
                      title: "Application Approved",
                      message:
                        "You have " +
                        claimYes.length +
                        " claim applications approved.<p>Go check it out in your personal center!</p>",
                      type: "success",
                      offset: 50,
                    });
                  } else if (revertYes.length != 0) {
                    this.$notify({
                      dangerouslyUseHTMLString: true,
                      duration: 10000, // Display time in milliseconds 1000ms == 1s
                      title: "Application Approved",
                      message:
                        "You have " +
                        revertYes.length +
                        " return applications approved.<p>Go check it out in your personal center!</p>",
                      type: "success",
                      offset: 50,
                    });
                  } else if (claimYes.length != 0 && revertYes.length != 0) {
                    this.$notify({
                      dangerouslyUseHTMLString: true,
                      duration: 10000, // Display time in milliseconds 1000ms == 1s
                      title: "Application Approved",
                      message:
                        "<p>Claim applications: " +
                        claimYes.length +
                        " approved,</p><p>Return applications: " +
                        revertYes.length +
                        " approved.<p>Go check it out in your personal center!</p>",
                      type: "success",
                      offset: 50,
                    });
                  }
                  if (claimNo.length != 0) {
                    this.$notify({
                      dangerouslyUseHTMLString: true,
                      duration: 10000, // Display time in milliseconds 1000ms == 1s
                      title: "Application Not Approved",
                      message:
                        "You have " +
                        claimNo.length +
                        " claim applications rejected.<p>The more detailed the application description, the more likely it is to be approved~</p>",
                      type: "error",
                      offset: 150,
                    });
                  } else if (revertNo.length != 0) {
                    this.$notify({
                      dangerouslyUseHTMLString: true,
                      duration: 10000, // Display time in milliseconds 1000ms == 1s
                      title: "Application Not Approved",
                      message:
                        "You have " +
                        revertNo.length +
                        " return applications rejected.<p>The more detailed the application description, the more likely it is to be approved~</p>",
                      type: "error",
                      offset: 150,
                    });
                  } else if (claimNo.length != 0 && revertNo.length != 0) {
                    this.$notify({
                      dangerouslyUseHTMLString: true,
                      duration: 10000, // Display time in milliseconds 1000ms == 1s
                      title: "Application Not Approved",
                      message:
                        "<p>Claim applications: " +
                        claimNo.length +
                        " not approved,</p><p>Return applications: " +
                        revertNo.length +
                        " not approved.<p>Go check it out in your personal center!</p>",
                      type: "error",
                      offset: 150,
                    });
                  }

                  // Change the isNotice value of the claim application audit result table to 1 (prompted)
                  claimNotice.forEach((item) => {
                    http({
                      method: "post",
                      url: "http://127.0.0.1:3007/my/updateNotice",
                      headers: {
                        Authorization: this.$store.getters.getUserToken,
                      },
                      params: {
                        id: item.id,
                      },
                    });
                  });

                  // Change the isNotice value of the return application audit result table to 1 (prompted)
                  revertNotice.forEach((item) => {
                    http({
                      method: "post",
                      url: "http://127.0.0.1:3007/my/updateNotice",
                      headers: {
                        Authorization: this.$store.getters.getUserToken,
                      },
                      params: {
                        id: item.id,
                      },
                    });
                  });
                }
              })
              .catch((err) => {
                console.log(err, "HTTP request failed");
              });
          }
        })
        .catch((err) => {
          console.log(err, "HTTP request failed");
        });
    },
    //change password
    handleClose() {
      this.dialogVisible = false;
      this.active = 0;
      Object.keys(this.forgotpswForm).forEach((key) => {
        this.forgotpswForm[key] = "";
      });
    },

    next() {
      if (this.active === 0) {
        if (this.forgotpswForm.username) {
          this.active = 1;
          this.getPswProtect();
        } else {
          this.$message.warning("Enter the Account You Want to Retrieve!");
        }
      } else if (this.active === 1) {
        if (
          this.forgotpswForm.answerInput_1 &&
          this.forgotpswForm.answerInput_2 &&
          this.forgotpswForm.answerInput_3
        ) {
          this.verifyPswProtect();
        } else {
          this.$message.warning("Please answer all questions!");
        }
      } else if (this.active === 2) {
        if (this.forgotpswForm.newPwd === this.forgotpswForm.reNewPwd) {
          this.updatePassword();
        }
      }
    },
    // get protected question
    getPswProtect() {
      http({
        method: "get",
        url: "http://127.0.0.1:3007/api/public/getPswProtect",
        params: {
          username: this.forgotpswForm.username,
        },
      })
        .then((res) => {
          if (res.data.status === 0) {
            console.log(res.data.data, "res.data.data");
            this.question = { ...res.data.data[0] };
          } else {
            this.$message.error(
              "This account has not set up security questions! Please contact the administrator"
            );
            this.handleClose();
          }
        })
        .catch((err) => {
          console.log(err, "err");
        });
    },
    //verify protected question
    verifyPswProtect() {
      http({
        method: "post",
        url: "http://127.0.0.1:3007/api/public/verifyPswProtect",
        params: {
          username: this.forgotpswForm.username,
          answer_1: this.forgotpswForm.answerInput_1,
          answer_2: this.forgotpswForm.answerInput_2,
          answer_3: this.forgotpswForm.answerInput_3,
        },
      })
        .then((res) => {
          if (res.data.status === 0) {
            this.active = 2;
          } else {
            this.$message.warning(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err, "err");
        });
    },
    // 修改密码
    updatePassword() {
      http({
        method: "post",
        url: "http://127.0.0.1:3007/api/public/updatePassword",
        params: {
          username: this.forgotpswForm.username,
          password: this.forgotpswForm.newPwd,
        },
      })
        .then((res) => {
          if (res.data.status === 0) {
            this.active = 0;
            this.dialogVisible = false;
            Object.keys(this.forgotpswForm).forEach((key) => {
              this.forgotpswForm[key] = "";
            });
            this.$message.success("Password changed successfully!");
          } else {
            this.$message.warning(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err, "err");
        });
    },
  },
  mounted() {
    this.$refs.inputUsername.focus();
    this.getCode();
  },
};
</script>

<style lang="less" scoped>
.login-register {
  font-family: "Roboto", sans-serif;
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  background-image: url("../assets/login_bg.JPG");
  background-size: cover;
  padding: 20px;
  .forgotpsw_dialog {
    .dialog_content_1 {
      padding: 20px 0;
      text-align: center;
      .el-input {
        width: 250px;
      }
    }
    .dialog_content_2 {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .question_answer {
        display: flex;
        flex-direction: column;
        justify-content: center;
        .el-input {
          width: 250px;
          margin: 10px 0;
        }
      }
    }
    .dialog_content_3 {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .editNewPwd {
        display: flex;
        flex-direction: column;
        justify-content: center;
        .el-input {
          width: 250px;
          margin: 10px 0;
        }
      }
    }
  }
}
.contain {
  width: 60%;
  height: 80%;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 0 3px #f0f0f0, 0 0 6px #f0f0f0;
  padding: 20px;
}
.big-contain el-form {
  padding: auto;
  margin-top: 100px;
}
.big-box {
  width: 70%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 30%;
  transform: translateX(0%);
  transition: all 1s;
  overflow: auto;

  .sysname {
    height: 10%;
    text-align: center;
    font-weight: bolder;
    color: #81689d;
    font-size: 2.5em;
    overflow: hidden;
  }
}
.big-contain {
  padding: 50px 0;
  width: 100%;
  height: 75%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.btitle {
  font-size: 2em;
  font-weight: bold;
  color: #000000;
  margin-top: 50px;
}
.bform {
  width: 100%;
  height: 40%;
  padding: 2em 0;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
.bform .errTips {
  display: block;
  width: 50%;
  text-align: left;
  color: red;
  font-size: 0.8em;
  margin-left: 1em;
}
.bform input {
  width: 45%;
  height: 30px;
  border: none;
  outline: none;
  border-radius: 10px;
  padding-left: 2em;
  background-color: #f0f0f0;
}
.bbutton {
  width: 20%;
  height: 40px;
  border-radius: 24px;
  border: none;
  outline: none;
  background-color: #81689d;
  color: #fff;
  font-size: 1em;
  cursor: pointer;
}
.small-box {
  width: 30%;
  height: 100%;
  background: linear-gradient(135deg, #81689d, #dec6fa);
  position: absolute;
  top: 0;
  left: 0;
  transform: translateX(0%);
  transition: all 1s;
  border-top-left-radius: inherit;
  border-bottom-left-radius: inherit;
}
.small-contain {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.stitle {
  font-size: 2em;
  font-weight: bold;
  color: #fff;
}
.scontent {
  font-size: 1em;
  color: #fff;
  text-align: center;
  padding: 2em 4em;
  line-height: 2em;
}
.sbutton {
  width: 60%;
  height: 40px;
  border-radius: 24px;
  border: none; /* remove the border */
  outline: none;
  background: linear-gradient(
    90deg,
    #474f7a 0%,
    #343a6e 100%
  ); /* add a gradient background */
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1); /* add a shadow */
  color: #fff;
  font-size: 1em;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sbutton:hover {
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2); /* increase the shadow on hover */
  transform: translateY(-3px); /* move the button up a bit on hover */
}

.big-box.active {
  left: 0;
  transition: all 0.5s;
}
.small-box.active {
  left: 100%;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: inherit;
  border-bottom-right-radius: inherit;
  transform: translateX(-100%);
  transition: all 1s;
}

.custom-button {
  background-color: #474f7a;
  border-color: #1f2544;
}
</style>
