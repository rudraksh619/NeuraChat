import { Router } from "express";
import {body} from "express-validator";
import * as authmiddleware from '../middleware/user.auth.js'
import * as projectController from '../controllers/project.controller.js'
const router = Router();

router.post('/create',
    authmiddleware.checkauth,
    body('name').isString().withMessage("Project Name in String Format"),
    projectController.projectcontroler

)
router.get('/getall',authmiddleware.checkauth,projectController.getProjects);
export default router;

router.put('/add-user',
    authmiddleware.checkauth,
    body('project_id')
        .isString().withMessage('Project ID must be a string'),
    body('users')
        .isArray({ min: 1 }).withMessage('Users must be a non-empty array'),
    body('users.*')
        .isString().withMessage('Each user must be a string'),
projectController.add_user_to_project)

router.get('/get_project/:project_Id',
    authmiddleware.checkauth,
projectController.getProjectsById) 