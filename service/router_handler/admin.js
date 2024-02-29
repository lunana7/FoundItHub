const db = require("../db/index");

exports.addHistory = (req, res) => {
  const sql = "insert into t_adminHistory set ?";
  db.query(sql, req.query, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1)
      return res.cc("Failed to add historical data!");
    res.cc("Successfully added historical data!", 0);
  });
};

exports.getUserCount = (req, res) => {
  const sql = `select
                                    sum(case month(createDate) when '1' then 1 else 0 end) as January,
                                    sum(case month(createDate) when '2' then 1 else 0 end) as February,
                                    sum(case month(createDate) when '3' then 1 else 0 end) as March,
                                    sum(case month(createDate) when '4' then 1 else 0 end) as April,
                                    sum(case month(createDate) when '5' then 1 else 0 end) as May,
                                    sum(case month(createDate) when '6' then 1 else 0 end) as June
                from t_users`;
  db.query(sql, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      message: "Get success!",
      data: results[0],
    });
  });
};

exports.getClaimCount = (req, res) => {
  const sql = `select
                            sum(case month(createDate) when '1' then 1 else 0 end) as January,
                            sum(case month(createDate) when '2' then 1 else 0 end) as February,
                            sum(case month(createDate) when '3' then 1 else 0 end) as March,
                            sum(case month(createDate) when '4' then 1 else 0 end) as April,
                            sum(case month(createDate) when '5' then 1 else 0 end) as May,
                            sum(case month(createDate) when '6' then 1 else 0 end) as June
                from t_claim`;
  db.query(sql, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      message: "Get success!",
      data: results[0],
    });
  });
};

exports.getRevertCount = (req, res) => {
  const sql = `select
  sum(case month(createDate) when '1' then 1 else 0 end) as January,
  sum(case month(createDate) when '2' then 1 else 0 end) as February,
  sum(case month(createDate) when '3' then 1 else 0 end) as March,
  sum(case month(createDate) when '4' then 1 else 0 end) as April,
  sum(case month(createDate) when '5' then 1 else 0 end) as May,
  sum(case month(createDate) when '6' then 1 else 0 end) as June
                from t_revert`;
  db.query(sql, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      message: "Get success!",
      data: results[0],
    });
  });
};

exports.getCommentsCount = (req, res) => {
  const sql = `select
  sum(case month(createDate) when '1' then 1 else 0 end) as January,
  sum(case month(createDate) when '2' then 1 else 0 end) as February,
  sum(case month(createDate) when '3' then 1 else 0 end) as March,
  sum(case month(createDate) when '4' then 1 else 0 end) as April,
  sum(case month(createDate) when '5' then 1 else 0 end) as May,
  sum(case month(createDate) when '6' then 1 else 0 end) as June
                from t_comments`;
  db.query(sql, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      message: "Get success!",
      data: results[0],
    });
  });
};

exports.getClaimStatus = (req, res) => {
  const sql = `select
                sum(case isFound when '0' then 1 else 0 end) as Claimed,
                sum(case isFound when '1' then 1 else 0 end) as Unclaimed,
                sum(case isFound when '2' then 1 else 0 end) as Processing
                from t_claim`;
  db.query(sql, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      message: "Get success!",
      data: results[0],
    });
  });
};

exports.getRevertStatus = (req, res) => {
  const sql = `select
  sum(case isFound when '0' then 1 else 0 end) as Claimed,
  sum(case isFound when '1' then 1 else 0 end) as Unclaimed,
  sum(case isFound when '2' then 1 else 0 end) as Processing
                from t_revert`;
  db.query(sql, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      message: "Get success!",
      data: results[0],
    });
  });
};

exports.getClaimNearMonth = (req, res) => {
  const sql =
    "select * from t_claim where DATE_SUB(CURDATE(), INTERVAL 30 DAY) <= finishDate";
  db.query(sql, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      message: "Get success!",
      data: results,
    });
  });
};

exports.getRevertNearMonth = (req, res) => {
  const sql =
    "select * from t_revert where DATE_SUB(CURDATE(), INTERVAL 30 DAY) <= finishDate";
  db.query(sql, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      message: "Get success!",
      data: results,
    });
  });
};

exports.getNewUserList = (req, res) => {
  const sql = "select * from t_users where identity=2 order by createDate desc";
  db.query(sql, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      message: "Get success!",
      data: results,
    });
  });
};

