import mongoose from "mongoose"


const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("DB Connected")
    } catch (error) {
        console.error("DB Connection Error:", error)
    }
}

export default connectDB;