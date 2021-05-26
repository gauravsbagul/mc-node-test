const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator')

const coinsCollectionSchema = new Schema({
  restaurantId: { type: Schema.ObjectId, ref: 'Restaurant', required: true }, // Reference to the associated restaurant.
  userId: { type: String }, 
  myCoins: { type: Number,required:true },
  receivedCoins: { type: Number,required:true },
  orderId: {type: Array, default : []},
  mobileNumber: { type: String, required: true },
}, { timestamps: true });

coinsCollectionSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Coin_Collection', coinsCollectionSchema);