/** Exam RIA - 25/01/2017
*** QuentinGeorge/egzamen
***
*** /static/modules/components/restaurants/list.js - Restaurants list vue component
***
*** Coded by Quentin George
**/

import Vue from "vue";
import reqwest from "reqwest";
import getLocation from "../../utils/location-manager.js";

let oRestaurantsList = Vue.component( "restaurants-list", {
    "data": function() {
        return {
            "loaded": false,
            "restaurants": [],
            "error": null,
        };
    },
    "template": `
        <div class="restaurants-list">
            <div class="loading" v-if="!loaded">
                <p>loading…</p>
            </div>
            <div class="error" v-if="loaded && error">
                <p>
                    <strong>Error:</strong> {{ error }}
                </p>
            </div>
            <ul v-if="loaded">
                <li v-for="elt in restaurants">
                    <router-link :to="'/' + elt.id">
                        <strong>{{ elt.restaurant ? elt.restaurant.name : "Unknown" }}</strong>
                        <address>{{ elt.address }}</address>
                        <span class="distance">{{ elt.distance }}m</span>
                    </router-link>
                </li>
            </ul>
        </div>
    `,
    "methods": {
        updatePosition() {
            // 1. get user's position
            return getLocation()
                .then( ( { coords } ) => {
                    // 2. get restaurants at position
                    return reqwest( {
                        "url": "/restaurants",
                        "method": "get",
                        "data": {
                            "latitude": coords.latitude,
                            "longitude": coords.longitude,
                        },
                    } );
                } )
                .catch( this.showError );
        },
        showError( { message } ) {
            this.loaded = true;
            this.error = message;
        },
    },
} );

export default oRestaurantsList;
