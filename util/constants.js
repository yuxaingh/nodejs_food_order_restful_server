const constants = {};
constants.AUTHORIZATION_ERROR_RESPONSE = {
    error: "Authorization token is not valid or expired",
    statusCode: 401
};

constants.BAD_REQUEST_RESPONSE = {
    error: "Bad request",
    statusCode: 400
}

constants.LOGIN_ERROR_RESPONSE = {
    error: "Email or password is incorrect.",
    statusCode: 400
}

constants.DATA_NOT_FOUND_RESPONSE = {
    error: "Data not found",
    statusCode: 404
}

constants.INVALID_EMAIL_RESPONSE = {
    error: "Email has been registered",
    statusCode: 400
}

module.exports = constants;