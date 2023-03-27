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

//MIDDLEWARES
const diskstorage = multer.diskStorage({
    destination: path.join(__dirname, '../flyers'),
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const fileUpload = multer({
    storage: diskstorage
}).single('image')


const postFlyerToEvent = (request, response, next) => {

    const type = request.file.mimetype
    const name = request.file.originalname
    const data = fs.readFileSync(path.join(__dirname, '../flyers/' + request.file.filename))

    const eventid = request.params.e

    connection.query("INSERT INTO flyer(type, name) VALUES (?, ?)",
        [type, name],
        (err, result) => {

            if (err) {
                response.status(500).json({"error": "An error occurred while saving the information"});
                console.log(err)
            }

            //save flyer in static folder
            fs.writeFileSync(path.join(__dirname, '../dbflyers/' + result.insertId + '.png'), data)

            //update event table to set flyer id
            connection.query("UPDATE event SET idflyer = ? WHERE idevent = ?",
                [result.insertId, eventid],
                (err, result) => {
                    if (err) {
                        response.status(500).json({"error": "An error occurred while saving the information"});
                        console.log(err)
                    }

                    response.status(200).json({"message": "Flyer saved correctly"});
                }
            );
        }
    );


}

app.route("/flyer/:e")
    .post(fileUpload, postFlyerToEvent);


module.exports = app;