const Product=require("../Models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const asyncError=require("../middleware/asyncError");
const ApiFeature = require("../utils/apiFeatures");
const { query } = require("express");


//creating product ----admin
exports.createProduct=asyncError(async(req,res)=>{
  req.body.user=req.user.id
    const product=await Product.create(req.body);

    res.status(201).json({
        success:true,
        product
    })
})

//get all product
exports.getAllProducts =asyncError( async(req,res)=>{
  const resultPerPage=8;
  const productsCount=await Product.countDocuments()
  const apifeatures=new ApiFeature( Product.find(),req.query)
  .search()
  .filter()
  .pagination(resultPerPage)
    const products=await apifeatures.query;
    res.status(200).json({
        success:true,
        products,
        productsCount,
        resultPerPage
    })
})


//product detail
exports.getProductDetails =asyncError(async(req,res,next)=>{
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found",404));
  }
  res.status(200).json({
    success: true,
   product,
   
  });


})

// update product ----admin
 exports.updateProduct =asyncError(async(req,res,next)=>{
    let product= await Product.findById(req.params.id)
    if (!product) {
      return next(new ErrorHandler("Product not found",404));
    }
    product=await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        success:true,
        product
    })
 })
 //delete product---admin

 exports.deleteProduct =asyncError( async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);
      console.log(product);
  
      if (!product) {
        return next(new ErrorHandler("Product not found",404));
      }
  
      await product.deleteOne();
  
      res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Error deleting product",
      });
    }
  });
  

//create reviwes and update review
exports.reviewsProduct =asyncError( async (req, res, next) => {
  const{rating,comment,productId}=req.body;
  const review={
    user:req.user._id,
    name:req.user.name,
    rating:Number(rating),
    comment
    }
const product= await Product.findById(productId)
const isReviewed=product.reviews.find((rev)=>rev.user.toString()===req.user._id.toString())
if(isReviewed){
product.reviews.forEach((rev) => {
  if(rev.user.toString()===req.user._id.toString())
  rev.rating=rating,
  rev.comment=comment
  
});

}
else{
  product.reviews.push(review)
  product.numOfReviews=product.reviews.length

}

let avg=0
product.ratings=product.reviews.forEach(rev=>{
avg+=rev.rating
})
product.ratings=avg/product.reviews.length

await product.save({validateBeforeSave:false})
res.status(200).json({
  success:true,
  review,


})
})

//get all reviews of product
exports.getProductReviews=asyncError(async(req,res,next)=>{
  const product=await Product.findById(req.query.id)
  if(!product){
    return next (new ErrorHandler("product not found",404))
  }
  res.status(200).json({
    success:true,
    reviews:product.reviews
  })
})

//delete reviews
exports.deleteReviews=asyncError(async(req,res,next)=>{
  const product=await Product.findById(req.query.id)
  if(!product){
    return next (new ErrorHandler("product not found",404))
  }
  const reviews=product.reviews.filter((rev)=> rev._id.toString()!==req.query.id.toString())
  let avg=0
reviews.forEach(rev=>{
avg+=rev.rating
})
const ratings=avg/reviews.length
const numOfReviews=reviews.length
await Product.findByIdAndUpdate(req.query.productId,{
  reviews,
  ratings,
  numOfReviews
},{
  new:true,
  runValidators:true,
  useFindAndModify:false
})
  res.status(200).json({
    success:true,
  })
})