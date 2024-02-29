const express = require("express");
const router = express.Router();

const userinfo_handler = require("../router_handler/userinfo");

router.get("/getUserInfo", userinfo_handler.getUserInfo);

router.post("/updateUserInfo", userinfo_handler.updateUserInfo);

router.post("/updatePassword", userinfo_handler.updatePassword);

router.post("/uploadAvatar", userinfo_handler.uploadAvatar);

router.post("/updateAvatar", userinfo_handler.updateAvatar);

router.get("/getPswProtect", userinfo_handler.getPswProtect);

router.post("/updatePswProtect", userinfo_handler.updatePswProtect);

router.post("/deletePswProtect", userinfo_handler.deletePswProtect);

router.get("/getUserClaim", userinfo_handler.getUserClaim);

router.post("/addClaim", userinfo_handler.addClaim);

router.post("/uploadClaimPic", userinfo_handler.uploadClaimPic);

router.post("/handleClaim", userinfo_handler.handleClaim);

router.post("/editClaim", userinfo_handler.editClaim);

router.post("/deleteClaim", userinfo_handler.deleteClaim);

router.post("/deleteClaimPic", userinfo_handler.deleteClaimPic);

router.get("/getUserRevert", userinfo_handler.getUserRevert);

router.post("/addRevert", userinfo_handler.addRevert);

router.post("/uploadRevertPic", userinfo_handler.uploadRevertPic);

router.post("/handleRevert", userinfo_handler.handleRevert);

router.post("/editRevert", userinfo_handler.editRevert);

router.post("/deleteRevert", userinfo_handler.deleteRevert);

router.post("/deleteRevertPic", userinfo_handler.deleteRevertPic);

router.get("/getUserHandleClaim", userinfo_handler.getUserHandleClaim);

router.post("/cancelHandleClaim", userinfo_handler.cancelHandleClaim);

router.get("/getUserHandleRevert", userinfo_handler.getUserHandleRevert);

router.post("/cancelHandleRevert", userinfo_handler.cancelHandleRevert);

router.post("/publishComment", userinfo_handler.publishComment);

router.post("/deleteComment", userinfo_handler.deleteComment);

router.post("/publishCommentsReply", userinfo_handler.publishCommentsReply);

router.post("/deleteReply", userinfo_handler.deleteReply);

router.get("/getUserClaimTask", userinfo_handler.getUserClaimTask);

router.get("/getUserRevertTask", userinfo_handler.getUserRevertTask);

router.get("/getUserClaimNotice", userinfo_handler.getUserClaimNotice);

router.get("/getUserRevertNotice", userinfo_handler.getUserRevertNotice);

router.post("/updateNotice", userinfo_handler.updateNotice);

module.exports = router;
