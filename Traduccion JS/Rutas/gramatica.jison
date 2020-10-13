/*Importaciones*/
%{
var listado = [];
%}

/*Parte lexica*/
%lex
%options case-insensitive
%%

/*Expresiones regulares para la aceptacion de numeros enteros y decimales*/
[0-9]+\b            {listado.push({elemento: "token", tipo: "tk_numero", 
                        valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
                        return "tk_numero";}
[0-9]+("."[0-9]+)\b {listado.push({elemento: "token", tipo: "tk_numero", 
                        valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
                        return "tk_decimal";}

/*conjunto de palabras reservadas*/
"public"        {listado.push({elemento: "token", tipo: "tk_public", 
                valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_public";}
"true"          {listado.push({elemento: "token", tipo: "tk_true", 
                valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_true";}
"false"         {listado.push({elemento: "token", tipo: "tk_false", 
                valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_false";}
"class"         {listado.push({elemento: "token", tipo: "tk_class", 
                valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_class";}
"interface"     {listado.push({elemento: "token", tipo: "tk_interface", 
                valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_interface";}
"void"          {listado.push({elemento: "token", tipo: "tk_void", 
                valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_void";}
"for"           {listado.push({elemento: "token", tipo: "tk_for", 
                valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_for";}
"while"         {listado.push({elemento: "token", tipo: "tk_while", 
                valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_while";}
"do"            {listado.push({elemento: "token", tipo: "tk_do", 
                valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_do";}
"if"            {listado.push({elemento: "token", tipo: "tk_if", 
                valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_if";}
"else"          {listado.push({elemento: "token", tipo: "tk_else", 
                valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_else";}
"break"         {listado.push({elemento: "token", tipo: "tk_break", 
                valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_break";}
"continue"      {listado.push({elemento: "token", tipo: "tk_continue", 
                valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_continue";}
"return"        {listado.push({elemento: "token", tipo: "tk_return", 
                valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_return";}
"int"           {listado.push({elemento: "token", tipo: "tk_int", 
                valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_int";}
"boolean"       {listado.push({elemento: "token", tipo: "tk_boolean", 
                valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_boolean";}
"double"        {listado.push({elemento: "token", tipo: "tk_double", 
                valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_double";}
"string"        {listado.push({elemento: "token", tipo: "tk_string", 
                valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_string";}
"char"          {listado.push({elemento: "token", tipo: "tk_char", 
                valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_char";}
"static"        {listado.push({elemento: "token", tipo: "tk_static", 
                valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_static";}
"main"          {listado.push({elemento: "token", tipo: "tk_main", 
                valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_main";}
"args"          {listado.push({elemento: "token", tipo: "tk_args", 
                valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_args";}
"system"        {listado.push({elemento: "token", tipo: "tk_system", 
                valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_system";}
"out"           {listado.push({elemento: "token", tipo: "tk_out", 
                valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_out";}
"print"         {listado.push({elemento: "token", tipo: "tk_print", 
                valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_print";}
"println"       {listado.push({elemento: "token", tipo: "tk_println", 
                valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_println";}

/*conjunto de simbolos aceptados*/
"{"     {listado.push({elemento: "token", tipo: "tk_llaveA", 
        valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_llaveA";}
"}"     {listado.push({elemento: "token", tipo: "tk_llaveC", 
        valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_llaveC";}
"("     {listado.push({elemento: "token", tipo: "tk_parA", 
        valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_parA";}
")"     {listado.push({elemento: "token", tipo: "tk_parC", 
        valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_parC";}
","     {listado.push({elemento: "token", tipo: "tk_coma", 
        valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_coma";}
";"     {listado.push({elemento: "token", tipo: "tk_puntoComa", 
        valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_puntoComa";}
"^"     {listado.push({elemento: "token", tipo: "tk_xor", 
        valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_xor";}
"*"     {listado.push({elemento: "token", tipo: "tk_por", 
        valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_por";}
"."     {listado.push({elemento: "token", tipo: "tk_punto", 
        valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_punto";}
"["     {listado.push({elemento: "token", tipo: "tk_corcheteA", 
        valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_corcheteA";}
"]"     {listado.push({elemento: "token", tipo: "tk_corcheteC", 
        valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_corcheteC";}
">"     {listado.push({elemento: "token", tipo: "tk_mayor", 
        valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_mayor";}
">="    {listado.push({elemento: "token", tipo: "tk_mayorIgual", 
        valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_mayorIgual";}
"<"     {listado.push({elemento: "token", tipo: "tk_menor", 
        valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_menor";}
"<="    {listado.push({elemento: "token", tipo: "tk_menorIgual", 
        valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_menorIgual";}
"="     {listado.push({elemento: "token", tipo: "tk_igual", 
        valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_igual";}
"=="    {listado.push({elemento: "token", tipo: "tk_igualacion", 
        valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_igualacion";}
"!"     {listado.push({elemento: "token", tipo: "tk_not", 
        valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_not";}
"!="    {listado.push({elemento: "token", tipo: "tk_distinto", 
        valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_distinto";}
"&&"    {listado.push({elemento: "token", tipo: "tk_and", 
        valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_and";}
"||"    {listado.push({elemento: "token", tipo: "tk_or", 
        valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_or";}
"+"     {listado.push({elemento: "token", tipo: "tk_mas", 
        valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_mas";}
"++"    {listado.push({elemento: "token", tipo: "tk_adicion", 
        valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_adicion";}
"-"     {listado.push({elemento: "token", tipo: "tk_menos", 
        valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_menos";}
"--"    {listado.push({elemento: "token", tipo: "tk_sustraccion", 
        valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_sustraccion";}
"/"     {listado.push({elemento: "token", tipo: "tk_division", 
        valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_division";}

/*expresiones para validar los strings y chars*/
\"[^\"]*\"  {listado.push({elemento: "token", tipo: "tk_stringTexto", 
                valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_stringTexto"}
\'[^\']*\'  {listado.push({elemento: "token", tipo: "tk_charTexto", 
                valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_charTexto"}

/*expresiones para comentarios individuales y multiples*/
"//".*                                  {yytext = yytext.substr(1, yylen-2);
                                        listado.push({elemento: "token", tipo: "tk_comentarioIndividual", 
                                        valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
                                        return "tk_comentarioIndividual";}
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]     {yytext = yytext.substr(1, yylen-2);
                                        listado.push({elemento: "token", tipo: "tk_comentarioMultiple", 
                                        valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
                                        return "tk_comentarioMultiple";}

/*expresion para un identificador*/
[a-zA-Z]([a-zA-Z0-9_])* {listado.push({elemento: "token", tipo: "tk_identificador", 
                        valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});
                        return "tk_identificador";}

/*final del archivo*/
<<EOF>> return "EOF";

/*
espacios en blanco, tabulados, saltos de linea, salto de carro, el otro no se que es equis de
pero todo esto se ignora
*/
[ \t\r\n\f] {}

/*estado sumidero donde van a caer todos los errores*/
. {listado.push({elemento: "lexico", valor: yytext, 
        fila: yylloc.first_line, columna: yylloc.first_column});}

/lex

/*Parte sintactica*/
%start Inicio
%%

Inicio 
        : PublicoInterClas EOF {return listado;};

PublicoInterClas 
                : tk_public InterClas 
                | ;

InterClas 
        : tk_interface tk_identificador tk_llaveA Definicion tk_llaveC PublicoInterClas 
        | tk_class tk_identificador tk_llaveA Instrucciones tk_llaveC PublicoInterClas;

Definicion 
        : tk_public TipoFuncion tk_identificador tk_parA Parametros tk_parC tk_puntoComa Definicion 
        | ;

TipoFuncion 
        : Tipo 
        | tk_void;

Tipo 
        : tk_int 
        | tk_boolean 
        | tk_double 
        | tk_string 
        | tk_char;

Parametros 
        : Tipo tk_identificador ListadoParametros
        | ;

ListadoParametros 
        : tk_coma Parametros 
        | ;

Instrucciones 
        : Declaracion Instrucciones
        | Implementacion Instrucciones
        | ;

Declaracion 
        : Tipo IdentificadorDeclaracion tk_puntoComa;

IdentificadorDeclaracion 
        : tk_identificador ListadoDeclaracion;

ListadoDeclaracion 
        : tk_igual expresion ListadoDeclaracion 
        | tk_coma IdentificadorDeclaracion
        | ;

expresion 
        : tk_menos expresion expresionPrima
        | tk_not expresion expresionPrima
        | tk_stringTexto expresionPrima
        | tk_charTexto expresionPrima
        | tk_numero expresionPrima
        | tk_decimal expresionPrima
        | tk_identificador expresionPrima
        | tk_true expresionPrima
        | tk_false expresionPrima
        | tk_parA expresion tk_parC expresionPrima;

expresionPrima 
        : tk_and expresion expresionPrima
        | tk_or expresion expresionPrima
        | tk_xor expresion expresionPrima
        | tk_adicion expresionPrima
        | tk_sustraccion expresionPrima
        | tk_mayor expresion expresionPrima
        | tk_menor expresion expresionPrima
        | tk_mayorIgual expresion expresionPrima
        | tk_menorIgual expresion expresionPrima
        | tk_igualacion expresion expresionPrima
        | tk_distinto expresion expresionPrima
        | tk_mas expresion expresionPrima
        | tk_menos expresion expresionPrima
        | tk_por expresion expresionPrima
        | tk_division expresion expresionPrima 
        | ;

Implementacion 
        : tk_public divTipoFuncion;

divTipoFuncion 
        : TipoFuncion tk_identificador tk_parA Parametros tk_parC tk_llaveA interno tk_llaveC
        | tk_static tk_void tk_main tk_parA tk_string tk_corcheteA tk_corcheteC tk_args tk_parC tk_llaveA interno tk_llaveC;

interno 
        : Declaracion interno
        | LlamadoAsignacion interno
        | tk_system tk_punto tk_out tk_punto divPrint interno
        | tk_for tk_parA DeclaracionFor tk_puntoComa expresion tk_puntoComa expresion tk_parC tk_llaveA internoCiclo tk_llaveC interno
        | tk_while tk_parA expresion tk_parC tk_llaveA internoCiclo tk_llaveC interno
        | tk_do tk_llaveA internoCiclo tk_llaveC tk_while tk_parA expresion tk_parC tk_puntoComa interno
        | tk_if tk_parA expresion tk_parC tk_llaveA interno tk_llaveC ifElse interno
        | tk_return tipoReturn tk_puntoComa interno
        | ;

tipoReturn 
        : expresion
        | ;

ifElse 
        : tk_else comprobacionElif
        | ;

comprobacionElif 
        : tk_llaveA interno tk_llaveC
        | tk_if tk_parA expresion tk_parC tk_llaveA interno tk_llaveC ifElse;

divPrint 
        : tk_print tk_parA expresion tk_parC tk_puntoComa 
        | tk_println tk_parA expresion tk_parC tk_puntoComa;

internoCiclo 
        : interno
        | tk_break tk_puntoComa internoCiclo
        | tk_continue tk_puntoComa internoCiclo;

ParametrosLlamado 
        : tk_identificador ListadoDeclaracionParametrosLlamado 
        | tk_numero ListadoDeclaracionParametrosLlamado
        | tk_decimal ListadoDeclaracionParametrosLlamado 
        | tk_true ListadoDeclaracionParametrosLlamado
        | tk_false ListadoDeclaracionParametrosLlamado
        | tk_stringTexto ListadoDeclaracionParametrosLlamado 
        | tk_charTexto ListadoDeclaracionParametrosLlamado;

ListadoDeclaracionParametrosLlamado 
        : tk_coma ParametrosLlamado
        | ;

LlamadoAsignacion 
        : tk_identificador divLlamadoAsignacion;

divLlamadoAsignacion 
        : tk_parA ParametrosLlamado tk_parC tk_puntoComa
        | tk_igual expresion tk_puntoComa;

DeclaracionFor 
        : Tipo IdentificadorDeclaracionFor;

IdentificadorDeclaracionFor> 
        : tk_identificador tk_igual expresion;