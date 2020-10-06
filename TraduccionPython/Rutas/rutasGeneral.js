const e = require('express');
const express = require('express');
const { format } = require('morgan');

const router = express.Router();

var listaTokens = [];
var listadoErroresLexicos = [];
var listadoErroresSintacticos = [];
var traducido = "";
var tokenActual;
var iteradorSintactico = 0;

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
                    listaTokens.push({tipo: "tk_puntoComa", valor: ";"})
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
                    }else if (lexemaAuxiliar.toLowerCase() == "true"){
                        estado = 0
                        listaTokens.push({tipo: "tk_true", valor: lexemaAuxiliar})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "false"){
                        estado = 0
                        listaTokens.push({tipo: "tk_false", valor: lexemaAuxiliar})
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
                    listaTokens.push({tipo: "tk_stringTexto", valor: lexemaAuxiliar})
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
                    listaTokens.push({tipo: "tk_charTexto", valor: lexemaAuxiliar})
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

    analizadorSintactico();
}

function analizadorSintactico(){
    iteradorSintactico = 0;
    tokenActual = listaTokens[iteradorSintactico];
    publicoInterClass()
    for(let i =  0; i < listadoErroresSintacticos.length; i++){
        console.log("esperado",listadoErroresSintacticos[i].esperado,"encontrado" , listadoErroresSintacticos[i].encontrado)
    }
}

function publicoInterClass(){
    if (tokenActual.tipo == "tk_public"){
        parea("tk_public", "tk_public")
        interClass()
    }
}

function interClass(){
    if(tokenActual.tipo == "tk_interface"){
        parea("tk_interface", "tk_interface")
        parea("tk_identificador", "tk_identificador")
        parea("tk_llaveA", "tk_llaveA")
        definicion()
        parea("tk_llaveC", "tk_llaveC")
        publicoInterClass()
    }else if(tokenActual.tipo == "tk_class"){
        parea("tk_class", "tk_class")
        parea("tk_identificador", "tk_identificador")
        parea("tk_llaveA", "tk_llaveA")
        instrucciones()
        parea("tk_llaveC", "tk_llaveC")
        publicoInterClass()
    }else{
        parea("tk_error", "tk_interface | tk_clase")
    }
}

function definicion(){
    if (tokenActual.tipo == "tk_public"){
        parea("tk_public", "tk_public")
        tipoFuncion()
        parea("tk_identificador", "tk_identificador")
        parea("tk_parA", "tk_parA")
        parametros()
        parea("tk_parC", "tk_parC")
        parea("tk_puntoComa", "tk_puntoComa")
        definicion()
    }
}

function tipoFuncion(){
    if (tokenActual.tipo == "tk_void"){
        parea("tk_void", "tk_void")
    }else{
        tipo()
    }
}

function tipo(){
    if(tokenActual.tipo == "tk_int"){
        parea("tk_int", "tk_int")
    }else if(tokenActual.tipo == "tk_boolean"){
        parea("tk_boolean", "tk_boolean")
    }else if(tokenActual.tipo == "tk_double"){
        parea("tk_double", "tk_double")
    }else if(tokenActual.tipo == "tk_string"){
        parea("tk_string", "tk_string")
    }else if(tokenActual.tipo == "tk_char"){
        parea("tk_char", "tk_char")
    }else{
        parea("tk_error", "tk_tipo")
    }
}

function parametros(){
    if (tokenActual.tipo == "tk_int" || tokenActual.tipo == "tk_boolean" 
    || tokenActual.tipo == "tk_double" || tokenActual.tipo == "tk_string" 
    || tokenActual.tipo == "tk_char"){
        tipo()
        parea("tk_identificador", "tk_identificador")
        listadoParametros()        
    }
}

function listadoParametros(){
    if (tokenActual.tipo == "tk_coma"){
        parea("tk_coma", "tk_coma")
        parametros()
    }
}

function instrucciones(){
    if(tokenActual.tipo == "tk_int" || tokenActual.tipo == "tk_boolean" 
    || tokenActual.tipo == "tk_double" || tokenActual.tipo == "tk_string" 
    || tokenActual.tipo == "tk_char"){
        declaracion()
    }else if(tokenActual.tipo == "tk_public"){
        implementacion()
    }
}

