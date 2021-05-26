const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator')

const restaurantSchema = new Schema({
  restaurantName: { type: String,required:true }, //ask for phone no and email and createdBy the vendor id should b saved; so that he can only edit and update; same for menus too
  address: { type: String,required:true },
  coins: { type: Number,required:true }, //TODO - coins 00 created_by
  giftItemOne: { type:String},
  giftItemTwo: { type:String},
  giftItemOneCoins: { type: Number},
  giftItemTwoCoins: { type: Number},
  createdBy: { type: Schema.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

restaurantSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Restaurant', restaurantSchema);