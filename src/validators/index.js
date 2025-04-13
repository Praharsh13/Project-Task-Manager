import { body } from "express-validator";

const userRegistrationValidation=()=>{
    return[
        body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Email is invalid"),
        body("username")
        .trim()
        .notEmpty().withMessage("Username is required"),
        body("password")
        .trim()
        .notEmpty().withMessage("Password is required")
        .isLength({min:4}).withMessage("Password must be at least of length 4")
        .isLength({max:10}).withMessage("Max length of password is 10")


    ]
}


const userLogin=()=>{
    return[
        body("email")
        .isEmail().withMessage("Invalid email"),
        body("password").notEmpty().withMessage("Password is required")
    ]
}

export {userRegistrationValidation,userLogin}