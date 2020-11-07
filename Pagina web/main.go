package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"html/template"
	"io/ioutil"
	"net/http"
	"os"
	"os/exec"
	"strconv"
)

//structs para almacenar el json de salida hacia los analizadores
type entrada struct {
	Contenido string
}

//structs para almacenar los json de respuesta de los analizadores
type retornoPython struct {
	ErroresLexicos     []errorLexico
	ErroresSintacticos []errorSintactico
	Traduccion         string
	Arbol              string
	Tokens             []token
}

type retornoJS struct {
	ErroresLexicos     []errorLexico
	ErroresSintacticos []errorSintactico
	Traducido          string
	Tokens             []token
}

type token struct {
	Tipo    string
	Valor   string
	Fila    int
	Columna int
}

type errorLexico struct {
	Valor   string
	Fila    int
	Columna int
}

type errorSintactico struct {
	Encontrado string
	Esperado   string
	Fila       int
	Columna    int
}

//variables que almacenan el retorno tipo json de los analizadores
var returnPython retornoPython
var returnJS retornoJS

//funciones de respues a las peticiones http
func traducirJS(escritor http.ResponseWriter, lector *http.Request) {
	decodificador := json.NewDecoder(lector.Body)

	var input entrada

	err := decodificador.Decode(&input)

	if err != nil {
		panic(err)
	}

	jsonSalida, _ := json.Marshal(&input)

	req, err := http.NewRequest("POST", "http://localhost:3010/traducirJS", bytes.NewBuffer(jsonSalida))

	req.Header.Set("Content-Type", "application/json")

	cliente := &http.Client{}

	resp, err := cliente.Do(req)

	if err != nil {
		panic(err)
	}

	bytesCuerpo, _ := ioutil.ReadAll(resp.Body)

	returnJS = retornoJS{}

	json.Unmarshal(bytesCuerpo, &returnJS)

	erroresLexicosJS(returnJS.ErroresLexicos)
	erroresSintacticoJS(returnJS.ErroresSintacticos)
	tokensJS(returnJS.Tokens)

	fmt.Fprintf(escritor, string(bytesCuerpo))

	resp.Body.Close()
}

func traducirPython(escritor http.ResponseWriter, lector *http.Request) {
	decodificador := json.NewDecoder(lector.Body)

	var input entrada

	err := decodificador.Decode(&input)

	if err != nil {
		panic(err)
	}

	jsonSalida, _ := json.Marshal(&input)

	req, err := http.NewRequest("POST", "http://localhost:3000/traducirPython", bytes.NewBuffer(jsonSalida))

	req.Header.Set("Content-Type", "application/json")

	cliente := &http.Client{}

	resp, err := cliente.Do(req)

	if err != nil {
		panic(err)
	}

	defer resp.Body.Close()

	bytesCuerpo, _ := ioutil.ReadAll(resp.Body)

	returnPython = retornoPython{}

	json.Unmarshal(bytesCuerpo, &returnPython)

	mostrarArbol(returnPython.Arbol)
	erroresLexicosPython(returnPython.ErroresLexicos)
	erroresSintacticosPython(returnPython.ErroresSintacticos)
	tokensPython(returnPython.Tokens)

	fmt.Fprintf(escritor, string(bytesCuerpo))
}

func mostrarArbol(dot string) {
	archivoSalida, _ := os.Create("./Reportes/Arbol.dot")
	archivoSalida.WriteString(dot)
	archivoSalida.Close()
	exec.Command("dot", "./Reportes/Arbol.dot", "-Tpng", "-o", "./Reportes/Arbol.png").Run()
	htmlSalida, _ := os.Create("Arbol.html")
	salida := "<html>\n<title>Arbol de analisis sintactico</title>\n<img src = \"Reportes/Arbol.png\">\n</html>"
	htmlSalida.WriteString(salida)
	htmlSalida.Close()
}

func erroresLexicosPython(errores []errorLexico) {
	contenidoErrores := `<html>
	<title>Errores lexicos Python</title>
    <table class="egt" border>
    <tr>
        <th> No. </th>
        <th> Fila </th>
        <th> Columna </th>
        <th> Valor </th>
	</tr>
	`

	iterador := 1

	for i := 0; i < len(errores); i++ {
		contenidoErrores += "<tr>\n"
		contenidoErrores += "<td> " + strconv.Itoa(iterador) + " </td>\n"
		contenidoErrores += "<td> " + strconv.Itoa(errores[i].Fila) + " </td>\n"
		contenidoErrores += "<td> " + strconv.Itoa(errores[i].Columna) + " </td>\n"
		contenidoErrores += "<td> El caracter " + errores[i].Valor + " no pertenece al lenguaje </td>\n"
		contenidoErrores += "</tr>\n"
		iterador++
	}

	contenidoErrores += "</table>\n</html>"

	archivoSalida, _ := os.Create("LexicosPython.html")
	archivoSalida.WriteString(contenidoErrores)
	archivoSalida.Close()
}

