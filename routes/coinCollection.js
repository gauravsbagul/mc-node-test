const express = require('express');
const router = express.Router();
const coinCollectionController = require('../controllers/coinCollection');
const authorize = require('../middleware/check-auth').Authenticate;

router.post("/giftCoinByRestaurantId",authorize, coinCollectionController.giftCoinByRestaurantId);

router.get("/getMyAllCoinsByRestaurantId",authorize, coinCollectionController.getMyAllCoinsByRestaurantId);

router.get("/getAllRestaurantDetails",authorize, coinCollectionController.getAllRestaurantDetails);

module.exports = router;