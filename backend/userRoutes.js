// require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
// const cors = require("cors");
const User = require("../models/user");
const {jwtAuthMiddleware,generateToken}=require('../jwt');
const { log } = require("console");


// const app = express();
// const PORT = 5000;

// app.use(cors());
// app.use(express.json());
// app.use(express.static("public"));

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("Feedback DB Connected"))
//   .catch(err => console.error("MongoDB Error:", err));


// Signup 
app.post("signup", async (req, res) => {
  try {
    const { name, age, email,mobile,address,aadharCardNumber,password,role,isVoted } = req.body;
    const newUser = new User({ name, age, email,mobile,address,aadharCardNumber,password,role,isVoted });
    await newUser.save();
    res.status(201).json({ message: "User saved successfully!" });

    const payload={
        id:response.id,
    }
    console.log(JSON.stringify(payload));
    const token=generateToken(payload);
    console.log("Token is",token);

    res.status(200).json({response:response,token:token});

  } catch (error) {
    console.log(err);
    res.status(500).json({ error: "Failed to save User" });
  }
});

// Login 
app.post("/login", async (req, res) => {
  try {
    const {aadharCardNumber,password}=req.body;

    const user=await User.findOne({aadharCardNumber:aadharCardNumber});

    if(!user || !(await user.comparePassword(password))){
        return res.status(401).json({error:'Invaild aadharCardNumber or password'});

    }
    const payload={
        id:user.id
    }
    const token=generateToken(payload);
    res.json({token});
} catch (error) {
    res.status(500).json({ error: "Failed to fetch User" });
  }
});

//Profile route
app.get('/profile'.jwtAuthMiddleware,async(req,res)=>{
    try{
        const userData=req.user;
        const userId=userData.id;
        const user=await User.findById(userId);
        res.status(2000).json({user});
    }catch(err){
        console.log(err);
            res.status(500).json({ error: "Internal server error" });

    }
})





// UPDATE
app.put("/profile/password", async (req, res) => {
  try {
         const userId=req.user;

        const {currentPassword,newPassword}=req.body;

            const user=await User.findById(userId);

    
    if(!(await user.comparePassword(currentPassword))){
        return res.status(401).json({error:'Invaild currentPassword '});

    }

     user.password=newPassword;
     await user.save();


    console.log("Password updated");
    res.json({ message: "Password updated successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update feedback" });
  }
});





app.listen(PORT, () => {
  console.log(`Feedback Server running on http://localhost:${PORT}`);
});
