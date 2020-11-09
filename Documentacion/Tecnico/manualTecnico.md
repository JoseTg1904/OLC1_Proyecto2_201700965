# **Análisis léxico**

## *Autómata finito determinista*

![AFD Java](AFD_Proyecto2.png)

## *Expresiones regulares en jison*
---
### Expresiones para numeros

* [0-9]+\b **Enteros**
* [0-9]+("."[0-9]+)\b **Decimales**

### Expresiones para palabras reservadas

* "public"
* "true"
* "false"
* "class"
* "interface"
* "void"
* "for"
* "while"
* "do"
* "if"
* "else"
* "break"
* "continue"
* "return"
* "int"
* "boolean"
* "double"
* "string"
* "char"
* "static"
* "main"
* "args"
* "system"
* "out"
* "print"
* "println"

### Expresiones para simbolos

* "{"
* "}"
* "("
* ")"
* ","
* ";"
* "^"
* "*"
* "."
* "["
* "]"
* ">"
* ">="
* "<"
* "<="
* "="
* "=="
* "!"
* "!="
* "&&"
* "||"
* "++"
* "+"
* "--"
* "-"
* "/"

### Expresiones para las cadenas o caracteres
* \"[^\"]*\" **Cadena**
* \“[^\“]*\“ **Cadena**
* \'[^\']*\' **Caracter**
* \‘[^\‘]*\‘ **Caracter**

### Expresiones para comentarios unilinea o multilinea                
* "//".* **Unilinea**
* [/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]) **Multilinea**

### Expresion para identificadores

* [a-zA-Z][a-zA-Z0-9_]*

# **Análisis sintáctico**

## *Gramática*

