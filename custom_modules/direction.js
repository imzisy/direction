"use strict";

const Q = require("q");
const googleMapsClient = require("@google/maps").createClient();

/**
 * Function for sort an array of points by array of 
 * indexes of original array in sorted order
 * 
 * @param points
 * @param waypointOrder
 * @return list of sorted Points
 */
function sortPointsByWaypointOrder(points,waypointOrder){
    let sortedPoints = [];
    for (let i = 0; i < waypointOrder.length; i++) {
        sortedPoints.push(points[waypointOrder[i]]);   
    }
    return sortedPoints;
}

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
        optimize : true,
    }, function(err, response) {
        if (err) {
            return deferred.reject(err.json);
        }
        if(response.json.status == "OK"){
            return deferred.resolve(response.json);
        } 
        deferred.reject(response.json.status);        
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
        let route = response.routes[0];
        for (let i = 0; i < route.legs.length; i++) {
            totalDistance += route.legs[i].distance.value;
            totalDuration += route.legs[i].duration.value;
        }
        let sortedPoints = sortPointsByWaypointOrder(points,route.waypoint_order)
        let result = {
            status: "success",
            path : sortedPoints,
            total_distance : totalDistance,
            total_time : totalDuration,
        };
        deferred.resolve(result);
    })
    .catch(error => {
        deferred.reject({status: "fail", error: "ERROR_DESCRIPTION", googleError:error});
    })
    return deferred.promise;
}

/**
 * Module exports.
 * @public
 */
exports = module.exports = function() {
    return {
        calculate : calculate
    }
 };