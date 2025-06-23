import {validationResult} from 'express-validator'
import User from '../models/user.modal.js'
import * as createProjectservices from '../services/project.js'

export const projectcontroler = async (req,res) =>{
    console.log("project controller called");
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({err:errors.array()})
    }
    
    try {
        if(!req.user)
        {
            return res.status(401).json({error:"Unauthorized User"});
        }
        console.log({ data : req.user});
        const {name} = req.body; 
        const email =  req.user.email;
        const logined_user = await User.findOne({email:email});
        const logined_id = logined_user._id;
        const project = await createProjectservices.createProject({name:name,userid:logined_id});
        return res.status(201).json({project:project});
    } catch (error) {
        console.log(error);
        return res.status(500).json({error : error.message})
    }
}


export const getProjects = async (req,res)=>{
    console.log("getProjects controller called");
    const  err = validationResult(req);
    if(!err.isEmpty())
    {
        return res.status(400).json({err:err.array()});
    }

    try {
       const logined_user = await User.findOne({email:req.user.email});
       if(!logined_user)
       {
        return res.status(404).json({err:"user not found"});
       }
       const allProject = await createProjectservices.getallprojectsbyuserid({user_id : logined_user._id});
       return res.status(200).json({projects:allProject});

    } catch (error) {
        console.log(error);
        return res.status(404).json({error:error.message});
    }
}  


export const add_user_to_project = async(req,res)=>{
    
const errors = validationResult(req);
if(!errors.isEmpty())
{
    return res.status(400).json({errors : errors.array()});

}

try {
    const{project_id,users} = req.body;
    const logined_user = await User.findOne({email : req.user.email})
    if(!logined_user)
    {
        console.log("plxz first logined the user ");
        return res.status(404).json({error:"user not found"});
    } 
    const user_id = logined_user._id;
    const updated_project = await createProjectservices.add_user_to_project({project_id, users, user_id });
    return res.status(200).json({project:updated_project});
} catch (error) {

    console.log("erro during  addition of user in project controller ");
    return res.status(500).json({error : error.message});
}

}

export const getProjectsById = async (req,res)=>{
    const {project_Id} = req.params;
    console.log(project_Id);
    try {
      const project = await createProjectservices.getProjectById({project_id: project_Id})
      return res.status(200).json({project});
    } catch (error) {
        res.status(400).json({err:error.message});
    }
   
}
