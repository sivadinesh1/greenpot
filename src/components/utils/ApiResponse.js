import {Response} from '../../modal/Response.model'

class ApiResponse extends Response {
    constructor(status, message,content,statusCode, isOperational = true) {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = isOperational;
      this.content = content;
      this.status = status;
    //   if (stack) {
    //     this.stack = stack;
    //   } else {
    //     Error.captureStackTrace(this, this.constructor);
    //   }
    }
  }
  
  module.exports = ApiResponse;