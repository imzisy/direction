"use strict";

const redis = require("redis");
const Q = require('q');
const redisClient = redis.createClient(6379,"redis");

/**
 * Function for set into db
 *
 * @param token
 * @param data
 */    
function set(token, data){
    let deferred = Q.defer();
    redisClient.set(token, JSON.stringify(data), function (err, reply) {
        if(err){
            return deferred.reject(err);
        }
        deferred.resolve(reply);
    }); 
    return deferred.promise;
}

/**
 * Function for get data from db 
 *
 * @param token
 * @return resolve data
 */    
function getResultByToken(token){
    let deferred = Q.defer();
    redisClient.get(token, function(err, reply) {
        if(reply == null){
            return deferred.reject({"error":"TOKEN DOESNOT EXIST"})
        }
        deferred.resolve(JSON.parse(reply));    
    });
    return deferred.promise;
}

/**
 * Module exports.
 * @public
 */
exports = module.exports = function() {
    return {
        set : set,
        getResultByToken :getResultByToken
    }
};