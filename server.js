require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { createCheckoutSession, hooks, getProduct } = require("./EventHandlers/EventHandlers");


mongoose
  .connect("mongodb://127.0.0.1:27017/product", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const app = express();
    //middlewares
    app.use(bodyParser.json()); // It is responsible for parsing the incoming request bodies in a middleware before you handle it.
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.json()); //to access req object
    app.use(cors());//allows a server to indicate any origins
    app.use('/api/subs/stripe-webhook', bodyParser.raw({type: "*/*"}))
    
    //routes or end-points
    app.post("/create-checkout-session", createCheckoutSession );
    app.post('/hooks', hooks )
    app.get("/getProduct", getProduct )

   

    app.listen(5000, () => {
      console.log("server is listening on port 5000 ...database connected");
    });
  });
