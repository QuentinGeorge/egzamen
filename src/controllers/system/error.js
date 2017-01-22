/** Exam RIA - 25/01/2017
*** QuentinGeorge/egzamen
***
*** /src/controllers/system/error.js - Controller for system error
***
*** Coded by Quentin George
**/

import { error } from "../../core/utils/api";

export default function( oRequest, oResponse ) {
    error( oRequest, oResponse, { "message": "There's an error!" } );
}