### Con recursividad por la izquierda
```
V = { <Inicio>, <PublicoInterClas>, <InterClas>, <Definicion>, <Instrucciones>, 
<TipoFuncion>, <Parametros>, <Tipo>, <ListadoParametros>, <Implementacion>, 
<Declaracion>, <IdentificadorDeclaracion>, <ListadoDeclaracion>, <expresion>, <divTipoFuncion>, 
<interno>, <LlamadoAsignacion>, <divPrint>, <DeclaracionFor>, <internoCiclo>, 
<ifElse>, <tipoReturn>, <comprobacionElif>, <ParametrosLlamado>, <ListadoDeclaracionParametrosLlamado>, <divLlamadoAsignacion>, <DeclaracionFor>, <IdentificadorDeclaracionFor> }

T = { tk_public, tk_interface, tk_identificador, tk_class, "{", "}", "(", ")", 
";", tk_void, tk_int, tk_boolean, tk_double, tk_string, tk_char, ",", 
"=", "+", "-", "*", "/", "<", ">", "<=", 
">=", "==", "!=", "!", "&&", "||", "^", "++", 
"--",  tk_char, tk_entero, tk_decimal, tk_true, tk_false, tk_static, tk_void, 
tk_main, tk_stringFun, "[", "]", tk_args, tk_system, tk_out, ".", 
tk_for, tk_do, tk_while, tk_if, tk_return, tk_else, tk_print, tk_println, 
tk_break, tk_continue }

S = <Inicio>

P = {

    <Inicio> ::= <PublicoInterClas>

    <PublicoInterClas> ::= tk_public <InterClas> | epsilon

    <InterClas> ::= tk_interface tk_identificador { <Definicion> } <PublicoInterClas> 
                | tk_class tk_identificador { <Instrucciones> } <PublicoInterClas>

    <Definicion> ::= tk_public <TipoFuncion> tk_identificador ( <Parametros> ) ; <Definicion> | epsilon

    <TipoFuncion> ::= <Tipo> | tk_void

    <Tipo> ::= tk_int | tk_boolean | tk_double | tk_string | tk_char

    <Parametros> ::= <Tipo> tk_identificador <ListadoParametros> | epsilon
               
    <ListadoParametros> ::= , <Parametros> | epsilon

    <Instrucciones> ::= <Declaracion> <Instrucciones> | <Implementacion> <Instrucciones> | epsilon

    <Declaracion> ::= <Tipo> <IdentificadorDeclaracion> ;

    <IdentificadorDeclaracion> ::= tk_identificador <ListadoDeclaracion>

    <ListadoDeclaracion> ::= epsilon 
                        | = <expresion> <ListadoDeclaracion> 
                        | , <IdentificadorDeclaracion>

    <expresion> ::= <expresion> + <expresion>  
                    | <expresion> - <expresion> 
                    | <expresion> * <expresion>
                    | <expresion> / <expresion> 
                    | - <expresion> 
                    | <expresion> > <expresion> 
                    | <expresion> < <expresion>
                    | <expresion> >= <expresion> 
                    | <expresion> <= <expresion> 
                    | <expresion> == <expresion>
                    | <expresion> != <expresion> 
                    | ! <expresion> 
                    | <expresion> && <expresion> 
                    | <expresion> || <expresion> 
                    | <expresion> ^ <expresion> 
                    | <expresion> ++
                    | <expresion> --
                    | tk_string 
                    | tk_char 
                    | tk_entero 
                    | tk_decimal 
                    | tk_identificador 
                    | tk_true 
                    | tk_false 
                    | ( <expresion> )

    <Implementacion> ::= tk_public <divTipoFuncion>

    <divTipoFuncion> ::= <TipoFuncion> tk_identificador ( <Parametros> ) { <interno> }
                    | tk_static tk_void tk_main ( tk_stringFun [ ] tk_args ) { <interno> }

    <interno> ::= <Declaracion> <interno>
                | <LlamadoAsignacion> <interno>
                | tk_system . tk_out . <divPrint> <interno>
                | tk_for ( <DeclaracionFor> ; <expresion> ; <expresion> ) { <internoCiclo> } <interno>
                | tk_while ( <expresion> ) { <internoCiclo> } <interno>
                | tk_do { <internoCiclo> } tk_while ( <expresion> ) ; <interno>
                | tk_if ( <expresion> ) { <interno> } <ifElse> <interno>
                | tk_return <tipoReturn> ; <interno>
                | epsilon 

    <tipoReturn> ::= epsilon | <expresion>

    <ifElse> ::= tk_else <comprobacionElif> | epsilon

    <comprobacionElif> ::= { <interno> }
                        | tk_if ( <expresion> ) { <interno> } <ifElse>

    <divPrint> ::= tk_print ( <expresion> ) ; | tk_println ( <expresion> ) ;

    <internoCiclo> ::= <interno> | tk_break ; <internoCiclo> | tk_continue ; <internoCiclo>

    <ParametrosLlamado> ::= tk_identificador <ListadoDeclaracionParametrosLlamado> 
                        | tk_entero <ListadoDeclaracionParametrosLlamado> 
                        | tk_decimal <ListadoDeclaracionParametrosLlamado> 
                        | tk_true <ListadoDeclaracionParametrosLlamado> 
                        | tk_false <ListadoDeclaracionParametrosLlamado>
                        | tk_string <ListadoDeclaracionParametrosLlamado> 
                        | tk_char <ListadoDeclaracionParametrosLlamado> 

    <ListadoDeclaracionParametrosLlamado> ::= epsilon | , <ParametrosLlamado>

    <LlamadoAsignacion> ::= tk_identificador <divLlamadoAsignacion>

    <divLlamadoAsignacion> ::= ( <ParametrosLlamado> ) ; | = <expresion> ;

    <DeclaracionFor> ::=  <Tipo> <IdentificadorDeclaracionFor>

    <IdentificadorDeclaracionFor> ::= tk_identificador = <expresion> 

}
```

### Sin recursividad por la izquierda

