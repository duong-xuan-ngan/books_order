const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Book Schema and Model
const orderSchema = new mongoose.Schema({
    orderDate: { type: Date, required: true, default: Date.now },
    totalAmount: { type: Number, required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'customer', required: true },
    books: [
        {
          bookId: {
            type: mongoose.Schema.Types.ObjectId, ref: 'Books', required: true,
          },
          quantity: {
            type: Number,
            default: 1,
          },
        },
      ]
});

const Order = mongoose.model('Order', orderSchema);


module.exports = Order;