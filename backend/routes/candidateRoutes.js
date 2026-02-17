const express = require("express");
const router = express.Router();
const cors = require("cors");

const Candidate = require("../models/candidate");
const {jwtAuthMiddleware}=require("../config/jwt");
const adminMiddleware=require("../middleware/adminMiddleware");



router.use(cors());
router.use(express.json());

//Mkaing new candidate buy admin only
router.post("/candidates",jwtAuthMiddleware, adminMiddleware,async(req,res)=>{
    try{
         const {name,party,age,votes,voteCount}=req.body;
         const newCandidate=new Candidate({name,party,age,votes,voteCount});
         await newCandidate.save();
          res.status(200).json({message:"Candidate saved successfully."});

    }catch(err){
        console.log(err);
        res.status(500).json({ error: "Failed to save user data" });
    }
});

//Update candidate data only form admin
router.put("/candidates/:candidateID",jwtAuthMiddleware,adminMiddleware,async(req,res)=>{
    try{
        const updated=await Candidate.findByIdAndUpdate(req.params.candidateID,req.body);
        res.status(200).json({message:"Candidate updated."});

    }catch(err){
        console.log(err);
        res.status(500).json({ error: "Failed to save user data" });
    }
});

router.delete("/candidates/:candidateID",jwtAuthMiddleware,adminMiddleware,async(req,res)=>{
      try{
        await Candidate.findByIdAndDelete(req.params.candidateID);
        res.status(200).json({message:"Candidate delete succesfully."})

      }catch(err){
        console.log(err);
        res.status(500).json({ error: "Failed to save user data" });
      }

});

module.exports=router;