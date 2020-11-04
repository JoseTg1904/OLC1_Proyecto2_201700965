const express = require('express');

const router = express.Router();

const parser = require('./gramatica');

var retorno = []

router.post("/traducirJS", (req, res) => {
    retorno = []
    retorno = parser.parse(req.body.contenido);
    console.log(retorno)
    retorno.traducido = retorno.traducido.replace("\n\n", "\n");  
    console.error(retorno.traducido)
    res.json({mensaje: retorno})
})

module.exports = router;