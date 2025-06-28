import projectModel from '../models/project.model.js'
import mongoose from 'mongoose';
import User from '../models/user.modal.js';

 export const createProject = async({name,userid}) =>{
    if(!name)
    {
        throw new Error("please enter the name of the project ")
    }
    if(!userid)
    {
        throw new Error("Please entter the id of the user ")
    }

    const project = await projectModel.create({
        name:name,
        users:[userid],
    })

    return project;
 }
 
export const getallprojectsbyuserid = async({user_id})=>{
    const projects = await projectModel.find({
        users:user_id
    })
    return projects;
}

export const add_user_to_project = async ({project_id, users, user_id }) => {
   
    if(!project_id)
    {
        throw new Error("project id is required");
    }
    if(users.length === 0)
    {
        throw new Error("users array shoud not be empty");
    }
    if (!mongoose.Types.ObjectId.isValid(project_id)) {
        throw new Error("Invalid project id");
    }
    if(!mongoose.Types.ObjectId.isValid(user_id))
    {
        throw new Error("invalid token of user ");
    }
    for (const id of users) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error(`Invalid user id: ${id}`);
        }
    }
     const project = await projectModel.findOne({
        _id : project_id,
        users:user_id,
     })
     if(!project){
        throw new Error("unauthorized user make the request ")
     }
     
     const updated_project = await projectModel.findOneAndUpdate({
        _id : project_id},
     {
         $addToSet : {
                users:{
                    $each : users
                }
            }
     },
     {
        new:true
     }
           
        
     )
     return updated_project;
}


export const getProjectById = async ({project_id}) => {
    if(!project_id)
    {
        throw new Error ("project_id is needed");
    }
    if(!mongoose.Types.ObjectId.isValid(project_id)){
        throw new Error("not a valid project_id");
    }
    const project = await projectModel.findOne({
        _id: project_id,
    }).populate('users')

    return project ;
}
export const updateFileTree = async ({ project_id, fileTree }) => {
    if (!project_id) {
        throw new Error("project_id is required");
    }
    if (!mongoose.Types.ObjectId.isValid(project_id)) {
        throw new Error("Invalid project_id");
    }
    if (!fileTree) {
        throw new Error("fileTree is required");
    }

    const updatedProject = await projectModel.findOneAndUpdate(
        { _id: project_id },
        { $set: { fileTree } },
        { new: true }
    );

    if (!updatedProject) {
        throw new Error("Project not found");
    }

    return updatedProject;
};
