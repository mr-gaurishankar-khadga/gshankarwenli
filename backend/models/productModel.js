
// models/productModel.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: String,
  categories: String,
  description: String,

  minitext1: String,
  minitext2: String,
  minitext3: String,
  minitext4: String,
  minitext5: String,
  minitext6: String,

  price: Number,
  sizes: [String],
  colors: [String],
  quantity: Number,
  discount: Number,
  frontImage: String,
  backImage: String,
  extraImage1: String,
  extraImage2: String,

  
  //first done
  sku:{
    type:String,required:true
  },
  weight1:{
    type:Number,required:true
  },
  hsn_code:{
    type:String,required:true
  },
  brand_name:{
    type:String,required:true
  },






  //second
  length:{
    type:Number,required:true
  },
  width2:{
    type:Number,required:true
  },
  height:{
    type:Number,required:true
  },
  unit:{
    type:String,require:true,
  },



  //third
    stock_quantity:{
      type:Number,required:true
    },
    low_stock_threshold: {
      type: Number,
      default: 10,
    },



  //fourth shipping information
    package_dimensionslength: {
      package_dimensionslength: Number,
    },

    package_dimensionsheight: {
      package_dimensionsheight: Number,
    },

    package_dimensionswidth: {
      package_dimensionswidth: Number,
    },

    shipping_mode: {
      type: String,
    },


    origin_pincode: {
      type: String,
    },

    pickup_location:{
      pickup_location: String
    },


  // tax detail
    gst_percentage: {
      type: Number,
    },

    status: {
      type: String,
    }
});

module.exports = mongoose.model('Product', productSchema);
