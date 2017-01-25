/** Exam RIA - 25/01/2017
*** QuentinGeorge/egzamen
***
*** /static/modules/components/restaurants/list.js - Restaurants list vue component
***
*** Coded by Quentin George
**/

import Vue from "vue";
import reqwest from "reqwest";

const GEOLOCATION_OPTIONS = { "enableHighAccuracy": true };

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
                        <strong>{{ elt.name ? elt.name : "Unknown" }}</strong>
                        <address>{{ elt.address }}</address>
                        <p class="fermer" v-if="!elt.open">Fermer</p>
                        <p class="ouvert" v-if="elt.open">Ouvert</p>
                    </router-link>
                </li>
            </ul>
        </div>
    `,
    mounted() {
        this.getPosition();
    },
    "methods": {
        getPosition() {
            // 1. get user's position
            navigator.geolocation.getCurrentPosition( this.getRestaurantsList, this.geoError, GEOLOCATION_OPTIONS );
        },
        getRestaurantsList( { coords } ) {
            console.log( "latitude:", coords.latitude );
            console.log( "longitude:", coords.longitude );
            // 2. get restaurants at position
            reqwest( {
                "url": "/restaurants",
                "method": "get",
                "data": {
                    "latitude": coords.latitude,
                    "longitude": coords.longitude,
                },
            } )
            .then( ( oResponse ) => {
                // 3. get restaurants open status
                this.restaurants = oResponse.data.map( ( oRestaurant ) => {
                    oRestaurant.open = false;
                    reqwest( {
                        "url": `/restaurants/${ oRestaurant.id }`,
                        "method": "get",
                        "data": {},
                    } )
                    .then( ( oResp ) => {
                        oRestaurant.open = oResp.data.open;
                    } )
                    .catch( this.showError );

                    return oRestaurant;
                } );
                this.loaded = true;
            } )
            .catch( this.showError );
        },
        showError( oError ) {
            this.loaded = true;
            this.error = oError;
        },
    },
} );

export default oRestaurantsList;
