const Order=require("../Models/orderModels")
const Product=require("../Models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const asyncError=require("../middleware/asyncError");
const { validate } = require("../Models/orderModels");


//create new order
exports.newOrder=asyncError(async(req,res,next)=>{
    const {shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    }=req.body
    const order= await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id
        
    })
    res.status(200).json({
        success:true,
        order
    })
})

//get Single Order
exports.getSingleOrder=asyncError(async(req,res,next)=>{
    const order=await Order.findById(req.params.id).populate("user","name email")
    if(!order){
        return next(new ErrorHandler("Order not found with this id",404))
    }
    res.status(200).json({
        success:true,
        order
    })
})

//get login user order
exports.myOrder=asyncError(async(req,res,next)=>{
    const order=await Order.find({user:req.user._id})
    if(!order){
        return next(new ErrorHandler("Order not found with this id",404))
    }
    res.status(200).json({
        success:true,
        order
    })
})



//get all order--admin
exports.getAllOrder=asyncError(async(req,res,next)=>{
    const order=await Order.find()
    let totalAmount=0
    order.forEach(order=>{
        totalAmount+=order.totalPrice
    })
    
    res.status(200).json({
        success:true,
        order,
        totalAmount
    })
})


//update order status--admin
exports.updateOrder=asyncError(async(req,res,next)=>{
    const order=await Order.findById(req.params.id)
    if(!order){
        return next(new ErrorHandler("Order not found with this id",404))
    }
   if(order.orderStatus==="Delivered"){
    return next(new ErrorHandler("You have already delivered this order",404))
   }
  order.orderItems.forEach(async(order1)=>{
    await updateStock(order1.product,order1.quantity);
  })
    order.orderStatus=req.body.status;
    
    if(req.body.status==="Delivered"){
        order.deliveredAt=Date.now();
    }
    await order.save({validateBeforeSave:false})
    res.status(200).json({
        success:true,
        
    })
})
async function updateStock(id,quantity){
    const product =await Product.findById(id)
    product.stock-=quantity
    await product.save({validateBeforeSave:false})
}

//Delete order--admin
exports.deleteOrder=asyncError(async(req,res,next)=>{
    const order=await Order.findById(req.params.id)
    if(!order){
        return next(new ErrorHandler("Order not found with this id",404))
    }
   await order.deleteOne()
    
    res.status(200).json({
        success:true,
        
    })
})
