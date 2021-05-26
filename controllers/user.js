const User=require('../models/user');
const jwt=require('jsonwebtoken');
const fast2sms=require('fast-two-sms')
const API_KEY='jXU2adGS4q8I0zH1eNouYgih7RtC9Bkx3QVyMrfnbDwFEJ6WLT2Hh0NtzIPZG5uEBQklowqyrgsxCSKT'

exports.verifyOTP=async (req, res) => {
    try {
        if (req.body.mobileNumber&&req.body.role&&req.body.otp) {
            const user=await User.findOne({
                mobileNumber: req.body.mobileNumber,
                role: req.body.role
            })

            if (!user) {
                return res.status(401).json({
                    status: false,
                    message: "User for this mobile number and role is not found"
                });
            } else {
                if (user.otp==req.body.otp) {
                    const token=jwt.sign({
                        mobileNumber: req.body.mobileNumber,
                        role: req.body.role
                    }, 'menu-cart', {}); //token will not expire
                    // const tokenVerified = jwt.verify(token, 'menu-cart');
                    const resultUpd=await User.updateOne({ mobileNumber: req.body.mobileNumber, role: req.body.role }, { jwtToken: token, isLogin: true })
                    if (resultUpd.n>0) {
                        res.status(202).json({
                            status: true,
                            message: "user is updated successfully",
                            userId: user._id,
                            result: resultUpd,
                            token: token
                        });
                    } else {
                        res.status(401).json({ status: false, message: "while getting user token; please try again" })
                    }

                } else {
                    res.json({ status: false, message: "the provided otp is incorrect" })
                }
            }

        } else {
            res.json({ status: false, message: "mandatory parameters are missing" })
        }
    } catch (err) {
        res.json({ status: false, message: "something went wrong" })
    }
}

var sendSMS=async (mobileNumber, otp, callback) => {
    var options={
        authorization: API_KEY,
        message: `Menu Cart has sent you an OTP, please enter the 4 digits below to Verify yourself OTP: ${otp},  Thank you`,
        numbers: [mobileNumber]
    }
    const resp=await fast2sms.sendMessage(options)
    callback(resp)
}

exports.generateOTP=async (req, res) => {
    const { mobileNumber, role }=req.body
    try {
        if (req.body.mobileNumber&&req.body.role) {
            var otp=Math.floor(1000+Math.random()*9000);
            console.log("🚀 ~ file: user.js ~ line 62 ~ exports.generateOTP= ~ otp", otp)
            const user=new User({
                userName: req.body.mobileNumber+"_"+req.body.role,
                otp,
                mobileNumber,
                role,
                isLogin: false,
                jwtToken: ""
            });
            console.log('Log: ~> file: user.js ~> line 76 ~> exports.generateOTP= ~> user', user)
            const result=await User.findOne({
                mobileNumber: req.body.mobileNumber,
                role: req.body.role
            })
            console.log('Log: ~> file: user.js ~> line 81 ~> exports.generateOTP= ~> result', result)
            if (!result) {
                const result1=await user.save()
                if (result1) {
                    sendSMS(req.body.mobileNumber, otp, function (smsResponse) {
                        // smsResponse?.return optionalChaining
                        if (smsResponse&&smsResponse.return) {
                            res.status(200).json({
                                status: true,
                                message: 'OTP is sent successfully!',
                                otp: otp,
                                otpResponse: smsResponse,
                                userId: result1._id,
                                userName: result1.userName,
                                createdAt: result1.createdAt,
                                updatedAt: result1.updatedAt
                            });
                        } else {
                            res.status(500).json({
                                status: false,
                                message: "error while sending otp to mobile number,please check mobile number"
                            });
                        }
                    })
                } else {
                    res.status(500).json({
                        status: false,
                        message: "something went wrong"
                    });
                }
            } else {
                if (result.jwtToken==''&&isLogin==false) {
                    const resultUpd=await User.updateOne({ mobileNumber: req.body.mobileNumber, role: req.body.role }, { otp: otp })
                    if (resultUpd.n>0) {
                        sendSMS(req.body.mobileNumber, otp, function (smsResponse) {
                            if (smsResponse&&smsResponse.return) {
                                res.status(200).json({
                                    status: true,
                                    message: 'OTP is sent successfully!',
                                    otpResponse: smsResponse,
                                    resultUpd,
                                    otp,
                                    userId: result._id,
                                    userName: result.userName,
                                    createdAt: result.createdAt,
                                    updatedAt: result.updatedAt
                                });
                            } else {
                                res.status(500).json({
                                    status: false,
                                    message: "error while sending otp to mobile number,please check mobile number"
                                });
                            }
                        })

                    } else {
                        res.status(401).json({ status: false, message: "while getting otp; please try again" })
                    }

                } else {
                    res.json({ status: true, message: "user data exists and is online" })
                }
            }

        } else {
            res.json({ status: false, message: "mandatory parameters are missing" })
        }
    } catch (err) {
    console.log('Log: ~> file: user.js ~> line 157 ~> exports.generateOTP= ~> err', err)
         
        res.json({ status: false, message: "something went wrong", err })
    }
}

exports.logOut=async (req, res) => {
    if (req.body.mobileNumber&&req.body.role) {
        const user=await User.findOne({
            mobileNumber: req.body.mobileNumber,
            role: req.body.role
        })

        if (!user) {
            return res.status(401).json({
                status: false,
                message: "User for this mobile number and role is not found"
            });
        } else {
            const resultUpd=await User.updateOne({ mobileNumber: req.body.mobileNumber, role: req.body.role }, { jwtToken: "", isLogin: false })
            if (resultUpd.n) {
                res.status(200).json({
                    status: true,
                    message: "user is logged successfully",
                    userId: user._id,
                    result: resultUpd
                });
            } else {
                res.status(401).json({ status: false, message: "error while user getting logged out; please try again" })
            }
        }

    } else {
        res.json({ status: 'false', message: 'mandatory fields are missing' })
    }

}