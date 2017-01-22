/** Exam RIA - 25/01/2017
*** QuentinGeorge/egzamen
***
*** /src/server.js - Main entry point
***
*** Coded by Quentin George
**/

import { init as initDB } from "./core/mongodb";
import { init as initExpress } from "./core/express";

const APP_PORT = 12345;

initDB()
    .then( () => initExpress( APP_PORT ) );
