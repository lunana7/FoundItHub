<template>
  <div class="container">
    <el-row :gutter="20" class="ONE">
      <el-col :span="16" class="comments">
        <div class="operation">
          <div class="avatar">
            <el-avatar
              v-if="userInfo.user_pic"
              :size="60"
              :src="require('../../../public/user_pic/' + userInfo.user_pic)"
            ></el-avatar>
            <el-avatar
              v-if="!userInfo.user_pic"
              :size="60"
              :src="require('../../../public/no_pic/noAvatar.png')"
            ></el-avatar>
          </div>

          <div class="editComment">
            <el-input
              type="textarea"
              resize="none"
              placeholder="Please enter content"
              v-model="textarea"
            >
            </el-input>
            <el-button @click="sendBtn">Publish</el-button>
          </div>
        </div>

        <div class="showComments">
          <div
            class="data-container"
            v-for="item in commentsList"
            :key="item.id"
          >
            <div class="left-avatar">
              <el-avatar
                v-if="item.author_pic"
                :size="50"
                :src="require('../../../public/user_pic/' + item.author_pic)"
              ></el-avatar>
              <el-avatar
                v-if="!item.author_pic"
                :size="50"
                :src="require('../../../public/no_pic/noAvatar.png')"
              ></el-avatar>
            </div>

            <div class="right">
              <div class="r-nickname">{{ item.authorNickname }}</div>
              <div class="r-comments">{{ item.comments }}</div>
              <div class="r-date">
                {{ item.date.slice(0, 16) }}
                <el-image
                  :id="item.id"
                  :src="supportSrc[0]"
                  @click.once="support(item)"
                ></el-image>
                {{ item.support }}
                <el-image
                  :src="require('../../assets/reply.png')"
                  @click="reply(item)"
                ></el-image
                >{{ item.reply }}
                <el-button
                  type="text"
                  @click="deleteBtn(item)"
                  v-if="isLogin == true && userInfo.id == item.authorId"
                  >Delete</el-button
                >
              </div>

              <!-- Reply input box -->
              <div class="replyComment" v-show="item.isReply">
                <el-input
                  type="textarea"
                  resize="none"
                  placeholder="Please enter reply content"
                  v-model.trim="textarea_reply"
                >
                </el-input>
                <el-button @click="sendReplyBtn(item)">Publish</el-button>
              </div>

              <el-collapse
                v-model="activeName"
                accordion
                @change="getReplyList(item)"
                v-if="item.reply != 0"
              >
                <el-collapse-item title="Expand reply" :name="item.id">
                  <div
                    class="reply-data-container"
                    v-for="item in replyList"
                    :key="item.id"
                  >
                    <div class="reply-left-avatar">
                      <el-avatar
                        v-if="item.author_pic"
                        :size="40"
                        :src="
                          require('../../../public/user_pic/' + item.author_pic)
                        "
                      ></el-avatar>
                      <el-avatar
                        v-if="!item.author_pic"
                        :size="40"
                        :src="require('../../../public/no_pic/noAvatar.png')"
                      ></el-avatar>
                    </div>
                    <div class="reply-right">
                      <div class="reply-r-nickname">
                        {{ item.authorNickname }}
                      </div>
                      <div class="reply-r-comments">{{ item.comments }}</div>
                      <div class="reply-r-date">
                        {{ item.date.slice(0, 16) }}

                        <el-button
                          type="text"
                          @click="deleteBtn(item)"
                          v-if="isLogin == true && userInfo.id == item.authorId"
                          >Delete</el-button
                        >
                      </div>
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
        </div>

        <div class="noComments" v-if="commentsList.length == 0">
          No data available
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import http from "../../utils/request";
export default {
  data() {
    return {
      isLogin: false,
      userInfo: {},
      textarea: "",
      textarea_reply: "",
      commentsList: [],
      replyList: [],
      supportSrc: [
        require("../../assets/support.png"),
        require("../../assets/supported.png"),
      ],
      activeName: "1",
    };
  },
  methods: {
    getUserInfo() {
      this.userInfo = { ...this.$store.getters.getUserInfo };
    },
    getCommentsList() {
      http({
        method: "get",
        url: "http://127.0.0.1:3007/api/public/getCommentsList",
      })
        .then((res) => {
          if (res.data.status === 0) {
            this.commentsList = [...res.data.data];
            this.commentsList.forEach((item) => {
              Object.assign(item, { isSupport: false, isReply: false });
            });
          }
        })
        .catch((err) => {
          console.log(err, "http request failed");
        });
    },
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
    sendBtn() {
      if (this.isLogin) {
        if (this.$store.getters.getUserInfo.commentsLOA === "0") {
          this.$message.warning("You do not have comment permissions!");
          this.textarea = "";
          return;
        }
        if (this.textarea != "") {
          http({
            method: "post",
            url: "http://127.0.0.1:3007/my/publishComment",
            headers: {
              Authorization: this.$store.getters.getUserToken,
            },
            params: {
              date: this.getCurrentDate(),
              authorId: this.userInfo.id,
              author_pic: this.userInfo.user_pic,
              authorNickname: this.userInfo.nickname,
              comments: this.textarea,
              level: 1,
              support: 0,
              reply: 0,
            },
          })
            .then((res) => {
              if (res.data.status === 1) {
                this.$message.warning(
                  "Publish failed, please try again later!"
                );
              } else if (res.data.status === 0) {
                this.$message.success("Publish successful!");
                this.textarea = "";
                this.getCommentsList();
              }
            })
            .catch((err) => {
              console.log(err, "HTTP request failed");
            });
        } else {
          this.$message.warning("Comments cannot be empty!");
        }
      } else {
        this.$message.warning("Not logged in, please log in first!");
        this.textarea = "";
      }
    },
    supprot(item) {
      document.getElementById(item.id).src = this.supportSrc[1];
      http({
        method: "post",
        url: "http://127.0.0.1:3007/api/public/support",
        params: {
          id: item.id,
        },
      })
        .then((res) => {
          if (res.data.status === 1) {
            this.$message.warning("Like failed!");
          } else if (res.data.status === 0) {
            this.$message.success("Like successful!");
            this.getCommentsList();
          }
        })
        .catch((err) => {
          console.log(err, "http request failed");
        });
    },

    reply(item) {
      item.isReply = !item.isReply;

      this.$forceUpdate();
    },
    deleteBtn(item) {
      console.log(item, "删除的item");

      if (item.level != 1) {
        http({
          method: "post",
          url: "http://127.0.0.1:3007/my/deleteReply",
          headers: {
            Authorization: this.$store.getters.getUserToken,
          },
          params: {
            id: item.higherLevelId,
          },
        })
          .then((res) => {})
          .catch((err) => {
            console.log(err, "http request failed");
          });
      }

      http({
        method: "post",
        url: "http://127.0.0.1:3007/my/deleteComment",
        headers: {
          Authorization: this.$store.getters.getUserToken,
        },
        params: {
          id: item.id,
          higherLevelId: item.id,
        },
      })
        .then((res) => {
          if (res.data.status === 1) {
            this.$message.warning(
              "Failed to delete the comment, please try again later!"
            );
          } else if (res.data.status === 0) {
            this.$message.success("Comment deleted successfully!");
            this.getCommentsList();
          }
        })
        .catch((err) => {
          console.log(err, "http request failed");
        });

      location.reload();
    },
    getReplyList(item) {
      http({
        method: "get",
        url: "http://127.0.0.1:3007/api/public/getReplyList",
        params: {
          higherLevelId: item.id,
        },
      })
        .then((res) => {
          if (res.data.status === 1) {
          } else if (res.data.status === 0) {
            this.replyList = [...res.data.data];
          }
        })
        .catch((err) => {
          console.log(err, "http request failed");
        });
    },
    sendReplyBtn(item) {
      if (this.isLogin) {
        if (this.$store.getters.getUserInfo.commentsLOA === "0") {
          this.$message.warning("You do not have reply permissions!");
          this.textarea_reply = "";
          return;
        }
        if (this.textarea_reply != "") {
          http({
            method: "post",
            url: "http://127.0.0.1:3007/my/publishCommentsReply",
            headers: {
              Authorization: this.$store.getters.getUserToken,
            },
            params: {
              date: this.getCurrentDate(),
              authorId: this.userInfo.id,
              author_pic: this.userInfo.user_pic,
              authorNickname: this.userInfo.nickname,
              comments: this.textarea_reply,
              level: 2,
              support: 0,
              reply: 0,
              higherLevelId: item.id,
            },
          })
            .then((res) => {
              if (res.data.status === 1) {
                this.$message.warning("Reply failed, please try again later!");
              } else if (res.data.status === 0) {
                this.$message.success("Reply successful!");
                this.textarea = "";
                this.getCommentsList();
              }
            })
            .catch((err) => {
              console.log(err, "http request failed");
            });

          let number = item.reply + 1;
          http({
            method: "post",
            url: "http://127.0.0.1:3007/api/public/reply",
            headers: {
              Authorization: this.$store.getters.getUserToken,
            },
            params: {
              reply: number,
              id: item.id,
            },
          })
            .then((res) => {})
            .catch((err) => {
              console.log(err, "http request failed");
            });
          this.textarea_reply = "";
        } else {
          this.$message.warning("The message cannot be empty!");
        }
      } else {
        this.$message.warning("Not logged in, please login first!");
        this.textarea_reply = "";
      }
    },
  },
  mounted() {
    this.getUserInfo();
    this.getCommentsList();

    if (
      this.$store.getters.getUserInfo.nickname != "" &&
      this.$store.getters.getUserToken
    ) {
      this.isLogin = true;
    }
  },
};
</script>

