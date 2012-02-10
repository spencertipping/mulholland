caterwaul.module( 'mulholland.tree' ,function($) { (function( ) {var statics=function(parser) {;
return(function( ) {var constants= { } ,constant=function(s) {;
return Object.prototype.hasOwnProperty.call(constants,s) ?constants[s] :constants[s] =new this(s) } ,create_bloom=function() {;
return $.bloom( [function(_) {return _*5471} ,function(_) {return _*8707} ] ,8) } ,empty_bloom=create_bloom() ;
return( {constants:constants,constant:constant,create_bloom:create_bloom,empty_bloom:empty_bloom} ) } ) .call(this) } ,methods=function(parser) {;
return{resolved_data:function() {;
return parser.extern(this.data) } ,structure:function() {;
return( '(' + (this.resolved_data() ) + '' + ( (function(it) {return(it.join( "" ) ) } ) .call(this, ( (function(xs) {var x,x0,xi,xl,xr;
for(var xr=new xs.constructor() ,xi=0,xl=xs.length;
xi<xl;
 ++xi)x=xs[xi] ,xr.push( ( " " +x.structure() ) ) ;
return xr} ) .call(this,Array.prototype.slice.call( (this) ) ) ) ) ) + ')' ) } ,toString:function() {;
return this.structure() } ,push:function(x) { (this[this.length++ ] =x) ;
return this} ,map:function(f) {var r= (function(xs) {var x,x0,xi,xl,xr;
for(var xr=new xs.constructor() ,xi=0,xl=xs.length;
xi<xl;
 ++xi)x=xs[xi] ,xr.push( ( (f) .call( {x0:x0,xi:xi,xl:xl,xs:xs,xr:xr} ,x) ) ) ;
return xr} ) .call(this,this) ;
 (r.data=this.data) ;
return r} ,rmap:function(f) {var ft=f(this) ;
return ft|| (this) .map(function(_) {return(_) .rmap(f) } ) } ,flatten:function(op) {;
return parser.right_associative(op) ?this.right_flatten(op) :this.left_flatten(op) } ,flatten_all:function(op) {;
return this.resolved_data() ===op? (this[0] .flatten_all(op) ) .concat(this[1] .flatten_all(op) ) : [this] } ,left_flatten:function(op) {;
return this.resolved_data() ===op? (this[0] .left_flatten(op) ) .concat( [this[1] ] ) : [this] } ,right_flatten:function(op) {;
return this.resolved_data() ===op? ( [this[0] ] ) .concat(this[1] .right_flatten(op) ) : [this] } ,is_wildcard:function() {;
return this._is_wildcard===undefined?this._is_wildcard= /^_./ .test(this.resolved_data() ) :this._is_wildcard} ,match_arity:function() {;
return this._match_arity===undefined?this._match_arity= (function(it) {return(it&& +it[1] ) } ) .call(this, ( /^_.*@(\d+)$/ .exec(this.resolved_data() ) ) ) :this._match_arity} ,without_arity:function() {;
return this._without_arity===undefined?this._without_arity=this.resolved_data() .replace( /@(\d+)$/ , '' ) :this._without_arity} ,create_bloom:function() {;
return this.constructor.create_bloom() } ,self_bloom:function() {;
return this.is_wildcard() ?this.create_bloom() : (this.create_bloom() ) .add(this.data) } ,bloom:function() {;
return this._bloom|| (function(xs) {var x,x0,xi,xl,xr;
for(var x0= (this._bloom=this.self_bloom() ) ,xi=0,xl=xs.length;
xi<xl;
 ++xi)x=xs[xi] ,x0= ( (x0) .merge(x.bloom() ) ) ;
return x0} ) .call(this,this) } ,erase_bloom:function() {;
return(this._bloom=this.constructor.empty_bloom,this) } ,complexity:function() {;
return this._complexity|| (this._complexity=1+ (function(xs) {var x,x0,xi,xl,xr;
for(var x0= (0) ,xi=0,xl=xs.length;
xi<xl;
 ++xi)x=xs[xi] ,x0= (x0+x.complexity() ) ;
return x0} ) .call(this,this) ) } ,match:function(t,m) {;
return(this) .can_match(t) && (this) .level_matches(t) && (m|| (m= {_:t} ) ) && ( ( !this.is_wildcard() ) || ( (m[this.without_arity() ] ? (m[this.without_arity() ] ) .match(t) :m[this.without_arity() ] =t) ) ) && (this) .children_match(t,m) &&m} ,replace:function(m) {;
return m&& (m[this.resolved_data() ] || (this) .map(function(_) {return _.replace(m) } ) ) } ,can_match:function(t) {;
return(this.bloom() ) .subset(t.bloom() ) &&this.complexity() <=t.complexity() } ,level_matches:function(t) {;
return this.is_wildcard() ?this.match_arity() ===null||t.length===this.match_arity() && ( !t.is_wildcard() ||t.match_arity() ===this.match_arity() ) :this.data===t.data&&this.length===t.length} ,children_match:function(t,m) {;
return(function(xs) {var x,x0,xi,xl,xr;
for(var x0= (true) ,xi=0,xl=xs.length;
xi<xl;
 ++xi)x=xs[xi] ,x0= (x0&& (x) .match(t[xi] ,m) ) ;
return x0} ) .call(this,this) } } } ;
return($.mulholland.syntax_common= { } ,$.mulholland.syntax=function(parser) {;
var result=function(data,xs) {;
return(this.data=data,this.length=0, ( (xs) && ( (function(xs) {var x,x0,xi,xl,xr;
for(var xi=0,xl=xs.length;
xi<xl;
 ++xi)x=xs[xi] , ( (this) .push(x) ) ;
return xs} ) .call(this,xs) ) ) ,this) } ;
 ($.merge(result.prototype,$.mulholland.syntax_common,methods(parser) ) ) ;
 ($.merge(result,statics(parser) ) ) ;
return result} ) } ) .call(this) } ) ;
