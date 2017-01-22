/** Exam RIA - 25/01/2017
*** QuentinGeorge/egzamen
***
*** /src/controllers/system/ping.js - Controller for system ping
***
*** Coded by Quentin George
**/

import { send } from "../../core/utils/api";

export default function( oRequest, oResponse ) {
    send( oRequest, oResponse, true );
}
