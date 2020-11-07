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
    .then(response => console.log('Success:', response));


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
    .then(response => console.log('Success:', response))
}