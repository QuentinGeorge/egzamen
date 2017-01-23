/** Exam RIA - 25/01/2017
*** QuentinGeorge/egzamen
***
*** /src/controllers/restaurants/create.js - Create restaurant controller
***
*** Coded by Quentin George
**/

import getRestaurants from "../../models/restaurants";
import { send, error } from "../../core/utils/api";
import checkPosition from "../../core/utils/position";

export default function( oRequest, oResponse ) {

    const POST = oRequest.body;

    let iLatitude = +POST.latitude,
        iLongitude = +POST.longitude,
        sName = ( POST.name || "" ).trim(),
        sSlug = sName.toLowerCase().replace( " ", "-" ),
        sAddress = ( POST.address || "" ).trim(),
        oPosition = checkPosition( iLatitude, iLongitude ),
        aHours = POST.hours,
        oRestaurant;

    if ( !oPosition ) {
        return error( oRequest, oResponse, "Invalid position", 400 );
    }

    oRestaurant = {
        "latitude": oPosition.latitude,
        "longitude": oPosition.longitude,
    };

    sName && ( oRestaurant.name = sName );
    sSlug && ( oRestaurant.slug = sSlug );
    sAddress && ( oRestaurant.address = sAddress );
    aHours && ( oRestaurant.hours = aHours );

    getRestaurants()
        .insertOne( oRestaurant )
        .then( () => {
            send( oRequest, oResponse, {
                "slug": oRestaurant.slug,
                "name": oRestaurant.name || null,
                "address": oRestaurant.address || null,
                "latitude": oRestaurant.latitude,
                "longitude": oRestaurant.longitude,
                "hours": oRestaurant.hours,
            }, 201 );
        } )
        .catch( ( oError ) => error( oRequest, oResponse, oError ) );

}
