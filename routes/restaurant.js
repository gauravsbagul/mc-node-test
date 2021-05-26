const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurant');
const authorize = require('../middleware/check-auth').Authenticate;

router.post("/createRestaurant",authorize, restaurantController.createRestaurant);

router.get("/getAllRestaurants",authorize, restaurantController.getAllRestaurants);

router.get("/getRestaurantById/:restaurantId",authorize, restaurantController.getRestaurantById);

router.put("/updateRestaurantById/:restaurantId",authorize, restaurantController.updateRestaurantById);

router.delete("/deleteRestaurantById/:restaurantId",authorize, restaurantController.deleteRestaurantById);




module.exports = router;