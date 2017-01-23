/** Exam RIA - 25/01/2017
*** QuentinGeorge/egzamen
***
*** /src/controllers/restaurants/destroy.js - Delete restaurants controller
***
*** Coded by Quentin George
**/

import { ObjectID } from "mongodb";
import getRestaurants from "../../models/restaurants";
import { send, error } from "../../core/utils/api";

export default function( oRequest, oResponse ) {

    let oRestaurantID;

    try {
        oRestaurantID = new ObjectID( oRequest.params.id );
    } catch ( oError ) {
        return error( oRequest, oResponse, new Error( "Invalid ID!" ), 400 );
    }

    getRestaurants()
        .deleteOne( {
            "_id": oRestaurantID,
        } )
        .then( ( { deletedCount } ) => {
            if ( deletedCount === 1 ) {
                return send( oRequest, oResponse, null, 204 );
            }

            return error( oRequest, oResponse, "Unknown deletion error", 500 );
        } )
        .catch( ( oError ) => error( oRequest, oResponse, oError ) );
}
