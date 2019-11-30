const express = require('express');
const app = express();

//var UsuariosController = require("./app/controllers/UsuariosController")
//var LoginController = require("./app/controllers/LoginController")
var GoogleVisionController = require("./app/controllers/GoogleVisionController")

var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "*");
    next();
});

//app.use("/usuarios", UsuariosController)
//app.use("/login", LoginController)
app.use("/vision", GoogleVisionController)


app.listen(3333, () => console.log('server run'));
