const express =require("express");
const { newOrder, getSingleOrder, myOrder, getAllOrder, updateOrder, deleteOrder } = require("../Controllers/orderController");
const router=express.Router();
const { isAuthenticatedUser,authorizeRoles } = require("../middleware/auth");
const orderModels = require("../Models/orderModels");

router.route("/order/new").post(isAuthenticatedUser,newOrder)
router.route("/order/:id").get(isAuthenticatedUser,getSingleOrder)
router.route("/orders/me").get(isAuthenticatedUser,myOrder)
router.route("/admin/orders").get(isAuthenticatedUser,authorizeRoles("admin"),getAllOrder)
router.route("/admin/orders/:id").put(isAuthenticatedUser,authorizeRoles("admin"),updateOrder)
router.route("/admin/orders/:id").delete(isAuthenticatedUser,authorizeRoles("admin"),deleteOrder)




module.exports = router