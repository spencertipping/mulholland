caterwaul.module( 'mulholland.mh' ,function($) {$.mulholland.mh_main=function(argv) {;
return argv.length? (function(xs) {var x,x0,xi,xl,xr;
for(var xi=0,xl=xs.length;
xi<xl;
 ++xi)x=xs[xi] , (console.log( '%s' ,x.as_caterwaul() .toString() ) ) ;
return xs} ) .call(this, (function(xs) {var x,x0,xi,xl,xr;
for(var xr=new xs.constructor() ,xi=0,xl=xs.length;
xi<xl;
 ++xi)x=xs[xi] ,xr.push( ( ($.mulholland.mh) .call( {x0:x0,xi:xi,xl:xl,xs:xs,xr:xr} ,x) ) ) ;
return xr} ) .call(this,argv) ) :$.mulholland.mh_repl() } ,$.mulholland.mh_repl=function() {;
return(function( ) {var evaluator=function(s,_1,_2,cc) {;
return(function( ) {try{return(cc(null,$.mulholland.mh(s) .structure() ) ) }catch(e) {return(cc(e,undefined) ) } } ) .call(this) } ;
return(require( 'repl' ) .start( 'mh> ' ,undefined,evaluator) ) } ) .call(this) } ,$.mulholland.mh=function(source) {;
return(function( ) {var parse=$.mulholland() ,rewrite_form=parse( '_x //@ [_y]' ) ,rewrite=function(match) {;
return match&&$.mulholland.rewriter(match._y.flatten( ',' ) ) (match._x) } ,toplevel_rewriter=$.mulholland.rewriter( [ [rewrite_form,rewrite] ] ) ,fixed_point_rewrite=function(t) {;
return t.dfs(rewrite_form,function(_) {return(function(it) {return(it&&fixed_point_rewrite(toplevel_rewriter(it._) ) ) } ) .call(this, ( (_) .match(this) ) ) } ) ||t} ;
return(fixed_point_rewrite(parse(source) ) ) } ) .call(this) } } ) ;
