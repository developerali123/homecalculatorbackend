import mongoos from "mongoose"
const connectDB=async()=>{
    try{
        const conn=mongoos.connect(process.env.MONGODB_URL)
        console.log(`connected to mongodb ${(await conn).connection.host}`)
    }catch(e){
        console.log(`error in mongodb:${e}`)
    }
}

export default connectDB