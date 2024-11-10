import express from 'express';
import dotenv from 'dotenv';
import {app} from './app.js';
import connectDB from './db/database.js';


dotenv.config({
    path:'./env'
})
connectDB().then(()=>{
    app.listen(process.env.PORT || 8000 ,()=>{

        console.log(`server is running on port ${process.env.PORT}`);
    })
    
}).catch((err)=>{
    console.log(`MongoDB connection Failed !!! due to  ${err}`);
    
});
