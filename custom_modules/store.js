'use strict';

const redis = require("redis"),
    Q = require('q'),
    redisClient = redis.createClient(process.env.redisPort,process.env.redisHost);

 
/**
 * Function for insert into db 
 *
 * @param token
 * @param data
 */    
function insert(token, data){
    redisClient.set(token, JSON.stringify(data)); 
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
        insert : insert,
        getResultByToken :getResultByToken
    }
};