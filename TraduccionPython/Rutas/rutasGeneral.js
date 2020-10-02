const e = require('express');
const express = require('express');
const { format } = require('morgan');

const router = express.Router();

var listaTokens = [];
var listadoErroresLexicos = [];
var listadoErroresSintacticos = [];

router.post("/traducirPython", (req, res) => {
    analizadorLexico(req.body.contenido);
})

function analizadorLexico(contenidoArchivo){
    listaTokens = [];
    listadoErroresLexicos = []

    let estado = 0;
    let lexemaAuxiliar = ""
    let fila = 1
    let columna = 0
    
    for(let i = 0; i < contenidoArchivo.length; i++){
        columna++
        let caracter = contenidoArchivo.charAt(i)
        switch(estado){
            case 0:
                if (caracter == "\n"){
                    fila++
                    estado = 0
                    columna = 0
                }else if (caracter == " "){
                    estado = 0
                }else if (caracter == "\t"){
                    estado = 0
                }else if (caracter == "{"){
                    estado = 0
                    listaTokens.push({tipo: "tk_llaveA", valor: "{"})
                }else if (caracter == "}"){
                    estado = 0
                    listaTokens.push({tipo: "tk_llaveC", valor: "}"})
                }else if (caracter == "("){
                    estado = 0
                    listaTokens.push({tipo: "tk_parA", valor: "("})
                }else if (caracter == ")"){
                    estado = 0
                    listaTokens.push({tipo: "tk_parC", valor: ")"})
                }else if (caracter == ","){
                    estado = 0
                    listaTokens.push({tipo: "tk_coma", valor: ","})
                }else if (caracter == ";"){
                    estado = 0
                    listaTokens.push({tipo: "tk_dosPuntos", valor: ";"})
                }else if (caracter == ">"){
                    estado = 1
                }else if (caracter == "<"){
                    estado = 2
                }else if (caracter == "="){
                    estado = 3
                }else if (caracter == "!"){
                    estado = 4
                }else if (caracter == "&"){
                    estado = 5
                }else if (caracter == "|"){
                    estado = 6
                }else if (caracter == "^"){
                    estado = 0
                    listaTokens.push({tipo: "tk_xor", valor: "^"})
                }else if (caracter == "+"){
                    estado = 7
                }else if (caracter == "-"){
                    estado = 8
                }else if (caracter == "*"){
                    estado = 0 
                    listaTokens.push({tipo: "tk_por", valor: "*"})
                }else if (caracter == "/"){
                    estado = 9
                }else if (caracter == "."){
                    estado = 0
                    listaTokens.push({tipo: "tk_punto", valor: "."})
                }else if (caracter == "["){
                    estado = 0
                    listaTokens.push({tipo: "tk_corcheteA", valor: "["})
                }else if (caracter == "]"){
                    estado = 0
                    listaTokens.push({tipo: "tk_corcheteC", valor: "]"})
                }else if (caracter.match(/[a-z]/i)){
                    estado = 13
                    lexemaAuxiliar += caracter
                }else if (caracter.match(/[0-9]/i)){
                    estado = 14
                    lexemaAuxiliar += caracter
                }else if (caracter == "\"" || caracter == "\“"){
                    estado = 17
                    lexemaAuxiliar += caracter
                }else if (caracter == "\'" || caracter == "\‘"){
                    estado = 18
                    lexemaAuxiliar += caracter  
                }else {
                    listadoErroresLexicos.push({valor:caracter, fila:fila, columna:columna})
                    console.log("error")
                }
                break;
            case 1:
                if (caracter == "="){
                    estado = 0
                    listaTokens.push({tipo: "tk_mayorIgual", valor: ">="})
                }else{
                    estado = 0
                    listaTokens.push({tipo: "tk_mayor", valor: ">"})
                    i--
                }
                break;
            case 2:
                if (caracter == "="){
                    estado = 0
                    listaTokens.push({tipo: "tk_menorIgual", valor: "<="})
                }else{
                    estado = 0
                    listaTokens.push({tipo: "tk_menor", valor: "<"})
                    i--
                }
                break;
            case 3:
                if (caracter == "="){
                    estado = 0
                    listaTokens.push({tipo: "tk_igualacion", valor: "=="})
                }else{
                    estado = 0
                    listaTokens.push({tipo: "tk_igual", valor: "="})
                    i--
                }
                break;
            case 4:
                if (caracter == "="){
                    estado = 0
                    listaTokens.push({tipo: "tk_distinto", valor: "!="})
                }else{
                    estado = 0
                    listaTokens.push({tipo: "tk_not", valor: "!"})
                    i--
                }
                break;
            case 5:
                if (caracter == "&"){
                    estado = 0
                    listaTokens.push({tipo: "tk_and", valor: "&&"})
                }else{
                    estado = 0
                    i--
                    listadoErroresLexicos.push({valor:"&", fila:fila, columna:columna-1})
                }
                break;
            case 6:
                if (caracter == "|"){
                    estado = 0
                    listaTokens.push({tipo: "tk_or", valor: "||"})
                }else{
                    estado = 0
                    listadoErroresLexicos.push({valor:"|", fila:fila, columna:columna-1})
                    i--
                }
                break;
            case 7:
                if (caracter == "+"){
                    estado = 0
                    listaTokens.push({tipo: "tk_adicion", valor: "++"})
                }else{
                    estado = 0
                    listaTokens.push({tipo: "tk_mas", valor: "+"})
                    i--
                }
                break;
            case 8:
                if (caracter == "-"){
                    estado = 0
                    listaTokens.push({tipo: "tk_sustraccion", valor: "--"})
                }else{
                    estado = 0
                    listaTokens.push({tipo: "tk_menos", valor: "-"})
                    i--
                }
                break;
            case 9:
                if (caracter == "/"){
                    estado = 10
                    lexemaAuxiliar = "//"
                }else if (caracter == "*"){
                    estado = 11
                    lexemaAuxiliar = "/*"
                }else{
                    estado = 0
                    listaTokens.push({tipo: "tk_division", valor: "/"})
                    i--
                }
                break;
            case 10:
                if (caracter == "\n"){
                    etado = 0
                    lexemaAuxiliar += caracter
                    listaTokens.push({tipo: "tk_comentarioIndividual", valor: lexemaAuxiliar})
                    lexemaAuxiliar = ""
                }else{
                    estado = 10
                    lexemaAuxiliar += caracter
                }
                break;
            case 11:
                if (caracter == "*"){
                    estado = 12
                    lexemaAuxiliar += caracter
                }else{
                    lexemaAuxiliar += caracter
                    estado = 11
                }
                break;
            case 12:
                if (caracter == "/"){
                    estado = 0
                    listaTokens.push({tipo: "tk_comentarioMultiple", valor: lexemaAuxiliar})
                    lexemaAuxiliar = ""
                }else{
                    estado = 12
                    lexemaAuxiliar += caracter
                }
                break;
            case 13:
                if (caracter.match(/[0-9]/i) || caracter.match(/[a-z]/i)){
                    estado = 13
                    lexemaAuxiliar += caracter
                }else{
                    if (lexemaAuxiliar.toLowerCase() == "public"){
                        estado = 0
                        listaTokens.push({tipo: "tk_public", valor: lexemaAuxiliar})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "class"){
                        estado = 0
                        listaTokens.push({tipo: "tk_class", valor: lexemaAuxiliar})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "interface"){
                        estado = 0
                        listaTokens.push({tipo: "tk_interface", valor: lexemaAuxiliar})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "void"){
                        estado = 0
                        listaTokens.push({tipo: "tk_void", valor: lexemaAuxiliar})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "for"){
                        estado = 0
                        listaTokens.push({tipo: "tk_for", valor: lexemaAuxiliar})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "while"){
                        estado = 0
                        listaTokens.push({tipo: "tk_while", valor: lexemaAuxiliar})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "do"){
                        estado = 0
                        listaTokens.push({tipo: "tk_do", valor: lexemaAuxiliar})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "if"){
                        estado = 0
                        listaTokens.push({tipo: "tk_if", valor: lexemaAuxiliar})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "else"){
                        estado = 0
                        listaTokens.push({tipo: "tk_else", valor: lexemaAuxiliar})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "break"){
                        estado = 0
                        listaTokens.push({tipo: "tk_break", valor: lexemaAuxiliar})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "continue"){
                        estado = 0
                        listaTokens.push({tipo: "tk_continue", valor: lexemaAuxiliar})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "return"){
                        estado = 0
                        listaTokens.push({tipo: "tk_return", valor: lexemaAuxiliar})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "int"){
                        estado = 0
                        listaTokens.push({tipo: "tk_int", valor: lexemaAuxiliar})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "boolean"){
                        estado = 0
                        listaTokens.push({tipo: "tk_boolean", valor: lexemaAuxiliar})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "double"){
                        estado = 0
                        listaTokens.push({tipo: "tk_double", valor: lexemaAuxiliar})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "string"){
                        estado = 0
                        listaTokens.push({tipo: "tk_string", valor: lexemaAuxiliar})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "char"){
                        estado = 0
                        listaTokens.push({tipo: "tk_char", valor: lexemaAuxiliar})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "static"){
                        estado = 0
                        listaTokens.push({tipo: "tk_static", valor: lexemaAuxiliar})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "main"){
                        estado = 0
                        listaTokens.push({tipo: "tk_main", valor: lexemaAuxiliar})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "args"){
                        estado = 0
                        listaTokens.push({tipo: "tk_args", valor: lexemaAuxiliar})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "system"){
                        estado = 0
                        listaTokens.push({tipo: "tk_system", valor: lexemaAuxiliar})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "out"){
                        estado = 0
                        listaTokens.push({tipo: "tk_out", valor: lexemaAuxiliar})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "print"){
                        estado = 0
                        listaTokens.push({tipo: "tk_print", valor: lexemaAuxiliar})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "println"){
                        estado = 0
                        listaTokens.push({tipo: "tk_println", valor: lexemaAuxiliar})
                        lexemaAuxiliar = ""
                        i--
                    }else{
                        estado = 0
                        listaTokens.push({tipo: "tk_identificador", valor: lexemaAuxiliar})
                        lexemaAuxiliar = ""
                        i--
                    }
                }
                break;
            case 14:
                if (caracter.match(/[0-9]/i)){
                    estado = 14
                    lexemaAuxiliar += caracter
                }else if (caracter == "."){
                    estado = 15
                    lexemaAuxiliar += caracter
                }else{
                    estado = 0
                    listaTokens.push({tipo: "tk_numero", valor: lexemaAuxiliar})
                    i--
                    lexemaAuxiliar = ""
                }
                break;
            case 15: 
                if (caracter.match(/[0-9]/i)){
                    estado = 16
                    lexemaAuxiliar += caracter
                }else{
                    listadoErroresLexicos.push({valor:caracter, fila:fila, columna:columna})
                    console.log("error")
                    i--
                }
                break;
            case 16:
                if (caracter.match(/[0-9]/i)){
                    estado = 16
                    lexemaAuxiliar += caracter
                }else{
                    listaTokens.push({tipo: "tk_decimal", valor: lexemaAuxiliar})
                    lexemaAuxiliar = ""
                    i--
                    estado = 0
                }
                break;
            case 17:
                if (caracter == "\"" || caracter == "\“"){
                    estado = 0
                    lexemaAuxiliar += caracter
                    listaTokens.push({tipo: "tk_string", valor: lexemaAuxiliar})
                    lexemaAuxiliar = ""
                }else{
                    lexemaAuxiliar += caracter
                    estado = 17
                }
                break;
            case 18:
                if (caracter == "\'" || caracter == "\‘"){
                    estado = 0
                    lexemaAuxiliar += caracter
                    listaTokens.push({tipo: "tk_caracter", valor: lexemaAuxiliar})
                    lexemaAuxiliar = ""
                }else{
                    estado = 18
                    lexemaAuxiliar += caracter
                }
                break;
            default:
                break;
        }
    }

    //llamar al analisis sintactico 
}

module.exports = router;