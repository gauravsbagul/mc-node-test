const Restaurant = require('../models/restaurant');

exports.createRestaurant = async (req,res)=>{
    console.log("🚀 ~ file: restaurant.js ~ line 4 ~ exports.createRestaurant= ~ req", req.userDetails)
    try{
        if(req.userDetails.role == 'VENDOR'){
            if(req.body.restaurantName && req.body.address){
                const restaurant = new Restaurant({
                    restaurantName: req.body.restaurantName,
                    address: req.body.address,
                    createdBy: req.userDetails._id,
                    giftItemOne: req.body.giftItemOne ? req.body.giftItemOne: "",
                    giftItemTwo: req.body.giftItemTwo ? req.body.giftItemTwo : "",
                    giftItemOneCoins: req.body.giftItemOneCoins ? req.body.giftItemOneCoins : -1,
                    giftItemTwoCoins: req.body.giftItemTwoCoins ? req.body.giftItemTwoCoins : -1,
                    coins: 00
                });
                //how to check for previously existing restaurants
                const result = await restaurant.save()
                if(result){
                    res.status(200).json({
                        status:true,
                        message: 'restaurant created successfully!',
                        restaurantId:result._id,
                        result: result,
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
        }else{
            res.json({status:false,message:"oppsss.!!! you cannot create a restaurant, you are not a vendor role"})
        }
    }catch(err){
        console.log(err)
        res.json({status:false,message:"something went wrong",err})
    }
}

exports.getAllRestaurants = async (req,res)=>{
    try{
        const result = await Restaurant.find()
        if(result){
            res.status(200).json({
                status:true,
                message: 'restaurants fetched successfully!',
                result: result,
            });
        }else{
            res.status(500).json({
                status:false,
                message: "something went wrong, db error"
            });
        }
    }catch(err){
        console.log(err)
        res.json({status:false,message:"something went wrong",err})
    }
}

exports.getRestaurantById = async (req,res)=>{
    try{
        if(req.params.restaurantId){
            const result = await Restaurant.findById({_id:req.params.restaurantId})
            if(result){
                res.status(200).json({
                    status:true,
                    message: 'restaurant details are fetched successfully!',
                    result: result,
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

exports.updateRestaurantById = async (req,res)=>{
    try{
        if(req.userDetails.role == 'VENDOR'){
            if(req.params.restaurantId && (req.body && (req.body.restaurantName || req.body.address || req.body.coins))){
                console.log("🚀 ~ file: restaurant.js ~ line 90 ~ exports.updateRestaurantById= ~ req.body", req.body)
                
                const result = await Restaurant.updateOne({_id:req.params.restaurantId,createdBy:req.userDetails._id},req.body);
                console.log("🚀 ~ file: restaurant.js ~ line 93 ~ exports.updateRestaurantById= ~ result", result)
                
                if(result && result.n == 1 && result.nModified == 1){
                    res.status(202).json({
                        status:true,
                        message: 'restaurant details are updated successfully!',
                        result: result,
                    });
                }else{
                    res.status(500).json({
                        status:false,
                        message: "something went wrong, db error, you may b not the owner of this restaurant to update, please check once"
                    });
                }
            }else{
                res.json({status:false,message:"mandatory parameters are missing"})
            }
        }else{
            res.json({status:false,message:"oppsss.!!! you cannot create a restaurant, you are not a vendor role"})
        }
    }catch(err){
        console.log(err)
        res.json({status:false,message:"something went wrong",err})
    }
}

exports.deleteRestaurantById = async (req,res)=>{
    try{
        if(req.userDetails.role == 'VENDOR' ){
            if(req.params.restaurantId){
                const result = await Restaurant.deleteOne({_id:req.params.restaurantId,createdBy:req.userDetails._id})
                const result1 =  await Menu.delete({restaurantId:req.params.restaurantId})
                console.log("🚀 ~ file: restaurant.js ~ line 120 ~ exports.deleteRestaurantById ~ result", result)
                
                if(result && result.n == 1 && result.deletedCount == 1){
                    res.status(200).json({
                        status:true,
                        message: 'restaurant is delete successfully!',
                        result: result,
                    });
                }else{
                    res.status(500).json({
                        status:false,
                        message: "something went wrong, db error, you may not the owner of this restaurant to perform delete operation"
                    });
                }
            }else{
                res.json({status:false,message:"mandatory parameters are missing"})
            }
        }else{
            res.json({status:false,message:"oppsss.!!! you cannot create a restaurant, you are not a vendor role"})
        }
    }catch(err){
        console.log(err)
        res.json({status:false,message:"something went wrong",err})
    }
}