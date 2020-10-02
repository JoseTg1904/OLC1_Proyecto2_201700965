const express = require('express')

const servidor = express();

//configuracion del puerto 
servidor.set('port', process.env.PORT || 3000);

//enrutamiento
servidor.use("/", require('./Rutas/rutasGeneral'));

//verificacion del levantamiento del server
servidor.listen(servidor.get('port'), () => {
    console.log("simon aqui andamios en el puerto", servidor.get('port'));
});