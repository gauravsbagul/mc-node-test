const Restaurant = require('../models/restaurant');

exports.uploadRestaurantImage = async (req,res)=>{
    
    if(req.query.restaurantId && req.file){
       
        const resultUpd = await Restaurant.updateOne({_id:req.query.restaurantId},{restaurantTokenImage: req.file.path});
        
        if(resultUpd && resultUpd.n == 1 && resultUpd.nModified == 1){
            res.status(202).json({
                status:true,
                message: 'Restaurant details are found saved previously, and now restaurant details are updated successfully!',
                resultUpd
            });
        }else{
            res.status(500).json({
                status:false,
                resultUpd,
                message: "something went wrong, db error, you may b not the owner of this restaurant to update, please check once"
            });
        } 
    }else{
        res.status(500).json({
            status:false,
            message: "mandatory fields are missing.!"
        });  
    } 
}

exports.createRestaurant = async (req,res)=>{
    console.log("🚀 ~ file: restaurant.js ~ line 4 ~ exports.createRestaurant= ~ req", req.userDetails)
    try{
        if(req.userDetails.role == 'VENDOR'){
            if(req.body.restaurantName && req.body.address && req.body.offers.length){
                const restaurant = new Restaurant({
                    restaurantName: req.body.restaurantName,
                    address: req.body.address,
                    createdBy: req.userDetails._id,
                    offers: req.body.offers,
                    restaurantTokenImage: req.file.path,
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
        res.json({status:false,message:"file provided is not png or jpeg format, or else please check request body parameters; ",err})    }
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
        if(req.query.restaurantId){
            const result = await Restaurant.findById({_id:req.query.restaurantId})
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
            if(req.query.restaurantId){
                if(req.body.offers && req.body.offers.length){
                    res.json({status:false,message:"You cannot update offers field from this api"})
                }else{
                    const result = await Restaurant.updateOne({_id:req.query.restaurantId,createdBy:req.userDetails._id},{ $set:req.body});
                    
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
                }
            }else{
                res.json({status:false,message:"mandatory parameters are missing"})
            }
        }else{
            res.json({status:false,message:"oppsss.!!! you cannot update a restaurant, you are not a vendor role"})
        }
    }catch(err){
        console.log(err)
        res.json({status:false,message:"something went wrong",err})
    }
}

exports.updateOffersByRestaurantId = async (req,res)=>{
    try{
        if(req.userDetails.role == 'VENDOR'){
            if(req.query.restaurantId && req.body.offers && req.body.offers.length){

                const result = await Restaurant.updateOne({_id:req.query.restaurantId,createdBy:req.userDetails._id},{ $push:req.body});
                
                if(result && result.n == 1 && result.nModified == 1){
                    res.status(202).json({
                        status:true,
                        message: 'restaurant offers are updated successfully!',
                        result: result,
                    });
                }else{
                    res.status(500).json({
                        status:false,
                        message: "something went wrong, db error, you may b not the owner of this restaurant to update offers, please check once"
                    });
                }
            }else{
                res.json({status:false,message:"mandatory parameters are missing"})
            }
        }else{
            res.json({status:false,message:"oppsss.!!! you cannot update a restaurant, you are not a vendor role"})
        }
    }catch(err){
        console.log(err)
        res.json({status:false,message:"something went wrong",err})
    }
}

exports.deleteRestaurantById = async (req,res)=>{
    try{
        if(req.userDetails.role == 'VENDOR' ){
            if(req.query.restaurantId){
                const result = await Restaurant.deleteOne({_id:req.query.restaurantId,createdBy:req.userDetails._id})
                // const result1 =  await Restaurant.delete({restaurantId:req.query.restaurantId})
                
                
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