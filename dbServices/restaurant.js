const Restaurant = require('../models/restaurant');

var findRestaurant =  async function(id){
console.log("🚀 ~ file: restaurant.js ~ line 4 ~ findRestaurant ~ id", id)
    
    let resulting = await Restaurant.findOne({_id:id})
    if(resulting)
        return resulting;
    else
        return null;
    
}

module.exports = { findRestaurant };