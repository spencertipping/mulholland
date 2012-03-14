Equality core definition | Spencer Tipping
Licensed under the terms of the MIT source code license

# Introduction

mh doesn't provide any rule that extends the current toplevel context, so one of the first things to do is to write such a rule. There is an element of indirection here because we want to be
able to use equality definitions as values. As a result, there are two separate equality operators. The first, _x = _y, is rewritten into the second, _x =@ _y. The second is a side-effecting
operator that extends the current context.

    !@ context.extend (parse '_x =@ _y', given.match.[context.toplevel = context.toplevel.extend [match._x, match._y]]);
    (_x = _y) =@ (_x =@ _y)