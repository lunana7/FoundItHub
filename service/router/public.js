const express = require("express");
const router = express.Router();

const public_handler = require("../router_handler/public");

router.get("/getClaim", public_handler.getClaim);

router.get("/getRevert", public_handler.getRevert);

router.get("/getFoundClaim", public_handler.getFoundClaim);

router.get("/getFoundRevert", public_handler.getFoundRevert);

router.get("/getThreeClaim", public_handler.getThreeClaim);

router.get("/getThreeRevert", public_handler.getThreeRevert);

router.get("/getCommentsList", public_handler.getCommentsList);

router.get("/getReplyList", public_handler.getReplyList);

router.post("/support", public_handler.support);

router.post("/reply", public_handler.reply);

router.get("/getManagerList", public_handler.getManagerList);

router.get("/getPswProtect", public_handler.getPswProtect);

router.post("/verifyPswProtect", public_handler.verifyPswProtect);

router.post("/updatePassword", public_handler.updatePassword);

router.get("/checkCode", public_handler.checkCode);

module.exports = router;