function declaracion(){
    tipo()
    identificadorDeclaracion()
    parea("tk_puntoComa", "tk_puntoComa")
    instrucciones()
}

function implementacion(){
    parea("tk_public", "tk_public")
    divTipoFuncion()
    parea("tk_puntoComa", "tk_puntoComa")
    instrucciones()
}

function divTipoFuncion(){
    if(tokenActual.tipo == "tk_static"){
        parea("tk_static", "tk_static")
        parea("tk_void", "tk_void")
        parea("tk_main", "tk_main")
        parea("tk_string", "tk_string")
        parea("tk_parA", "tk_parA")
        parea("tk_corcheteA", "tk_corcheteA")
        parea("tk_corcheteC", "tk_corcheteC")
        parea("tk_args", "tk_args")
        parea("tk_parC", "tk_parC")
        parea("tk_llaveA", "tk_llaveA")
        interno()
        parea("tk_llaveC", "tk_llaveC")
    }else{
        tipoFuncion()
        parea("tk_identificador", "tk_identificador")
        parea("tk_parA", "tk_parA")
        parametros()
        parea("tk_parC", "tk_parC")
        parea("tk_llaveA", "tk_llaveA")
        interno()
        parea("tk_llaveC", "tk_llaveC")
    }
}

function interno(){
    if(tokenActual.tipo == "tk_system"){
        parea("tk_system", "tk_system")
        parea("tk_punto", "tk_punto")
        parea("tk_out", "tk_out")
        parea("tk_punto", "tk_punto")
        divPrint()
        interno()
    }else if(tokenActual.tipo == "tk_for"){
        parea("tk_for", "tk_for")
        parea("tk_parA", "tk_parA")
        declaracionFor()
        parea("tk_puntoComa", "tk_puntoComa")
        expresion()
        parea("tk_puntoComa", "tk_puntoComa")
        expresion()
        parea("tk_parC", "tk_parC")
        parea("tk_llaveA", "tk_llaveA")
        internoCiclo()
        parea("tk_llaveC")
        interno()
    }else if(tokenActual.tipo == "tk_while"){
        parea("tk_while", "tk_while")
        parea("tk_parA", "tk_parA")
        expresion()
        parea("tk_parC", "tk_parC")
        parea("tk_llaveA", "tk_llaveA")
        internoCiclo()
        parea("tk_llaveC", "tk_llaveC")
        interno()
    }else if(tokenActual.tipo == "tk_do"){
        parea("tk_do", "tk_do")
        parea("tk_llaveA", "tk_llaveA")
        internoCiclo()
        parea("tk_llaveC", "tk_llaveC")
        parea("tk_while", "tk_while")
        parea("tk_parA", "tk_parA")
        expresion()
        parea("tk_parC", "tk_parC")
        parea("tk_puntoComa", "tk_puntoComa")
        interno()
    }else if(tokenActual.tipo == "tk_if"){
        parea("tk_if", "tk_if")
        parea("tk_parA", "tk_parA")
        expresion()
        parea("tk_parC", "tk_parC")
        parea("tk_llaveA", "tk_llaveA")
        interno()
        parea("tk_llaveC", "tk_llaveC")
        ifElse()
        interno()
    }else if(tokenActual.tipo == "tk_return"){
        parea("tk_return", "tk_return")
        tipoReturn()
        parea("tk_puntoComa", "tk_puntoComa")
        interno()
    }else if(tokenActual.tipo == "tk_identificador"){
        llamadoAsignacion()
        interno()
    }else if(tokenActual.tipo == "tk_int" || tokenActual.tipo == "tk_boolean" 
    || tokenActual.tipo == "tk_double" || tokenActual.tipo == "tk_string" 
    || tokenActual.tipo == "tk_char"){
        
        declaracion()
        interno()
    }
}

