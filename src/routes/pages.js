/** Exam RIA - 25/01/2017
*** QuentinGeorge/egzamen
***
*** /src/routes/pages.js - Pages Routes
***
*** Coded by Quentin George
**/

import { Router } from "express";
import homepageController from "../controllers/pages/home";

let oRouter = new Router();

oRouter.get( "/", homepageController );

export default oRouter;
