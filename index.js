const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
app.use(express.json());
app.use(cors());


mongoose.connect(process.env.DATABASE).then(()=>{
    console.log("Database Connected");
    app.listen(5000, () => {
      console.log("Server is running on PORT 5000");
    });
}).catch((error)=>{
    console.log(error);
});

app.use(require('./Routes/userroutes'));
app.use(require('./Routes/expenseroutes'));
