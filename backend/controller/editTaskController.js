import { User } from "../models/userModels.js";
import { taskModel } from "../models/taskModels.js";
import ApiResponse from "../utils/apiResponse.js";


const editTask = async (req, res) => {
  try {
    const userid = req.user._id;
    const { _id, ...updateFields } = req.body;

    const updatedTask = await taskModel.findOneAndUpdate(
      { _id, userId: userid },
      updateFields,
      { returnDocument: "after" }
    );

    if (updatedTask) {
      return res.status(200).json(
        new ApiResponse(200, "success", "Task Edited Successfully", {
          editTask: updatedTask,
        })
      );
    }

    return res.status(404).json(
      new ApiResponse(404, "Failed", "Task not found", null)
    );
  } catch (err) {
    return res
      .status(500)
      .json(new ApiResponse(500, "Error", "Error in Editing Task", err));
  }
};


export default editTask;