
//tHIS IS MAKING CLASS TO LOG ERRORS WITH GOOD FORMAT
class ApiErrors extends Error{

    constructor(
        statusCode,
        message="Something went wrong",
        errors=[],
        stack=""
    ){
        super(message)
        this.statusCode=statusCode;
        this.message=message;
        this.errors=errors;
        this.success=false;

        if(stack){
            this.stack=stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }

    }

}

export default ApiErrors