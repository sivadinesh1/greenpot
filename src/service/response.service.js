export const response = async (status,code,content,message) => {
    let response={}
    response["status"]=status;
    response["code"]=code;
    response["content"]=content;
    response["message"]=message;

    return response;

}