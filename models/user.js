const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new Schema({
  userName: { type: String }, //starting take mobile_no_role as username
  displayName: { type: String },
  otp: { type: Number },
  mobileNumber: { type: String, required: true },
  jwtToken: { type: String},
  role: { type: String, required: true,enum: ['CUSTOMER', 'VENDOR'] },
  isLogin: { type: Boolean, required: true}
}, { timestamps: true });

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);