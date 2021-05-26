const jwt = require('jsonwebtoken');
const User = require('../models/user');

const Authenticate = function (req,res,next) {
    
    let jwtSecretKey = 'menu-cart';
    try {
        if(req.headers["authorization"]){
            const token = req.headers['authorization'];
            jwt.verify(token, jwtSecretKey,function(err,payload){
                if(!err){
                    User.findOne({
                        mobileNumber: payload.mobileNumber,
                        role:payload.role
                    }).then((result)=>{
                        if(!result){
                            res.status(401).send({status:false,message:"user not found"});
                        }else{
                            req.userDetails = result;
                            next();
                        }
                    }).catch((err)=>{
                        res.status(400).send({status:false,message:"error while checking user token details"})
                    })
                    
                }else{
                    // Access Denied
                    console.log(req)
                    res.status(401).send({status:false,message:"invalid token"});
                }
            })
        }else{
            res.status(401).send({status:false,message:"authorization token is missing"});
        }
    } catch (error) {
        // Access Denied
        console.log(error)
        res.status(401).send({status:false,message:"something went wrong"});
    }
}

module.exports = { Authenticate };