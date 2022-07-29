# References

---

All classes and functions are attached to the object `ST`, which is omitted below.

## `Style`

### `constructor`

```javascript
constructor(args)
```

The parameter `args` is an optional object default to `{}`.
The options are as follows:

| Field			| Option				 | Default	| Description	|
| :----------- | :-----------			 | :------- | :----------- |
| `classList`			| `[string]`									 | `[]`		| Additional classes of tooltips |
| `useHTML`				| `boolean`										 | `false`	| Whether HTML is parsed or not, when the content is a string |
| `tip`					| `boolean`										 | `true`	| Whether the tooltip has a tip or not |
| `relativeTo`			| `target` or `cursor`							 | `target` | Anchored to the target or following the cursor |
| `position`			| `top`, `right`, `bottom`, or `left`			 | `right`	| The position of the tooltip relative to the target or the cursor |
| `ratio`				| A positive number								 | 0.3		| An approximate ratio of the height of the tooltip to the width |
| `tipColor`			| Any color recognizable by CSS					 | `white`	| The color of the tip |
| `tipSize`				| Any length recognizable by CSS				 | `5px`	| The size of the tip |
| `transition.delay`	| `[a, b]` where `a, b` are nonnegative numbers	 | `[0, 0]` | The delay of the transition to appearance and disappearance, measured in ms |
| `transition.duration`	| `[a, b]` where `a, b` are nonnegative numbers	 | `[0, 0]` | The duration of the transition to appearance and disappearance, not including the delay, measured in ms |

#### Customization

Set the color and size of the tips via `tipColor` and `tipSize`.
Instead of adding more fields to `args`, we made the box part of tooltips customizable via `classList`.
Every generated tooltip has the class `ST`. Due to CSS specificity rules, rewrite the default by selecting `.ST.myClass`.

The generated tooltips become the last child of the target element, so the tooltips inherit some properties from the the target element.

### Methods

#### Parameters

##### `select`

`select` specifies the target elements. It is one of the following:

- `Selector(pattern)`, where `pattern` is a CSS selector pattern
- `NodeList(nodes)`, where `nodes` is an array of elements
- a function that takes no input and outputs an array of elements each time it is called

##### `content`

`content` specifies the content and is only required by `generate` and `generateOne`.
Other methods determine the content in other ways.
It is a function mapping elements to strings.

##### `event`

Default: `'hover'`

`event` specifies the event triggering the tooltips. It is one of the following:

- `'hover'`: hovering over the target element
- `'focus'`: focusing on the target element
- An array of 2D coordinates `[[x1, y1], ..., [xn, yn]]`, where `xi, yi` are nonnegative integers: hovering over the polygon inside the target element specified by the array; the left edge of the target element has `x=0`, and the top edge of the target element has `y=0`

##### `depth`

Default: `3`

`depth` specifies the maximum depth of tooltips to be generated.
A tooltip that is not inside another tooltip has depth 1.
It is a positive integer.

One exception is that `depth` in `generateOne` is the depth of the one tooltip to be generated.
We need this number to assign a proper `z-index`.

#### `.generate`

```javascript
style.generate(select, content, event, depth)
```

The most generic generator.

#### `.generateOne`

```javascript
style.generateOne(node, content, event, depth)
```

A generic generator for a single element.
Note that here `depth` is the depth of the one tooltip to be generated.

#### `.generateFromTitle`

```javascript
style.generateFromTitle(select, event, depth)
```

The content of the tooltip is supplied by `title` attribute.
The `title` attribute is then moved to `data-st-title`.
The selected elements without `title` attribute are ignored.

#### `.generateFromAttribute`

```javascript
style.generateFromAttribute(select, attribute, event, depth)
```

The content of the tooltip is supplied by the attribute named `attribute`.

#### `.generateFromChild`

```javascript
style.generateFromChild(select, event, depth)
```

The content of the tooltip is supplied by the last child of the target element, which should be a `template`.
The `template` is kept.
The selected elements without children or whose last element child is not a `template` are ignored.

## Helpers

### `NodeList`

```javascript
NodeList(nodes)
```

See [`select`](#select).

### `Selector`

```javascript
Selector(pattern)
```

See [`select`](#select).

## Removal

### `remove`

```javascript
remove(select)
```

The last tooltip of the selected elements are removed.
If `title` was moved to `data-st-title`, it is restored.
The selected elements without children or whose last element child is not a tooltip are ignored.

### `removeOne`

```javascript
removeOne(node)
```

The last tooltip of `node` is removed.
If `title` was moved to `data-st-title`, it is restored.
If the node has no children or the last element child is not a tooltip, do nothing.

## Caveats

- The algorithm we used for checking if the cursor is inside the polygon has time complexity O(n), where n is the number of vertices of the polygon. If `relativeTo` is set to `cursor`, set a transition delay to make the tooltip move smoother.
- The tooltip is made a child of the target element; to position the tooltip, the CSS `position` property of the target element is set to `relative` if it was `static`.
