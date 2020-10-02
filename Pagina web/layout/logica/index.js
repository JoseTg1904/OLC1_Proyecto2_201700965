function abrirArchivo(files){
    var file = files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById("entrada").value = e.target.result;
    };
    reader.readAsText(file);
    file.clear;
    document.getElementById('filedialog').value="";
}
