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
    },
    userId: {  
        type: mongoose.Schema.Types.ObjectId,
        required: true 
    }
})

const expenses = mongoose.model('expense-track' , Expenses);
module.exports = expenses;