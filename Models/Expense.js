const mongoose = require('mongoose');
const Expenses = new mongoose.Schema({
    amount : {
        type : Number,
        required : true
    },
    category : {
        type : String,
        required : true
    },
    date :{
        type : Date,
        required : true
    },
    des : {
        type : String
    }
})

const expenses = mongoose.model('expense' , Expenses);
module.exports = expenses;