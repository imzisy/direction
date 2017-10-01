const express = require('express'),
    router = express.Router(),
    handler = require('../custom_modules/handler.js')()
    store = require('../custom_modules/store.js')()
          

router.post('/route', function(req, res, next) {
    let points = req.body;
    let token = handler.triggerJob(points);
    res.json({
        "token": token
    })
});

router.get('/route/:token', function(req, res, next) {
    store.getResultByToken(req.params.token)
    .then(reply => {
        res.json(reply)
    })
});

router.get('/', function(req, res, next) {
    res.json("It is Working");
});

module.exports = router;