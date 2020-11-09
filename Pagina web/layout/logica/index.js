var traducidoJS = "";
var traducidoPython = "";

function abrirArchivo(archivos){
    var archivo = archivos[0]

    //creando una instancia del objeto que lee el contenido del archivo
    var lector = new FileReader();

    //funcion que agrega el contenido del archivo al textarea
    lector.onload = function (e) {
        document.getElementById("entrada").value = e.target.result;
    };

    //obtiene el contenido del archivo
    lector.readAsText(archivo);

    //limpia el archivo de entrada
    archivo.clear;

    //limpia el valor del archivo seleccionado
    document.getElementById('filedialog').value="";
}

function traducirAPython(){
    var salida = document.getElementById("entrada").value
    salida = salida.replace("\n", " ")
    console.log(salida)

    /*traduccion a python*/
    fetch("/traducirPython", {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({contenido: salida}),
        headers:{
        'Content-Type': 'application/json'
        }
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => respuestaPython(response) );


    /*Traduccion a js*/
    fetch("/traducirJS", {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({contenido: salida}),
        headers:{
        'Content-Type': 'application/json',
        }
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => respuestaJS(response));
}

function respuestaJS(respuesta){
    var textoConsola = "<----------Consola de salida JavaScript---------->\n"
    textoConsola += "Errores Lexicos:\n"
    if(respuesta.erroresLexicos.length == 0){
        textoConsola += "\tSin errores lexicos c:\n"
    }else{
        for(let i = 0; i < respuesta.erroresLexicos.length; i++){
            textoConsola += "\t" + (i+1) + ". Fila: " + respuesta.erroresLexicos[i].fila;
            textoConsola += " Columna: " +  respuesta.erroresLexicos[i].columna; 
            textoConsola += " Valor: " + respuesta.erroresLexicos[i].valor + "\n";
        }
    }
    textoConsola += "Errores Sintacticos:\n"
    if(respuesta.erroresSintacticos.length == 0){
        textoConsola += "\tSin errores sintacticos c:\n"
    }else{
        for(let i = 0; i < respuesta.erroresSintacticos.length; i++){
            textoConsola += "\t" + (i+1) + ". Fila: " + respuesta.erroresSintacticos[i].fila + " Columna: " +  respuesta.erroresSintacticos[i].columna + " Encontrado: " + respuesta.erroresSintacticos[i].encontrado + " Esperado: " + respuesta.erroresSintacticos[i].esperado + "\n";
        }
    }
    textoConsola += "Tokens:\n"
    if(respuesta.tokens.length == 0){
        textoConsola += "\tSin nada para traducir :c\n"
    }else{
        for(let i = 0; i < respuesta.tokens.length; i++){
            textoConsola += "\t" + (i+1) + ". Fila: " + respuesta.tokens[i].fila + " Columna: " +  respuesta.tokens[i].columna + " Tipo: " + respuesta.tokens[i].tipo + " Valor: " + respuesta.tokens[i].valor + "\n";
        }
    }
    document.getElementById("consolaJS").value = textoConsola

    traducidoJS = respuesta.traducido;
    console.log(traducidoJS);
}

function abrirReportes(tipoReporte){
    switch(tipoReporte){
        case 1:
            window.open('http://localhost:8000/lexicoPython', '_blank');
            break;
        case 2:
            window.open('http://localhost:8000/sintacticoPython', '_blank');
            break;
        case 3:
            window.open('http://localhost:8000/tokensPython', '_blank');
            break;
        case 4:
            window.open('http://localhost:8000/lexicoJS', '_blank');
            break;
        case 5:
            window.open('http://localhost:8000/sintacticoJS', '_blank');
            break;
        case 6:
            window.open('http://localhost:8000/tokensJS', '_blank');
            break;
        case 7:
            window.open('http://localhost:8000/arbol', '_blank');
            break;
    }
}

function respuestaPython(respuesta){
    var textoConsola = "<----------Consola de salida Python---------->\n"
    textoConsola += "Errores Lexicos:\n"
    if(respuesta.erroresLexicos.length == 0){
        textoConsola += "\tSin errores lexicos c:\n"
    }else{
        for(let i = 0; i < respuesta.erroresLexicos.length; i++){
            textoConsola += "\t" + (i+1) + ". Fila: " + respuesta.erroresLexicos[i].fila + " Columna: " +  respuesta.erroresLexicos[i].columna + " Valor: " + respuesta.erroresLexicos[i].valor + "\n";
        }
    }
    textoConsola += "Errores Sintacticos:\n"
    if(respuesta.erroresSintacticos.length == 0){
        textoConsola += "\tSin errores sintacticos c:\n"
    }else{
        for(let i = 0; i < respuesta.erroresSintacticos.length; i++){
            textoConsola += "\t" + (i+1) + ". Fila: " + respuesta.erroresSintacticos[i].fila + " Columna: " +  respuesta.erroresSintacticos[i].columna + " Encontrado: " + respuesta.erroresSintacticos[i].encontrado + " Esperado: " + respuesta.erroresSintacticos[i].esperado + "\n";
        }
    }
    textoConsola += "Tokens:\n"
    if(respuesta.tokens.length == 0){
        textoConsola += "\tSin nada para traducir :c\n"
    }else{
        for(let i = 0; i < respuesta.tokens.length; i++){
            textoConsola += "\t" + (i+1) + ". Fila: " + respuesta.tokens[i].fila + " Columna: " +  respuesta.tokens[i].columna + " Tipo: " + respuesta.tokens[i].tipo + " Valor: " + respuesta.tokens[i].valor + "\n";
        }
    }
    document.getElementById("consolaPython").value = textoConsola

    traducidoPython = respuesta.traduccion;
    console.log(traducidoPython);
}

function descargarTraduccionJS(){
    console.log(traducidoJS)
    var texto = [];
    texto.push(traducidoJS)
    var textoDescarga = new Blob(texto, {type: 'text/plain'});
    var lector = new FileReader();
    lector.onload = function(event){
        var descarga = document.createElement("a");
        descarga.href = event.target.result;
        descarga.target = "_blank";
        descarga.download = "traducidoJS.js"
        var eventoClick = new MouseEvent("click", {
            "view": window, 
            "bubbles": true,
            "cancelable": true
        });
        descarga.dispatchEvent(eventoClick);
        (window.URL || window.webkitURL).revokeObjectURL(descarga.href);
    };
    lector.readAsDataURL(textoDescarga)
}

function descargarTraduccionPython(){
    console.log(traducidoPython)
    var texto = [];
    texto.push(traducidoPython)
    var textoDescarga = new Blob(texto, {type: 'text/plain'});
    var lector = new FileReader();
    lector.onload = function(event){
        var descarga = document.createElement("a");
        descarga.href = event.target.result;
        descarga.target = "_blank";
        descarga.download = "traducidoPython.py"
        var eventoClick = new MouseEvent("click", {
            "view": window, 
            "bubbles": true,
            "cancelable": true
        });
        descarga.dispatchEvent(eventoClick);
        (window.URL || window.webkitURL).revokeObjectURL(descarga.href);
    };
    lector.readAsDataURL(textoDescarga)
}

function descargarAmbasTraducciones(){
    descargarTraduccionJS();
    descargarTraduccionPython();
}