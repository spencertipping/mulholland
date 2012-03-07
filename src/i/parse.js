caterwaul.module( 'mulholland.parser' ,function($) {$.mulholland.parser=function() {var table= { } ;
var table_i= { } ;
var next=0;
return(function( ) {var parser=function(_) {return parse(lex(sdoc(_.toString() ) ) ) } ,syntax=$.mulholland.syntax(parser) ,statics=function() {;
return{syntax:syntax,intern:intern,extern:extern,transient_intern:transient_intern,lex:lex,sdoc:sdoc,parse_token:parse_token} } ,sdoc=function(s) {;
return(function(it) {return(it.join( '\n' ) ) } ) .call(this, ( (function(xs) {var x,x0,xi,xl,xr;
for(var xr=new xs.constructor() ,xi=0,xl=xs.length;
xi<xl;
 ++xi)x=xs[xi] , ( /^\s*[A-Z|]/ .test(x) ) ||xr.push(x) ;
return xr} ) .call(this,s.split( /\n(?:\s*\n)+/ ) ) ) ) } ,lexer= /(#.*|(?:[@\w]|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")[^\s.:,;()\[\]{}]*|[.:,;][^\sA-Za-z@_()\[\]{}]*|[^\s.;,;()\[\]{}][^\s\w()\[\]{}]*(?:\w*[^\s\w()\[\]{}]+)*|[()\[\]{}])/ ,lex=function(s) {;
return(function(xs) {var x,x0,xi,xl,xr;
for(var xr=new xs.constructor() ,xi=0,xl=xs.length;
xi<xl;
 ++xi)x=xs[xi] , ( /^[^ \n\t\r#]/ .test(x) ) &&xr.push(x) ;
return xr} ) .call(this,s.split(lexer) ) } ,intern=function(s) {;
return Object.prototype.hasOwnProperty.call(table_i,s) ?table_i[s] :table_i[table[next] =s] =next++ } ,extern=function(n) {;
return n.constructor===Number&&Object.prototype.hasOwnProperty.call(table,n) ?table[n] :n} ,transient_intern=function(s) {;
return Object.prototype.hasOwnProperty.call(table_i,s) ?table_i[s] :s.toString() } ,precedence_table= (function(xs) {var x,x0,xi,xl,xr;
for(var xr=new xs.constructor() ,xi=0,xl=xs.length;
xi<xl;
 ++xi)x=xs[xi] ,xr.push( (new RegExp( ( '^' + (x) + '' ) ) ) ) ;
return xr} ) .call(this, [ '\\.' , '$' , '#' , '[~!\\\\`个不]' , '[/*%⋅∩]' , '$' , '[-+:&^∪≺≻]' , '$' , '[|⋯]' , '$' , '[<>≡∈⊂⊆⊃⊇是]' , '[\\$]' , '[∧¬⊕]' , '$' , '[∨]' , '[=?]' , '[,]' , '$' , '[;]' ] ) ,base_precedence=function(t) {;
return(function(xs) {var x,x0,xi,xl,xr;
for(var x=xs[0] ,xi=0,xl=xs.length,x1;
xi<xl;
 ++xi) {x=xs[xi] ;
if(x1= (x.test(t) &&xi+2) )return x1}return false} ) .call(this,precedence_table) } ,operator_lexer=function(_) {return/^(\$*)(.+?)(\$*)$/ .exec(_) } ,is_unary=function(t) {;
return precedence_table[3] .test(t) || !base_precedence(t) } ,is_operator=function(_) {return/^[^"'\w@_]+(?:\w*[^\s\w()\[\]{}]+)*$/ .exec(_) } ,is_opener=function(t) {;
return'([{' .indexOf(t) +1} ,is_closer=function(t) {;
return')]}' .indexOf(t) +1} ,parse_token=function(t) {;
return is_operator(t) ?parse_operator(t) : {l:0,r:0,id:intern(t) ,v:true} } ,parse_operator=function(t) {;
return is_opener(t) ? {id:intern(t) ,o:true,u:true,i:t=== '(' } :is_closer(t) ? {id:intern(t) ,c:true} :parse_regular_operator(t) } ,parse_regular_operator=function(t) {;
return(function( ) {var pieces=operator_lexer(t) ,unary=is_unary(pieces[2] ) ,precedence=base_precedence(pieces[2] ) +pieces[1] .length-pieces[3] .length,real_left=unary?1:precedence;
return( {l:real_left,r:precedence,id:intern(pieces[2] ) ,u:unary} ) } ) .call(this) } ,join=parse_operator( '#' ) ,empty_value=new syntax( '@' ) ,parse=function(ts) {;
return(function( ) {var values= [ ] ,right=function(t) {;
return t.l&1} ,operators= [ ] ,value=function() {;
return values.pop() ||empty_value} ,ev=true,top=function() {;
return operators[operators.length-1] } ,precedence=function(t) {;
return( (operators.length) && ( ( (right(t) ?top() .r<t.l:top() .r<=t.l) && ( ( (apply() ) , (precedence(t) ) ) ) ) ) ) } ,operator=function(t) {;
return( (precedence(t) ) , ( ( ! (t.i) && ( ( ( (operators) .push(t) ) , (ev=true) ) ) ) ) ) } ,observe=function(t) {;
return t.v? ( ( ( ( ( ! (ev) && (observe(join) ) ) ) , (ev=false) ) ) , ( (values) .push(new syntax(t.id) ) ) ) :t.o? ( ( ( ( ( ! (ev) && (observe(join) ) ) ) , (ev=true) ) ) , ( (operators) .push(t) ) ) :t.c? ( ( ( (apply_closer() ) , (ev=false) ) ) , (top() .i?operators.pop() :apply() ) ) :t.u? ( ( ( ! (ev) && (observe(join) ) ) ) , (operator(t) ) ) :operator(t) } ,apply=function() {;
return top() .u? (values) .push(new syntax(operators.pop() .id, [value() ] ) ) : (function( ) {var x=value() ,y=value() ;
return( (values) .push(new syntax(operators.pop() .id, [y,x] ) ) ) } ) .call(this) } ,apply_closer=function() {;
return( ! ( !operators.length||top() .o) && ( ( (apply() ) , (apply_closer() ) ) ) ) } ,apply_all=function() {;
return operators.length? ( (apply() ) , (apply_all() ) ) :values[values.length-1] } ;
return( ( ( (function(xs1) {var x2,x01,xi1,xl1,xr1;
for(var xi1=0,xl1=xs1.length;
xi1<xl1;
 ++xi1)x2=xs1[xi1] , (observe(x2) ) ;
return xs1} ) .call(this, (function(xs1) {var x2,x01,xi1,xl1,xr1;
for(var xr1=new xs1.constructor() ,xi1=0,xl1=xs1.length;
xi1<xl1;
 ++xi1)x2=xs1[xi1] ,xr1.push( (parse_token(x2) ) ) ;
return xr1} ) .call(this,ts) ) ) , (apply_all() ) ) ) } ) .call(this) } ;
return($.merge(parser,statics() ) ) } ) .call(this) } } ) ;
