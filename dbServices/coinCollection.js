const CoinCollection = require('../models/coinCollection');

var saveCoinCollection =  async function(obj){
console.log("🚀 ~ file: coinCollection.js ~ line 4 ~ findCoinCollection ~ id", id)
    
    let resulting = await CoinCollection.save(obj)
    if(resulting)
        return resulting;
    else
        return null;
    
}

module.exports = { saveCoinCollection };