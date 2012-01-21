caterwaul.module( 'mulholland.parser' ,function($) {$.mulholland.parser=function() {var table= { } ;
var table_i= { } ;
var next=0;
var result=function(code) {;
return(function( ) {var statics=function() {;
return{syntax:syntax,intern:intern,extern:extern,lex:lex,precedence:precedence,right_associative:right_associative} } ,syntax=$.mulholland.syntax(table,table_i) ,sdoc=function(s) {;
return(function(it) {return(it.join( '\n\n' ) ) } ) .call(this, ( (function(xs) {var x,x0,xi,xl,xr;
for(var xr=new xs.constructor() ,xi=0,xl=xs.length,x0;
xi<xl;
 ++xi)x=xs[xi] , ( /^\s*[A-Z|]/ .test(x) ) ||xr.push(x) ;
return xr} ) .call(this,s.split( /\n(?:\s*\n)+/ ) ) ) ) } ,lexer= /((?:[_@\w\x7f-\uffff]|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")[^ \n\t\r.:,;()\[\]{}]*|[^ \n\t\r.:,;()\[\]{}][^ \n\t\r()\[\]{}]*|#.*|[()\[\]{}]|[.:,;][^ \n\t\r\d\w$_@]*)/ ,lex=function(s) {;
return(function(xs) {var x,x0,xi,xl,xr;
for(var xr=new xs.constructor() ,xi=0,xl=xs.length,x0;
xi<xl;
 ++xi)x=xs[xi] , ( /^[^ \n\t\r#]/ .test(x) ) &&xr.push(x) ;
return xr} ) .call(this,s.split(lexer) ) } ,intern=function(s) {;
return Object.prototype.hasOwnProperty.call(table_i,s) ?table_i[s] :table_i[table[next] =s] =next++ } ,extern=function(n) {;
return Object.prototype.hasOwnProperty.call(table,n) ?table[n] :n} ,base_operators= (function(xs) {var x,x0,xi,xl,xr;
for(var xr=new xs.constructor() ,xi=0,xl=xs.length;
xi<xl;
 ++xi)x=xs[xi] ,xr.push( (new RegExp( ( '^' + (x) + '' ) ) ) ) ;
return xr} ) .call(this, [ '\\.' , '#' , '[`~]' , '[/*%]' , '[\\\\:!]' , '[-+]' , '[<>]' , '&' , '[|^]' , '[=?]' , '\\$' , ',' , ';' , '[(\[{]' ] ) ,right_associative=function(_) {return/^[\\:!<>`~=?(\[{]$/ .exec(_) } ,shading= (function(xs) {var x,x0,xi,xl,xr;
var xr=new xs.constructor() ;
for(var k_b_7kHq38FYt35RDkwrqqPIcZ in xs)if(Object.prototype.hasOwnProperty.call(xs,k_b_7kHq38FYt35RDkwrqqPIcZ) )x=xs[k_b_7kHq38FYt35RDkwrqqPIcZ] ,xr[k_b_7kHq38FYt35RDkwrqqPIcZ] = ( -x) ;
return xr} ) .call(this, { '~' : '1' , '*' : '1' , ':' : '1' , '+' : '1' , '>' : '1' , '^' : '1' , '?' : '1' , '%' : '-1' , '!' : '-1' } ) ,precedence=function(t) {;
return t.length===1?unshaded_precedence(t) :shaded_precedence(t.charAt(0) ) } ,unshaded_precedence=function(c) {;
return(function(xs) {var x,x0,xi,xl,xr;
for(var x=xs[0] ,xi=0,xl=xs.length,x_3_7kHq38FYt35RDkwrqqPIcZ;
xi<xl;
 ++xi) {x=xs[xi] ;
if(x_3_7kHq38FYt35RDkwrqqPIcZ= (x.test(c) &&xi+1<<2) )return x_3_7kHq38FYt35RDkwrqqPIcZ}return false} ) .call(this,base_operators) } ,shaded_precedence=function(c) {;
return unshaded_precedence(c) + ( (shading[c] ) || (0) ) } ,operator_semantic=function(t) {;
return t.length===1?t:t.substr(1) } ,is_value=function(t) {;
return/^['"$_@A-Za-z0-9\x7f-\uffff]/ .test(t) } ,opens_a_group=function(t) {;
return/^[(\[{]/ .test(t) } ,closes_a_group=function(t) {;
return/^[)\]}]/ .test(t) } ,node=function(op,x2,x1) {;
return new syntax(op, [x1,x2] ) } ,parse=function(ts) {;
return(function( ) {var expect_value=true,output= [ ] ,operator_stack= [ ] ,op=function() {;
return operator_stack[operator_stack.length-1] } ,defer=function(op) {;
return(operator_stack) .push(op) } ,use=function(op) {;
return(output) .push(node(intern(operator_semantic(op) ) ,output.pop() ,output.pop() ) ) } ,pop=function() {;
return use(operator_stack.pop() ) } ,pop_until=function(f) {;
return(function(xs) {var x,x0,xi,xl,xr;
for(var x=xs,xi=0,x0,xl;
x0= (operator_stack.length&& !f(op() ) ) ;
 ++xi)x= (pop() ) ;
return x} ) .call(this,null) } ,route=function(t) {;
return is_value(t) ? (function(it) {return( (output) .push(new syntax(intern(t) ) ) ) } ) .call(this, ( ( (expect_value=== (expect_value=false) ) && (binary( '#' ) ) ) ) ) :expect_value= ! !decide(t) } ,binary=function(o) {;
return(function(it) {return( (operator_stack) .push(o) ) } ) .call(this, (pop_until(right_associative(o) ?function(_) {return precedence(_) >=precedence(o) } :function(_) {return precedence(_) >precedence(o) } ) ) ) } ,decide=function(o) {;
return closes_a_group(o) ? (pop_until(opens_a_group) , !output.push(new syntax(intern(operator_stack.pop() ) , [output.pop() ] ) ) ) :opens_a_group(o) ? ( ( (expect_value!== (expect_value=true) ) && (binary( '#' ) ) ) , (operator_stack) .push(o) ) :binary(o) } ,pop_everything=function() {;
return(function(it) {return(output[0] ) } ) .call(this, (pop_until(function(_) {return operator_stack.length===0} ) ) ) } ;
return( (function(it) {return(pop_everything() ) } ) .call(this, ( (function(xs) {var x,x0,xi,xl,xr;
for(var xi=0,xl=xs.length;
xi<xl;
 ++xi)x=xs[xi] , ( (route) .call( {x0:x0,xi:xi,xl:xl,xs:xs,xr:xr} ,x) ) ;
return xs} ) .call(this,ts) ) ) ) } ) .call(this) } ;
return(parse(lex(sdoc(code.toString() ) ) ) ) } ) .call(this) } ;
 ($.merge(result,statics() ) ) ;
return result} } ) ;
