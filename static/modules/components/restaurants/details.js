/** Exam RIA - 25/01/2017
*** QuentinGeorge/egzamen
***
*** /static/modules/components/restaurants/details.js - Restaurants details vue component
***
*** Coded by Quentin George
**/

import Vue from "vue";
import reqwest from "reqwest";
import distance from "jeyo-distans";
import checkPosition from "../../../../src/core/utils/position";

const GEOLOCATION_OPTIONS = { "enableHighAccuracy": true };

let oRestaurantDetails = Vue.component( "restaurant-details", {
    "data": function() {
        return {
            "loaded": false,
            "restaurant": {},
            "error": null,
        };
    },
    "template": `
        <div class="restaurant-details">
            <router-link to="/">&lsaquo; retour</router-link>
            <div class="loading" v-if="!loaded">
                <p>loading…</p>
            </div>
            <div class="error" v-if="loaded && error">
                <p>
                    <strong>Error:</strong> {{ error }}
                </p>
            </div>
            <div v-if="loaded">
                <h2>{{ restaurant.name ? restaurant.name : "Unknown" }}<span> ({{ restaurant.slug }})</span></h2>
                <address>Address&nbsp;: {{ restaurant.address }}</address>
                <h3>Position&nbsp;: <span>{{ restaurant.distance }} m</span></h3>
                <p>Latitude&nbsp;: {{ restaurant.latitude }}</p>
                <p>Longitude&nbsp;: {{ restaurant.longitude }}</p>
                <h3>Horaires</h3>
                <table>
                    <tbody>
                        <tr>
                            <td></td>
                            <td><strong>Ouverture</strong></td>
                            <td><strong>Fermeture</strong></td>
                        </tr>
                        <tr>
                            <td><strong>Lundi</strong></td>
                            <td>{{ restaurant.hours[ 0 ][ 0 ] }}</td>
                            <td>{{ restaurant.hours[ 0 ][ 1 ] }}</td>
                        </tr>
                        <tr>
                            <td><strong>Mardi</strong></td>
                            <td>{{ restaurant.hours[ 1 ][ 0 ] }}</td>
                            <td>{{ restaurant.hours[ 1 ][ 1 ] }}</td>
                        </tr>
                        <tr>
                            <td><strong>Mercredi</strong></td>
                            <td>{{ restaurant.hours[ 2 ][ 0 ] }}</td>
                            <td>{{ restaurant.hours[ 2 ][ 1 ] }}</td>
                        </tr>
                        <tr>
                            <td><strong>Jeudi</strong></td>
                            <td>{{ restaurant.hours[ 3 ][ 0 ] }}</td>
                            <td>{{ restaurant.hours[ 3 ][ 1 ] }}</td>
                        </tr>
                        <tr>
                            <td><strong>Vendredi</strong></td>
                            <td>{{ restaurant.hours[ 4 ][ 0 ] }}</td>
                            <td>{{ restaurant.hours[ 4 ][ 1 ] }}</td>
                        </tr>
                        <tr>
                            <td><strong>Samedi</strong></td>
                            <td>{{ restaurant.hours[ 5 ][ 0 ] }}</td>
                            <td>{{ restaurant.hours[ 5 ][ 1 ] }}</td>
                        </tr>
                    </tbody>
                </table>
                <p class="fermer" v-if="!restaurant.open">Fermer</p>
                <p class="ouvert" v-if="restaurant.open">Ouvert</p>
            </div>
        </div>
    `,
    mounted() {
        // 1. get user's position
        navigator.geolocation.getCurrentPosition( this.fetchInfos, this.showError, GEOLOCATION_OPTIONS );
    },
    "methods": {
        fetchInfos( { coords } ) {

            let oCurrentPosition = checkPosition( coords.latitude, coords.longitude ),
                oRestaurantPosition;

            // 2. get informations
            reqwest( {
                "url": `/restaurants/${ this.$route.params.id }`,
                "method": "get",
                "data": {},
            } )
            .then( ( oResponse ) => {
                this.restaurant = oResponse.data;
                // 3. get distance
                oRestaurantPosition = {
                    "latitude": this.restaurant.latitude,
                    "longitude": this.restaurant.longitude,
                };
                this.restaurant.distance = distance( oCurrentPosition, oRestaurantPosition ) * 1000;
                this.prepareHours();
                this.loaded = true;
            } )
            .catch( this.showError );
        },
        prepareHours() {
            // 4. reformat hours
            let aSplited = [],
                iCountDay = 0,
                iCountHour = 0,
                sPrepared;

            this.restaurant.hours.forEach( ( aElt, i ) => {
                iCountDay = i;
                aElt.forEach( ( iElt, j ) => {
                    iCountHour = j;
                    aSplited = iElt.toString().split( "." );

                    if ( aSplited.length > 2 || aSplited.length === null ) {
                        this.showError( "Wrong hour format !", 400 );
                    }

                    if ( aSplited.length === 2 ) {
                        aSplited[ 1 ] *= 6;
                        sPrepared = `${ aSplited[ 0 ] }:${ aSplited[ 1 ] }`;
                    } else {
                        sPrepared = `${ aSplited[ 0 ] }:00`;
                    }
                    this.restaurant.hours[ iCountDay ][ iCountHour ] = sPrepared;
                } );
            } );
        },
        showError( oError ) {
            this.loaded = true;
            this.error = oError;
        },
    },
} );

export default oRestaurantDetails;
