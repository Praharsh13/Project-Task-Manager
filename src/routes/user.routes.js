import { Router } from "express";
import { registerUser } from "../controllers/auth.controllers.js";
import { userRegistrationValidation } from "../validators/index.js";
import { validate } from "../middlewares/validationError.js";
import { upload } from "../middlewares/multermiddleware.js";

const router=Router()

router.route("/register").post(upload.single("avatar"),userRegistrationValidation(),validate,registerUser)


export default router;