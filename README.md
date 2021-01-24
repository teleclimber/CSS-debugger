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

## The visualization thing:

Run this from the `./rules-visualization` dir

```
node_modules/.bin/webpack --config webpack.config.js --mode development
```

## License

MIT