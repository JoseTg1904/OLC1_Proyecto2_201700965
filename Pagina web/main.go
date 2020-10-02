package main

import (
	"html/template"
	"net/http"
)

func inicio(escritor http.ResponseWriter, lector *http.Request) {
	t := template.Must(template.ParseFiles("index.html"))
	t.Execute(escritor, "")
}

func main() {

	http.Handle("/layout/", http.StripPrefix("/layout/", http.FileServer(http.Dir("layout/"))))

	http.HandleFunc("/", inicio)

	http.ListenAndServe(":8000", nil)
}
