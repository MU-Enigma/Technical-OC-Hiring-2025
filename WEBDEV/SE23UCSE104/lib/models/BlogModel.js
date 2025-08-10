import mongoose from "mongoose";
const blogSchema =  new mongoose.Schema({
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
    category:
    {
        type:String,
        required:true
    },
    author:
    {
        type:String,
        required:true
    },
    image:
    {
        type:String,
        required:true
    },
    authorImg:
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


const blogModel =  mongoose.models.blog || mongoose.model('blog', blogSchema);
export default blogModel