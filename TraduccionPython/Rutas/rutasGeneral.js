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
var dot = "";
var range1 = "";
var banderaRange1 = false;
var range2 = "";
var banderaRange2 = false;
var identificadorFor = "";
var tokenActual;
var iteradorSintactico = 0;
var iteradorDot = 0;
var banderaSalto = false;

router.post("/traducirPython", (req, res) => {
    if (req.body.contenido == ""){
        res.json({respuesta:"No hay nada para analizar"})
    }else{
        analizadorLexico(req.body.contenido);
        res.json({
            erroresLexicos: listadoErroresLexicos,
            erroresSintacticos: listadoErroresSintacticos,
            traduccion: traducido,
            arbol: dot,
            tokens: listaTokens
        })
    }
})

router.get("/obtenerTokens", (req, res) => {
    res.json({tokens: listaTokens})
})

router.get("/obtenerErroresLexicos", (req, res) => {
    res.json({erroresLexicos: listadoErroresLexicos})
})

router.get("/obtenerErroresSintacticos", (req, res) =>{
    res.json({erroresSintacticos: listadoErroresSintacticos})
})

router.get("/obtenerArbol", (req, res) =>{
    res.json({arbol: dot})
})

router.get("/obtenerTraduccion", (req, res) =>{
    res.json({traduccion: traducido})
})

/*
hacer mas peticiones para devolver todas las ondas
*/

