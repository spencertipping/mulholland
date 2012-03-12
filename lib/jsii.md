High-level mulholland-caterwaul interface | Spencer Tipping
Licensed under the terms of the MIT source code license

# Introduction

This file defines rewriting rules that make it more practical to write caterwaul code from inside mulholland. It requires the definitions in tree.mh.

    @jsii = (_x@0.@commas     = _x;                 _xs :> _y = function.@cons2 _xs.@commas.@group {return.@cons1 _y};
             (_xs _x).@commas = (_xs.@commas, _x);  _x  <: _y = '@='.@unquote.@cons2 _x _y;

# Tree grammar construction

Tree grammars are similar to caterwaul's anonymized patterns combined with macroexpanders, except that they are significantly more efficient. The idea is to construct a series of rewrite rules
with anonymized symbols and apply them to a tree.

            @grammar (_symbols _s) _rules = @grammar _symbols (_rules /- (_s = _s.@gensym)));