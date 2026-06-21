import { User } from "../models/userModels.js";
import { taskModel } from "../models/taskModels.js";
import ApiResponse from "../utils/apiResponse.js";


const deleteTask = async (req, res) => {
  try {
    const userId = req.user._id;
    const { _id } = req.body;

    const deletedTask = await taskModel.findOneAndDelete({ _id, userId });
    if (!deletedTask) {
      return res
        .status(404)
        .json(new ApiResponse(404, "Failed", "Task not found", null));
    }

    return res.status(200).json(
      new ApiResponse(200, "success", "Task Deleted Successfully", {
        deletedTask,
      })
    );
  } catch (err) {
    return res
      .status(500)
      .json(new ApiResponse(500, "Error", "Error in Deleting Task", err));
  }
};


export default deleteTask;