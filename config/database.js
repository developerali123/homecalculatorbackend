import mongoos from "mongoose"
const connectDB=async()=>{
    try{
        const conn=mongoos.connect(process.env.MONGODB_URL)
        
    }catch(e){
        
    }
}

export default connectDB