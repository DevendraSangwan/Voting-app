require("dotenv").config();


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("../models/user");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const candidate = require("../models/candidate");


const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("User DB Connected"))
  .catch(err => console.error("MongoDB Error:", err));


// CREATE USER USING SIGNUP
app.post("/signup", async (req, res) => {
  try {
    const { name, age,email,mobile,address,aadharCardNumber,password,role,isVoted} = req.body;
    const saltRounds=5;
    const hashedPassword=await bcrypt.hash(password,saltRounds);
    const newUser = new User({ name, age,email,mobile,address,aadharCardNumber,password:hashedPassword,role,isVoted:false});
    await newUser.save();
    res.status(201).json({ message: "User data saved successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save user data" });
  }
});

//LOGIN USER USING PASSWORD AND AADHARCARDNUMBER

app.post ("/login",async (req,res)=>{
    try{
        const {aadharCardNumber,password}=req.body;
    const user=await User.findOne({aadharCardNumber});

    if(!aadharCardNumber || !password){
        return console.log("Enter valid aadharcardnumber or password")
    };
    if(!user){
        return res.status(400).json({message:"User not found"});
    }
    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(400).json({message:"Invaild password"});
    }
    const token=jwt.sign(
        {userId:user._id},
        "Yourtoken",
        {expiresIn:"200000000h"}
    );

    res.json({message:"Login successfully",token});
}catch(err){
    console.log(err);
    res.status(500).json({message:"Internal server error"});
}
});

//Show progile if login is completed
app.get("/profile",async(req,res)=>{
    const token=req.header  
    try{
        const user=await User.findOne({aadharCardNumbe});





    }catch(err){
    console.log(err);
    res.status(500).json({message:"Internal server error"});
}
})

//ADD Candidates allow only  admin
app.post("/candidates",async (req,res)=>{
    try{
        const{role}=req.body;
        const user=await User.findOne({role});

        if(role==="admin"){
            const {name,party,age,votes,voteCount}=req.body;
            const newCandidate=new candidate({name,party,age,votes,voteCount});
            await newCandidate.save();
            res.status(201).json({ message: "Candidate saved successfully!" });
        }

        if(role!=="admin"){
            return res.status(400).json({message:"Voter is not allow to add candidate"});
        };

    }catch(err){
         console.log(err);
    res.status(500).json({message:"Internal server error"});
    }
});

//Updata candidate data allow only admin 
app.put("candidates/:candidateID",async(req,res)=>{
    try{
        const{name,party,age,votes,voteCount}=req.body;
        const{role}=req.body;
        const user=await User.findOne({role});
        if(role==="admin"){
        await candidate.findByIdAndUpdate(req.params.id,{name,party,age,votes,voteCount});
        res.json({message:"Candidate data update successfully. "})};
        
        if(role!=="admin"){
            return res.status(400).json({message:"Voter is not allow to add candidate"});
        };

    }catch(err){
        console.log(err);
    res.status(500).json({message:"Internal server error"});
    }
});

//Delete candidate data allow only admin
app.delete("/candidates/:candidateID",async(req,res)=>{
    try{
        const user=await User.findOne({role});
        if(role==="admin"){
        await User.delete({});
        res.json({message:"Candidate data delete successfully"})};

        if(role!=="admin"){
            return res.status(400).json({message:"Voter is not allow to add candidate"});
        };
    }catch(err){
         console.log(err);
    res.status(500).json({message:"Internal server error"});
    }
})


//Profile 





app.listen(PORT, () => {
  console.log(`User Server running on http://localhost:${PORT}`);
});
