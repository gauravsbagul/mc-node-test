const Menu = require('../models/menu');
const dbRestaurantServices = require("../dbServices/restaurant");
const dbMenuServices = require("../dbServices/menu");

exports.createMenuByRestaurantId = async (req,res)=>{
    console.log("🚀 ~ file: menu.js ~ line 4 ~ exports.createMenu= ~ req", req.userDetails)
    try{
        if(req.userDetails.role == 'VENDOR'){
            if(req.params.restaurantId && req.body.menuItem && req.body.price && req.body.pointsValue){
                var result = await dbRestaurantServices.findRestaurant(req.params.restaurantId)
                    if(result){
                        if(result.createdBy.toString() == req.userDetails._id.toString()){
                            var menuResult = await dbMenuServices.findMenu({menuItem: req.body.menuItem,price: req.body.price,restaurantId: req.params.restaurantId})

                            if(menuResult){
                                const resultUpd = await Menu.updateOne({_id:menuResult._id,createdBy:req.userDetails._id},req.body);
                                
                                if(resultUpd && resultUpd.n == 1 && resultUpd.nModified == 1){
                                    res.status(202).json({
                                        status:true,
                                        message: 'Menu details are found saved previously, and now menu details are updated successfully!',
                                        resultUpd
                                    });
                                }else{
                                    res.status(500).json({
                                        status:false,
                                        message: "something went wrong, db error, you may b not the owner of this restaurant to update, please check once"
                                    });
                                }  
                            }else{
                                const menu = new Menu({
                                    restaurantId: req.params.restaurantId,
                                    menuItem: req.body.menuItem,
                                    price: req.body.price,
                                    pointsValue: req.body.pointsValue
                                });
                                const result = await menu.save()
                                if(result){
                                    res.status(200).json({
                                        status:true,
                                        message: 'menu created successfully!',
                                        menuId:result._id,
                                        result
                                    });
                                }else{
                                    res.status(500).json({
                                        status:false,
                                        message: "something went wrong, db error"
                                    });
                                }
                            }
                        }else{
                            res.status(500).json({
                                status:false,
                                message: "something went wrong, db error, you may not the owner of this restaurant to perform menu creation operation"
                            });
                        }
                    }else{
                        res.status(500).json({
                            status:false,
                            message: "something went wrong, db error, while fetching restaurant details"
                        });
                    }
                    
                
            }else{
                res.json({status:false,message:"mandatory parameters are missing"})
            }
           
        }else{
            res.json({status:false,message:"oppsss.!!! you cannot create a menu, you are not a vendor role"})
        }
    }catch(err){
        console.log(err)
        res.json({status:false,message:"something went wrong",err})
    }
} 

exports.getAllMenuByRestaurantId = async (req,res)=>{
    try{
        const result = await Menu.find({restaurantId : req.params.restaurantId})
        if(result){
            res.status(200).json({
                status:true,
                message: 'menu details are fetched successfully!',
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