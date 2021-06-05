const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator')

const menuSchema = new Schema({
  restaurantId: { type: Schema.ObjectId, ref: 'Restaurant', required: true }, // Reference to the associated restaurant.
  menuItem: { type: String,required:true }, 
  price: { type: Number,required:true },
  menuItemImageName: { type: String},
  menuItemImage: { type: String},  
  pointsValue: { type: Number,required:true }
}, { timestamps: true }); //how to check duplicate and vendor add

menuSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Menu', menuSchema);