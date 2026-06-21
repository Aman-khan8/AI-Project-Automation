
import { User } from "../models/userModels.js";
import { taskModel } from "../models/taskModels.js";
import ApiResponse from "../utils/apiResponse.js";

const addTask =async(req,res)=>{
          
    try{

       
    const {title,description,dueDate,taskStatus, Priority}=req.body;
    const userId=req.user._id;

        
        
       const createTask=await taskModel.create({
            userId,
            title,
            description,
            dueDate,
            taskStatus,
            Priority
           });

           if(createTask){
            return res.status(200).json(
                new ApiResponse(200,"Successfull","Task created successfully",{
                    createTask
                })
            );
           }

        }catch(err){
return res
      .status(500)
      .json(new ApiResponse(500, "Error", "Error in creating Task", err));
  }
        }


export default addTask;