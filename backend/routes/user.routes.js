import { Router } from "express";
import {body} from "express-validator"

import * as userController from '../controllers/user.controller.js'

import * as authmiddleware from "../middleware/user.auth.js"

const router = Router();


//  1st [end point]

router.post('/register',
    body('email').isEmail().withMessage('email must be a valid email address'),
    body('password').isLength({min:3}).withMessage('password must be atleast the length of 3'),
    userController.createUserController);

    export default router;

    // [second endPoint]

    router.post('/login',
        body("email").isEmail().withMessage("Plz Enter a valid email"),
        body("password").isLength({min:3}).withMessage("Too short Password"),
        userController.userLogin
    );

//  3rd End  Point of user 
    router.get('/profile',authmiddleware.checkauth,userController.showProfile)
    router.get('/logout',authmiddleware.checkauth,userController.logoutcontroller);

    router.get('/all',authmiddleware.checkauth,userController.get_all_User)