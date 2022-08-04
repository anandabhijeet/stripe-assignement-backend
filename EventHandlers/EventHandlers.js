const Customer = require("../Schemas/CustomerSchema");
const Product = require("../Schemas/ProductSchema");

//this acts as fuction and we need to pass private key
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
  try {
    console.log(req.body);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",

            product_data: {
              name: req.body.name,
              images: [req.body.image],
            },
            unit_amount: req.body.unit_amount * 100,
          },
          quantity: req.body.quantity,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/stripepaymentsuccess",
      cancel_url: "http://localhost:3000/stripepaymentcancel",
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(400).send("failure");
  }
};

const hooks = async (req, res) => {
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

    if (event.type === "charge.succeeded") {
      let customer = {
        name: event.data.object.billing_details.name,
        email: event.data.object.billing_details.email,
        country: event.data.object.billing_details.address.country,
        amount: event.data.object.amount_captured,
      };

      let newCustomer = Customer(customer);
      await newCustomer.save((error, customer) => {
        if (error) console.log(error);
        console.log(customer);
      });
    }
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`, err.message);
    return res.sendStatus(400);
  }
};

const getProduct = (req, res) => {
  Product.find((error, product) => {
    if (error) res.send(400).json(error);
    res.status(200).json(product);
  });
};

module.exports = {
  createCheckoutSession,
  hooks,
  getProduct,
};
