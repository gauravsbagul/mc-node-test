const Menu = require('../models/menu');

var findMenu =  async function(obj){
console.log("🚀 ~ file: menu.js ~ line 4 ~ findMenu ~ id")
    
    return resulting = await Menu.findOne(obj)
    // if(resulting)
        // return resulting || null;
    // else
    //     return null;
    
}

module.exports = { findMenu };