const db = require("../db/index");

const multiparty = require("multiparty");

const fs = require("fs");

exports.getUserInfo = (req, res) => {
  // Define the SQL statement to query user information (based on the user's id, query the user's basic information)
  const sql = "select * from t_users where id=?";
  // Call db.query() to execute the SQL statement
  db.query(sql, req.user.id, (err, results) => {
    // SQL statement execution failed
    if (err) return res.cc(err);
    // SQL statement executed successfully, but the query result may be empty
    if (results.length !== 1)
      return res.cc("Failed to get user basic information!");
    // User information obtained successfully
    res.send({
      status: 0,
      message: "Successfully obtained user basic information!",
      data: results[0],
    });
  });
};

exports.updateUserInfo = (req, res) => {
  // Check if the phone is occupied
  const sql = "select * from t_users where phone=? and id!=?";
  db.query(sql, [req.query.phone, req.user.id], (err, results) => {
    // SQL statement execution failed
    if (err) return res.cc(err);
    // If the returned result is greater than or equal to 1, it means the phone number has been occupied
    if (results.length >= 1) return res.cc("This phone number has been used!");
    // Update user information
    const sql = "update t_users set ? where id=?";
    db.query(sql, [req.query, req.user.id], (err, results) => {
      // SQL statement execution failed
      if (err) return res.cc(err);
      // SQL statement executed successfully, but the affected result is not 1
      if (results.affectedRows !== 1)
        return res.cc("Failed to modify basic user information!");
      return res.cc("User information modified successfully!", 0);
    });
  });
  // Define the SQL statement to modify user information (based on the user's id, modify the user's basic information)
};

exports.updatePassword = (req, res) => {
  if (!req.query.oldPwd || !req.query.newPwd)
    return res.cc("Password cannot be empty!");
  if (req.query.oldPwd == req.query.newPwd)
    return res.cc("New and old passwords cannot be the same!");
  // Query if the user exists based on id
  const sql = "select * from t_users where id=?";
  db.query(sql, req.user.id, (err, results) => {
    // SQL statement execution failed
    if (err) return res.cc(err);
    // Check if the user with the specified id exists
    if (results.length !== 1) return res.cc("User does not exist!");
    // Check if the submitted old password is correct
    if (results[0].password !== req.query.oldPwd)
      return res.cc("Old password is incorrect!");
    // Modify user password
    const updateSql = "update t_users set password=? where id=?";
    db.query(updateSql, [req.query.newPwd, req.user.id], (err, results) => {
      // SQL statement execution failed
      if (err) return res.cc(err);
      // SQL statement executed successfully, but the affected result is not 1
      if (results.affectedRows !== 1)
        return res.cc("Failed to modify user password!");
      // Modification successful
      res.cc("User password modified successfully!", 0);
    });
  });
};

exports.uploadAvatar = (req, res) => {
  let form = new multiparty.Form();
  form.uploadDir = "../public/user_pic"; // Image storage address
  form.parse(req, function (err, fields, files) {
    try {
      // The file is files.file[0]
      let upfile = files.file[0];
      // Name the file, modify the path in upfile, otherwise a random file name will be generated
      let newpath = form.uploadDir + "/" + upfile.originalFilename; // File name
      // Rename
      fs.renameSync(upfile.path, newpath);
      // Return information, ((upfile.size)/1048576).toFixed(2) converts the file from B to M and rounds up to two decimal places

      res.send({
        status: 0,
        message: "Image uploaded successfully!",
        file_name: upfile.originalFilename,
      });
    } catch {
      res.cc("Image upload failed!" + err);
    }
  });
};

exports.updateAvatar = (req, res) => {
  const sqlStr = " update t_users set ? where id= ? ";
  db.query(sqlStr, [req.query, req.user.id], (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1)
      return res.cc("Failed to update user avatar information!");
    return res.cc("User avatar information updated successfully!", 0);
  });
};
exports.getPswProtect = (req, res) => {
  const sqlStr = " select * from t_protect where uid = ? ";
  db.query(sqlStr, req.user.id, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      data: results,
    });
  });
};

