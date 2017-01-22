/** Exam RIA - 25/01/2017
*** QuentinGeorge/egzamen
***
*** /src/routes/restaurants.js - API Routes for restaurants
***
*** Coded by Quentin George
**/

import { Router } from "express";

import list from "../controllers/restaurants/list";
import details from "../controllers/restaurants/details";
import create from "../controllers/restaurants/create";
// import update from "../controllers/restaurants/update";
import destroy from "../controllers/restaurants/destroy";

let oRouter = new Router();

oRouter.get( "/restaurants", list );
oRouter.get( "/restaurants/:id", details );
oRouter.post( "/restaurants", create );
// oRouter.patch( "/restaurants/:id", update );
oRouter.delete( "/restaurants/:id", destroy );

export default oRouter;
