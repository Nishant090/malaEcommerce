const express =require("express");
const { getAllProducts,createProduct, updateProduct, deleteProduct, getProductDetails,reviewsProduct, getProductReviews, deleteReviews } = require("../Controllers/ProductController");
const { isAuthenticatedUser,authorizeRoles } = require("../middleware/auth");
const router=express.Router();


router.route("/products").get(getAllProducts)
router.route("/product/:id").get(getProductDetails)
router.route("/review").put(isAuthenticatedUser,reviewsProduct)
router.route("/reviews").get(isAuthenticatedUser,getProductReviews).delete(isAuthenticatedUser,deleteReviews)
router.route("/admin/product/new").post(isAuthenticatedUser,authorizeRoles("admin"),createProduct)
router.route("/admin/product/:id").put(isAuthenticatedUser,authorizeRoles("admin"),updateProduct)
router.route("/admin/product/:id").delete(isAuthenticatedUser,authorizeRoles("admin"),deleteProduct)

module.exports = router


