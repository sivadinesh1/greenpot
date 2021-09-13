export class ApiError extends Error {
	constructor(statusCode, message, isOperational = true, stack = '') {
		super(message);
		this.statusCode = statusCode;
		this.isOperational = isOperational;
		if (stack) {
			this.stack = stack;
		} else {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}

// module.exports = ApiError;

//   export const response = async (status,code,content,message) => {
//     let response={}
//     response["status"]=status;
//     response["code"]=code;
//     response["content"]=content;
//     response["message"]=message;

//     return response;

// }
