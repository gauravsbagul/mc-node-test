const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const path=require('path');


const userRoutes=require('./routes/user');
const restaurantRoutes=require('./routes/restaurant');
const menuRoutes=require('./routes/menu');
const placeOrderRoutes=require('./routes/placeOrder');
const coinCollectionRoutes=require('./routes/coinCollection');


const app=express();
const port=process.env.PORT||5000


const MONGO_LOCAL_URL="mongodb://localhost:27017/menu-cart"; //! local mongo db
const MONGO_GLOBAL_URL="mongodb+srv://menu-cart-test-db:MenuCartPassword%401234@menu-cart.2ovt8.mongodb.net/test" //! Global cluster


mongoose.Promise=global.Promise;

mongoose.connect(MONGO_GLOBAL_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then((res) => {
    console.log('DB connection Success')

  })
  .catch((err) => {
    console.log('DB connection Failed')
  })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
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
app.use("/",(req, res, next) => {
  res.send('Welcome to menu cart!')
})

app.listen(port, () => {
});

module.exports=app
