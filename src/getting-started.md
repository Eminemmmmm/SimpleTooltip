# Getting Started

---

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

See the [API](references.md#constructor) page for all options.

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

Parameter: [`select`](references.md#select)

Let us call the element the tooltip is attached to the "target element".
Target elements can be given by

- a single node,
- an array of node (see [NodeList](references.md#nodelist)),
- a CSS selector (see [Selector](references.md#selector)),
- or a JS function that takes no input and outputs an array of nodes.

### Source of Content

Parameter: [`content`](references.md#content) (exclusive to `generate` and `generateOne`)

The source of the content determines the method you would choose.

The content can be supplied by

- the `title` attribute of the target element ([`generateFromTitle`](references.md#generatefromtitle)),
- any attribute of the target element ([`generateFromAttribute`](references.md#generatefromattribute)),
- the last child of the target element ([`generateFromChild`](references.md#generatefromchild)), which should be a `template`,
- or a JS function mapping elements to strings (the generic [`generate`](references.md#generate) or [`generateOne`](references.md#generateone)).

The `title` method is preferred if the content is plain text.
The `template` method is preferred if the content contains HTML.
The function method offers the largest flexibility.

### Triggering Events

Parameter: [`event`](references.md#event)

The tooltips can be triggered by

- hovering over the target element (`'hover'`),
- focusing on an element (`'focus'`),
- or hovering over a polygon area relative to the target (an array of coordinates).

### Depth

Parameter: [`depth`](references.md#depth)

The maximum depth of tooltips to be generated. A tooltip that is not inside another tooltip has depth 1.

## Remove Tooltips

Use the function [`remove`](references.md#remove) or [`removeOne`](references.md#removeone).
