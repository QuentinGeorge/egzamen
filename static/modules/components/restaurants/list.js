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
                        <span class="is-open">{{ elt.bIsOpen }}</span>
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
            navigator.geolocation.getCurrentPosition( this.geoSuccess, this.geoError, GEOLOCATION_OPTIONS );
        },
        geoSuccess( { coords } ) {
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
                "success": this.ajaxSuccess,
                "error": this.showError,
            } );
        },
        ajaxSuccess( oResponse ) {
            console.log( "response", oResponse );
            this.loaded = true;
            this.restaurants = oResponse.data;
        },
        showError( oError ) {
            this.loaded = true;
            this.error = oError;
        },
    },
} );

export default oRestaurantsList;
