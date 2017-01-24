/** Exam RIA - 25/01/2017
*** QuentinGeorge/egzamen
***
*** /src/controllers/restaurants/details.js - Controller for restaurants details
***
*** Coded by Quentin George
**/

import { ObjectID } from "mongodb";
import getRestaurants from "../../models/restaurants";
import { send, error } from "../../core/utils/api";

export default function( oRequest, oResponse ) {

    let sRestaurantID = ( oRequest.params.id || "" ).trim();

    if ( !sRestaurantID ) {
        error( oRequest, oResponse, "Invalid ID!", 400 );
    }

    getRestaurants()
        .findOne( {
            "_id": new ObjectID( sRestaurantID ),
        } )
        .then( ( oRestaurant ) => {
            if ( !oRestaurant ) {
                return error( oRequest, oResponse, "Unknown Restaurant", 404 );
            }

            let { slug, name, address, latitude, longitude, hours } = oRestaurant,
                oCleanRestaurant,
                bIsOpen = false,
                iDay = new Date().getDay(),
                iHour = new Date().getHours() + ( new Date().getMinutes() / 60 ); // minutes divided by 60 to change number range from 0 to 60 into 0.0 to 1.0 because on our data half hours aren't represented by 30 but by 0.5

            if ( iDay === 0 ) {
                iDay = 7; // by default sunday is the number 0 and in the data base it's the 7th drawer of hours array not the first one
            }

            if ( iHour >= hours[ iDay - 1 ][ 0 ] && iHour <= hours[ iDay - 1 ][ 1 ] ) {
                bIsOpen = true;
            }

            oCleanRestaurant = {
                slug, name, address, latitude, longitude, hours,
                "is-open": bIsOpen,
            };

            send( oRequest, oResponse, oCleanRestaurant );
        } )
        .catch( ( oError ) => error( oRequest, oResponse, oError ) );
}
