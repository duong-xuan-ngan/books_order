const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = new mongoose.Schema({
  OrderItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Orders', required: true },
  totalprice: { type: Number, required: true}
});

const Cart = mongoose.model('Cart', CartSchema);



module.exports = Cart;