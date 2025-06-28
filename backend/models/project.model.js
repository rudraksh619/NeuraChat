import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        unique:true,
        
    },

    //  no of users involved in that project it store the id 

    users:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        }
    ],

    fileTree : {
        type:Object,
        default:{}
    },



})  

const Project = mongoose.model('Project',projectSchema)
export default Project;