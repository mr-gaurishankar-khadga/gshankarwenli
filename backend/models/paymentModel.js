// models/paymentModel.js
// const mongoose = require('mongoose');

// const paymentSchema = new mongoose.Schema({
//   product: String,
//   quantity: Number,
//   paymentMethod: String,
//   price: Number,
//   cardNumber: String,
//   expiryDate: String,
//   mobileNumber: String,
//   address: String,
//   cvv: String,
// });

// module.exports = mongoose.model('Payment', paymentSchema);




// models/paymentModel.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({

  product: { type: Object },

  quantity: { type: Number},

  paymentMethod: { type: String },

  price: { type: Number},

  cardNumber: { type:String },

  expiryDate: { type:String },

  cvv: { type:String },

  address: { type: String },
  secAddress: { type: String },
  pincode: { type: String },
  buiding:{ type:String },

  email: { type: String},

  name:{ type: String},

  phone:{ type: Number},


  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);