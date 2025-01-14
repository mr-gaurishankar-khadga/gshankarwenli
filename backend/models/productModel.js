
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
  weight:{
    type:Number,required:true
  },
  hsn_code:{
    type:String,required:true
  },
  brand_name:{
    type:String,required:true
  },






  //second
  dimensions:{
    length:{
      type:Number,required:true
    },
    width:{
      type:Number,required:true
    },
    height:{
      type:Number,required:true
    },
    unit:{
      type:String,default:'cm',
      enum:['cm','inch']
    }
  },



  //third
  inventory:{
    stock_quantity:{
      type:Number,required:true
    },
    low_stock_threshold: {
      type: Number,
      default: 10,
    },
    manage_inventory: {
      type: Boolean,
      default: true
    }
  },


  //fourth
  shipping_details: {
    is_returnable: {
      type: Boolean,
      default: false
    },  
    package_dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: {
        type: String,
        default: 'cm',
        enum: ['cm', 'inch']
      }
    },
    shipping_mode: {
      type: String,
      required: [true, 'Shipping mode is required'],
      enum: ['Standard', 'Express']
    },
    origin_pincode: {
      type: String,
      required: [true, 'Origin pincode is required'],
      trim: true
    },
    pickup_location: String
  },



  tax_details: {
    gst_percentage: {
      type: Number,
      required: [true, 'GST percentage is required'],
      min: 0,
      max: 100
    },
    hsn_code: String
  },


  status: {
    type: String,
    enum: ['active', 'inactive', 'draft'],
    default: 'draft'
  }

});

module.exports = mongoose.model('Product', productSchema);







