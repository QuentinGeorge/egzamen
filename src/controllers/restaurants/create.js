/** Exam RIA - 25/01/2017
*** QuentinGeorge/egzamen
***
*** /src/controllers/restaurants/create.js - Create restaurant controller
***
*** Coded by Quentin George
**/

import { ObjectID } from "mongodb";

import getRestaurants from "../../models/restaurants";
import { send, error } from "../../core/utils/api";
import checkPosition from "../../core/utils/position";

export default function( oRequest, oResponse ) {

    const POST = oRequest.body;

    let iLatitude = +POST.latitude,
        iLongitude = +POST.longitude,
        sName = ( POST.name || "" ).trim(),
        sSlug = sName.toLowerCase().replace( " ", "_" ),
        sAddress = ( POST.address || "" ).trim(),
        oPosition = checkPosition( iLatitude, iLongitude ),
        aHours, oRestaurant;

    if ( !oPosition ) {
        return error( oRequest, oResponse, "Invalid position", 400 );
    }

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

    oRestaurant = {
        "latitude": oPosition.latitude,
        "longitude": oPosition.longitude,
        "created_at": new Date(),
        "updated_at": new Date(),
    };

    sName && ( oRestaurant.name = sName );
    sSlug && ( oRestaurant.slug = sSlug );
    sAddress && ( oRestaurant.address = sAddress );

    getRestaurants()
        .insertOne( oRestaurant )
        .then( () => {
            send( oRequest, oResponse, {
                "id": oRestaurant._id,
                "name": oRestaurant.name || null,
                "slug": oRestaurant.slug || null,
                "address": oRestaurant.address || null,
                "latitude": oRestaurant.latitude,
                "longitude": oRestaurant.longitude,
            }, 201 );
        } )
        .catch( ( oError ) => error( oRequest, oResponse, oError ) );

}
