Javascript <-> Mulholland interface | Spencer Tipping
Licensed under the terms of the MIT source code license

# Introduction

Mulholland is bidirectionally convertible to Javascript through Caterwaul source tree construction. This module provides a way to convert Caterwaul trees into Mulholland trees and back; this
is useful for doing declarative rewrites on Javascript faster than Caterwaul would be able to do them. The basic mechanism is that we just prepend a / to each Javascript node type. Literals
are transcribed directly, with the exception of things that start with $ (these are converted into @$). This transformation is invertible using the as_js() method of Mulholland source trees.

There are some conversion rules used to help Mulholland and Caterwaul interoperate. They are:

    1. (# (_f) (_x))             <-> (() (_f) (_x))
    2. (. (_f) ([ (_x)))         <-> ([] (_f) (_x))
    3. (( @ (_x))                <-> (( _x)                       <- similar for quasi-unary [ and {
    4. (@$_stuff)                <-> ($_stuff)                    <- conversion of $ in an operator position
    5. ("/_string/_mods"r)       <-> (/_string/_mods)

It should be noted that this library doesn't make Caterwaul interfacing easy; it makes it possible. The standard library builds better abstractions on top of this.

    caterwaul.module('mulholland.jsi', 'js_all', function ($) {
      $ /~syntax_extend/ {as_mh: as_mh},
      $.mulholland.syntax_common.as_js = as_js,

      where [as_mh(p) = this.data === '()'     ? new p.syntax('#' /!p.intern, [this[0].as_mh(p), this[1].as_mh(p)]) :
                        this.data === '[]'     ? new p.syntax('.' /!p.intern, [this[0].as_mh(p), new p.syntax('[' /!p.intern, [this[1].as_mh(p)])]) :
                        this.data.length === 0 ? new p.syntax('@' /!p.intern) :
                        this.length === 0      ? new p.syntax(this.data /!mh_encode_literal /!p.intern) :
                                                 new p.syntax(this.data /!mh_encode_literal /!p.intern, [this[0].as_mh(p), this[1].as_mh(p)]),

             as_js()  = this.resolved_data() === '@' ? $.empty :
                        this.resolved_data() === '#' ? new $.syntax('()', this[0].as_js(), this[1].as_js()) :
                        this /!represents_a_slice    ? new $.syntax('[]', this[0].as_js(), this[1][0].as_js()) :
                        this.length === 0            ? new $.syntax(this.resolved_data() /!mh_decode_literal) :
                                                       new $.syntax(this.resolved_data() /!mh_decode_literal, +this %~![x.resolved_data() !== '@' && x.as_js()] -seq),

             represents_a_slice(t) = t.resolved_data() === '.' && t[1].resolved_data() === '[',

             mh_encode_literal(d, s = d.toString()) = /\/./.test(s) ? '"' + s.replace(/"/g, '\\"') + '"r' : s.replace(/^\$/, '@$'),
             mh_decode_literal(d, s = d.toString()) = /^".*"r$/.test(s) ? s.replace(/^"\//, '/').replace(/\\"/g, '"').replace(/"r$/, '') : s.replace(/^@(.)/, '$1')]});