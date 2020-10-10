/*Parte lexica*/

%lex
%options case-insensitive
%%

/*Expresiones regulares para la aceptacion de numeros enteros y decimales*/
[0-9]+\b            %{return "tk_numero";%}
[0-9]+("."[0-9]+)\b %{return "tk_decimal";%}

/*conjunto de palabras reservadas*/
"public"        %{return "tk_public";%}
"true"          %{return "tk_true";%}
"false"         %{return "tk_false";%}
"class"         %{return "tk_class";%}
"interface"     %{return "tk_interface";%}
"void"          %{return "tk_void";%}
"for"           %{return "tk_for";%}
"while"         %{return "tk_while";%}
"do"            %{return "tk_do";%}
"if"            %{return "tk_if";%}
"else"          %{return "tk_else";%}
"break"         %{return "tk_break";%}
"continue"      %{return "tk_continue";%}
"return"        %{return "tk_return";%}
"int"           %{return "tk_int";%}
"boolean"       %{return "tk_boolean";%}
"double"        %{return "tk_double";%}
"string"        %{return "tk_string";%}
"char"          %{return "tk_char";%}
"static"        %{return "tk_static";%}
"main"          %{return "tk_main";%}
"args"          %{return "tk_args";%}
"system"        %{return "tk_system";%}
"out"           %{return "tk_out";%}
"print"         %{return "tk_print";%}
"println"       %{return "tk_if";%}

/*conjunto de simbolos aceptados*/
"{"     %{return "tk_llaveA";%}
"}"     %{return "tk_llaveC";%}
"("     %{return "tk_parA";%}
")"     %{return "tk_parC";%}
","     %{return "tk_coma";%}
";"     %{return "tk_puntoComa";%}
"^"     %{return "tk_xor";%}
"*"     %{return "tk_por";%}
"."     %{return "tk_punto";%}
"["     %{return "tk_corcheteA";%}
"]"     %{return "tk_corcheteC";%}
">"     %{return "tk_mayor";%}
">="    %{return "tk_mayorIgual";%}
"<"     %{return "tk_menor";%}
"<="    %{return "tk_menorIgual";%}
"="     %{return "tk_igual";%}
"=="    %{return "tk_igualacion";%}
"!"     %{return "tk_not";%}
"!="    %{return "tk_distinto";%}
"&&"    %{return "tk_and";%}
"||"    %{return "tk_or";%}
"+"     %{return "tk_mas";%}
"++"    %{return "tk_adicion";%}
"-"     %{return "tk_menos";%}
"--"    %{return "tk_sustraccion";%}
"/"     %{return "tk_division";%}

/*expresiones para validar los strings y chars*/
\"[^\"]*\"  %{return "tk_stringTexto"%}
\'[^\']*\'  %{return "tk_charTexto"%}

/*expresiones para comentarios individuales y multiples*/
"//".*                                  %{yytext.substr(1, yylen-2); return "tk_comentarioIndividual";%}
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]     %{yytext.substr(1, yylen-2); return "tk_comentarioMultiple";%}

/*expresion para un identificador*/
[a-zA-Z]([a-zA-Z0-9_])* %{return "tk_identificador";%}

/*final del archivo*/
<<EOF>> %{return "EOF";%}

/*
espacios en blanco, tabulados, saltos de linea, salto de carro, el otro no se que es equis de
pero todo esto se ignora
*/
[ \t\r\n\f] %{%}


/*estado sumidero donde van a caer todos los errores*/
. %{console.log("error", yytext, "fila", yylloc.first_line, "columna", yylloc.first_column)%}

/lex

/*Parte sintactica*/

%start Inicio

Inicio : PublicoInterClas EOF {};

PublicoInterClas : tk_public InterClas 
                | ;

InterClas : tk_interface tk_identificador tk_llaveA Definicion tk_llaveC PublicoInterClas 
            | tk_class tk_identificador tk_llaveA Instrucciones tk_llaveC PublicoInterClas;

Definicion : tk_public TipoFuncion tk_identificador tk_parA Parametros tk_parC tk_puntoComa Definicion 
            | ;

TipoFuncion : Tipo 
            | tk_void;

