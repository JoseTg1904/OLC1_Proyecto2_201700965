/*Importaciones*/
%{
var listado = [];
var listaTokens = [];
var listaErroresLexicos = [];
var listaErroresSintacticos = [];
var traduccion = "";
var tabulados = "";
%}

/*Parte lexica*/
%lex
%options case-insensitive
%%

/*Expresiones regulares para la aceptacion de numeros enteros y decimales*/
[0-9]+\b            {listaTokens.push({tipo: "tk_numero", valor: yytext, 
                        fila: yylloc.first_line, columna: yylloc.first_column});
                        return "tk_numero";}
[0-9]+("."[0-9]+)\b {listaTokens.push({tipo: "tk_numero", valor: yytext, 
                        fila: yylloc.first_line, columna: yylloc.first_column});
                        return "tk_decimal";}

/*conjunto de palabras reservadas*/
"public"        {listaTokens.push({tipo: "tk_public", valor: yytext, 
                fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_public";}
"true"          {listaTokens.push({tipo: "tk_true", valor: yytext, 
                fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_true";}
"false"         {listaTokens.push({tipo: "tk_false", valor: yytext, 
                fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_false";}
"class"         {listaTokens.push({tipo: "tk_class", valor: yytext, 
                fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_class";}
"interface"     {listaTokens.push({tipo: "tk_interface", valor: yytext, 
                fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_interface";}
"void"          {listaTokens.push({tipo: "tk_void", valor: yytext, 
                fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_void";}
"for"           {listaTokens.push({tipo: "tk_for", valor: yytext, 
                fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_for";}
"while"         {listaTokens.push({tipo: "tk_while", valor: yytext, 
                fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_while";}
"do"            {listaTokens.push({tipo: "tk_do", valor: yytext, 
                fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_do";}
"if"            {listaTokens.push({tipo: "tk_if", valor: yytext, 
                fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_if";}
"else"          {listaTokens.push({tipo: "tk_else", valor: yytext, 
                fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_else";}
"break"         {listaTokens.push({tipo: "tk_break", valor: yytext, 
                fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_break";}
"continue"      {listaTokens.push({tipo: "tk_continue", valor: yytext, 
                fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_continue";}
"return"        {listaTokens.push({tipo: "tk_return", valor: yytext, 
                fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_return";}
"int"           {listaTokens.push({tipo: "tk_int", valor: yytext, 
                fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_int";}
"boolean"       {listaTokens.push({tipo: "tk_boolean", valor: yytext, 
                fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_boolean";}
"double"        {listaTokens.push({tipo: "tk_double", valor: yytext, 
                fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_double";}
"string"        {listaTokens.push({tipo: "tk_string", valor: yytext, 
                fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_string";}
"char"          {listaTokens.push({tipo: "tk_char", valor: yytext, 
                fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_char";}
"static"        {listaTokens.push({tipo: "tk_static", valor: yytext, 
                fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_static";}
"main"          {listaTokens.push({tipo: "tk_main", valor: yytext, 
                fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_main";}
"args"          {listaTokens.push({tipo: "tk_args", valor: yytext, 
                fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_args";}
"system"        {listaTokens.push({tipo: "tk_system", valor: yytext, 
                fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_system";}
"out"           {listaTokens.push({tipo: "tk_out", valor: yytext, 
                fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_out";}
"print"         {listaTokens.push({tipo: "tk_print", valor: yytext, 
                fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_print";}
"println"       {listaTokens.push({tipo: "tk_println", valor: yytext, 
                fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_println";}

/*conjunto de simbolos aceptados*/
"{"     {listaTokens.push({tipo: "tk_llaveA", valor: yytext, 
        fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_llaveA";}
"}"     {listaTokens.push({tipo: "tk_llaveC", valor: yytext, 
        fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_llaveC";}
"("     {listaTokens.push({tipo: "tk_parA", valor: yytext, 
        fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_parA";}
")"     {listaTokens.push({tipo: "tk_parC", valor: yytext, 
        fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_parC";}
","     {listaTokens.push({tipo: "tk_coma", valor: yytext, 
        fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_coma";}
";"     {listaTokens.push({tipo: "tk_puntoComa", valor: yytext, 
        fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_puntoComa";}
"^"     {listaTokens.push({tipo: "tk_xor", valor: yytext, 
        fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_xor";}
"*"     {listaTokens.push({tipo: "tk_por", valor: yytext, 
        fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_por";}
"."     {listaTokens.push({tipo: "tk_punto", valor: yytext, 
        fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_punto";}
"["     {listaTokens.push({tipo: "tk_corcheteA", valor: yytext, 
        fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_corcheteA";}
"]"     {listaTokens.push({tipo: "tk_corcheteC", valor: yytext, 
        fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_corcheteC";}
">"     {listaTokens.push({tipo: "tk_mayor", valor: yytext, 
        fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_mayor";}
">="    {listaTokens.push({tipo: "tk_mayorIgual", valor: yytext, 
        fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_mayorIgual";}
"<"     {listaTokens.push({tipo: "tk_menor", valor: yytext, 
        fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_menor";}
"<="    {listaTokens.push({tipo: "tk_menorIgual", valor: yytext, 
        fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_menorIgual";}
"="     {listaTokens.push({tipo: "tk_igual", valor: yytext, 
        fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_igual";}
"=="    {listaTokens.push({tipo: "tk_igualacion", valor: yytext, 
        fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_igualacion";}
"!"     {listaTokens.push({tipo: "tk_not", valor: yytext, 
        fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_not";}
"!="    {listaTokens.push({tipo: "tk_distinto", valor: yytext, 
        fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_distinto";}
"&&"    {listaTokens.push({tipo: "tk_and", valor: yytext, 
        fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_and";}
"||"    {listaTokens.push({tipo: "tk_or", valor: yytext, 
        fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_or";}
"+"     {listaTokens.push({tipo: "tk_mas", valor: yytext, 
        fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_mas";}
"++"    {listaTokens.push({tipo: "tk_adicion", valor: yytext, 
        fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_adicion";}
"-"     {listaTokens.push({tipo: "tk_menos", valor: yytext, 
        fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_menos";}
"--"    {listaTokens.push({tipo: "tk_sustraccion", valor: yytext, 
        fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_sustraccion";}
"/"     {listaTokens.push({tipo: "tk_division", valor: yytext, 
        fila: yylloc.first_line, columna: yylloc.first_column});
        return "tk_division";}

/*expresiones para validar los strings y chars*/
\"[^\"]*\"  {listaTokens.push({tipo: "tk_stringTexto", valor: yytext, 
                fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_stringTexto";}
\'[^\']*\'  {listaTokens.push({tipo: "tk_charTexto", valor: yytext, 
                fila: yylloc.first_line, columna: yylloc.first_column});
                return "tk_charTexto";}

/*expresiones para comentarios individuales y multiples*/
"//".*                                  {yytext = yytext.substr(1, yylen-2);
                                        listaTokens.push({tipo: "tk_comentarioIndividual", 
                                        valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});}
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]     {yytext = yytext.substr(1, yylen-2);
                                        listaTokens.push({tipo: "tk_comentarioMultiple", 
                                        valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});}

/*expresion para un identificador*/
[a-zA-Z]([a-zA-Z0-9_])* {listaTokens.push({tipo: "tk_identificador", 
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
. {listaErroresLexicos.push({valor: yytext, fila: yylloc.first_line, columna: yylloc.first_column});};

/lex

/*Parte sintactica*/
%start Inicio
%%

Inicio 
        : PublicoInterClas EOF { var retorno = {tokens: listaTokens, erroresLexicos: listaErroresLexicos,
                                listado: listado, traducido: traduccion};
                                listaTokens = [];
                                listaErroresLexicos = [];
                                listado = [];
                                traduccion = "";
                                tabulados = "";
                                return retorno;};

PublicoInterClas 
                : tk_public InterClas 
                | ;

InterClas 
        : tk_interface tk_identificador tk_llaveA Definicion tk_llaveC PublicoInterClas 
        | tk_class tk_identificador tk_llaveA Instrucciones tk_llaveC PublicoInterClas {traduccion += $1;
                                                                                        traduccion += " " + $2;
                                                                                        traduccion += $3 + "\n";
                                                                                        tabulados += "\t";
                                                                                        traduccion += $4;
                                                                                        traduccion += "\n" + $5 + "\n";
                                                                                        tabulados = tabulados.substring(0, tabulados.length - 1);}
        | error tk_llaveC {listaErroresSintacticos.push({encontrado: yytext, 
        esperado: "error en la definicion de clase o interfaz",
        fila: this._$.first_line, columna: this._$.first_column})};

Definicion 
        : tk_public TipoFuncionDef tk_identificador tk_parA ParametrosDef tk_parC tk_puntoComa Definicion 
        | 
        | error tk_puntoComa {listaErroresSintacticos.push({encontrado: yytext, 
        esperado: "error en la definicion de metodos o funciones",
        fila: this._$.first_line, columna: this._$.first_column})};

TipoFuncionDef
        : TipoFuncionDefIn
        | tk_void;

TipoFuncionDefIn
        : tk_int 
        | tk_boolean 
        | tk_double 
        | tk_string 
        | tk_char;

TipoFuncion 
        : Tipo 
        | tk_void;

Tipo
        : tk_int
        | tk_boolean
        | tk_double
        | tk_string
        | tk_char;

ParametrosDef
        : TipoFuncionDefIn tk_identificador ListadoParametrosDef
        | ;

ListadoParametrosDef
        : tk_coma ParametrosDef 
        | ;

Parametros 
        : Tipo tk_identificador ListadoParametros
        | ;

ListadoParametros 
        : tk_coma Parametros 
        | ;

Instrucciones 
        : Declaracion Instrucciones {$$ = $1 + $2}
        | Implementacion Instrucciones {$$ = $1 + $2}
        | {$$ = ""};

Declaracion 
        : Tipo IdentificadorDeclaracion tk_puntoComa { $$ = tabulados + "var " + $2 + $3 + "\n";}
        | error tk_puntoComa {listaErroresSintacticos.push({encontrado: yytext, 
        esperado: "error en la declaracion de variables",
        fila: this._$.first_line, columna: this._$.first_column})};

IdentificadorDeclaracion 
        : tk_identificador ListadoDeclaracion { $$ = $1 + $2};

ListadoDeclaracion 
        : tk_igual expresion ListadoDeclaracion { $$ = " " + $1 + " " + $2 + $3;}
        | tk_coma IdentificadorDeclaracion {$$ = $1 + " " + $2}
        | {$$ = ""};

expresion 
        : tk_menos expresion expresionPrima {$$ = $1 + " " + $2 + $3;}
        | tk_not expresion expresionPrima {$$ = $1 + " " + $2 + $3;}
        | tk_stringTexto expresionPrima {$$ = $1 + " " + $2;}
        | tk_charTexto expresionPrima {$$ = $1 + " " + $2;}
        | tk_numero expresionPrima {$$ = $1 + " " + $2;}
        | tk_decimal expresionPrima {$$ = $1 + " " + $2;}
        | tk_identificador expresionPrima {$$ = $1 + " " + $2;}
        | tk_true expresionPrima {$$ = $1 + " " + $2;}
        | tk_false expresionPrima {$$ = $1 + " " + $2;}
        | tk_parA expresion tk_parC expresionPrima {$$ = $1 + $2 + $3 + $4;};

expresionPrima 
        : tk_and expresion expresionPrima {$$ = $1 + " " + $2 + $3;}
        | tk_or expresion expresionPrima {$$ = $1 + " " + $2 + $3;}
        | tk_xor expresion expresionPrima {$$ = $1 + " " + $2 + $3;}
        | tk_adicion expresionPrima {$$ = $1 + " " + $2;}
        | tk_sustraccion expresionPrima {$$ = $1 + " " + $2;}
        | tk_mayor expresion expresionPrima {$$ = $1 + " " + $2 + $3;}
        | tk_menor expresion expresionPrima {$$ = $1 + " " + $2 + $3;}
        | tk_mayorIgual expresion expresionPrima {$$ = $1 + " " + $2 + $3;}
        | tk_menorIgual expresion expresionPrima {$$ = $1 + " " + $2 + $3;}
        | tk_igualacion expresion expresionPrima {$$ = $1 + " " + $2 + $3;}
        | tk_distinto expresion expresionPrima {$$ = $1 + " " + $2 + $3;}
        | tk_mas expresion expresionPrima {$$ = $1 + " " + $2 + $3;}
        | tk_menos expresion expresionPrima {$$ = $1 + " " + $2 + $3;}
        | tk_por expresion expresionPrima {$$ = $1 + " " + $2 + $3;}
        | tk_division expresion expresionPrima {$$ = $1 + " " + $2 + $3;}
        | {$$ = "";};

Implementacion 
        : tk_public divTipoFuncion;

divTipoFuncion 
        : TipoFuncion tk_identificador tk_parA Parametros tk_parC tk_llaveA interno tk_llaveC {traduccion += 
                                                                                                "function " + $2 + 
                                                                                                " " + $3 + " " + 
                                                                                                $5 + " " + $6 + "\n";
                                                                                                traduccion += $8 + "\n";}
        | tk_static tk_void tk_main tk_parA tk_string tk_corcheteA tk_corcheteC tk_args tk_parC tk_llaveA interno tk_llaveC {traduccion += 
                                                                                                "function main()" + $10 + "\n";
                                                                                                traduccion += $12 + "\n";} 
        | error tk_llaveC {listado.push({elemento: "sintactico", 
        encontrado: yytext, esperado: "tk_funcion | tk_static",
        fila: yylloc.first_line, columna: yylloc.first_column })};

interno 
        : Declaracion interno
        | LlamadoAsignacion interno
        | tk_system tk_punto tk_out tk_punto divPrint interno
        | internoLlave
        | internoPunto
        | ;

internoLlave
        : tk_for tk_parA DeclaracionFor tk_puntoComa expresion tk_puntoComa expresion tk_parC tk_llaveA internoCiclo tk_llaveC interno
        | tk_while tk_parA expresion tk_parC tk_llaveA internoCiclo tk_llaveC interno {traduccion += $1 + " " + $2 + " " + $4 + " " + $5 + "\n"; 
                                                                                        traduccion += $7 + "\n";}
        | tk_if tk_parA expresion tk_parC tk_llaveA interno tk_llaveC ifElse interno {traduccion += $1 + " " + $2 + " " + $4 + " " + $5 + "\n"
                                                                                        traduccion += $7 + "\n";}
        | error tk_llaveC {listado.push({elemento: "sintactico", 
        encontrado: yytext, esperado: "tk_for | tk_while",
        fila: yylloc.first_line, columna: yylloc.first_column })};

internoPunto
        : tk_return tipoReturn tk_puntoComa interno {traduccion += $1 + " " + $3 + "\n";}
        | tk_do tk_llaveA internoCiclo tk_llaveC tk_while tk_parA expresion tk_parC tk_puntoComa interno
        | error tk_puntoComa {listado.push({elemento: "sintactico", 
        encontrado: yytext, esperado: "tk_return | tk_do",
        fila: yylloc.first_line, columna: yylloc.first_column })};

tipoReturn 
        : expresion
        | ;

ifElse 
        : tk_else comprobacionElif
        | ;

comprobacionElif 
        : tk_llaveA interno tk_llaveC
        | tk_if tk_parA expresion tk_parC tk_llaveA interno tk_llaveC ifElse
        | error tk_llaveC {listado.push({elemento: "sintactico", 
        encontrado: yytext, esperado: "tk_if",
        fila: yylloc.first_line, columna: yylloc.first_column })};

divPrint 
        : tk_print tk_parA expresion tk_parC tk_puntoComa 
        | tk_println tk_parA expresion tk_parC tk_puntoComa
        | error tk_puntoComa {listado.push({elemento: "sintactico", 
        encontrado: yytext, esperado: "tk_println | tk_print",
        fila: yylloc.first_line, columna: yylloc.first_column })};

internoCiclo 
        : interno
        | tk_break tk_puntoComa internoCiclo
        | tk_continue tk_puntoComa internoCiclo
        | error tk_puntoComa {listado.push({elemento: "sintactico", 
        encontrado: yytext, esperado: "tk_break | tk_continue",
        fila: yylloc.first_line, columna: yylloc.first_column })};

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
        | tk_igual expresion tk_puntoComa
        | error tk_puntoComa {listado.push({elemento: "sintactico",
        encontrado: yytext, esperado: "tk_divAsignacion",
        fila: yylloc.first_line, columna: yylloc.first_column})};

DeclaracionFor 
        : Tipo IdentificadorDeclaracionFor;

IdentificadorDeclaracionFor
        : tk_identificador tk_igual expresion;