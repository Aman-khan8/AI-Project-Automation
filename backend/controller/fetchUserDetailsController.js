import ApiResponse from "../utils/apiResponse.js";



 const fetchUserDetails = async (req, res) => {
  try {
    const user = req.user._id;
     const userDetails = {
      name: req.user.name,
      email: req.user.email,
      id: user,
    }; 
    return res.status(200).json(new ApiResponse(200, "Success", null, userDetails));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, "Failed", "Internal Server Error", error.message));
  }
}

export default fetchUserDetails;