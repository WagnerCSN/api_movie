const Router = require("express");
const UsersController = require("../controllers/usersController");
const userscontroller = new UsersController();
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const multer = require("multer");
const uploadConfig = require("../configs/upload");
const usersRoutes = Router();
const upload = multer(uploadConfig.Multer);
const UserAvatarController = require("../controllers/userAvatarController");
const userAvatarController = new UserAvatarController();

usersRoutes.post("/", userscontroller.create)
usersRoutes.put("/",ensureAuthenticated, userscontroller.update)
usersRoutes.patch("/avatar",ensureAuthenticated, upload.single("avatar"), userAvatarController.update)

module.exports = usersRoutes;