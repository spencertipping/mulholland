caterwaul.module( 'mulholland.jsi' ,function($) { (function( ) {var as_mh=function(p) {;
return this.data=== '()' ?new p.syntax(p.intern( '#' ) , [this[0] .as_mh(p) ,this[1] .as_mh(p) ] ) :this.data=== '[]' ?new p.syntax(p.intern( '.' ) , [this[0] .as_mh(p) ,new p.syntax(p.intern( '[' ) , [this[1] .as_mh(p) ] ) ] ) :this.data.length===0?new p.syntax(p.intern( '@' ) ) :this.length===0?new p.syntax(p.intern(mh_encode_literal(this.data) ) ) :this.length===3?new p.syntax(p.intern(mh_encode(this.data) ) , [this[0] .as_mh(p) ,new p.syntax(p.intern( '/@:' ) , [this[1] .as_mh(p) ,this[2] .as_mh(p) ] ) ] ) :new p.syntax(p.intern(mh_encode(this.data) ) , [this[0] .as_mh(p) ,this[1] .as_mh(p) ] ) } ,as_js=function() {;
return this.resolved_data() === '@' ?$.empty:this.resolved_data() === '#' ?new $.syntax( '()' ,this[0] .as_js() ,this[1] .as_js() ) :represents_a_slice(this) ?new $.syntax( '[]' ,this[0] .as_js() ,this[1] [0] .as_js() ) :this.length===2&&this[1] .resolved_data() === '::' ?new $.syntax(mh_decode(this.resolved_data() ) , [this[0] .as_js() ,this[1] [0] .as_js() ,this[1] [1] .as_js() ] ) :this.length===0?new $.syntax(mh_decode_literal(this.resolved_data() ) ) :new $.syntax(mh_decode(this.resolved_data() ) , (function(xs) {var x,x0,xi,xl,xr;
for(var xr=new xs.constructor() ,xi=0,xl=xs.length,x0,_y;
xi<xl;
 ++xi)x=xs[xi] , (_y= (x.resolved_data() !== '@' &&x.as_js() ) ) &&xr.push(_y) ;
return xr} ) .call(this,Array.prototype.slice.call( (this) ) ) ) } ,represents_a_slice=function(t) {;
return t.resolved_data() === '.' &&t[1] .resolved_data() === '[' } ,mh_encode_literal=function(s) {;
return/\/./ .test(s) ? '"' +s.replace( /"/g , '\\"' ) + '"r' :s.replace( /^\$/ , '@$' ) } ,mh_encode=function(s) {;
return/^[()\[\]{}\.,;:]/ .test(s) ?s: '/' +s} ,mh_decode_literal=function(s) {;
return/^".*"r$/ .test(s) ?s.replace( /^"\// , '/' ) .replace( /\\"/g , '"' ) .replace( /"r$/ , '' ) :s.replace( /^@\$/ , '$' ) } ,mh_decode=function(s) {;
return s.replace( /^\/(.)/ , '$1' ) } ;
return( ($) .syntax_extend( {as_mh:as_mh} ) ,$.mulholland.syntax_common.as_js=as_js) } ) .call(this) } ) ;
