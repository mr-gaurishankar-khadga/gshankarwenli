
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
});

module.exports = mongoose.model('Product', productSchema);







