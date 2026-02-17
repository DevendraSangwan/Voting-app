require("dotenv").config();

const express=require('express');
const mongoose=require("mongoose");

const app=express();
const PORT=process.env.PORT ||3000;

app.use(express.json());


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("User DB Connected"))
  .catch(err => console.error("MongoDB Error:", err));



const userRoutes=require('./backend/routes/userRoutes');
const candidateRoutes=require("./backend/routes/candidateRoutes");

app.use('/user',userRoutes);
app.use("/candidates",candidateRoutes);

app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`);
})


