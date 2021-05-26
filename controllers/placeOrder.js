const PlaceOrder = require('../models/placeOrder');
const Menu = require('../models/menu');
const mongoose = require('mongoose');
const placeOrder = require('../models/placeOrder');

exports.createOrder = async (req,res)=>{
    if(req.body.restaurantId && req.body.order.length > 0){
        var orderMenuIds = req.body.order.map(a => a.menuId);
        const result = await Menu.find({_id: {$in: orderMenuIds},restaurantId:req.body.restaurantId},{price:1,menuItem:1});

        if(result){
            const orderSummery = req.body.order.map(item => {
                const obj = result.find(o => o._id.toString() == item.menuId.toString());
                obj1 = {};
                // obj1['_id'] = obj._id;
                obj1['menuItem'] = obj.menuItem;
                obj1['price'] = obj.price;
                obj1['quantity'] = item.quantity;
                return obj1;
            });

            var subtotal = orderSummery.map( item => item.price * item.quantity);
            var total = subtotal.reduce( (a,b) => (a+b) );

            console.log(orderSummery,subtotal);
            console.log(total);
            const place_order = new PlaceOrder({
                restaurantId: req.body.restaurantId,
                order: req.body.order,
                orderStatus: 'PENDING',
                paymentStatus: 'PENDING',
                orderAmount: total,
                orderSummary: orderSummery,
                orderPickupTime: -1,
                userId: req.userDetails._id
            });
            const result1 = await place_order.save()
            if(result1){
                res.json({status:'true',message:result1})
            }else{
                res.json({status:'false',message:'error while placing order'})
            }
        }else{
            res.json({status:'false',message:'error while getting order menu details'})
        }
    }else{
        res.json({status:'false',message:'mandatory fields are missing'})
    }
    
}

exports.getAllOrdersByRestaurantId = async (req,res)=>{
    try{
        if(req.params.restaurantId){
            const result = await PlaceOrder.find({restaurantId:mongoose.Types.ObjectId(req.params.restaurantId)});
            if(result){
                res.status(200).json({
                    status:true,
                    message: 'order details are fetched successfully!',
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

exports.updatePaymentStatus = async (req,res)=>{
    if(req.body.orderId && req.body.paymentStatus){ //*ask for checking userId; who is paying orderpayment and who is placing order

        var updateObj ={}
        if(req.body.paymentStatus == 'ACCEPTED'){
            updateObj = {paymentStatus:'DONE'}
        }else{
            updateObj = {paymentStatus:'NOT DONE'}
        }

        const result = await PlaceOrder.updateOne({_id:req.body.orderId},updateObj)
        
        if(result && result.n == 1 && result.nModified == 1){
            const orderDetails = await PlaceOrder.find({_id: req.body.orderId})
            if(orderDetails){
                res.status(200).json({
                    status:true,
                    message: 'order details are updated successfully!',
                    result: result,
                    orderDetails
                });
            }else{
                res.status(500).json({
                    status:false,
                    message: "something went wrong, db error"
                });
            }
        }else{
            res.status(500).json({
                status:false,
                message: "something went wrong, db error"
            });
        }
    }else{
        res.json({status:'false',message:'mandatory fields are missing'})
    }
    
}

exports.pickupOrder = async (req,res)=>{
    const {orderId, orderStatus, orderPickupTime} = req.body
    if(orderId && orderStatus && orderPickupTime){ 
        var updateObj ={}
        if(orderStatus == 'ACCEPTED'){
            updateObj = {orderStatus:'ACCEPTED',orderPickupTime:orderPickupTime}
        }else{
            updateObj = {orderStatus:'CANCELLED',orderPickupTime:00}
        }

        const result = await PlaceOrder.updateOne({_id:orderId},updateObj)
        
        if(result && result.n == 1 && result.nModified == 1){
            const orderDetails = await PlaceOrder.find({_id: orderId})
            if(orderDetails){
                res.status(200).json({
                    status:true,
                    message: 'order details are updated successfully!',
                    result: result,
                    orderDetails
                });
            }else{
                res.status(500).json({
                    status:false,
                    message: "something went wrong, db error"
                });
            }
        }else{
            res.status(500).json({
                status:false,
                message: "something went wrong, db error"
            });
        }
    }else{
        res.json({status:'false',message:'mandatory fields are missing'})
    }
    
}