exports.getLoginHistory = (req, res) => {
  const sql = `select id,max(loginDate) as loginDate,max(logoutDate) as logoutDate,userId,user_pic,nickname,identity 
                from t_adminHistory
                group by userId
                order by loginDate desc`;
  db.query(sql, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      message: "Get success!",
      data: results,
    });
  });
};

exports.getUserList = (req, res) => {
  const sql = "select * from t_users where identity=2";
  db.query(sql, req.query, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      message: "Get success!",
      data: results,
    });
  });
};

exports.deleteUser = (req, res) => {
  const sql = "delete from t_users where id=?";
  db.query(sql, req.query.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows != 1) return res.cc("Deletion failed!");
    res.send({
      status: 0,
      message: "Deletion successful!",
    });
  });
};

exports.setIdentity = (req, res) => {
  const sql = "update t_users set ? where id=?";
  db.query(sql, [req.query, req.query.id], (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows != 1) return res.cc("Edit failed!");
    res.send({
      status: 0,
      message: "Get success!",
    });
  });
};

exports.getManagerList = (req, res) => {
  const sql = "select * from t_users where identity=1";
  db.query(sql, req.query, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      message: "Getting admin list data was successful!",
      data: results,
    });
  });
};

exports.getKeywordUserList = (req, res) => {
  const keyword = `'%` + req.query.keyword + `%'`;
  const sql =
    "select * from t_users where identity=2 and ( username like" +
    keyword +
    "or `nickname` like" +
    keyword +
    ")";
  db.query(sql, req.query, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      message: "Getting user list data was successful!",
      data: results,
    });
  });
};

exports.getKeywordManagerList = (req, res) => {
  const keyword = `'%` + req.query.keyword + `%'`;
  const sql =
    "select * from t_users where identity=1 and ( username like" +
    keyword +
    "or `nickname` like" +
    keyword +
    ")";
  db.query(sql, req.query, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      message: "Getting admin list data was successful!",
      data: results,
    });
  });
};

//Handler function for editing user information
exports.updateUserInfo = (req, res) => {
  // Check if the phone number has changed
  const sql = "select phone from t_users where id=?";
  db.query(sql, req.query.id, (err, results) => {
    if (err) return res.cc(err);
    // Call the phone value in results, need results[0].phone
    console.log(results[0].phone != req.query.phone, "Comparison result");
    // If it is a new phone number input -> Check if it is occupied -> If occupied, return
    //                                                                 -> If not occupied, modify
    if (results[0].phone !== req.query.phone) {
      // Check if the phone is occupied
      const sql = "select * from t_users where phone=?";
      db.query(sql, req.query.phone, (err, results) => {
        // SQL statement execution failed
        if (err) return res.cc(err);
        // If the returned result is greater than or equal to 1, it means the phone number has been occupied
        if (results.length >= 1)
          return res.cc("This phone number has been used!");
        // Update user information
        const sql = "update t_users set ? where id=?";
        db.query(sql, [req.query, req.query.id], (err, results) => {
          // SQL statement execution failed
          if (err) return res.cc(err);
          // SQL statement executed successfully, but the affected result is not 1
          if (results.affectedRows !== 1)
            return res.cc("Failed to modify basic user information!");
          return res.cc("User information modified successfully!", 0);
        });
      });
    } else {
      // Update user information
      const sql = "update t_users set ? where id=?";
      db.query(sql, [req.query, req.query.id], (err, results) => {
        // SQL statement execution failed
        if (err) return res.cc(err);
        // SQL statement executed successfully, but the affected result is not 1
        if (results.affectedRows !== 1)
          return res.cc("Failed to modify basic user information!");
        return res.cc("User information modified successfully!", 0);
      });
    }
  });
};

//Handler function for updating user avatar
exports.updateAvatar = (req, res) => {
  const sqlStr = "update t_users set ? where id= ?";
  db.query(sqlStr, [req.query, req.query.id], (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1)
      return res.cc("Failed to update user avatar information!");
    return res.cc("User avatar information updated successfully!", 0);
  });
};

exports.editUserLOA = (req, res) => {
  const sql = "update t_users set ? where id=?";
  db.query(sql, [req.query, req.query.id], (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows != 1) return res.cc("Edit failed!");
    res.send({
      status: 0,
      message: "Edit successful!",
    });
  });
};

exports.getClaimList = (req, res) => {
  const sql = "select * from t_claim order by createDate desc";
  db.query(sql, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      message: "Get success!",
      data: results,
    });
  });
};

