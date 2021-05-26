const express = require('express');
const router = express.Router();
const placeOrderController = require('../controllers/placeOrder');
const authorize = require('../middleware/check-auth').Authenticate;

router.post("/createOrder",authorize, placeOrderController.createOrder);

router.get("/getAllOrdersByRestaurantId/:restaurantId",authorize, placeOrderController.getAllOrdersByRestaurantId);

router.post("/updatePaymentStatus",authorize, placeOrderController.updatePaymentStatus);

router.post("/pickupOrder",authorize, placeOrderController.pickupOrder);

module.exports = router;