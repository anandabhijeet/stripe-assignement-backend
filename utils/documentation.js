const swaggerDocumentation = {
    openapi: "3.0.0",
    info: {
        title: "Stripe assignment docs",
        version: "0.0.1",
        description: "Endpoints for Stripe Payments, Webhooks, fetching data"
    },

    servers: [
        {
            url: "http://localhost:5000",
            description:"local dev"
        }
    ],
    tags:[
        {name:"Stripe_Payment", description:"Payment routes"},
        {name:"Webhooks", description:"Stripe cli webhooks"},
        {name:"Fetch_Data", description:"Fetch data from database to frontent"},
    ],
    paths:{
        "/create-checkout-session":{
            post:{
                tags:["Stripe_Payment"],
                description:"Complete Stripe Payment",
                responses:{
                    200:{
                        description:"payment successful",
                        content:{
                            "application/json":{
                                schema:{
                                    type:"String",
                                    example: "Session Id"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/hooks":{
            post:{
                tags:["Webhooks"],
                description:"It is currently connected to stripe webhooks through stripe cli",
                responses:{
                    200:{
                        description:"ok",
                        content:"events"
                    }

                }
            }
        },
        "/getProduct":{
            get:{
                tags:["Fetch_Data"],
                description:"Fetch product data",
                responses:{
                    200:{
                        description:"feyched Data successful",
                        content:{
                            "application/json":{
                                schema:{
                                    type:"object",
                                    example: {
                                        product:[]
                                    }
                                }
                            }
                        }
                    }
                }

            }
        }
    }
};

module.exports = swaggerDocumentation;