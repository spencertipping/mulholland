Semicolon distributivity | Spencer Tipping
Licensed under the terms of the MIT source code license

# Introduction

The semicolon is a function composition over interpreter transformations. For example, 'foo = bar; bif = baz' first runs 'foo = bar', then 'bif = baz' on the interpreter, returning the
interpreter after the second state.

    !@ context.extend (parse '_x; _y', given.match.[this.toplevel match._x, this.toplevel match._y])