exports.getRevertList = (req, res) => {
  const sql = "select * from t_revert order by createDate desc";
  db.query(sql, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      message: "Get success!",
      data: results,
    });
  });
};

exports.getKeywordClaimList = (req, res) => {
  const keyword = `'%` + req.query.keyword + `%'`;
  const sql =
    "select * from t_claim where resume like " +
    keyword +
    " or `describe` like " +
    keyword;
  db.query(sql, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      message: "Get success!",
      data: results,
    });
  });
};

exports.getKeywordRevertList = (req, res) => {
  const keyword = `'%` + req.query.keyword + `%'`;
  const sql =
    "select * from t_revert where resume like " +
    keyword +
    " or `describe` like " +
    keyword;
  db.query(sql, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      message: "Get success!",
      data: results,
    });
  });
};

exports.editClaim = (req, res) => {
  const sql = "update t_claim set ? where id=?";
  db.query(sql, [req.query, req.query.id], (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows != 1) return res.cc("Modification failed!");
    res.cc("Modification successful!", 0);
  });
};

exports.statusClaimToProcessing = (req, res) => {
  const sql = "select * from t_users where id=? or username=?";
  db.query(sql, [req.query.input, req.query.input], (err, results) => {
    if (err) return res.cc(err);
    if (results.length != 1) return res.cc("This user does not exist!");
    const sql = `update t_claim set claimDate = ?, 
                        handlerId = ?, 
                        handlerNickname = ?, 
                        handlerPhone = ?, 
                        handlerEmail= ?, 

                        isFound = 2 
                        where id=?`;
    db.query(
      sql,
      [
        req.query.date,
        results[0].id,
        results[0].nickname,
        results[0].phone,
        results[0].email,
        req.query.id,
      ],
      (err, results) => {
        if (err) return res.cc(err);
        if (results.affectedRows != 1) return res.cc("Modification failed!");
        res.cc("Modified successfully!", 0);
      }
    );
  });
};

exports.statusProcessingToClaim = (req, res) => {
  const sql =
    "update t_claim set claimDate = null, handlerId = null, handlerNickname = null, handlerPhone = null, handlerWechat = null, handlerQQ = null, isFound = 1 where id=?";
  db.query(sql, req.query.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows != 1) return res.cc("Modification failed!");
    res.cc("Modified successfully!", 0);
  });
};

exports.statusProcessingToClaimed = (req, res) => {
  const sql = "update t_claim set finishDate=?, isFound = 0 where id=?";
  db.query(sql, [req.query.date, req.query.id], (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows != 1) return res.cc("Modification failed!");
    res.cc("Modified successfully!", 0);
  });
};

exports.statusClaimedToClaim = (req, res) => {
  const sql = `update t_claim set claimDate = null, finishDate = null, handlerId = null, handlerNickname = null, handlerPhone = null, handlerWechat = null,
                handlerQQ = null, isFound = 1 where id=?`;
  db.query(sql, req.query.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows != 1) return res.cc("Modification failed!");
    res.cc("Modified successfully!", 0);
  });
};

exports.statusClaimedToProcessing = (req, res) => {
  const sql = `update t_claim set finishDate = null, isFound = 2 where id=?`;
  db.query(sql, req.query.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows != 1) return res.cc("Modification failed!");
    res.cc("Modified successfully!", 0);
  });
};

exports.editRevert = (req, res) => {
  const sql = "update t_revert set ? where id=?";
  db.query(sql, [req.query, req.query.id], (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows != 1) return res.cc("Modification failed!");
    res.cc("Modified successfully!", 0);
  });
};

exports.statusRevertToProcessing = (req, res) => {
  const sql = "select * from t_users where id=? or username=?";
  db.query(sql, [req.query.input, req.query.input], (err, results) => {
    if (err) return res.cc(err);
    if (results.length != 1) return res.cc("该用户不存在！");
    const sql = `update t_revert set revertDate = ?, 
                        handlerId = ?, 
                        handlerNickname = ?, 
                        handlerPhone = ?, 
                        handlerEmail = ?, 
                        isFound = 2 
                        where id=?`;
    db.query(
      sql,
      [
        req.query.date,
        results[0].id,
        results[0].nickname,
        results[0].phone,
        results[0].wechat,
        results[0].qq,
        req.query.id,
      ],
      (err, results) => {
        if (err) return res.cc(err);
        if (results.affectedRows != 1) return res.cc("Modification failed!");
        res.cc("Modified successfully!", 0);
      }
    );
  });
};

