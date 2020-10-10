const express = require('express')
const morgan = require('morgan')

const servidor = express();

servidor.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');

    // authorized headers for preflight requests
    // https://developer.mozilla.org/en-US/docs/Glossary/preflight_request
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();

    servidor.options('*', (req, res) => {
        // allowed XHR methods  
        res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');
        res.send();
    });
});

//configuracion del puerto 
servidor.set('port', process.env.PORT || 3000);

//middlewares
servidor.use(morgan('dev'));
servidor.use(express.json());

//enrutamiento
servidor.use("/", require('./Rutas/rutasGeneral'));

//verificacion del levantamiento del server
servidor.listen(servidor.get('port'), () => {
    console.log("simon aqui andamios en el puerto", servidor.get('port'));
});