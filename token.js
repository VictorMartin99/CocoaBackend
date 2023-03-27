const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");


//TODO HAY QUE ARREGLAR ESTO SEGÚN NOS INTERESE

async function getUserFromToken(request) {

    const bearerToken = request.headers.authorization;

    if (bearerToken === undefined) {
        return null;
    }

    const token = bearerToken.split(" ")[1];


    let user;

    user = await jwt.verify(token, process.env.PRIVATE_KEY);

    return user;
}


module.exports = { getUserFromToken }