/** Exam RIA - 25/01/2017
*** QuentinGeorge/egzamen
***
*** /src/models/restaurants.js - Model for restaurants
***
*** Coded by Quentin George
**/

import { db } from "../core/mongodb";

export default function() {
    return db.collection( "restaurants" );
}
