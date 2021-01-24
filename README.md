# CSS-debugger

Project is abandoned.

CSS-debugger was an attempt at translating the CSS specs into a custom machine-readable language, which could be read by a specialized rule interpreter to build a working model of how CSS is supposed to work.

This could enable all kinds of capabilities:

- get clear actionable feedback on why a CSS rule is not behaving as you expect
- identify discrepancies between the CSS spec and the implementation
- identify issues with the spec itself

Personal motivation: I was tired of getting zero feedback from dev tools on *why* and element is not positioning itself as I expected. As a result, the CSS specs that I have focused on so far are the layout and positioning, and box model stuff.

## Project Components

The project uses [Nearley](https://nearley.js.org/) to create a few custom grammars. See `/grammar/`,

The CSS spec is manually read and translated into these custom grammars in carefully crafted YAML files. See `/rules/`.

These YAML files are read and turned into a big JS object.

Then the idea was to have a way of taking an element from the dom, and figure out exactly what should apply to that element and how by running the applied styles of each of its ancestors down to itself.

Or something like that. I never got that really working. It's probably possible but I ran out of steam.

There is also a so-called visualizer, but it doesn't do a whole lot of visualization. See below.

The goal was to make this into a dev tools extension, but I did not get that far.

## The rules and grammars

The rules are laid out exactly like the CSS specs, and refer to Spec sections. This means you can always refer back to the spec to see what the actual wording is.

The grammar is designed to be easy to read and write (I originally tried writing the rules straight into JSON, bad idea.) and yet still be easily parsable. So far the grammar has been sufficient to express the parts of the spec I translated. I'm not sure if that holds true in other parts.

The rules define properties and their initial values. The rules can also have a `match` clause, and a `relationship` or other clauses. Example from margins:

```
property:
    name:
        - margin
        - margin-left
        - margin-right
        - margin-top
        - margin-bottom
    value:
        - length
        - percentage
        - auto
    initial: 0
    inherited: no
        # we could add percentage: instead of matching
        # same for applies to

percentages:
    match: margin/margin-top/margin-bottom specified in percentages
    relation: margin is relative to width of containing-block
negative values:
    match: margin/margin-top/margin-bottom/margin-left/margin-right is negative
    warning: Negative margins are allowed but you may run into implementation limits
no effect:
    match: margin/margin-top/margin-bottom is specified
        and element is non-replaced
        and element is inline
    relation: margin-top/margin-bottom do not apply
```

Rules can also create concepts and conditions that make these concepts apply to elements. For example:

```
Stacking Context:
    concept:
        name: stacking-context
        applies-to: element

    match: z-index is integer
    relation: element is stacking-context
```

The idea is to build a complete picture for an element by "following" these relationships. But good luck with that.

## The visualization thing:

Run this from the `./rules-visualization` dir

```
node_modules/.bin/webpack --config webpack.config.js --mode development
```

## License

MIT