function analizadorLexico(contenidoArchivo){
    listaTokens = [];
    listadoErroresLexicos = []

    let estado = 0;
    let lexemaAuxiliar = ""
    let fila = 1
    let columna = 1
    
    for(let i = 0; i < contenidoArchivo.length; i++){
        let caracter = contenidoArchivo.charAt(i)
        switch(estado){
            case 0:
                if (caracter == "\n"){
                    fila++
                    estado = 0
                    columna = 1
                }else if (caracter == " " || caracter == "\t"){
                    estado = 0
                    columna++
                }else if (caracter == "{"){
                    estado = 0
                    listaTokens.push({tipo: "tk_llaveA", valor: "{", 
                    fila: fila, columna: columna})
                    columna++
                }else if (caracter == "}"){
                    estado = 0
                    listaTokens.push({tipo: "tk_llaveC", valor: "}", 
                    fila: fila, columna: columna})
                    columna++
                }else if (caracter == "("){
                    estado = 0
                    listaTokens.push({tipo: "tk_parA", valor: "(", 
                    fila: fila, columna: columna})
                    columna++
                }else if (caracter == ")"){
                    estado = 0
                    listaTokens.push({tipo: "tk_parC", valor: ")", 
                    fila: fila, columna: columna})
                    columna++
                }else if (caracter == ","){
                    estado = 0
                    listaTokens.push({tipo: "tk_coma", valor: ",", 
                    fila: fila, columna: columna})
                    columna++
                }else if (caracter == ";"){
                    estado = 0
                    listaTokens.push({tipo: "tk_puntoComa", valor: ";", 
                    fila: fila, columna: columna})
                    columna++
                }else if (caracter == ">"){
                    estado = 1
                    columna++
                }else if (caracter == "<"){
                    estado = 2
                    columna++
                }else if (caracter == "="){
                    estado = 3
                    columna++
                }else if (caracter == "!"){
                    estado = 4
                    columna++
                }else if (caracter == "&"){
                    estado = 5
                    columna++
                }else if (caracter == "|"){
                    estado = 6
                    columna++
                }else if (caracter == "^"){
                    estado = 0
                    listaTokens.push({tipo: "tk_xor", valor: "^", 
                    fila: fila, columna: columna})
                    columna++
                }else if (caracter == "+"){
                    estado = 7
                    columna++
                }else if (caracter == "-"){
                    estado = 8
                    columna++
                }else if (caracter == "*"){
                    estado = 0
                    listaTokens.push({tipo: "tk_por", valor: "*", 
                    fila: fila, columna: columna})
                    columna++
                }else if (caracter == "/"){
                    estado = 9
                    columna++
                }else if (caracter == "."){
                    estado = 0
                    listaTokens.push({tipo: "tk_punto", valor: ".", 
                    fila: fila, columna: columna})
                    columna++
                }else if (caracter == "["){
                    estado = 0
                    listaTokens.push({tipo: "tk_corcheteA", valor: "[", 
                    fila: fila, columna: columna})
                    columna++
                }else if (caracter == "]"){
                    estado = 0
                    listaTokens.push({tipo: "tk_corcheteC", valor: "]", 
                    fila: fila, columna: columna})
                    columna++
                }else if (caracter.match(/[a-z]/i)){
                    estado = 13
                    columna++
                    lexemaAuxiliar += caracter
                }else if (caracter.match(/[0-9]/i)){
                    estado = 14
                    columna++
                    lexemaAuxiliar += caracter
                }else if (caracter == "\"" || caracter == "\“"){
                    estado = 17
                    columna++
                    lexemaAuxiliar += caracter
                }else if (caracter == "\'" || caracter == "\‘"){
                    estado = 18
                    columna++
                    lexemaAuxiliar += caracter  
                }else {
                    listadoErroresLexicos.push({valor:caracter, fila:fila, columna:columna})
                    columna++
                    console.log("error")
                }
                break;
            case 1:
                if (caracter == "="){
                    estado = 0
                    columna++
                    listaTokens.push({tipo: "tk_mayorIgual", valor: ">=", 
                    fila: fila, columna: columna - 1})
                }else{
                    estado = 0
                    listaTokens.push({tipo: "tk_mayor", valor: ">", 
                    fila: fila, columna: columna})
                    i--
                }
                break;
            case 2:
                if (caracter == "="){
                    estado = 0
                    columna++
                    listaTokens.push({tipo: "tk_menorIgual", valor: "<=", 
                    fila: fila, columna: columna - 1})
                }else{
                    estado = 0
                    listaTokens.push({tipo: "tk_menor", valor: "<", 
                    fila: fila, columna: columna})
                    i--
                }
                break;
            case 3:
                if (caracter == "="){
                    estado = 0
                    columna++
                    listaTokens.push({tipo: "tk_igualacion", valor: "==", 
                    fila: fila, columna: columna - 1})
                }else{
                    estado = 0
                    listaTokens.push({tipo: "tk_igual", valor: "=", 
                    fila: fila, columna: columna})
                    i--
                }
                break;
            case 4:
                if (caracter == "="){
                    estado = 0
                    columna++
                    listaTokens.push({tipo: "tk_distinto", valor: "!=", 
                    fila: fila, columna: columna - 1})
                }else{
                    estado = 0
                    listaTokens.push({tipo: "tk_not", valor: "!", 
                    fila: fila, columna: columna})
                    i--
                }
                break;
            case 5:
                if (caracter == "&"){
                    estado = 0
                    columna++
                    listaTokens.push({tipo: "tk_and", valor: "&&", 
                    fila: fila, columna: columna - 1})
                }else{
                    estado = 0
                    i--
                    columna++
                    listadoErroresLexicos.push({valor:"&", fila:fila, columna:columna})
                }
                break;
            case 6:
                if (caracter == "|"){
                    estado = 0
                    columna++
                    listaTokens.push({tipo: "tk_or", valor: "||", 
                    fila: fila, columna: columna - 1})
                }else{
                    estado = 0
                    listadoErroresLexicos.push({valor:"|", fila:fila, columna:columna})
                    i--
                }
                break;
            case 7:
                if (caracter == "+"){
                    estado = 0
                    columna++
                    listaTokens.push({tipo: "tk_adicion", valor: "++", 
                    fila: fila, columna: columna - 1})
                }else{
                    estado = 0
                    listaTokens.push({tipo: "tk_mas", valor: "+", 
                    fila: fila, columna: columna})
                    i--
                }
                break;
            case 8:
                if (caracter == "-"){
                    estado = 0
                    columna++
                    listaTokens.push({tipo: "tk_sustraccion", valor: "--", 
                    fila: fila, columna: columna - 1})
                }else{
                    estado = 0
                    listaTokens.push({tipo: "tk_menos", valor: "-", 
                    fila: fila, columna: columna})
                    i--
                }
                break;
            case 9:
                if (caracter == "/"){
                    columna++
                    estado = 10
                }else if (caracter == "*"){
                    columna++
                    estado = 11
                }else{
                    estado = 0
                    listaTokens.push({tipo: "tk_division", valor: "/", 
                    fila: fila, columna: columna})
                    i--
                }
                break;
            case 10:
                if (caracter == "\n"){
                    etado = 0
                    columna++
                    //listaTokens.push({tipo: "tk_comentarioIndividual", valor: lexemaAuxiliar})
                    lexemaAuxiliar = ""
                }else{
                    estado = 10
                    columna++
                    lexemaAuxiliar += caracter
                }
                break;
            case 11:
                if (caracter == "*"){
                    estado = 12
                    columna++
                    lexemaAuxiliar += caracter
                }else{
                    columna++
                    lexemaAuxiliar += caracter
                    estado = 11
                }
                break;
            case 12:
                if (caracter == "/"){
                    estado = 0
                    columna++
                    lexemaAuxiliar = lexemaAuxiliar.substring(0, lexemaAuxiliar.length - 2)
                    //listaTokens.push({tipo: "tk_comentarioMultiple", valor: lexemaAuxiliar})
                    lexemaAuxiliar = ""
                }else{
                    estado = 12
                    columna++
                    lexemaAuxiliar += caracter
                }
                break;
            case 13:
                if (caracter.match(/[0-9]/i) || caracter.match(/[a-z]/i) || caracter == "_"){
                    estado = 13
                    columna++
                    lexemaAuxiliar += caracter
                }else{
                    if (lexemaAuxiliar.toLowerCase() == "public"){
                        estado = 0
                        listaTokens.push({tipo: "tk_public", valor: lexemaAuxiliar, 
                        fila: fila, columna: columna - lexemaAuxiliar.length})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "true"){
                        estado = 0
                        listaTokens.push({tipo: "tk_true", valor: lexemaAuxiliar, 
                        fila: fila, columna: columna - lexemaAuxiliar.length})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "false"){
                        estado = 0
                        listaTokens.push({tipo: "tk_false", valor: lexemaAuxiliar, 
                        fila: fila, columna: columna - lexemaAuxiliar.length})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "class"){
                        estado = 0
                        listaTokens.push({tipo: "tk_class", valor: lexemaAuxiliar, 
                        fila: fila, columna: columna - lexemaAuxiliar.length})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "interface"){
                        estado = 0
                        listaTokens.push({tipo: "tk_interface", valor: lexemaAuxiliar, 
                        fila: fila, columna: columna - lexemaAuxiliar.length})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "void"){
                        estado = 0
                        listaTokens.push({tipo: "tk_void", valor: lexemaAuxiliar, 
                        fila: fila, columna: columna - lexemaAuxiliar.length})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "for"){
                        estado = 0
                        listaTokens.push({tipo: "tk_for", valor: lexemaAuxiliar, 
                        fila: fila, columna: columna - lexemaAuxiliar.length})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "while"){
                        estado = 0
                        listaTokens.push({tipo: "tk_while", valor: lexemaAuxiliar, 
                        fila: fila, columna: columna - lexemaAuxiliar.length})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "do"){
                        estado = 0
                        listaTokens.push({tipo: "tk_do", valor: lexemaAuxiliar, 
                        fila: fila, columna: columna - lexemaAuxiliar.length})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "if"){
                        estado = 0
                        listaTokens.push({tipo: "tk_if", valor: lexemaAuxiliar, 
                        fila: fila, columna: columna - lexemaAuxiliar.length})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "else"){
                        estado = 0
                        listaTokens.push({tipo: "tk_else", valor: lexemaAuxiliar, 
                        fila: fila, columna: columna - lexemaAuxiliar.length})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "break"){
                        estado = 0
                        listaTokens.push({tipo: "tk_break", valor: lexemaAuxiliar, 
                        fila: fila, columna: columna - lexemaAuxiliar.length})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "continue"){
                        estado = 0
                        listaTokens.push({tipo: "tk_continue", valor: lexemaAuxiliar, 
                        fila: fila, columna: columna - lexemaAuxiliar.length})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "return"){
                        estado = 0
                        listaTokens.push({tipo: "tk_return", valor: lexemaAuxiliar, 
                        fila: fila, columna: columna - lexemaAuxiliar.length})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "int"){
                        estado = 0
                        listaTokens.push({tipo: "tk_int", valor: lexemaAuxiliar, 
                        fila: fila, columna: columna - lexemaAuxiliar.length})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "boolean"){
                        estado = 0
                        listaTokens.push({tipo: "tk_boolean", valor: lexemaAuxiliar, 
                        fila: fila, columna: columna - lexemaAuxiliar.length})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "double"){
                        estado = 0
                        listaTokens.push({tipo: "tk_double", valor: lexemaAuxiliar, 
                        fila: fila, columna: columna - lexemaAuxiliar.length})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "string"){
                        estado = 0
                        listaTokens.push({tipo: "tk_string", valor: lexemaAuxiliar, 
                        fila: fila, columna: columna - lexemaAuxiliar.length})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "char"){
                        estado = 0
                        listaTokens.push({tipo: "tk_char", valor: lexemaAuxiliar, 
                        fila: fila, columna: columna - lexemaAuxiliar.length})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "static"){
                        estado = 0
                        listaTokens.push({tipo: "tk_static", valor: lexemaAuxiliar, 
                        fila: fila, columna: columna - lexemaAuxiliar.length})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "main"){
                        estado = 0
                        listaTokens.push({tipo: "tk_main", valor: lexemaAuxiliar, 
                        fila: fila, columna: columna - lexemaAuxiliar.length})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "args"){
                        estado = 0
                        listaTokens.push({tipo: "tk_args", valor: lexemaAuxiliar, 
                        fila: fila, columna: columna - lexemaAuxiliar.length})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "system"){
                        estado = 0
                        listaTokens.push({tipo: "tk_system", valor: lexemaAuxiliar, 
                        fila: fila, columna: columna - lexemaAuxiliar.length})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "out"){
                        estado = 0
                        listaTokens.push({tipo: "tk_out", valor: lexemaAuxiliar, 
                        fila: fila, columna: columna - lexemaAuxiliar.length})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "print"){
                        estado = 0
                        listaTokens.push({tipo: "tk_print", valor: lexemaAuxiliar, 
                        fila: fila, columna: columna - lexemaAuxiliar.length})
                        lexemaAuxiliar = ""
                        i--
                    }else if (lexemaAuxiliar.toLowerCase() == "println"){
                        estado = 0
                        listaTokens.push({tipo: "tk_println", valor: lexemaAuxiliar, 
                        fila: fila, columna: columna - lexemaAuxiliar.length})
                        lexemaAuxiliar = ""
                        i--
                    }else{
                        estado = 0
                        listaTokens.push({tipo: "tk_identificador", valor: lexemaAuxiliar, 
                        fila: fila, columna: columna - lexemaAuxiliar.length})
                        lexemaAuxiliar = ""
                        i--
                    }
                }
                break;
            case 14:
                if (caracter.match(/[0-9]/i)){
                    columna++
                    estado = 14
                    lexemaAuxiliar += caracter
                }else if (caracter == "."){
                    columna++
                    estado = 15
                    lexemaAuxiliar += caracter
                }else{
                    estado = 0
                    listaTokens.push({tipo: "tk_numero", valor: lexemaAuxiliar, 
                    fila: fila, columna: columna - lexemaAuxiliar.length})
                    i--
                    lexemaAuxiliar = ""
                }
                break;
            case 15: 
                if (caracter.match(/[0-9]/i)){
                    estado = 16
                    lexemaAuxiliar += caracter
                    columna++
                }else{
                    listadoErroresLexicos.push({valor:caracter, fila:fila, columna:columna})
                    console.log("error")
                    i--
                }
                break;
            case 16:
                if (caracter.match(/[0-9]/i)){
                    columna++
                    estado = 16
                    lexemaAuxiliar += caracter
                }else{
                    listaTokens.push({tipo: "tk_decimal", valor: lexemaAuxiliar, 
                    fila: fila, columna: columna - lexemaAuxiliar.length})
                    lexemaAuxiliar = ""
                    i--
                    estado = 0
                }
                break;
            case 17:
                if (caracter == "\"" || caracter == "\“"){
                    estado = 0
                    lexemaAuxiliar += caracter
                    columna++
                    listaTokens.push({tipo: "tk_stringTexto", valor: lexemaAuxiliar, 
                    fila: fila, columna: columna - lexemaAuxiliar.length})
                    lexemaAuxiliar = ""
                }else{
                    columna++
                    lexemaAuxiliar += caracter
                    estado = 17
                }
                break;
            case 18:
                if (caracter == "\'" || caracter == "\‘"){
                    estado = 0
                    lexemaAuxiliar += caracter
                    columna++
                    listaTokens.push({tipo: "tk_charTexto", valor: lexemaAuxiliar, 
                    fila: fila, columna: columna - lexemaAuxiliar.length})
                    lexemaAuxiliar = ""
                }else{
                    columna++
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
    traducido = traducido.replace("\n\n", "\n")

    dot = dot.replace("\"\"", "\"")
    dot = dot.replace("\"\"", "\"")

    dot = dot.replace("\"\“", "\"")
    dot = dot.replace("\“\"", "\"")

    dot = dot.replace("\'\"", "\"")
    dot = dot.replace("\"\'", "\"")

    dot = dot.replace("\"\‘", "\"")
    dot = dot.replace("\‘\"", "\"")
}

function analizadorSintactico(){
    listadoErroresSintacticos = [];
    iteradorSintactico = 0;
    iteradorDot = 0;
    tokenActual = listaTokens[iteradorSintactico];
    dot = "digraph Arbol{\n"
    dot += "\"raiz\"" + " [label = \"Raiz\"]\n"
    traducido = ""
    tabulados = ""
    publicoInterClass()
    dot += "}"
}

function publicoInterClass(){
    if (tokenActual.tipo == "tk_public"){
        let hijoActual = "clase"+iteradorDot
        if (iteradorSintactico + 1 < listaTokens.length){
            if(listaTokens[iteradorSintactico + 1].tipo == "tk_interface"){
                hijoActual = "interface" + iteradorDot
                dot += "\"" + hijoActual + "\"[label = \"Interfaz\"]\n"
                dot += "\"raiz\" -> \"" + hijoActual + "\"\n"
            }else{
                dot += "\"" + hijoActual + "\"[label = \"Clase\"]\n"
                dot += "\"raiz\" -> \"" + hijoActual + "\"\n"
            }
        }
        iteradorDot++
        parea("tk_public", "tk_public", "", hijoActual)
        interClass(hijoActual)
    }
}

function interClass(padreDot){
    if(tokenActual.tipo == "tk_interface"){
        parea("tk_interface", "tk_interface", "", padreDot)
        parea("tk_identificador", "tk_identificador", "", padreDot)
        parea("tk_llaveA", "tk_llaveA", "", padreDot)
        let hijoActual = "CuerpoInterfaz" + iteradorDot
        dot += "\"" + hijoActual + "\" [label = \"Cuerpo\"]\n"
        dot += "\"" + padreDot + "\" -> \"" + hijoActual + "\"\n"
        iteradorDot++
        definicion(hijoActual)
        parea("tk_llaveC", "tk_llaveC", "", padreDot)
        publicoInterClass()
    }else if(tokenActual.tipo == "tk_class"){
        parea("tk_class", "tk_class", "", padreDot)
        parea("tk_identificador", "tk_identificador", "", padreDot)
        parea("tk_llaveA", "tk_llaveA", "", padreDot)
        let hijoActual = "CuerpoClase" + iteradorDot
        dot += "\"" + hijoActual + "\" [label = \"Cuerpo\"]\n"
        dot += "\"" + padreDot + "\" -> \"" + hijoActual + "\"\n"  
        iteradorDot++
        instrucciones(hijoActual)
        parea("tk_llaveC", "tk_llaveC", "", padreDot)
        publicoInterClass()
    }else{
        parea("tk_error", "tk_interface | tk_clase", "")
    }
}

function definicion(padreDot){
    if (tokenActual.tipo == "tk_public"){
        let hijoActual = "definicionFuncion" + iteradorDot
        dot += "\"" + padreDot + "\"" + " -> \"" + hijoActual + "\"\n"
        dot += "\"" + hijoActual + "\" [label = \"Definicion\"]\n"
        iteradorDot++
        parea("tk_public", "tk_public", "definicion", hijoActual)
        tipoFuncion("definicion", hijoActual)
        parea("tk_identificador", "tk_identificador", "definicion", hijoActual)
        parea("tk_parA", "tk_parA", "definicion", hijoActual)
        let parametrosActual = "parametros" + iteradorDot
        dot += "\"" + hijoActual + "\"" + " -> \"" + parametrosActual + "\"\n"
        dot += "\"" + parametrosActual + "\" [label = \"Parametros\"]\n"
        iteradorDot++
        parametros("definicion", parametrosActual)
        parea("tk_parC", "tk_parC", "definicion", hijoActual)
        parea("tk_puntoComa", "tk_puntoComa", "definicion", hijoActual)
        definicion(padreDot)
    }
}

function tipoFuncion(contexto, padreDot){
    if (tokenActual.tipo == "tk_void"){
        parea("tk_void", "tk_void", contexto, padreDot)
    }else{
        tipo(contexto, padreDot)
    }
}

function tipo(contexto, padreDot){
    if(tokenActual.tipo == "tk_int"){
        parea("tk_int", "tk_int", contexto, padreDot)
    }else if(tokenActual.tipo == "tk_boolean"){
        parea("tk_boolean", "tk_boolean", contexto, padreDot)
    }else if(tokenActual.tipo == "tk_double"){
        parea("tk_double", "tk_double", contexto, padreDot)
    }else if(tokenActual.tipo == "tk_string"){
        parea("tk_string", "tk_string", contexto, padreDot)
    }else if(tokenActual.tipo == "tk_char"){
        parea("tk_char", "tk_char", contexto, padreDot)
    }else{
        parea("tk_error", "tk_tipo", "")
    }
}

function parametros(contexto, padreDot){
    if (tokenActual.tipo == "tk_int" || tokenActual.tipo == "tk_boolean" 
    || tokenActual.tipo == "tk_double" || tokenActual.tipo == "tk_string" 
    || tokenActual.tipo == "tk_char"){
        tipo(contexto, padreDot)
        parea("tk_identificador", "tk_identificador", contexto, padreDot)
        listadoParametros(contexto, padreDot)        
    }
}

function listadoParametros(contexto, padreDot){
    if (tokenActual.tipo == "tk_coma"){
        parea("tk_coma", "tk_coma", contexto, padreDot)
        parametros(contexto, padreDot)
    }
}

function instrucciones(padreDot){
    if(tokenActual.tipo == "tk_int" || tokenActual.tipo == "tk_boolean" 
    || tokenActual.tipo == "tk_double" || tokenActual.tipo == "tk_string" 
    || tokenActual.tipo == "tk_char"){
        declaracion("declaracion", padreDot)
        instrucciones(padreDot)
    }else if(tokenActual.tipo == "tk_public"){
        implementacion(padreDot)
        instrucciones(padreDot)
    }
}

function declaracion(contexto, padreDot){
    let hijoActual = "Cuerpo" + iteradorDot
    dot += "\"" + hijoActual + "\" [label = \"Declaracion\"]\n"
    dot += "\"" + padreDot + "\" -> \"" + hijoActual + "\"\n"  
    iteradorDot++
    tipo(contexto, hijoActual)
    identificadorDeclaracion(contexto, hijoActual)
    parea("tk_puntoComa", "tk_puntoComa", contexto, hijoActual)
}

function identificadorDeclaracion(contexto, padreDot){
    if(tokenActual.tipo == "tk_identificador"){
        parea("tk_identificador", "tk_identificador", contexto, padreDot)
        listadoDeclaracion(contexto, padreDot)
    }else{
        parea("tk_error", "tk_identificador", "")
    }
}

function listadoDeclaracion(contexto, padreDot){
    if(tokenActual.tipo == "tk_igual"){
        parea("tk_igual", "tk_igual", contexto, padreDot)
        let hijoActual = "Cuerpo" + iteradorDot
        dot += "\"" + hijoActual + "\" [label = \"Expresion\"]\n"
        dot += "\"" + padreDot + "\" -> \"" + hijoActual + "\"\n"  
        iteradorDot++ 
        expresion(hijoActual)
        listadoDeclaracion(contexto, padreDot)
    }else if (tokenActual.tipo == "tk_coma"){
        parea("tk_coma", "tk_coma", contexto, padreDot)
        identificadorDeclaracion(contexto, padreDot)
    }
}

function implementacion(padreDot){
    if(tokenActual.tipo == "tk_public"){
        contextoActual = "implementacion"
        if (iteradorSintactico + 1 < listaTokens.length){
            if(listaTokens[iteradorSintactico+1].tipo == "tk_static"){
                contextoActual = "main"
            }
        }
        let hijoActual = "Cuerpo" + iteradorDot
        dot += "\"" + hijoActual + "\" [label = \"Implementacion\"]\n"
        dot += "\"" + padreDot + "\" -> \"" + hijoActual + "\"\n"  
        iteradorDot++
        parea("tk_public", "tk_public", contextoActual, hijoActual)
        divTipoFuncion("implementacion", hijoActual)
    }else{
        parea("tk_error", "tk_public", "")
    }
}

function divTipoFuncion(contexto, padreDot){
    if(tokenActual.tipo == "tk_static"){
        parea("tk_static", "tk_static", "main", padreDot)
        parea("tk_void", "tk_void", "main", padreDot)
        parea("tk_main", "tk_main", "main", padreDot)
        parea("tk_parA", "tk_parA", "main", padreDot)
        parea("tk_string", "tk_string", "main", padreDot)
        parea("tk_corcheteA", "tk_corcheteA", "main", padreDot)
        parea("tk_corcheteC", "tk_corcheteC", "main", padreDot)
        parea("tk_args", "tk_args", "main", padreDot)
        parea("tk_parC", "tk_parC", "main", padreDot)
        parea("tk_llaveA", "tk_llaveA", "main", padreDot)
        let hijoActual = "Cuerpo" + iteradorDot
        dot += "\"" + hijoActual + "\" [label = \"Cuerpo\"]\n"
        dot += "\"" + padreDot + "\" -> \"" + hijoActual + "\"\n"  
        iteradorDot++
        interno(hijoActual)
        parea("tk_llaveC", "tk_llaveC", "main", padreDot)
    }else if (tokenActual.tipo == "tk_int" || tokenActual.tipo == "tk_boolean" 
    || tokenActual.tipo == "tk_double" || tokenActual.tipo == "tk_string" 
    || tokenActual.tipo == "tk_char" || tokenActual.tipo == "tk_void"){
        tipoFuncion(contexto, padreDot)
        parea("tk_identificador", "tk_identificador", contexto, padreDot)
        parea("tk_parA", "tk_parA", contexto, padreDot)
        let hijoActual1 = "Cuerpo" + iteradorDot
        dot += "\"" + hijoActual1 + "\" [label = \"Parametros\"]\n"
        dot += "\"" + padreDot + "\" -> \"" + hijoActual1 + "\"\n"  
        iteradorDot++
        parametros(contexto, hijoActual1)
        parea("tk_parC", "tk_parC", contexto, padreDot)
        parea("tk_llaveA", "tk_llaveA", contexto, padreDot)
        let hijoActual = "Cuerpo" + iteradorDot
        dot += "\"" + hijoActual + "\" [label = \"Cuerpo\"]\n"
        dot += "\"" + padreDot + "\" -> \"" + hijoActual + "\"\n"  
        iteradorDot++
        interno(hijoActual)
        parea("tk_llaveC", "tk_llaveC", contexto, padreDot)
    }else{
        parea("tk_error", "tk_static | tk_tipo", "")
    }
}

function interno(padreDot){
    if(tokenActual.tipo == "tk_system"){
        let hijoActual = "Cuerpo" + iteradorDot
        dot += "\"" + hijoActual + "\" [label = \"Print\"]\n"
        dot += "\"" + padreDot + "\" -> \"" + hijoActual + "\"\n"  
        iteradorDot++
        parea("tk_system", "tk_system", "print", hijoActual)
        parea("tk_punto", "tk_punto", "print", hijoActual)
        parea("tk_out", "tk_out", "print", hijoActual)
        parea("tk_punto", "tk_punto", "print", hijoActual)
        divPrint(hijoActual)
        interno(padreDot)
    }else if(tokenActual.tipo == "tk_for"){
        let hijoActual = "Cuerpo" + iteradorDot
        iteradorDot++
        dot += "\"" + hijoActual + "\" [label = \"For\"]\n"
        dot += "\"" + padreDot + "\" -> \"" + hijoActual + "\"\n"
        parea("tk_for", "tk_for", "for", hijoActual)
        parea("tk_parA", "tk_parA", "for", hijoActual)
        let hijoActual1 = "Cuerpo" + iteradorDot
        dot += "\"" + hijoActual1 + "\" [label = \"Declaracion\"]\n"
        dot += "\"" + hijoActual + "\" -> \"" + hijoActual1 + "\"\n"  
        iteradorDot++
        banderaRange1 = true;
        declaracionFor(hijoActual1)
        banderaRange1 = false;
        parea("tk_puntoComa", "tk_puntoComa", "for", hijoActual)
        
        let hijoActual2 = "Cuerpo" + iteradorDot
        dot += "\"" + hijoActual2 + "\" [label = \"Expresion\"]\n"
        dot += "\"" + hijoActual + "\" -> \"" + hijoActual2 + "\"\n"  
        iteradorDot++
        
        banderaRange2 = true;
        expresion(hijoActual2)
        banderaRange2 = false;
        parea("tk_puntoComa", "tk_puntoComa", "for", hijoActual)
        
        let hijoActual3 = "Cuerpo" + iteradorDot
        dot += "\"" + hijoActual3 + "\" [label = \"Declaracion\"]\n"
        dot += "\"" + hijoActual + "\" -> \"" + hijoActual3 + "\"\n"  
        iteradorDot++
        
        expresion(hijoActual3)

        parea("tk_parC", "tk_parC", "for", hijoActual)
        parea("tk_llaveA", "tk_llaveA", "for", hijoActual)

        let hijoActual4 = "Cuerpo" + iteradorDot
        dot += "\"" + hijoActual4 + "\" [label = \"Interno\"]\n"
        dot += "\"" + hijoActual + "\" -> \"" + hijoActual4 + "\"\n"  
        iteradorDot++


        internoCiclo(hijoActual4)

        parea("tk_llaveC", "tk_llaveC", "for", hijoActual)
        interno(padreDot)
    }else if(tokenActual.tipo == "tk_while"){
        let hijoActual = "Cuerpo" + iteradorDot
        dot += "\"" + hijoActual + "\" [label = \"While\"]\n"
        dot += "\"" + padreDot + "\" -> \"" + hijoActual + "\"\n"  
        iteradorDot++
        parea("tk_while", "tk_while", "while", hijoActual)
        parea("tk_parA", "tk_parA", "while", hijoActual)
        let hijoActual1 = "Cuerpo" + iteradorDot
        dot += "\"" + hijoActual1 + "\" [label = \"Expresion\"]\n"
        dot += "\"" + hijoActual + "\" -> \"" + hijoActual1 + "\"\n"  
        iteradorDot++
        expresion(hijoActual1)
        parea("tk_parC", "tk_parC", "while", hijoActual)
        parea("tk_llaveA", "tk_llaveA", "while", hijoActual)
        let hijoActual2 = "Cuerpo" + iteradorDot
        dot += "\"" + hijoActual2 + "\" [label = \"Interno\"]\n"
        dot += "\"" + hijoActual + "\" -> \"" + hijoActual2 + "\"\n"  
        iteradorDot++
        internoCiclo(hijoActual2)
        parea("tk_llaveC", "tk_llaveC", "while", hijoActual)
        interno(padreDot)
    }else if(tokenActual.tipo == "tk_do"){
        let hijoActual = "Cuerpo" + iteradorDot
        dot += "\"" + hijoActual + "\" [label = \"While\"]\n"
        dot += "\"" + padreDot + "\" -> \"" + hijoActual + "\"\n"  
        iteradorDot++
        parea("tk_do", "tk_do", "dowhile", hijoActual)
        parea("tk_llaveA", "tk_llaveA", "dowhile", hijoActual)
        let hijoActual1 = "Cuerpo" + iteradorDot
        dot += "\"" + hijoActual1 + "\" [label = \"Interno\"]\n"
        dot += "\"" + hijoActual + "\" -> \"" + hijoActual1 + "\"\n"  
        iteradorDot++
        internoCiclo(hijoActual1)
        parea("tk_llaveC", "tk_llaveC", "dowhile", hijoActual)
        parea("tk_while", "tk_while", "dowhile", hijoActual)
        parea("tk_parA", "tk_parA", "dowhile", hijoActual)
        let hijoActual2 = "Cuerpo" + iteradorDot
        dot += "\"" + hijoActual2 + "\" [label = \"Expresion\"]\n"
        dot += "\"" + hijoActual + "\" -> \"" + hijoActual2 + "\"\n"  
        iteradorDot++
        expresion(hijoActual2)
        parea("tk_parC", "tk_parC", "dowhile", hijoActual)
        parea("tk_puntoComa", "tk_puntoComa", "dowhile", hijoActual)
        interno(padreDot)
    }else if(tokenActual.tipo == "tk_if"){
        let hijoActual = "Cuerpo" + iteradorDot
        dot += "\"" + hijoActual + "\" [label = \"If\"]\n"
        dot += "\"" + padreDot + "\" -> \"" + hijoActual + "\"\n"  
        iteradorDot++
        parea("tk_if", "tk_if", "if", hijoActual)
        parea("tk_parA", "tk_parA", "if", hijoActual)
        let hijoActual1 = "Cuerpo" + iteradorDot
        dot += "\"" + hijoActual1 + "\" [label = \"Expresion\"]\n"
        dot += "\"" + hijoActual + "\" -> \"" + hijoActual1 + "\"\n"  
        iteradorDot++
        expresion(hijoActual1)
        parea("tk_parC", "tk_parC", "if", hijoActual)
        parea("tk_llaveA", "tk_llaveA", "if", hijoActual)
        let hijoActual2 = "Cuerpo" + iteradorDot
        dot += "\"" + hijoActual2 + "\" [label = \"Interno\"]\n"
        dot += "\"" + hijoActual + "\" -> \"" + hijoActual2 + "\"\n"  
        iteradorDot++
        interno(hijoActual2)
        parea("tk_llaveC", "tk_llaveC", "if", hijoActual)
        let hijoActual3 = "Cuerpo" + iteradorDot
        dot += "\"" + hijoActual3 + "\" [label = \"Else | Else if\"]\n"
        dot += "\"" + hijoActual + "\" -> \"" + hijoActual3 + "\"\n"  
        iteradorDot++
        ifElse(hijoActual3)
        interno(padreDot)
    }else if(tokenActual.tipo == "tk_return"){
        let hijoActual = "Cuerpo" + iteradorDot
        dot += "\"" + hijoActual + "\" [label = \"Retorno\"]\n"
        dot += "\"" + padreDot + "\" -> \"" + hijoActual + "\"\n"  
        iteradorDot++
        parea("tk_return", "tk_return", "return", hijoActual)
        let hijoActual1 = "Cuerpo" + iteradorDot
        dot += "\"" + hijoActual1 + "\" [label = \"Expresion\"]\n"
        dot += "\"" + hijoActual + "\" -> \"" + hijoActual1 + "\"\n"  
        iteradorDot++
        tipoReturn(hijoActual1)
        parea("tk_puntoComa", "tk_puntoComa", "return", hijoActual)
        interno(padreDot)
    }else if(tokenActual.tipo == "tk_identificador"){
        llamadoAsignacion(padreDot)
        interno(padreDot)
    }else if(tokenActual.tipo == "tk_int" || tokenActual.tipo == "tk_boolean" 
    || tokenActual.tipo == "tk_double" || tokenActual.tipo == "tk_string" 
    || tokenActual.tipo == "tk_char"){
        declaracion("declaracion", padreDot)
        interno()
    }
}

function internoCiclo(padreDot){
    if(tokenActual.tipo == "tk_break"){
        parea("tk_break", "tk_break", "ciclo", padreDot)
        parea("tk_puntoComa", "tk_puntoComa", "ciclo", padreDot)
        internoCiclo(padreDot)
    }else if(tokenActual.tipo == "tk_continue"){
        parea("tk_continue", "tk_continue", "ciclo", padreDot)
        parea("tk_puntoComa", "tk_puntoComa", "ciclo", padreDot)
        internoCiclo(padreDot)
    }else{
        interno(padreDot)
    }
}

function divPrint(padreDot){
    if(tokenActual.tipo == "tk_print"){
        parea("tk_print", "tk_print", "print", padreDot)
        parea("tk_parA", "tk_parA", "print", padreDot)
        let hijoActual = "Cuerpo" + iteradorDot
        dot += "\"" + hijoActual + "\" [label = \"Expresion\"]\n"
        dot += "\"" + padreDot + "\" -> \"" + hijoActual + "\"\n"  
        iteradorDot++
        expresion(hijoActual)
        parea("tk_parC", "tk_parC", "print", padreDot)
        parea("tk_puntoComa", "tk_puntoComa", "print", padreDot)
    }else if(tokenActual.tipo == "tk_println"){
        parea("tk_println", "tk_println", "print", padreDot)
        parea("tk_parA", "tk_parA", "print", padreDot)
        let hijoActual = "Cuerpo" + iteradorDot
        dot += "\"" + hijoActual + "\" [label = \"Expresion\"]\n"
        dot += "\"" + padreDot + "\" -> \"" + hijoActual + "\"\n"  
        iteradorDot++
        expresion(hijoActual)
        parea("tk_parC", "tk_parC", "print", padreDot)
        parea("tk_puntoComa", "tk_puntoComa", "print", padreDot)
    }else{
        parea("tk_error", "tk_print")
    }
}

function ifElse(padreDot){
    if(tokenActual.tipo == "tk_else"){
        var contextoActual = "else"
        if (iteradorSintactico + 1 < listaTokens.length){
            if(listaTokens[iteradorSintactico+1].tipo == "tk_if"){
                contextoActual = "elseif"
            }
        }
        parea("tk_else", "tk_else", contextoActual, padreDot)
        comprobacionElif(padreDot)
    }   
}

function comprobacionElif(padreDot){
    if(tokenActual.tipo == "tk_llaveA"){
        parea("tk_llaveA", "tk_llaveA", "else", padreDot)
        let hijoActual = "Cuerpo" + iteradorDot
        dot += "\"" + hijoActual + "\" [label = \"Interno\"]\n"
        dot += "\"" + padreDot + "\" -> \"" + hijoActual + "\"\n"  
        iteradorDot++
        interno(hijoActual)
        parea("tk_llaveC", "tk_llaveC", "else", padreDot)
    }else if(tokenActual.tipo == "tk_if"){
        parea("tk_if", "tk_if", "elseif", padreDot)
        parea("tk_parA", "tk_parA", "elseif", padreDot)
        let hijoActual = "Cuerpo" + iteradorDot
        dot += "\"" + hijoActual + "\" [label = \"Expresion\"]\n"
        dot += "\"" + padreDot + "\" -> \"" + hijoActual + "\"\n"  
        iteradorDot++
        expresion(hijoActual)
        parea("tk_parC", "tk_parC", "elseif", padreDot)
        parea("tk_llaveA", "tk_llaveA", "elseif", padreDot)
        let hijoActual1 = "Cuerpo" + iteradorDot
        dot += "\"" + hijoActual1 + "\" [label = \"Interno\"]\n"
        dot += "\"" + padreDot + "\" -> \"" + hijoActual1 + "\"\n"  
        iteradorDot++
        interno(hijoActual1)
        parea("tk_llaveC", "tk_llaveC", "elseif", padreDot)
        ifElse(padreDot)
    }else{
        parea("tk_error", "tk_llave | tk_if")
    }
}

function tipoReturn(padreDot){
    if(tokenActual.tipo == "tk_menos" || tokenActual.tipo == "tk_not" ||
    tokenActual.tipo == "tk_stringTexto" || tokenActual.tipo == "tk_charTexto" ||
    tokenActual.tipo == "tk_numero" || tokenActual.tipo == "tk_decimal" || 
    tokenActual.tipo == "tk_identificador" || tokenActual.tipo == "tk_true" ||
    tokenActual.tipo == "tk_false" || tokenActual.tipo == "tk_parA"){
        expresion(padreDot)
    }
}

function parametrosLlamada(padreDot){
    if(tokenActual.tipo == "tk_identificador"){
        parea("tk_identificador", "tk_identificador", "llamado", padreDot)
        listadoDeclaracionParametrosLlamado(padreDot)
    }else if(tokenActual.tipo == "tk_numero"){
        parea("tk_numero", "tk_numero", "llamado", padreDot)
        listadoDeclaracionParametrosLlamado(padreDot)
    }else if(tokenActual.tipo == "tk_decimal"){
        parea("tk_decimal", "tk_decimal", "llamado", padreDot)
        listadoDeclaracionParametrosLlamado(padreDot)
    }else if(tokenActual.tipo == "tk_true"){
        parea("tk_true", "tk_true", "llamado", padreDot)
        listadoDeclaracionParametrosLlamado(padreDot)
    }else if(tokenActual.tipo == "tk_false"){
        parea("tk_false", "tk_false", "llamado", padreDot)
        listadoDeclaracionParametrosLlamado(padreDot)
    }else if(tokenActual.tipo == "tk_stringTexto"){
        parea("tk_stringTexto", "tk_stringTexto", "llamado", padreDot)
        listadoDeclaracionParametrosLlamado(padreDot)
    }else if(tokenActual.tipo == "tk_charTexto"){
        parea("tk_charTexto", "tk_charTexto", "llamado", padreDot)
        listadoDeclaracionParametrosLlamado(padreDot)
    }else{
        parea("tk_error", "tk_tipo")
    }
}

function listadoDeclaracionParametrosLlamado(padreDot){
    if(tokenActual.tipo == "tk_coma"){
        parea("tk_coma", "tk_coma", "llamado", padreDot)
        parametrosLlamada(padreDot)
    }
}

function divLlamadoAsignacion(padreDot){
    if (tokenActual.tipo == "tk_parA"){
        parea("tk_parA", "tk_parA", "asignacion", padreDot)
        let hijoActual = "Cuerpo" + iteradorDot
        dot += "\"" + hijoActual + "\" [label = \"Parametros\"]\n"
        dot += "\"" + padreDot + "\" -> \"" + hijoActual + "\"\n"  
        iteradorDot++
        parametrosLlamada(hijoActual)
        parea("tk_parC", "tk_parC", "asignacion", padreDot)
        parea("tk_puntoComa", "tk_puntoComa", "asignacion", padreDot)
    }else if(tokenActual.tipo == "tk_igual"){
        parea("tk_igual", "tk_igual", "asginacion", padreDot)
        let hijoActual = "Cuerpo" + iteradorDot
        dot += "\"" + hijoActual + "\" [label = \"Expresion\"]\n"
        dot += "\"" + padreDot + "\" -> \"" + hijoActual + "\"\n"  
        iteradorDot++
        expresion(hijoActual)
        parea("tk_puntoComa", "tk_puntoComa", "asignacion", padreDot)
    }else{
        parea("tk_error", "tk_parA | tk_igual")
    }
}

function llamadoAsignacion(padreDot){
    if(tokenActual.tipo == "tk_identificador"){
        let hijoActual = "Cuerpo" + iteradorDot
        dot += "\"" + hijoActual + "\" [label = \"Llamado | Asignacion\"]\n"
        dot += "\"" + padreDot + "\" -> \"" + hijoActual + "\"\n"  
        iteradorDot++
        parea("tk_identificador", "tk_identificador", "asignacion", hijoActual)
        divLlamadoAsignacion(hijoActual)    
    }else{
        parea("tk_error", "tk_identificador")
    }
}

function declaracionFor(padreDot){
    if(tokenActual.tipo == "tk_int" || tokenActual.tipo == "tk_boolean" 
    || tokenActual.tipo == "tk_double" || tokenActual.tipo == "tk_string" 
    || tokenActual.tipo == "tk_char"){
        tipo("forRange", padreDot)
        identificadorDeclaracionFor(padreDot)
    }else{
        parea("tk_error", "tk_tipo")
    }
}

function identificadorDeclaracionFor(padreDot){
    if(tokenActual.tipo == "tk_identificador"){
        parea("tk_identificador", "tk_identificador", "forRange", padreDot)
        parea("tk_igual", "tk_igual", "forRange", padreDot)
        expresion(padreDot)
    }else{
        parea("tk_error", "tk_identificador")
    }
}

function expresion(padreDot){
    if(tokenActual.tipo == "tk_menos"){
        parea("tk_menos", "tk_menos", "expresion", padreDot)
        expresion(padreDot)
        expresionPrima(padreDot)
    }else if(tokenActual.tipo == "tk_not"){
        parea("tk_not", "tk_not", "expresion", padreDot)
        expresion(padreDot)
        expresionPrima(padreDot)
    }else if(tokenActual.tipo == "tk_stringTexto"){
        parea("tk_stringTexto", "tk_stringTexto", "expresion", padreDot)
        expresionPrima(padreDot)
    }else if(tokenActual.tipo == "tk_charTexto"){
        parea("tk_charTexto", "tk_charTexto", "expresion", padreDot)
        expresionPrima(padreDot)
    }else if(tokenActual.tipo == "tk_numero"){
        parea("tk_numero", "tk_numero", "expresion", padreDot)
        expresionPrima(padreDot)
    }else if(tokenActual.tipo == "tk_decimal"){
        parea("tk_decimal", "tk_decimal", "expresion", padreDot)
        expresionPrima(padreDot)
    }else if(tokenActual.tipo == "tk_identificador"){
        parea("tk_identificador", "tk_identificador", "expresion", padreDot)
        expresionPrima(padreDot)
    }else if(tokenActual.tipo == "tk_true"){
        parea("tk_true", "tk_true", "expresion", padreDot)
        expresionPrima(padreDot)
    }else if(tokenActual.tipo == "tk_false"){
        parea("tk_false", "tk_false", "expresion", padreDot)
        expresionPrima(padreDot)
    }else if(tokenActual.tipo == "tk_parA"){
        parea("tk_parA", "tk_parA", "expresion", padreDot)
        expresion(padreDot)
        parea("tk_parC", "tk_parC", "expresion", padreDot)
        expresionPrima(padreDot)
    }else{
        parea("tk_error", "tk_expresion", "")
    }
}

function expresionPrima(padreDot){
    if(tokenActual.tipo == "tk_and"){
        parea("tk_and", "tk_and", "expresion", padreDot)
        expresion(padreDot)
        expresionPrima(padreDot)
    }else if(tokenActual.tipo == "tk_or"){
        parea("tk_or", "tk_or", "expresion", padreDot)
        expresion(padreDot)
        expresionPrima(padreDot)
    }else if(tokenActual.tipo == "tk_xor"){
        parea("tk_xor", "tk_xor", "expresion", padreDot)
        expresion(padreDot)
        expresionPrima(padreDot)
    }else if(tokenActual.tipo == "tk_adicion"){
        parea("tk_adicion", "tk_adicion", "expresion", padreDot)
        expresionPrima(padreDot)
    }else if(tokenActual.tipo == "tk_sustraccion"){
        parea("tk_sustraccion", "tk_sustraccion", "expresion", padreDot)
        expresionPrima(padreDot)
    }else if(tokenActual.tipo == "tk_mayor"){
        parea("tk_mayor", "tk_mayor", "expresion", padreDot)
        expresion(padreDot)
        expresionPrima(padreDot)
    }else if(tokenActual.tipo == "tk_menor"){
        parea("tk_menor", "tk_menor", "expresion", padreDot)
        expresion(padreDot)
        expresionPrima(padreDot)
    }else if(tokenActual.tipo == "tk_mayorIgual"){
        parea("tk_mayorIgual", "tk_mayorIgual", "expresion", padreDot)
        expresion(padreDot)
        expresionPrima(padreDot)
    }else if(tokenActual.tipo == "tk_menorIgual"){
        parea("tk_menorIgual", "tk_menorIgual", "expresion", padreDot)
        expresion(padreDot)
        expresionPrima(padreDot)
    }else if(tokenActual.tipo == "tk_igualacion"){
        parea("tk_igualacion", "tk_igualacion", "expresion", padreDot)
        expresion(padreDot)
        expresionPrima(padreDot)
    }else if(tokenActual.tipo == "tk_distinto"){
        parea("tk_distinto", "tk_distinto", "expresion", padreDot)
        expresion(padreDot)
        expresionPrima(padreDot)
    }else if(tokenActual.tipo == "tk_mas"){
        parea("tk_mas", "tk_mas", "expresion", padreDot)
        expresion(padreDot)
        expresionPrima(padreDot)
    }else if(tokenActual.tipo == "tk_menos"){
        parea("tk_menos", "tk_menos", "expresion", padreDot)
        expresion(padreDot)
        expresionPrima(padreDot)
    }else if(tokenActual.tipo == "tk_por"){
        parea("tk_por", "tk_por", "expresion", padreDot)
        expresion(padreDot)
        expresionPrima(padreDot)
    }else if(tokenActual.tipo == "tk_division"){
        parea("tk_division", "tk_division", "expresion", padreDot)
        expresion(padreDot)
        expresionPrima(padreDot)
    }
}

function parea(preAnalisis, esperado, contexto, padreDot){
    if (preAnalisis == tokenActual.tipo){
        dot += "\"" + tokenActual.tipo +  tokenActual.fila + tokenActual.columna + "\" [label = \""+tokenActual.valor+"\"]\n"
        dot += padreDot +" -> "+ "\"" + tokenActual.tipo + tokenActual.fila + tokenActual.columna + "\"\n"
        traduccion(tokenActual, contexto)
        iteradorSintactico++
        if (iteradorSintactico < listaTokens.length){
            tokenActual = listaTokens[iteradorSintactico]
        }
    }else{
        listadoErroresSintacticos.push({encontrado: tokenActual.tipo, esperado: esperado, 
            fila: tokenActual.fila, columna: tokenActual.columna})
        while(true){
            if(tokenActual.tipo == "tk_puntoComa" || tokenActual.tipo == "tk_llaveA"){
                break
            }
            iteradorSintactico++
            if (iteradorSintactico < listaTokens.length){
                tokenActual = listaTokens[iteradorSintactico]
            }else{
                break
            }
        }
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
            if(banderaRange1){
                range1 += " - "
            }else if(banderaRange2){
                range2 += " - "
            }else{
                traducido += " - "
            }
        }else if(tokenTraducir.tipo == "tk_not"){
            if(banderaRange1){
                range1 += " not "
            }else if(banderaRange2){
                range2 += " not "
            }else{
                traducido += " not "
            }
        }else if(tokenTraducir.tipo == "tk_stringTexto"){
            if(banderaRange1){
                range1 += tokenTraducir.valor
            }else if(banderaRange2){
                range2 += tokenTraducir.valor
            }else{
                traducido += tokenTraducir.valor
            }
        }else if(tokenTraducir.tipo == "tk_charTexto"){
            if(banderaRange1){
                range1 += tokenTraducir.valor
            }else if(banderaRange2){
                range2 += tokenTraducir.valor
            }else{
                traducido += tokenTraducir.valor
            }
        }else if(tokenTraducir.tipo == "tk_numero"){
            if(banderaRange1){
                range1 += tokenTraducir.valor
            }else if(banderaRange2){
                range2 += tokenTraducir.valor
            }else{
                traducido += tokenTraducir.valor
            }
        }else if(tokenTraducir.tipo == "tk_decimal"){
            if(banderaRange1){
                range1 += tokenTraducir.valor
            }else if(banderaRange2){
                range2 += tokenTraducir.valor
            }else{
                traducido += tokenTraducir.valor
            }
        }else if(tokenTraducir.tipo == "tk_identificador"){
            if(banderaRange1){
                range1 += tokenTraducir.valor
            }else if(banderaRange2){
                range2 += tokenTraducir.valor
            }else{
                traducido += tokenTraducir.valor
            }
        }else if(tokenTraducir.tipo == "tk_true"){
            if(banderaRange1){
                range1 += " True "
            }else if(banderaRange2){
                range2 += " True "
            }else{
                traducido += " True "
            }
        }else if(tokenTraducir.tipo == "tk_false"){
            if(banderaRange1){
                range1 += " False "
            }else if(banderaRange2){
                range2 += " False "
            }else{
                traducido += " False "
            }
        }else if(tokenTraducir.tipo == "tk_parA"){
            if(banderaRange1){
                range1 += "("
            }else if(banderaRange2){
                range2 += "("
            }else{
                traducido += "("
            }
        }else if(tokenTraducir.tipo == "tk_parC"){
            if(banderaRange1){
                range1 += ")"
            }else if(banderaRange2){
                range2 += ")"
            }else{
                traducido += ")"    
            }
        }else if(tokenTraducir.tipo == "tk_and"){
            if(banderaRange1){
                range1 += " and "
            }else if(banderaRange2){
                range2 += " and "
            }else{
                traducido += " and "
            }
        }else if(tokenTraducir.tipo == "tk_or"){
            if(banderaRange1){
                range1 += " or "
            }else if(banderaRange2){
                range2 += " or "
            }else{
                traducido += " or "
            }
        }else if(tokenTraducir.tipo == "tk_xor"){
            if(banderaRange1){
                range1 += " xor "
            }else if(banderaRange2){
                range2 += " xor "
            }else{
                traducido += " xor "
            }
        }else if(tokenTraducir.tipo == "tk_adicion"){
            if(banderaRange1){
                range1 += " += "
            }else if(banderaRange2){
                range2 += " += "
            }else{
                traducido += " += "
            }
        }else if(tokenTraducir.tipo == "tk_sustraccion"){
            if(banderaRange1){
                range1 += " -= "
            }else if(banderaRange2){
                range2 += " -= "
            }else{
                traducido += " -= "
            }
        }else if(tokenTraducir.tipo == "tk_mayor"){
            if(banderaRange1){
                range1 += " > "
            }else if(banderaRange2){
                range2 += " > "
            }else{
                traducido += " > "
            }
        }else if(tokenTraducir.tipo == "tk_menor"){
            if(banderaRange1){
                range1 += " < "
            }else if(banderaRange2){
                range2 += " < "
            }else{
                traducido += " < "
            }
        }else if(tokenTraducir.tipo == "tk_mayorIgual"){
            if(banderaRange1){
                range1 += " >= "
            }else if(banderaRange2){
                range2 += " >= "
            }else{
                traducido += " >= "
            }
        }else if(tokenTraducir.tipo == "tk_menorIgual"){
            if(banderaRange1){
                range1 += " <= "
            }else if(banderaRange2){
                range2 += " <= "
            }else{
                traducido += " <= "
            }
        }else if(tokenTraducir.tipo == "tk_igualacion"){
            if(banderaRange1){
                range1 += " == "
            }else if(banderaRange2){
                range2 += " == "
            }else{
                traducido += " == "
            }
        }else if(tokenTraducir.tipo == "tk_distinto"){
            if(banderaRange1){
                range1 += " != "
            }else if(banderaRange2){
                range2 += " != "
            }else{
                traducido += " != "
            }
        }else if(tokenTraducir.tipo == "tk_mas"){
            if(banderaRange1){
                range1 += " + "
            }else if(banderaRange2){
                range2 += " + "
            }else{
                traducido += " + "
            }
        }else if(tokenTraducir.tipo == "tk_por"){
            if(banderaRange1){
                range1 += " * "
            }else if(banderaRange2){
                range2 += " * "
            }else{
                traducido += " * "
            }
        }else if(tokenTraducir.tipo == "tk_division"){
            if(banderaRange1){
                range1 += " / "
            }else if(banderaRange2){
                range2 += " / "
            }else{
                traducido += " / "
            }
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
    }else if(contexto == "while"){
        if(tokenTraducir.tipo == "tk_while"){
            traducido += tabulados + "while "
        }else if(tokenTraducir.tipo == "tk_llaveA"){
            traducido += ":\n"
            tabulados += "\t"
        }else if(tokenTraducir.tipo == "tk_llaveC"){
            tabulados = tabulados.substring(0, tabulados.length - 1)
            traducido += "\n"
        }
    }else if(contexto == "ciclo"){
        if(tokenTraducir.tipo == "tk_continue"){
            traducido += tabulados + "continue"
        }else if(tokenTraducir.tipo == "tk_break"){
            traducido += tabulados + "break"
        }else if(tokenTraducir.tipo == "tk_puntoComa"){
            traducido += "\n"
        }
    }else if(contexto == "dowhile"){
        if (tokenTraducir.tipo == "tk_do"){
            traducido += tabulados + "while"
        }else if(tokenTraducir.tipo == "tk_llaveA"){
            traducido += ":\n"
            tabulados += "\t"
        }else if(tokenTraducir.tipo == "tk_llaveC"){
            tabulados = tabulados.substring(0, tabulados.length - 1)
            traducido += "\n"
        }
    }else if(contexto == "if"){
        if(tokenTraducir.tipo == "tk_if"){
            traducido += tabulados + "if "
        }else if(tokenTraducir.tipo == "tk_llaveA"){
            traducido += ":\n"
            tabulados += "\t"
            console.log(tabulados.length)
        }else if(tokenTraducir.tipo == "tk_llaveC"){
            tabulados = tabulados.substring(0, tabulados.length - 1)
            console.log(tabulados.length)
            traducido += "\n"
        }
    }else if(contexto == "elseif"){
        if(tokenTraducir.tipo == "tk_llaveA"){
            traducido += ":\n"
            tabulados += "\t"
            console.log(tabulados.length)
        }else if(tokenTraducir.tipo == "tk_llaveC"){
            console.log(tabulados.length)
            tabulados = tabulados.substring(0, tabulados.length - 1)
            traducido += "\n"

        }else if(tokenTraducir.tipo == "tk_if"){
            traducido += tabulados + "elif "
        }
    }else if(contexto == "else"){
        if(tokenTraducir.tipo == "tk_else"){
            traducido += tabulados + "else"
        }else if(tokenTraducir.tipo == "tk_llaveA"){
            traducido += ":\n"
            tabulados += "\t"
            console.log(tabulados.length)
        }else if(tokenTraducir.tipo == "tk_llaveC"){
            console.log(tabulados.length)
            tabulados = tabulados.substring(0, tabulados.length - 1)
            traducido += "\n"
        }
    }else if(contexto == "return"){
        if (tokenTraducir.tipo == "tk_return"){
            traducido += tabulados + "return "
        }else if(tokenTraducir.tipo == "tk_puntoComa"){
            traducido += "\n"
        }
    }else if(contexto == "asignacion"){
        if(tokenTraducir.tipo == "tk_identificador"){
            traducido += tabulados + tokenTraducir.valor
        }else if(tokenTraducir.tipo == "tk_igual"){
            traducido += " = "
        }else if(tokenTraducir.tipo == "tk_parA"){
            traducido += "("
        }else if(tokenTraducir.tipo == "tk_parC"){
            traducido += ")"
        }else if(tokenTraducir.tipo == "tk_puntoComa"){
            traducido += "\n"
        }
    }else if(contexto == "llamado"){
        if(tokenTraducir.tipo == "tk_identificador"){
            traducido += tokenTraducir.valor
        }else if(tokenTraducir.tipo == "tk_numero"){
            traducido += tokenTraducir.valor
        }else if(tokenTraducir.tipo == "tk_decimal"){
            traducido += tokenTraducir.valor
        }else if(tokenTraducir.tipo == "tk_true"){
            traducido += " True "
        }else if(tokenTraducir.tipo == "tk_false"){
            traducido += " False "
        }else if(tokenTraducir.tipo == "tk_stringTexto"){
            traducido += tokenTraducir.valor
        }else if(tokenTraducir.tipo == "tk_charTexto"){
            traducido += tokenTraducir.valor
        }else if(tokenTraducir.tipo == "tk_coma"){
            traducido += ", "
        }
    }else if(contexto == "for"){
        if(tokenTraducir.tipo == "tk_for"){
            traducido += tabulados + "for"
        }else if(tokenTraducir.tipo == "tk_llaveA"){
            traducido += ":\n"
            tabulados += "\t"
            console.log(tabulados.length)
        }else if(tokenTraducir.tipo == "tk_llaveC"){
            tabulados = tabulados.substring(0, tabulados.length - 1)
            console.log(tabulados.length)
            traducido += "\n"
        }else if(tokenTraducir.tipo == "tk_parC"){
            traducido += identificadorFor + " in range (" + range1 + ", " + range2 + ")"
            identificadorFor = ""
            range2 = ""
            range1 = ""
        }
    }else if(contexto == "forRange"){
        if(tokenTraducir.tipo == "tk_identificador"){
            identificadorFor = tokenTraducir.valor
        }
    }
}

module.exports = router;