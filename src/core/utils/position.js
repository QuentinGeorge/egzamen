/** Exam RIA - 25/01/2017
*** QuentinGeorge/egzamen
***
*** /src/core/utils/api.js - Position checker utility
***
*** Coded by Quentin George
**/

export default function( iLatitude, iLongitude ) {
    if ( isNaN( iLatitude ) || isNaN( iLongitude ) ) {
        return false;
    }

    if ( iLatitude < -90 || iLatitude > 90 ) {
        return false;
    }

    if ( iLongitude < -180 || iLongitude > 180 ) {
        return false;
    }

    return {
        "latitude": iLatitude,
        "longitude": iLongitude,
    };
}
