import { model, Schema} from "mongoose";

const TaskSchema=new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    dueDate:{
        type:Date,
        required:true,
    },
    taskStatus:{
        type:String,
        required:true,
    },
   Priority:{
    type:String,
    required:true,
   }
     
},{
    timestamps:true
},);
TaskSchema.index({userId:1});
export const taskModel = new model("TaskSchema",TaskSchema);