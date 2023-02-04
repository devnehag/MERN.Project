const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsynchErrors");
const ApiFeatures = require("../utils/apifeatures");

//Get All Products
exports.getAllProducts = catchAsyncErrors(async (req,res)=>{

    const resultPerPage = 5;
    const productCount = await Product.countDocuments();

    const apiFeature = new ApiFeatures(Product.find(),req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
    const products = await apiFeature.query;
    res.status(200).json({
        success:true,
        products
    });
});
//Get product details
exports.getProductDetails = catchAsyncErrors(async (req,res,next)=>{
    //const product = await Product.findById(mongoose.Types.ObjectId(req.params.id.trim()));
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product not found",404))
    }
    
    res.status(200).json({
        success:true,
        product,
        productCount
    });
});
//Create product- Admin user Only
exports.createProduct = catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.create(req.body);
    res.status(201).json({
        success:true,
        product
    });
});

//Update a Product --Admin

exports.updateProduct = catchAsyncErrors(async (req,res,next)=>{
    let product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product not found",404))
    }
    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(201).json({
        success:true,
        product
    });
});

//Delete product - Admin

exports.deleteProduct = catchAsyncErrors(async (req,res,next)=>{
    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product not found",500))
    }
    await product.remove();
    res.status(200).json({
        success:true,
        message:"Product Deleted Successfully"
    });
});