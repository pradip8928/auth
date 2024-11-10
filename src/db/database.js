import mongoose from 'mongoose';



const connectDB =async ()=>{

    try {
    
     const connectionInstance= await  mongoose.connect(process.env.MONGO_URI)
     
          .then(() => console.log('Connected!'));
        //   console.log(`\n mongoDB connected !! DB HOST : ${connectionInstance.connection.host}`);
          
    } catch (error) {
        console.log("MongoDB connnection error !",error);
        process.exit(1);
        
    }
}

export  default connectDB;