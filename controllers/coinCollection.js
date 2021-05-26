const coinCollection = require('../models/coinCollection');
const dbCoinCollectionServices = require("../dbServices/coinCollection");

exports.giftCoinByRestaurantId = async (req,res)=>{
    var myCoins = parseInt(req.body.myCoins);
    var friendCoins = parseInt(req.body.friendCoins)
    const { orderId,restaurantId,friendsMobileNumber} = req.body

    try{
       if(orderId && restaurantId && friendsMobileNumber && myCoins && friendCoins){
            const my_coin_collection = new coinCollection({
                restaurantId,
                userId: req.userDetails._id, 
                myCoins,
                receivedCoins: 00,
                orderId: [orderId],
                mobileNumber: req.userDetails.mobileNumber
            });
            const friend_coin_collection = new coinCollection({
                restaurantId,
                userId: "", 
                myCoins: 00,
                receivedCoins: friendCoins,
                mobileNumber: friendsMobileNumber
            });

            var myCoinCollectionResult = await coinCollection.findOne({mobileNumber:req.userDetails.mobileNumber});
            
            var friendCoinCollectionResult = await coinCollection.findOne({mobileNumber:friendsMobileNumber});
            
            
            if(!myCoinCollectionResult.orderId.includes(orderId)){
                if(myCoinCollectionResult && friendCoinCollectionResult){
                    const resultUpdMyCoin = await coinCollection.updateOne({restaurantId,mobileNumber:req.userDetails.mobileNumber},{ $push: { orderId },$inc: { myCoins }});

                    const resultUpdFriendCoin = await coinCollection.updateOne({restaurantId,mobileNumber:friendsMobileNumber},{ $inc: { receivedCoins : friendCoins } });
                                    
                    if(resultUpdFriendCoin && resultUpdFriendCoin.n == 1 && resultUpdFriendCoin.nModified == 1 && resultUpdMyCoin && resultUpdMyCoin.n == 1 && resultUpdMyCoin.nModified == 1){
                        res.json({status:'true',friendCoinCollection:resultUpdFriendCoin,myCoinCollection:resultUpdMyCoin})
                    }else{
                        res.json({status:'false',message:"db error while gifting coins"})
                    }
                }else if(myCoinCollectionResult && !friendCoinCollectionResult){
                    var friendCoinSavedObject = await friend_coin_collection.save();

                    const resultUpd = await coinCollection.updateOne({restaurantId,mobileNumber:req.userDetails.mobileNumber},{ $push: { orderId },$inc: { myCoins }});
                                    
                    if(resultUpd && resultUpd.n == 1 && resultUpd.nModified == 1 && friendCoinSavedObject){
                        res.json({status:'true',myCoinCollection:resultUpd,friendCoinCollection:friendCoinSavedObject})
                    }else{
                        res.json({status:'false',message:"db error while gifting coins"})
                    }
                }else if(!myCoinCollectionResult && friendCoinCollectionResult){
                    var myCoinSavedObject = await my_coin_collection.save();

                    const resultUpd = await coinCollection.updateOne({restaurantId,mobileNumber:friendsMobileNumber},{ $inc: { receivedCoins : friendCoins } });
                                    
                    if(resultUpd && resultUpd.n == 1 && resultUpd.nModified == 1 && myCoinSavedObject){
                        res.json({status:'true',myCoinCollection:myCoinSavedObject,CoinCollection:resultUpd})
                    }else{
                        res.json({status:'false',message:"db error while gifting coins"})
                    }
                }else{
                    var myCoinSavedObject = await my_coin_collection.save();
                    var friendCoinSavedObject = await friend_coin_collection.save();

                    if(myCoinSavedObject && friendCoinSavedObject){
                        res.json({status:'true',myCoinCollection:myCoinSavedObject,friendCoinCollection:friendCoinSavedObject})
                    }else{
                        res.json({status:'false',message:"db error while gifting coins"})
                    }
                }
            }else{
                res.json({status:'false',message:'gifting coin for this order id is done previously, please try again with other oderId'})
            }

        }else{
            res.json({status:false,message:"mandatory parameters are missing"})
        }
    }catch(err){
        console.log(err)
        res.json({status:false,message:"something went wrong",err})
    }
}


exports.getMyAllCoinsByRestaurantId = async (req,res)=>{
    try{
        if(req.query.restaurantId){
            const result = await coinCollection.find({restaurantId:req.query.restaurantId,mobileNumber:req.userDetails.mobileNumber})
            if(result){
                res.status(200).json({
                    status:true,
                    message: 'restaurant details are fetched successfully!',
                    result: result,
                    totalCoins: parseInt(result[0].myCoins)+parseInt(result[0].receivedCoins)
                });
            }else{
                res.status(500).json({
                    status:false,
                    message: "something went wrong, db error"
                });
            }
        }else{
            res.json({status:false,message:"mandatory parameters are missing"})
        }
    }catch(err){
        console.log(err)
        res.json({status:false,message:"something went wrong",err})
    }
}
