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
    console.log("simon")
    fetch("http://localhost:3000/traducirPython", {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({
            contenido: document.getElementById("entrada").value
        }),
        headers:{
        'Content-Type': 'application/json'
        }
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => console.log('Success:', response));
}