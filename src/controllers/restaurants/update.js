/** Exam RIA - 25/01/2017
*** QuentinGeorge/egzamen
***
*** /src/controllers/restaurants/update.js - Controller for restaurants update
***
*** Coded by Quentin George
**/

import { ObjectID } from "mongodb";
import getRestaurants from "../../models/restaurants";
import { send, error } from "../../core/utils/api";
import distance from "jeyo-distans";
import checkPosition from "../../core/utils/position";

const MAX_MOVE_DISTANCE = 0.1; // in km

export default function( oRequest, oResponse ) {

    // 1. get values
    const POST = oRequest.body;

    let oRestaurantID,
        sAddress = ( POST.address || "" ).trim(),
        iLatitude = POST.latitude,
        iLongitude = POST.longitude,
        aHours = [],
        aModifications = [],
        oPosition;

    aHours = [
      [
        POST.monday_opening,
        POST.monday_closing
      ],
      [
        POST.tuesday_opening,
        POST.tuesday_closing
      ],
      [
        POST.wednesday_opening,
        POST.wednesday_closing
      ],
      [
        POST.thursday_opening,
        POST.thursday_closing
      ],
      [
        POST.friday_opening,
        POST.friday_closing
      ],
      [
        POST.saturday_opening,
        POST.saturday_closing
      ],
      [
        POST.sunday_opening,
        POST.sunday_closing
      ]
    ];

    try {
        oRestaurantID = new ObjectID( oRequest.params.id );
    } catch ( oError ) {
        return error( oRequest, oResponse, new Error( "Invalid ID!" ), 400 );
    }

    // 2. check if restaurant exists
    getRestaurants()
        .findOne( {
            "_id": oRestaurantID,
        } )
        .then( ( oRestaurant ) => {
            if ( !oRestaurant ) {
                return error( oRequest, oResponse, new Error( "Unknown Restaurant" ), 404 );
            }

        // 3. check values
            // 3a. check position
            if ( iLatitude != null && iLongitude != null ) {
                oPosition = checkPosition( +iLatitude, +iLongitude );
                if ( !oPosition ) {
                    return error( oRequest, oResponse, new Error( "Invalid position" ), 400 );
                }

                // if position ≠ old position, check move distance
                if ( oRestaurant.latitude !== oPosition.latitude || oRestaurant.longitude !== oPosition.longitude ) {
                    if ( distance( oPosition, oRestaurant ) > MAX_MOVE_DISTANCE ) {
                        return error( oRequest, oResponse, new Error( "Movement is too big" ), 400 );
                    }
                    oRestaurant.latitude = oPosition.latitude;
                    oRestaurant.longitude = oPosition.longitude;
                    aModifications.push( "latitude", "longitude" );
                }
            }

            // 3b. check address
            if ( sAddress ) {
                oRestaurant.address = sAddress;
                aModifications.push( "address" );
            }

            // 3c. check hours
            if ( aHours ) {
                oRestaurant.hours = aHours;
                aModifications.push( "hours" );
            }

            // 4. apply modifications
            return checkRestaurant( oRestaurantID )
                .then( () => {

                    let oModificationsToApply = {};

                    if ( aModifications.length === 0 ) {
                        return error( oRequest, oResponse, new Error( "No changes" ), 400 );
                    }

                    aModifications.forEach( ( sPropertyName ) => {
                        oModificationsToApply[ sPropertyName ] = oRestaurant[ sPropertyName ];
                    } );

                    oModificationsToApply.updated_at = new Date();

                    return getRestaurants()
                        .updateOne( {
                            "_id": oRestaurant._id,
                        }, {
                            "$set": oModificationsToApply,
                        } )
                        .then( ( { matchedCount, modifiedCount } ) => {
                            if ( matchedCount !== 1 || modifiedCount !== 1 ) {
                                return error( oRequest, oResponse, new Error( "Unknown save error" ), 500 );
                            }

                            return send( oRequest, oResponse, null, 204 );
                        } );
                } );
        } )
        .catch( ( oError ) => error( oRequest, oResponse, oError ) );
}
