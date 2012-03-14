Toplevel extension | Spencer Tipping
Licensed under the terms of the MIT source code license

# Introduction

Because mulholland rewriters are immutable, the toplevel must be replaced to be extended. This module provides a straightforward way to do that.

    !@ (context.extend (lhs, rhs) = (context.toplevel = context.toplevel.extend [[lhs, rhs]], parse.syntax ('' + context.toplevel.rules.length)))