const express = require("express");
const router = express.Router();
const handler = require("../custom_modules/handler.js")();
const store = require("../custom_modules/store.js")();

router.post("/route", function(req, res, next) {
    let points = req.body;
    let token = handler.triggerJob(points);
    res.json({
        "token": token
    });
});

router.get("/route/:token", function(req, res, next) {
    store.getResultByToken(req.params.token)
    .then(reply => {
        res.json(reply)
    })
    .catch(error => {
        res.json(error)
    });
});

router.get("/", function(req, res, next) {
    res.json("It is Working");
});

module.exports = router;