const mongoose=require("mongoose");

const connectDB=async()=>{
    try{
await mongoose.connect(process.env.MONGO_URI);
console.log("MongoDB connected.");
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Internal server error"})
    }
};

module.exports=connectDB;
