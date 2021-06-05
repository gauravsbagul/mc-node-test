const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menu');
const authorize = require('../middleware/check-auth').Authenticate;
var path  = require('path')
const multer = require('multer');

const storage = multer.diskStorage({
  destination: './uploads/menuItemImages',
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

router.post("/createMenuByRestaurantId", authorize,upload.single('image'), menuController.createMenuByRestaurantId);

router.get("/getAllMenuByRestaurantId",authorize, menuController.getAllMenuByRestaurantId);

router.post('/uploadMenuItemImage',authorize, upload.single('image'), menuController.uploadMenuItemImage);

// router.get("/getMenuById/:menuId",authorize, menuController.getMenuById);

// router.put("/updateMenuById/:menuId",authorize, menuController.updateMenuById);

// router.delete("/deleteMenuById/:menuId",authorize, menuController.deleteMenuById);




module.exports = router;