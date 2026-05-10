import bcrypt from "bcrypt";
import { User } from "../models/userModels.js";
import jwt from "jsonwebtoken";
import ApiResponse from "../utils/apiResponse.js";
 
const signUp = async (req, res) => {
  try {
    const { fullname, username, email, password, role } = req.body;

    const alreadyExit = await User.findOne({ email });
    if (alreadyExit) {
      return res
        .status(400)
        .json(
          new ApiResponse(400, "error", "Email is already registered", null),
        );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      fullname,
      username,
      email,
      password: hashedPassword,
      role
    });

    // Strip password before sending
    const userResponse = newUser.toObject();
    delete userResponse.password;

    const token = jwt.sign({ id: userResponse._id }, process.env.JWT_Scret, {
      expiresIn: "3d",
    });

    return res.status(201).json(
      new ApiResponse(201, "success", "Signup Successful", {
        user: userResponse,
        token: token,
      }),
    );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, "error", "Signup Failed", null));
  }
};

export default signUp;
