const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// customer Schema and Model
const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    facebook_link: { type: String, required: true},
    dormColor: { type: String, required: true },
    roomNumber: { type: Number, required: true }
});

const customer = mongoose.model('customer', customerSchema);


module.exports = customer;