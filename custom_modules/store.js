'use strict';

const redis = require("redis"),
    Q = require('q'),
    redisClient = redis.createClient(6379,'redis');

 
/**
 * Function for insert into db 
 *
 * @param token
 * @param data
 */    
function insert(token, data){
    console.log(data);
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
        if(reply ==null){
            deferred.resolve({ "error":"TOKEN DOESNOT EXIST"})
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
        insert : insert,
        getResultByToken :getResultByToken
    }
};