func erroresLexicosJS(errores []errorLexico) {
	contenidoErrores := `<html>
	<title>Errores lexicos JavaScript</title>
    <table class="egt" border>
    <tr>
        <th> No. </th>
        <th> Fila </th>
        <th> Columna </th>
        <th> Valor </th>
	</tr>
	`

	iterador := 1

	for i := 0; i < len(errores); i++ {
		contenidoErrores += "<tr>\n"
		contenidoErrores += "<td> " + strconv.Itoa(iterador) + " </td>\n"
		contenidoErrores += "<td> " + strconv.Itoa(errores[i].Fila) + " </td>\n"
		contenidoErrores += "<td> " + strconv.Itoa(errores[i].Columna) + " </td>\n"
		contenidoErrores += "<td> El caracter " + errores[i].Valor + " no pertenece al lenguaje </td>\n"
		contenidoErrores += "</tr>\n"
		iterador++
	}

	contenidoErrores += "</table>\n</html>"

	archivoSalida, _ := os.Create("LexicosJS.html")
	archivoSalida.WriteString(contenidoErrores)
	archivoSalida.Close()
}

func erroresSintacticosPython(errores []errorSintactico) {
	contenidoErrores := `<html>
	<title>Errores sintacticos Python</title>
    <table class="egt" border>
    <tr>
        <th> No. </th>
        <th> Fila </th>
        <th> Columna </th>
		<th> Encontrado </th>
		<th> Esperado </th>
	</tr>`

	iterador := 1

	for i := 0; i < len(errores); i++ {
		contenidoErrores += "<tr>\n"
		contenidoErrores += "<td> " + strconv.Itoa(iterador) + " </td>\n"
		contenidoErrores += "<td> " + strconv.Itoa(errores[i].Fila) + " </td>\n"
		contenidoErrores += "<td> " + strconv.Itoa(errores[i].Columna) + " </td>\n"
		contenidoErrores += "<td> " + errores[i].Encontrado + " </td>\n"
		contenidoErrores += "<td> " + errores[i].Esperado + " </td>\n"
		contenidoErrores += "</tr>\n"
		iterador++
	}

	contenidoErrores += "</table>\n</html>"

	archivoSalida, _ := os.Create("SintacticosPython.html")
	archivoSalida.WriteString(contenidoErrores)
	archivoSalida.Close()
}

func erroresSintacticoJS(errores []errorSintactico) {
	contenidoErrores := `<html>
	<title>Errores sintacticos JavaScript</title>
    <table class="egt" border>
    <tr>
        <th> No. </th>
        <th> Fila </th>
        <th> Columna </th>
		<th> Encontrado </th>
		<th> Esperado </th>
	</tr>
	`

	iterador := 1

	for i := 0; i < len(errores); i++ {
		contenidoErrores += "<tr>\n"
		contenidoErrores += "<td> " + strconv.Itoa(iterador) + " </td>\n"
		contenidoErrores += "<td> " + strconv.Itoa(errores[i].Fila) + " </td>\n"
		contenidoErrores += "<td> " + strconv.Itoa(errores[i].Columna) + " </td>\n"
		contenidoErrores += "<td> " + errores[i].Encontrado + " </td>\n"
		contenidoErrores += "<td> " + errores[i].Esperado + " </td>\n"
		contenidoErrores += "</tr>\n"
		iterador++
	}

	contenidoErrores += "</table>\n</html>"

	archivoSalida, _ := os.Create("SintacticosJS.html")
	archivoSalida.WriteString(contenidoErrores)
	archivoSalida.Close()
}

