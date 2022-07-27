const mongoose = require("mongoose");
const schema = mongoose.Schema;

const customerSchema = new schema({
    name:{
        type: String,
        require: true,
    },
    email:{
        type:String,
        require:true,
    },
    country:{
        type:String,
        require: true,
    },
    amount:{
        type:Number,
        require: true
    }
})

module.exports = mongoose.model('Customer', customerSchema);