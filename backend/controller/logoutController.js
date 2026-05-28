import ApiResponse from "../utils/apiResponse.js";


const logout=async(req,res)=>{
    try{

        res.clearCookie("token",{
            httpOnly:true,
            samesite:"lax",
            secure:false,
        }).status(200).json(new ApiResponse(200, "success", "Logout Successful", null));

    }catch(error){
        res.status(500).json(new ApiResponse(500, "error", "Logout Failed", error));
    }
}

export default logout;