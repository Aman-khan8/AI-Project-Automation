import bcrypt from "bcrypt";
import { User } from "../models/userModels.js";
import jwt from "jsonwebtoken";
import ApiResponse from "../utils/apiResponse.js";
 
const signUp = async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, password, role, goals, workStyle } = req.body;

    console.log("Received signup data:", { name, email, role, goals, workStyle ,pasword});

    const alreadyExit = await User.findOne({ email });
    if (alreadyExit) {
      return res
        .status(400)
        .json(
          new ApiResponse(400, "error", "Email is already registered", null),
        );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashedPassword);
    
   
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    goals,
    workStyle
  });

  console.log("USER CREATED:", newUser);

    // Strip password before sending
    const userResponse = newUser.toObject();
    delete userResponse.password;

    const token = jwt.sign({ id: userResponse._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
      
    

    return res.cookie("token", token,{httpOnly:true,secure:false,sameSite:"lax"}).status(201).json(
      new ApiResponse(201, "success", "Signup Successful", {
        user: userResponse,
      }),
    );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, "error", "Signup Failed", error));

      console.log("Signup error:", error);
  }
};

export default signUp;
