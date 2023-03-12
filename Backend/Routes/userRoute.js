const express=require("express")
const { registerUser, loginUser, Logout, forgotPassword, resetPassword, getUserDetails, updateUserPassword, updateUserProfile, getUsers, getSingleUser, updateUserRole, DeleteUser } = require("../Controllers/userController")
const { isAuthenticatedUser,authorizeRoles } = require("../middleware/auth");
const router=express.Router()


router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/password/forgot").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword)
router.route("/logout").get(Logout)
router.route("/me").get(isAuthenticatedUser,getUserDetails)
router.route("/password/update").put(isAuthenticatedUser,updateUserPassword)
router.route("/me/update").put(isAuthenticatedUser,updateUserProfile)
router.route("/admin/users").get(isAuthenticatedUser,authorizeRoles("admin"),getUsers)
router.route("/admin/user/:id").get(isAuthenticatedUser,authorizeRoles("admin"),getSingleUser)
router.route("/admin/user/:id").put(isAuthenticatedUser,authorizeRoles("admin"),updateUserRole)
router.route("/admin/user/:id").delete(isAuthenticatedUser,authorizeRoles("admin"),DeleteUser)







module.exports=router