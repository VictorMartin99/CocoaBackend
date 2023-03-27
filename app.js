const express = require("express");
const bodyParser = require("body-parser");
const {errorHandler} = require("./middlewares/error");
const path = require("path");
const cors = require('cors')

const app = express();

app.use(bodyParser.json());


app.use(require('./routes/image'));
app.use(require('./routes/event'));
app.use(require('./routes/flyer'));

app.use(cors())

app.use('/dbimages', express.static('dbimages'))
app.use('/dbflyers', express.static('dbflyers'))

app.listen(process.env.PORT, () => {
    console.log("Server running in port: ", process.env.PORT);
});

app.use(errorHandler);

module.exports = app;

