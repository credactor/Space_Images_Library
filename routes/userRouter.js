const { Router } = require("express");

const userController = require("../controllers/userController.js");

const { verifyToken } = require("../midllewares/verifyToken.js");

const router = Router();

router.post("/user/register", userController.registerUser);
router.post("/user/login", userController.loginUser);
router.delete("/user/logout", userController.logoutUser);

router.get("/user/auth", verifyToken, userController.verifyAuth);
router.post("/user/like", userController.putLike);

module.exports = router;
