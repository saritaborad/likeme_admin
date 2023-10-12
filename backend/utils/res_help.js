exports.giveresponse = function (res, status_code, success, message, data = null) {
 var data = data == null ? {} : data;
 var json_to_send = { status: status_code, success: success, message: message, data: data };
 return res.status(status_code).json(json_to_send);
};

exports.asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
