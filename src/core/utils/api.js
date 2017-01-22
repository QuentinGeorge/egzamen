/** Exam RIA - 25/01/2017
*** QuentinGeorge/egzamen
***
*** /src/core/utils/api.js - API utils
***
*** Coded by Quentin George
**/

let fSend, fError;

fSend = function( oRequest, oResponse, oData = {}, iStatus = 200 ) {
    oResponse.status( iStatus ).json( {
        "url": `[${ oRequest.method }] ${ oRequest.url }`,
        "timestamp": Date.now(),
        "data": oData,
        "error": false,
    } );
};

fError = function( oRequest, oResponse, mError, iStatus = 500 ) {
    oResponse.status( iStatus ).json( {
        "url": `[${ oRequest.method }] ${ oRequest.url }`,
        "timestamp": Date.now(),
        "data": null,
        "error": mError instanceof Error ? mError.message : mError,
    } );
};

export {
    fSend as send,
    fError as error,
};
