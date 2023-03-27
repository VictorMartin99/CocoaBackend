const express = require("express");
const bcrypt = require('bcrypt');
const dotenv = require("dotenv");
const jwt = require('jsonwebtoken');
const multer = require('multer')
const path = require("path");
const fs = require("fs");


const {connection} = require("../config.db");

const { getUserFromToken } = require("../token");


const app = express();

dotenv.config();

const diskstorage = multer.diskStorage({
    destination: path.join(__dirname, '../images'),
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const fileUpload = multer({
    storage: diskstorage
}).single('image')


const getImagesByEvent = (request, response, next) => {

    const idevent = request.params.e

    connection.query("SELECT * FROM image WHERE idevent = ?",
        [idevent],
        (err, results) => {

            let images = [];

            results.forEach( img => {
                images.push({
                    "id": img.idimage,
                    "type": img.type,
                    "name": img.name,
                    "url": process.env.DOMAIN + "dbimages/" + img.idimage + ".png"
                })
            })


            response.status(200).json({
                "num_images": results.length,
                "images": images
            });

        })
};


app.route("/images/:e")
    .get(getImagesByEvent);


const postImageByEvent = (request, response, next) => {

    const type = request.file.mimetype
    const name = request.file.originalname
    const data = fs.readFileSync(path.join(__dirname, '../images/' + request.file.filename))

    //TODO control that the image name does not surpass 100 characters

    const idevent = request.params.e

    connection.query("INSERT INTO image (type, name, idevent) VALUES (?,?,?)",
        [type, name, idevent],
        (error, result) => {
            if (error) {
                response.status(500).json({"error": ""});
                console.log(error)
            }

            //save picture into dbimages folder
            fs.writeFileSync(path.join(__dirname, '../dbimages/' + result.insertId + '.png'), data)

            response.status(200).json({"message": "Image saved correctly"});
        });

}

app.route("/images/:e")
    .post(fileUpload, postImageByEvent);


module.exports = app;