function parametrosLlamada(){
    if(tokenActual.tipo == "tk_identificador"){
        parea("tk_identificador", "tk_identificador")
        listadoDeclaracionParametrosLlamado()
    }else if(tokenActual.tipo == "tk_numero"){
        parea("tk_numero", "tk_numero")
        listadoDeclaracionParametrosLlamado()
    }else if(tokenActual.tipo == "tk_decimal"){
        parea("tk_decimal", "tk_decimal")
        listadoDeclaracionParametrosLlamado()
    }else if(tokenActual.tipo == "tk_true"){
        parea("tk_true", "tk_true")
        listadoDeclaracionParametrosLlamado()
    }else if(tokenActual.tipo == "tk_false"){
        parea("tk_false", "tk_false")
        listadoDeclaracionParametrosLlamado()
    }else if(tokenActual.tipo == "tk_stringTexto"){
        parea("tk_stringTexto", "tk_stringTexto")
        listadoDeclaracionParametrosLlamado()
    }else if(tokenActual.tipo == "tk_charTexto"){
        parea("tk_charTexto", "tk_charTexto")
        listadoDeclaracionParametrosLlamado()
    }else{
        parea("tk_error", "tk_tipo")
    }
}

function listadoDeclaracionParametrosLlamado(){
    if(tokenActual.tipo == "tk_coma"){
        parea("tk_coma", "tk_coma")
        parametrosLlamada()
    }
}

function divPrint(){
    if(tokenActual.tipo == "tk_print"){
        parea("tk_print", "tk_print")
        parea("tk_parA", "tk_parA")
        expresion()
        parea("tk_parC", "tk_parC")
        parea("tk_puntoComa", "tk_puntoComa")
    }else if(tokenActual.tipo == "tk_println"){
        parea("tk_println", "tk_println")
        parea("tk_parA", "tk_parA")
        expresion()
        parea("tk_parC", "tk_parC")
        parea("tk_puntoComa", "tk_puntoComa")
    }else{
        parea("tk_erorr", "tk_print")
    }
}

function divLlamadoAsignacion(){
    if (tokenActual.tipo == "tk_parA"){
        parea("tk_parA", "tk_parA")
        parametrosLlamada()
        parea("tk_parC", "tk_parC")
        parea("tk_puntoComa", "tk_puntoComa")
    }else if(tokenActual.tipo == "tk_igual"){
        parea("tk_igual", "tk_igual")
        expresion()
        parea("tk_puntoComa", "tk_puntoComa")
    }else{
        parea("tk_error", "tk_parA | tk_igual")
    }
}

function llamadoAsignacion(){
    if(tokenActual.tipo == "tk_identificador"){
        parea("tk_identificador", "tk_identificador")
        divLlamadoAsignacion()    
    }else{
        parea("tk_error", "tk_identificador")
    }
}

function tipoReturn(){
    if(tokenActual.tipo == "tk_menos" || tokenActual.tipo == "tk_not" ||
    tokenActual.tipo == "tk_stringTexto" || tokenActual.tipo == "tk_charTexto" ||
    tokenActual.tipo == "tk_numero" || tokenActual.tipo == "tk_decimal" || 
    tokenActual.tipo == "tk_identificador" || tokenActual.tipo == "tk_true" ||
    tokenActual.tipo == "tk_false" || tokenActual.tipo == "tk_parA"){
        expresion()
    }
}

function ifElse(){
    if(tokenActual.tipo == "tk_else"){
        parea("tk_else", "tk_else")
        comprobacionElif()
    }   
}

function comprobacionElif(){
    if(tokenActual.tipo == "tk_llaveA"){
        parea("tk_llaveA", "tk_llaveA")
        interno()
        parea("tk_llaveC", "tk_llaveC")
    }else if(tokenActual.tipo == "tk_if"){
        parea("tk_if", "tk_if")
        parea("tk_parA", "tk_parA")
        expresion()
        parea("tk_parC", "tk_parC")
        parea("tk_llaveA", "tk_llaveA")
        internoCiclo()
        parea("tk_llaveC", "tk_llaveC")
        ifElse()
    }else{
        parea("tk_error", "tk_llave | tk_if")
    }
}

function internoCiclo(){
    if(tokenActual.tipo == "tk_break"){
        parea("tk_break", "tk_break")
    }else if(tokenActual.tipo == "tk_continue"){
        parea("tk_continue", "tk_continue")
    }else{
        interno()
    }
}

function declaracionFor(){
    if(tokenActual.tipo == "tk_int" || tokenActual.tipo == "tk_boolean" 
    || tokenActual.tipo == "tk_double" || tokenActual.tipo == "tk_string" 
    || tokenActual.tipo == "tk_char"){
        tipo()
        identificadorDeclaracionFor()
    }else{
        parea("tk_eror", "tk_tipo")
    }
}

