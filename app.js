const express=require('express');
const bodyParser= require('body-parser')
const mongoose=require('mongoose');
const path=require('path');
require('dotenv').config();

const userRoutes=require('./routes/user');
const restaurantRoutes=require('./routes/restaurant');
const menuRoutes=require('./routes/menu');
const placeOrderRoutes=require('./routes/placeOrder');
const coinCollectionRoutes=require('./routes/coinCollection');


const app=express();
const port=process.env.PORT||5000


const MONGO_LOCAL_URL=`mongodb://${process.env.HOST}:27017/menu-cart`; //! local mongo db
const MONGO_MENU_CAR_URL=process.env.MONGO_MENU_CAR_URL; //! global mongo db

mongoose.Promise=global.Promise;

mongoose.connect(MONGO_MENU_CAR_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then((res) => {
    console.log('DB connection Success')

  })
  .catch((err) => {
    console.log('Log: ~> file: app.js ~> line 48 ~> err', err)
    console.log('DB connection Failed')
  })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

app.use("/", express.static(path.join())); //used in-case of single app, angular is folder which contains UI build

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, PUT, OPTIONS");
  next();
})


app.use("/api/user", userRoutes);

app.use("/api/restaurant", restaurantRoutes);

app.use("/api/menu", menuRoutes);

app.use("/api/order", placeOrderRoutes);

app.use("/api/coinCollection", coinCollectionRoutes);

//code for single app
app.use((req, res, next) => {
  res.send('Welcome to menu cart!')
})

app.listen(port, () => {
  console.log('Log: ~> file: app.js ~> line 74 ~> app.listen ~> port', port)
});

module.exports=app
