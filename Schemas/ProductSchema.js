const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const product_schema = new Schema({
    name:{
        type:String,
        require:true
    },
    subtitle:{
        type:String,
        require:true
    },
    description:{
        type:Array,
        reuire:true,
    },
    price:{
        type:Number,
        require:true
    },
    images:{
        type:Array,
        require:true
    },
    model_number:{
        type:String,
        require:true
    }
});

module.exports = mongoose.model("Product", product_schema);