// import { HttpStatusClasses, HttpStatusExtra } from "http-status";

// var codeDescriptions: codeDescriptions.Test;

// namespace codeDescriptions {
    
//     export interface Test {
//         readonly [key:string]: string | number | HttpStatusClasses | HttpStatusExtra;
        
//          '100': string;
//          '100_NAME': string;
//          '100_MESSAGE': string;
//          '100_CLASS': string;
//          'CONTINUE': number;
//     }
// }

enum codeDescriptions{
    SUCCESS=200,
    INTERNAL_SERVER_ERROR=500
    // SUCCESS={code:200,message:"success"},
}
export default codeDescriptions;