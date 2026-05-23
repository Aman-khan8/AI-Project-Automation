import { User } from "../models/userModels.js";
import { taskModel } from "../models/taskModels.js";
import ApiResponse from "../utils/apiResponse.js";


const deleteTask =async(req,res)=>{
    try{    
    const {tittle,description}=req.body;
      const deleteTask=await taskModel.findOneAndDelete({tittle,description});
      if(deleteTask){
        return res.status(200).json(
              new ApiResponse(200, "success", "Task Deleted Successfully", {
        deleteTask
      }),
    );}    
} catch(err){
return res
      .status(500)
      .json(new ApiResponse(500, "Error", "Error in Deleting Task", err));
}


}


export default deleteTask;