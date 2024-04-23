import { Router } from "express";
import * as controller from "../controllers/appController.js";
import { registerMail } from "../controllers/mailer.js";
import { authToken, localVariables } from "../middleware/auth.js";

const router = Router();

//post
router.route("/register").post(controller.register);
router.route("/login").post(controller.verifyUser, controller.login);
router.route("/authenticate").post(controller.verifyUser, (req, res) => res.end());
router.route("/registerMail").post(registerMail);

//get
router.route("/users").get(controller.getUsers);
router.route("/user/:id").get(controller.getUser);
router.route("/generateOTP").get(localVariables, controller.generateOTP);
router.route("/verifyOTP").get(controller.verifyOTP);
router.route("/createResetSession").get(controller.createResetSession);

router.route("/getEmailUser/:email").get(controller.getEmailUser);

//put
router.route("/update").put(authToken, controller.updateUser);
router.route("/resetPassword").put(controller.verifyUser, controller.resetPassword);

export default router;
