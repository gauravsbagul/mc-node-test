const Menu = require('../models/menu');
const dbRestaurantServices = require("../dbServices/restaurant");
const dbMenuServices = require("../dbServices/menu");
var fs  = require('fs')
var path  = require('path')

exports.uploadMenuItemImage = async (req,res)=>{
    
    if(req.query.menuId && req.file){
        var obj = {
            menuItemImage : req.file.path,   
            menuItemImageName: req.file.originalname
        }
        const resultUpd = await Menu.updateOne({_id:req.query.menuId},obj);
        
        if(resultUpd && resultUpd.n == 1 && resultUpd.nModified == 1){
            res.status(202).json({
                status:true,
                message: 'Menu details are found saved previously, and now menu details are updated successfully!',
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
// });

exports.createMenuByRestaurantId = async (req,res)=>{
    try{
        if(req.userDetails.role == 'VENDOR'){
            if(req.query.restaurantId && req.body.menuItem && req.body.price && req.body.pointsValue){
                var result = await dbRestaurantServices.findRestaurant(req.query.restaurantId)
                var obj = {
                    menuItemImage : req.file.path,   
                    menuItemImageName: req.file.originalname
                }
                    if(result){
                        if(JSON.stringify(result.createdBy) == JSON.stringify(req.userDetails._id)){
                            var menuResult = await dbMenuServices.findMenu({menuItem: req.body.menuItem,price: req.body.price,restaurantId: req.query.restaurantId})
                            req.body.menuItemImage = obj.menuItemImage;
                            req.body.menuItemImageName = obj.menuItemImageName;

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
                                        resultUpd,
                                        message: "something went wrong, db error, you may b not the owner of this restaurant to update, please check once"
                                    });
                                }  
                            }else{
                                const menu = new Menu({
                                    restaurantId: req.query.restaurantId,
                                    menuItem: req.body.menuItem,
                                    price: req.body.price,
                                    pointsValue: req.body.pointsValue,
                                    menuItemImage : req.body.menuItemImage,
                                    menuItemImageName : req.body.menuItemImageName
                                });
                                console.log({
                                    restaurantId: req.query.restaurantId,
                                    menuItem: req.body.menuItem,
                                    price: req.body.price,
                                    pointsValue: req.body.pointsValue,
                                    menuItemImage : req.body.menuItemImage,
                                    menuItemImageName : req.body.menuItemImageName
                                })
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
                                result,
                                message: "something went wrong, db error, you may not the owner of this restaurant to perform menu creation operation"
                            });
                        }
                    }else{
                        res.status(500).json({
                            status:false,
                            result,
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
        res.json({status:false,message:"file provided is not png or jpeg format, or else please check request body parameters; ",err})
    }
} 

exports.getAllMenuByRestaurantId = async (req,res)=>{
    try{
        const result = await Menu.find({restaurantId : req.query.restaurantId})
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