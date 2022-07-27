require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Customer = require("./Schemas/CustomerSchema")
const Product = require("./Schemas/ProductSchema")

//this acts as fuction and we need to pass private key
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
mongoose
  .connect("mongodb://127.0.0.1:27017/product", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(cors());
    app.use('/api/subs/stripe-webhook', bodyParser.raw({type: "*/*"}))
    app.use(function (req, res, next) {
      // Website you wish to allow to connect
      res.setHeader("Access-Control-Allow-Origin", "*");
      // Request methods you wish to allow
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
      );
      // Request headers you wish to allow
      res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
      );
      // Set to true if you need the website to include cookies in the requests sent
      // to the API (e.g. in case you use sessions)
      res.setHeader("Access-Control-Allow-Credentials", true);
      // Pass to next layer of middleware
      next();
    });

    


    app.post("/create-checkout-session", async (req, res) => { 
       try{
        console.log(req.body);
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "inr",
                product_data: {
                  name: req.body.name,
                },
                unit_amount: req.body.unit_amount*100,
               
              },
              quantity: req.body.quantity,
              
            },
          ],
          mode: "payment",
          success_url: "http://localhost:3000/stripepaymentsuccess",
          cancel_url: "http://localhost:3000/stripepaymentcancel",
        });

        res.json({ id: session.id });
       }catch(error){
        res.status(400).send("failure")
       }
    });

    app.post('/hooks',  async(req, res)=>{
      const payload = req.body;
      const payloadString = JSON.stringify(payload, null, 2);
      const header = stripe.webhooks.generateTestHeaderString({
        payload: payloadString,
        secret: process.env.WEBHOOK_SIGNING_SECRET_KEY,
      });
      let event;
      try {
        event = stripe.webhooks.constructEvent(
          payloadString,
          header,
          process.env.WEBHOOK_SIGNING_SECRET_KEY
        );
        console.log("Webhook verified");
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return res.sendStatus(400);
      }
     

      if(event.type === "charge.succeeded"){
        let customer = {
          name: event.data.object.billing_details.name,
          email:  event.data.object.billing_details.email,
          country: event.data.object.billing_details.address.country,
          amount: event.data.object.amount_captured
        }
        
        // console.log("customer",customer);
        let newCustomer = Customer(customer);
        await newCustomer.save((error, customer)=>{
          if(error)console.log(error);
          console.log(customer);
        });
      }

      // console.log(event.type);
      // console.log(event.data.object);
    })

    app.get("/getProduct", (req, res)=>{
      Product.find((error, product)=>{
        if(error)res.send(400).json(error);

        res.status(200).json(product);

      })
    })

   

    app.listen(5000, () => {
      console.log("server is listening on port 5000 ...database connected");
    });
  });
