caterwaul.module( 'mulholland.jsi' ,function($) { ($) .syntax_extend( {as_mulholland:function(p) {;
return new p.syntax(p.intern(this.data.replace( /^\$/ , '@dollar' ) ) , (function(xs) {var x,x0,xi,xl,xr;
for(var xr=new xs.constructor() ,xi=0,xl=xs.length;
xi<xl;
 ++xi)x=xs[xi] ,xr.push( ( (x) .as_mulholland(p) ) ) ;
return xr} ) .call(this,Array.prototype.slice.call( (this) ) ) ) } } ) } ) ;
