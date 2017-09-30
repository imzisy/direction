'use strict';

const Q = require('q'),
    googleMapsClient = require('@google/maps').createClient({
    key: process.env.apiKey
});

/**
 * Function for get direction from google api 
 *
 * @param points
 * @return list of potential routes 
 */
function getDirection(points) {
    let deferred = Q.defer();
    let pointsLength = points.length;
    googleMapsClient.directions({
        origin: points[0],
        destination: points[pointsLength - 1],
        waypoints: points,
        alternatives: true,
    }, function(err, response) {
        if (err) {
            deferred.reject(err.json);
        } else {
                deferred.resolve(response);
        }
    });
    return deferred.promise;
}

/**
 * Function for calculating distance and duration 
 *
 * @param points
 * @return result of calculation
 */
function calculate(points){
    let deferred = Q.defer();
    let totalDistance = 0;
    let totalDuration = 0;
    getDirection(points)
    .then(response => { 
        let route = response.json.routes[0];
        for (var i = 0; i < route.legs.length; i++) {
            totalDistance += route.legs[i].distance.value;
            totalDuration += route.legs[i].duration.value;
        }
        let result = {
            status: "success",
            path : points,
            total_distance : totalDistance,
            total_time : totalDuration,
          }
          deferred.resolve(result);       
    })
    .catch(error => { 
        deferred.reject({status: "fail",error: 'ERROR_DESCRIPTION'});
     })
     
     return deferred.promise;
}


/**
 * Module exports.
 * @public
 */
exports = module.exports = function() {
     return {
        calculateDistance : calculate
     }
 };