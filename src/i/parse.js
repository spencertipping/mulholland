caterwaul.module( 'mulholland.parser' ,function($) {$.mulholland.parser=function() {var table= { } ;
var table_i= { } ;
var next=0;
return(function( ) {var parser=function(_) {return parse(lex(sdoc(_.toString() ) ) ) } ,syntax=$.mulholland.syntax(parser) ,statics=function() {;
return{syntax:syntax,intern:intern,extern:extern,lex:lex,sdoc:sdoc} } ,sdoc=function(s) {;
return(function(it) {return(it.join( ' ' ) ) } ) .call(this, ( (function(xs) {var x,x0,xi,xl,xr;
for(var xr=new xs.constructor() ,xi=0,xl=xs.length,x0;
xi<xl;
 ++xi)x=xs[xi] , ( /^\s*[A-Z|]/ .test(x) ) ||xr.push(x) ;
return xr} ) .call(this,s.split( /\n(?:\s*\n)+/ ) ) ) ) } ,lexer= /(#.*|(?:[_@\w\d\x7f-\uffff]|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")[^ \n\t\r.:,;()\[\]{}]*|[^ \n\t\r.:,;()\[\]{}][^ \n\t\r()\[\]{}]*|[()\[\]{}]|[.:,;][^ \n\t\r\d\w@]*)/ ,lex=function(s) {;
return(function(xs) {var x,x0,xi,xl,xr;
for(var xr=new xs.constructor() ,xi=0,xl=xs.length,x0;
xi<xl;
 ++xi)x=xs[xi] , ( /^[^ \n\t\r#]/ .test(x) ) &&xr.push(x) ;
return xr} ) .call(this,s.split(lexer) ) } ,intern=function(s) {;
return Object.prototype.hasOwnProperty.call(table_i,s) ?table_i[s] :table_i[table[next] =s] =next++ } ,extern=function(n) {;
return Object.prototype.hasOwnProperty.call(table,n) ?table[n] :n} ,precedence_table= (function(xs) {var x,x0,xi,xl,xr;
for(var xr=new xs.constructor() ,xi=0,xl=xs.length;
xi<xl;
 ++xi)x=xs[xi] ,xr.push( (new RegExp( ( '^' + (x) + '' ) ) ) ) ;
return xr} ) .call(this, [ '\\.' , '#' , '[~!]' , '[/*]' , '[%`]' , '[+-]' , '[\\\\:]' , '[<>]' , '[&?]' , '\\^' , '=' , '\\|' , ',' , ';' ] ) ,base_precedence=function(t) {;
return(function(xs) {var x,x0,xi,xl,xr;
for(var x=xs[0] ,xi=0,xl=xs.length,x1;
xi<xl;
 ++xi) {x=xs[xi] ;
if(x1= (x.test(t) &&xi+2) )return x1}return false} ) .call(this,precedence_table) } ,operator_lexer=function(_) {return/^(\$*)([-\/\\|=]?)(.*?)(\.[-\/\\|=])?$/ .exec(_) } ,is_value=function(_) {return/^["'A-Za-z0-9@_\xff-\uffff]/ .exec(_) } ,parse_token=function(t) {;
return is_value(t) ? {l:0,r:0,u:0,id:intern(t) ,v:true,u:false,i:false} :parse_operator(t) } ,parse_operator=function(t) {;
return'([{' .indexOf(t) !== -1? {l:1,r:1<<30,id:intern(t) ,v:false,u:true,i:false,n:0} : ')]}' .indexOf(t) !== -1? {l:1<<30,r:1,id:intern(t) ,v:false,u:true,i:true,n:1} :parse_regular_operator(t) } ,parse_regular_operator=function(t) {;
return(function( ) {var pieces=operator_lexer(t) ,adjust=pieces[1] .length<<2,canonical=pieces[3] ||pieces[2] || '#' ,left=adjust+ ( (base_precedence(pieces[2] ) ) || (base_precedence(canonical) ) ) ,right=adjust+ ( (base_precedence( ( (pieces[4] ) && (pieces[4] .charAt(1) ) ) ) ) || (base_precedence(canonical.charAt(canonical.length-1) ) ) ) ,unary=right===adjust||right===adjust+4,real_left=unary?1:left,real_right=unary?left:right;
return( {l:real_left,r:real_right,id:intern(canonical) ,v:false,u:unary,i:false,n:0} ) } ) .call(this) } ,join=parse_regular_operator( '#' ) ,parse=function(ts) {;
return(function( ) {var values= [ ] ,operators= [ ] ,ev=true,top=function() {;
return operators[operators.length-1] } ,precedence=function(n) {;
return( (operators.length&& (n&1?top() .r<=n:top() .r<n) ) && ( ( (apply() ) , (precedence(n) ) ) ) ) } ,operator=function(t) {;
return( (precedence(t.l) ) , ( ( ! (t.i) && ( ( ( (operators) .push(t) ) , (ev=true) ) ) ) ) ) } ,observe=function(t) {;
return t.v? ( ( ( ( ( ! (ev) && (observe(join) ) ) ) , (ev=false) ) ) , ( (values) .push(new syntax(t.id) ) ) ) :t.u&& !t.i? ( ( ( ! (ev) && (observe(join) ) ) ) , (operator(t) ) ) :operator(t) } ,apply=function() {;
return top() .u? (values) .push(new syntax(operators.pop() .id, [values.pop() ] ) ) : (function( ) {var x=values.pop() ,y=values.pop() ;
return( (values) .push(new syntax(operators.pop() .id, [y,x] ) ) ) } ) .call(this) } ,apply_all=function() {;
return operators.length? ( (apply() ) , (apply_all() ) ) :values[values.length-1] } ;
return( (function(it) {return(apply_all() ) } ) .call(this, ( (function(xs) {var x,x0,xi,xl,xr;
for(var xi=0,xl=xs.length;
xi<xl;
 ++xi)x=xs[xi] , ( (observe) .call( {x0:x0,xi:xi,xl:xl,xs:xs,xr:xr} ,x) ) ;
return xs} ) .call(this, (function(xs) {var x,x0,xi,xl,xr;
for(var xr=new xs.constructor() ,xi=0,xl=xs.length;
xi<xl;
 ++xi)x=xs[xi] ,xr.push( ( (parse_token) .call( {x0:x0,xi:xi,xl:xl,xs:xs,xr:xr} ,x) ) ) ;
return xr} ) .call(this,ts) ) ) ) ) } ) .call(this) } ;
return($.merge(parser,statics() ) ) } ) .call(this) } } ) ;
