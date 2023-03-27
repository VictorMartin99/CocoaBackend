const express = require("express");
const bcrypt = require('bcrypt');
const dotenv = require("dotenv");
const jwt = require('jsonwebtoken');
const multer = require('multer')

const {connection} = require("../config.db");

const {getUserFromToken} = require("../token");
const path = require("path");
const fs = require("fs");

const app = express();

dotenv.config();


const {
    checkPostEventValues
} = require("../middlewares/checker");


const getPastEvents = (request, response, next) => {

    //TODO check also that the event has already images uploaded

    connection.query("SELECT * FROM event WHERE eventdate < CURDATE()",
        [],
        (err, results) => {

            if (err) {
                response.status(500).json({"error": "An error occurred while checking the information"});
                console.log(err)
            }

            let events = [];

            results.forEach(event => {
                events.push({
                    "id": event.idevent,
                    "name": event.name,
                    "theme": event.theme,
                    "eventdate": event.eventdate,
                    "flyer_url": process.env.DOMAIN + "dbflyers/" + event.idflyer + ".png"
                })
            })


            response.status(200).json({
                "events": events
            });
        }
    );

}

app.route("/event/past")
    .get(getPastEvents);


const getComingEvents = (request, response, next) => {

    connection.query("SELECT * FROM event WHERE eventdate >= CURDATE()",
        [],
        (err, results) => {

            if (err) {
                response.status(500).json({"error": "An error occurred while checking the information"});
                console.log(err)
            }

            let events = [];

            results.forEach(event => {
                events.push({
                    "id": event.idevent,
                    "name": event.name,
                    "theme": event.theme,
                    "eventdate": event.eventdate,
                    "flyer_url": process.env.DOMAIN + "dbflyers/" + event.idflyer + ".png"
                })
            })

            response.status(200).json({
                "events": events
            });
        }
    );


}

app.route("/event/coming")
    .get(getComingEvents);


const searchPastEventsByNameOrTheme = (request, response, next) => {

    let name = request.query.name

    let name_query = '%' + name + '%'

    connection.query("SELECT * FROM event WHERE name LIKE ? OR theme LIKE ?",
        [name_query, name_query],
        (err, results) => {

            if (err) {
                response.status(500).json({"error": "An error occurred while checking the information"});
                console.log(err)
            }

            let events = [];

            results.forEach(event => {
                events.push({
                    "id": event.idevent,
                    "name": event.name,
                    "theme": event.theme,
                    "eventdate": event.eventdate,
                    "flyer_url": process.env.DOMAIN + "dbflyers/" + event.idflyer + ".png" //TODO treat flyer url when idflyer is null
                })
            })

            response.status(200).json({
                "events": events
            });
        }
    );


}

app.route("/event")
    .get(searchPastEventsByNameOrTheme);


//TODO restrict this endpoint to only Cocoa Group workers
const postEvent = (request, response, next) => {

    let event = request.body


    connection.query("INSERT INTO event(name, theme, eventdate) VALUES (?,?,?)",
        [event.name, event.theme, event.eventdate],
        (err, result) => {

            if (err) {
                response.status(500).json({"error": "An error occurred while saving the information"});
                console.log(err)
            }

            response.status(200).json({
                "id": result.insertId,
                "name": event.name,
                "theme": event.theme,
                "eventdate": event.eventdate
            });
        }
    );


}

app.route("/event")
    .post(checkPostEventValues, postEvent);


module.exports = app;