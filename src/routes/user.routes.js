import { Router } from "express";
import { forgotPassword, generateAccessToken, getUser, login, logout, registerUser, resendEmailVerification, resetPassword, updateUser, verifyEmail } from "../controllers/auth.controllers.js";
import { userRegistrationValidation, userLogin } from "../validators/index.js";
import { validate } from "../middlewares/validationError.js";
import { upload } from "../middlewares/multermiddleware.js";
import { authUser } from "../middlewares/authmiddleware.js";

const router=Router()

router.route("/register").post(upload.single("avatar"),userRegistrationValidation(),validate,registerUser)
router.route("/verifymail/:id").post(verifyEmail)
router.route("/resendverificationmail").post(resendEmailVerification)
router.route("/login").post(userLogin(),validate,login)
router.route("/logout").post(logout)
router.route("/forgetpassword").post(forgotPassword)
router.route("/resetpassword/:id").post(resetPassword)
router.route("/updateprofile").post(upload.single("avatar"),authUser,updateUser)
router.route("/getuser").get(authUser,getUser)
router.route("/accesstoken").get(generateAccessToken)


export default router;