const UserModel = require("../model/user");
const OverviewModel = require("../model/overview");
const oilDataModel = require("../model/oilData");
const defaultOilDataModel = require("../model/defaultData");
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

  async dashBoardCounts(req, res) {
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
          let activeUsers = await UserModel.countDocuments({ isFrozen: false });
          let allUsers = await UserModel.countDocuments({});
          let staticData = await defaultOilDataModel.countDocuments({});
          let dynamicData = await oilDataModel.countDocuments({
            status: "custom",
          });
          return apiResponse.successResponseWithData(res, "success", [
            allUsers,
            activeUsers,
            dynamicData,
            staticData,
          ]);
        } else {
          return apiResponse.ErrorResponse(res, "Invalid Token");
        }
      }
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },

  async getGeoInfo(req, res) {
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
          UserModel.find(
            {},
            {},
            {
              projection: { lat: 1, lon: 1, firstName: 1, lastName: 1, _id: 0 },
            }
          )
            .then((response) => {
              return apiResponse.successResponseWithData(res, "Success", {
                data: response,
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

  async getOverview(req, res) {
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
          const currentYear = new Date().getFullYear();
          const startOfYear = new Date(currentYear, 0, 1);
          const endOfYear = new Date(currentYear + 1, 0, 1);
          const pipeline = [
            {
              $match: {
                createdAt: {
                  $gte: startOfYear,
                  $lt: endOfYear,
                },
              },
            },
            {
              $group: {
                _id: {
                  month: { $month: "$createdAt" },
                },
                totalAmount: { $sum: "$amount" },
              },
            },
            {
              $sort: {
                "_id.month": 1,
              },
            },
          ];

          const result = await OverviewModel.aggregate(pipeline);
          return apiResponse.successResponse(res, result);
        } else {
          return apiResponse.ErrorResponse(res, "Invalid Token");
        }
      }
    } catch (err) {
      console.log(err);
      return apiResponse.ErrorResponse(res, err);
    }
  },

  async getTotalView(req, res) {
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
          const currentYear = new Date().getFullYear();
          const startOfYear = new Date(currentYear - 1, 0, 1);
          const endOfYear = new Date(currentYear, 0, 1);
          const currentMonth = new Date().getMonth();
          let lastStartMonth, lastEndMonth;
          if (currentMonth < 1) {
            lastStartMonth = new Date(currentYear - 1, 11, 1);
            lastEndMonth = new Date(currentYear, currentMonth, 1);
          } else {
            lastStartMonth = new Date(currentYear, currentMonth - 1, 1);
            lastEndMonth = new Date(currentYear, currentMonth, 1);
          }
          const startMonth = new Date(currentYear, currentMonth, 1);
          const endMonth = new Date(currentYear, currentMonth + 1, 1);
          const lastYearPipe = [
            {
              $match: {
                createdAt: {
                  $gte: startOfYear,
                  $lt: endOfYear,
                },
              },
            },
            {
              $group: {
                _id: null,
                totalAmount: { $sum: "$amount" },
              },
            },
          ];

          const lastMonthPipe = [
            {
              $match: {
                createdAt: {
                  $gte: lastStartMonth,
                  $lt: lastEndMonth,
                },
              },
            },
            {
              $group: {
                _id: null,
                totalAmount: { $sum: "$amount" },
              },
            },
          ];

          const currentMonthPipe = [
            {
              $match: {
                createdAt: {
                  $gte: startMonth,
                  $lt: endMonth,
                },
              },
            },
            {
              $group: {
                _id: null,
                totalAmount: { $sum: "$amount" },
              },
            },
          ];
          let result = [];
          const total = await OverviewModel.aggregate([
            {
              $group: {
                _id: null,
                totalAmount: { $sum: "$amount" },
              },
            },
          ]);
          result.push(total[0]?.totalAmount);
          const lastYearAmount = await OverviewModel.aggregate(lastYearPipe);
          result.push(lastYearAmount[0]?.totalAmount);
          const lastMonthAmount = await OverviewModel.aggregate(lastMonthPipe);
          result.push(lastMonthAmount[0]?.totalAmount);
          const currentMonthAmount = await OverviewModel.aggregate(
            currentMonthPipe
          );
          result.push(currentMonthAmount[0]?.totalAmount);

          return apiResponse.successResponse(res, result);
        } else {
          return apiResponse.ErrorResponse(res, "Invalid Token");
        }
      }
    } catch (err) {
      console.log(err);
      return apiResponse.ErrorResponse(res, err);
    }
  },
};
