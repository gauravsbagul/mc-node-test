const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menu');
const authorize = require('../middleware/check-auth').Authenticate;

router.post("/createMenuByRestaurantId/:restaurantId",authorize, menuController.createMenuByRestaurantId);

router.get("/getAllMenuByRestaurantId/:restaurantId",authorize, menuController.getAllMenuByRestaurantId);

// router.get("/getMenuById/:menuId",authorize, menuController.getMenuById);

// router.put("/updateMenuById/:menuId",authorize, menuController.updateMenuById);

// router.delete("/deleteMenuById/:menuId",authorize, menuController.deleteMenuById);




module.exports = router;