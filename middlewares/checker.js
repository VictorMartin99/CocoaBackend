const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const {connection} = require("../config.db");
const {getUserFromToken} = require("../token");


function checkPostEventValues(req, res, next) {

    const event = req.body;

    const fields = Object.entries(event).length;

    let counter = 0;

    if (event.name === undefined || event.theme === undefined || event.eventdate === undefined) {
        next("Missing parameters");
        return
    }

    //Check if there is any wrong field
    for (const item in event) {
        if (item === "name" || item === "theme" || item === "eventdate") {
            counter++;
        }
    }

    if (counter < fields) {
        next("Invalid parameters");
        return
    }

    //Check if there is any empty field
    for (const item in event) {
        if (event[item] === "") {
            next("All fields must be filled")
            return
        }
    }


    next();
}



module.exports = {checkPostEventValues}