Global JSII native binding | Spencer Tipping
Licensed under the terms of the MIT source code license

# Introduction

I recently removed the =@ operator from mh. This has some subtle but significant implications for how native interfacing is done. The implications are subtle because you can easily preserve
semantics by treating =@ as a regular = followed by !@ for the replacement. That is:

    x =@ y ≡ x = !@ (y)   <- where ≡ denotes semantic equality at the term rewriting level, provided that y is pure under Javascript execution

The snag is that y will be recompiled and evaluated (!) for every single match of x. This happens even for speculative expansion. While doing this is semantically valid for any pure Javascript
expression, it causes a tremendous amount of overhead for what would otherwise be a trivial operation. The fix is to go a level deeper and implement 