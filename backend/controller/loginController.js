import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import ApiResponse from "../utils/apiResponse.js";
import { User } from "../models/userModels.js";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json(new ApiResponse(400, "error", "Email is not registered", null));
    }

    const isPassCorrect = await bcrypt.compare(password, user.password);
    if (!isPassCorrect) {
      return res
        .status(400)
        .json(new ApiResponse(400, "error", "Invalid Credentials", null));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    const loggedInUser = user.toObject();
    delete loggedInUser.password;

    return res.cookie("token",token,{
      httpOnly:true,
      secure:false,
      sameSite:"lax"
    }).status(200).json(
      new ApiResponse(200, "success", "Login Successful", {
        user: loggedInUser,
      }),
    );
  } catch (err) {

    return res
      .status(500)
      .json(new ApiResponse(500, "error", "Login Failed", err));
  }
};

export default login;
