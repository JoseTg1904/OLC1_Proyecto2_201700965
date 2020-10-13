const express = require('express');

const router = express.Router();

const parser = require('./gramatica');

var retorno = []

router.post("/traducirJS", (req, res) => {
    retorno = []
    retorno = parser.parse(req.body.contenido);
    console.log(retorno)
    res.json({mensaje:'hola'})
})

module.exports = router;