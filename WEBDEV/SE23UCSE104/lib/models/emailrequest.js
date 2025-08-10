import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title:
    {
        type:String,
        required:true
    },
    description:
    {
        type:String,
        required:true
    },
    image:
    {
        type:String,
        required:true
    },
     date:
    {
        type:Date,
        default:Date.now()
    },
});

const eventModel = mongoose.models.event || mongoose.model("event", eventSchema);
export default eventModel;