exports.updatePswProtect = (req, res) => {
  const sqlStr = " select * from t_protect where uid= ? ";
  db.query(sqlStr, req.user.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.length < 1) {
      const sqlStr = " insert into t_protect set uid=?, username=?, ? ";
      db.query(
        sqlStr,
        [req.user.id, req.user.username, req.query],
        (err, results) => {
          if (err) return res.cc(err);
          if (results.affectedRows !== 1)
            return res.cc("Failed to create security information!");
          res.cc("Security information created successfully!", 0);
        }
      );
    } else {
      const sqlStr = " update t_protect set ? where uid = ? ";
      db.query(sqlStr, [req.query, req.user.id], (err, results) => {
        if (err) return res.cc(err);
        if (results.affectedRows !== 1)
          return res.cc("Failed to update security information!");
        res.cc("Security information updated successfully!", 0);
      });
    }
  });
};

exports.deletePswProtect = (req, res) => {
  const sqlStr = ` update t_protect set 
                    question_1=null, answer_1=null, 
                    question_2=null, answer_2=null, 
                    question_3=null, answer_3=null,
                    lastEditDate=?  where uid = ? `;
  db.query(sqlStr, [req.query.lastEditDate, req.user.id], (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1)
      return res.cc("Failed to clear security information!");
    res.cc("Security information cleared successfully!", 0);
  });
};

exports.getUserClaim = (req, res) => {
  const sqlStr = " select * from t_claim where initiatorId=? ";
  db.query(sqlStr, req.user.id, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      message: "Successfully obtained user claim information!",
      data: results,
    });
  });
};

exports.addClaim = (req, res) => {
  const sqlStr = " insert into t_claim set ? ";
  db.query(sqlStr, req.query, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1)
      res.cc("Failed to publish claim information, please try again later!");
    res.cc("Claim information published successfully!", 0);
  });
};

exports.uploadClaimPic = (req, res) => {
  let form = new multiparty.Form();
  form.uploadDir = "../public/claim_pic";
  form.parse(req, function (err, fields, files) {
    try {
      let upfile = files.file[0];

      let newpath = form.uploadDir + "/" + upfile.originalFilename;

      fs.renameSync(upfile.path, newpath);

      res.send({
        status: 0,
        message: "Image uploaded successfully!",
        file_name: upfile.originalFilename,
      });
    } catch {
      res.cc("Image upload failed!" + err);
    }
  });
};

exports.handleClaim = (req, res) => {
  const sqlStr = " update t_claim set ? , isFound=3 where id=? ";
  db.query(sqlStr, [req.query, req.query.id], (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1)
      res.cc("Claim application failed, please try again later!");
    res.cc("Claim application successful!", 0);
  });
};

//Modify a claim information handler
exports.editClaim = (req, res) => {
  const sqlStr = " update t_claim set ? where id=? ";
  db.query(sqlStr, [req.query, req.query.id], (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1)
      res.cc("Failed to modify information, please try again later!");
    res.cc("Information modified successfully!", 0);
  });
};

// Delete a claim information
exports.deleteClaim = (req, res) => {
  const sqlStr = " delete from t_claim where id=? ";
  db.query(sqlStr, req.query.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1)
      res.cc("Failed to delete information, please try again later!");
    res.cc("Information deleted successfully!", 0);
    return;
  });
};

