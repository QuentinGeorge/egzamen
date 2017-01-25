/** Exam RIA - 25/01/2017
*** QuentinGeorge/egzamen
***
*** /src/controllers/restaurants/list.js - Controller for restaurants list
***
*** Coded by Quentin George
**/

import getRestaurants from "../../models/restaurants";
import { send, error } from "../../core/utils/api";
import distance from "jeyo-distans";
import checkPosition from "../../core/utils/position";

const ARC_KILOMETER = 0.009259, // 1 décimale de lat/lng vaut X km.
    DEFAULT_RADIUS = 15,
    MAX_RADIUS = 30;

export default function( oRequest, oResponse ) {

    let oCurrentPosition = checkPosition( +oRequest.query.latitude, +oRequest.query.longitude ),
        iSearchRadius = +oRequest.query.radius;

    if ( !oCurrentPosition ) {
        return error( oRequest, oResponse, "Invalid position!", 400 );
    }

    // check & cap radius
    isNaN( iSearchRadius ) && ( iSearchRadius = DEFAULT_RADIUS );
    ( iSearchRadius < DEFAULT_RADIUS ) && ( iSearchRadius = DEFAULT_RADIUS );
    ( iSearchRadius > MAX_RADIUS ) && ( iSearchRadius = MAX_RADIUS );

    iSearchRadius *= ARC_KILOMETER; // convert radius from kilometer to arc

    getRestaurants()
        .find( {
            "latitude": {
                "$gt": oCurrentPosition.latitude - iSearchRadius,
                "$lt": oCurrentPosition.latitude + iSearchRadius,
            },
            "longitude": {
                "$gt": oCurrentPosition.longitude - iSearchRadius,
                "$lt": oCurrentPosition.longitude + iSearchRadius,
            },
        } )
        .toArray()
        .then( ( aRestaurants = [] ) => {
            let aCleanRestaurants;

            aCleanRestaurants = aRestaurants.map( ( { _id, slug, name, address, latitude, longitude } ) => {
                return {
                    "id": _id,
                    name, slug, address, latitude, longitude,
                    "distance": distance( oCurrentPosition, { latitude, longitude } ) * 1000,
                };
            } );

            // sort by distance
            aCleanRestaurants.sort( ( oRestaurantOne, oRestaurantTwo ) => oRestaurantOne.distance - oRestaurantTwo.distance );

            send( oRequest, oResponse, aCleanRestaurants );
        } )
        .catch( ( oError ) => error( oRequest, oResponse, oError ) );
}
