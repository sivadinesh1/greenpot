
// export class Response {
//    var status,code,content,message;
 
//     constructor(status,code,content,message){
//         this.status=status;
//         this.code=code;
//         this.content=content;
//         this.message=message;
//     }   
//     set setStatus(status){
//         this.status = status;
//     }
//     get getStatus(){
//         return this.status;
//     }
//     set setCode(code){
//         this.code = code;
//     }
//     get getCode(){
//         return this.code;
//     }

//     set setMessage(message){
//         this.message = message;
//     }
//     get getMessage(){
//         return this.message;
//     }
   
//     set setContent(content){
//         this.content = content;
//     }
//     get getContent(){
//         return this.content;
//     }
   



// }

export interface Response {
    status:boolean;
    code:number;
    content:any;
    name: string;
    message: string;
    stack?: string;
}