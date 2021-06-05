const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const authorize = require('../middleware/check-auth').Authenticate;

// router.post("/signup",authorize, userController.createUser); //authorize can be used to check header token

router.post("/generateOTP", userController.generateOTP);

router.post("/verifyOTP", userController.verifyOTP);

router.put("/updateFCMToken", authorize, userController.updateFCMToken);

router.post("/logOut", userController.logOut);

module.exports = router;