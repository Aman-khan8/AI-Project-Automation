import { User } from "../models/userModels.js";
import { taskModel } from "../models/taskModels.js";
import ApiResponse from "../utils/apiResponse.js";


const editTask =async(req,res)=>{
 try {
    userid=req.user._id;
    const editTask= await taskModel.findbyIdAndUpdate(userId, req.body,{new:true});
    
      if(editTask){
        return res.status(200).json(
              new ApiResponse(200, "success", "Task Edited Successfully", {
        editTask
      }),
    );}


  }catch(err){
return res
      .status(500)
      .json(new ApiResponse(500, "Error", "Error in Editing Task", err));
  }
}


export default editTask;