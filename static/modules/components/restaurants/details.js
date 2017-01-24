/** Exam RIA - 25/01/2017
*** QuentinGeorge/egzamen
***
*** /static/modules/components/restaurants/details.js - Restaurants details vue component
***
*** Coded by Quentin George
**/

import Vue from "vue";
import reqwest from "reqwest";

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
                <p>Latitude&nbsp;: {{ restaurant.latitude }}</p>
                <p>Longitude&nbsp;: {{ restaurant.longitude }}</p>
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
                <p v-if="!restaurant.open">Fermer</p>
                <p v-if="restaurant.open">Ouvert</p>
            </div>
        </div>
    `,
    mounted() {
        this.fetchInfos( this.$route.params.id );
    },
    "methods": {
        fetchInfos( sRestaurantId ) {
            reqwest( {
                "url": `/restaurants/${ sRestaurantId }`,
                "method": "get",
                "data": {},
            } )
            .then( ( oResponse ) => {
                this.restaurant = oResponse.data;
                console.log(this.restaurant.hours);
                this.loaded = true;
            } )
            .catch( this.showError );
        },
        showError( { message } ) {
            this.loaded = true;
            this.error = message;
        },
    },
} );

export default oRestaurantDetails;
