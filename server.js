require("dotenv").config();

const express=require('express');
const mongoose=require("mongoose");
const cors = require("cors");

const app=express();
const PORT=process.env.PORT ||5000;

app.use(express.json());
app.use(cors());


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("User DB Connected"))
  .catch(err => console.error("MongoDB Error:", err));



const userRoutes=require('./backend/routes/userRoutes');
const voteRoutes=require("./backend/routes/voteRoutes");
const candidateRoutes=require("./backend/routes/candidateRoutes");

app.use('/',userRoutes);
app.use("/vote",voteRoutes);
app.use("/candidates",candidateRoutes);

app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`);
})


