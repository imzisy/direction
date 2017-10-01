'use strict';

const Q = require('q'),
    googleMapsClient = require('@google/maps').createClient();

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
        alternatives: true
    }, function(err, response) {
        if (err) {
            deferred.reject(err.json);
        } else {
                if(response.json.status == 'OK'){ 
                    deferred.resolve(response.json);
                }
                else if(response.json.status =='OVER_QUERY_LIMIT'){
                    deferred.reject('OVER_QUERY_LIMIT');
                }
                else if(response.json.status =='REQUEST_DENIED'){
                    deferred.reject('REQUEST_DENIED');
                }
                else  if(response.json.status =='ZERO_RESULTS'){
                    deferred.reject('ZERO_RESULTS');
                }
                else if(response.json.status == 'INVALID_REQUEST'){    
                    deferred.reject('ZERO_RESULTS');
                }
                else if(response.json.status == 'UNKNOWN_ERROR'){ 
                    deferred.reject('UNKNOWN_ERROR');
                }
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
        let route = response.routes[0];
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
        deferred.reject({status: "fail",error: 'ERROR_DESCRIPTION',googleError:error});
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