<style lang="less" scoped>
.container {
  // border: 1px solid salmon;
  animation: scale 0.5s linear 1 forwards;

  @keyframes scale {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  .ONE {
    height: 100%;
    // border: 1px solid black;
    padding: 10px;
    display: flex;
    justify-content: center;

    .comments {
      height: 100%;
      // border: 1px solid rgb(0, 255, 115);
      .operation {
        height: 11%;
        display: flex;
        flex-direction: row;
        // border: 1px solid rgb(30, 7, 229);

        .avatar {
          width: 12%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .editComment {
          width: 88%;
          height: 100%;
          display: flex;
          justify-content: space-between;
          .el-textarea {
            width: 86%;
            height: 100%;
            /deep/.el-textarea__inner {
              height: 100%;
            }
          }
          .el-button {
            width: 12%;
            height: 100%;
            color: white;
            font-size: 1em;
            letter-spacing: 6px;
            border-radius: 5px;
            background-color: rgb(136, 236, 221);
          }
          .el-button:hover {
            cursor: pointer;
            background-color: rgb(104, 205, 190, 0.8);
          }
        }
      }

      .showComments {
        height: auto;
        padding: 5px;
        // border: 1px solid rgb(240, 10, 156);

        .data-container {
          height: auto;
          padding: 10px 0 10px 0;
          display: flex;
          flex-direction: row;
          .left-avatar {
            width: 12%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .right {
            width: 88%;
            border-bottom: 2px solid #ccc;
            display: flex;
            flex-direction: column;
            .r-nickname {
              color: rgb(97, 102, 109);
              padding: 10px 0;
            }
            .r-comments {
              padding: 5px 0;
            }
            .r-date {
              padding: 0 0 5px 0;
              font-size: 0.9em;
              color: #757575;
              display: flex;
              align-items: center;
              .el-image {
                height: 15px;
                width: 15px;
                padding: 0 5px 0 30px;
              }
              .el-image:hover {
                cursor: pointer;
              }
              .el-button {
                padding: 0 0 0 30px;
              }
            }
            .replyComment {
              width: 100%;
              height: 100%;
              padding: 5px 0;
              display: flex;
              justify-content: space-around;
              align-items: center;
              .el-textarea {
                width: 86%;
                height: 100%;
                /deep/.el-textarea__inner {
                  height: 100%;
                }
              }
              .el-button {
                width: 12%;
                height: 100%;
                color: white;
                font-size: 1em;
                letter-spacing: 6px;
                border-radius: 5px;
                background-color: rgb(136, 236, 221);
              }
              .el-button:hover {
                cursor: pointer;
                background-color: rgb(104, 205, 190, 0.8);
              }
            }
            .el-collapse {
              .reply-data-container {
                height: auto;
                padding: 10px 0 10px 0;
                display: flex;
                flex-direction: row;
                .reply-left-avatar {
                  width: 10%;
                  height: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
                .reply-right {
                  width: 88%;
                  border-bottom: 2px solid #ccc;
                  display: flex;
                  flex-direction: column;
                  .reply-r-nickname {
                    color: rgb(97, 102, 109);
                    padding: 5px 0;
                  }
                  .reply-r-comments {
                    padding: 2px 0;
                  }
                  .reply-r-date {
                    padding: 0 0 5px 0;
                    font-size: 0.9em;
                    color: #757575;
                    display: flex;
                    align-items: center;
                    .el-image {
                      height: 15px;
                      width: 15px;
                      padding: 0 5px 0 30px;
                    }
                    .el-image:hover {
                      cursor: pointer;
                    }
                    .el-button {
                      padding: 0 0 0 30px;
                    }
                  }
                }
              }
              /deep/.el-collapse-item__header {
                background-color: rgb(244, 244, 244);
                height: 20px;
                line-height: 20px;
                // color: #409EFF;
                .el-collapse-head-8879 {
                  color: #409eff;
                }
              }
              /deep/.el-collapse-item__content {
                background-color: rgb(244, 244, 244);
                padding-bottom: 0px;
              }
            }
          }
        }
      }

      .noComments {
        text-align: center;
        font-weight: bolder;
        color: #666;
        font-size: 1.5em;
        padding: 50px 0;
      }
    }
  }
}
</style>
