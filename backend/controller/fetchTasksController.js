import {User} from "../models/userModels.js";
import { taskModel } from "../models/taskModels.js";
import ApiResponse from "../utils/apiResponse.js";

const fetchTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const tasks = await taskModel.find({ userId });

    return res
      .status(200)
      .json(new ApiResponse(200, "Success", "Tasks fetched successfully", tasks));
  } catch (err) {
    return res
      .status(500)
      .json(new ApiResponse(500, "Error", "Error in Fetching Tasks", err));
  }
};

export default fetchTasks;