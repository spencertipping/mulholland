caterwaul.module( 'mulholland.mh' , (function(qs) {var result1= (function($) { (function( ) {var source_for=function(argv) {;
return(function(xs) {var x,x0,xi,xl,xr;
for(var xr=new xs.constructor() ,xi=0,xl=xs.length;
xi<xl;
 ++xi)x=xs[xi] ,xr.push( ( (read_file) .call( {x0:x0,xi:xi,xl:xl,xs:xs,xr:xr} ,x) ) ) ;
return xr} ) .call(this, (function(xs) {var x,x0,xi,xl,xr;
for(var xr=new xs.constructor() ,xi=0,xl=xs.length,x0;
xi<xl;
 ++xi)x=xs[xi] , ( /^-/ .test(x) ) ||xr.push(x) ;
return xr} ) .call(this,argv) ) } ,contains_short=function(argv,o) {;
return(function( ) {var pattern=new RegExp( ( '^-(?!-)\\w*' + (o) + '' ) ) ;
return( (function(xs) {var x,x0,xi,xl,xr;
for(var x=xs[0] ,xi=0,xl=xs.length,x1;
xi<xl;
 ++xi) {x=xs[xi] ;
if(x1= ( (pattern) .exec(x) ) )return x1}return false} ) .call(this,argv) ) } ) .call(this) } ,read_file=function(f) {;
return(function( ) {try{return(require( 'fs' ) .readFileSync(f, 'utf8' ) ) }catch(e) {return(f) } } ) .call(this) } ,output=function(t) {;
return process.stdout.write(t+ ';\n' , 'utf8' ) } ,defaults= {cc:output} ;
return($.merge($.mulholland, (function( ) {var mh_main=function(argv) {;
return argv.length===0||contains_short(argv, 'i' ) ?mh_repl(argv) :contains_short(argv, 'c' ) ?mh_compile(argv) :mh_offline(argv) } ,mh_compile=function(argv) {;
return(function( ) {var parser=$.mulholland() ,bundled_source=$.syntax.from_array( (function(xs) {var x,x0,xi,xl,xr;
for(var xr=new xs.constructor() ,xi=0,xl=xs.length;
xi<xl;
 ++xi)x=xs[xi] ,xr.push( ( ($.syntax.from_string) .call( {x0:x0,xi:xi,xl:xl,xs:xs,xr:xr} ,x) ) ) ;
return xr} ) .call(this, (function(xs) {var x,x0,xi,xl,xr;
for(var xr=new xs.constructor() ,xi=0,xl=xs.length;
xi<xl;
 ++xi)x=xs[xi] ,xr.push( ( (parser.sdoc) .call( {x0:x0,xi:xi,xl:xl,xs:xs,xr:xr} ,x) ) ) ;
return xr} ) .call(this,source_for(argv) ) ) ) ,resulting_tree=$.replicator() .toString() ,license= '// Mulholland compiler (or derivative) | Spencer Tipping\n// Licensed under the terms of the MIT source code license' ,reference_url= '// http://github.com/spencertipping/mulholland' ,header= ( '#!/usr/bin/env node\n' + (license) + '\n' + (reference_url) + '\n' ) ,footer= ( 'caterwaul.mulholland.mh_main(' + (bundled_source) + '.concat(process.argv.slice(2)));' ) ;
return(output( ( '' + (header) + '\n' + (resulting_tree) + '\n' + (footer) + '' ) ) ) } ) .call(this) } ,mh_offline=function(argv) {;
return(function( ) {var mh=$.mulholland.mh() ,cc=contains_short(argv, 'r' ) ?function(_) {return $.compile(_.as_js() .guarded() ,environment) } :function(_) {return output(_.as_js() .guarded() .toString() ) } ,ccs= {cc:cc} ,environment= {c:$,mh:mh,require:require,process:process} ,mhc=function(t) {;
return mh(t,ccs) } ;
return( (function(xs) {var x,x0,xi,xl,xr;
for(var xi=0,xl=xs.length;
xi<xl;
 ++xi)x=xs[xi] , ( (mhc) .call( {x0:x0,xi:xi,xl:xl,xs:xs,xr:xr} ,x) ) ;
return xs} ) .call(this,source_for(argv) ) ) } ) .call(this) } ,mh_repl=function(argv) {;
return(function( ) {var mh=$.mulholland.mh() ,evaluator=function(s,_1,_2,cc) {;
return(function( ) {var v=null;
return( ( ( (function( ) {try{return(mh(s, {cc:function(_) {return cc(null,v=_.as_js() .guarded() .toString() ) } } ) ) }catch(e) {return(cc(e) ) } } ) .call(this) ) , ( ( ! (v) && (cc(null,mh.context.toplevel.rules.length) ) ) ) ) ) } ) .call(this) } ;
return( ( ( ( ( (function(xs) {var x,x0,xi,xl,xr;
for(var xi=0,xl=xs.length;
xi<xl;
 ++xi)x=xs[xi] , ( (mh) .call( {x0:x0,xi:xi,xl:xl,xs:xs,xr:xr} ,x) ) ;
return xs} ) .call(this,source_for(argv) ) ) , (introduce() ) ) ) , (require( 'repl' ) .start( 'mh> ' ,undefined,evaluator) ) ) ) } ) .call(this) } ,context=function() {;
return{parse:$.mulholland() ,split:function(s) {;
return( (this) .parse(s) ) .flatten_all( ';' ) } ,environment:function() {;
return{c:$,context:this,parse:this.parse} } ,toplevel:$.mulholland.rewriter( [ ] ) } } ,introduce=function() {;
return process.stderr.write( 'Mulholland compiler (repl mode), copyright 2012 Spencer Tipping\n' + 'Licensed under the terms of the MIT source code license\n' + 'http://github.com/spencertipping/mulholland\n' ) } ,mh=function() {;
var result=function(s,specified_options) {;
return(function( ) {var evaluate=function(t) {var e=c.toplevel(t) ;
return e.resolved_data() === ';' ? (function(xs) {var x,x0,xi,xl,xr;
for(var xi=0,xl=xs.length;
xi<xl;
 ++xi)x=xs[xi] , ( (evaluate) .call( {x0:x0,xi:xi,xl:xl,xs:xs,xr:xr} ,x) ) ;
return xs} ) .call(this,e.flatten_all( ';' ) ) :e.resolved_data() === '=' ?define(e) :e.resolved_data() === '@js' ?js_evaluate(e) :e.resolved_data() === '=@js' ?js_define(e) :e.resolved_data() === '/-' ?evaluate(rewrite(e) ) :options.cc(e) } ,options=$.merge( { } ,defaults,specified_options) ,js_macroexpand=$( 'js_all' ) ,empty=new c.parse.syntax(c.parse.intern( '@' ) ) ,rewrite=function(t) {;
return c.toplevel.extend(t[1] .flatten_all( ';' ) ) (t[0] ) } ,js_evaluate=function(t) {;
return options.cc( ( ($.compile(js_macroexpand(t[0] .as_js() .guarded() ) ,c.environment() ) ) || (empty) ) ) } ,js_define=function(equation) {;
return c.toplevel= (c.toplevel) .extend( [js_evaluator(equation) ] ) } ,define=function(equation) {;
return c.toplevel= (c.toplevel) .extend( [equation] ) } ,replacer=function(js) {;
return(qs) .replace( {_body:js} ) } ,js_evaluator=function(e) {;
return[e[0] ,js_marker(e[1] ) ] } ,js_marker=function(t) {;
return(function(it) {return(it.replace=$.compile(js_macroexpand(replacer(t.as_js() .guarded() ) ) ,c.environment() ) ) ,it} ) .call(this, (new c.parse.syntax(c.parse.intern( ( '<js native: ' + (t.as_js() .guarded() .toString() ) + '>' ) ) ) ) ) } ;
return( (function(xs) {var x,x0,xi,xl,xr;
for(var xi=0,xl=xs.length;
xi<xl;
 ++xi)x=xs[xi] , ( (evaluate) .call( {x0:x0,xi:xi,xl:xl,xs:xs,xr:xr} ,x) ) ;
return xs} ) .call(this,c.split(s) ) ) } ) .call(this) } ;
var c=result.context=context() ;
return result} ;
return( {mh_main:mh_main,mh_compile:mh_compile,mh_offline:mh_offline,mh_repl:mh_repl,context:context,introduce:introduce,mh:mh} ) } ) .call(this) ) ) } ) .call(this) } ) ;
result1.caterwaul_expression_ref_table= {qs: ( "new caterwaul.syntax( \"(\" ,new caterwaul.syntax( \"function\" ,new caterwaul.syntax( \"(\" ,new caterwaul.syntax( \"match\" ) ) ,new caterwaul.syntax( \"{\" ,new caterwaul.syntax( \"return\" ,new caterwaul.syntax( \"&&\" ,new caterwaul.syntax( \"match\" ) ,new caterwaul.syntax( \"(\" ,new caterwaul.syntax( \"_body\" ) ) ) ) ) ) )" ) } ;
return(result1) } ) .call(this,new caterwaul.syntax( "(" ,new caterwaul.syntax( "function" ,new caterwaul.syntax( "(" ,new caterwaul.syntax( "match" ) ) ,new caterwaul.syntax( "{" ,new caterwaul.syntax( "return" ,new caterwaul.syntax( "&&" ,new caterwaul.syntax( "match" ) ,new caterwaul.syntax( "(" ,new caterwaul.syntax( "_body" ) ) ) ) ) ) ) ) ) ;