//  Delete a claim information picture
exports.deleteClaimPic = (req, res) => {
  const sql = "select * from t_claim where article_pic=? and id!=?";
  db.query(sql, [req.query.article_pic, req.query.id], (err, results) => {
    if (err) return res.cc(err);
    if (results.length > 0)
      res.cc("Image resource occupied, deletion not executed");
    if ((results.length = 0)) {
      const path = "../public/claim_pic/" + req.query.article_pic;
      fs.unlink(path, (err) => {
        if (err) res.cc(err);
      });
    }
  });
};
exports.getUserRevert = (req, res) => {
  const sqlStr = " select * from t_revert where initiatorId=? ";
  db.query(sqlStr, req.user.id, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      message: "Successfully obtained user claim information!",
      data: results,
    });
  });
};

exports.addRevert = (req, res) => {
  const sqlStr = " insert into t_revert set ? ";
  db.query(sqlStr, req.query, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1)
      res.cc("Failed to publish claim information, please try again later!");
    res.cc("Claim information published successfully!", 0);
  });
};

exports.uploadRevertPic = (req, res) => {
  let form = new multiparty.Form();
  form.uploadDir = "../public/revert_pic";
  form.parse(req, function (err, fields, files) {
    try {
      let upfile = files.file[0];

      let newpath = form.uploadDir + "/" + upfile.originalFilename;

      fs.renameSync(upfile.path, newpath);

      res.send({
        status: 0,
        message: "Image uploaded successfully!",
        file_name: upfile.originalFilename,
      });
    } catch {
      res.cc("Image upload failed!" + err);
    }
  });

  // Handler function to return a lost item
  exports.handleRevert = (req, res) => {
    const sqlStr = " update t_revert set ? , isFound=3 where id=? ";
    db.query(sqlStr, [req.query, req.query.id], (err, results) => {
      if (err) return res.cc(err);
      if (results.affectedRows !== 1)
        res.cc("Return application failed, please try again later!");
      res.cc("Return application successful!", 0);
    });
  };

  exports.editRevert = (req, res) => {
    const sqlStr = " update t_revert set ? where id=? ";
    db.query(sqlStr, [req.query, req.query.id], (err, results) => {
      if (err) return res.cc(err);
      if (results.affectedRows !== 1)
        res.cc("Failed to modify information, please try again later!");
      res.cc("Information modified successfully!", 0);
    });
  };

  exports.deleteRevert = (req, res) => {
    const sqlStr = " delete from t_revert where id=? ";
    db.query(sqlStr, req.query.id, (err, results) => {
      if (err) return res.cc(err);
      if (results.affectedRows !== 1)
        res.cc("Failed to delete information, please try again later!");
      res.cc("Information deleted successfully!", 0);
    });
  };

  exports.deleteRevertPic = (req, res) => {
    const sql = "select * from t_revert where article_pic=? and id!=?";
    db.query(sql, [req.query.article_pic, req.query.id], (err, results) => {
      if (err) return res.cc(err);
      if (results.length > 0)
        res.cc("Image resource occupied, deletion not executed");
      if ((results.length = 0)) {
        const path = "../public/revert_pic/" + req.query.article_pic;
        fs.unlink(path, (err) => {
          if (err) res.cc(err);
        });
      }
    });
  };

  exports.getUserHandleClaim = (req, res) => {
    const sqlStr = " select * from t_claim where handlerId=? ";
    db.query(sqlStr, req.user.id, (err, results) => {
      if (err) return res.cc(err);
      res.send({
        status: 0,
        message: "Successfully obtained user claim information!",
        data: results,
      });
    });
  };

  exports.cancelHandleClaim = (req, res) => {
    const sqlStr =
      " update t_claim set isFound = 1, handlerId = null, handlerPhone = null, handlerWechat = null, handlerQQ = null where id=? ";
    db.query(sqlStr, req.query.id, (err, results) => {
      if (err) return res.cc(err);
      if (results.affectedRows !== 1)
        res.cc("Failed to cancel claim, please try again later!");
      res.cc("Claim cancelled successfully!", 0);
    });
  };

  exports.getUserHandleRevert = (req, res) => {
    const sqlStr = " select * from t_revert where handlerId=? ";
    db.query(sqlStr, req.user.id, (err, results) => {
      if (err) return res.cc(err);
      res.send({
        status: 0,
        message: "Successfully obtained user return information!",
        data: results,
      });
    });
  };

  exports.cancelHandleRevert = (req, res) => {
    const sqlStr =
      " update t_revert set isFound = 1, handlerId = null, handlerPhone = null, handlerWechat = null, handlerQQ = null where id=? ";
    db.query(sqlStr, req.query.id, (err, results) => {
      if (err) return res.cc(err);
      if (results.affectedRows !== 1)
        res.cc("Failed to modify information, please try again later!");
      res.cc("Information modified successfully!", 0);
    });
  };

  exports.publishComment = (req, res) => {
    const sqlStr = " insert into t_comments set ? ";
    db.query(sqlStr, req.query, (err, results) => {
      if (err) return res.cc(err);
      if (results.affectedRows !== 1)
        res.cc("Failed to publish comment, please try again later!");
      res.cc("Comment published successfully!", 0);
    });
  };

  exports.deleteComment = (req, res) => {
    const sqlStr = " delete from t_comments where id=? or higherLevelId=? ";
    db.query(
      sqlStr,
      [req.query.id, req.query.higherLevelId],
      (err, results) => {
        if (err) return res.cc(err);
        if (results.affectedRows < 1)
          res.cc("Failed to delete comment, please try again later!");
        res.cc("Comment deleted successfully!", 0);
      }
    );
  };

  exports.publishCommentsReply = (req, res) => {
    const sqlStr = " insert into t_comments set ? ";
    db.query(sqlStr, req.query, (err, results) => {
      if (err) return res.cc(err);
      if (results.affectedRows !== 1)
        res.cc("Failed to reply to the comment, please try again later!");
      res.cc("Successfully replied to the comment!", 0);
    });
  };

  exports.deleteReply = (req, res) => {
    const sqlStr = " update t_comments set reply=reply-1 where id=? ";
    db.query(sqlStr, req.query.id, (err, results) => {
      if (err) return res.cc(err);
      if (results.affectedRows < 1)
        res.cc("Failed to delete the comment, please try again later!");
      res.cc("Successfully deleted the comment!", 0);
    });
  };

  exports.getUserClaimTask = (req, res) => {
    const sqlStr = " select * from t_claim where handlerId=? and isFound!=0";
    db.query(sqlStr, req.user.id, (err, results) => {
      if (err) return res.cc(err);
      res.send({
        status: 0,
        message: "Get success!",
        data: results,
      });
    });
  };

  exports.getUserRevertTask = (req, res) => {
    const sqlStr = " select * from t_revert where handlerId=? and isFound!=0";
    db.query(sqlStr, req.user.id, (err, results) => {
      if (err) return res.cc(err);
      res.send({
        status: 0,
        message: "Get success!",
        data: results,
      });
    });
  };

  exports.getUserClaimNotice = (req, res) => {
    const sqlStr =
      ' select * from t_results where huid=? and claimId != "" and  isNotice=0 ';
    db.query(sqlStr, req.user.id, (err, results) => {
      if (err) return res.cc(err);
      res.send({
        status: 0,
        message: "Get success!",
        data: results,
      });
    });
  };

  exports.getUserRevertNotice = (req, res) => {
    const sqlStr =
      ' select * from t_results where huid=? and revertId != "" and isNotice=0 ';
    db.query(sqlStr, req.user.id, (err, results) => {
      if (err) return res.cc(err);
      res.send({
        status: 0,
        message: "Get success!",
        data: results,
      });
    });
  };

  exports.updateNotice = (req, res) => {
    const sqlStr = " update t_results set isNotice = 1 where id = ? ";
    db.query(sqlStr, req.query.id, (err, results) => {
      if (err) return res.cc(err);
      res.send({
        status: 0,
        message: "Modified successfully!",
      });
    });
  };
};
