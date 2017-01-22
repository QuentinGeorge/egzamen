/** Exam RIA - 25/01/2017
*** QuentinGeorge/egzamen
***
*** /src/controllers/system/echo.js - Controller for system echo
***
*** Coded by Quentin George
**/

import { send } from "../../core/utils/api";

export default function( oRequest, oResponse ) {
    let sEcho = oRequest.query.echo || "hello, world!";

    send( oRequest, oResponse, sEcho );
}
