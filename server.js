const express=require('express');
const app=express();

const bodyParser=require('body-parser');
app.use(bodyParser.json());
const PORT=process.env.PORT ||3000;



const userRoutes=require('./backend/userRoutes');
app.use('/user',userRoutes);

app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`);
})


