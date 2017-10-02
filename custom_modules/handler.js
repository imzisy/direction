'use strict';

const EventEmitter = require('events').EventEmitter,
      eventEmitter = new EventEmitter(),
      direction = require('./direction.js')(),
      store = require('./store.js')(),
      shortid = require('shortid');


/**
 * Function for generating Token
 *
 * @return token
 */
function generateToken() { 
    return shortid();
}

/**
 * Function for triggering job event 
 *
 * @param points
 * @return token
 */
function triggerJob(points){
    let token = generateToken()
    eventEmitter.emit('job', {
        points: points,
        token: token
    })
    return token;
}

eventEmitter.on('job', function(job) {
    store.set(job.token,{status: "in progress"})
    .then(reply =>{
        direction.calculate(job.points)
        .then(result => { 
          store.set(job.token,result);
        })
        .catch(error => { 
            store.set(job.token,error);
         })   
    })
})


/**
 * Module exports.
 * @public
 */
exports = module.exports = function() {
    return {
        triggerJob : triggerJob
    }
};