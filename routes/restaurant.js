const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurant');
const authorize = require('../middleware/check-auth').Authenticate;
var path  = require('path')
const multer = require('multer');

const storage = multer.diskStorage({
  destination: './uploads/RestaurantImages',
    filename: function(req, file, cb){
        cb(null,  Date.now() +'_'+file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
};

  
const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.post("/createRestaurant",authorize, upload.single('image'), restaurantController.createRestaurant);

router.post('/uploadRestaurantImage',authorize, upload.single('image'), restaurantController.uploadRestaurantImage);

router.get("/getAllRestaurants",authorize, restaurantController.getAllRestaurants);

router.get("/getRestaurantById",authorize, restaurantController.getRestaurantById);

router.put("/updateRestaurantById",authorize, restaurantController.updateRestaurantById);

router.delete("/deleteRestaurantById",authorize, restaurantController.deleteRestaurantById);

router.put("/updateOffersByRestaurantId",authorize, restaurantController.updateOffersByRestaurantId);



module.exports = router;