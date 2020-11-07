const express = require('express');

const router = express.Router();

const parser = require('./gramatica');

var listaTokens = [];
var listaErroresLexicos = [];
var listaErroresSintacticos = [];
var retorno = [];
var traduccion = "";

router.post("/traducirJS", (req, res) => {
    
    /*Limpieza de las variables que almacenan el resultado del analisis*/
    listaTokens = [];
    listaErroresLexicos = [];
    listaErroresSintacticos = [];
    retorno = [];
    traduccion = "";
    
    console.log(req.body)
    /*Resultado del analisis*/
    retorno = parser.parse(req.body.Contenido);
    
    /*Guardado de valores de retorno en las variables locales*/
    listaTokens = retorno.tokens;
    listaErroresLexicos = retorno.erroresLexicos;
    listaErroresSintacticos = retorno.erroresSintacticos;
    retorno.traducido = retorno.traducido.replace("\n\n", "\n");
    traduccion = retorno.traducido;

    /*Impresion para ver la traduccion*/
    console.error(traduccion)

    /*Envio de los resultados del analisis*/
    res.json({erroresLexicos: listaErroresLexicos,
            erroresSintacticos: listaErroresSintacticos,
            traducido: traduccion,
            tokens: listaTokens
    })
})

router.get("/obtenerTokens", (req, res) => {
    res.json({tokens: listaTokens})
})

router.get("/obtenerErroresLexicos", (req, res) => {
    res.json({erroresLexicos: listaErroresLexicos})
})

router.get("/obtenerErroresSintacticos", (req, res) =>{
    res.json({erroresSintacticos: listaErroresSintacticos})
})

router.get("/obtenerTraduccion", (req, res) =>{
    res.json({traducido: traduccion})
})

module.exports = router;