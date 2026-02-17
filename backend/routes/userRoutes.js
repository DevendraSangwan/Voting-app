const express = require("express");
const router=express.Router();
const User = require("../models/user");
const jwtAuthMiddleware = require("../middleware/authMiddleware");
const { generateToken } = require("../config/jwt");

// router.use(cors());
router.use(express.json());
router.use(express.static("public"));

// Signup 
router.post("/signup", async (req, res) => {
  try {
    const { name, age, email,mobile,address,aadharCardNumber,password,role,isVoted } = req.body;
    
    const checkaadhar=await User.findOne({aadharCardNumber});
    if(checkaadhar){
      return res.status(400).json({message:"User allready exists."});
    }

    const newUser = new User({ name, age, email,mobile,address,aadharCardNumber,password,role,isVoted });
    await newUser.save();
    console.log("User data saved succesfully. ")
    const payload={
        id:newUser.id,
    }
    console.log(JSON.stringify(payload));
    const token=generateToken(payload);
    console.log("Token is",token);

    res.status(200).json({user:newUser,token:token});

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to save User" });
  }
});

// Login 
router.post("/login", async (req, res) => {
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
router.get('/profile',jwtAuthMiddleware,async(req,res)=>{
    try{
        const userId=req.user.id;
        const user=await User.findById(userId).select("-password");
        res.status(200).json({user});
    }catch(err){
        console.log(err);
            res.status(500).json({ error: "Internal server error" });

    }
})





// UPDATE
router.put("/profile/password", jwtAuthMiddleware,async (req, res) => {
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


module.exports=router;