func tokensPython(tokens []token) {
	contenidoErrores := `<html>
	<title>Tokens Python</title>
    <table class="egt" border>
    <tr>
        <th> No. </th>
        <th> Fila </th>
        <th> Columna </th>
		<th> Tipo </th>
		<th> Valor </th>
	</tr>
	`

	iterador := 1

	for i := 0; i < len(tokens); i++ {
		contenidoErrores += "<tr>\n"
		contenidoErrores += "<td> " + strconv.Itoa(iterador) + " </td>\n"
		contenidoErrores += "<td> " + strconv.Itoa(tokens[i].Fila) + " </td>\n"
		contenidoErrores += "<td> " + strconv.Itoa(tokens[i].Columna) + " </td>\n"
		contenidoErrores += "<td> " + tokens[i].Tipo + " </td>\n"
		contenidoErrores += "<td> " + tokens[i].Valor + " </td>\n"
		contenidoErrores += "</tr>\n"
		iterador++
	}

	contenidoErrores += "</table>\n</html>"

	archivoSalida, _ := os.Create("TokensPython.html")
	archivoSalida.WriteString(contenidoErrores)
	archivoSalida.Close()
}

func tokensJS(tokens []token) {
	contenidoErrores := `<html>
	<title>Tokens JavaScript</title>
    <table class="egt" border>
    <tr>
        <th> No. </th>
        <th> Fila </th>
        <th> Columna </th>
		<th> Tipo </th>
		<th> Valor </th>
	</tr>
	`

	iterador := 1

	for i := 0; i < len(tokens); i++ {
		contenidoErrores += "<tr>\n"
		contenidoErrores += "<td> " + strconv.Itoa(iterador) + " </td>\n"
		contenidoErrores += "<td> " + strconv.Itoa(tokens[i].Fila) + " </td>\n"
		contenidoErrores += "<td> " + strconv.Itoa(tokens[i].Columna) + " </td>\n"
		contenidoErrores += "<td> " + tokens[i].Tipo + " </td>\n"
		contenidoErrores += "<td> " + tokens[i].Valor + " </td>\n"
		contenidoErrores += "</tr>\n"
		iterador++
	}

	contenidoErrores += "</table>\n</html>"

	archivoSalida, _ := os.Create("TokensJS.html")
	archivoSalida.WriteString(contenidoErrores)
	archivoSalida.Close()
}

//funciones de renderizado de los html
func inicio(escritor http.ResponseWriter, lector *http.Request) {
	t := template.Must(template.ParseFiles("index.html"))
	t.Execute(escritor, "")
}

func arbolSintactico(escritor http.ResponseWriter, lector *http.Request) {
	t := template.Must(template.ParseFiles("Arbol.html"))
	t.Execute(escritor, "")
}

func lexicosPython(escritor http.ResponseWriter, lector *http.Request) {
	t := template.Must(template.ParseFiles("LexicosPython.html"))
	t.Execute(escritor, "")
}

func lexicosJS(escritor http.ResponseWriter, lector *http.Request) {
	t := template.Must(template.ParseFiles("LexicosJS.html"))
	t.Execute(escritor, "")
}

func sintacticosPython(escritor http.ResponseWriter, lector *http.Request) {
	t := template.Must(template.ParseFiles("SintacticosPython.html"))
	t.Execute(escritor, "")
}

func sintacticosJS(escritor http.ResponseWriter, lector *http.Request) {
	t := template.Must(template.ParseFiles("SintacticosJS.html"))
	t.Execute(escritor, "")
}

func tokensPythonHTML(escritor http.ResponseWriter, lector *http.Request) {
	t := template.Must(template.ParseFiles("TokensPython.html"))
	t.Execute(escritor, "")
}

func tokensJSHTML(escritor http.ResponseWriter, lector *http.Request) {
	t := template.Must(template.ParseFiles("TokensJS.html"))
	t.Execute(escritor, "")
}

func main() {

	//archivos estaticos
	http.Handle("/layout/", http.StripPrefix("/layout/", http.FileServer(http.Dir("layout/"))))
	http.Handle("/Reportes/", http.StripPrefix("/Reportes/", http.FileServer(http.Dir("Reportes/"))))

	//pagina principal
	http.HandleFunc("/", inicio)

	//traducciones
	http.HandleFunc("/traducirJS", traducirJS)
	http.HandleFunc("/traducirPython", traducirPython)

	//reporte arbol de analisis sintactico
	http.HandleFunc("/arbol", arbolSintactico)

	//reportes de analizador de python
	http.HandleFunc("/lexicoPython", lexicosPython)
	http.HandleFunc("/sintacticoPython", sintacticosPython)
	http.HandleFunc("/tokensPython", tokensPythonHTML)

	//reportes de analizador de JS
	http.HandleFunc("/lexicoJS", lexicosJS)
	http.HandleFunc("/sintacticoJS", sintacticosJS)
	http.HandleFunc("/tokensJS", tokensJSHTML)

	fmt.Println("simon aqui andamios en el 8000")

	http.ListenAndServe(":8000", nil)
}
