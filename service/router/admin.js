const express = require("express");
const router = express.Router();
//import the router handler module

const admin_handler = require("../router_handler/admin");

router.post("/addHistory", admin_handler.addHistory);

router.get("/getUserCount", admin_handler.getUserCount);

router.get("/getClaimCount", admin_handler.getClaimCount);

router.get("/getRevertCount", admin_handler.getRevertCount);

router.get("/getCommentsCount", admin_handler.getCommentsCount);

router.get("/getClaimStatus", admin_handler.getClaimStatus);

router.get("/getRevertStatus", admin_handler.getRevertStatus);

router.get("/getClaimNearMonth", admin_handler.getClaimNearMonth);

router.get("/getRevertNearMonth", admin_handler.getRevertNearMonth);

router.get("/getNewUserList", admin_handler.getNewUserList);

router.get("/getLoginHistory", admin_handler.getLoginHistory);

router.get("/getUserList", admin_handler.getUserList);

router.post("/deleteUser", admin_handler.deleteUser);

router.post("/setIdentity", admin_handler.setIdentity);

router.get("/getManagerList", admin_handler.getManagerList);

router.get("/getKeywordUserList", admin_handler.getKeywordUserList);

router.get("/getKeywordManagerList", admin_handler.getKeywordManagerList);

router.post("/updateUserInfo", admin_handler.updateUserInfo);

router.post("/updateAvatar", admin_handler.updateAvatar);

router.post("/editUserLOA", admin_handler.editUserLOA);

router.get("/getClaimList", admin_handler.getClaimList);

router.get("/getRevertList", admin_handler.getRevertList);

router.get("/getKeywordClaimList", admin_handler.getKeywordClaimList);

router.get("/getKeywordRevertList", admin_handler.getKeywordRevertList);

router.post("/editClaim", admin_handler.editClaim);

router.post("/statusClaimToProcessing", admin_handler.statusClaimToProcessing);

router.post("/statusProcessingToClaim", admin_handler.statusProcessingToClaim);

router.post(
  "/statusProcessingToClaimed",
  admin_handler.statusProcessingToClaimed
);

router.post("/statusClaimedToClaim", admin_handler.statusClaimedToClaim);

router.post(
  "/statusClaimedToProcessing",
  admin_handler.statusClaimedToProcessing
);

router.post("/editRevert", admin_handler.editRevert);

router.post(
  "/statusRevertToProcessing",
  admin_handler.statusRevertToProcessing
);

router.post(
  "/statusProcessingToRevert",
  admin_handler.statusProcessingToRevert
);

router.post(
  "/statusProcessingToReverted",
  admin_handler.statusProcessingToReverted
);

router.post("/statusRevertedToRevert", admin_handler.statusRevertedToRevert);

router.post(
  "/statusRevertedToProcessing",
  admin_handler.statusRevertedToProcessing
);

router.get("/getKeywordCommentList", admin_handler.getKeywordCommentList);

router.get("/getKeywordReplyList", admin_handler.getKeywordReplyList);

router.get("/getHistoryList", admin_handler.getHistoryList);

router.post("/updatePS", admin_handler.updatePS);

router.post("/deleteHistory", admin_handler.deleteHistory);

router.get("/getClaimVerifyList", admin_handler.getClaimVerifyList);

router.post("/failClaim", admin_handler.failClaim);

router.get("/getRevertVerifyList", admin_handler.getRevertVerifyList);

router.post("/failRevert", admin_handler.failRevert);

router.post("/addResults", admin_handler.addResults);

module.exports = router;