```
V = { <Inicio>, <PublicoInterClas>, <InterClas>, <Definicion>, <Instrucciones>, 
<TipoFuncion>, <Parametros>, <Tipo>, <ListadoParametros>, <Implementacion>, 
<Declaracion>, <IdentificadorDeclaracion>, <ListadoDeclaracion>, <expresion>, <divTipoFuncion>, 
<interno>, <LlamadoAsignacion>, <divPrint>, <DeclaracionFor>, <internoCiclo>, 
<ifElse>, <tipoReturn>, <comprobacionElif>, <ParametrosLlamado>, <ListadoDeclaracionParametrosLlamado>, <divLlamadoAsignacion>, <DeclaracionFor>, <IdentificadorDeclaracionFor>, <expresionPrima> }

T = { tk_public, tk_interface, tk_identificador, tk_class, "{", "}", "(", ")", 
";", tk_void, tk_int, tk_boolean, tk_double, tk_string, tk_char, ",", 
"=", "+", "-", "*", "/", "<", ">", "<=", 
">=", "==", "!=", "!", "&&", "||", "^", "++", 
"--",  tk_char, tk_entero, tk_decimal, tk_true, tk_false, tk_static, tk_void, 
tk_main, tk_stringFun, "[", "]", tk_args, tk_system, tk_out, ".", 
tk_for, tk_do, tk_while, tk_if, tk_return, tk_else, tk_print, tk_println, 
tk_break, tk_continue }

S = <Inicio>

P = {

    <Inicio> ::= <PublicoInterClas>

    <PublicoInterClas> ::= tk_public <InterClas> | epsilon

    <InterClas> ::= tk_interface tk_identificador { <Definicion> } <PublicoInterClas> 
                | tk_class tk_identificador { <Instrucciones> } <PublicoInterClas>

    <Definicion> ::= tk_public <TipoFuncion> tk_identificador ( <Parametros> ) ; <Definicion> | epsilon

    <TipoFuncion> ::= <Tipo> | tk_void

    <Tipo> ::= tk_int | tk_boolean | tk_double | tk_string | tk_char

    <Parametros> ::= <Tipo> tk_identificador <ListadoParametros> | epsilon
               
    <ListadoParametros> ::= , <Parametros> | epsilon

    <Instrucciones> ::= <Declaracion> <Instrucciones> | <Implementacion> <Instrucciones> | epsilon

    <Declaracion> ::= <Tipo> <IdentificadorDeclaracion> ;

    <IdentificadorDeclaracion> ::= tk_identificador <ListadoDeclaracion>

    <ListadoDeclaracion> ::= epsilon 
                        | = <expresion> <ListadoDeclaracion> 
                        | , <IdentificadorDeclaracion>

    <expresion> ::= - <expresion> <expresionPrima>
                | ! <expresion> <expresionPrima>
                | tk_string <expresionPrima>
                | tk_char <expresionPrima>
                | tk_entero <expresionPrima>
                | tk_decimal <expresionPrima>
                | tk_identificador <expresionPrima>
                | tk_true <expresionPrima>
                | tk_false <expresionPrima>
                | ( <expresion> ) <expresionPrima>

    <expresionPrima> ::= && <expresion> <expresionPrima>
                    | || <expresion> <expresionPrima>
                    | ^ <expresion> <expresionPrima>
                    | ++ <expresionPrima>
                    | -- <expresionPrima>
                    | > <expresion> <expresionPrima>
                    | < <expresion> <expresionPrima>
                    | >= <expresion> <expresionPrima>
                    | <= <expresion> <expresionPrima>
                    | == <expresion> <expresionPrima>
                    | != <expresion> <expresionPrima>
                    | + <expresion> <expresionPrima>
                    | - <expresion> <expresionPrima>
                    | * <expresion> <expresionPrima>
                    | / <expresion> <expresionPrima> 
                    | epsilon

    <Implementacion> ::= tk_public <divTipoFuncion>

    <divTipoFuncion> ::= <TipoFuncion> tk_identificador ( <Parametros> ) { <interno> }
                    | tk_static tk_void tk_main ( tk_stringFun [ ] tk_args ) { <interno> }

    <interno> ::= <Declaracion> <interno>
                | <LlamadoAsignacion> <interno>
                | tk_system . tk_out . <divPrint> <interno>
                | tk_for ( <DeclaracionFor> ; <expresion> ; <expresion> ) { <internoCiclo> } <interno>
                | tk_while ( <expresion> ) { <internoCiclo> } <interno>
                | tk_do { <internoCiclo> } tk_while ( <expresion> ) ; <interno>
                | tk_if ( <expresion> ) { <interno> } <ifElse> <interno>
                | tk_return <tipoReturn> ; <interno>
                | epsilon 

    <tipoReturn> ::= epsilon | <expresion>

    <ifElse> ::= tk_else <comprobacionElif> | epsilon

    <comprobacionElif> ::= { <interno> }
                        | tk_if ( <expresion> ) { <interno> } <ifElse>

    <divPrint> ::= tk_print ( <expresion> ) ; | tk_println ( <expresion> ) ;

    <internoCiclo> ::= <interno> | tk_break ; <internoCiclo> | tk_continue ; <internoCiclo>

    <ParametrosLlamado> ::= tk_identificador <ListadoDeclaracionParametrosLlamado> 
                        | tk_entero <ListadoDeclaracionParametrosLlamado> 
                        | tk_decimal <ListadoDeclaracionParametrosLlamado> 
                        | tk_true <ListadoDeclaracionParametrosLlamado> 
                        | tk_false <ListadoDeclaracionParametrosLlamado>
                        | tk_string <ListadoDeclaracionParametrosLlamado> 
                        | tk_char <ListadoDeclaracionParametrosLlamado> 

    <ListadoDeclaracionParametrosLlamado> ::= epsilon | , <ParametrosLlamado>

    <LlamadoAsignacion> ::= tk_identificador <divLlamadoAsignacion>

    <divLlamadoAsignacion> ::= ( <ParametrosLlamado> ) ; | = <expresion> ;

    <DeclaracionFor> ::=  <Tipo> <IdentificadorDeclaracionFor>

    <IdentificadorDeclaracionFor> ::= tk_identificador = <expresion> 

}
```