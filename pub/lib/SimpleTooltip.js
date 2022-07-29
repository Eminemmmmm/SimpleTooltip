'use strict';

(global => {

	/** Dictionary for event pairs */
	const events = new Map([
		['hover', ['mouseover', 'mouseout']],
		['focus', ['focus', 'blur']]
	]);

	/** Check if the mouse pointer is inside the polygon */
	function inPolygon(x, y, polygon) {
		let inside = false;
		for (let i = 0; i < polygon.length - 1; ++i) {
			let p = polygon[i], q = polygon[i + 1];
			if (p[1] > y)
				[p, q] = [q, p];
			if (p[1] < y && q[1] > y && (p[0] - x) * (q[1] - y) > (q[0] - x) * (p[1] - y))
				inside = !inside;
		}
		return inside;
	}

	/** Style of tooltips */
	class Style {

		/** The number of styles */
		static counter = 0;
		/** CSS rules in the document */
		static sheet = (() => {
			let s = document.createElement('style');
			document.head.append(s);
			return s.sheet;
		})();
		/** How to position relative to the target */
		static fromTarget = new Map([
			['top', { left: '50%', top: '0' }],
			['right', { left: '100%', top: '50%' }],
			['bottom', { left: '50%', top: '100%' }],
			['left', { left: '0', top: '50%' }]
		]);

		/**
		 * @param {Object} [args={}] 
		 * @param {string[]} [args.classList=[]]
		 * @param {boolean} [args.useHTML=false]
		 * @param {boolean} [args.tip=true]
		 * @param {string} [args.relativeTo='target']
		 * @param {string} [args.position='right']
		 * @param {number} [args.ratio=0.3]
		 * @param {string} [args.tipColor]
		 * @param {string} [args.tipSize]
		 * @param {Object} [args.transition={ delay: [0, 0], duration: [0, 0] }]
		 */
		constructor(args) {
			this.id = Style.counter++;

			if (args === undefined)
				args = {};
			let {classList, useHTML, tip, relativeTo, position, ratio, tipColor, tipSize, transition} = args;
			const set = (field, v, d) => {
				this[field] = v === undefined ? d : v;
			};
			set('classList', classList, []);
			set('useHTML', useHTML, false);
			set('relativeTo', relativeTo, 'target');
			set('tip', tip, true);
			set('position', position, 'right');
			set('ratio', ratio, 0.3);
			if (transition === undefined)
				transition = {};
			this.transition = { delay: [0, 0], duration: [0, 0], ...transition};

			// Tip color
			if (tipColor) {
				this.tipColor = tipColor;
				Style.sheet.insertRule(`.ST-${this.id}.ST-${this.position}.ST-has-tip::after { border-${this.position}-color: ${tipColor}; }`);
			}

			// Tip size
			if (tipSize) {
				this.tipSize = tipSize;
				Style.sheet.insertRule(`.ST-${this.id}.ST-${this.position}.ST-has-tip::after { border-width: ${tipSize}; margin-${{top:'left', right:'top', bottom:'left', left:'top'}[position]}: -${tipSize}; } `);				
			}

			// Transition effects
			const { delay, duration } = this.transition;
			Style.sheet.insertRule(`.ST-${this.id}.ST-active { opacity: 1; visibility: show; transition: opacity ${duration[0]}ms linear ${delay[0]}ms; }`);
			Style.sheet.insertRule(`.ST-${this.id}.ST-inactive { opacity: 0; visibility: hidden; transition: opacity ${duration[1]}ms linear ${delay[1]}ms, visibility ${duration[1]}ms linear ${delay[1]}ms; }`);
		}

		/**
		 * Create a `div` containing `content`.
		 * @param {(string|HTMLFrameElement)} content 
		 * @returns {HTMLElement} The container created
		 * @private
		 */
		createContainer(content) {
			const container = document.createElement('div');
			if (typeof content === 'string' && this.useHTML)
				container.innerHTML = content;
			else
				container.append(content);
			return container;
		}

		/**
		 * Transform `container` into a tooltip.
		 * @param {HTMLElement} target 
		 * @param {HTMLElement} container 
		 * @param {(string|[[number]])} event 
		 * @private
		 */
		buildTooltip(target, container, event) {

			const classes = ['ST', `ST-${this.id}`, 'ST-inactive'];

			// Listen to the events
			if (typeof event === 'string') {
				const eventPair = events.get(event);
				target.addEventListener(eventPair[0], () => {
					container.classList.replace('ST-inactive', 'ST-active');
				});
				target.addEventListener(eventPair[1], () => {
					container.classList.replace('ST-active', 'ST-inactive');
				});				
			} else {
				event = event.map(([x, y]) => [x, y + Math.random() * 0.01 - 0.005]);
				event.push(event[0]);
				target.addEventListener('mousemove', e => {
					if (inPolygon(e.offsetX, e.offsetY, event))
						container.classList.replace('ST-inactive', 'ST-active');
					else
						container.classList.replace('ST-active', 'ST-inactive');
					
				});
				target.addEventListener('mouseout', () => container.classList.replace('ST-active', 'ST-inactive'));
			}

			// Position the tooltip
			classes.push('ST-' + this.position);
			if (this.relativeTo === 'cursor') {
				container.style.position = 'fixed';
				target.addEventListener('mousemove', e => {
					container.style.top = e.clientY + 'px';
					container.style.left = e.clientX + 'px';
				});
			} else if (this.relativeTo === 'target') {
				const { top, left } = Style.fromTarget.get(this.position);
				if (window.getComputedStyle(target).getPropertyValue('position') === 'static')
					target.style.position = 'relative';
				container.style.position = 'absolute';
				container.style.top = top;
				container.style.left = left;
			}

			// Set the tip of the tooltip
			if (this.tip)
				classes.push('ST-has-tip');

			container.classList.add(...classes, ...this.classList);
			target.append(container);

			// Ratio
			const computedWidth = parseFloat(window.getComputedStyle(container).getPropertyValue('width'));
			const computedHeight = parseFloat(window.getComputedStyle(container).getPropertyValue('height'));
			container.style.width = `${Math.sqrt(computedWidth * computedHeight / this.ratio)}px`;
		}

		/**
		 * Generate one tooltip.
		 * @param {HTMLElement} node 
		 * @param {Function} content 
		 * @param {(string|[[number]])} [event='hover']
		 * @param {Number} depth The depth of this tooltip
		 * @returns The container of the tooltip or none
		 */
		generateOne(node, content, event, depth) {
			depth = depth || 1;
			const s = content(node);
			console.log(s);
			if (!s) return;
			const container = this.createContainer(s);
			container.style.zIndex = 10 + depth;
			this.buildTooltip(node, container, event);
			return container;
		}

		/**
		 * Generate tooltips no deeper than `depth`.
		 * @param {Function} select 
		 * @param {Function} content 
		 * @param {(string|[[number]])} [event='hover']
		 * @param {Number} [depth=3]
		 */
		generate(select, content, event, depth) {
			event = event || 'hover';
			depth = depth || 3;

			const processed = new Set();

			for (let i = 1; i <= depth; ++i) {
				const nodes = select().filter(u => !processed.has(u));
				if (nodes.length === 0)
					return;
				nodes.forEach(u => {
					this.generateOne(u, content, event, i);
					processed.add(u);
				});
			}
		}

		/**
		 * Generate tooltips from the `title` attribute. `title` will be cleared but saved in `dataset.stTitle`.
		 * @param {Function} select
		 * @param {(string|[[number]])} [event='hover']
		 * @param {Number} [depth=3]
		 */
		generateFromTitle(select, event, depth) {
			this.generate(select, e => { e.dataset.stTitle = e.title; e.title = ''; return e.dataset.stTitle; }, event, depth);
		}

		/**
		 * Generate tooltips from `attribute`.
		 * @param {Function} select
		 * @param {string} attribute 
		 * @param {(string|[[number]])} [event='hover']
		 * @param {Number} [depth=3]
		 */
		generateFromAttribute(select, attribute, event, depth) {
			this.generate(select, e => e.getAttribute(attribute), event, depth);
		}

		/**
		 * Generate tooltips with the last child as the container.
		 * @param {Function} select
		 * @param {(string|[[number]])} [event='hover']
		 * @param {Number} [depth=3]
		 */
		generateFromChild(select, event, depth) {
			const f = v => {
				if (!v.lastElementChild || v.lastElementChild.tagName !== 'TEMPLATE')
					return false;
				while (v !== document.body) {
					if (v.tagName === 'TEMPLATE')
						return false;
					v = v.parentElement;
				}
				return true;
			}
			this.generate(() => select().filter(f), e => e.lastChild.content.cloneNode(true), event, depth);
		}
	}

	/**
	 * Remove the last tooltip attached to `node`. Restore `title` if it was removed.
	 * @param {HTMLElement} node 
	 */
	function removeOne(node) {
		if (!node.lastElementChild || !node.lastElementChild.classList.contains('ST'))
			return;
		if (node.dataset.stTitle) {
			node.title = node.dataset.stTitle;
			node.dataset.stTitle = '';
		}
		node.lastChild.remove();
	}

	/**
	 * Remove tooltips, one for each selected element. Restore `title` if it was removed.
	 * @param {Function} select
	 */
	function remove(select) {
		select().forEach(u => removeOne(u));
	}

	function NodeList(nodes) {
		return () => nodes;
	}

	function Selector(pattern) {
		return () => Array.from(document.body.querySelectorAll(pattern));
	}

	global.ST = { Style, removeOne, remove, NodeList, Selector };

	console.log('SimpleTooltip loaded');
})(window);
