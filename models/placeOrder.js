const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator')

const placeOrderSchema = new Schema({
  restaurantId: { type: Schema.ObjectId, ref: 'Restaurant', required: true }, // Reference to the associated restaurant.
  order: [{
    menuId: {
      type: Schema.ObjectId, ref: 'Menu', required: true
    },
    quantity: {
      type: Number, required: true
    }
  }],
  orderStatus: { type: String,required:true },
  paymentStatus: { type: String,required:true },
  orderAmount: { type: Number,required:true },
  orderSummary: [{
    menuItem: {
      type: String, required: true
    },
    price: {
      type: Number, required: true
    },
    quantity: {
      type: Number, required: true
    }
  }],
  userId: { type: Schema.ObjectId, ref: 'User', required: true },
  orderPickupTime: { type: Number,required:true }
}, { timestamps: true });

placeOrderSchema.plugin(uniqueValidator);

module.exports = mongoose.model('PlaceOrder', placeOrderSchema);