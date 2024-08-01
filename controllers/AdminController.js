const UserModel = require("../model/user");
const { body, validationResult } = require("express-validator");
require("dotenv").config();
//helper file to prepare responses.
const apiResponse = require("../helpers/apiResponse");
const jwt = require("jsonwebtoken");
const _ = require("underscore");
const bcrypt = require("bcrypt");

function checkUserAndGenerateToken(data, req, res) {
  const secret = process.env.JWT_SECRET;
  let userData = {
    id: data._id,
    user: data.email,
  };
  const jwtPayload = userData;
  const jwtData = {
    expiresIn: process.env.JWT_TIMEOUT_DURATION,
  };
  jwt.sign(jwtPayload, secret, jwtData, (err, token) => {
    if (err) {
      return apiResponse.ErrorResponse(res, err);
    } else {
      return apiResponse.successResponseWithData(res, "success", token);
    }
  });
}

function checkTokenValid(token) {
  //Prepare JWT token for authentication
  const secret = process.env.JWT_SECRET;
  //Generated JWT token with Payload and secret.

  const decodedToken = jwt.verify(token, secret);
  const expirationTime = decodedToken.exp;
  const currentTime = Math.floor(Date.now() / 1000); // Convert current time to seconds

  if (expirationTime < currentTime) {
    return false;
  } else {
    return true;
  }
}

module.exports = {
  async adLogin(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(
          res,
          "Validation Error.",
          errors.array()
        );
      } else {
        UserModel.find(
          { email: req.body.email, isAdmin: true, isFrozen: false },
          async (err, data) => {
            if (data.length > 0) {
              bcrypt.compare(
                req.body.password,
                data[0].password,
                function (err, result) {
                  if (result) {
                    checkUserAndGenerateToken(data[0], req, res);
                  } else {
                    return apiResponse.unauthorizedResponse(
                      res,
                      "Username or password is incorrect!"
                    );
                  }
                }
              );
            } else {
              return apiResponse.unauthorizedResponse(
                res,
                "Username or password is incorrect!"
              );
            }
          }
        );
      }
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },

  async getAllUserInfo(req, res) {
    try {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Display sanitized values/errors messages.
        return apiResponse.validationErrorWithData(
          res,
          "Validation Error.",
          errors.array()
        );
      } else {
        //hash input password
        if (checkTokenValid(req.body.token)) {
          let pageIndex = req.body.page;
          let pageSize = req.body.rowsPerPage;
          let skipDocuments = pageIndex * pageSize;
          let totalCount = await UserModel.countDocuments({});
          UserModel.find({})
            .skip(skipDocuments)
            .limit(pageSize)
            .then((response) => {
              return apiResponse.successResponseWithData(res, "Success", {
                data: response,
                totalCount: totalCount,
              });
            })
            .catch((err) => {
              console.log(err);
              return apiResponse.ErrorResponse(res, "UserInfo Get Failed");
            });
        } else {
          return apiResponse.ErrorResponse(res, "Invalid Token");
        }
      }
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },

  async changeUserRole(req, res) {
    try {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Display sanitized values/errors messages.
        return apiResponse.validationErrorWithData(
          res,
          "Validation Error.",
          errors.array()
        );
      } else {
        //hash input password
        if (checkTokenValid(req.body.token)) {
          UserModel.findByIdAndUpdate(req.body.id, [
            { $set: { isAdmin: { $eq: [false, "$isAdmin"] } } },
          ])
            .then((data) => {
              console.log(data);
              return apiResponse.successResponse(res, "success");
            })
            .catch((e) => {
              return apiResponse.ErrorResponse(res, "err");
            });
        } else {
          return apiResponse.ErrorResponse(res, "Invalid Token");
        }
      }
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },

  async changeBlockStatus(req, res) {
    try {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Display sanitized values/errors messages.
        return apiResponse.validationErrorWithData(
          res,
          "Validation Error.",
          errors.array()
        );
      } else {
        //hash input password
        if (checkTokenValid(req.body.token)) {
          UserModel.findByIdAndUpdate(req.body.id, [
            { $set: { isFrozen: { $eq: [false, "$isFrozen"] } } },
          ])
            .then((data) => {
              console.log(data);
              return apiResponse.successResponse(res, "success");
            })
            .catch((e) => {
              return apiResponse.ErrorResponse(res, "err");
            });
        } else {
          return apiResponse.ErrorResponse(res, "Invalid Token");
        }
      }
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },

  async changeSubStatus(req, res) {
    try {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Display sanitized values/errors messages.
        return apiResponse.validationErrorWithData(
          res,
          "Validation Error.",
          errors.array()
        );
      } else {
        //hash input password
        if (checkTokenValid(req.body.token)) {
          UserModel.findByIdAndUpdate(req.body.id, [
            { $set: { isSubscribed: { $eq: [false, "$isSubscribed"] } } },
          ])
            .then((data) => {
              console.log(data);
              return apiResponse.successResponse(res, "success");
            })
            .catch((e) => {
              return apiResponse.ErrorResponse(res, "err");
            });
        } else {
          return apiResponse.ErrorResponse(res, "Invalid Token");
        }
      }
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },

};
