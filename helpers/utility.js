const apiResponse = require("../helpers/apiResponse");
require("dotenv").config();

exports.checkUserAndGenerateToken = function (data, req, res) {
	const secret = process.env.JWT_SECRET;
	let userData = {
		id: data._id,
		user: data.username,
	}
	const jwtPayload = userData;
	const jwtData = {
		expiresIn: process.env.JWT_TIMEOUT_DURATION,
	  };
	jwt.sign(jwtPayload, secret, jwtData, (err, token) => {
	  if (err) {
		return apiResponse.ErrorResponse(res, err);
	  } else {
		return apiResponse.successResponse(res, 'Login Successfully.', token);
	  }
	});
  }