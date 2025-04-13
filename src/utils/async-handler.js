//To avoid try catch in each case , we use this 

const asyncHandler=(handlerFunction)=>{
    return (req,res,next)=>{
        Promise.resolve(handlerFunction(req,res))
        .catch(function(err){
            next(err)
        })

    }
}

export {asyncHandler}