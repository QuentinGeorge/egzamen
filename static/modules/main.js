/** Exam RIA - 25/01/2017
*** QuentinGeorge/egzamen
***
*** /static/modules/main.js - Main entry file
***
*** Coded by Quentin George
**/

import Vue from "vue";
import VueRouter from "vue-router";

Vue.use( VueRouter );

import RestaurantsList from "./components/restaurants/list";
import RestaurantsDetails from "./components/restaurants/details";

let oRouter, oApp;

oRouter = new VueRouter( {
    "routes": [
        { "path": "/", "component": RestaurantsList },
        { "path": "/:id", "component": RestaurantsDetails },
    ],
} );

oApp = new Vue( {
    "template": `
        <div class="wrapper">
            <header>
                <h1>Egzamen</h1>
            </header>
            <main>
                <router-view></router-view>
            </main>
            <footer>
                <a href="https://github.com/QuentinGeorge/egzamen">QuentinGeorge/egzamen</a>
            </footer>
        </div>
    `,
    "router": oRouter,
} );

oApp.$mount( "#app" );
