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
  product: { type: Object, required: true },
  quantity: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  price: { type: Number, required: true },
  cardNumber: String,
  expiryDate: String,
  cvv: String,
  address: { type: String, required: true },
  email: { type: String, required: true },
  name:{ type: String, required: true },
  phone:{ type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);