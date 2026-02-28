const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Candidate = require("../models/candidate");
const { jwtAuthMiddleware } = require('../middleware/authMiddleware');


// VOTING PROCESS-
router.post("/:candidateID", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const candidateID = req.params.candidateID;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
//admin not allow to vote 
    if (user.role === "admin") {
      return res.status(400).json({ message: "Admin can't able to do vote" });
    }
//don't able to give again vote
    if (user.isVoted) {
      return res.status(400).json({ message: "You have already voted." });
    }
    
    const candidate = await Candidate.findById(candidateID);
    if (!candidate) {
      return res.status(400).json({ message: "Candidate not found" });
    }
    candidate.votes.push({
      user:userId
    })

    candidate.voteCount += 1;
    await candidate.save();
    
    user.isVoted = true;
    await user.save();

    res.status(200).json({ message: "Vote save successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error." });
  }
});


module.exports=router;