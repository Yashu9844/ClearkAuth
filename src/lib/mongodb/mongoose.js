

import mongoose from "mongoose";

let intialized = false;


export const connect = async ()=>{

   mongoose.set('strictQuery', true);  

   if(intialized){
    console.log('MongoDB already connected!!');
    return;
   }

  try {
await mongoose.connect(process.env.MONGO_SECRET,{
    
    dbName:"next-auth",
    useNewUrlParser: true,
    useUnifiedTopology: true,
   
    useCreateIndex: true,
  });
  console.log('MongoDB  connected')
  intialized = true;
}


    
catch (error) {
    console.error('MongoDb error',error)
  }

   
    return;
}

 