Tipo : tk_int 
        | tk_boolean 
        | tk_double 
        | tk_string 
        | tk_char;

Parametros : Tipo tk_identificador ListadoParametros
            | ;

ListadoParametros : tk_coma Parametros 
                    | ;

Instrucciones : Declaracion Instrucciones
            | Implementacion Instrucciones
            | ;

Declaracion : Tipo IdentificadorDeclaracion tk_puntoComa;

IdentificadorDeclaracion : tk_identificador ListadoDeclaracion;

ListadoDeclaracion : tk_igual expresion ListadoDeclaracion 
                    | tk_coma IdentificadorDeclaracion
                    | ;

expresion : expresion tk_mas expresion  
            | expresion tk_menos expresion 
            | expresion tk_por expresion
            | expresion tk_division expresion 
            | tk_menos expresion 
            | expresion tk_mayor expresion 
            | expresion tk_menor expresion
            | expresion tk_mayorIgual expresion 
            | expresion tk_menorIgual expresion
            | expresion tk_igualacion expresion
            | expresion tk_distinto expresion 
            | tk_not expresion 
            | expresion tk_and expresion 
            | expresion tk_or expresion 
            | expresion tk_xor expresion 
            | expresion tk_adicion
            | expresion tk_sustraccion
            | tk_stringTexto 
            | tk_charTexto 
            | tk_numero 
            | tk_decimal
            | tk_identificador 
            | tk_true 
            | tk_false 
            | tk_parA expresion tk_parC;

Implementacion : tk_public divTipoFuncion;

divTipoFuncion : TipoFuncion tk_identificador tk_parA Parametros tk_parC tk_llaveA interno tk_llaveC
                | tk_static tk_void tk_main tk_parA tk_string tk_corcheteA tk_corcheteC tk_args tk_parC tk_llaveA interno tk_llaveC;

interno : Declaracion interno
            | LlamadoAsignacion interno
            | tk_system tk_punto tk_out tk_punto divPrint interno
            | tk_for tk_parA DeclaracionFor tk_puntoComa expresion tk_puntoComa expresion tk_parC tk_llaveA internoCiclo tk_llaveC interno
            | tk_while tk_parA expresion tk_parC tk_llaveA internoCiclo tk_llaveC interno
            | tk_do tk_llaveA internoCiclo tk_llaveC tk_while tk_parA expresion tk_parC tk_puntoComa interno
            | tk_if tk_parA expresion tk_parC tk_llaveA interno tk_llaveC ifElse interno
            | tk_return tipoReturn tk_puntoComa interno
            | ;

tipoReturn : expresion
            | ;

ifElse : tk_else comprobacionElif
        | ;

comprobacionElif : tk_llaveA interno tk_llaveC
                | tk_if tk_parA expresion tk_parC tk_llaveA interno tk_llaveC ifElse;

divPrint : tk_print tk_parA expresion tk_parC tk_puntoComa 
            | tk_println tk_parA expresion tk_parC tk_puntoComa;

internoCiclo : interno
            | tk_break tk_puntoComa internoCiclo
            | tk_continue tk_puntoComa internoCiclo;

ParametrosLlamado : tk_identificador ListadoDeclaracionParametrosLlamado 
                | tk_numero ListadoDeclaracionParametrosLlamado
                | tk_decimal ListadoDeclaracionParametrosLlamado 
                | tk_true ListadoDeclaracionParametrosLlamado
                | tk_false ListadoDeclaracionParametrosLlamado
                | tk_stringTexto ListadoDeclaracionParametrosLlamado 
                | tk_charTexto ListadoDeclaracionParametrosLlamado;

ListadoDeclaracionParametrosLlamado : tk_coma ParametrosLlamado
                                    | ;

LlamadoAsignacion : tk_identificador divLlamadoAsignacion;

divLlamadoAsignacion : tk_parA ParametrosLlamado tk_parC tk_puntoComa
                    | tk_igual expresion tk_puntoComa;

DeclaracionFor : Tipo IdentificadorDeclaracionFor;

IdentificadorDeclaracionFor> : tk_identificador tk_igual expresion;