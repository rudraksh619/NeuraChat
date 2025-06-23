import { Router } from "express";
import * as aicontroller from "../controllers/ai.controller.js"


const router = Router();

router.get('/get-result', aicontroller.getresult)


export default router