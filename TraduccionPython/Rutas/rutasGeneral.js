const e = require('express');
const express = require('express');
const { format } = require('morgan');

const router = express.Router();

var listaTokens = [];
var listadoErroresLexicos = [];
var listadoErroresSintacticos = [];
var traducido = "";
var tabulados = "";
var especial = "";
var tokenActual;
var iteradorSintactico = 0;
var banderaSalto = false;

router.post("/traducirPython", (req, res) => {
    analizadorLexico(req.body.contenido);
    /*res.json({
        erroresLexicos: listadoErroresLexicos,
        erroresSintacticos: listadoErroresSintacticos,
        traduccion: traducido,
        arbol: ""
    })*/
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
                }else if (caracter == "*"){
                    estado = 11
                }else{
                    estado = 0
                    listaTokens.push({tipo: "tk_division", valor: "/"})
                    i--
                }
                break;
            case 10:
                if (caracter == "\n"){
                    etado = 0
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
                    lexemaAuxiliar = lexemaAuxiliar.substring(0, lexemaAuxiliar.length - 2)
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
    traducido = traducido.replace("  ", " ")
    console.log(traducido)
}

function analizadorSintactico(){
    listadoErroresSintacticos = [];
    iteradorSintactico = 0;
    tokenActual = listaTokens[iteradorSintactico];
    traducido = ""
    tabulados = ""
    publicoInterClass()
    for(let i =  0; i < listadoErroresSintacticos.length; i++){
        console.log("esperado",listadoErroresSintacticos[i].esperado,"encontrado" , listadoErroresSintacticos[i].encontrado)
    }
}

function publicoInterClass(){
    if (tokenActual.tipo == "tk_public"){
        parea("tk_public", "tk_public", "")
        interClass()
    }
}

function interClass(){
    if(tokenActual.tipo == "tk_interface"){
        parea("tk_interface", "tk_interface", "")
        parea("tk_identificador", "tk_identificador", "")
        parea("tk_llaveA", "tk_llaveA", "")
        definicion()
        parea("tk_llaveC", "tk_llaveC", "")
        publicoInterClass()
    }else if(tokenActual.tipo == "tk_class"){
        parea("tk_class", "tk_class", "")
        parea("tk_identificador", "tk_identificador", "")
        parea("tk_llaveA", "tk_llaveA", "")
        instrucciones()
        parea("tk_llaveC", "tk_llaveC", "")
        publicoInterClass()
    }else{
        parea("tk_error", "tk_interface | tk_clase", "")
    }
}

function definicion(){
    if (tokenActual.tipo == "tk_public"){
        parea("tk_public", "tk_public", "definicion")
        tipoFuncion("definicion")
        parea("tk_identificador", "tk_identificador", "definicion")
        parea("tk_parA", "tk_parA", "definicion")
        parametros("definicion")
        parea("tk_parC", "tk_parC", "definicion")
        parea("tk_puntoComa", "tk_puntoComa", "definicion")
        definicion()
    }
}

function tipoFuncion(contexto){
    if (tokenActual.tipo == "tk_void"){
        parea("tk_void", "tk_void", contexto)
    }else{
        tipo(contexto)
    }
}

function tipo(contexto){
    if(tokenActual.tipo == "tk_int"){
        parea("tk_int", "tk_int", contexto)
    }else if(tokenActual.tipo == "tk_boolean"){
        parea("tk_boolean", "tk_boolean", contexto)
    }else if(tokenActual.tipo == "tk_double"){
        parea("tk_double", "tk_double", contexto)
    }else if(tokenActual.tipo == "tk_string"){
        parea("tk_string", "tk_string", contexto)
    }else if(tokenActual.tipo == "tk_char"){
        parea("tk_char", "tk_char", contexto)
    }else{
        parea("tk_error", "tk_tipo", "")
    }
}

function parametros(contexto){
    if (tokenActual.tipo == "tk_int" || tokenActual.tipo == "tk_boolean" 
    || tokenActual.tipo == "tk_double" || tokenActual.tipo == "tk_string" 
    || tokenActual.tipo == "tk_char"){
        tipo(contexto)
        parea("tk_identificador", "tk_identificador", contexto)
        listadoParametros(contexto)        
    }
}

function listadoParametros(contexto){
    if (tokenActual.tipo == "tk_coma"){
        parea("tk_coma", "tk_coma", contexto)
        parametros(contexto)
    }
}

function instrucciones(){
    if(tokenActual.tipo == "tk_int" || tokenActual.tipo == "tk_boolean" 
    || tokenActual.tipo == "tk_double" || tokenActual.tipo == "tk_string" 
    || tokenActual.tipo == "tk_char"){
        declaracion("declaracion")
        instrucciones()
    }else if(tokenActual.tipo == "tk_public"){
        implementacion()
        instrucciones()
    }
}

function declaracion(contexto){
    tipo(contexto)
    identificadorDeclaracion(contexto)
    parea("tk_puntoComa", "tk_puntoComa", contexto)
}

function identificadorDeclaracion(contexto){
    if(tokenActual.tipo == "tk_identificador"){
        parea("tk_identificador", "tk_identificador", contexto)
        listadoDeclaracion(contexto)
    }else{
        parea("tk_error", "tk_identificador", "")
    }
}

function listadoDeclaracion(contexto){
    if(tokenActual.tipo == "tk_igual"){
        parea("tk_igual", "tk_igual", contexto)
        expresion()
        listadoDeclaracion(contexto)
    }else if (tokenActual.tipo == "tk_coma"){
        parea("tk_coma", "tk_coma", contexto)
        identificadorDeclaracion(contexto)
    }
}

function implementacion(){
    if(tokenActual.tipo == "tk_public"){
        contextoActual = "implementacion"
        if (iteradorSintactico + 1 < listaTokens.length){
            if(listaTokens[iteradorSintactico+1].tipo == "tk_static"){
                contextoActual = "main"
            }
        }
        parea("tk_public", "tk_public", contextoActual)
        divTipoFuncion("implementacion")
    }else{
        parea("tk_error", "tk_public", "")
    }
}

function divTipoFuncion(contexto){
    if(tokenActual.tipo == "tk_static"){
        parea("tk_static", "tk_static", "main")
        parea("tk_void", "tk_void", "main")
        parea("tk_main", "tk_main", "main")
        parea("tk_parA", "tk_parA", "main")
        parea("tk_string", "tk_string", "main")
        parea("tk_corcheteA", "tk_corcheteA", "main")
        parea("tk_corcheteC", "tk_corcheteC", "main")
        parea("tk_args", "tk_args", "main")
        parea("tk_parC", "tk_parC", "main")
        parea("tk_llaveA", "tk_llaveA", "main")
        interno()
        parea("tk_llaveC", "tk_llaveC", "main")
    }else if (tokenActual.tipo == "tk_int" || tokenActual.tipo == "tk_boolean" 
    || tokenActual.tipo == "tk_double" || tokenActual.tipo == "tk_string" 
    || tokenActual.tipo == "tk_char" || tokenActual.tipo == "tk_void"){
        tipoFuncion(contexto)
        parea("tk_identificador", "tk_identificador", contexto)
        parea("tk_parA", "tk_parA", contexto)
        parametros(contexto)
        parea("tk_parC", "tk_parC", contexto)
        parea("tk_llaveA", "tk_llaveA", contexto)
        interno()
        parea("tk_llaveC", "tk_llaveC", contexto)
    }else{
        parea("tk_error", "tk_static | tk_tipo", "")
    }
}

//traducir desde el for en adelante
function interno(){
    if(tokenActual.tipo == "tk_system"){
        parea("tk_system", "tk_system", "print")
        parea("tk_punto", "tk_punto", "print")
        parea("tk_out", "tk_out", "print")
        parea("tk_punto", "tk_punto", "print")
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

function divPrint(){
    if(tokenActual.tipo == "tk_print"){
        parea("tk_print", "tk_print", "print")
        parea("tk_parA", "tk_parA", "print")
        expresion()
        parea("tk_parC", "tk_parC", "print")
        parea("tk_puntoComa", "tk_puntoComa", "print")
    }else if(tokenActual.tipo == "tk_println"){
        parea("tk_println", "tk_println", "print")
        parea("tk_parA", "tk_parA", "print")
        expresion()
        parea("tk_parC", "tk_parC", "print")
        parea("tk_puntoComa", "tk_puntoComa", "print")
    }else{
        parea("tk_error", "tk_print")
    }
}

/*
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
*/

function expresion(){
    if(tokenActual.tipo == "tk_menos"){
        parea("tk_menos", "tk_menos", "expresion")
        expresion()
        expresionPrima()
    }else if(tokenActual.tipo == "tk_not"){
        parea("tk_not", "tk_not", "expresion")
        expresion()
        expresionPrima()
    }else if(tokenActual.tipo == "tk_stringTexto"){
        parea("tk_stringTexto", "tk_stringTexto", "expresion")
        expresionPrima()
    }else if(tokenActual.tipo == "tk_charTexto"){
        parea("tk_charTexto", "tk_charTexto", "expresion")
        expresionPrima()
    }else if(tokenActual.tipo == "tk_numero"){
        parea("tk_numero", "tk_numero", "expresion")
        expresionPrima()
    }else if(tokenActual.tipo == "tk_decimal"){
        parea("tk_decimal", "tk_decimal", "expresion")
        expresionPrima()
    }else if(tokenActual.tipo == "tk_identificador"){
        parea("tk_identificador", "tk_identificador", "expresion")
        expresionPrima()
    }else if(tokenActual.tipo == "tk_true"){
        parea("tk_true", "tk_true", "expresion")
        expresionPrima()
    }else if(tokenActual.tipo == "tk_false"){
        parea("tk_false", "tk_false", "expresion")
        expresionPrima()
    }else if(tokenActual.tipo == "tk_parA"){
        parea("tk_parA", "tk_parA", "expresion")
        expresion()
        parea("tk_parC", "tk_parC", "expresion")
        expresionPrima()
    }else{
        parea("tk_error", "tk_expresion", "")
    }
}

function expresionPrima(){
    if(tokenActual.tipo == "tk_and"){
        parea("tk_and", "tk_and", "expresion")
        expresion()
        expresionPrima()
    }else if(tokenActual.tipo == "tk_or"){
        parea("tk_or", "tk_or", "expresion")
        expresion()
        expresionPrima()
    }else if(tokenActual.tipo == "tk_xor"){
        parea("tk_xor", "tk_xor", "expresion")
        expresion()
        expresionPrima()
    }else if(tokenActual.tipo == "tk_adicion"){
        parea("tk_adicion", "tk_adicion", "expresion")
        expresionPrima()
    }else if(tokenActual.tipo == "tk_sustraccion"){
        parea("tk_sustraccion", "tk_sustraccion", "expresion")
        expresionPrima()
    }else if(tokenActual.tipo == "tk_mayor"){
        parea("tk_mayor", "tk_mayor", "expresion")
        expresion()
        expresionPrima()
    }else if(tokenActual.tipo == "tk_menor"){
        parea("tk_menor", "tk_menor", "expresion")
        expresion()
        expresionPrima()
    }else if(tokenActual.tipo == "tk_mayorIgual"){
        parea("tk_mayorIgual", "tk_mayorIgual", "expresion")
        expresion()
        expresionPrima()
    }else if(tokenActual.tipo == "tk_menorIgual"){
        parea("tk_menorIgual", "tk_menorIgual", "expresion")
        expresion()
        expresionPrima()
    }else if(tokenActual.tipo == "tk_igualacion"){
        parea("tk_igualacion", "tk_igualacion", "expresion")
        expresion()
        expresionPrima()
    }else if(tokenActual.tipo == "tk_distinto"){
        parea("tk_distinto", "tk_distinto", "expresion")
        expresion()
        expresionPrima()
    }else if(tokenActual.tipo == "tk_mas"){
        parea("tk_mas", "tk_mas", "expresion")
        expresion()
        expresionPrima()
    }else if(tokenActual.tipo == "tk_menos"){
        parea("tk_menos", "tk_menos", "expresion")
        expresion()
        expresionPrima()
    }else if(tokenActual.tipo == "tk_por"){
        parea("tk_por", "tk_por", "expresion")
        expresion()
        expresionPrima()
    }else if(tokenActual.tipo == "tk_division"){
        parea("tk_division", "tk_division", "expresion")
        expresion()
        expresionPrima()
    }
}

function parea(preAnalisis, esperado, contexto){
    if (preAnalisis == tokenActual.tipo){
        console.log(preAnalisis)
        traduccion(tokenActual, contexto)
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

function traduccion(tokenTraducir, contexto){
    if (contexto == ""){
        if(tokenTraducir.tipo == "tk_class"){
            traducido += "class "
        }else if(tokenTraducir.tipo == "tk_interface"){
            traducido += "class "
        }else if(tokenTraducir.tipo == "tk_llaveA"){
            traducido += ":\n"
            tabulados += "\t"
        }else if(tokenTraducir.tipo == "tk_llaveC"){
            tabulados = tabulados.substring(0, tabulados.length - 1)
            traducido += "\n"
        }else if(tokenTraducir.tipo == "tk_identificador"){
            traducido += tokenTraducir.valor
        }
    }else if(contexto == "definicion"){
        if (tokenTraducir.tipo == "tk_public"){
            traducido += tabulados + "self "
        }else if(tokenTraducir.tipo == "tk_identificador"){
            traducido += tokenTraducir.valor
        }else if(tokenTraducir.tipo == "tk_parA"){
            traducido += "("
        }else if(tokenTraducir.tipo == "tk_parC"){
            traducido += ")"
        }else if(tokenTraducir.tipo == "tk_puntoComa"){
            traducido += ";\n"
        }else if(tokenTraducir.tipo == "tk_coma")
            traducido += ", "
    }else if(contexto == "declaracion"){
        if(tokenTraducir.tipo == "tk_int" || tokenTraducir.tipo == "tk_boolean" 
        || tokenTraducir.tipo == "tk_double" || tokenTraducir.tipo == "tk_string" 
        || tokenTraducir.tipo == "tk_char"){
            traducido += tabulados + "var "
        }else if(tokenTraducir.tipo == "tk_identificador"){
            traducido += tokenTraducir.valor
        }else if(tokenTraducir.tipo == "tk_coma"){
            traducido += ", "
        }else if(tokenTraducir.tipo == "tk_puntoComa"){
            traducido += "\n"
        }else if(tokenTraducir.tipo == "tk_igual"){
            traducido += " = "
        }
    }else if(contexto == "expresion"){
        if(tokenTraducir.tipo == "tk_menos"){
            traducido += " - "
        }else if(tokenTraducir.tipo == "tk_not"){
            traducido += " not "
        }else if(tokenTraducir.tipo == "tk_stringTexto"){
            traducido += tokenTraducir.valor
        }else if(tokenTraducir.tipo == "tk_charTexto"){
            traducido += tokenTraducir.valor
        }else if(tokenTraducir.tipo == "tk_numero"){
            traducido += tokenTraducir.valor
        }else if(tokenTraducir.tipo == "tk_decimal"){
            traducido += tokenTraducir.valor
        }else if(tokenTraducir.tipo == "tk_identificador"){
            traducido += tokenTraducir.valor
        }else if(tokenTraducir.tipo == "tk_true"){
            traducido += " True "
        }else if(tokenTraducir.tipo == "tk_false"){
            traducido += " False "
        }else if(tokenTraducir.tipo == "tk_parA"){
            traducido += "("
        }else if(tokenTraducir.tipo == "tk_parC"){
            traducido += ")"
        }else if(tokenTraducir.tipo == "tk_and"){
            traducido += " and "    
        }else if(tokenTraducir.tipo == "tk_or"){
            traducido += " or " 
        }else if(tokenTraducir.tipo == "tk_xor"){
            traducido += " xor "
        }else if(tokenTraducir.tipo == "tk_adicion"){
            traducido += " += "
        }else if(tokenTraducir.tipo == "tk_sustraccion"){
            traducido += " -= "
        }else if(tokenTraducir.tipo == "tk_mayor"){
            traducido += " > "
        }else if(tokenTraducir.tipo == "tk_menor"){
            traducido += " < "
        }else if(tokenTraducir.tipo == "tk_mayorIgual"){
            traducido += " >= "
        }else if(tokenTraducir.tipo == "tk_menorIgual"){
            traducido += " <= "
        }else if(tokenTraducir.tipo == "tk_igualacion"){
            traducido += " == "
        }else if(tokenTraducir.tipo == "tk_distinto"){
            traducido += " != "
        }else if(tokenTraducir.tipo == "tk_mas"){
            traducido += " + "
        }else if(tokenTraducir.tipo == "tk_por"){
            traducido += " * "
        }else if(tokenTraducir.tipo == "tk_division"){
            traducido += " / "
        }        
    }else if(contexto == "implementacion"){
        if(tokenTraducir.tipo == "tk_public"){
            if (especial == "")
            traducido += tabulados + "def "
        }else if(tokenTraducir.tipo == "tk_identificador"){
            traducido += tokenTraducir.valor
        }else if(tokenTraducir.tipo == "tk_llaveA"){
            traducido += ":\n"
            tabulados += "\t"
        }else if(tokenTraducir.tipo == "tk_llaveC"){
            tabulados = tabulados.substring(0, tabulados.length - 1)
            traducido += "\n"
        }else if(tokenTraducir.tipo == "tk_parA"){
            traducido += "("
        }else if(tokenTraducir.tipo == "tk_parC"){
            traducido += ")"
        }else if(tokenTraducir.tipo == "tk_coma"){
            traducido += ", "
        }
    }else if(contexto == "main"){
        especial += tokenTraducir.valor
        if (tokenTraducir.tipo == "tk_llaveA"){
            especial = ""
            traducido += ":\n"
            tabulados += "\t"
        }else if(tokenTraducir.tipo == "tk_llaveC"){
            especial = ""
            tabulados = tabulados.substring(0, tabulados.length - 1)
            traducido += "\n"
        }else if(especial.toLowerCase() == "publicstaticvoidmain(string[]args)"){
            especial = ""
            traducido += "\tif __name__ = \"__main__\":\n\t\tmain()\n\n"
            traducido += "\tdef main()"
        }   
    }else if(contexto == "print"){
        especial += tokenTraducir.valor
        if(tokenTraducir.tipo == "tk_parA"){
            especial = ""
            traducido += "("
        }else if(tokenTraducir.tipo == "tk_parC"){
            especial = ""
            if(banderaSalto == false){
                traducido += ", end = \"\""
            }
            traducido += ")\n"
        }else if(especial.toLowerCase() == "system.out.print"){
            banderaSalto = false;
            especial = ""
            traducido += tabulados + "print"
        }else if(especial.toLowerCase() == "system.out.println"){
            banderaSalto = true;
            especial = ""
            traducido += tabulados + "print"
        }else if(tokenTraducir.tipo == "tk_puntoComa"){
            especial = ""
        }
    }
}

module.exports = router;