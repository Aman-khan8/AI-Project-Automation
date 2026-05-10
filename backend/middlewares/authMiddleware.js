import jwt from "jsonwebtoken"
import { User } from "../models/userModels.js"
import ApiResponse from "../utils/apiResponse.js";

const protect=async(req,res,next)=>{
    if(req.headers.authorization && req.header.authorization.startsWith("Bearer")){
        try {
            const token=req.header.authorization.split(" ")[1];
            const decode=jwt.verify(token,process.env.JWT_SECRET)
          const user=await User.findById(decode.id).select("-passwrod");

          if(!user){
            return res.status(401).json(new ApiResponse(401, false, "User not found", null));
          }
          req.user=user;
          next();
        } catch (error) {
          return res.status(401).json(new ApiResponse(401, false, "Invalid token", null));
        }

    }
    else{
     
    return res.status(500).json({ message: "Server Error: Request headers missing" });
  
    }

  if (!token) {
    return res
      .status(401)
      .json(
        new ApiResponse(
          401,
          "error",
          "Not authorized, no token provided",
          null,
        ),
      );
  }
};

export default protect;