function identificadorDeclaracionFor(){
    if(tokenActual.tipo == "tk_identificador"){
        parea("tk_identificador", "tk_identificador")
        parea("tk_igual", "tk_igual")
        expresion()
    }else{
        parea("tk_error", "tk_identificador")
    }
}

function identificadorDeclaracion(){
    if(tokenActual.tipo == "tk_identificador"){
        parea("tk_identificador", "tk_identificador")
        listadoDeclaracion()
    }else{
        parea("tk_error", "tk_identificador")
    }
}

function listadoDeclaracion(){
    if(tokenActual.tipo == "tk_igual"){
        parea("tk_igual", "tk_igual")
        expresion()
        listadoDeclaracion()
    }else if (tokenActual.tipo == "tk_coma"){
        parea("tk_coma", "tk_coma")
        identificadorDeclaracion()
    }
}

function expresion(){
    if(tokenActual.tipo == "tk_menos"){
        parea("tk_menos", "tk_menos")
        expresion()
        expresionPrima()
    }else if(tokenActual.tipo == "tk_not"){
        parea("tk_not", "tk_not")
        expresion()
        expresionPrima()
    }else if(tokenActual.tipo == "tk_stringTexto"){
        parea("tk_stringTexto", "tk_stringTexto")
        expresionPrima()
    }else if(tokenActual.tipo == "tk_charTexto"){
        parea("tk_charTexto", "tk_charTexto")
        expresionPrima()
    }else if(tokenActual.tipo == "tk_numero"){
        parea("tk_numero", "tk_numero")
        expresionPrima()
    }else if(tokenActual.tipo == "tk_decimal"){
        parea("tk_decimal", "tk_decimal")
        expresionPrima()
    }else if(tokenActual.tipo == "tk_identificador"){
        parea("tk_identificador", "tk_identificador")
        expresionPrima()
    }else if(tokenActual.tipo == "tk_true"){
        parea("tk_true", "tk_true")
        expresionPrima()
    }else if(tokenActual.tipo == "tk_false"){
        parea("tk_false", "tk_false")
        expresionPrima()
    }else if(tokenActual.tipo == "tk_parA"){
        parea("tk_parA", "tk_parA")
        expresion()
        parea("tk_parC", "tk_parC")
    }else{
        parea("tk_error", "tk_expresion")
    }
}

function expresionPrima(){
    if(tokenActual.tipo == "tk_and"){
        expresion()
        expresionPrima()
    }else if(tokenActual.tipo == "tk_or"){
        expresion()
        expresionPrima()
    }else if(tokenActual.tipo == "tk_xor"){
        expresion()
        expresionPrima()
    }else if(tokenActual.tipo == "tk_adicion"){
        expresionPrima()
    }else if(tokenActual.tipo == "tk_sustraccion"){
        expresionPrima()
    }else if(tokenActual.tipo == "tk_mayor"){
        expresion()
        expresionPrima()
    }else if(tokenActual.tipo == "tk_menor"){
        expresion()
        expresionPrima()
    }else if(tokenActual.tipo == "tk_mayorIgual"){
        expresion()
        expresionPrima()
    }else if(tokenActual.tipo == "tk_menorIgual"){
        expresion()
        expresionPrima()
    }else if(tokenActual.tipo == "tk_igualacion"){
        expresion()
        expresionPrima()
    }else if(tokenActual.tipo == "tk_distinto"){
        expresion()
        expresionPrima()
    }else if(tokenActual.tipo == "tk_mas"){
        expresion()
        expresionPrima()
    }else if(tokenActual.tipo == "tk_menos"){
        expresion()
        expresionPrima()
    }else if(tokenActual.tipo == "tk_por"){
        expresion()
        expresionPrima()
    }else if(tokenActual.tipo == "tk_division"){
        expresion()
        expresionPrima()
    }
}

function parea(preAnalisis, esperado){
    if (preAnalisis == tokenActual.tipo){
        console.log(preAnalisis)
        iteradorSintactico++
        if (iteradorSintactico < listaTokens.length){
            tokenActual = listaTokens[iteradorSintactico]
        }
    }else{
        console.log("error")
        listadoErroresSintacticos.push({encontrado: tokenActual.tipo, esperado: esperado})
        //aqui va el error+
        //y la consumida de tokens hasta encontrar un ; 
    }
}

module.exports = router;