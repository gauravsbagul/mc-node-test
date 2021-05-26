/** @format */

const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then((res) => {
        console.log('DB connection Success')

    })
    .catch((err) => {
        console.log('DB connection Failed')
    })

module.exports = {
    mongoose
};