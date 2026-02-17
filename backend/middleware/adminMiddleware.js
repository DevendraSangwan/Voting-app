const adminMiddleware=(req,res,next)=>{
    if(req.user.role!=="admin"){
        return res.status(400).json({message:"Only admin update it. Voters are not allow."});
    }
    next();
};
module.exports=adminMiddleware;