const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;

const uniqueValidator = require('mongoose-unique-validator')

const restaurantSchema = new Schema({
  restaurantName: { type: String,required:true }, //ask for phone no and email and createdBy the vendor id should b saved; so that he can only edit and update; same for menus too
  address: { type: String,required:true },
  coins: { type: Number,required:true }, //TODO - coins 00 created_by
  createdBy: { type: Schema.ObjectId, ref: 'User', required: true },
  offers:   [{
    giftItem: {
      type: String, required: true
    },
    coin: {
      type: Number, required: true
    }
  }],
  themeColor: { type: String , default:"#FF2E2E"}, 
  openingTime: { type: String ,default:"9 am"}, 
  closingTime: { type: String ,default:"9 pm"}, 
  discount: { type:String,default:"0.0"},
  restaurantTokenImage: { type: String }
}, { timestamps: true });

restaurantSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Restaurant', restaurantSchema);