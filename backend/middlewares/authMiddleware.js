import jwt from "jsonwebtoken"
import { User } from "../models/userModels.js"
import ApiResponse from "../utils/apiResponse.js";

const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json(
        new ApiResponse(401, false, "No token provided", null)
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
  
    if (!user) {
      return res.status(401).json(
        new ApiResponse(401, false, "User not found", null)
      );
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json(
      new ApiResponse(401, false, "Invalid token", null)
    );
  }
};

export default protect;