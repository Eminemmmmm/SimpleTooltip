# SimpleTooltip

- Landing page: [http://simple-tooltip.herokuapp.com/](http://simple-tooltip.herokuapp.com/)
- Documentation: [http://simple-tooltip.herokuapp.com/references/](http://simple-tooltip.herokuapp.com/references/)

## Set Up

Download the files `SimpleTooltip.css` and `SimpleTooltip.js` and load them in the HTML page where you would like to use SimpleTooltip.

Load `SimpleTooltip.js` before the script using the library. The `async` option is not recommended.
Assume the script using the library is `MyScript.js`.
One possible way is to add the following to `head`:

```html
<link rel='stylesheet' href='SimpleTooltip.js'>
<script defer src='SimpleTooltip.js'></script>
<script defer src='MyScript.js'></script>
```

All classes and functions are attached to the object `ST`.

## Create a Style

Any tooltip is generated from an instance of `ST.Style`.

```javascript
const style = new ST.Style({ position: 'top' });
```

See the [API](http://simple-tooltip.herokuapp.com/references/#constructor) page for all options.

## Generate Tooltips

`Style` objects have various methods for generating tooltips.
Choose the one that suits your need and pass in arguments accordingly.

```javascript
// Target: All `a` tags with `title` attribute that is a descendent of an `article` tag 
// Source: The `title` attribute
// Event: Hovering over the `a` tag (default)
// Depth: 3 (default)
style.generateFromTitle(ST.Selector('article a'));
```

### Target Elements

Parameter: [`select`](http://simple-tooltip.herokuapp.com/references/#select)

Let us call the element the tooltip is attached to the "target element".
Target elements can be given by

- a single node,
- an array of node (see [NodeList](http://simple-tooltip.herokuapp.com/references/#nodelist)),
- a CSS selector (see [Selector](http://simple-tooltip.herokuapp.com/references/#selector)),
- or a JS function that takes no input and outputs an array of nodes.

### Source of Content

Parameter: [`content`](http://simple-tooltip.herokuapp.com/references/#content) (exclusive to `generate` and `generateOne`)

The source of the content determines the method you would choose.

The content can be supplied by

- the `title` attribute of the target element ([`generateFromTitle`](http://simple-tooltip.herokuapp.com/references/#generatefromtitle)),
- any attribute of the target element ([`generateFromAttribute`](http://simple-tooltip.herokuapp.com/references/#generatefromattribute)),
- the last child of the target element ([`generateFromChild`](http://simple-tooltip.herokuapp.com/references/#generatefromchild)), which should be a `template`,
- or a JS function mapping elements to strings (the generic [`generate`](http://simple-tooltip.herokuapp.com/references/#generate) or [`generateOne`](http://simple-tooltip.herokuapp.com/references/#generateone)).

The `title` method is preferred if the content is plain text.
The `template` method is preferred if the content contains HTML.
The function method offers the largest flexibility.

### Triggering Events

Parameter: [`event`](http://simple-tooltip.herokuapp.com/references/#event)

The tooltips can be triggered by

- hovering over the target element (`'hover'`),
- focusing on an element (`'focus'`),
- or hovering over a polygon area relative to the target (an array of coordinates).

### Depth

Parameter: [`depth`](http://simple-tooltip.herokuapp.com/references/#depth)

The maximum depth of tooltips to be generated. A tooltip that is not inside another tooltip has depth 1.

## Remove Tooltips

Use the function [`remove`](http://simple-tooltip.herokuapp.com/references/#remove) or [`removeOne`](http://simple-tooltip.herokuapp.com/references/#removeone).

## Acknowledgements

I would like to thank my friend [chrt](https://github.com/chrt) for helping with this project.