// 3.13 状态修改 处理中 -> 待归还
exports.statusProcessingToRevert = (req, res) => {
  const sql =
    "update t_revert set revertDate = null, handlerId = null, handlerNickname = null, handlerPhone = null, handlerWechat = null, handlerQQ = null, isFound = 1 where id=?";
  db.query(sql, req.query.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows != 1) return res.cc("Modification failed!");
    res.cc("Modified successfully!", 0);
  });
};
// 3.14 状态修改 处理中 -> 已归还
exports.statusProcessingToReverted = (req, res) => {
  const sql = "update t_revert set finishDate=?, isFound = 0 where id=?";
  db.query(sql, [req.query.date, req.query.id], (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows != 1) return res.cc("Modification failed!");
    res.cc("Modified successfully!", 0);
  });
};

exports.statusRevertedToRevert = (req, res) => {
  const sql = `update t_revert set revertDate = null, finishDate = null, handlerId = null, handlerNickname = null, handlerPhone = null, handlerWechat = null,
                handlerQQ = null, isFound = 1 where id=?`;
  db.query(sql, req.query.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows != 1) return res.cc("Modification failed!");
    res.cc("Modified successfully!", 0);
  });
};

exports.statusRevertedToProcessing = (req, res) => {
  const sql = `update t_revert set finishDate = null, isFound = 2 where id=?`;
  db.query(sql, req.query.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows != 1) return res.cc("Modification failed!");
    res.cc("Modified successfully!", 0);
  });
};

exports.getKeywordCommentList = (req, res) => {
  const keyword = `'%` + req.query.keyword + `%'`;
  const sql =
    " select * from t_comments where level=1 and comments like" +
    keyword +
    "order by date desc ";
  db.query(sql, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      message: "Find Message Success!",
      data: results,
    });
  });
};

exports.getKeywordReplyList = (req, res) => {
  const keyword = `'%` + req.query.keyword + `%'`;
  const sql =
    " select * from t_comments where level=2 and higherLevelId=? and comments like " +
    keyword;
  db.query(sql, req.query.higherLevelId, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      message: "Find Reply Message Success!",
      data: results,
    });
  });
};

exports.getHistoryList = (req, res) => {
  const sql = "select * from t_adminHistory order by loginDate desc";
  db.query(sql, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      message: "Get success!",
      data: results,
    });
  });
};

exports.updatePS = (req, res) => {
  const sql = "update t_adminHistory set ps=? where id=?";
  db.query(sql, [req.query.ps, req.query.id], (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows != 1) return res.cc("Failed to modify");
    res.send({
      status: 0,
      message: "Modified successfully!",
    });
  });
};

exports.deleteHistory = (req, res) => {
  const sql = "delete from t_adminHistory where id=?";
  db.query(sql, req.query.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows != 1) return res.cc("Deletion failed!");
    res.send({
      status: 0,
      message: "Deleted successfully!",
    });
  });
};

exports.getClaimVerifyList = (req, res) => {
  const sql = "select * from t_claim where isFound=3 order by claimDate asc";
  db.query(sql, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      message: "Get success!",
      data: results,
    });
  });
};

exports.failClaim = (req, res) => {
  const sql =
    "update t_claim set isFound=1, handlerDescribe=null, handlerId=null, handlerNickname=null, handlerPhone=null, handlerWechat=null, handlerQQ=null, ? where id=?";
  db.query(sql, [req.query, req.query.id], (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows != 1) return res.cc("Modification failed!");
    res.cc("Modified successfully!", 0);
  });
};

exports.getRevertVerifyList = (req, res) => {
  const sql = "select * from t_revert where isFound=3 order by revertDate asc";
  db.query(sql, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      message: "Get success!",
      data: results,
    });
  });
};

exports.failRevert = (req, res) => {
  const sql =
    "update t_revert set isFound=1, handlerDescribe=null, handlerId=null, handlerNickname=null, handlerPhone=null, handlerWechat=null, handlerQQ=null, ? where id=?";
  db.query(sql, [req.query, req.query.id], (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows != 1) return res.cc("Modification failed!");
    res.cc("Modified successfully!", 0);
  });
};

exports.addResults = (req, res) => {
  const sql = "insert into t_results set ?";
  db.query(sql, req.query, (err, results) => {
    if (err) return res.cc(err);
    res.cc("Added successfully!", 0);
  });
};
