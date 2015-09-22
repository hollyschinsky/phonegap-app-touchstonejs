(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
  Copyright (c) 2015 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/

(function () {
	'use strict';

	function classNames () {

		var classes = '';

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if ('string' === argType || 'number' === argType) {
				classes += ' ' + arg;

			} else if (Array.isArray(arg)) {
				classes += ' ' + classNames.apply(null, arg);

			} else if ('object' === argType) {
				for (var key in arg) {
					if (arg.hasOwnProperty(key) && arg[key]) {
						classes += ' ' + key;
					}
				}
			}
		}

		return classes.substr(1);
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd){
		// AMD. Register as an anonymous module.
		define(function () {
			return classNames;
		});
	} else {
		window.classNames = classNames;
	}

}());

},{}],2:[function(require,module,exports){
function makeshiftTitle(title, message) {
  return title ? (title + '\n\n' + message) : message
}

// See http://docs.phonegap.com/en/edge/cordova_notification_notification.md.html for documentation
module.exports = {
  alert: function alert(message, callback, title) {
    if (window.navigator.notification && window.navigator.notification.alert) {
      return window.navigator.notification.alert.apply(null, arguments)
    }

    var text = makeshiftTitle(title, message)

    setTimeout(function() {
      window.alert(text)

      callback()
    }, 0)
  },
  confirm: function confirm(message, callback, title) {
    if (window.navigator.notification && window.navigator.notification.confirm) {
      return window.navigator.notification.confirm.apply(null, arguments)
    }

    var text = makeshiftTitle(title, message)

    setTimeout(function() {
      var confirmed = window.confirm(text)
      var buttonIndex = confirmed ? 1 : 2

      callback(buttonIndex)
    }, 0)
  },

  prompt: function prompt(message, callback, title, defaultText) {
    if (window.navigator.notification && window.navigator.notification.prompt) {
      return window.navigator.notification.prompt.apply(null, arguments)
    }

    var question = makeshiftTitle(title, message)

    setTimeout(function() {
      var text = window.prompt(question, defaultText)
      var buttonIndex = (text === null) ? 0 : 1

      callback({
        buttonIndex: buttonIndex,
        input1: text
      })
    }, 0)
  }
}

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var blacklist = require('blacklist');
var classnames = require('classnames');
var React = require('react');

function hasChildrenWithVerticalFill(children) {
	var result = false;

	React.Children.forEach(children, function (c) {
		if (result) return; // early-exit
		if (!c) return;
		if (!c.type) return;

		result = !!c.type.shouldFillVerticalSpace;
	});

	return result;
}

var Container = React.createClass({
	displayName: 'Container',

	propTypes: {
		align: React.PropTypes.oneOf(['end', 'center', 'start']),
		direction: React.PropTypes.oneOf(['column', 'row']),
		fill: React.PropTypes.bool,
		grow: React.PropTypes.bool,
		justify: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.oneOf(['end', 'center', 'start'])]),
		scrollable: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.object])
	},
	componentDidMount: function componentDidMount() {
		if (this.props.scrollable && this.props.scrollable.mount) {
			this.props.scrollable.mount(this);
		}
	},
	componentWillUnmount: function componentWillUnmount() {
		if (this.props.scrollable && this.props.scrollable.unmount) {
			this.props.scrollable.unmount(this);
		}
	},
	render: function render() {
		var direction = this.props.direction;
		if (!direction) {
			if (hasChildrenWithVerticalFill(this.props.children)) {
				direction = 'column';
			}
		}

		var fill = this.props.fill;
		if (direction === 'column' || this.props.scrollable) {
			fill = true;
		}

		var align = this.props.align;
		if (direction === 'column' && align === 'top') align = 'start';
		if (direction === 'column' && align === 'bottom') align = 'end';
		if (direction === 'row' && align === 'left') align = 'start';
		if (direction === 'row' && align === 'right') align = 'end';

		var className = classnames(this.props.className, {
			'Container--fill': fill,
			'Container--direction-column': direction === 'column',
			'Container--direction-row': direction === 'row',
			'Container--align-center': align === 'center',
			'Container--align-start': align === 'start',
			'Container--align-end': align === 'end',
			'Container--justify-center': this.props.justify === 'center',
			'Container--justify-start': this.props.justify === 'start',
			'Container--justify-end': this.props.justify === 'end',
			'Container--justified': this.props.justify === true,
			'Container--scrollable': this.props.scrollable
		});

		var props = blacklist(this.props, 'className', 'direction', 'fill', 'justify', 'scrollable');

		return React.createElement(
			'div',
			_extends({ className: className }, props),
			this.props.children
		);
	}
});

function initScrollable(defaultPos) {
	if (!defaultPos) {
		defaultPos = {};
	}
	var pos;
	var scrollable = {
		reset: function reset() {
			pos = { left: defaultPos.left || 0, top: defaultPos.top || 0 };
		},
		getPos: function getPos() {
			return { left: pos.left, top: pos.top };
		},
		mount: function mount(element) {
			var node = React.findDOMNode(element);
			node.scrollLeft = pos.left;
			node.scrollTop = pos.top;
		},
		unmount: function unmount(element) {
			var node = React.findDOMNode(element);
			pos.left = node.scrollLeft;
			pos.top = node.scrollTop;
		}
	};
	scrollable.reset();
	return scrollable;
}

Container.initScrollable = initScrollable;

exports['default'] = Container;
module.exports = exports['default'];
},{"blacklist":4,"classnames":1,"react":undefined}],4:[function(require,module,exports){
module.exports = function blacklist (src) {
  var copy = {}, filter = arguments[1]

  if (typeof filter === 'string') {
    filter = {}
    for (var i = 1; i < arguments.length; i++) {
      filter[arguments[i]] = true
    }
  }

  for (var key in src) {
    // blacklist?
    if (filter[key]) continue

    copy[key] = src[key]
  }

  return copy
}

},{}],5:[function(require,module,exports){
"use strict";

module.exports = function () {
  var listeners = [];

  return {
    componentWillUnmount: function componentWillUnmount() {
      listeners.forEach(function (listener) {
        var emitter = listener.emitter;
        var eventName = listener.eventName;
        var callback = listener.callback;

        var removeListener = emitter.removeListener || emitter.removeEventListener;
        removeListener.call(emitter, eventName, callback);
      });
    },

    watch: function watch(emitter, eventName, callback) {
      listeners.push({
        emitter: emitter,
        eventName: eventName,
        callback: callback
      });

      var addListener = emitter.addListener || emitter.addEventListener;
      addListener.call(emitter, eventName, callback);
    },

    unwatch: function unwatch(emitter, eventName, callback) {
      listeners = listeners.filter(function (listener) {
        return listener.emitter === emitter && listener.eventName === eventName && listener.callback === callback;
      });

      var removeListener = emitter.removeListener || emitter.removeEventListener;
      removeListener.call(emitter, eventName, callback);
    }
  };
};
},{}],6:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');

function getTouchProps(touch) {
	if (!touch) return {};
	return {
		pageX: touch.pageX,
		pageY: touch.pageY,
		clientX: touch.clientX,
		clientY: touch.clientY
	};
}

function isDataOrAriaProp(key) {
	return key.indexOf('data-') === 0 || key.indexOf('aria-') === 0;
}

function getPinchProps(touches) {
	return {
		touches: Array.prototype.map.call(touches, function copyTouch(touch) {
			return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
		}),
		center: { x: (touches[0].pageX + touches[1].pageX) / 2, y: (touches[0].pageY + touches[1].pageY) / 2 },
		angle: Math.atan() * (touches[1].pageY - touches[0].pageY) / (touches[1].pageX - touches[0].pageX) * 180 / Math.PI,
		distance: Math.sqrt(Math.pow(Math.abs(touches[1].pageX - touches[0].pageX), 2) + Math.pow(Math.abs(touches[1].pageY - touches[0].pageY), 2))
	};
}

var TOUCH_STYLES = {
	WebkitTapHighlightColor: 'rgba(0,0,0,0)',
	WebkitTouchCallout: 'none',
	WebkitUserSelect: 'none',
	KhtmlUserSelect: 'none',
	MozUserSelect: 'none',
	msUserSelect: 'none',
	userSelect: 'none',
	cursor: 'pointer'
};

/**
 * Tappable Mixin
 * ==============
 */

var Mixin = {
	propTypes: {
		moveThreshold: React.PropTypes.number, // pixels to move before cancelling tap
		activeDelay: React.PropTypes.number, // ms to wait before adding the `-active` class
		pressDelay: React.PropTypes.number, // ms to wait before detecting a press
		pressMoveThreshold: React.PropTypes.number, // pixels to move before cancelling press
		preventDefault: React.PropTypes.bool, // whether to preventDefault on all events
		stopPropagation: React.PropTypes.bool, // whether to stopPropagation on all events

		onTap: React.PropTypes.func, // fires when a tap is detected
		onPress: React.PropTypes.func, // fires when a press is detected
		onTouchStart: React.PropTypes.func, // pass-through touch event
		onTouchMove: React.PropTypes.func, // pass-through touch event
		onTouchEnd: React.PropTypes.func, // pass-through touch event
		onMouseDown: React.PropTypes.func, // pass-through mouse event
		onMouseUp: React.PropTypes.func, // pass-through mouse event
		onMouseMove: React.PropTypes.func, // pass-through mouse event
		onMouseOut: React.PropTypes.func, // pass-through mouse event

		onPinchStart: React.PropTypes.func, // fires when a pinch gesture is started
		onPinchMove: React.PropTypes.func, // fires on every touch-move when a pinch action is active
		onPinchEnd: React.PropTypes.func // fires when a pinch action ends
	},

	getDefaultProps: function getDefaultProps() {
		return {
			activeDelay: 0,
			moveThreshold: 100,
			pressDelay: 1000,
			pressMoveThreshold: 5
		};
	},

	getInitialState: function getInitialState() {
		return {
			isActive: false,
			touchActive: false,
			pinchActive: false
		};
	},

	componentWillUnmount: function componentWillUnmount() {
		this.cleanupScrollDetection();
		this.cancelPressDetection();
		this.clearActiveTimeout();
	},

	processEvent: function processEvent(event) {
		if (this.props.preventDefault) event.preventDefault();
		if (this.props.stopPropagation) event.stopPropagation();
	},

	onTouchStart: function onTouchStart(event) {
		if (this.props.onTouchStart && this.props.onTouchStart(event) === false) return;
		this.processEvent(event);
		window._blockMouseEvents = true;
		if (event.touches.length === 1) {
			this._initialTouch = this._lastTouch = getTouchProps(event.touches[0]);
			this.initScrollDetection();
			this.initPressDetection(event, this.endTouch);
			this._activeTimeout = setTimeout(this.makeActive, this.props.activeDelay);
		} else if ((this.props.onPinchStart || this.props.onPinchMove || this.props.onPinchEnd) && event.touches.length === 2) {
			this.onPinchStart(event);
		}
	},

	makeActive: function makeActive() {
		if (!this.isMounted()) return;
		this.clearActiveTimeout();
		this.setState({
			isActive: true
		});
	},

	clearActiveTimeout: function clearActiveTimeout() {
		clearTimeout(this._activeTimeout);
		this._activeTimeout = false;
	},

	onPinchStart: function onPinchStart(event) {
		// in case the two touches didn't start exactly at the same time
		if (this._initialTouch) {
			this.endTouch();
		}
		var touches = event.touches;
		this._initialPinch = getPinchProps(touches);
		this._initialPinch = _extends(this._initialPinch, {
			displacement: { x: 0, y: 0 },
			displacementVelocity: { x: 0, y: 0 },
			rotation: 0,
			rotationVelocity: 0,
			zoom: 1,
			zoomVelocity: 0,
			time: Date.now()
		});
		this._lastPinch = this._initialPinch;
		this.props.onPinchStart && this.props.onPinchStart(this._initialPinch, event);
	},

	onPinchMove: function onPinchMove(event) {
		if (this._initialTouch) {
			this.endTouch();
		}
		var touches = event.touches;
		if (touches.length !== 2) {
			return this.onPinchEnd(event) // bail out before disaster
			;
		}

		var currentPinch = touches[0].identifier === this._initialPinch.touches[0].identifier && touches[1].identifier === this._initialPinch.touches[1].identifier ? getPinchProps(touches) // the touches are in the correct order
		: touches[1].identifier === this._initialPinch.touches[0].identifier && touches[0].identifier === this._initialPinch.touches[1].identifier ? getPinchProps(touches.reverse()) // the touches have somehow changed order
		: getPinchProps(touches); // something is wrong, but we still have two touch-points, so we try not to fail

		currentPinch.displacement = {
			x: currentPinch.center.x - this._initialPinch.center.x,
			y: currentPinch.center.y - this._initialPinch.center.y
		};

		currentPinch.time = Date.now();
		var timeSinceLastPinch = currentPinch.time - this._lastPinch.time;

		currentPinch.displacementVelocity = {
			x: (currentPinch.displacement.x - this._lastPinch.displacement.x) / timeSinceLastPinch,
			y: (currentPinch.displacement.y - this._lastPinch.displacement.y) / timeSinceLastPinch
		};

		currentPinch.rotation = currentPinch.angle - this._initialPinch.angle;
		currentPinch.rotationVelocity = currentPinch.rotation - this._lastPinch.rotation / timeSinceLastPinch;

		currentPinch.zoom = currentPinch.distance / this._initialPinch.distance;
		currentPinch.zoomVelocity = (currentPinch.zoom - this._lastPinch.zoom) / timeSinceLastPinch;

		this.props.onPinchMove && this.props.onPinchMove(currentPinch, event);

		this._lastPinch = currentPinch;
	},

	onPinchEnd: function onPinchEnd(event) {
		// TODO use helper to order touches by identifier and use actual values on touchEnd.
		var currentPinch = _extends({}, this._lastPinch);
		currentPinch.time = Date.now();

		if (currentPinch.time - this._lastPinch.time > 16) {
			currentPinch.displacementVelocity = 0;
			currentPinch.rotationVelocity = 0;
			currentPinch.zoomVelocity = 0;
		}

		this.props.onPinchEnd && this.props.onPinchEnd(currentPinch, event);

		this._initialPinch = this._lastPinch = null;

		// If one finger is still on screen, it should start a new touch event for swiping etc
		// But it should never fire an onTap or onPress event.
		// Since there is no support swipes yet, this should be disregarded for now
		// if (event.touches.length === 1) {
		// 	this.onTouchStart(event);
		// }
	},

	initScrollDetection: function initScrollDetection() {
		this._scrollPos = { top: 0, left: 0 };
		this._scrollParents = [];
		this._scrollParentPos = [];
		var node = this.getDOMNode();
		while (node) {
			if (node.scrollHeight > node.offsetHeight || node.scrollWidth > node.offsetWidth) {
				this._scrollParents.push(node);
				this._scrollParentPos.push(node.scrollTop + node.scrollLeft);
				this._scrollPos.top += node.scrollTop;
				this._scrollPos.left += node.scrollLeft;
			}
			node = node.parentNode;
		}
	},

	calculateMovement: function calculateMovement(touch) {
		return {
			x: Math.abs(touch.clientX - this._initialTouch.clientX),
			y: Math.abs(touch.clientY - this._initialTouch.clientY)
		};
	},

	detectScroll: function detectScroll() {
		var currentScrollPos = { top: 0, left: 0 };
		for (var i = 0; i < this._scrollParents.length; i++) {
			currentScrollPos.top += this._scrollParents[i].scrollTop;
			currentScrollPos.left += this._scrollParents[i].scrollLeft;
		}
		return !(currentScrollPos.top === this._scrollPos.top && currentScrollPos.left === this._scrollPos.left);
	},

	cleanupScrollDetection: function cleanupScrollDetection() {
		this._scrollParents = undefined;
		this._scrollPos = undefined;
	},

	initPressDetection: function initPressDetection(event, callback) {
		if (!this.props.onPress) return;
		this._pressTimeout = setTimeout((function () {
			this.props.onPress(event);
			callback();
		}).bind(this), this.props.pressDelay);
	},

	cancelPressDetection: function cancelPressDetection() {
		clearTimeout(this._pressTimeout);
	},

	onTouchMove: function onTouchMove(event) {
		if (this._initialTouch) {
			this.processEvent(event);

			if (this.detectScroll()) return this.endTouch(event);

			this.props.onTouchMove && this.props.onTouchMove(event);
			this._lastTouch = getTouchProps(event.touches[0]);
			var movement = this.calculateMovement(this._lastTouch);
			if (movement.x > this.props.pressMoveThreshold || movement.y > this.props.pressMoveThreshold) {
				this.cancelPressDetection();
			}
			if (movement.x > this.props.moveThreshold || movement.y > this.props.moveThreshold) {
				if (this.state.isActive) {
					this.setState({
						isActive: false
					});
				} else if (this._activeTimeout) {
					this.clearActiveTimeout();
				}
			} else {
				if (!this.state.isActive && !this._activeTimeout) {
					this.setState({
						isActive: true
					});
				}
			}
		} else if (this._initialPinch && event.touches.length === 2) {
			this.onPinchMove(event);
			event.preventDefault();
		}
	},

	onTouchEnd: function onTouchEnd(event) {
		var _this = this;

		if (this._initialTouch) {
			this.processEvent(event);
			var afterEndTouch;
			var movement = this.calculateMovement(this._lastTouch);
			if (movement.x <= this.props.moveThreshold && movement.y <= this.props.moveThreshold && this.props.onTap) {
				event.preventDefault();
				afterEndTouch = function () {
					var finalParentScrollPos = _this._scrollParents.map(function (node) {
						return node.scrollTop + node.scrollLeft;
					});
					var stoppedMomentumScroll = _this._scrollParentPos.some(function (end, i) {
						return end !== finalParentScrollPos[i];
					});
					if (!stoppedMomentumScroll) {
						_this.props.onTap(event);
					}
				};
			}
			this.endTouch(event, afterEndTouch);
		} else if (this._initialPinch && event.touches.length + event.changedTouches.length === 2) {
			this.onPinchEnd(event);
			event.preventDefault();
		}
	},

	endTouch: function endTouch(event, callback) {
		this.cancelPressDetection();
		this.clearActiveTimeout();
		if (event && this.props.onTouchEnd) {
			this.props.onTouchEnd(event);
		}
		this._initialTouch = null;
		this._lastTouch = null;
		if (callback) {
			callback();
		}
		if (this.state.isActive) {
			this.setState({
				isActive: false
			});
		}
	},

	onMouseDown: function onMouseDown(event) {
		if (window._blockMouseEvents) {
			window._blockMouseEvents = false;
			return;
		}
		if (this.props.onMouseDown && this.props.onMouseDown(event) === false) return;
		this.processEvent(event);
		this.initPressDetection(event, this.endMouseEvent);
		this._mouseDown = true;
		this.setState({
			isActive: true
		});
	},

	onMouseMove: function onMouseMove(event) {
		if (window._blockMouseEvents || !this._mouseDown) return;
		this.processEvent(event);
		this.props.onMouseMove && this.props.onMouseMove(event);
	},

	onMouseUp: function onMouseUp(event) {
		if (window._blockMouseEvents || !this._mouseDown) return;
		this.processEvent(event);
		this.props.onMouseUp && this.props.onMouseUp(event);
		this.props.onTap && this.props.onTap(event);
		this.endMouseEvent();
	},

	onMouseOut: function onMouseOut(event) {
		if (window._blockMouseEvents || !this._mouseDown) return;
		this.processEvent(event);
		this.props.onMouseOut && this.props.onMouseOut(event);
		this.endMouseEvent();
	},

	endMouseEvent: function endMouseEvent() {
		this.cancelPressDetection();
		this._mouseDown = false;
		this.setState({
			isActive: false
		});
	},

	cancelTap: function cancelTap() {
		this.endTouch();
		this._mouseDown = false;
	},

	touchStyles: function touchStyles() {
		return TOUCH_STYLES;
	},

	handlers: function handlers() {
		return {
			onTouchStart: this.onTouchStart,
			onTouchMove: this.onTouchMove,
			onTouchEnd: this.onTouchEnd,
			onMouseDown: this.onMouseDown,
			onMouseUp: this.onMouseUp,
			onMouseMove: this.onMouseMove,
			onMouseOut: this.onMouseOut
		};
	}
};

/**
 * Tappable Component
 * ==================
 */

var Component = React.createClass({

	displayName: 'Tappable',

	mixins: [Mixin],

	propTypes: {
		component: React.PropTypes.any, // component to create
		className: React.PropTypes.string, // optional className
		classBase: React.PropTypes.string, // base for generated classNames
		style: React.PropTypes.object, // additional style properties for the component
		disabled: React.PropTypes.bool // only applies to buttons
	},

	getDefaultProps: function getDefaultProps() {
		return {
			component: 'span',
			classBase: 'Tappable'
		};
	},

	render: function render() {
		var props = this.props;
		var className = props.classBase + (this.state.isActive ? '-active' : '-inactive');

		if (props.className) {
			className += ' ' + props.className;
		}

		var style = {};
		_extends(style, this.touchStyles(), props.style);

		var newComponentProps = _extends({}, props, {
			style: style,
			className: className,
			disabled: props.disabled,
			handlers: this.handlers
		}, this.handlers());

		delete newComponentProps.onTap;
		delete newComponentProps.onPress;
		delete newComponentProps.onPinchStart;
		delete newComponentProps.onPinchMove;
		delete newComponentProps.onPinchEnd;
		delete newComponentProps.moveThreshold;
		delete newComponentProps.pressDelay;
		delete newComponentProps.pressMoveThreshold;
		delete newComponentProps.preventDefault;
		delete newComponentProps.stopPropagation;
		delete newComponentProps.component;

		return React.createElement(props.component, newComponentProps, props.children);
	}
});

Component.Mixin = Mixin;
Component.touchStyles = TOUCH_STYLES;
module.exports = Component;
},{"react":undefined}],7:[function(require,module,exports){
(function (global){
"use strict";

var GLOBAL = global || window;

function clearTimers() {
  this.clearIntervals();
  this.clearTimeouts();
}

module.exports = function Timers() {
  var intervals = undefined,
      timeouts = undefined;

  return {
    clearIntervals: function clearIntervals() {
      intervals.forEach(GLOBAL.clearInterval);
    },
    clearTimeouts: function clearTimeouts() {
      timeouts.forEach(GLOBAL.clearTimeout);
    },
    clearInterval: function clearInterval() {
      return GLOBAL.clearInterval.apply(GLOBAL, arguments);
    },
    clearTimeout: function clearTimeout() {
      return GLOBAL.clearTimeout.apply(GLOBAL, arguments);
    },
    clearTimers: clearTimers,

    componentWillMount: function componentWillMount() {
      intervals = [];
      timeouts = [];
    },
    componentWillUnmount: clearTimers,

    setInterval: function setInterval(callback) {
      var _this = this;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return intervals[intervals.push(GLOBAL.setInterval.apply(GLOBAL, [function () {
        for (var _len2 = arguments.length, params = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          params[_key2] = arguments[_key2];
        }

        callback.call.apply(callback, [_this].concat(params));
      }].concat(args))) - 1];
    },
    setTimeout: function setTimeout(callback) {
      var _this2 = this;

      for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }

      return timeouts[timeouts.push(GLOBAL.setTimeout.apply(GLOBAL, [function () {
        for (var _len4 = arguments.length, params = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          params[_key4] = arguments[_key4];
        }

        callback.call.apply(callback, [_this2].concat(params));
      }].concat(args))) - 1];
    }
  };
};
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
var React = require('react');
var Container = require('react-container');

var ErrorView = React.createClass({
	displayName: 'ErrorView',

	propTypes: {
		children: React.PropTypes.node
	},

	render: function render() {
		return React.createElement(
			Container,
			{ fill: true, className: "View ErrorView" },
			this.props.children
		);
	}
});

exports['default'] = ErrorView;
module.exports = exports['default'];
},{"react":undefined,"react-container":3}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var blacklist = require('blacklist');
var React = require('react');
var Tappable = require('react-tappable');
var Transitions = require('../mixins/Transitions');

var Link = React.createClass({
	displayName: 'Link',

	mixins: [Transitions],
	propTypes: {
		children: React.PropTypes.any,
		options: React.PropTypes.object,
		transition: React.PropTypes.string,
		to: React.PropTypes.string,
		viewProps: React.PropTypes.any
	},

	doTransition: function doTransition() {
		var options = _extends({ viewProps: this.props.viewProps, transition: this.props.transition }, this.props.options);
		console.info('Link to "' + this.props.to + '" using transition "' + this.props.transition + '"' + ' with props ', this.props.viewProps);
		this.transitionTo(this.props.to, options);
	},

	render: function render() {
		var tappableProps = blacklist(this.props, 'children', 'options', 'transition', 'viewProps');

		return React.createElement(
			Tappable,
			_extends({ onTap: this.doTransition }, tappableProps),
			this.props.children
		);
	}
});

exports['default'] = Link;
module.exports = exports['default'];
},{"../mixins/Transitions":14,"blacklist":48,"react":undefined,"react-tappable":6}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
var React = require('react');

var View = React.createClass({
	displayName: 'View',

	propTypes: {
		component: React.PropTypes.func.isRequired,
		name: React.PropTypes.string.isRequired
	},
	render: function render() {
		throw new Error('TouchstoneJS <View> should not be rendered directly.');
	}
});

exports['default'] = View;
module.exports = exports['default'];
},{"react":undefined}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var blacklist = require('blacklist');
var classNames = require('classnames');
var ErrorView = require('./ErrorView');
var React = require('react/addons');
var Transition = React.addons.CSSTransitionGroup;

function createViewsFromChildren(children) {
	var views = {};
	React.Children.forEach(children, function (view) {
		views[view.props.name] = view;
	});
	return views;
}

var ViewContainer = React.createClass({
	displayName: 'ViewContainer',

	statics: {
		shouldFillVerticalSpace: true
	},
	propTypes: {
		children: React.PropTypes.node
	},
	render: function render() {
		var props = blacklist(this.props, 'children');
		return React.createElement(
			'div',
			props,
			this.props.children
		);
	}
});

var ViewManager = React.createClass({
	displayName: 'ViewManager',

	statics: {
		shouldFillVerticalSpace: true
	},
	contextTypes: {
		app: React.PropTypes.object.isRequired
	},
	propTypes: {
		name: React.PropTypes.string,
		children: React.PropTypes.node,
		className: React.PropTypes.string,
		defaultView: React.PropTypes.string,
		onViewChange: React.PropTypes.func
	},
	getDefaultProps: function getDefaultProps() {
		return {
			name: '__default'
		};
	},
	getInitialState: function getInitialState() {
		return {
			views: createViewsFromChildren(this.props.children),
			currentView: this.props.defaultView,
			options: {}
		};
	},
	componentDidMount: function componentDidMount() {
		this.context.app.viewManagers[this.props.name] = this;
	},
	componentWillUnmount: function componentWillUnmount() {
		delete this.context.app.viewManagers[this.props.name];
	},
	componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
		this.setState({
			views: createViewsFromChildren(this.props.children)
		});
		if (nextProps.name !== this.props.name) {
			this.context.app.viewManagers[nextProps.name] = this;
			delete this.context.app.viewManagers[this.props.name];
		}
		if (nextProps.currentView && nextProps.currentView !== this.state.currentView) {
			this.transitionTo(nextProps.currentView, { viewProps: nextProps.viewProps });
		}
	},
	transitionTo: function transitionTo(viewKey, options) {
		var _this = this;

		if (typeof options === 'string') {
			options = { transition: options };
		}
		if (!options) options = {};
		this.activeTransitionOptions = options;
		this.context.app.viewManagerInTransition = this;
		this.props.onViewChange && this.props.onViewChange(viewKey);
		this.setState({
			currentView: viewKey,
			options: options
		}, function () {
			delete _this.activeTransitionOptions;
			delete _this.context.app.viewManagerInTransition;
		});
	},
	renderViewContainer: function renderViewContainer() {
		var viewKey = this.state.currentView;
		if (!viewKey) {
			return React.createElement(
				ErrorView,
				null,
				React.createElement(
					'span',
					{ className: "ErrorView__heading" },
					'ViewManager: ',
					this.props.name
				),
				React.createElement(
					'span',
					{ className: "ErrorView__text" },
					'Error: There is no current View.'
				)
			);
		}
		var view = this.state.views[viewKey];
		if (!view || !view.props.component) {
			return React.createElement(
				ErrorView,
				null,
				React.createElement(
					'span',
					{ className: "ErrorView__heading" },
					'ViewManager: "',
					this.props.name,
					'"'
				),
				React.createElement(
					'span',
					{ className: "ErrorView__text" },
					'The View "',
					viewKey,
					'" is invalid.'
				)
			);
		}
		var options = this.state.options || {};
		var viewClassName = classNames('View View--' + viewKey, view.props.className);
		var ViewComponent = view.props.component;
		var viewProps = blacklist(view.props, 'component', 'className');
		_extends(viewProps, options.viewProps);
		var viewElement = React.createElement(ViewComponent, viewProps);

		if (this.__lastRenderedView !== viewKey) {
			// console.log('initialising view ' + viewKey + ' with options', options);
			if (viewElement.type.navigationBar && viewElement.type.getNavigation) {
				var app = this.context.app;
				var transition = options.transition;
				if (app.viewManagerInTransition) {
					transition = app.viewManagerInTransition.activeTransitionOptions.transition;
				}
				setTimeout(function () {
					app.navigationBars[viewElement.type.navigationBar].updateWithTransition(viewElement.type.getNavigation(viewProps, app), transition);
				}, 0);
			}
			this.__lastRenderedView = viewKey;
		}

		return React.createElement(
			ViewContainer,
			{ className: viewClassName, key: viewKey },
			viewElement
		);
	},
	render: function render() {
		var className = classNames('ViewManager', this.props.className);
		var viewContainer = this.renderViewContainer(this.state.currentView, { viewProps: this.state.currentViewProps });

		var transitionName = 'view-transition-instant';
		if (this.state.options.transition) {
			// console.log('applying view transition: ' + this.state.options.transition + ' to view ' + this.state.currentView);
			transitionName = 'view-transition-' + this.state.options.transition;
		}
		return React.createElement(
			Transition,
			{ transitionName: transitionName, transitionEnter: true, transitionLeave: true, className: className, component: "div" },
			viewContainer
		);
	}
});

exports['default'] = ViewManager;
module.exports = exports['default'];
},{"./ErrorView":8,"blacklist":48,"classnames":1,"react/addons":undefined}],12:[function(require,module,exports){
'use strict';

var animation = require('tween.js');
var React = require('react');

function update() {
	animation.update();
	if (animation.getAll().length) {
		window.requestAnimationFrame(update);
	}
}

function scrollToTop(el, options) {
	options = options || {};
	var from = el.scrollTop;
	var duration = Math.min(Math.max(200, from / 2), 350);
	if (from > 200) duration = 300;
	el.style.webkitOverflowScrolling = 'auto';
	el.style.overflow = 'hidden';
	var tween = new animation.Tween({ pos: from }).to({ pos: 0 }, duration).easing(animation.Easing.Quadratic.Out).onUpdate(function () {
		el.scrollTop = this.pos;
		if (options.onUpdate) {
			options.onUpdate();
		}
	}).onComplete(function () {
		el.style.webkitOverflowScrolling = 'touch';
		el.style.overflow = 'scroll';
		if (options.onComplete) options.onComplete();
	}).start();
	update();
	return tween;
}

exports.scrollToTop = scrollToTop;

var Mixins = exports.Mixins = {};

Mixins.ScrollContainerToTop = {
	componentDidMount: function componentDidMount() {
		window.addEventListener('statusTap', this.scrollContainerToTop);
	},
	componentWillUnmount: function componentWillUnmount() {
		window.removeEventListener('statusTap', this.scrollContainerToTop);
		if (this._scrollContainerAnimation) {
			this._scrollContainerAnimation.stop();
		}
	},
	scrollContainerToTop: function scrollContainerToTop() {
		var _this = this;

		if (!this.isMounted() || !this.refs.scrollContainer) return;
		this._scrollContainerAnimation = scrollToTop(React.findDOMNode(this.refs.scrollContainer), {
			onComplete: function onComplete() {
				delete _this._scrollContainerAnimation;
			}
		});
	}
};
},{"react":undefined,"tween.js":49}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.createApp = createApp;
var React = require('react');

var animation = require('./core/animation');
exports.animation = animation;
var Link = require('./core/Link');
exports.Link = Link;
var View = require('./core/View');
exports.View = View;
var ViewManager = require('./core/ViewManager');

exports.ViewManager = ViewManager;
var Container = require('react-container');
exports.Container = Container;
var Mixins = require('./mixins');
exports.Mixins = Mixins;
var UI = require('./ui');

exports.UI = UI;

function createApp() {
	var app = {
		navigationBars: {},
		viewManagers: {},
		views: {},
		transitionTo: function transitionTo(view, opts) {
			var vm = '__default';
			view = view.split(':');
			if (view.length > 1) {
				vm = view.shift();
			}
			view = view[0];
			app.viewManagers[vm].transitionTo(view, opts);
		}
	};
	return {
		childContextTypes: {
			app: React.PropTypes.object
		},
		getChildContext: function getChildContext() {
			return {
				app: app
			};
		}
	};
}
},{"./core/Link":9,"./core/View":10,"./core/ViewManager":11,"./core/animation":12,"./mixins":15,"./ui":47,"react":undefined,"react-container":3}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
var React = require('react');

var Transitions = {
	contextTypes: {
		app: React.PropTypes.object
	},
	transitionTo: function transitionTo(view, opts) {
		this.context.app.transitionTo(view, opts);
	}
};

exports['default'] = Transitions;
module.exports = exports['default'];
},{"react":undefined}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var Transitions = require('./Transitions');
exports.Transitions = Transitions;
},{"./Transitions":14}],16:[function(require,module,exports){
'use strict';

var React = require('react/addons');
var classnames = require('classnames');
var Transition = React.addons.CSSTransitionGroup;

module.exports = React.createClass({
	displayName: 'Alertbar',
	propTypes: {
		animated: React.PropTypes.bool,
		children: React.PropTypes.node.isRequired,
		className: React.PropTypes.string,
		pulse: React.PropTypes.bool,
		type: React.PropTypes.oneOf(['default', 'primary', 'success', 'warning', 'danger']),
		visible: React.PropTypes.bool
	},

	getDefaultProps: function getDefaultProps() {
		return {
			type: 'default'
		};
	},

	render: function render() {
		var className = classnames('Alertbar', 'Alertbar--' + this.props.type, {
			'Alertbar--animated': this.props.animated,
			'Alertbar--pulse': this.props.pulse
		}, this.props.className);

		var pulseWrap = this.props.pulse ? React.createElement(
			'div',
			{ className: "Alertbar__inner" },
			this.props.children
		) : this.props.children;
		var animatedBar = this.props.visible ? React.createElement(
			'div',
			{ className: className },
			pulseWrap
		) : null;

		var component = this.props.animated ? React.createElement(
			Transition,
			{ transitionName: "Alertbar", component: "div" },
			animatedBar
		) : React.createElement(
			'div',
			{ className: className },
			pulseWrap
		);

		return component;
	}
});
},{"classnames":1,"react/addons":undefined}],17:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react/addons');
var Tappable = require('react-tappable');

var blacklist = require('blacklist');
var classnames = require('classnames');

module.exports = React.createClass({
	displayName: 'Button',
	propTypes: {
		children: React.PropTypes.node.isRequired,
		className: React.PropTypes.string,
		type: React.PropTypes.oneOf(['default', 'info', 'primary', 'success', 'warning', 'danger'])
	},

	getDefaultProps: function getDefaultProps() {
		return {
			type: 'default'
		};
	},

	render: function render() {
		var className = classnames('Button', 'Button--' + this.props.type, this.props.className);
		var props = blacklist(this.props, 'type');

		return React.createElement(Tappable, _extends({}, props, { className: className, component: "button" }));
	}
});
},{"blacklist":48,"classnames":1,"react-tappable":6,"react/addons":undefined}],18:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var blacklist = require('blacklist');
var classnames = require('classnames');
var React = require('react/addons');

module.exports = React.createClass({
	displayName: 'ButtonGroup',
	propTypes: {
		children: React.PropTypes.node.isRequired,
		className: React.PropTypes.string
	},
	render: function render() {
		var className = classnames('ButtonGroup', this.props.className);
		var props = blacklist(this.props, 'className');

		return React.createElement('div', _extends({ className: className }, props));
	}
});
},{"blacklist":48,"classnames":1,"react/addons":undefined}],19:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var blacklist = require('blacklist');
var classnames = require('classnames');
var React = require('react/addons');

module.exports = React.createClass({
	displayName: 'FieldControl',
	propTypes: {
		children: React.PropTypes.node.isRequired,
		className: React.PropTypes.string
	},
	render: function render() {
		var className = classnames('FieldControl', this.props.className);
		var props = blacklist(this.props, 'className');

		return React.createElement('div', _extends({ className: className }, props));
	}
});
},{"blacklist":48,"classnames":1,"react/addons":undefined}],20:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var blacklist = require('blacklist');
var classnames = require('classnames');
var React = require('react/addons');

module.exports = React.createClass({
	displayName: 'FieldLabel',
	propTypes: {
		children: React.PropTypes.node.isRequired,
		className: React.PropTypes.string
	},
	render: function render() {
		var className = classnames('FieldLabel', this.props.className);
		var props = blacklist(this.props, 'className');

		return React.createElement('div', _extends({ className: className }, props));
	}
});
},{"blacklist":48,"classnames":1,"react/addons":undefined}],21:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var blacklist = require('blacklist');
var classnames = require('classnames');
var React = require('react/addons');

module.exports = React.createClass({
	displayName: 'Group',
	propTypes: {
		children: React.PropTypes.node.isRequired,
		className: React.PropTypes.string,
		hasTopGutter: React.PropTypes.bool
	},
	render: function render() {
		var className = classnames('Group', {
			'Group--has-gutter-top': this.props.hasTopGutter
		}, this.props.className);
		var props = blacklist(this.props, 'className');

		return React.createElement('div', _extends({ className: className }, props));
	}
});
},{"blacklist":48,"classnames":1,"react/addons":undefined}],22:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var blacklist = require('blacklist');
var classnames = require('classnames');
var React = require('react/addons');

module.exports = React.createClass({
	displayName: 'GroupBody',
	propTypes: {
		children: React.PropTypes.node.isRequired,
		className: React.PropTypes.string
	},
	render: function render() {
		var className = classnames('Group__body', this.props.className);
		var props = blacklist(this.props, 'className');

		return React.createElement('div', _extends({ className: className }, props));
	}
});
},{"blacklist":48,"classnames":1,"react/addons":undefined}],23:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var blacklist = require('blacklist');
var classnames = require('classnames');
var React = require('react/addons');

module.exports = React.createClass({
	displayName: 'GroupFooter',
	propTypes: {
		children: React.PropTypes.node.isRequired,
		className: React.PropTypes.string
	},
	render: function render() {
		var className = classnames('Group__footer', this.props.className);
		var props = blacklist(this.props, 'className');

		return React.createElement('div', _extends({ className: className }, props));
	}
});
},{"blacklist":48,"classnames":1,"react/addons":undefined}],24:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var blacklist = require('blacklist');
var classnames = require('classnames');
var React = require('react/addons');

module.exports = React.createClass({
	displayName: 'GroupHeader',
	propTypes: {
		children: React.PropTypes.node.isRequired,
		className: React.PropTypes.string
	},
	render: function render() {
		var className = classnames('Group__header', this.props.className);
		var props = blacklist(this.props, 'className');

		return React.createElement('div', _extends({ className: className }, props));
	}
});
},{"blacklist":48,"classnames":1,"react/addons":undefined}],25:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var blacklist = require('blacklist');
var classnames = require('classnames');
var React = require('react/addons');

module.exports = React.createClass({
	displayName: 'GroupInner',
	propTypes: {
		children: React.PropTypes.node.isRequired,
		className: React.PropTypes.string
	},
	render: function render() {
		var className = classnames('Group__inner', this.props.className);
		var props = blacklist(this.props, 'className');

		return React.createElement('div', _extends({ className: className }, props));
	}
});
},{"blacklist":48,"classnames":1,"react/addons":undefined}],26:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var Item = require('./Item');
var ItemContent = require('./ItemContent');
var ItemInner = require('./ItemInner');
var React = require('react/addons');

var blacklist = require('blacklist');

module.exports = React.createClass({
	displayName: 'Input',

	propTypes: {
		className: React.PropTypes.string,
		children: React.PropTypes.node,
		disabled: React.PropTypes.bool
	},

	render: function render() {
		var inputProps = blacklist(this.props, 'children', 'className');

		return React.createElement(
			Item,
			{ className: this.props.className, selectable: this.props.disabled, component: "label" },
			React.createElement(
				ItemInner,
				null,
				React.createElement(
					ItemContent,
					{ component: "label" },
					React.createElement('input', _extends({ className: "field", type: "text" }, inputProps))
				),
				this.props.children
			)
		);
	}
});
},{"./Item":27,"./ItemContent":28,"./ItemInner":29,"blacklist":48,"react/addons":undefined}],27:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _blacklist = require('blacklist');

var _blacklist2 = _interopRequireDefault(_blacklist);

var _reactAddons = require('react/addons');

var _reactAddons2 = _interopRequireDefault(_reactAddons);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

module.exports = _reactAddons2['default'].createClass({
	displayName: 'Item',

	propTypes: {
		children: _reactAddons2['default'].PropTypes.node.isRequired,
		className: _reactAddons2['default'].PropTypes.string,
		showDisclosureArrow: _reactAddons2['default'].PropTypes.bool
	},

	getDefaultProps: function getDefaultProps() {
		return {
			component: 'div'
		};
	},

	render: function render() {
		var componentClass = (0, _classnames2['default'])('Item', {
			'Item--has-disclosure-arrow': this.props.showDisclosureArrow
		}, this.props.className);

		var props = (0, _blacklist2['default'])(this.props, 'children', 'className', 'showDisclosureArrow');
		props.className = componentClass;

		return _reactAddons2['default'].createElement(this.props.component, props, this.props.children);
	}
});
},{"blacklist":48,"classnames":1,"react/addons":undefined}],28:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var blacklist = require('blacklist');
var classnames = require('classnames');
var React = require('react/addons');

module.exports = React.createClass({
	displayName: 'ItemContent',
	propTypes: {
		children: React.PropTypes.node.isRequired,
		className: React.PropTypes.string
	},
	render: function render() {
		var className = classnames('Item__content', this.props.className);
		var props = blacklist(this.props, 'className');

		return React.createElement('div', _extends({ className: className }, props));
	}
});
},{"blacklist":48,"classnames":1,"react/addons":undefined}],29:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react/addons');

var classnames = require('classnames');

module.exports = React.createClass({
	displayName: 'ItemInner',

	propTypes: {
		children: React.PropTypes.node.isRequired,
		className: React.PropTypes.string
	},

	render: function render() {
		var className = classnames('Item__inner', this.props.className);

		return React.createElement('div', _extends({ className: className }, this.props));
	}
});
},{"classnames":1,"react/addons":undefined}],30:[function(require,module,exports){
'use strict';

var React = require('react/addons');
var classnames = require('classnames');

module.exports = React.createClass({
	displayName: 'ItemMedia',
	propTypes: {
		avatar: React.PropTypes.string,
		avatarInitials: React.PropTypes.string,
		className: React.PropTypes.string,
		icon: React.PropTypes.string,
		thumbnail: React.PropTypes.string
	},

	render: function render() {
		var className = classnames({
			'Item__media': true,
			'Item__media--icon': this.props.icon,
			'Item__media--avatar': this.props.avatar || this.props.avatarInitials,
			'Item__media--thumbnail': this.props.thumbnail
		}, this.props.className);

		// media types
		var icon = this.props.icon ? React.createElement('div', { className: 'Item__media__icon ' + this.props.icon }) : null;
		var avatar = this.props.avatar || this.props.avatarInitials ? React.createElement(
			'div',
			{ className: "Item__media__avatar" },
			this.props.avatar ? React.createElement('img', { src: this.props.avatar }) : this.props.avatarInitials
		) : null;
		var thumbnail = this.props.thumbnail ? React.createElement(
			'div',
			{ className: "Item__media__thumbnail" },
			React.createElement('img', { src: this.props.thumbnail })
		) : null;

		return React.createElement(
			'div',
			{ className: className },
			icon,
			avatar,
			thumbnail
		);
	}
});
},{"classnames":1,"react/addons":undefined}],31:[function(require,module,exports){
'use strict';

var classnames = require('classnames');
var React = require('react/addons');

module.exports = React.createClass({
	displayName: 'ItemNote',
	propTypes: {
		className: React.PropTypes.string,
		icon: React.PropTypes.string,
		label: React.PropTypes.string,
		type: React.PropTypes.string
	},
	getDefaultProps: function getDefaultProps() {
		return {
			type: 'default'
		};
	},
	render: function render() {
		var className = classnames('Item__note', 'Item__note--' + this.props.type, this.props.className);

		// elements
		var label = this.props.label ? React.createElement(
			'div',
			{ className: "Item__note__label" },
			this.props.label
		) : null;
		var icon = this.props.icon ? React.createElement('div', { className: 'Item__note__icon ' + this.props.icon }) : null;

		return React.createElement(
			'div',
			{ className: className },
			label,
			icon
		);
	}
});
},{"classnames":1,"react/addons":undefined}],32:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var blacklist = require('blacklist');
var classnames = require('classnames');
var React = require('react/addons');

module.exports = React.createClass({
	displayName: 'ItemSubTitle',
	propTypes: {
		children: React.PropTypes.node.isRequired,
		className: React.PropTypes.string
	},
	render: function render() {
		var className = classnames('Item__subtitle', this.props.className);
		var props = blacklist(this.props, 'className');

		return React.createElement('div', _extends({ className: className }, props));
	}
});
},{"blacklist":48,"classnames":1,"react/addons":undefined}],33:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var blacklist = require('blacklist');
var classnames = require('classnames');
var React = require('react/addons');

module.exports = React.createClass({
	displayName: 'ItemTitle',
	propTypes: {
		children: React.PropTypes.node.isRequired,
		className: React.PropTypes.string
	},
	render: function render() {
		var className = classnames('Item__title', this.props.className);
		var props = blacklist(this.props, 'className');

		return React.createElement('div', _extends({ className: className }, props));
	}
});
},{"blacklist":48,"classnames":1,"react/addons":undefined}],34:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _blacklist = require('blacklist');

var _blacklist2 = _interopRequireDefault(_blacklist);

var _FieldControl = require('./FieldControl');

var _FieldControl2 = _interopRequireDefault(_FieldControl);

var _FieldLabel = require('./FieldLabel');

var _FieldLabel2 = _interopRequireDefault(_FieldLabel);

var _Item = require('./Item');

var _Item2 = _interopRequireDefault(_Item);

var _ItemInner = require('./ItemInner');

var _ItemInner2 = _interopRequireDefault(_ItemInner);

var _reactAddons = require('react/addons');

var _reactAddons2 = _interopRequireDefault(_reactAddons);

var _reactTappable = require('react-tappable');

// Many input types DO NOT support setSelectionRange.
// Email will show an error on most desktop browsers but works on
// mobile safari + WKWebView, which is really what we care about

var _reactTappable2 = _interopRequireDefault(_reactTappable);

var SELECTABLE_INPUT_TYPES = {
	'email': true,
	'password': true,
	'search': true,
	'tel': true,
	'text': true,
	'url': true
};

module.exports = _reactAddons2['default'].createClass({
	displayName: 'LabelInput',

	propTypes: {
		alignTop: _reactAddons2['default'].PropTypes.bool,
		children: _reactAddons2['default'].PropTypes.node,
		className: _reactAddons2['default'].PropTypes.string,
		disabled: _reactAddons2['default'].PropTypes.bool,
		label: _reactAddons2['default'].PropTypes.string,
		readOnly: _reactAddons2['default'].PropTypes.bool,
		value: _reactAddons2['default'].PropTypes.string
	},

	getDefaultProps: function getDefaultProps() {
		return {
			readOnly: false
		};
	},

	moveCursorToEnd: function moveCursorToEnd() {
		var target = this.refs.focusTarget.getDOMNode();
		var endOfString = target.value.length;

		console.count('focus ' + target.type);

		if (SELECTABLE_INPUT_TYPES.hasOwnProperty(target.type)) {
			target.setSelectionRange(endOfString, endOfString);
		}
	},

	handleFocus: function handleFocus() {
		this.moveCursorToEnd();

		if (this.props.onFocus) {
			this.props.onFocus();
		}
	},

	render: function render() {
		var indentifiedByUserInput = this.props.id || this.props.htmlFor;

		var inputProps = (0, _blacklist2['default'])(this.props, 'alignTop', 'children', 'first', 'readOnly');
		var renderInput = this.props.readOnly ? _reactAddons2['default'].createElement(
			'div',
			{ className: "field u-selectable" },
			this.props.value
		) : _reactAddons2['default'].createElement('input', _extends({ ref: "focusTarget", className: "field", type: "text" }, inputProps));

		return _reactAddons2['default'].createElement(
			_Item2['default'],
			{ alignTop: this.props.alignTop, selectable: this.props.disabled, className: this.props.className, component: "label" },
			_reactAddons2['default'].createElement(
				_ItemInner2['default'],
				null,
				_reactAddons2['default'].createElement(
					_reactTappable2['default'],
					{ onTap: this.handleFocus, className: "FieldLabel" },
					this.props.label
				),
				_reactAddons2['default'].createElement(
					_FieldControl2['default'],
					null,
					renderInput,
					this.props.children
				)
			)
		);
	}
});
},{"./FieldControl":19,"./FieldLabel":20,"./Item":27,"./ItemInner":29,"blacklist":48,"react-tappable":6,"react/addons":undefined}],35:[function(require,module,exports){
'use strict';

var FieldControl = require('./FieldControl');
var FieldLabel = require('./FieldLabel');
var Item = require('./Item');
var ItemInner = require('./ItemInner');
var React = require('react/addons');

module.exports = React.createClass({
	displayName: 'LabelSelect',
	propTypes: {
		alignTop: React.PropTypes.bool,
		className: React.PropTypes.string,
		disabled: React.PropTypes.bool,
		first: React.PropTypes.bool,
		label: React.PropTypes.string,
		options: React.PropTypes.array,
		value: React.PropTypes.string,
		onChange: React.PropTypes.func.isRequired
	},

	getDefaultProps: function getDefaultProps() {
		return {
			className: ''
		};
	},

	getInitialState: function getInitialState() {
		return {
			value: this.props.value
		};
	},

	//updateInputValue: function updateInputValue(event) {
	//	this.setState({
	//		value: event.target.value
	//	});
	//},

	render: function render() {
		// Map Options
		var options = this.props.options.map(function (op) {
			return React.createElement(
				'option',
				{ key: 'option-' + op.value, value: op.value },
				op.label
			);
		});

		return React.createElement(
			Item,
			{ alignTop: this.props.alignTop, selectable: this.props.disabled, className: this.props.className, component: "label" },
			React.createElement(
				ItemInner,
				null,
				React.createElement(
					FieldLabel,
					null,
					this.props.label
				),
				React.createElement(
					FieldControl,
					null,
					React.createElement(
						'select',
						{ value: this.props.value, onChange: this.props.onChange, className: "select-field" },
						options
					),
					React.createElement(
						'div',
						{ className: "select-field-indicator" },
						React.createElement('div', { className: "select-field-indicator-arrow" })
					)
				)
			)
		);
	}
});
},{"./FieldControl":19,"./FieldLabel":20,"./Item":27,"./ItemInner":29,"react/addons":undefined}],36:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var blacklist = require('blacklist');
var classnames = require('classnames');
var React = require('react/addons');

module.exports = React.createClass({
	displayName: 'LabelTextarea',

	propTypes: {
		children: React.PropTypes.node,
		className: React.PropTypes.string,
		disabled: React.PropTypes.bool,
		first: React.PropTypes.bool,
		label: React.PropTypes.string,
		readOnly: React.PropTypes.bool,
		value: React.PropTypes.string
	},

	getDefaultProps: function getDefaultProps() {
		return {
			rows: 3
		};
	},

	render: function render() {
		var className = classnames(this.props.className, 'list-item', 'field-item', 'align-top', {
			'is-first': this.props.first,
			'u-selectable': this.props.disabled
		});

		var props = blacklist(this.props, 'children', 'className', 'disabled', 'first', 'label', 'readOnly');

		var renderInput = this.props.readOnly ? React.createElement(
			'div',
			{ className: "field u-selectable" },
			this.props.value
		) : React.createElement('textarea', _extends({}, props, { className: "field" }));

		return React.createElement(
			'div',
			{ className: className },
			React.createElement(
				'label',
				{ className: "item-inner" },
				React.createElement(
					'div',
					{ className: "field-label" },
					this.props.label
				),
				React.createElement(
					'div',
					{ className: "field-control" },
					renderInput,
					this.props.children
				)
			)
		);
	}
});
},{"blacklist":48,"classnames":1,"react/addons":undefined}],37:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');

var blacklist = require('blacklist');
var classNames = require('classnames');

module.exports = React.createClass({
	displayName: 'ListHeader',

	propTypes: {
		className: React.PropTypes.string,
		sticky: React.PropTypes.bool
	},

	render: function render() {
		var className = classNames('list-header', {
			'sticky': this.props.sticky
		}, this.props.className);

		var props = blacklist(this.props, 'sticky');

		return React.createElement('div', _extends({ className: className }, props));
	}
});
},{"blacklist":48,"classnames":1,"react":undefined}],38:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var classNames = require('classnames');
var React = require('react/addons');
var Tappable = require('react-tappable');
var Transition = React.addons.CSSTransitionGroup;

var DIRECTIONS = {
	'reveal-from-right': -1,
	'show-from-left': -1,
	'show-from-right': 1,
	'reveal-from-left': 1
};

var defaultControllerState = {
	direction: 0,
	fade: false,
	leftArrow: false,
	leftButtonDisabled: false,
	leftIcon: '',
	leftLabel: '',
	leftAction: null,
	rightArrow: false,
	rightButtonDisabled: false,
	rightIcon: '',
	rightLabel: '',
	rightAction: null,
	title: ''
};

function newState(from) {
	var ns = _extends({}, defaultControllerState);
	if (from) _extends(ns, from);
	delete ns.name; // may leak from props
	return ns;
}

var NavigationBar = React.createClass({
	displayName: 'NavigationBar',

	contextTypes: {
		app: React.PropTypes.object
	},

	propTypes: {
		name: React.PropTypes.string
	},

	getInitialState: function getInitialState() {
		return newState(this.props);
	},

	componentDidMount: function componentDidMount() {
		if (this.props.name) {
			this.context.app.navigationBars[this.props.name] = this;
		}
	},

	componentWillUnmount: function componentWillUnmount() {
		if (this.props.name) {
			delete this.context.app.navigationBars[this.props.name];
		}
	},

	componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
		this.setState(newState(nextProps));
		if (nextProps.name !== this.props.name) {
			if (nextProps.name) {
				this.context.app.navigationBars[nextProps.name] = this;
			}
			if (this.props.name) {
				delete this.context.app.navigationBars[this.props.name];
			}
		}
	},

	update: function update(state) {
		// FIXME: what is happening here
		state = newState(state);
		this.setState(newState(state));
	},

	updateWithTransition: function updateWithTransition(state, transition) {
		state = newState(state);
		state.direction = DIRECTIONS[transition] || 0;

		if (transition === 'fade' || transition === 'fade-contract' || transition === 'fade-expand') {
			state.fade = true;
		}

		this.setState(state);
	},

	renderLeftButton: function renderLeftButton() {
		var className = classNames('NavigationBarLeftButton', {
			'has-arrow': this.state.leftArrow
		});

		return React.createElement(
			Tappable,
			{ onTap: this.state.leftAction, className: className, disabled: this.state.leftButtonDisabled, component: "button" },
			this.renderLeftArrow(),
			this.renderLeftLabel()
		);
	},

	renderLeftArrow: function renderLeftArrow() {
		var transitionName = 'NavigationBarTransition-Instant';
		if (this.state.fade || this.state.direction) {
			transitionName = 'NavigationBarTransition-Fade';
		}

		var arrow = this.state.leftArrow ? React.createElement('span', { className: "NavigationBarLeftArrow" }) : null;

		return React.createElement(
			Transition,
			{ transitionName: transitionName },
			arrow
		);
	},

	renderLeftLabel: function renderLeftLabel() {
		var transitionName = 'NavigationBarTransition-Instant';
		if (this.state.fade) {
			transitionName = 'NavigationBarTransition-Fade';
		} else if (this.state.direction > 0) {
			transitionName = 'NavigationBarTransition-Forwards';
		} else if (this.state.direction < 0) {
			transitionName = 'NavigationBarTransition-Backwards';
		}

		return React.createElement(
			Transition,
			{ transitionName: transitionName },
			React.createElement(
				'span',
				{ key: Date.now(), className: "NavigationBarLeftLabel" },
				this.state.leftLabel
			)
		);
	},

	renderTitle: function renderTitle() {
		var title = this.state.title ? React.createElement(
			'span',
			{ key: Date.now(), className: "NavigationBarTitle" },
			this.state.title
		) : null;
		var transitionName = 'NavigationBarTransition-Instant';
		if (this.state.fade) {
			transitionName = 'NavigationBarTransition-Fade';
		} else if (this.state.direction > 0) {
			transitionName = 'NavigationBarTransition-Forwards';
		} else if (this.state.direction < 0) {
			transitionName = 'NavigationBarTransition-Backwards';
		}

		return React.createElement(
			Transition,
			{ transitionName: transitionName },
			title
		);
	},

	renderRightButton: function renderRightButton() {
		var transitionName = 'NavigationBarTransition-Instant';
		if (this.state.fade || this.state.direction) {
			transitionName = 'NavigationBarTransition-Fade';
		}
		var button = this.state.rightIcon || this.state.rightLabel ? React.createElement(
			Tappable,
			{ key: Date.now(), onTap: this.state.rightAction, className: "NavigationBarRightButton", disabled: this.state.rightButtonDisabled, component: "button" },
			this.renderRightLabel(),
			this.renderRightIcon()
		) : null;
		return React.createElement(
			Transition,
			{ transitionName: transitionName },
			button
		);
	},

	renderRightIcon: function renderRightIcon() {
		if (!this.state.rightIcon) return null;

		var className = classNames('NavigationBarRightIcon', this.state.rightIcon);

		return React.createElement('span', { className: className });
	},

	renderRightLabel: function renderRightLabel() {
		return this.state.rightLabel ? React.createElement(
			'span',
			{ key: Date.now(), className: "NavigationBarRightLabel" },
			this.state.rightLabel
		) : null;
	},

	render: function render() {
		return React.createElement(
			'div',
			{ className: "NavigationBar" },
			this.renderLeftButton(),
			this.renderTitle(),
			this.renderRightButton()
		);
	}
});

exports['default'] = NavigationBar;
module.exports = exports['default'];
},{"classnames":1,"react-tappable":6,"react/addons":undefined}],39:[function(require,module,exports){
'use strict';

var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var classnames = require('classnames');

module.exports = React.createClass({
	displayName: 'Popup',

	propTypes: {
		children: React.PropTypes.node,
		className: React.PropTypes.string,
		visible: React.PropTypes.bool
	},

	getDefaultProps: function getDefaultProps() {
		return {
			transition: 'none'
		};
	},

	renderBackdrop: function renderBackdrop() {
		if (!this.props.visible) return null;
		return React.createElement('div', { className: "Popup-backdrop" });
	},

	renderDialog: function renderDialog() {
		if (!this.props.visible) return null;

		// Set classnames
		var dialogClassName = classnames('Popup-dialog', this.props.className);

		return React.createElement(
			'div',
			{ className: dialogClassName },
			this.props.children
		);
	},

	render: function render() {
		return React.createElement(
			'div',
			{ className: "Popup" },
			React.createElement(
				ReactCSSTransitionGroup,
				{ transitionName: "Popup-dialog", component: "div" },
				this.renderDialog()
			),
			React.createElement(
				ReactCSSTransitionGroup,
				{ transitionName: "Popup-background", component: "div" },
				this.renderBackdrop()
			)
		);
	}
});
},{"classnames":1,"react/addons":undefined}],40:[function(require,module,exports){
'use strict';

var React = require('react/addons');
var classNames = require('classnames');

module.exports = React.createClass({
	displayName: 'PopupIcon',
	propTypes: {
		name: React.PropTypes.string,
		type: React.PropTypes.oneOf(['default', 'muted', 'primary', 'success', 'warning', 'danger']),
		spinning: React.PropTypes.bool
	},

	render: function render() {
		var className = classNames('PopupIcon', {
			'is-spinning': this.props.spinning
		}, this.props.name, this.props.type);

		return React.createElement('div', { className: className });
	}
});
},{"classnames":1,"react/addons":undefined}],41:[function(require,module,exports){
'use strict';

var classnames = require('classnames');
var Item = require('./Item');
var ItemInner = require('./ItemInner');
var ItemNote = require('./ItemNote');
var ItemTitle = require('./ItemTitle');
var React = require('react');
var Tappable = require('react-tappable');

module.exports = React.createClass({
	displayName: 'RadioList',

	propTypes: {
		options: React.PropTypes.array.isRequired,
		value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
		icon: React.PropTypes.string,
		onChange: React.PropTypes.func
	},

	onChange: function onChange(value) {
		this.props.onChange(value);
	},

	render: function render() {
		var self = this;
		var options = this.props.options.map(function (op, i) {
			var iconClassname = classnames('item-icon primary', op.icon);
			var checkMark = op.value === self.props.value ? React.createElement(ItemNote, { type: "primary", icon: "ion-checkmark" }) : null;
			var icon = op.icon ? React.createElement(
				'div',
				{ className: "item-media" },
				React.createElement('span', { className: iconClassname })
			) : null;

			function onChange() {
				self.onChange(op.value);
			}

			return React.createElement(
				Tappable,
				{ key: 'option-' + i, onTap: onChange },
				React.createElement(
					Item,
					{ key: 'option-' + i, onTap: onChange },
					icon,
					React.createElement(
						ItemInner,
						null,
						React.createElement(
							ItemTitle,
							null,
							op.label
						),
						checkMark
					)
				)
			);
		});

		return React.createElement(
			'div',
			null,
			options
		);
	}
});
},{"./Item":27,"./ItemInner":29,"./ItemNote":31,"./ItemTitle":33,"classnames":1,"react":undefined,"react-tappable":6}],42:[function(require,module,exports){
'use strict';

var blacklist = require('blacklist');
var classnames = require('classnames');
var React = require('react/addons');
var Tappable = require('react-tappable');

module.exports = React.createClass({
	displayName: 'SearchField',
	propTypes: {
		className: React.PropTypes.string,
		onChange: React.PropTypes.func,
		onClear: React.PropTypes.func,
		placeholder: React.PropTypes.string,
		type: React.PropTypes.oneOf(['default', 'dark']),
		value: React.PropTypes.string
	},

	getInitialState: function getInitialState() {
		return {
			isFocused: false
		};
	},

	getDefaultProps: function getDefaultProps() {
		return {
			type: 'default',
			value: ''
		};
	},

	handleClear: function handleClear() {
		this.refs.input.getDOMNode().focus();
		this.props.onClear();
	},

	handleCancel: function handleCancel() {
		this.refs.input.getDOMNode().blur();
		this.props.onCancel();
	},

	handleChange: function handleChange(e) {
		this.props.onChange(e.target.value);
	},

	handleBlur: function handleBlur(e) {
		this.setState({
			isFocused: false
		});
	},

	handleFocus: function handleFocus(e) {
		this.setState({
			isFocused: true
		});
	},

	handleSubmit: function handleSubmit(e) {
		e.preventDefault();

		var input = this.refs.input.getDOMNode();

		input.blur();
		this.props.onSubmit(input.value);
	},

	renderClear: function renderClear() {
		if (!this.props.value.length) return;
		return React.createElement(Tappable, { className: "SearchField__icon SearchField__icon--clear", onTap: this.handleClear });
	},

	renderCancel: function renderCancel() {
		var className = classnames('SearchField__cancel', {
			'is-visible': this.state.isFocused || this.props.value
		});
		return React.createElement(
			Tappable,
			{ className: className, onTap: this.handleCancel },
			'Cancel'
		);
	},

	render: function render() {
		var className = classnames('SearchField', 'SearchField--' + this.props.type, {
			'is-focused': this.state.isFocused,
			'has-value': this.props.value
		}, this.props.className);
		var props = blacklist(this.props, 'className', 'placeholder', 'type');

		return React.createElement(
			'form',
			{ onSubmit: this.handleSubmit, action: "javascript:;", className: className },
			React.createElement(
				'label',
				{ className: "SearchField__field" },
				React.createElement(
					'div',
					{ className: "SearchField__placeholder" },
					React.createElement('span', { className: "SearchField__icon SearchField__icon--search" }),
					!this.props.value.length ? this.props.placeholder : null
				),
				React.createElement('input', { type: "search", ref: "input", value: this.props.value, onChange: this.handleChange, onFocus: this.handleFocus, onBlur: this.handleBlur, className: "SearchField__input" }),
				this.renderClear()
			),
			this.renderCancel()
		);
	}
});
},{"blacklist":48,"classnames":1,"react-tappable":6,"react/addons":undefined}],43:[function(require,module,exports){
'use strict';

var React = require('react');
var classnames = require('classnames');
var Tappable = require('react-tappable');

module.exports = React.createClass({
	displayName: 'SegmentedControl',

	propTypes: {
		className: React.PropTypes.string,
		equalWidthSegments: React.PropTypes.bool,
		isInline: React.PropTypes.bool,
		hasGutter: React.PropTypes.bool,
		onChange: React.PropTypes.func.isRequired,
		options: React.PropTypes.array.isRequired,
		type: React.PropTypes.string,
		value: React.PropTypes.string
	},

	getDefaultProps: function getDefaultProps() {
		return {
			type: 'primary'
		};
	},

	onChange: function onChange(value) {
		this.props.onChange(value);
	},

	render: function render() {
		var componentClassName = classnames('SegmentedControl', 'SegmentedControl--' + this.props.type, {
			'SegmentedControl--inline': this.props.isInline,
			'SegmentedControl--has-gutter': this.props.hasGutter,
			'SegmentedControl--equal-widths': this.props.equalWidthSegments
		}, this.props.className);
		var self = this;

		var options = this.props.options.map(function (op) {
			function onChange() {
				self.onChange(op.value);
			}

			var itemClassName = classnames('SegmentedControl__item', {
				'is-selected': op.value === self.props.value
			});

			return React.createElement(
				Tappable,
				{ key: 'option-' + op.value, onTap: onChange, className: itemClassName },
				op.label
			);
		});

		return React.createElement(
			'div',
			{ className: componentClassName },
			options
		);
	}
});
},{"classnames":1,"react":undefined,"react-tappable":6}],44:[function(require,module,exports){
'use strict';

var classnames = require('classnames');
var React = require('react');
var Tappable = require('react-tappable');

module.exports = React.createClass({
	displayName: 'Switch',

	propTypes: {
		disabled: React.PropTypes.bool,
		on: React.PropTypes.bool,
		onTap: React.PropTypes.func,
		type: React.PropTypes.string
	},

	getDefaultProps: function getDefaultProps() {
		return {
			type: 'default'
		};
	},

	render: function render() {
		var className = classnames('Switch', 'Switch--' + this.props.type, {
			'is-disabled': this.props.disabled,
			'is-on': this.props.on
		});

		return React.createElement(
			Tappable,
			{ onTap: this.props.onTap, className: className, component: "label" },
			React.createElement(
				'div',
				{ className: "Switch__track" },
				React.createElement('div', { className: "Switch__handle" })
			)
		);
	}
});
},{"classnames":1,"react":undefined,"react-tappable":6}],45:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var Tappable = require('react-tappable');

var blacklist = require('blacklist');
var classnames = require('classnames');

var Navigator = React.createClass({
	displayName: 'Navigator',

	propTypes: {
		className: React.PropTypes.string
	},

	render: function render() {
		var className = classnames('Tabs-Navigator', this.props.className);
		var otherProps = blacklist(this.props, 'className');

		return React.createElement('div', _extends({ className: className }, otherProps));
	}
});

exports.Navigator = Navigator;
var Tab = React.createClass({
	displayName: 'Tab',

	propTypes: {
		selected: React.PropTypes.bool
	},

	render: function render() {
		var className = classnames('Tabs-Tab', { 'is-selected': this.props.selected });
		var otherProps = blacklist(this.props, 'selected');

		return React.createElement(Tappable, _extends({ className: className }, otherProps));
	}
});

exports.Tab = Tab;
var Label = React.createClass({
	displayName: 'Label',

	render: function render() {
		return React.createElement('div', _extends({ className: "Tabs-Label" }, this.props));
	}
});
exports.Label = Label;
},{"blacklist":48,"classnames":1,"react":undefined,"react-tappable":6}],46:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react/addons');

var Item = require('./Item');
var ItemContent = require('./ItemContent');
var ItemInner = require('./ItemInner');

var blacklist = require('blacklist');

module.exports = React.createClass({
	displayName: 'Input',
	propTypes: {
		className: React.PropTypes.string,
		children: React.PropTypes.node,
		disabled: React.PropTypes.bool
	},

	render: function render() {
		var inputProps = blacklist(this.props, 'children', 'className');

		return React.createElement(
			Item,
			{ selectable: this.props.disabled, className: this.props.className, component: "label" },
			React.createElement(
				ItemInner,
				null,
				React.createElement(
					ItemContent,
					{ component: "label" },
					React.createElement('textarea', _extends({ className: "field", rows: 3 }, inputProps))
				),
				this.props.children
			)
		);
	}
});
},{"./Item":27,"./ItemContent":28,"./ItemInner":29,"blacklist":48,"react/addons":undefined}],47:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var Alertbar = require('./Alertbar');
exports.Alertbar = Alertbar;
var Button = require('./Button');
exports.Button = Button;
var ButtonGroup = require('./ButtonGroup');
exports.ButtonGroup = ButtonGroup;
var FieldControl = require('./FieldControl');
exports.FieldControl = FieldControl;
var FieldLabel = require('./FieldLabel');
exports.FieldLabel = FieldLabel;
var Group = require('./Group');
exports.Group = Group;
var GroupBody = require('./GroupBody');
exports.GroupBody = GroupBody;
var GroupFooter = require('./GroupFooter');
exports.GroupFooter = GroupFooter;
var GroupHeader = require('./GroupHeader');
exports.GroupHeader = GroupHeader;
var GroupInner = require('./GroupInner');
exports.GroupInner = GroupInner;
var Item = require('./Item');
exports.Item = Item;
var ItemContent = require('./ItemContent');
exports.ItemContent = ItemContent;
var ItemInner = require('./ItemInner');
exports.ItemInner = ItemInner;
var ItemMedia = require('./ItemMedia');
exports.ItemMedia = ItemMedia;
var ItemNote = require('./ItemNote');
exports.ItemNote = ItemNote;
var ItemSubTitle = require('./ItemSubTitle');
exports.ItemSubTitle = ItemSubTitle;
var ItemTitle = require('./ItemTitle');
exports.ItemTitle = ItemTitle;
var LabelInput = require('./LabelInput');
exports.LabelInput = LabelInput;
var LabelSelect = require('./LabelSelect');
exports.LabelSelect = LabelSelect;
var LabelTextarea = require('./LabelTextarea');
exports.LabelTextarea = LabelTextarea;
var ListHeader = require('./ListHeader');
exports.ListHeader = ListHeader;
var NavigationBar = require('./NavigationBar');
exports.NavigationBar = NavigationBar;
var Popup = require('./Popup');
exports.Popup = Popup;
var PopupIcon = require('./PopupIcon');
exports.PopupIcon = PopupIcon;
var RadioList = require('./RadioList');
exports.RadioList = RadioList;
var SearchField = require('./SearchField');
exports.SearchField = SearchField;
var SegmentedControl = require('./SegmentedControl');
exports.SegmentedControl = SegmentedControl;
var Switch = require('./Switch');
exports.Switch = Switch;
var Tabs = require('./Tabs');
exports.Tabs = Tabs;
var Textarea = require('./Textarea');

// depends on above
exports.Textarea = Textarea;
var Input = require('./Input');
exports.Input = Input;
},{"./Alertbar":16,"./Button":17,"./ButtonGroup":18,"./FieldControl":19,"./FieldLabel":20,"./Group":21,"./GroupBody":22,"./GroupFooter":23,"./GroupHeader":24,"./GroupInner":25,"./Input":26,"./Item":27,"./ItemContent":28,"./ItemInner":29,"./ItemMedia":30,"./ItemNote":31,"./ItemSubTitle":32,"./ItemTitle":33,"./LabelInput":34,"./LabelSelect":35,"./LabelTextarea":36,"./ListHeader":37,"./NavigationBar":38,"./Popup":39,"./PopupIcon":40,"./RadioList":41,"./SearchField":42,"./SegmentedControl":43,"./Switch":44,"./Tabs":45,"./Textarea":46}],48:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"dup":4}],49:[function(require,module,exports){
/**
 * Tween.js - Licensed under the MIT license
 * https://github.com/sole/tween.js
 * ----------------------------------------------
 *
 * See https://github.com/sole/tween.js/graphs/contributors for the full list of contributors.
 * Thank you all, you're awesome!
 */

// Date.now shim for (ahem) Internet Explo(d|r)er
if ( Date.now === undefined ) {

	Date.now = function () {

		return new Date().valueOf();

	};

}

var TWEEN = TWEEN || ( function () {

	var _tweens = [];

	return {

		REVISION: '14',

		getAll: function () {

			return _tweens;

		},

		removeAll: function () {

			_tweens = [];

		},

		add: function ( tween ) {

			_tweens.push( tween );

		},

		remove: function ( tween ) {

			var i = _tweens.indexOf( tween );

			if ( i !== -1 ) {

				_tweens.splice( i, 1 );

			}

		},

		update: function ( time ) {

			if ( _tweens.length === 0 ) return false;

			var i = 0;

			time = time !== undefined ? time : ( typeof window !== 'undefined' && window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now() );

			while ( i < _tweens.length ) {

				if ( _tweens[ i ].update( time ) ) {

					i++;

				} else {

					_tweens.splice( i, 1 );

				}

			}

			return true;

		}
	};

} )();

TWEEN.Tween = function ( object ) {

	var _object = object;
	var _valuesStart = {};
	var _valuesEnd = {};
	var _valuesStartRepeat = {};
	var _duration = 1000;
	var _repeat = 0;
	var _yoyo = false;
	var _isPlaying = false;
	var _reversed = false;
	var _delayTime = 0;
	var _startTime = null;
	var _easingFunction = TWEEN.Easing.Linear.None;
	var _interpolationFunction = TWEEN.Interpolation.Linear;
	var _chainedTweens = [];
	var _onStartCallback = null;
	var _onStartCallbackFired = false;
	var _onUpdateCallback = null;
	var _onCompleteCallback = null;
	var _onStopCallback = null;

	// Set all starting values present on the target object
	for ( var field in object ) {

		_valuesStart[ field ] = parseFloat(object[field], 10);

	}

	this.to = function ( properties, duration ) {

		if ( duration !== undefined ) {

			_duration = duration;

		}

		_valuesEnd = properties;

		return this;

	};

	this.start = function ( time ) {

		TWEEN.add( this );

		_isPlaying = true;

		_onStartCallbackFired = false;

		_startTime = time !== undefined ? time : ( typeof window !== 'undefined' && window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now() );
		_startTime += _delayTime;

		for ( var property in _valuesEnd ) {

			// check if an Array was provided as property value
			if ( _valuesEnd[ property ] instanceof Array ) {

				if ( _valuesEnd[ property ].length === 0 ) {

					continue;

				}

				// create a local copy of the Array with the start value at the front
				_valuesEnd[ property ] = [ _object[ property ] ].concat( _valuesEnd[ property ] );

			}

			_valuesStart[ property ] = _object[ property ];

			if( ( _valuesStart[ property ] instanceof Array ) === false ) {
				_valuesStart[ property ] *= 1.0; // Ensures we're using numbers, not strings
			}

			_valuesStartRepeat[ property ] = _valuesStart[ property ] || 0;

		}

		return this;

	};

	this.stop = function () {

		if ( !_isPlaying ) {
			return this;
		}

		TWEEN.remove( this );
		_isPlaying = false;

		if ( _onStopCallback !== null ) {

			_onStopCallback.call( _object );

		}

		this.stopChainedTweens();
		return this;

	};

	this.stopChainedTweens = function () {

		for ( var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++ ) {

			_chainedTweens[ i ].stop();

		}

	};

	this.delay = function ( amount ) {

		_delayTime = amount;
		return this;

	};

	this.repeat = function ( times ) {

		_repeat = times;
		return this;

	};

	this.yoyo = function( yoyo ) {

		_yoyo = yoyo;
		return this;

	};


	this.easing = function ( easing ) {

		_easingFunction = easing;
		return this;

	};

	this.interpolation = function ( interpolation ) {

		_interpolationFunction = interpolation;
		return this;

	};

	this.chain = function () {

		_chainedTweens = arguments;
		return this;

	};

	this.onStart = function ( callback ) {

		_onStartCallback = callback;
		return this;

	};

	this.onUpdate = function ( callback ) {

		_onUpdateCallback = callback;
		return this;

	};

	this.onComplete = function ( callback ) {

		_onCompleteCallback = callback;
		return this;

	};

	this.onStop = function ( callback ) {

		_onStopCallback = callback;
		return this;

	};

	this.update = function ( time ) {

		var property;

		if ( time < _startTime ) {

			return true;

		}

		if ( _onStartCallbackFired === false ) {

			if ( _onStartCallback !== null ) {

				_onStartCallback.call( _object );

			}

			_onStartCallbackFired = true;

		}

		var elapsed = ( time - _startTime ) / _duration;
		elapsed = elapsed > 1 ? 1 : elapsed;

		var value = _easingFunction( elapsed );

		for ( property in _valuesEnd ) {

			var start = _valuesStart[ property ] || 0;
			var end = _valuesEnd[ property ];

			if ( end instanceof Array ) {

				_object[ property ] = _interpolationFunction( end, value );

			} else {

				// Parses relative end values with start as base (e.g.: +10, -3)
				if ( typeof(end) === "string" ) {
					end = start + parseFloat(end, 10);
				}

				// protect against non numeric properties.
				if ( typeof(end) === "number" ) {
					_object[ property ] = start + ( end - start ) * value;
				}

			}

		}

		if ( _onUpdateCallback !== null ) {

			_onUpdateCallback.call( _object, value );

		}

		if ( elapsed == 1 ) {

			if ( _repeat > 0 ) {

				if( isFinite( _repeat ) ) {
					_repeat--;
				}

				// reassign starting values, restart by making startTime = now
				for( property in _valuesStartRepeat ) {

					if ( typeof( _valuesEnd[ property ] ) === "string" ) {
						_valuesStartRepeat[ property ] = _valuesStartRepeat[ property ] + parseFloat(_valuesEnd[ property ], 10);
					}

					if (_yoyo) {
						var tmp = _valuesStartRepeat[ property ];
						_valuesStartRepeat[ property ] = _valuesEnd[ property ];
						_valuesEnd[ property ] = tmp;
					}

					_valuesStart[ property ] = _valuesStartRepeat[ property ];

				}

				if (_yoyo) {
					_reversed = !_reversed;
				}

				_startTime = time + _delayTime;

				return true;

			} else {

				if ( _onCompleteCallback !== null ) {

					_onCompleteCallback.call( _object );

				}

				for ( var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++ ) {

					_chainedTweens[ i ].start( time );

				}

				return false;

			}

		}

		return true;

	};

};


TWEEN.Easing = {

	Linear: {

		None: function ( k ) {

			return k;

		}

	},

	Quadratic: {

		In: function ( k ) {

			return k * k;

		},

		Out: function ( k ) {

			return k * ( 2 - k );

		},

		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1 ) return 0.5 * k * k;
			return - 0.5 * ( --k * ( k - 2 ) - 1 );

		}

	},

	Cubic: {

		In: function ( k ) {

			return k * k * k;

		},

		Out: function ( k ) {

			return --k * k * k + 1;

		},

		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k;
			return 0.5 * ( ( k -= 2 ) * k * k + 2 );

		}

	},

	Quartic: {

		In: function ( k ) {

			return k * k * k * k;

		},

		Out: function ( k ) {

			return 1 - ( --k * k * k * k );

		},

		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1) return 0.5 * k * k * k * k;
			return - 0.5 * ( ( k -= 2 ) * k * k * k - 2 );

		}

	},

	Quintic: {

		In: function ( k ) {

			return k * k * k * k * k;

		},

		Out: function ( k ) {

			return --k * k * k * k * k + 1;

		},

		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k * k * k;
			return 0.5 * ( ( k -= 2 ) * k * k * k * k + 2 );

		}

	},

	Sinusoidal: {

		In: function ( k ) {

			return 1 - Math.cos( k * Math.PI / 2 );

		},

		Out: function ( k ) {

			return Math.sin( k * Math.PI / 2 );

		},

		InOut: function ( k ) {

			return 0.5 * ( 1 - Math.cos( Math.PI * k ) );

		}

	},

	Exponential: {

		In: function ( k ) {

			return k === 0 ? 0 : Math.pow( 1024, k - 1 );

		},

		Out: function ( k ) {

			return k === 1 ? 1 : 1 - Math.pow( 2, - 10 * k );

		},

		InOut: function ( k ) {

			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( ( k *= 2 ) < 1 ) return 0.5 * Math.pow( 1024, k - 1 );
			return 0.5 * ( - Math.pow( 2, - 10 * ( k - 1 ) ) + 2 );

		}

	},

	Circular: {

		In: function ( k ) {

			return 1 - Math.sqrt( 1 - k * k );

		},

		Out: function ( k ) {

			return Math.sqrt( 1 - ( --k * k ) );

		},

		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1) return - 0.5 * ( Math.sqrt( 1 - k * k) - 1);
			return 0.5 * ( Math.sqrt( 1 - ( k -= 2) * k) + 1);

		}

	},

	Elastic: {

		In: function ( k ) {

			var s, a = 0.1, p = 0.4;
			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( !a || a < 1 ) { a = 1; s = p / 4; }
			else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
			return - ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );

		},

		Out: function ( k ) {

			var s, a = 0.1, p = 0.4;
			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( !a || a < 1 ) { a = 1; s = p / 4; }
			else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
			return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 );

		},

		InOut: function ( k ) {

			var s, a = 0.1, p = 0.4;
			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( !a || a < 1 ) { a = 1; s = p / 4; }
			else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
			if ( ( k *= 2 ) < 1 ) return - 0.5 * ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
			return a * Math.pow( 2, -10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1;

		}

	},

	Back: {

		In: function ( k ) {

			var s = 1.70158;
			return k * k * ( ( s + 1 ) * k - s );

		},

		Out: function ( k ) {

			var s = 1.70158;
			return --k * k * ( ( s + 1 ) * k + s ) + 1;

		},

		InOut: function ( k ) {

			var s = 1.70158 * 1.525;
			if ( ( k *= 2 ) < 1 ) return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) );
			return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 );

		}

	},

	Bounce: {

		In: function ( k ) {

			return 1 - TWEEN.Easing.Bounce.Out( 1 - k );

		},

		Out: function ( k ) {

			if ( k < ( 1 / 2.75 ) ) {

				return 7.5625 * k * k;

			} else if ( k < ( 2 / 2.75 ) ) {

				return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;

			} else if ( k < ( 2.5 / 2.75 ) ) {

				return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;

			} else {

				return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;

			}

		},

		InOut: function ( k ) {

			if ( k < 0.5 ) return TWEEN.Easing.Bounce.In( k * 2 ) * 0.5;
			return TWEEN.Easing.Bounce.Out( k * 2 - 1 ) * 0.5 + 0.5;

		}

	}

};

TWEEN.Interpolation = {

	Linear: function ( v, k ) {

		var m = v.length - 1, f = m * k, i = Math.floor( f ), fn = TWEEN.Interpolation.Utils.Linear;

		if ( k < 0 ) return fn( v[ 0 ], v[ 1 ], f );
		if ( k > 1 ) return fn( v[ m ], v[ m - 1 ], m - f );

		return fn( v[ i ], v[ i + 1 > m ? m : i + 1 ], f - i );

	},

	Bezier: function ( v, k ) {

		var b = 0, n = v.length - 1, pw = Math.pow, bn = TWEEN.Interpolation.Utils.Bernstein, i;

		for ( i = 0; i <= n; i++ ) {
			b += pw( 1 - k, n - i ) * pw( k, i ) * v[ i ] * bn( n, i );
		}

		return b;

	},

	CatmullRom: function ( v, k ) {

		var m = v.length - 1, f = m * k, i = Math.floor( f ), fn = TWEEN.Interpolation.Utils.CatmullRom;

		if ( v[ 0 ] === v[ m ] ) {

			if ( k < 0 ) i = Math.floor( f = m * ( 1 + k ) );

			return fn( v[ ( i - 1 + m ) % m ], v[ i ], v[ ( i + 1 ) % m ], v[ ( i + 2 ) % m ], f - i );

		} else {

			if ( k < 0 ) return v[ 0 ] - ( fn( v[ 0 ], v[ 0 ], v[ 1 ], v[ 1 ], -f ) - v[ 0 ] );
			if ( k > 1 ) return v[ m ] - ( fn( v[ m ], v[ m ], v[ m - 1 ], v[ m - 1 ], f - m ) - v[ m ] );

			return fn( v[ i ? i - 1 : 0 ], v[ i ], v[ m < i + 1 ? m : i + 1 ], v[ m < i + 2 ? m : i + 2 ], f - i );

		}

	},

	Utils: {

		Linear: function ( p0, p1, t ) {

			return ( p1 - p0 ) * t + p0;

		},

		Bernstein: function ( n , i ) {

			var fc = TWEEN.Interpolation.Utils.Factorial;
			return fc( n ) / fc( i ) / fc( n - i );

		},

		Factorial: ( function () {

			var a = [ 1 ];

			return function ( n ) {

				var s = 1, i;
				if ( a[ n ] ) return a[ n ];
				for ( i = n; i > 1; i-- ) s *= i;
				return a[ n ] = s;

			};

		} )(),

		CatmullRom: function ( p0, p1, p2, p3, t ) {

			var v0 = ( p2 - p0 ) * 0.5, v1 = ( p3 - p1 ) * 0.5, t2 = t * t, t3 = t * t2;
			return ( 2 * p1 - 2 * p2 + v0 + v1 ) * t3 + ( - 3 * p1 + 3 * p2 - 2 * v0 - v1 ) * t2 + v0 * t + p1;

		}

	}

};

module.exports=TWEEN;
},{}],50:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _reactAddons = require('react/addons');

var _reactAddons2 = _interopRequireDefault(_reactAddons);

var _touchstonejs = require('touchstonejs');

// App Config
// ------------------------------

var MediaStore = require('./stores/media');
var mediaStore = new MediaStore();

var App = _reactAddons2['default'].createClass({
	displayName: 'App',

	mixins: [(0, _touchstonejs.createApp)()],

	childContextTypes: {
		mediaStore: _reactAddons2['default'].PropTypes.object
	},

	getChildContext: function getChildContext() {
		return {
			mediaStore: mediaStore
		};
	},

	render: function render() {
		var appWrapperClassName = 'app-wrapper device--' + (window.device || {}).platform;

		return _reactAddons2['default'].createElement(
			'div',
			{ className: appWrapperClassName },
			_reactAddons2['default'].createElement(
				'div',
				{ className: 'device-silhouette' },
				_reactAddons2['default'].createElement(
					_touchstonejs.ViewManager,
					{ name: 'app', defaultView: 'main' },
					_reactAddons2['default'].createElement(_touchstonejs.View, { name: 'main', component: MainViewController })
				)
			)
		);
	}
});

// Main Controller
// ------------------------------
var MainViewController = _reactAddons2['default'].createClass({
	displayName: 'MainViewController',

	render: function render() {
		return _reactAddons2['default'].createElement(
			_touchstonejs.Container,
			null,
			_reactAddons2['default'].createElement(_touchstonejs.UI.NavigationBar, { name: 'main' }),
			_reactAddons2['default'].createElement(
				_touchstonejs.ViewManager,
				{ name: 'main', defaultView: 'tabs' },
				_reactAddons2['default'].createElement(_touchstonejs.View, { name: 'tabs', component: TabViewController })
			)
		);
	}
});

// Tab View Controller
// ------------------------------

var lastSelectedTab = 'criteria';
var TabViewController = _reactAddons2['default'].createClass({
	displayName: 'TabViewController',

	onViewChange: function onViewChange(nextView) {
		lastSelectedTab = nextView;

		this.setState({
			selectedTab: nextView
		});
	},

	selectTab: function selectTab(value) {
		var viewProps = undefined;

		this.refs.listvm.transitionTo(value, {
			transition: 'instant',
			viewProps: viewProps
		});

		this.setState({
			selectedTab: value
		});
	},
	getInitialState: function getInitialState() {
		return {
			selectedTab: lastSelectedTab,
			preferences: {
				mediaType: 'song',
				numResults: '15'
			}
		};
	},
	changePreference: function changePreference(key, val) {
		this.setState(function (state) {
			state.preferences[key] = val;
			return state;
		});
	},
	render: function render() {
		var _this = this;

		var selectedTab = this.state.selectedTab;
		var selectedTabSpan = selectedTab;

		// Subviews in the stack need to show the right tab selected
		if (selectedTab === 'criteria' || selectedTab === 'media-list' || selectedTab === 'media-details' || selectedTab === 'about') {
			selectedTabSpan = 'criteria';
		} else selectedTabSpan = 'settings';

		return _reactAddons2['default'].createElement(
			_touchstonejs.Container,
			null,
			_reactAddons2['default'].createElement(
				_touchstonejs.ViewManager,
				{ ref: 'listvm', name: 'tabs', defaultView: selectedTab, onViewChange: this.onViewChange },
				_reactAddons2['default'].createElement(_touchstonejs.View, { name: 'about', component: require('./views/about') }),
				_reactAddons2['default'].createElement(_touchstonejs.View, { name: 'criteria', component: require('./views/criteria-form'), preferences: this.state.preferences }),
				_reactAddons2['default'].createElement(_touchstonejs.View, { name: 'media-list', component: require('./views/media-list') }),
				_reactAddons2['default'].createElement(_touchstonejs.View, { name: 'media-details', component: require('./views/media-details') }),
				_reactAddons2['default'].createElement(_touchstonejs.View, { name: 'settings', component: require('./views/preferences'), preferences: this.state.preferences,
					onChangePreference: function (key, val) {
						return _this.changePreference(key, val);
					} })
			),
			_reactAddons2['default'].createElement(
				_touchstonejs.UI.Tabs.Navigator,
				null,
				_reactAddons2['default'].createElement(
					_touchstonejs.UI.Tabs.Tab,
					{ onTap: this.selectTab.bind(this, 'criteria'), selected: selectedTabSpan === 'criteria' },
					_reactAddons2['default'].createElement('span', { className: 'Tabs-Icon Tabs-Icon--form' }),
					_reactAddons2['default'].createElement(
						_touchstonejs.UI.Tabs.Label,
						null,
						'Search Media'
					)
				),
				_reactAddons2['default'].createElement(
					_touchstonejs.UI.Tabs.Tab,
					{ onTap: this.selectTab.bind(this, 'settings'), selected: selectedTabSpan === 'settings' },
					_reactAddons2['default'].createElement('span', { className: 'Tabs-Icon Tabs-Icon--settings' }),
					_reactAddons2['default'].createElement(
						_touchstonejs.UI.Tabs.Label,
						null,
						'Preferences'
					)
				)
			)
		);
	}
});

function startApp() {
	// Catch-all error handling
	window.error = function (e) {
		console.log('** Error: ' + e.message);
	};

	// Handle any Cordova needs here

	// If the splash screen plugin is loaded and config.xml prefs have AutoHideSplashScreen set to false for iOS we need to
	// programatically hide it here. You could also include in a timeout if needed to load more resources or see a white screen
	// display in between splash screen and app load. Remove or change as needed. Left timeout code for reference, timeout
	// not needed in this case.

	if (navigator.splashscreen) {
		//setTimeout(function () {
		navigator.splashscreen.hide();
		//}, 1000);
	}

	_reactAddons2['default'].render(_reactAddons2['default'].createElement(App, null), document.getElementById('app'));
}

if (!window.cordova) {
	startApp();
} else {
	document.addEventListener('deviceready', startApp, false);
}

},{"./stores/media":51,"./views/about":52,"./views/criteria-form":53,"./views/media-details":54,"./views/media-list":55,"./views/preferences":56,"react/addons":undefined,"touchstonejs":13}],51:[function(require,module,exports){
"use strict";

function MediaStore() {
	this.items = [];
}
MediaStore.prototype.formatDate = function () {
	//var itemArray = res.body.results.map(r => r);

	// Post processing of the data
	this.items.forEach(function (item, i) {
		item.id = i;
		item.releaseDate = item.releaseDate.substring(0, 10); // Format the date to just show the date itself instead of GMT
	});
	return this.items;
};
module.exports = MediaStore;

},{}],52:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _reactContainer = require('react-container');

var _reactContainer2 = _interopRequireDefault(_reactContainer);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactTappable = require('react-tappable');

var _reactTappable2 = _interopRequireDefault(_reactTappable);

var _touchstonejs = require('touchstonejs');

var scrollable = _reactContainer2['default'].initScrollable();

module.exports = _react2['default'].createClass({
    displayName: 'exports',

    statics: {
        navigationBar: 'main',
        getNavigation: function getNavigation(props, app) {
            return {
                leftArrow: true,
                leftLabel: 'Back',
                leftAction: function leftAction() {
                    app.transitionTo('tabs:' + props.prevView, { transition: 'reveal-from-right' });
                },
                title: 'About'
            };
        }
    },

    openURL: function openURL() {
        var projectUrl = "http://github.com/hollyschinsky/phonegap-app-touchstonejs";
        if (!window.cordova) window.open(projectUrl);else window.open(projectUrl, "_blank");
    },

    render: function render() {
        return _react2['default'].createElement(
            _reactContainer2['default'],
            { scrollable: scrollable },
            _react2['default'].createElement(
                _touchstonejs.UI.Group,
                null,
                _react2['default'].createElement(
                    _touchstonejs.UI.GroupHeader,
                    { className: 'text-primary' },
                    'App Details'
                ),
                _react2['default'].createElement(
                    _touchstonejs.UI.ListHeader,
                    null,
                    'iTunes Media Finder'
                ),
                _react2['default'].createElement(_touchstonejs.UI.LabelInput, { readOnly: true, label: 'Version', value: '0.1.0' }),
                _react2['default'].createElement(_touchstonejs.UI.LabelInput, { readOnly: true, label: 'Date', value: 'September 2015' })
            ),
            _react2['default'].createElement(
                _touchstonejs.UI.Group,
                null,
                _react2['default'].createElement(
                    _touchstonejs.UI.GroupHeader,
                    { className: 'text-primary' },
                    'Author'
                ),
                _react2['default'].createElement(
                    _touchstonejs.UI.GroupBody,
                    null,
                    _react2['default'].createElement(
                        _touchstonejs.UI.Item,
                        null,
                        _react2['default'].createElement(
                            _touchstonejs.UI.ItemInner,
                            null,
                            _react2['default'].createElement(
                                _touchstonejs.UI.ItemContent,
                                null,
                                _react2['default'].createElement(
                                    _touchstonejs.UI.ItemTitle,
                                    null,
                                    'Holly Schinsky'
                                )
                            ),
                            _react2['default'].createElement(
                                _reactTappable2['default'],
                                { onTap: this.openURL.bind(null), stopPropagation: true },
                                _react2['default'].createElement(_touchstonejs.UI.ItemNote, { icon: 'ion-ios-star', type: 'primary', className: 'ion-lg' })
                            )
                        )
                    ),
                    _react2['default'].createElement(
                        _touchstonejs.UI.Item,
                        null,
                        _react2['default'].createElement(
                            _touchstonejs.UI.ItemInner,
                            null,
                            _react2['default'].createElement(
                                _touchstonejs.UI.ItemContent,
                                null,
                                _react2['default'].createElement(
                                    _touchstonejs.UI.ItemTitle,
                                    null,
                                    'PhoneGap Team'
                                ),
                                _react2['default'].createElement(
                                    _touchstonejs.UI.ItemSubTitle,
                                    null,
                                    'Adobe Systems, Inc'
                                )
                            )
                        )
                    )
                )
            ),
            _react2['default'].createElement(
                _touchstonejs.UI.Group,
                null,
                _react2['default'].createElement(
                    _touchstonejs.UI.GroupHeader,
                    { className: 'text-primary' },
                    'Powered By'
                ),
                _react2['default'].createElement(
                    _touchstonejs.UI.Item,
                    null,
                    _react2['default'].createElement(
                        _touchstonejs.UI.ItemInner,
                        null,
                        _react2['default'].createElement(
                            _touchstonejs.UI.ItemContent,
                            null,
                            _react2['default'].createElement('img', { src: 'img/react-logo.png', className: 'avatar' }),
                            _react2['default'].createElement('img', { src: 'img/ts-logo.png', className: 'avatar' }),
                            _react2['default'].createElement('img', { src: 'img/pg-logo.png', className: 'avatar' })
                        )
                    )
                )
            )
        );
    }
});

},{"react":undefined,"react-container":3,"react-tappable":6,"touchstonejs":13}],53:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _reactContainer = require('react-container');

var _reactContainer2 = _interopRequireDefault(_reactContainer);

var _cordovaDialogs = require('cordova-dialogs');

var _cordovaDialogs2 = _interopRequireDefault(_cordovaDialogs);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactTappable = require('react-tappable');

var _reactTappable2 = _interopRequireDefault(_reactTappable);

var _touchstonejs = require('touchstonejs');

var scrollable = _reactContainer2['default'].initScrollable();

var MEDIA_TYPES = [{ label: 'Music Video', value: 'musicVideo' }, { label: 'Song', value: 'song' }, { label: 'Movie', value: 'movie' }];
var RESULTS = [{ label: '15', value: '15' }, { label: '25', value: '25' }, { label: '50', value: '50' }];

module.exports = _react2['default'].createClass({
	displayName: 'exports',

	contextTypes: { mediaStore: _react2['default'].PropTypes.object.isRequired, app: _react2['default'].PropTypes.object },
	statics: {
		navigationBar: 'main',
		getNavigation: function getNavigation(props, app) {
			return {
				title: 'Search Criteria',
				leftArrow: false,
				rightAction: function rightAction() {
					app.transitionTo('tabs:about', { transition: 'fade-expand', viewProps: { prevView: 'criteria' } });
				},
				rightIcon: 'ion-information-circled'
			};
		}
	},

	getInitialState: function getInitialState() {
		return {
			mediaType: this.props.preferences.mediaType,
			numResults: this.props.preferences.numResults,
			searchTerm: 'Pink'
		};
	},

	handleResultsChange: function handleResultsChange(key, newValue) {
		var newState = {};
		newState[key] = newValue;
		this.setState(newState);
	},

	handleTypeChange: function handleTypeChange(key, event) {
		this.state.mediaType = event.target.value;
		event.stopPropagation(); // won't stay selected if I don't stop it from propagated - may be bug in LabelSelect
	},

	handleSearchTermChange: function handleSearchTermChange(key, event) {
		var newState = {};
		newState[key] = event.target.value;
		this.setState(newState);
	},

	showResults: function showResults() {
		this.context.app.transitionTo('tabs:media-list', { transition: 'show-from-right', viewProps: { prevView: 'criteria', mediaType: this.state.mediaType, searchTerm: this.state.searchTerm,
				numResults: this.state.numResults } });
	},

	render: function render() {
		return _react2['default'].createElement(
			_reactContainer2['default'],
			{ scrollable: scrollable },
			_react2['default'].createElement(
				_touchstonejs.UI.Group,
				null,
				_react2['default'].createElement(
					_touchstonejs.UI.GroupHeader,
					null,
					'Search Criteria'
				),
				_react2['default'].createElement(
					_touchstonejs.UI.GroupBody,
					null,
					_react2['default'].createElement(_touchstonejs.UI.LabelSelect, { label: 'Type', onChange: this.handleTypeChange.bind(this, 'mediaType'), value: this.state.mediaType, options: MEDIA_TYPES }),
					_react2['default'].createElement(_touchstonejs.UI.LabelInput, { label: 'Search for', value: this.state.searchTerm, placeholder: 'search term', onChange: this.handleSearchTermChange.bind(this, 'searchTerm') })
				)
			),
			_react2['default'].createElement(
				_touchstonejs.UI.Group,
				null,
				_react2['default'].createElement(
					_touchstonejs.UI.GroupHeader,
					null,
					'# Results'
				),
				_react2['default'].createElement(
					_touchstonejs.UI.GroupBody,
					null,
					_react2['default'].createElement(_touchstonejs.UI.RadioList, { value: this.state.numResults, onChange: this.handleResultsChange.bind(this, 'numResults'), options: RESULTS })
				)
			),
			_react2['default'].createElement(
				_touchstonejs.UI.Button,
				{ onTap: this.showResults, type: 'primary' },
				'Show Results'
			)
		);
	}
});

},{"cordova-dialogs":2,"react":undefined,"react-container":3,"react-tappable":6,"touchstonejs":13}],54:[function(require,module,exports){
/**
 * Created by hschinsk on 8/25/15.
 */
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _reactContainer = require('react-container');

var _reactContainer2 = _interopRequireDefault(_reactContainer);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _touchstonejs = require('touchstonejs');

var scrollable = _reactContainer2['default'].initScrollable({ left: 0, top: 44 });

module.exports = _react2['default'].createClass({
    displayName: 'exports',

    statics: {
        navigationBar: 'main',
        getNavigation: function getNavigation(props, app) {
            return {
                leftArrow: true,
                leftLabel: 'List',
                leftAction: function leftAction() {
                    app.transitionTo('tabs:' + props.prevView, { transition: 'reveal-from-right' });
                },
                title: 'Details'
            };
        }
    },

    openURL: function openURL(event) {
        var mediaUrl = this.props.item.trackViewUrl;

        if (!window.cordova) {
            window.open(mediaUrl);
        } else {
            window.open(mediaUrl, "_blank");
        }
    },

    render: function render() {
        var item = this.props.item;

        var videoVal = 'block';
        var audioVal = 'none';
        var className = "video__avatar";

        if (item.kind.indexOf('song') > -1) {
            videoVal = 'none';
            audioVal = 'block';
            className = "song__avatar";
        } else if (item.kind.indexOf('movie') > -1) {
            videoVal = 'none';
            audioVal = 'none';
            className = "movie__avatar";
        }

        return _react2['default'].createElement(
            _reactContainer2['default'],
            { ref: 'scrollContainer', scrollable: scrollable },
            _react2['default'].createElement(
                _touchstonejs.UI.Group,
                null,
                _react2['default'].createElement(
                    _touchstonejs.UI.GroupHeader,
                    { className: 'text-primary' },
                    item.kind
                ),
                _react2['default'].createElement(
                    _touchstonejs.UI.GroupBody,
                    null,
                    _react2['default'].createElement('img', { src: item.artworkUrl100, className: className }),
                    _react2['default'].createElement(_touchstonejs.UI.LabelInput, { readOnly: true, label: 'Name', value: item.trackName }),
                    _react2['default'].createElement(_touchstonejs.UI.LabelInput, { readOnly: true, label: 'Artist', value: item.artistName }),
                    _react2['default'].createElement(_touchstonejs.UI.LabelInput, { readOnly: true, label: 'Genre', value: item.primaryGenreName }),
                    _react2['default'].createElement(_touchstonejs.UI.LabelInput, { readOnly: true, label: 'Collection', value: item.collectionName }),
                    _react2['default'].createElement(_touchstonejs.UI.LabelInput, { readOnly: true, label: 'Released', value: item.releaseDate }),
                    _react2['default'].createElement(_touchstonejs.UI.LabelInput, { readOnly: true, label: 'Item Price', value: item.trackPrice != null ? item.trackPrice.toString() : item.trackPrice }),
                    _react2['default'].createElement(
                        _touchstonejs.UI.Item,
                        null,
                        _react2['default'].createElement(
                            _touchstonejs.UI.ItemInner,
                            null,
                            _react2['default'].createElement(
                                _touchstonejs.UI.FieldLabel,
                                null,
                                'Explicit?'
                            ),
                            _react2['default'].createElement(_touchstonejs.UI.Switch, { on: item.collectionExplicitness == 'explicit' })
                        )
                    ),
                    _react2['default'].createElement(
                        _touchstonejs.UI.Item,
                        { style: { display: audioVal } },
                        _react2['default'].createElement(
                            _touchstonejs.UI.ItemInner,
                            null,
                            _react2['default'].createElement(
                                'audio',
                                { controls: 'true', preload: 'auto', src: item.previewUrl },
                                '\u2028'
                            )
                        )
                    ),
                    _react2['default'].createElement(
                        _touchstonejs.UI.Item,
                        { style: { display: videoVal } },
                        '\u2028',
                        _react2['default'].createElement(
                            'video',
                            { controls: true, src: item.previewUrl, type: 'video/mp4' },
                            '\u2028'
                        ),
                        '\u2028'
                    ),
                    _react2['default'].createElement(
                        _touchstonejs.UI.Item,
                        null,
                        _react2['default'].createElement(
                            _touchstonejs.UI.ItemInner,
                            null,
                            _react2['default'].createElement(
                                _touchstonejs.UI.Button,
                                { onTap: this.openURL.bind(this, this.props.item.trackViewUrl) },
                                _react2['default'].createElement(_touchstonejs.UI.ItemNote, { label: 'Open in iTunes', icon: 'ion-share', type: 'info' })
                            )
                        )
                    )
                ),
                _react2['default'].createElement(
                    _touchstonejs.UI.GroupFooter,
                    null,
                    'Data based on the latest results from ',
                    _react2['default'].createElement(
                        'a',
                        { href: 'http://itunes.com' },
                        'iTunes'
                    )
                )
            )
        );
    }
});

},{"react":undefined,"react-container":3,"touchstonejs":13}],55:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _reactContainer = require('react-container');

var _reactContainer2 = _interopRequireDefault(_reactContainer);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactSentry = require('react-sentry');

var _reactSentry2 = _interopRequireDefault(_reactSentry);

var _reactTappable = require('react-tappable');

var _reactTappable2 = _interopRequireDefault(_reactTappable);

var _reactTimers = require('react-timers');

var _reactTimers2 = _interopRequireDefault(_reactTimers);

var _touchstonejs = require('touchstonejs');

var scrollable = _reactContainer2['default'].initScrollable({ left: 0, top: 44 });

var SimpleLinkItem = _react2['default'].createClass({
	displayName: 'SimpleLinkItem',

	propTypes: {
		item: _react2['default'].PropTypes.object.isRequired
	},

	getDefaultProps: function getDefaultProps() {
		return {
			prevView: 'media-list'
		};
	},

	render: function render() {
		var item = this.props.item;
		var className = "video__avatar_sm";

		if (item.kind.indexOf('song') > -1) className = "song__avatar_sm";else if (item.kind.indexOf('movie') > -1) className = "movie__avatar_sm";

		return _react2['default'].createElement(
			_touchstonejs.Link,
			{ to: 'tabs:media-details', transition: 'show-from-right', viewProps: { item: this.props.item, prevView: this.props.prevView } },
			_react2['default'].createElement(
				_touchstonejs.UI.Item,
				{ showDisclosureArrow: true },
				_react2['default'].createElement('img', { src: item.artworkUrl60, className: className }),
				_react2['default'].createElement(
					_touchstonejs.UI.ItemInner,
					null,
					_react2['default'].createElement(
						_touchstonejs.UI.ItemContent,
						null,
						_react2['default'].createElement(
							_touchstonejs.UI.ItemTitle,
							null,
							item.trackName
						),
						_react2['default'].createElement(
							_touchstonejs.UI.ItemSubTitle,
							null,
							item.artistName
						)
					)
				)
			)
		);
	}
});

module.exports = _react2['default'].createClass({
	displayName: 'exports',

	mixins: [(0, _reactSentry2['default'])(), (0, _reactTimers2['default'])()],
	contextTypes: { mediaStore: _react2['default'].PropTypes.object.isRequired, app: _react2['default'].PropTypes.object },
	statics: {
		navigationBar: 'main',
		getNavigation: function getNavigation(props, app) {
			return {
				leftArrow: true,
				leftLabel: 'Criteria',
				leftAction: function leftAction() {
					app.transitionTo('tabs:criteria', { transition: 'reveal-from-right', viewProps: { prevView: 'media-list' } });
				},
				title: 'Media Results'
			};
		}
	},

	componentDidMount: function componentDidMount() {
		if (this.props.prevView == 'criteria') {
			this.setState({
				popup: {
					visible: true,
					loading: true,
					header: 'Loading',
					iconName: 'ion-load-a',
					iconType: 'default'
				}
			});
			var self = this;

			// Using jsonp so we can run this in the browser without XHR issues for easier debugging
			this.jsonp("https://itunes.apple.com/search?term=" + this.props.searchTerm + "&entity=" + this.props.mediaType + "&limit=" + this.props.numResults, function (data) {
				self.setState({
					popup: {
						visible: false
					}
				});
				if (data != null) {
					self.context.mediaStore.items = data.results; // hold it in the context object for when we come back
					var items = self.context.mediaStore.formatDate();
					self.setState({ media: items });
				} else self.showAlert('danger', "An error occurred retrieving data from iTunes. Do you have an Internet connection? A valid URL?");
			});
		}
		// Coming back from details page - use the already stored results in the media store
		else this.setState({ media: this.context.mediaStore.items });
	},

	jsonp: function jsonp(url, callback) {
		var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
		window[callbackName] = function (data) {
			delete window[callbackName];
			document.body.removeChild(script);
			callback(data);
		};

		var script = document.createElement('script');
		script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
		self = this;
		script.onerror = function (err) {
			callback(null);
		};

		document.body.appendChild(script);
	},

	showAlert: function showAlert(type, text) {
		var _this = this;

		this.setState({
			alertbar: {
				visible: true,
				type: type,
				text: text
			}
		});
		this.setTimeout(function () {
			_this.setState({
				alertbar: {
					visible: false
				}
			});
		}, 3000);
	},

	getInitialState: function getInitialState() {
		return {
			filterString: '',
			media: [],
			popup: {
				visible: false
			},
			alertbar: {
				visible: false,
				type: '',
				text: ''
			}
		};
	},

	clearFilter: function clearFilter() {
		this.setState({ filterString: '' });
	},

	updateFilter: function updateFilter(str) {
		this.setState({ filterString: str });
	},

	submitFilter: function submitFilter(str) {
		console.log(str);
	},

	render: function render() {
		var _state = this.state;
		var media = _state.media;
		var filterString = _state.filterString;
		var alertbar = _state.alertbar;

		var filterRegex = new RegExp(filterString.toLowerCase());

		function mediaFilter(item) {
			return filterRegex.test(item.trackName.toLowerCase());
		};
		function sortByName(a, b) {
			return a.trackName.localeCompare(b.trackName);
		};

		var filteredMedia = media.filter(mediaFilter).sort(sortByName);

		var results = undefined;

		if (filterString && !filteredMedia.length) {
			results = _react2['default'].createElement(
				_reactContainer2['default'],
				{ direction: 'column', align: 'center', justify: 'center', className: 'no-results' },
				_react2['default'].createElement('div', { className: 'no-results__icon ion-ios-filter-strong' }),
				_react2['default'].createElement(
					'div',
					{ className: 'no-results__text' },
					'No results for "' + filterString + '"'
				)
			);
		} else {
			results = _react2['default'].createElement(
				_touchstonejs.UI.GroupBody,
				null,
				filteredMedia.map(function (item, i) {
					return _react2['default'].createElement(SimpleLinkItem, { key: 'item' + i, item: item });
				})
			);
		}

		return _react2['default'].createElement(
			_reactContainer2['default'],
			{ ref: 'scrollContainer', scrollable: scrollable },
			_react2['default'].createElement(
				_touchstonejs.UI.Alertbar,
				{ type: alertbar.type || 'default', visible: alertbar.visible, animated: true },
				alertbar.text
			),
			_react2['default'].createElement(_touchstonejs.UI.SearchField, { type: 'dark', value: this.state.filterString, onSubmit: this.submitFilter, onChange: this.updateFilter,
				onCancel: this.clearFilter, onClear: this.clearFilter, placeholder: 'Filter...' }),
			results,
			_react2['default'].createElement(
				_touchstonejs.UI.Popup,
				{ visible: this.state.popup.visible },
				_react2['default'].createElement(_touchstonejs.UI.PopupIcon, { name: this.state.popup.iconName, type: this.state.popup.iconType, spinning: this.state.popup.loading }),
				_react2['default'].createElement(
					'div',
					null,
					_react2['default'].createElement(
						'strong',
						null,
						this.state.popup.header
					)
				)
			)
		);
	}
});

},{"react":undefined,"react-container":3,"react-sentry":5,"react-tappable":6,"react-timers":7,"touchstonejs":13}],56:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _reactContainer = require('react-container');

var _reactContainer2 = _interopRequireDefault(_reactContainer);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _touchstonejs = require('touchstonejs');

var scrollable = _reactContainer2['default'].initScrollable();

var MEDIA_TYPES = [{ label: 'Music Video', value: 'musicVideo' }, { label: 'Song', value: 'song' }, { label: 'Movie', value: 'movie' }];
var RESULTS = [{ label: '15', value: '15' }, { label: '25', value: '25' }, { label: '50', value: '50' }];
module.exports = _react2['default'].createClass({
    displayName: 'exports',

    statics: {
        navigationBar: 'main',
        getNavigation: function getNavigation(props, app) {
            // This is a separate tab and view stack with just one view currently
            return {
                title: 'Preferences'
            };
        }
    },

    getInitialState: function getInitialState() {
        return {
            mediaType: this.props.preferences.mediaType,
            numResults: this.props.preferences.numResults
        };
    },

    handleResultsChange: function handleResultsChange(key, newValue) {
        var newState = {};
        newState[key] = newValue;
        this.setState(newState);
        this.props.onChangePreference(key, newValue);
    },

    handleTypeChange: function handleTypeChange(key, event) {
        this.state.mediaType = event.target.value;
        this.props.onChangePreference(key, event.target.value);
    },

    render: function render() {
        return _react2['default'].createElement(
            _reactContainer2['default'],
            { scrollable: scrollable },
            _react2['default'].createElement(
                _touchstonejs.UI.Group,
                null,
                _react2['default'].createElement(
                    _touchstonejs.UI.GroupHeader,
                    null,
                    'Preferences'
                ),
                _react2['default'].createElement(
                    _touchstonejs.UI.GroupBody,
                    null,
                    _react2['default'].createElement(_touchstonejs.UI.LabelSelect, { label: 'Media Type', value: this.state.mediaType, options: MEDIA_TYPES,
                        onChange: this.handleTypeChange.bind(this, 'mediaType') })
                )
            ),
            _react2['default'].createElement(
                _touchstonejs.UI.Group,
                null,
                _react2['default'].createElement(
                    _touchstonejs.UI.GroupHeader,
                    null,
                    '# Results'
                ),
                _react2['default'].createElement(
                    _touchstonejs.UI.GroupBody,
                    null,
                    _react2['default'].createElement(_touchstonejs.UI.RadioList, { value: this.state.numResults, onChange: this.handleResultsChange.bind(this, 'numResults'),
                        options: RESULTS })
                )
            )
        );
    }
});

},{"react":undefined,"react-container":3,"touchstonejs":13}]},{},[50])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy90b3VjaHN0b25lanMtdGFza3Mvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIm5vZGVfbW9kdWxlcy9jbGFzc25hbWVzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2NvcmRvdmEtZGlhbG9ncy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1jb250YWluZXIvbGliL0NvbnRhaW5lci5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1jb250YWluZXIvbm9kZV9tb2R1bGVzL2JsYWNrbGlzdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1zZW50cnkvbGliL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LXRhcHBhYmxlL2xpYi9UYXBwYWJsZS5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC10aW1lcnMvbGliL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3RvdWNoc3RvbmVqcy9saWIvY29yZS9FcnJvclZpZXcuanMiLCJub2RlX21vZHVsZXMvdG91Y2hzdG9uZWpzL2xpYi9jb3JlL0xpbmsuanMiLCJub2RlX21vZHVsZXMvdG91Y2hzdG9uZWpzL2xpYi9jb3JlL1ZpZXcuanMiLCJub2RlX21vZHVsZXMvdG91Y2hzdG9uZWpzL2xpYi9jb3JlL1ZpZXdNYW5hZ2VyLmpzIiwibm9kZV9tb2R1bGVzL3RvdWNoc3RvbmVqcy9saWIvY29yZS9hbmltYXRpb24uanMiLCJub2RlX21vZHVsZXMvdG91Y2hzdG9uZWpzL2xpYi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy90b3VjaHN0b25lanMvbGliL21peGlucy9UcmFuc2l0aW9ucy5qcyIsIm5vZGVfbW9kdWxlcy90b3VjaHN0b25lanMvbGliL21peGlucy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy90b3VjaHN0b25lanMvbGliL3VpL0FsZXJ0YmFyLmpzIiwibm9kZV9tb2R1bGVzL3RvdWNoc3RvbmVqcy9saWIvdWkvQnV0dG9uLmpzIiwibm9kZV9tb2R1bGVzL3RvdWNoc3RvbmVqcy9saWIvdWkvQnV0dG9uR3JvdXAuanMiLCJub2RlX21vZHVsZXMvdG91Y2hzdG9uZWpzL2xpYi91aS9GaWVsZENvbnRyb2wuanMiLCJub2RlX21vZHVsZXMvdG91Y2hzdG9uZWpzL2xpYi91aS9GaWVsZExhYmVsLmpzIiwibm9kZV9tb2R1bGVzL3RvdWNoc3RvbmVqcy9saWIvdWkvR3JvdXAuanMiLCJub2RlX21vZHVsZXMvdG91Y2hzdG9uZWpzL2xpYi91aS9Hcm91cEJvZHkuanMiLCJub2RlX21vZHVsZXMvdG91Y2hzdG9uZWpzL2xpYi91aS9Hcm91cEZvb3Rlci5qcyIsIm5vZGVfbW9kdWxlcy90b3VjaHN0b25lanMvbGliL3VpL0dyb3VwSGVhZGVyLmpzIiwibm9kZV9tb2R1bGVzL3RvdWNoc3RvbmVqcy9saWIvdWkvR3JvdXBJbm5lci5qcyIsIm5vZGVfbW9kdWxlcy90b3VjaHN0b25lanMvbGliL3VpL0lucHV0LmpzIiwibm9kZV9tb2R1bGVzL3RvdWNoc3RvbmVqcy9saWIvdWkvSXRlbS5qcyIsIm5vZGVfbW9kdWxlcy90b3VjaHN0b25lanMvbGliL3VpL0l0ZW1Db250ZW50LmpzIiwibm9kZV9tb2R1bGVzL3RvdWNoc3RvbmVqcy9saWIvdWkvSXRlbUlubmVyLmpzIiwibm9kZV9tb2R1bGVzL3RvdWNoc3RvbmVqcy9saWIvdWkvSXRlbU1lZGlhLmpzIiwibm9kZV9tb2R1bGVzL3RvdWNoc3RvbmVqcy9saWIvdWkvSXRlbU5vdGUuanMiLCJub2RlX21vZHVsZXMvdG91Y2hzdG9uZWpzL2xpYi91aS9JdGVtU3ViVGl0bGUuanMiLCJub2RlX21vZHVsZXMvdG91Y2hzdG9uZWpzL2xpYi91aS9JdGVtVGl0bGUuanMiLCJub2RlX21vZHVsZXMvdG91Y2hzdG9uZWpzL2xpYi91aS9MYWJlbElucHV0LmpzIiwibm9kZV9tb2R1bGVzL3RvdWNoc3RvbmVqcy9saWIvdWkvTGFiZWxTZWxlY3QuanMiLCJub2RlX21vZHVsZXMvdG91Y2hzdG9uZWpzL2xpYi91aS9MYWJlbFRleHRhcmVhLmpzIiwibm9kZV9tb2R1bGVzL3RvdWNoc3RvbmVqcy9saWIvdWkvTGlzdEhlYWRlci5qcyIsIm5vZGVfbW9kdWxlcy90b3VjaHN0b25lanMvbGliL3VpL05hdmlnYXRpb25CYXIuanMiLCJub2RlX21vZHVsZXMvdG91Y2hzdG9uZWpzL2xpYi91aS9Qb3B1cC5qcyIsIm5vZGVfbW9kdWxlcy90b3VjaHN0b25lanMvbGliL3VpL1BvcHVwSWNvbi5qcyIsIm5vZGVfbW9kdWxlcy90b3VjaHN0b25lanMvbGliL3VpL1JhZGlvTGlzdC5qcyIsIm5vZGVfbW9kdWxlcy90b3VjaHN0b25lanMvbGliL3VpL1NlYXJjaEZpZWxkLmpzIiwibm9kZV9tb2R1bGVzL3RvdWNoc3RvbmVqcy9saWIvdWkvU2VnbWVudGVkQ29udHJvbC5qcyIsIm5vZGVfbW9kdWxlcy90b3VjaHN0b25lanMvbGliL3VpL1N3aXRjaC5qcyIsIm5vZGVfbW9kdWxlcy90b3VjaHN0b25lanMvbGliL3VpL1RhYnMuanMiLCJub2RlX21vZHVsZXMvdG91Y2hzdG9uZWpzL2xpYi91aS9UZXh0YXJlYS5qcyIsIm5vZGVfbW9kdWxlcy90b3VjaHN0b25lanMvbGliL3VpL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3RvdWNoc3RvbmVqcy9ub2RlX21vZHVsZXMvdHdlZW4uanMvaW5kZXguanMiLCIvVXNlcnMvaHNjaGluc2svRG93bmxvYWRzL3Bob25lZ2FwLWFwcC10b3VjaHN0b25lanMvc3JjL2pzL2FwcC5qcyIsIi9Vc2Vycy9oc2NoaW5zay9Eb3dubG9hZHMvcGhvbmVnYXAtYXBwLXRvdWNoc3RvbmVqcy9zcmMvanMvc3RvcmVzL21lZGlhLmpzIiwiL1VzZXJzL2hzY2hpbnNrL0Rvd25sb2Fkcy9waG9uZWdhcC1hcHAtdG91Y2hzdG9uZWpzL3NyYy9qcy92aWV3cy9hYm91dC5qcyIsIi9Vc2Vycy9oc2NoaW5zay9Eb3dubG9hZHMvcGhvbmVnYXAtYXBwLXRvdWNoc3RvbmVqcy9zcmMvanMvdmlld3MvY3JpdGVyaWEtZm9ybS5qcyIsIi9Vc2Vycy9oc2NoaW5zay9Eb3dubG9hZHMvcGhvbmVnYXAtYXBwLXRvdWNoc3RvbmVqcy9zcmMvanMvdmlld3MvbWVkaWEtZGV0YWlscy5qcyIsIi9Vc2Vycy9oc2NoaW5zay9Eb3dubG9hZHMvcGhvbmVnYXAtYXBwLXRvdWNoc3RvbmVqcy9zcmMvanMvdmlld3MvbWVkaWEtbGlzdC5qcyIsIi9Vc2Vycy9oc2NoaW5zay9Eb3dubG9hZHMvcGhvbmVnYXAtYXBwLXRvdWNoc3RvbmVqcy9zcmMvanMvdmlld3MvcHJlZmVyZW5jZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzljQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OzsyQkNwdkJrQixjQUFjOzs7OzRCQU96QixjQUFjOzs7OztBQUtyQixJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtBQUM1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QUFDLGlDQUFHLEtBQUs7O2dCQUNMO0FBQUMscUNBQUcsV0FBVzs7O2lCQUEyQjtnQkFDMUM7QUFBQyxxQ0FBRyxTQUFTOztvQkFDVCxpQ0FBQyxpQkFBRyxTQUFTLElBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxBQUFDLEVBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxBQUFDO0FBQzFGLCtCQUFPLEVBQUUsT0FBTyxBQUFDLEdBQUc7aUJBQ3ZCO2FBQ1I7U0FDSCxDQUNkO0tBQ0w7Q0FDSixDQUFDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyohXG4gIENvcHlyaWdodCAoYykgMjAxNSBKZWQgV2F0c29uLlxuICBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UgKE1JVCksIHNlZVxuICBodHRwOi8vamVkd2F0c29uLmdpdGh1Yi5pby9jbGFzc25hbWVzXG4qL1xuXG4oZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0ZnVuY3Rpb24gY2xhc3NOYW1lcyAoKSB7XG5cblx0XHR2YXIgY2xhc3NlcyA9ICcnO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBhcmcgPSBhcmd1bWVudHNbaV07XG5cdFx0XHRpZiAoIWFyZykgY29udGludWU7XG5cblx0XHRcdHZhciBhcmdUeXBlID0gdHlwZW9mIGFyZztcblxuXHRcdFx0aWYgKCdzdHJpbmcnID09PSBhcmdUeXBlIHx8ICdudW1iZXInID09PSBhcmdUeXBlKSB7XG5cdFx0XHRcdGNsYXNzZXMgKz0gJyAnICsgYXJnO1xuXG5cdFx0XHR9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoYXJnKSkge1xuXHRcdFx0XHRjbGFzc2VzICs9ICcgJyArIGNsYXNzTmFtZXMuYXBwbHkobnVsbCwgYXJnKTtcblxuXHRcdFx0fSBlbHNlIGlmICgnb2JqZWN0JyA9PT0gYXJnVHlwZSkge1xuXHRcdFx0XHRmb3IgKHZhciBrZXkgaW4gYXJnKSB7XG5cdFx0XHRcdFx0aWYgKGFyZy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIGFyZ1trZXldKSB7XG5cdFx0XHRcdFx0XHRjbGFzc2VzICs9ICcgJyArIGtleTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gY2xhc3Nlcy5zdWJzdHIoMSk7XG5cdH1cblxuXHRpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGNsYXNzTmFtZXM7XG5cdH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCA9PT0gJ29iamVjdCcgJiYgZGVmaW5lLmFtZCl7XG5cdFx0Ly8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxuXHRcdGRlZmluZShmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gY2xhc3NOYW1lcztcblx0XHR9KTtcblx0fSBlbHNlIHtcblx0XHR3aW5kb3cuY2xhc3NOYW1lcyA9IGNsYXNzTmFtZXM7XG5cdH1cblxufSgpKTtcbiIsImZ1bmN0aW9uIG1ha2VzaGlmdFRpdGxlKHRpdGxlLCBtZXNzYWdlKSB7XG4gIHJldHVybiB0aXRsZSA/ICh0aXRsZSArICdcXG5cXG4nICsgbWVzc2FnZSkgOiBtZXNzYWdlXG59XG5cbi8vIFNlZSBodHRwOi8vZG9jcy5waG9uZWdhcC5jb20vZW4vZWRnZS9jb3Jkb3ZhX25vdGlmaWNhdGlvbl9ub3RpZmljYXRpb24ubWQuaHRtbCBmb3IgZG9jdW1lbnRhdGlvblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFsZXJ0OiBmdW5jdGlvbiBhbGVydChtZXNzYWdlLCBjYWxsYmFjaywgdGl0bGUpIHtcbiAgICBpZiAod2luZG93Lm5hdmlnYXRvci5ub3RpZmljYXRpb24gJiYgd2luZG93Lm5hdmlnYXRvci5ub3RpZmljYXRpb24uYWxlcnQpIHtcbiAgICAgIHJldHVybiB3aW5kb3cubmF2aWdhdG9yLm5vdGlmaWNhdGlvbi5hbGVydC5hcHBseShudWxsLCBhcmd1bWVudHMpXG4gICAgfVxuXG4gICAgdmFyIHRleHQgPSBtYWtlc2hpZnRUaXRsZSh0aXRsZSwgbWVzc2FnZSlcblxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICB3aW5kb3cuYWxlcnQodGV4dClcblxuICAgICAgY2FsbGJhY2soKVxuICAgIH0sIDApXG4gIH0sXG4gIGNvbmZpcm06IGZ1bmN0aW9uIGNvbmZpcm0obWVzc2FnZSwgY2FsbGJhY2ssIHRpdGxlKSB7XG4gICAgaWYgKHdpbmRvdy5uYXZpZ2F0b3Iubm90aWZpY2F0aW9uICYmIHdpbmRvdy5uYXZpZ2F0b3Iubm90aWZpY2F0aW9uLmNvbmZpcm0pIHtcbiAgICAgIHJldHVybiB3aW5kb3cubmF2aWdhdG9yLm5vdGlmaWNhdGlvbi5jb25maXJtLmFwcGx5KG51bGwsIGFyZ3VtZW50cylcbiAgICB9XG5cbiAgICB2YXIgdGV4dCA9IG1ha2VzaGlmdFRpdGxlKHRpdGxlLCBtZXNzYWdlKVxuXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjb25maXJtZWQgPSB3aW5kb3cuY29uZmlybSh0ZXh0KVxuICAgICAgdmFyIGJ1dHRvbkluZGV4ID0gY29uZmlybWVkID8gMSA6IDJcblxuICAgICAgY2FsbGJhY2soYnV0dG9uSW5kZXgpXG4gICAgfSwgMClcbiAgfSxcblxuICBwcm9tcHQ6IGZ1bmN0aW9uIHByb21wdChtZXNzYWdlLCBjYWxsYmFjaywgdGl0bGUsIGRlZmF1bHRUZXh0KSB7XG4gICAgaWYgKHdpbmRvdy5uYXZpZ2F0b3Iubm90aWZpY2F0aW9uICYmIHdpbmRvdy5uYXZpZ2F0b3Iubm90aWZpY2F0aW9uLnByb21wdCkge1xuICAgICAgcmV0dXJuIHdpbmRvdy5uYXZpZ2F0b3Iubm90aWZpY2F0aW9uLnByb21wdC5hcHBseShudWxsLCBhcmd1bWVudHMpXG4gICAgfVxuXG4gICAgdmFyIHF1ZXN0aW9uID0gbWFrZXNoaWZ0VGl0bGUodGl0bGUsIG1lc3NhZ2UpXG5cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHRleHQgPSB3aW5kb3cucHJvbXB0KHF1ZXN0aW9uLCBkZWZhdWx0VGV4dClcbiAgICAgIHZhciBidXR0b25JbmRleCA9ICh0ZXh0ID09PSBudWxsKSA/IDAgOiAxXG5cbiAgICAgIGNhbGxiYWNrKHtcbiAgICAgICAgYnV0dG9uSW5kZXg6IGJ1dHRvbkluZGV4LFxuICAgICAgICBpbnB1dDE6IHRleHRcbiAgICAgIH0pXG4gICAgfSwgMClcbiAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG5cdHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxudmFyIGJsYWNrbGlzdCA9IHJlcXVpcmUoJ2JsYWNrbGlzdCcpO1xudmFyIGNsYXNzbmFtZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyk7XG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG5mdW5jdGlvbiBoYXNDaGlsZHJlbldpdGhWZXJ0aWNhbEZpbGwoY2hpbGRyZW4pIHtcblx0dmFyIHJlc3VsdCA9IGZhbHNlO1xuXG5cdFJlYWN0LkNoaWxkcmVuLmZvckVhY2goY2hpbGRyZW4sIGZ1bmN0aW9uIChjKSB7XG5cdFx0aWYgKHJlc3VsdCkgcmV0dXJuOyAvLyBlYXJseS1leGl0XG5cdFx0aWYgKCFjKSByZXR1cm47XG5cdFx0aWYgKCFjLnR5cGUpIHJldHVybjtcblxuXHRcdHJlc3VsdCA9ICEhYy50eXBlLnNob3VsZEZpbGxWZXJ0aWNhbFNwYWNlO1xuXHR9KTtcblxuXHRyZXR1cm4gcmVzdWx0O1xufVxuXG52YXIgQ29udGFpbmVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogJ0NvbnRhaW5lcicsXG5cblx0cHJvcFR5cGVzOiB7XG5cdFx0YWxpZ246IFJlYWN0LlByb3BUeXBlcy5vbmVPZihbJ2VuZCcsICdjZW50ZXInLCAnc3RhcnQnXSksXG5cdFx0ZGlyZWN0aW9uOiBSZWFjdC5Qcm9wVHlwZXMub25lT2YoWydjb2x1bW4nLCAncm93J10pLFxuXHRcdGZpbGw6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuXHRcdGdyb3c6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuXHRcdGp1c3RpZnk6IFJlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoW1JlYWN0LlByb3BUeXBlcy5ib29sLCBSZWFjdC5Qcm9wVHlwZXMub25lT2YoWydlbmQnLCAnY2VudGVyJywgJ3N0YXJ0J10pXSksXG5cdFx0c2Nyb2xsYWJsZTogUmVhY3QuUHJvcFR5cGVzLm9uZU9mVHlwZShbUmVhY3QuUHJvcFR5cGVzLmJvb2wsIFJlYWN0LlByb3BUeXBlcy5vYmplY3RdKVxuXHR9LFxuXHRjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG5cdFx0aWYgKHRoaXMucHJvcHMuc2Nyb2xsYWJsZSAmJiB0aGlzLnByb3BzLnNjcm9sbGFibGUubW91bnQpIHtcblx0XHRcdHRoaXMucHJvcHMuc2Nyb2xsYWJsZS5tb3VudCh0aGlzKTtcblx0XHR9XG5cdH0sXG5cdGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcblx0XHRpZiAodGhpcy5wcm9wcy5zY3JvbGxhYmxlICYmIHRoaXMucHJvcHMuc2Nyb2xsYWJsZS51bm1vdW50KSB7XG5cdFx0XHR0aGlzLnByb3BzLnNjcm9sbGFibGUudW5tb3VudCh0aGlzKTtcblx0XHR9XG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdHZhciBkaXJlY3Rpb24gPSB0aGlzLnByb3BzLmRpcmVjdGlvbjtcblx0XHRpZiAoIWRpcmVjdGlvbikge1xuXHRcdFx0aWYgKGhhc0NoaWxkcmVuV2l0aFZlcnRpY2FsRmlsbCh0aGlzLnByb3BzLmNoaWxkcmVuKSkge1xuXHRcdFx0XHRkaXJlY3Rpb24gPSAnY29sdW1uJztcblx0XHRcdH1cblx0XHR9XG5cblx0XHR2YXIgZmlsbCA9IHRoaXMucHJvcHMuZmlsbDtcblx0XHRpZiAoZGlyZWN0aW9uID09PSAnY29sdW1uJyB8fCB0aGlzLnByb3BzLnNjcm9sbGFibGUpIHtcblx0XHRcdGZpbGwgPSB0cnVlO1xuXHRcdH1cblxuXHRcdHZhciBhbGlnbiA9IHRoaXMucHJvcHMuYWxpZ247XG5cdFx0aWYgKGRpcmVjdGlvbiA9PT0gJ2NvbHVtbicgJiYgYWxpZ24gPT09ICd0b3AnKSBhbGlnbiA9ICdzdGFydCc7XG5cdFx0aWYgKGRpcmVjdGlvbiA9PT0gJ2NvbHVtbicgJiYgYWxpZ24gPT09ICdib3R0b20nKSBhbGlnbiA9ICdlbmQnO1xuXHRcdGlmIChkaXJlY3Rpb24gPT09ICdyb3cnICYmIGFsaWduID09PSAnbGVmdCcpIGFsaWduID0gJ3N0YXJ0Jztcblx0XHRpZiAoZGlyZWN0aW9uID09PSAncm93JyAmJiBhbGlnbiA9PT0gJ3JpZ2h0JykgYWxpZ24gPSAnZW5kJztcblxuXHRcdHZhciBjbGFzc05hbWUgPSBjbGFzc25hbWVzKHRoaXMucHJvcHMuY2xhc3NOYW1lLCB7XG5cdFx0XHQnQ29udGFpbmVyLS1maWxsJzogZmlsbCxcblx0XHRcdCdDb250YWluZXItLWRpcmVjdGlvbi1jb2x1bW4nOiBkaXJlY3Rpb24gPT09ICdjb2x1bW4nLFxuXHRcdFx0J0NvbnRhaW5lci0tZGlyZWN0aW9uLXJvdyc6IGRpcmVjdGlvbiA9PT0gJ3JvdycsXG5cdFx0XHQnQ29udGFpbmVyLS1hbGlnbi1jZW50ZXInOiBhbGlnbiA9PT0gJ2NlbnRlcicsXG5cdFx0XHQnQ29udGFpbmVyLS1hbGlnbi1zdGFydCc6IGFsaWduID09PSAnc3RhcnQnLFxuXHRcdFx0J0NvbnRhaW5lci0tYWxpZ24tZW5kJzogYWxpZ24gPT09ICdlbmQnLFxuXHRcdFx0J0NvbnRhaW5lci0tanVzdGlmeS1jZW50ZXInOiB0aGlzLnByb3BzLmp1c3RpZnkgPT09ICdjZW50ZXInLFxuXHRcdFx0J0NvbnRhaW5lci0tanVzdGlmeS1zdGFydCc6IHRoaXMucHJvcHMuanVzdGlmeSA9PT0gJ3N0YXJ0Jyxcblx0XHRcdCdDb250YWluZXItLWp1c3RpZnktZW5kJzogdGhpcy5wcm9wcy5qdXN0aWZ5ID09PSAnZW5kJyxcblx0XHRcdCdDb250YWluZXItLWp1c3RpZmllZCc6IHRoaXMucHJvcHMuanVzdGlmeSA9PT0gdHJ1ZSxcblx0XHRcdCdDb250YWluZXItLXNjcm9sbGFibGUnOiB0aGlzLnByb3BzLnNjcm9sbGFibGVcblx0XHR9KTtcblxuXHRcdHZhciBwcm9wcyA9IGJsYWNrbGlzdCh0aGlzLnByb3BzLCAnY2xhc3NOYW1lJywgJ2RpcmVjdGlvbicsICdmaWxsJywgJ2p1c3RpZnknLCAnc2Nyb2xsYWJsZScpO1xuXG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHQnZGl2Jyxcblx0XHRcdF9leHRlbmRzKHsgY2xhc3NOYW1lOiBjbGFzc05hbWUgfSwgcHJvcHMpLFxuXHRcdFx0dGhpcy5wcm9wcy5jaGlsZHJlblxuXHRcdCk7XG5cdH1cbn0pO1xuXG5mdW5jdGlvbiBpbml0U2Nyb2xsYWJsZShkZWZhdWx0UG9zKSB7XG5cdGlmICghZGVmYXVsdFBvcykge1xuXHRcdGRlZmF1bHRQb3MgPSB7fTtcblx0fVxuXHR2YXIgcG9zO1xuXHR2YXIgc2Nyb2xsYWJsZSA9IHtcblx0XHRyZXNldDogZnVuY3Rpb24gcmVzZXQoKSB7XG5cdFx0XHRwb3MgPSB7IGxlZnQ6IGRlZmF1bHRQb3MubGVmdCB8fCAwLCB0b3A6IGRlZmF1bHRQb3MudG9wIHx8IDAgfTtcblx0XHR9LFxuXHRcdGdldFBvczogZnVuY3Rpb24gZ2V0UG9zKCkge1xuXHRcdFx0cmV0dXJuIHsgbGVmdDogcG9zLmxlZnQsIHRvcDogcG9zLnRvcCB9O1xuXHRcdH0sXG5cdFx0bW91bnQ6IGZ1bmN0aW9uIG1vdW50KGVsZW1lbnQpIHtcblx0XHRcdHZhciBub2RlID0gUmVhY3QuZmluZERPTU5vZGUoZWxlbWVudCk7XG5cdFx0XHRub2RlLnNjcm9sbExlZnQgPSBwb3MubGVmdDtcblx0XHRcdG5vZGUuc2Nyb2xsVG9wID0gcG9zLnRvcDtcblx0XHR9LFxuXHRcdHVubW91bnQ6IGZ1bmN0aW9uIHVubW91bnQoZWxlbWVudCkge1xuXHRcdFx0dmFyIG5vZGUgPSBSZWFjdC5maW5kRE9NTm9kZShlbGVtZW50KTtcblx0XHRcdHBvcy5sZWZ0ID0gbm9kZS5zY3JvbGxMZWZ0O1xuXHRcdFx0cG9zLnRvcCA9IG5vZGUuc2Nyb2xsVG9wO1xuXHRcdH1cblx0fTtcblx0c2Nyb2xsYWJsZS5yZXNldCgpO1xuXHRyZXR1cm4gc2Nyb2xsYWJsZTtcbn1cblxuQ29udGFpbmVyLmluaXRTY3JvbGxhYmxlID0gaW5pdFNjcm9sbGFibGU7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IENvbnRhaW5lcjtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmxhY2tsaXN0IChzcmMpIHtcbiAgdmFyIGNvcHkgPSB7fSwgZmlsdGVyID0gYXJndW1lbnRzWzFdXG5cbiAgaWYgKHR5cGVvZiBmaWx0ZXIgPT09ICdzdHJpbmcnKSB7XG4gICAgZmlsdGVyID0ge31cbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgZmlsdGVyW2FyZ3VtZW50c1tpXV0gPSB0cnVlXG4gICAgfVxuICB9XG5cbiAgZm9yICh2YXIga2V5IGluIHNyYykge1xuICAgIC8vIGJsYWNrbGlzdD9cbiAgICBpZiAoZmlsdGVyW2tleV0pIGNvbnRpbnVlXG5cbiAgICBjb3B5W2tleV0gPSBzcmNba2V5XVxuICB9XG5cbiAgcmV0dXJuIGNvcHlcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGxpc3RlbmVycyA9IFtdO1xuXG4gIHJldHVybiB7XG4gICAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgICAgbGlzdGVuZXJzLmZvckVhY2goZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgICAgIHZhciBlbWl0dGVyID0gbGlzdGVuZXIuZW1pdHRlcjtcbiAgICAgICAgdmFyIGV2ZW50TmFtZSA9IGxpc3RlbmVyLmV2ZW50TmFtZTtcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gbGlzdGVuZXIuY2FsbGJhY2s7XG5cbiAgICAgICAgdmFyIHJlbW92ZUxpc3RlbmVyID0gZW1pdHRlci5yZW1vdmVMaXN0ZW5lciB8fCBlbWl0dGVyLnJlbW92ZUV2ZW50TGlzdGVuZXI7XG4gICAgICAgIHJlbW92ZUxpc3RlbmVyLmNhbGwoZW1pdHRlciwgZXZlbnROYW1lLCBjYWxsYmFjayk7XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgd2F0Y2g6IGZ1bmN0aW9uIHdhdGNoKGVtaXR0ZXIsIGV2ZW50TmFtZSwgY2FsbGJhY2spIHtcbiAgICAgIGxpc3RlbmVycy5wdXNoKHtcbiAgICAgICAgZW1pdHRlcjogZW1pdHRlcixcbiAgICAgICAgZXZlbnROYW1lOiBldmVudE5hbWUsXG4gICAgICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICAgICAgfSk7XG5cbiAgICAgIHZhciBhZGRMaXN0ZW5lciA9IGVtaXR0ZXIuYWRkTGlzdGVuZXIgfHwgZW1pdHRlci5hZGRFdmVudExpc3RlbmVyO1xuICAgICAgYWRkTGlzdGVuZXIuY2FsbChlbWl0dGVyLCBldmVudE5hbWUsIGNhbGxiYWNrKTtcbiAgICB9LFxuXG4gICAgdW53YXRjaDogZnVuY3Rpb24gdW53YXRjaChlbWl0dGVyLCBldmVudE5hbWUsIGNhbGxiYWNrKSB7XG4gICAgICBsaXN0ZW5lcnMgPSBsaXN0ZW5lcnMuZmlsdGVyKGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgICAgICByZXR1cm4gbGlzdGVuZXIuZW1pdHRlciA9PT0gZW1pdHRlciAmJiBsaXN0ZW5lci5ldmVudE5hbWUgPT09IGV2ZW50TmFtZSAmJiBsaXN0ZW5lci5jYWxsYmFjayA9PT0gY2FsbGJhY2s7XG4gICAgICB9KTtcblxuICAgICAgdmFyIHJlbW92ZUxpc3RlbmVyID0gZW1pdHRlci5yZW1vdmVMaXN0ZW5lciB8fCBlbWl0dGVyLnJlbW92ZUV2ZW50TGlzdGVuZXI7XG4gICAgICByZW1vdmVMaXN0ZW5lci5jYWxsKGVtaXR0ZXIsIGV2ZW50TmFtZSwgY2FsbGJhY2spO1xuICAgIH1cbiAgfTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG5mdW5jdGlvbiBnZXRUb3VjaFByb3BzKHRvdWNoKSB7XG5cdGlmICghdG91Y2gpIHJldHVybiB7fTtcblx0cmV0dXJuIHtcblx0XHRwYWdlWDogdG91Y2gucGFnZVgsXG5cdFx0cGFnZVk6IHRvdWNoLnBhZ2VZLFxuXHRcdGNsaWVudFg6IHRvdWNoLmNsaWVudFgsXG5cdFx0Y2xpZW50WTogdG91Y2guY2xpZW50WVxuXHR9O1xufVxuXG5mdW5jdGlvbiBpc0RhdGFPckFyaWFQcm9wKGtleSkge1xuXHRyZXR1cm4ga2V5LmluZGV4T2YoJ2RhdGEtJykgPT09IDAgfHwga2V5LmluZGV4T2YoJ2FyaWEtJykgPT09IDA7XG59XG5cbmZ1bmN0aW9uIGdldFBpbmNoUHJvcHModG91Y2hlcykge1xuXHRyZXR1cm4ge1xuXHRcdHRvdWNoZXM6IEFycmF5LnByb3RvdHlwZS5tYXAuY2FsbCh0b3VjaGVzLCBmdW5jdGlvbiBjb3B5VG91Y2godG91Y2gpIHtcblx0XHRcdHJldHVybiB7IGlkZW50aWZpZXI6IHRvdWNoLmlkZW50aWZpZXIsIHBhZ2VYOiB0b3VjaC5wYWdlWCwgcGFnZVk6IHRvdWNoLnBhZ2VZIH07XG5cdFx0fSksXG5cdFx0Y2VudGVyOiB7IHg6ICh0b3VjaGVzWzBdLnBhZ2VYICsgdG91Y2hlc1sxXS5wYWdlWCkgLyAyLCB5OiAodG91Y2hlc1swXS5wYWdlWSArIHRvdWNoZXNbMV0ucGFnZVkpIC8gMiB9LFxuXHRcdGFuZ2xlOiBNYXRoLmF0YW4oKSAqICh0b3VjaGVzWzFdLnBhZ2VZIC0gdG91Y2hlc1swXS5wYWdlWSkgLyAodG91Y2hlc1sxXS5wYWdlWCAtIHRvdWNoZXNbMF0ucGFnZVgpICogMTgwIC8gTWF0aC5QSSxcblx0XHRkaXN0YW5jZTogTWF0aC5zcXJ0KE1hdGgucG93KE1hdGguYWJzKHRvdWNoZXNbMV0ucGFnZVggLSB0b3VjaGVzWzBdLnBhZ2VYKSwgMikgKyBNYXRoLnBvdyhNYXRoLmFicyh0b3VjaGVzWzFdLnBhZ2VZIC0gdG91Y2hlc1swXS5wYWdlWSksIDIpKVxuXHR9O1xufVxuXG52YXIgVE9VQ0hfU1RZTEVTID0ge1xuXHRXZWJraXRUYXBIaWdobGlnaHRDb2xvcjogJ3JnYmEoMCwwLDAsMCknLFxuXHRXZWJraXRUb3VjaENhbGxvdXQ6ICdub25lJyxcblx0V2Via2l0VXNlclNlbGVjdDogJ25vbmUnLFxuXHRLaHRtbFVzZXJTZWxlY3Q6ICdub25lJyxcblx0TW96VXNlclNlbGVjdDogJ25vbmUnLFxuXHRtc1VzZXJTZWxlY3Q6ICdub25lJyxcblx0dXNlclNlbGVjdDogJ25vbmUnLFxuXHRjdXJzb3I6ICdwb2ludGVyJ1xufTtcblxuLyoqXG4gKiBUYXBwYWJsZSBNaXhpblxuICogPT09PT09PT09PT09PT1cbiAqL1xuXG52YXIgTWl4aW4gPSB7XG5cdHByb3BUeXBlczoge1xuXHRcdG1vdmVUaHJlc2hvbGQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsIC8vIHBpeGVscyB0byBtb3ZlIGJlZm9yZSBjYW5jZWxsaW5nIHRhcFxuXHRcdGFjdGl2ZURlbGF5OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLCAvLyBtcyB0byB3YWl0IGJlZm9yZSBhZGRpbmcgdGhlIGAtYWN0aXZlYCBjbGFzc1xuXHRcdHByZXNzRGVsYXk6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsIC8vIG1zIHRvIHdhaXQgYmVmb3JlIGRldGVjdGluZyBhIHByZXNzXG5cdFx0cHJlc3NNb3ZlVGhyZXNob2xkOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLCAvLyBwaXhlbHMgdG8gbW92ZSBiZWZvcmUgY2FuY2VsbGluZyBwcmVzc1xuXHRcdHByZXZlbnREZWZhdWx0OiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCwgLy8gd2hldGhlciB0byBwcmV2ZW50RGVmYXVsdCBvbiBhbGwgZXZlbnRzXG5cdFx0c3RvcFByb3BhZ2F0aW9uOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCwgLy8gd2hldGhlciB0byBzdG9wUHJvcGFnYXRpb24gb24gYWxsIGV2ZW50c1xuXG5cdFx0b25UYXA6IFJlYWN0LlByb3BUeXBlcy5mdW5jLCAvLyBmaXJlcyB3aGVuIGEgdGFwIGlzIGRldGVjdGVkXG5cdFx0b25QcmVzczogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsIC8vIGZpcmVzIHdoZW4gYSBwcmVzcyBpcyBkZXRlY3RlZFxuXHRcdG9uVG91Y2hTdGFydDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsIC8vIHBhc3MtdGhyb3VnaCB0b3VjaCBldmVudFxuXHRcdG9uVG91Y2hNb3ZlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYywgLy8gcGFzcy10aHJvdWdoIHRvdWNoIGV2ZW50XG5cdFx0b25Ub3VjaEVuZDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsIC8vIHBhc3MtdGhyb3VnaCB0b3VjaCBldmVudFxuXHRcdG9uTW91c2VEb3duOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYywgLy8gcGFzcy10aHJvdWdoIG1vdXNlIGV2ZW50XG5cdFx0b25Nb3VzZVVwOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYywgLy8gcGFzcy10aHJvdWdoIG1vdXNlIGV2ZW50XG5cdFx0b25Nb3VzZU1vdmU6IFJlYWN0LlByb3BUeXBlcy5mdW5jLCAvLyBwYXNzLXRocm91Z2ggbW91c2UgZXZlbnRcblx0XHRvbk1vdXNlT3V0OiBSZWFjdC5Qcm9wVHlwZXMuZnVuYywgLy8gcGFzcy10aHJvdWdoIG1vdXNlIGV2ZW50XG5cblx0XHRvblBpbmNoU3RhcnQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLCAvLyBmaXJlcyB3aGVuIGEgcGluY2ggZ2VzdHVyZSBpcyBzdGFydGVkXG5cdFx0b25QaW5jaE1vdmU6IFJlYWN0LlByb3BUeXBlcy5mdW5jLCAvLyBmaXJlcyBvbiBldmVyeSB0b3VjaC1tb3ZlIHdoZW4gYSBwaW5jaCBhY3Rpb24gaXMgYWN0aXZlXG5cdFx0b25QaW5jaEVuZDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMgLy8gZmlyZXMgd2hlbiBhIHBpbmNoIGFjdGlvbiBlbmRzXG5cdH0sXG5cblx0Z2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiBnZXREZWZhdWx0UHJvcHMoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGFjdGl2ZURlbGF5OiAwLFxuXHRcdFx0bW92ZVRocmVzaG9sZDogMTAwLFxuXHRcdFx0cHJlc3NEZWxheTogMTAwMCxcblx0XHRcdHByZXNzTW92ZVRocmVzaG9sZDogNVxuXHRcdH07XG5cdH0sXG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGlzQWN0aXZlOiBmYWxzZSxcblx0XHRcdHRvdWNoQWN0aXZlOiBmYWxzZSxcblx0XHRcdHBpbmNoQWN0aXZlOiBmYWxzZVxuXHRcdH07XG5cdH0sXG5cblx0Y29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuXHRcdHRoaXMuY2xlYW51cFNjcm9sbERldGVjdGlvbigpO1xuXHRcdHRoaXMuY2FuY2VsUHJlc3NEZXRlY3Rpb24oKTtcblx0XHR0aGlzLmNsZWFyQWN0aXZlVGltZW91dCgpO1xuXHR9LFxuXG5cdHByb2Nlc3NFdmVudDogZnVuY3Rpb24gcHJvY2Vzc0V2ZW50KGV2ZW50KSB7XG5cdFx0aWYgKHRoaXMucHJvcHMucHJldmVudERlZmF1bHQpIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0aWYgKHRoaXMucHJvcHMuc3RvcFByb3BhZ2F0aW9uKSBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0fSxcblxuXHRvblRvdWNoU3RhcnQ6IGZ1bmN0aW9uIG9uVG91Y2hTdGFydChldmVudCkge1xuXHRcdGlmICh0aGlzLnByb3BzLm9uVG91Y2hTdGFydCAmJiB0aGlzLnByb3BzLm9uVG91Y2hTdGFydChldmVudCkgPT09IGZhbHNlKSByZXR1cm47XG5cdFx0dGhpcy5wcm9jZXNzRXZlbnQoZXZlbnQpO1xuXHRcdHdpbmRvdy5fYmxvY2tNb3VzZUV2ZW50cyA9IHRydWU7XG5cdFx0aWYgKGV2ZW50LnRvdWNoZXMubGVuZ3RoID09PSAxKSB7XG5cdFx0XHR0aGlzLl9pbml0aWFsVG91Y2ggPSB0aGlzLl9sYXN0VG91Y2ggPSBnZXRUb3VjaFByb3BzKGV2ZW50LnRvdWNoZXNbMF0pO1xuXHRcdFx0dGhpcy5pbml0U2Nyb2xsRGV0ZWN0aW9uKCk7XG5cdFx0XHR0aGlzLmluaXRQcmVzc0RldGVjdGlvbihldmVudCwgdGhpcy5lbmRUb3VjaCk7XG5cdFx0XHR0aGlzLl9hY3RpdmVUaW1lb3V0ID0gc2V0VGltZW91dCh0aGlzLm1ha2VBY3RpdmUsIHRoaXMucHJvcHMuYWN0aXZlRGVsYXkpO1xuXHRcdH0gZWxzZSBpZiAoKHRoaXMucHJvcHMub25QaW5jaFN0YXJ0IHx8IHRoaXMucHJvcHMub25QaW5jaE1vdmUgfHwgdGhpcy5wcm9wcy5vblBpbmNoRW5kKSAmJiBldmVudC50b3VjaGVzLmxlbmd0aCA9PT0gMikge1xuXHRcdFx0dGhpcy5vblBpbmNoU3RhcnQoZXZlbnQpO1xuXHRcdH1cblx0fSxcblxuXHRtYWtlQWN0aXZlOiBmdW5jdGlvbiBtYWtlQWN0aXZlKCkge1xuXHRcdGlmICghdGhpcy5pc01vdW50ZWQoKSkgcmV0dXJuO1xuXHRcdHRoaXMuY2xlYXJBY3RpdmVUaW1lb3V0KCk7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRpc0FjdGl2ZTogdHJ1ZVxuXHRcdH0pO1xuXHR9LFxuXG5cdGNsZWFyQWN0aXZlVGltZW91dDogZnVuY3Rpb24gY2xlYXJBY3RpdmVUaW1lb3V0KCkge1xuXHRcdGNsZWFyVGltZW91dCh0aGlzLl9hY3RpdmVUaW1lb3V0KTtcblx0XHR0aGlzLl9hY3RpdmVUaW1lb3V0ID0gZmFsc2U7XG5cdH0sXG5cblx0b25QaW5jaFN0YXJ0OiBmdW5jdGlvbiBvblBpbmNoU3RhcnQoZXZlbnQpIHtcblx0XHQvLyBpbiBjYXNlIHRoZSB0d28gdG91Y2hlcyBkaWRuJ3Qgc3RhcnQgZXhhY3RseSBhdCB0aGUgc2FtZSB0aW1lXG5cdFx0aWYgKHRoaXMuX2luaXRpYWxUb3VjaCkge1xuXHRcdFx0dGhpcy5lbmRUb3VjaCgpO1xuXHRcdH1cblx0XHR2YXIgdG91Y2hlcyA9IGV2ZW50LnRvdWNoZXM7XG5cdFx0dGhpcy5faW5pdGlhbFBpbmNoID0gZ2V0UGluY2hQcm9wcyh0b3VjaGVzKTtcblx0XHR0aGlzLl9pbml0aWFsUGluY2ggPSBfZXh0ZW5kcyh0aGlzLl9pbml0aWFsUGluY2gsIHtcblx0XHRcdGRpc3BsYWNlbWVudDogeyB4OiAwLCB5OiAwIH0sXG5cdFx0XHRkaXNwbGFjZW1lbnRWZWxvY2l0eTogeyB4OiAwLCB5OiAwIH0sXG5cdFx0XHRyb3RhdGlvbjogMCxcblx0XHRcdHJvdGF0aW9uVmVsb2NpdHk6IDAsXG5cdFx0XHR6b29tOiAxLFxuXHRcdFx0em9vbVZlbG9jaXR5OiAwLFxuXHRcdFx0dGltZTogRGF0ZS5ub3coKVxuXHRcdH0pO1xuXHRcdHRoaXMuX2xhc3RQaW5jaCA9IHRoaXMuX2luaXRpYWxQaW5jaDtcblx0XHR0aGlzLnByb3BzLm9uUGluY2hTdGFydCAmJiB0aGlzLnByb3BzLm9uUGluY2hTdGFydCh0aGlzLl9pbml0aWFsUGluY2gsIGV2ZW50KTtcblx0fSxcblxuXHRvblBpbmNoTW92ZTogZnVuY3Rpb24gb25QaW5jaE1vdmUoZXZlbnQpIHtcblx0XHRpZiAodGhpcy5faW5pdGlhbFRvdWNoKSB7XG5cdFx0XHR0aGlzLmVuZFRvdWNoKCk7XG5cdFx0fVxuXHRcdHZhciB0b3VjaGVzID0gZXZlbnQudG91Y2hlcztcblx0XHRpZiAodG91Y2hlcy5sZW5ndGggIT09IDIpIHtcblx0XHRcdHJldHVybiB0aGlzLm9uUGluY2hFbmQoZXZlbnQpIC8vIGJhaWwgb3V0IGJlZm9yZSBkaXNhc3RlclxuXHRcdFx0O1xuXHRcdH1cblxuXHRcdHZhciBjdXJyZW50UGluY2ggPSB0b3VjaGVzWzBdLmlkZW50aWZpZXIgPT09IHRoaXMuX2luaXRpYWxQaW5jaC50b3VjaGVzWzBdLmlkZW50aWZpZXIgJiYgdG91Y2hlc1sxXS5pZGVudGlmaWVyID09PSB0aGlzLl9pbml0aWFsUGluY2gudG91Y2hlc1sxXS5pZGVudGlmaWVyID8gZ2V0UGluY2hQcm9wcyh0b3VjaGVzKSAvLyB0aGUgdG91Y2hlcyBhcmUgaW4gdGhlIGNvcnJlY3Qgb3JkZXJcblx0XHQ6IHRvdWNoZXNbMV0uaWRlbnRpZmllciA9PT0gdGhpcy5faW5pdGlhbFBpbmNoLnRvdWNoZXNbMF0uaWRlbnRpZmllciAmJiB0b3VjaGVzWzBdLmlkZW50aWZpZXIgPT09IHRoaXMuX2luaXRpYWxQaW5jaC50b3VjaGVzWzFdLmlkZW50aWZpZXIgPyBnZXRQaW5jaFByb3BzKHRvdWNoZXMucmV2ZXJzZSgpKSAvLyB0aGUgdG91Y2hlcyBoYXZlIHNvbWVob3cgY2hhbmdlZCBvcmRlclxuXHRcdDogZ2V0UGluY2hQcm9wcyh0b3VjaGVzKTsgLy8gc29tZXRoaW5nIGlzIHdyb25nLCBidXQgd2Ugc3RpbGwgaGF2ZSB0d28gdG91Y2gtcG9pbnRzLCBzbyB3ZSB0cnkgbm90IHRvIGZhaWxcblxuXHRcdGN1cnJlbnRQaW5jaC5kaXNwbGFjZW1lbnQgPSB7XG5cdFx0XHR4OiBjdXJyZW50UGluY2guY2VudGVyLnggLSB0aGlzLl9pbml0aWFsUGluY2guY2VudGVyLngsXG5cdFx0XHR5OiBjdXJyZW50UGluY2guY2VudGVyLnkgLSB0aGlzLl9pbml0aWFsUGluY2guY2VudGVyLnlcblx0XHR9O1xuXG5cdFx0Y3VycmVudFBpbmNoLnRpbWUgPSBEYXRlLm5vdygpO1xuXHRcdHZhciB0aW1lU2luY2VMYXN0UGluY2ggPSBjdXJyZW50UGluY2gudGltZSAtIHRoaXMuX2xhc3RQaW5jaC50aW1lO1xuXG5cdFx0Y3VycmVudFBpbmNoLmRpc3BsYWNlbWVudFZlbG9jaXR5ID0ge1xuXHRcdFx0eDogKGN1cnJlbnRQaW5jaC5kaXNwbGFjZW1lbnQueCAtIHRoaXMuX2xhc3RQaW5jaC5kaXNwbGFjZW1lbnQueCkgLyB0aW1lU2luY2VMYXN0UGluY2gsXG5cdFx0XHR5OiAoY3VycmVudFBpbmNoLmRpc3BsYWNlbWVudC55IC0gdGhpcy5fbGFzdFBpbmNoLmRpc3BsYWNlbWVudC55KSAvIHRpbWVTaW5jZUxhc3RQaW5jaFxuXHRcdH07XG5cblx0XHRjdXJyZW50UGluY2gucm90YXRpb24gPSBjdXJyZW50UGluY2guYW5nbGUgLSB0aGlzLl9pbml0aWFsUGluY2guYW5nbGU7XG5cdFx0Y3VycmVudFBpbmNoLnJvdGF0aW9uVmVsb2NpdHkgPSBjdXJyZW50UGluY2gucm90YXRpb24gLSB0aGlzLl9sYXN0UGluY2gucm90YXRpb24gLyB0aW1lU2luY2VMYXN0UGluY2g7XG5cblx0XHRjdXJyZW50UGluY2guem9vbSA9IGN1cnJlbnRQaW5jaC5kaXN0YW5jZSAvIHRoaXMuX2luaXRpYWxQaW5jaC5kaXN0YW5jZTtcblx0XHRjdXJyZW50UGluY2guem9vbVZlbG9jaXR5ID0gKGN1cnJlbnRQaW5jaC56b29tIC0gdGhpcy5fbGFzdFBpbmNoLnpvb20pIC8gdGltZVNpbmNlTGFzdFBpbmNoO1xuXG5cdFx0dGhpcy5wcm9wcy5vblBpbmNoTW92ZSAmJiB0aGlzLnByb3BzLm9uUGluY2hNb3ZlKGN1cnJlbnRQaW5jaCwgZXZlbnQpO1xuXG5cdFx0dGhpcy5fbGFzdFBpbmNoID0gY3VycmVudFBpbmNoO1xuXHR9LFxuXG5cdG9uUGluY2hFbmQ6IGZ1bmN0aW9uIG9uUGluY2hFbmQoZXZlbnQpIHtcblx0XHQvLyBUT0RPIHVzZSBoZWxwZXIgdG8gb3JkZXIgdG91Y2hlcyBieSBpZGVudGlmaWVyIGFuZCB1c2UgYWN0dWFsIHZhbHVlcyBvbiB0b3VjaEVuZC5cblx0XHR2YXIgY3VycmVudFBpbmNoID0gX2V4dGVuZHMoe30sIHRoaXMuX2xhc3RQaW5jaCk7XG5cdFx0Y3VycmVudFBpbmNoLnRpbWUgPSBEYXRlLm5vdygpO1xuXG5cdFx0aWYgKGN1cnJlbnRQaW5jaC50aW1lIC0gdGhpcy5fbGFzdFBpbmNoLnRpbWUgPiAxNikge1xuXHRcdFx0Y3VycmVudFBpbmNoLmRpc3BsYWNlbWVudFZlbG9jaXR5ID0gMDtcblx0XHRcdGN1cnJlbnRQaW5jaC5yb3RhdGlvblZlbG9jaXR5ID0gMDtcblx0XHRcdGN1cnJlbnRQaW5jaC56b29tVmVsb2NpdHkgPSAwO1xuXHRcdH1cblxuXHRcdHRoaXMucHJvcHMub25QaW5jaEVuZCAmJiB0aGlzLnByb3BzLm9uUGluY2hFbmQoY3VycmVudFBpbmNoLCBldmVudCk7XG5cblx0XHR0aGlzLl9pbml0aWFsUGluY2ggPSB0aGlzLl9sYXN0UGluY2ggPSBudWxsO1xuXG5cdFx0Ly8gSWYgb25lIGZpbmdlciBpcyBzdGlsbCBvbiBzY3JlZW4sIGl0IHNob3VsZCBzdGFydCBhIG5ldyB0b3VjaCBldmVudCBmb3Igc3dpcGluZyBldGNcblx0XHQvLyBCdXQgaXQgc2hvdWxkIG5ldmVyIGZpcmUgYW4gb25UYXAgb3Igb25QcmVzcyBldmVudC5cblx0XHQvLyBTaW5jZSB0aGVyZSBpcyBubyBzdXBwb3J0IHN3aXBlcyB5ZXQsIHRoaXMgc2hvdWxkIGJlIGRpc3JlZ2FyZGVkIGZvciBub3dcblx0XHQvLyBpZiAoZXZlbnQudG91Y2hlcy5sZW5ndGggPT09IDEpIHtcblx0XHQvLyBcdHRoaXMub25Ub3VjaFN0YXJ0KGV2ZW50KTtcblx0XHQvLyB9XG5cdH0sXG5cblx0aW5pdFNjcm9sbERldGVjdGlvbjogZnVuY3Rpb24gaW5pdFNjcm9sbERldGVjdGlvbigpIHtcblx0XHR0aGlzLl9zY3JvbGxQb3MgPSB7IHRvcDogMCwgbGVmdDogMCB9O1xuXHRcdHRoaXMuX3Njcm9sbFBhcmVudHMgPSBbXTtcblx0XHR0aGlzLl9zY3JvbGxQYXJlbnRQb3MgPSBbXTtcblx0XHR2YXIgbm9kZSA9IHRoaXMuZ2V0RE9NTm9kZSgpO1xuXHRcdHdoaWxlIChub2RlKSB7XG5cdFx0XHRpZiAobm9kZS5zY3JvbGxIZWlnaHQgPiBub2RlLm9mZnNldEhlaWdodCB8fCBub2RlLnNjcm9sbFdpZHRoID4gbm9kZS5vZmZzZXRXaWR0aCkge1xuXHRcdFx0XHR0aGlzLl9zY3JvbGxQYXJlbnRzLnB1c2gobm9kZSk7XG5cdFx0XHRcdHRoaXMuX3Njcm9sbFBhcmVudFBvcy5wdXNoKG5vZGUuc2Nyb2xsVG9wICsgbm9kZS5zY3JvbGxMZWZ0KTtcblx0XHRcdFx0dGhpcy5fc2Nyb2xsUG9zLnRvcCArPSBub2RlLnNjcm9sbFRvcDtcblx0XHRcdFx0dGhpcy5fc2Nyb2xsUG9zLmxlZnQgKz0gbm9kZS5zY3JvbGxMZWZ0O1xuXHRcdFx0fVxuXHRcdFx0bm9kZSA9IG5vZGUucGFyZW50Tm9kZTtcblx0XHR9XG5cdH0sXG5cblx0Y2FsY3VsYXRlTW92ZW1lbnQ6IGZ1bmN0aW9uIGNhbGN1bGF0ZU1vdmVtZW50KHRvdWNoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHg6IE1hdGguYWJzKHRvdWNoLmNsaWVudFggLSB0aGlzLl9pbml0aWFsVG91Y2guY2xpZW50WCksXG5cdFx0XHR5OiBNYXRoLmFicyh0b3VjaC5jbGllbnRZIC0gdGhpcy5faW5pdGlhbFRvdWNoLmNsaWVudFkpXG5cdFx0fTtcblx0fSxcblxuXHRkZXRlY3RTY3JvbGw6IGZ1bmN0aW9uIGRldGVjdFNjcm9sbCgpIHtcblx0XHR2YXIgY3VycmVudFNjcm9sbFBvcyA9IHsgdG9wOiAwLCBsZWZ0OiAwIH07XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9zY3JvbGxQYXJlbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRjdXJyZW50U2Nyb2xsUG9zLnRvcCArPSB0aGlzLl9zY3JvbGxQYXJlbnRzW2ldLnNjcm9sbFRvcDtcblx0XHRcdGN1cnJlbnRTY3JvbGxQb3MubGVmdCArPSB0aGlzLl9zY3JvbGxQYXJlbnRzW2ldLnNjcm9sbExlZnQ7XG5cdFx0fVxuXHRcdHJldHVybiAhKGN1cnJlbnRTY3JvbGxQb3MudG9wID09PSB0aGlzLl9zY3JvbGxQb3MudG9wICYmIGN1cnJlbnRTY3JvbGxQb3MubGVmdCA9PT0gdGhpcy5fc2Nyb2xsUG9zLmxlZnQpO1xuXHR9LFxuXG5cdGNsZWFudXBTY3JvbGxEZXRlY3Rpb246IGZ1bmN0aW9uIGNsZWFudXBTY3JvbGxEZXRlY3Rpb24oKSB7XG5cdFx0dGhpcy5fc2Nyb2xsUGFyZW50cyA9IHVuZGVmaW5lZDtcblx0XHR0aGlzLl9zY3JvbGxQb3MgPSB1bmRlZmluZWQ7XG5cdH0sXG5cblx0aW5pdFByZXNzRGV0ZWN0aW9uOiBmdW5jdGlvbiBpbml0UHJlc3NEZXRlY3Rpb24oZXZlbnQsIGNhbGxiYWNrKSB7XG5cdFx0aWYgKCF0aGlzLnByb3BzLm9uUHJlc3MpIHJldHVybjtcblx0XHR0aGlzLl9wcmVzc1RpbWVvdXQgPSBzZXRUaW1lb3V0KChmdW5jdGlvbiAoKSB7XG5cdFx0XHR0aGlzLnByb3BzLm9uUHJlc3MoZXZlbnQpO1xuXHRcdFx0Y2FsbGJhY2soKTtcblx0XHR9KS5iaW5kKHRoaXMpLCB0aGlzLnByb3BzLnByZXNzRGVsYXkpO1xuXHR9LFxuXG5cdGNhbmNlbFByZXNzRGV0ZWN0aW9uOiBmdW5jdGlvbiBjYW5jZWxQcmVzc0RldGVjdGlvbigpIHtcblx0XHRjbGVhclRpbWVvdXQodGhpcy5fcHJlc3NUaW1lb3V0KTtcblx0fSxcblxuXHRvblRvdWNoTW92ZTogZnVuY3Rpb24gb25Ub3VjaE1vdmUoZXZlbnQpIHtcblx0XHRpZiAodGhpcy5faW5pdGlhbFRvdWNoKSB7XG5cdFx0XHR0aGlzLnByb2Nlc3NFdmVudChldmVudCk7XG5cblx0XHRcdGlmICh0aGlzLmRldGVjdFNjcm9sbCgpKSByZXR1cm4gdGhpcy5lbmRUb3VjaChldmVudCk7XG5cblx0XHRcdHRoaXMucHJvcHMub25Ub3VjaE1vdmUgJiYgdGhpcy5wcm9wcy5vblRvdWNoTW92ZShldmVudCk7XG5cdFx0XHR0aGlzLl9sYXN0VG91Y2ggPSBnZXRUb3VjaFByb3BzKGV2ZW50LnRvdWNoZXNbMF0pO1xuXHRcdFx0dmFyIG1vdmVtZW50ID0gdGhpcy5jYWxjdWxhdGVNb3ZlbWVudCh0aGlzLl9sYXN0VG91Y2gpO1xuXHRcdFx0aWYgKG1vdmVtZW50LnggPiB0aGlzLnByb3BzLnByZXNzTW92ZVRocmVzaG9sZCB8fCBtb3ZlbWVudC55ID4gdGhpcy5wcm9wcy5wcmVzc01vdmVUaHJlc2hvbGQpIHtcblx0XHRcdFx0dGhpcy5jYW5jZWxQcmVzc0RldGVjdGlvbigpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKG1vdmVtZW50LnggPiB0aGlzLnByb3BzLm1vdmVUaHJlc2hvbGQgfHwgbW92ZW1lbnQueSA+IHRoaXMucHJvcHMubW92ZVRocmVzaG9sZCkge1xuXHRcdFx0XHRpZiAodGhpcy5zdGF0ZS5pc0FjdGl2ZSkge1xuXHRcdFx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRcdFx0aXNBY3RpdmU6IGZhbHNlXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0gZWxzZSBpZiAodGhpcy5fYWN0aXZlVGltZW91dCkge1xuXHRcdFx0XHRcdHRoaXMuY2xlYXJBY3RpdmVUaW1lb3V0KCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmICghdGhpcy5zdGF0ZS5pc0FjdGl2ZSAmJiAhdGhpcy5fYWN0aXZlVGltZW91dCkge1xuXHRcdFx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRcdFx0aXNBY3RpdmU6IHRydWVcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAodGhpcy5faW5pdGlhbFBpbmNoICYmIGV2ZW50LnRvdWNoZXMubGVuZ3RoID09PSAyKSB7XG5cdFx0XHR0aGlzLm9uUGluY2hNb3ZlKGV2ZW50KTtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0fVxuXHR9LFxuXG5cdG9uVG91Y2hFbmQ6IGZ1bmN0aW9uIG9uVG91Y2hFbmQoZXZlbnQpIHtcblx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXG5cdFx0aWYgKHRoaXMuX2luaXRpYWxUb3VjaCkge1xuXHRcdFx0dGhpcy5wcm9jZXNzRXZlbnQoZXZlbnQpO1xuXHRcdFx0dmFyIGFmdGVyRW5kVG91Y2g7XG5cdFx0XHR2YXIgbW92ZW1lbnQgPSB0aGlzLmNhbGN1bGF0ZU1vdmVtZW50KHRoaXMuX2xhc3RUb3VjaCk7XG5cdFx0XHRpZiAobW92ZW1lbnQueCA8PSB0aGlzLnByb3BzLm1vdmVUaHJlc2hvbGQgJiYgbW92ZW1lbnQueSA8PSB0aGlzLnByb3BzLm1vdmVUaHJlc2hvbGQgJiYgdGhpcy5wcm9wcy5vblRhcCkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRhZnRlckVuZFRvdWNoID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHZhciBmaW5hbFBhcmVudFNjcm9sbFBvcyA9IF90aGlzLl9zY3JvbGxQYXJlbnRzLm1hcChmdW5jdGlvbiAobm9kZSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIG5vZGUuc2Nyb2xsVG9wICsgbm9kZS5zY3JvbGxMZWZ0O1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHZhciBzdG9wcGVkTW9tZW50dW1TY3JvbGwgPSBfdGhpcy5fc2Nyb2xsUGFyZW50UG9zLnNvbWUoZnVuY3Rpb24gKGVuZCwgaSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGVuZCAhPT0gZmluYWxQYXJlbnRTY3JvbGxQb3NbaV07XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0aWYgKCFzdG9wcGVkTW9tZW50dW1TY3JvbGwpIHtcblx0XHRcdFx0XHRcdF90aGlzLnByb3BzLm9uVGFwKGV2ZW50KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHR0aGlzLmVuZFRvdWNoKGV2ZW50LCBhZnRlckVuZFRvdWNoKTtcblx0XHR9IGVsc2UgaWYgKHRoaXMuX2luaXRpYWxQaW5jaCAmJiBldmVudC50b3VjaGVzLmxlbmd0aCArIGV2ZW50LmNoYW5nZWRUb3VjaGVzLmxlbmd0aCA9PT0gMikge1xuXHRcdFx0dGhpcy5vblBpbmNoRW5kKGV2ZW50KTtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0fVxuXHR9LFxuXG5cdGVuZFRvdWNoOiBmdW5jdGlvbiBlbmRUb3VjaChldmVudCwgY2FsbGJhY2spIHtcblx0XHR0aGlzLmNhbmNlbFByZXNzRGV0ZWN0aW9uKCk7XG5cdFx0dGhpcy5jbGVhckFjdGl2ZVRpbWVvdXQoKTtcblx0XHRpZiAoZXZlbnQgJiYgdGhpcy5wcm9wcy5vblRvdWNoRW5kKSB7XG5cdFx0XHR0aGlzLnByb3BzLm9uVG91Y2hFbmQoZXZlbnQpO1xuXHRcdH1cblx0XHR0aGlzLl9pbml0aWFsVG91Y2ggPSBudWxsO1xuXHRcdHRoaXMuX2xhc3RUb3VjaCA9IG51bGw7XG5cdFx0aWYgKGNhbGxiYWNrKSB7XG5cdFx0XHRjYWxsYmFjaygpO1xuXHRcdH1cblx0XHRpZiAodGhpcy5zdGF0ZS5pc0FjdGl2ZSkge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdGlzQWN0aXZlOiBmYWxzZVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9LFxuXG5cdG9uTW91c2VEb3duOiBmdW5jdGlvbiBvbk1vdXNlRG93bihldmVudCkge1xuXHRcdGlmICh3aW5kb3cuX2Jsb2NrTW91c2VFdmVudHMpIHtcblx0XHRcdHdpbmRvdy5fYmxvY2tNb3VzZUV2ZW50cyA9IGZhbHNlO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRpZiAodGhpcy5wcm9wcy5vbk1vdXNlRG93biAmJiB0aGlzLnByb3BzLm9uTW91c2VEb3duKGV2ZW50KSA9PT0gZmFsc2UpIHJldHVybjtcblx0XHR0aGlzLnByb2Nlc3NFdmVudChldmVudCk7XG5cdFx0dGhpcy5pbml0UHJlc3NEZXRlY3Rpb24oZXZlbnQsIHRoaXMuZW5kTW91c2VFdmVudCk7XG5cdFx0dGhpcy5fbW91c2VEb3duID0gdHJ1ZTtcblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdGlzQWN0aXZlOiB0cnVlXG5cdFx0fSk7XG5cdH0sXG5cblx0b25Nb3VzZU1vdmU6IGZ1bmN0aW9uIG9uTW91c2VNb3ZlKGV2ZW50KSB7XG5cdFx0aWYgKHdpbmRvdy5fYmxvY2tNb3VzZUV2ZW50cyB8fCAhdGhpcy5fbW91c2VEb3duKSByZXR1cm47XG5cdFx0dGhpcy5wcm9jZXNzRXZlbnQoZXZlbnQpO1xuXHRcdHRoaXMucHJvcHMub25Nb3VzZU1vdmUgJiYgdGhpcy5wcm9wcy5vbk1vdXNlTW92ZShldmVudCk7XG5cdH0sXG5cblx0b25Nb3VzZVVwOiBmdW5jdGlvbiBvbk1vdXNlVXAoZXZlbnQpIHtcblx0XHRpZiAod2luZG93Ll9ibG9ja01vdXNlRXZlbnRzIHx8ICF0aGlzLl9tb3VzZURvd24pIHJldHVybjtcblx0XHR0aGlzLnByb2Nlc3NFdmVudChldmVudCk7XG5cdFx0dGhpcy5wcm9wcy5vbk1vdXNlVXAgJiYgdGhpcy5wcm9wcy5vbk1vdXNlVXAoZXZlbnQpO1xuXHRcdHRoaXMucHJvcHMub25UYXAgJiYgdGhpcy5wcm9wcy5vblRhcChldmVudCk7XG5cdFx0dGhpcy5lbmRNb3VzZUV2ZW50KCk7XG5cdH0sXG5cblx0b25Nb3VzZU91dDogZnVuY3Rpb24gb25Nb3VzZU91dChldmVudCkge1xuXHRcdGlmICh3aW5kb3cuX2Jsb2NrTW91c2VFdmVudHMgfHwgIXRoaXMuX21vdXNlRG93bikgcmV0dXJuO1xuXHRcdHRoaXMucHJvY2Vzc0V2ZW50KGV2ZW50KTtcblx0XHR0aGlzLnByb3BzLm9uTW91c2VPdXQgJiYgdGhpcy5wcm9wcy5vbk1vdXNlT3V0KGV2ZW50KTtcblx0XHR0aGlzLmVuZE1vdXNlRXZlbnQoKTtcblx0fSxcblxuXHRlbmRNb3VzZUV2ZW50OiBmdW5jdGlvbiBlbmRNb3VzZUV2ZW50KCkge1xuXHRcdHRoaXMuY2FuY2VsUHJlc3NEZXRlY3Rpb24oKTtcblx0XHR0aGlzLl9tb3VzZURvd24gPSBmYWxzZTtcblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdGlzQWN0aXZlOiBmYWxzZVxuXHRcdH0pO1xuXHR9LFxuXG5cdGNhbmNlbFRhcDogZnVuY3Rpb24gY2FuY2VsVGFwKCkge1xuXHRcdHRoaXMuZW5kVG91Y2goKTtcblx0XHR0aGlzLl9tb3VzZURvd24gPSBmYWxzZTtcblx0fSxcblxuXHR0b3VjaFN0eWxlczogZnVuY3Rpb24gdG91Y2hTdHlsZXMoKSB7XG5cdFx0cmV0dXJuIFRPVUNIX1NUWUxFUztcblx0fSxcblxuXHRoYW5kbGVyczogZnVuY3Rpb24gaGFuZGxlcnMoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdG9uVG91Y2hTdGFydDogdGhpcy5vblRvdWNoU3RhcnQsXG5cdFx0XHRvblRvdWNoTW92ZTogdGhpcy5vblRvdWNoTW92ZSxcblx0XHRcdG9uVG91Y2hFbmQ6IHRoaXMub25Ub3VjaEVuZCxcblx0XHRcdG9uTW91c2VEb3duOiB0aGlzLm9uTW91c2VEb3duLFxuXHRcdFx0b25Nb3VzZVVwOiB0aGlzLm9uTW91c2VVcCxcblx0XHRcdG9uTW91c2VNb3ZlOiB0aGlzLm9uTW91c2VNb3ZlLFxuXHRcdFx0b25Nb3VzZU91dDogdGhpcy5vbk1vdXNlT3V0XG5cdFx0fTtcblx0fVxufTtcblxuLyoqXG4gKiBUYXBwYWJsZSBDb21wb25lbnRcbiAqID09PT09PT09PT09PT09PT09PVxuICovXG5cbnZhciBDb21wb25lbnQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0ZGlzcGxheU5hbWU6ICdUYXBwYWJsZScsXG5cblx0bWl4aW5zOiBbTWl4aW5dLFxuXG5cdHByb3BUeXBlczoge1xuXHRcdGNvbXBvbmVudDogUmVhY3QuUHJvcFR5cGVzLmFueSwgLy8gY29tcG9uZW50IHRvIGNyZWF0ZVxuXHRcdGNsYXNzTmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZywgLy8gb3B0aW9uYWwgY2xhc3NOYW1lXG5cdFx0Y2xhc3NCYXNlOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLCAvLyBiYXNlIGZvciBnZW5lcmF0ZWQgY2xhc3NOYW1lc1xuXHRcdHN0eWxlOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LCAvLyBhZGRpdGlvbmFsIHN0eWxlIHByb3BlcnRpZXMgZm9yIHRoZSBjb21wb25lbnRcblx0XHRkaXNhYmxlZDogUmVhY3QuUHJvcFR5cGVzLmJvb2wgLy8gb25seSBhcHBsaWVzIHRvIGJ1dHRvbnNcblx0fSxcblxuXHRnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uIGdldERlZmF1bHRQcm9wcygpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0Y29tcG9uZW50OiAnc3BhbicsXG5cdFx0XHRjbGFzc0Jhc2U6ICdUYXBwYWJsZSdcblx0XHR9O1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdHZhciBwcm9wcyA9IHRoaXMucHJvcHM7XG5cdFx0dmFyIGNsYXNzTmFtZSA9IHByb3BzLmNsYXNzQmFzZSArICh0aGlzLnN0YXRlLmlzQWN0aXZlID8gJy1hY3RpdmUnIDogJy1pbmFjdGl2ZScpO1xuXG5cdFx0aWYgKHByb3BzLmNsYXNzTmFtZSkge1xuXHRcdFx0Y2xhc3NOYW1lICs9ICcgJyArIHByb3BzLmNsYXNzTmFtZTtcblx0XHR9XG5cblx0XHR2YXIgc3R5bGUgPSB7fTtcblx0XHRfZXh0ZW5kcyhzdHlsZSwgdGhpcy50b3VjaFN0eWxlcygpLCBwcm9wcy5zdHlsZSk7XG5cblx0XHR2YXIgbmV3Q29tcG9uZW50UHJvcHMgPSBfZXh0ZW5kcyh7fSwgcHJvcHMsIHtcblx0XHRcdHN0eWxlOiBzdHlsZSxcblx0XHRcdGNsYXNzTmFtZTogY2xhc3NOYW1lLFxuXHRcdFx0ZGlzYWJsZWQ6IHByb3BzLmRpc2FibGVkLFxuXHRcdFx0aGFuZGxlcnM6IHRoaXMuaGFuZGxlcnNcblx0XHR9LCB0aGlzLmhhbmRsZXJzKCkpO1xuXG5cdFx0ZGVsZXRlIG5ld0NvbXBvbmVudFByb3BzLm9uVGFwO1xuXHRcdGRlbGV0ZSBuZXdDb21wb25lbnRQcm9wcy5vblByZXNzO1xuXHRcdGRlbGV0ZSBuZXdDb21wb25lbnRQcm9wcy5vblBpbmNoU3RhcnQ7XG5cdFx0ZGVsZXRlIG5ld0NvbXBvbmVudFByb3BzLm9uUGluY2hNb3ZlO1xuXHRcdGRlbGV0ZSBuZXdDb21wb25lbnRQcm9wcy5vblBpbmNoRW5kO1xuXHRcdGRlbGV0ZSBuZXdDb21wb25lbnRQcm9wcy5tb3ZlVGhyZXNob2xkO1xuXHRcdGRlbGV0ZSBuZXdDb21wb25lbnRQcm9wcy5wcmVzc0RlbGF5O1xuXHRcdGRlbGV0ZSBuZXdDb21wb25lbnRQcm9wcy5wcmVzc01vdmVUaHJlc2hvbGQ7XG5cdFx0ZGVsZXRlIG5ld0NvbXBvbmVudFByb3BzLnByZXZlbnREZWZhdWx0O1xuXHRcdGRlbGV0ZSBuZXdDb21wb25lbnRQcm9wcy5zdG9wUHJvcGFnYXRpb247XG5cdFx0ZGVsZXRlIG5ld0NvbXBvbmVudFByb3BzLmNvbXBvbmVudDtcblxuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KHByb3BzLmNvbXBvbmVudCwgbmV3Q29tcG9uZW50UHJvcHMsIHByb3BzLmNoaWxkcmVuKTtcblx0fVxufSk7XG5cbkNvbXBvbmVudC5NaXhpbiA9IE1peGluO1xuQ29tcG9uZW50LnRvdWNoU3R5bGVzID0gVE9VQ0hfU1RZTEVTO1xubW9kdWxlLmV4cG9ydHMgPSBDb21wb25lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBHTE9CQUwgPSBnbG9iYWwgfHwgd2luZG93O1xuXG5mdW5jdGlvbiBjbGVhclRpbWVycygpIHtcbiAgdGhpcy5jbGVhckludGVydmFscygpO1xuICB0aGlzLmNsZWFyVGltZW91dHMoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBUaW1lcnMoKSB7XG4gIHZhciBpbnRlcnZhbHMgPSB1bmRlZmluZWQsXG4gICAgICB0aW1lb3V0cyA9IHVuZGVmaW5lZDtcblxuICByZXR1cm4ge1xuICAgIGNsZWFySW50ZXJ2YWxzOiBmdW5jdGlvbiBjbGVhckludGVydmFscygpIHtcbiAgICAgIGludGVydmFscy5mb3JFYWNoKEdMT0JBTC5jbGVhckludGVydmFsKTtcbiAgICB9LFxuICAgIGNsZWFyVGltZW91dHM6IGZ1bmN0aW9uIGNsZWFyVGltZW91dHMoKSB7XG4gICAgICB0aW1lb3V0cy5mb3JFYWNoKEdMT0JBTC5jbGVhclRpbWVvdXQpO1xuICAgIH0sXG4gICAgY2xlYXJJbnRlcnZhbDogZnVuY3Rpb24gY2xlYXJJbnRlcnZhbCgpIHtcbiAgICAgIHJldHVybiBHTE9CQUwuY2xlYXJJbnRlcnZhbC5hcHBseShHTE9CQUwsIGFyZ3VtZW50cyk7XG4gICAgfSxcbiAgICBjbGVhclRpbWVvdXQ6IGZ1bmN0aW9uIGNsZWFyVGltZW91dCgpIHtcbiAgICAgIHJldHVybiBHTE9CQUwuY2xlYXJUaW1lb3V0LmFwcGx5KEdMT0JBTCwgYXJndW1lbnRzKTtcbiAgICB9LFxuICAgIGNsZWFyVGltZXJzOiBjbGVhclRpbWVycyxcblxuICAgIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24gY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgICAgaW50ZXJ2YWxzID0gW107XG4gICAgICB0aW1lb3V0cyA9IFtdO1xuICAgIH0sXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQ6IGNsZWFyVGltZXJzLFxuXG4gICAgc2V0SW50ZXJ2YWw6IGZ1bmN0aW9uIHNldEludGVydmFsKGNhbGxiYWNrKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4gPiAxID8gX2xlbiAtIDEgOiAwKSwgX2tleSA9IDE7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgICAgYXJnc1tfa2V5IC0gMV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBpbnRlcnZhbHNbaW50ZXJ2YWxzLnB1c2goR0xPQkFMLnNldEludGVydmFsLmFwcGx5KEdMT0JBTCwgW2Z1bmN0aW9uICgpIHtcbiAgICAgICAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBwYXJhbXMgPSBBcnJheShfbGVuMiksIF9rZXkyID0gMDsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgICAgICAgIHBhcmFtc1tfa2V5Ml0gPSBhcmd1bWVudHNbX2tleTJdO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FsbGJhY2suY2FsbC5hcHBseShjYWxsYmFjaywgW190aGlzXS5jb25jYXQocGFyYW1zKSk7XG4gICAgICB9XS5jb25jYXQoYXJncykpKSAtIDFdO1xuICAgIH0sXG4gICAgc2V0VGltZW91dDogZnVuY3Rpb24gc2V0VGltZW91dChjYWxsYmFjaykge1xuICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgIGZvciAodmFyIF9sZW4zID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4zID4gMSA/IF9sZW4zIC0gMSA6IDApLCBfa2V5MyA9IDE7IF9rZXkzIDwgX2xlbjM7IF9rZXkzKyspIHtcbiAgICAgICAgYXJnc1tfa2V5MyAtIDFdID0gYXJndW1lbnRzW19rZXkzXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRpbWVvdXRzW3RpbWVvdXRzLnB1c2goR0xPQkFMLnNldFRpbWVvdXQuYXBwbHkoR0xPQkFMLCBbZnVuY3Rpb24gKCkge1xuICAgICAgICBmb3IgKHZhciBfbGVuNCA9IGFyZ3VtZW50cy5sZW5ndGgsIHBhcmFtcyA9IEFycmF5KF9sZW40KSwgX2tleTQgPSAwOyBfa2V5NCA8IF9sZW40OyBfa2V5NCsrKSB7XG4gICAgICAgICAgcGFyYW1zW19rZXk0XSA9IGFyZ3VtZW50c1tfa2V5NF07XG4gICAgICAgIH1cblxuICAgICAgICBjYWxsYmFjay5jYWxsLmFwcGx5KGNhbGxiYWNrLCBbX3RoaXMyXS5jb25jYXQocGFyYW1zKSk7XG4gICAgICB9XS5jb25jYXQoYXJncykpKSAtIDFdO1xuICAgIH1cbiAgfTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG5cdHZhbHVlOiB0cnVlXG59KTtcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgQ29udGFpbmVyID0gcmVxdWlyZSgncmVhY3QtY29udGFpbmVyJyk7XG5cbnZhciBFcnJvclZpZXcgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnRXJyb3JWaWV3JyxcblxuXHRwcm9wVHlwZXM6IHtcblx0XHRjaGlsZHJlbjogUmVhY3QuUHJvcFR5cGVzLm5vZGVcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdENvbnRhaW5lcixcblx0XHRcdHsgZmlsbDogdHJ1ZSwgY2xhc3NOYW1lOiBcIlZpZXcgRXJyb3JWaWV3XCIgfSxcblx0XHRcdHRoaXMucHJvcHMuY2hpbGRyZW5cblx0XHQpO1xuXHR9XG59KTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gRXJyb3JWaWV3O1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG5cdHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxudmFyIGJsYWNrbGlzdCA9IHJlcXVpcmUoJ2JsYWNrbGlzdCcpO1xudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBUYXBwYWJsZSA9IHJlcXVpcmUoJ3JlYWN0LXRhcHBhYmxlJyk7XG52YXIgVHJhbnNpdGlvbnMgPSByZXF1aXJlKCcuLi9taXhpbnMvVHJhbnNpdGlvbnMnKTtcblxudmFyIExpbmsgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnTGluaycsXG5cblx0bWl4aW5zOiBbVHJhbnNpdGlvbnNdLFxuXHRwcm9wVHlwZXM6IHtcblx0XHRjaGlsZHJlbjogUmVhY3QuUHJvcFR5cGVzLmFueSxcblx0XHRvcHRpb25zOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuXHRcdHRyYW5zaXRpb246IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdFx0dG86IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdFx0dmlld1Byb3BzOiBSZWFjdC5Qcm9wVHlwZXMuYW55XG5cdH0sXG5cblx0ZG9UcmFuc2l0aW9uOiBmdW5jdGlvbiBkb1RyYW5zaXRpb24oKSB7XG5cdFx0dmFyIG9wdGlvbnMgPSBfZXh0ZW5kcyh7IHZpZXdQcm9wczogdGhpcy5wcm9wcy52aWV3UHJvcHMsIHRyYW5zaXRpb246IHRoaXMucHJvcHMudHJhbnNpdGlvbiB9LCB0aGlzLnByb3BzLm9wdGlvbnMpO1xuXHRcdGNvbnNvbGUuaW5mbygnTGluayB0byBcIicgKyB0aGlzLnByb3BzLnRvICsgJ1wiIHVzaW5nIHRyYW5zaXRpb24gXCInICsgdGhpcy5wcm9wcy50cmFuc2l0aW9uICsgJ1wiJyArICcgd2l0aCBwcm9wcyAnLCB0aGlzLnByb3BzLnZpZXdQcm9wcyk7XG5cdFx0dGhpcy50cmFuc2l0aW9uVG8odGhpcy5wcm9wcy50bywgb3B0aW9ucyk7XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0dmFyIHRhcHBhYmxlUHJvcHMgPSBibGFja2xpc3QodGhpcy5wcm9wcywgJ2NoaWxkcmVuJywgJ29wdGlvbnMnLCAndHJhbnNpdGlvbicsICd2aWV3UHJvcHMnKTtcblxuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0VGFwcGFibGUsXG5cdFx0XHRfZXh0ZW5kcyh7IG9uVGFwOiB0aGlzLmRvVHJhbnNpdGlvbiB9LCB0YXBwYWJsZVByb3BzKSxcblx0XHRcdHRoaXMucHJvcHMuY2hpbGRyZW5cblx0XHQpO1xuXHR9XG59KTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gTGluaztcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuXHR2YWx1ZTogdHJ1ZVxufSk7XG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgVmlldyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6ICdWaWV3JyxcblxuXHRwcm9wVHlwZXM6IHtcblx0XHRjb21wb25lbnQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG5cdFx0bmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkXG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdHRocm93IG5ldyBFcnJvcignVG91Y2hzdG9uZUpTIDxWaWV3PiBzaG91bGQgbm90IGJlIHJlbmRlcmVkIGRpcmVjdGx5LicpO1xuXHR9XG59KTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gVmlldztcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuXHR2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbnZhciBibGFja2xpc3QgPSByZXF1aXJlKCdibGFja2xpc3QnKTtcbnZhciBjbGFzc05hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xudmFyIEVycm9yVmlldyA9IHJlcXVpcmUoJy4vRXJyb3JWaWV3Jyk7XG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdC9hZGRvbnMnKTtcbnZhciBUcmFuc2l0aW9uID0gUmVhY3QuYWRkb25zLkNTU1RyYW5zaXRpb25Hcm91cDtcblxuZnVuY3Rpb24gY3JlYXRlVmlld3NGcm9tQ2hpbGRyZW4oY2hpbGRyZW4pIHtcblx0dmFyIHZpZXdzID0ge307XG5cdFJlYWN0LkNoaWxkcmVuLmZvckVhY2goY2hpbGRyZW4sIGZ1bmN0aW9uICh2aWV3KSB7XG5cdFx0dmlld3Nbdmlldy5wcm9wcy5uYW1lXSA9IHZpZXc7XG5cdH0pO1xuXHRyZXR1cm4gdmlld3M7XG59XG5cbnZhciBWaWV3Q29udGFpbmVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogJ1ZpZXdDb250YWluZXInLFxuXG5cdHN0YXRpY3M6IHtcblx0XHRzaG91bGRGaWxsVmVydGljYWxTcGFjZTogdHJ1ZVxuXHR9LFxuXHRwcm9wVHlwZXM6IHtcblx0XHRjaGlsZHJlbjogUmVhY3QuUHJvcFR5cGVzLm5vZGVcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0dmFyIHByb3BzID0gYmxhY2tsaXN0KHRoaXMucHJvcHMsICdjaGlsZHJlbicpO1xuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0J2RpdicsXG5cdFx0XHRwcm9wcyxcblx0XHRcdHRoaXMucHJvcHMuY2hpbGRyZW5cblx0XHQpO1xuXHR9XG59KTtcblxudmFyIFZpZXdNYW5hZ2VyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogJ1ZpZXdNYW5hZ2VyJyxcblxuXHRzdGF0aWNzOiB7XG5cdFx0c2hvdWxkRmlsbFZlcnRpY2FsU3BhY2U6IHRydWVcblx0fSxcblx0Y29udGV4dFR5cGVzOiB7XG5cdFx0YXBwOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWRcblx0fSxcblx0cHJvcFR5cGVzOiB7XG5cdFx0bmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0XHRjaGlsZHJlbjogUmVhY3QuUHJvcFR5cGVzLm5vZGUsXG5cdFx0Y2xhc3NOYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRcdGRlZmF1bHRWaWV3OiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRcdG9uVmlld0NoYW5nZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmNcblx0fSxcblx0Z2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiBnZXREZWZhdWx0UHJvcHMoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdG5hbWU6ICdfX2RlZmF1bHQnXG5cdFx0fTtcblx0fSxcblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHZpZXdzOiBjcmVhdGVWaWV3c0Zyb21DaGlsZHJlbih0aGlzLnByb3BzLmNoaWxkcmVuKSxcblx0XHRcdGN1cnJlbnRWaWV3OiB0aGlzLnByb3BzLmRlZmF1bHRWaWV3LFxuXHRcdFx0b3B0aW9uczoge31cblx0XHR9O1xuXHR9LFxuXHRjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG5cdFx0dGhpcy5jb250ZXh0LmFwcC52aWV3TWFuYWdlcnNbdGhpcy5wcm9wcy5uYW1lXSA9IHRoaXM7XG5cdH0sXG5cdGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcblx0XHRkZWxldGUgdGhpcy5jb250ZXh0LmFwcC52aWV3TWFuYWdlcnNbdGhpcy5wcm9wcy5uYW1lXTtcblx0fSxcblx0Y29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24gY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdHZpZXdzOiBjcmVhdGVWaWV3c0Zyb21DaGlsZHJlbih0aGlzLnByb3BzLmNoaWxkcmVuKVxuXHRcdH0pO1xuXHRcdGlmIChuZXh0UHJvcHMubmFtZSAhPT0gdGhpcy5wcm9wcy5uYW1lKSB7XG5cdFx0XHR0aGlzLmNvbnRleHQuYXBwLnZpZXdNYW5hZ2Vyc1tuZXh0UHJvcHMubmFtZV0gPSB0aGlzO1xuXHRcdFx0ZGVsZXRlIHRoaXMuY29udGV4dC5hcHAudmlld01hbmFnZXJzW3RoaXMucHJvcHMubmFtZV07XG5cdFx0fVxuXHRcdGlmIChuZXh0UHJvcHMuY3VycmVudFZpZXcgJiYgbmV4dFByb3BzLmN1cnJlbnRWaWV3ICE9PSB0aGlzLnN0YXRlLmN1cnJlbnRWaWV3KSB7XG5cdFx0XHR0aGlzLnRyYW5zaXRpb25UbyhuZXh0UHJvcHMuY3VycmVudFZpZXcsIHsgdmlld1Byb3BzOiBuZXh0UHJvcHMudmlld1Byb3BzIH0pO1xuXHRcdH1cblx0fSxcblx0dHJhbnNpdGlvblRvOiBmdW5jdGlvbiB0cmFuc2l0aW9uVG8odmlld0tleSwgb3B0aW9ucykge1xuXHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cblx0XHRpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRvcHRpb25zID0geyB0cmFuc2l0aW9uOiBvcHRpb25zIH07XG5cdFx0fVxuXHRcdGlmICghb3B0aW9ucykgb3B0aW9ucyA9IHt9O1xuXHRcdHRoaXMuYWN0aXZlVHJhbnNpdGlvbk9wdGlvbnMgPSBvcHRpb25zO1xuXHRcdHRoaXMuY29udGV4dC5hcHAudmlld01hbmFnZXJJblRyYW5zaXRpb24gPSB0aGlzO1xuXHRcdHRoaXMucHJvcHMub25WaWV3Q2hhbmdlICYmIHRoaXMucHJvcHMub25WaWV3Q2hhbmdlKHZpZXdLZXkpO1xuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0Y3VycmVudFZpZXc6IHZpZXdLZXksXG5cdFx0XHRvcHRpb25zOiBvcHRpb25zXG5cdFx0fSwgZnVuY3Rpb24gKCkge1xuXHRcdFx0ZGVsZXRlIF90aGlzLmFjdGl2ZVRyYW5zaXRpb25PcHRpb25zO1xuXHRcdFx0ZGVsZXRlIF90aGlzLmNvbnRleHQuYXBwLnZpZXdNYW5hZ2VySW5UcmFuc2l0aW9uO1xuXHRcdH0pO1xuXHR9LFxuXHRyZW5kZXJWaWV3Q29udGFpbmVyOiBmdW5jdGlvbiByZW5kZXJWaWV3Q29udGFpbmVyKCkge1xuXHRcdHZhciB2aWV3S2V5ID0gdGhpcy5zdGF0ZS5jdXJyZW50Vmlldztcblx0XHRpZiAoIXZpZXdLZXkpIHtcblx0XHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRFcnJvclZpZXcsXG5cdFx0XHRcdG51bGwsXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0J3NwYW4nLFxuXHRcdFx0XHRcdHsgY2xhc3NOYW1lOiBcIkVycm9yVmlld19faGVhZGluZ1wiIH0sXG5cdFx0XHRcdFx0J1ZpZXdNYW5hZ2VyOiAnLFxuXHRcdFx0XHRcdHRoaXMucHJvcHMubmFtZVxuXHRcdFx0XHQpLFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdCdzcGFuJyxcblx0XHRcdFx0XHR7IGNsYXNzTmFtZTogXCJFcnJvclZpZXdfX3RleHRcIiB9LFxuXHRcdFx0XHRcdCdFcnJvcjogVGhlcmUgaXMgbm8gY3VycmVudCBWaWV3Lidcblx0XHRcdFx0KVxuXHRcdFx0KTtcblx0XHR9XG5cdFx0dmFyIHZpZXcgPSB0aGlzLnN0YXRlLnZpZXdzW3ZpZXdLZXldO1xuXHRcdGlmICghdmlldyB8fCAhdmlldy5wcm9wcy5jb21wb25lbnQpIHtcblx0XHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRFcnJvclZpZXcsXG5cdFx0XHRcdG51bGwsXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0J3NwYW4nLFxuXHRcdFx0XHRcdHsgY2xhc3NOYW1lOiBcIkVycm9yVmlld19faGVhZGluZ1wiIH0sXG5cdFx0XHRcdFx0J1ZpZXdNYW5hZ2VyOiBcIicsXG5cdFx0XHRcdFx0dGhpcy5wcm9wcy5uYW1lLFxuXHRcdFx0XHRcdCdcIidcblx0XHRcdFx0KSxcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHQnc3BhbicsXG5cdFx0XHRcdFx0eyBjbGFzc05hbWU6IFwiRXJyb3JWaWV3X190ZXh0XCIgfSxcblx0XHRcdFx0XHQnVGhlIFZpZXcgXCInLFxuXHRcdFx0XHRcdHZpZXdLZXksXG5cdFx0XHRcdFx0J1wiIGlzIGludmFsaWQuJ1xuXHRcdFx0XHQpXG5cdFx0XHQpO1xuXHRcdH1cblx0XHR2YXIgb3B0aW9ucyA9IHRoaXMuc3RhdGUub3B0aW9ucyB8fCB7fTtcblx0XHR2YXIgdmlld0NsYXNzTmFtZSA9IGNsYXNzTmFtZXMoJ1ZpZXcgVmlldy0tJyArIHZpZXdLZXksIHZpZXcucHJvcHMuY2xhc3NOYW1lKTtcblx0XHR2YXIgVmlld0NvbXBvbmVudCA9IHZpZXcucHJvcHMuY29tcG9uZW50O1xuXHRcdHZhciB2aWV3UHJvcHMgPSBibGFja2xpc3Qodmlldy5wcm9wcywgJ2NvbXBvbmVudCcsICdjbGFzc05hbWUnKTtcblx0XHRfZXh0ZW5kcyh2aWV3UHJvcHMsIG9wdGlvbnMudmlld1Byb3BzKTtcblx0XHR2YXIgdmlld0VsZW1lbnQgPSBSZWFjdC5jcmVhdGVFbGVtZW50KFZpZXdDb21wb25lbnQsIHZpZXdQcm9wcyk7XG5cblx0XHRpZiAodGhpcy5fX2xhc3RSZW5kZXJlZFZpZXcgIT09IHZpZXdLZXkpIHtcblx0XHRcdC8vIGNvbnNvbGUubG9nKCdpbml0aWFsaXNpbmcgdmlldyAnICsgdmlld0tleSArICcgd2l0aCBvcHRpb25zJywgb3B0aW9ucyk7XG5cdFx0XHRpZiAodmlld0VsZW1lbnQudHlwZS5uYXZpZ2F0aW9uQmFyICYmIHZpZXdFbGVtZW50LnR5cGUuZ2V0TmF2aWdhdGlvbikge1xuXHRcdFx0XHR2YXIgYXBwID0gdGhpcy5jb250ZXh0LmFwcDtcblx0XHRcdFx0dmFyIHRyYW5zaXRpb24gPSBvcHRpb25zLnRyYW5zaXRpb247XG5cdFx0XHRcdGlmIChhcHAudmlld01hbmFnZXJJblRyYW5zaXRpb24pIHtcblx0XHRcdFx0XHR0cmFuc2l0aW9uID0gYXBwLnZpZXdNYW5hZ2VySW5UcmFuc2l0aW9uLmFjdGl2ZVRyYW5zaXRpb25PcHRpb25zLnRyYW5zaXRpb247XG5cdFx0XHRcdH1cblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0YXBwLm5hdmlnYXRpb25CYXJzW3ZpZXdFbGVtZW50LnR5cGUubmF2aWdhdGlvbkJhcl0udXBkYXRlV2l0aFRyYW5zaXRpb24odmlld0VsZW1lbnQudHlwZS5nZXROYXZpZ2F0aW9uKHZpZXdQcm9wcywgYXBwKSwgdHJhbnNpdGlvbik7XG5cdFx0XHRcdH0sIDApO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fX2xhc3RSZW5kZXJlZFZpZXcgPSB2aWV3S2V5O1xuXHRcdH1cblxuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0Vmlld0NvbnRhaW5lcixcblx0XHRcdHsgY2xhc3NOYW1lOiB2aWV3Q2xhc3NOYW1lLCBrZXk6IHZpZXdLZXkgfSxcblx0XHRcdHZpZXdFbGVtZW50XG5cdFx0KTtcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0dmFyIGNsYXNzTmFtZSA9IGNsYXNzTmFtZXMoJ1ZpZXdNYW5hZ2VyJywgdGhpcy5wcm9wcy5jbGFzc05hbWUpO1xuXHRcdHZhciB2aWV3Q29udGFpbmVyID0gdGhpcy5yZW5kZXJWaWV3Q29udGFpbmVyKHRoaXMuc3RhdGUuY3VycmVudFZpZXcsIHsgdmlld1Byb3BzOiB0aGlzLnN0YXRlLmN1cnJlbnRWaWV3UHJvcHMgfSk7XG5cblx0XHR2YXIgdHJhbnNpdGlvbk5hbWUgPSAndmlldy10cmFuc2l0aW9uLWluc3RhbnQnO1xuXHRcdGlmICh0aGlzLnN0YXRlLm9wdGlvbnMudHJhbnNpdGlvbikge1xuXHRcdFx0Ly8gY29uc29sZS5sb2coJ2FwcGx5aW5nIHZpZXcgdHJhbnNpdGlvbjogJyArIHRoaXMuc3RhdGUub3B0aW9ucy50cmFuc2l0aW9uICsgJyB0byB2aWV3ICcgKyB0aGlzLnN0YXRlLmN1cnJlbnRWaWV3KTtcblx0XHRcdHRyYW5zaXRpb25OYW1lID0gJ3ZpZXctdHJhbnNpdGlvbi0nICsgdGhpcy5zdGF0ZS5vcHRpb25zLnRyYW5zaXRpb247XG5cdFx0fVxuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0VHJhbnNpdGlvbixcblx0XHRcdHsgdHJhbnNpdGlvbk5hbWU6IHRyYW5zaXRpb25OYW1lLCB0cmFuc2l0aW9uRW50ZXI6IHRydWUsIHRyYW5zaXRpb25MZWF2ZTogdHJ1ZSwgY2xhc3NOYW1lOiBjbGFzc05hbWUsIGNvbXBvbmVudDogXCJkaXZcIiB9LFxuXHRcdFx0dmlld0NvbnRhaW5lclxuXHRcdCk7XG5cdH1cbn0pO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBWaWV3TWFuYWdlcjtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGFuaW1hdGlvbiA9IHJlcXVpcmUoJ3R3ZWVuLmpzJyk7XG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG5mdW5jdGlvbiB1cGRhdGUoKSB7XG5cdGFuaW1hdGlvbi51cGRhdGUoKTtcblx0aWYgKGFuaW1hdGlvbi5nZXRBbGwoKS5sZW5ndGgpIHtcblx0XHR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHVwZGF0ZSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gc2Nyb2xsVG9Ub3AoZWwsIG9wdGlvbnMpIHtcblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cdHZhciBmcm9tID0gZWwuc2Nyb2xsVG9wO1xuXHR2YXIgZHVyYXRpb24gPSBNYXRoLm1pbihNYXRoLm1heCgyMDAsIGZyb20gLyAyKSwgMzUwKTtcblx0aWYgKGZyb20gPiAyMDApIGR1cmF0aW9uID0gMzAwO1xuXHRlbC5zdHlsZS53ZWJraXRPdmVyZmxvd1Njcm9sbGluZyA9ICdhdXRvJztcblx0ZWwuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcblx0dmFyIHR3ZWVuID0gbmV3IGFuaW1hdGlvbi5Ud2Vlbih7IHBvczogZnJvbSB9KS50byh7IHBvczogMCB9LCBkdXJhdGlvbikuZWFzaW5nKGFuaW1hdGlvbi5FYXNpbmcuUXVhZHJhdGljLk91dCkub25VcGRhdGUoZnVuY3Rpb24gKCkge1xuXHRcdGVsLnNjcm9sbFRvcCA9IHRoaXMucG9zO1xuXHRcdGlmIChvcHRpb25zLm9uVXBkYXRlKSB7XG5cdFx0XHRvcHRpb25zLm9uVXBkYXRlKCk7XG5cdFx0fVxuXHR9KS5vbkNvbXBsZXRlKGZ1bmN0aW9uICgpIHtcblx0XHRlbC5zdHlsZS53ZWJraXRPdmVyZmxvd1Njcm9sbGluZyA9ICd0b3VjaCc7XG5cdFx0ZWwuc3R5bGUub3ZlcmZsb3cgPSAnc2Nyb2xsJztcblx0XHRpZiAob3B0aW9ucy5vbkNvbXBsZXRlKSBvcHRpb25zLm9uQ29tcGxldGUoKTtcblx0fSkuc3RhcnQoKTtcblx0dXBkYXRlKCk7XG5cdHJldHVybiB0d2Vlbjtcbn1cblxuZXhwb3J0cy5zY3JvbGxUb1RvcCA9IHNjcm9sbFRvVG9wO1xuXG52YXIgTWl4aW5zID0gZXhwb3J0cy5NaXhpbnMgPSB7fTtcblxuTWl4aW5zLlNjcm9sbENvbnRhaW5lclRvVG9wID0ge1xuXHRjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3N0YXR1c1RhcCcsIHRoaXMuc2Nyb2xsQ29udGFpbmVyVG9Ub3ApO1xuXHR9LFxuXHRjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24gY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG5cdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3N0YXR1c1RhcCcsIHRoaXMuc2Nyb2xsQ29udGFpbmVyVG9Ub3ApO1xuXHRcdGlmICh0aGlzLl9zY3JvbGxDb250YWluZXJBbmltYXRpb24pIHtcblx0XHRcdHRoaXMuX3Njcm9sbENvbnRhaW5lckFuaW1hdGlvbi5zdG9wKCk7XG5cdFx0fVxuXHR9LFxuXHRzY3JvbGxDb250YWluZXJUb1RvcDogZnVuY3Rpb24gc2Nyb2xsQ29udGFpbmVyVG9Ub3AoKSB7XG5cdFx0dmFyIF90aGlzID0gdGhpcztcblxuXHRcdGlmICghdGhpcy5pc01vdW50ZWQoKSB8fCAhdGhpcy5yZWZzLnNjcm9sbENvbnRhaW5lcikgcmV0dXJuO1xuXHRcdHRoaXMuX3Njcm9sbENvbnRhaW5lckFuaW1hdGlvbiA9IHNjcm9sbFRvVG9wKFJlYWN0LmZpbmRET01Ob2RlKHRoaXMucmVmcy5zY3JvbGxDb250YWluZXIpLCB7XG5cdFx0XHRvbkNvbXBsZXRlOiBmdW5jdGlvbiBvbkNvbXBsZXRlKCkge1xuXHRcdFx0XHRkZWxldGUgX3RoaXMuX3Njcm9sbENvbnRhaW5lckFuaW1hdGlvbjtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxufTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcblx0dmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5jcmVhdGVBcHAgPSBjcmVhdGVBcHA7XG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgYW5pbWF0aW9uID0gcmVxdWlyZSgnLi9jb3JlL2FuaW1hdGlvbicpO1xuZXhwb3J0cy5hbmltYXRpb24gPSBhbmltYXRpb247XG52YXIgTGluayA9IHJlcXVpcmUoJy4vY29yZS9MaW5rJyk7XG5leHBvcnRzLkxpbmsgPSBMaW5rO1xudmFyIFZpZXcgPSByZXF1aXJlKCcuL2NvcmUvVmlldycpO1xuZXhwb3J0cy5WaWV3ID0gVmlldztcbnZhciBWaWV3TWFuYWdlciA9IHJlcXVpcmUoJy4vY29yZS9WaWV3TWFuYWdlcicpO1xuXG5leHBvcnRzLlZpZXdNYW5hZ2VyID0gVmlld01hbmFnZXI7XG52YXIgQ29udGFpbmVyID0gcmVxdWlyZSgncmVhY3QtY29udGFpbmVyJyk7XG5leHBvcnRzLkNvbnRhaW5lciA9IENvbnRhaW5lcjtcbnZhciBNaXhpbnMgPSByZXF1aXJlKCcuL21peGlucycpO1xuZXhwb3J0cy5NaXhpbnMgPSBNaXhpbnM7XG52YXIgVUkgPSByZXF1aXJlKCcuL3VpJyk7XG5cbmV4cG9ydHMuVUkgPSBVSTtcblxuZnVuY3Rpb24gY3JlYXRlQXBwKCkge1xuXHR2YXIgYXBwID0ge1xuXHRcdG5hdmlnYXRpb25CYXJzOiB7fSxcblx0XHR2aWV3TWFuYWdlcnM6IHt9LFxuXHRcdHZpZXdzOiB7fSxcblx0XHR0cmFuc2l0aW9uVG86IGZ1bmN0aW9uIHRyYW5zaXRpb25Ubyh2aWV3LCBvcHRzKSB7XG5cdFx0XHR2YXIgdm0gPSAnX19kZWZhdWx0Jztcblx0XHRcdHZpZXcgPSB2aWV3LnNwbGl0KCc6Jyk7XG5cdFx0XHRpZiAodmlldy5sZW5ndGggPiAxKSB7XG5cdFx0XHRcdHZtID0gdmlldy5zaGlmdCgpO1xuXHRcdFx0fVxuXHRcdFx0dmlldyA9IHZpZXdbMF07XG5cdFx0XHRhcHAudmlld01hbmFnZXJzW3ZtXS50cmFuc2l0aW9uVG8odmlldywgb3B0cyk7XG5cdFx0fVxuXHR9O1xuXHRyZXR1cm4ge1xuXHRcdGNoaWxkQ29udGV4dFR5cGVzOiB7XG5cdFx0XHRhcHA6IFJlYWN0LlByb3BUeXBlcy5vYmplY3Rcblx0XHR9LFxuXHRcdGdldENoaWxkQ29udGV4dDogZnVuY3Rpb24gZ2V0Q2hpbGRDb250ZXh0KCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0YXBwOiBhcHBcblx0XHRcdH07XG5cdFx0fVxuXHR9O1xufSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuXHR2YWx1ZTogdHJ1ZVxufSk7XG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgVHJhbnNpdGlvbnMgPSB7XG5cdGNvbnRleHRUeXBlczoge1xuXHRcdGFwcDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdFxuXHR9LFxuXHR0cmFuc2l0aW9uVG86IGZ1bmN0aW9uIHRyYW5zaXRpb25Ubyh2aWV3LCBvcHRzKSB7XG5cdFx0dGhpcy5jb250ZXh0LmFwcC50cmFuc2l0aW9uVG8odmlldywgb3B0cyk7XG5cdH1cbn07XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IFRyYW5zaXRpb25zO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbnZhciBUcmFuc2l0aW9ucyA9IHJlcXVpcmUoJy4vVHJhbnNpdGlvbnMnKTtcbmV4cG9ydHMuVHJhbnNpdGlvbnMgPSBUcmFuc2l0aW9uczsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0L2FkZG9ucycpO1xudmFyIGNsYXNzbmFtZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyk7XG52YXIgVHJhbnNpdGlvbiA9IFJlYWN0LmFkZG9ucy5DU1NUcmFuc2l0aW9uR3JvdXA7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogJ0FsZXJ0YmFyJyxcblx0cHJvcFR5cGVzOiB7XG5cdFx0YW5pbWF0ZWQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuXHRcdGNoaWxkcmVuOiBSZWFjdC5Qcm9wVHlwZXMubm9kZS5pc1JlcXVpcmVkLFxuXHRcdGNsYXNzTmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0XHRwdWxzZTogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG5cdFx0dHlwZTogUmVhY3QuUHJvcFR5cGVzLm9uZU9mKFsnZGVmYXVsdCcsICdwcmltYXJ5JywgJ3N1Y2Nlc3MnLCAnd2FybmluZycsICdkYW5nZXInXSksXG5cdFx0dmlzaWJsZTogUmVhY3QuUHJvcFR5cGVzLmJvb2xcblx0fSxcblxuXHRnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uIGdldERlZmF1bHRQcm9wcygpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dHlwZTogJ2RlZmF1bHQnXG5cdFx0fTtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHR2YXIgY2xhc3NOYW1lID0gY2xhc3NuYW1lcygnQWxlcnRiYXInLCAnQWxlcnRiYXItLScgKyB0aGlzLnByb3BzLnR5cGUsIHtcblx0XHRcdCdBbGVydGJhci0tYW5pbWF0ZWQnOiB0aGlzLnByb3BzLmFuaW1hdGVkLFxuXHRcdFx0J0FsZXJ0YmFyLS1wdWxzZSc6IHRoaXMucHJvcHMucHVsc2Vcblx0XHR9LCB0aGlzLnByb3BzLmNsYXNzTmFtZSk7XG5cblx0XHR2YXIgcHVsc2VXcmFwID0gdGhpcy5wcm9wcy5wdWxzZSA/IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHQnZGl2Jyxcblx0XHRcdHsgY2xhc3NOYW1lOiBcIkFsZXJ0YmFyX19pbm5lclwiIH0sXG5cdFx0XHR0aGlzLnByb3BzLmNoaWxkcmVuXG5cdFx0KSA6IHRoaXMucHJvcHMuY2hpbGRyZW47XG5cdFx0dmFyIGFuaW1hdGVkQmFyID0gdGhpcy5wcm9wcy52aXNpYmxlID8gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdCdkaXYnLFxuXHRcdFx0eyBjbGFzc05hbWU6IGNsYXNzTmFtZSB9LFxuXHRcdFx0cHVsc2VXcmFwXG5cdFx0KSA6IG51bGw7XG5cblx0XHR2YXIgY29tcG9uZW50ID0gdGhpcy5wcm9wcy5hbmltYXRlZCA/IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRUcmFuc2l0aW9uLFxuXHRcdFx0eyB0cmFuc2l0aW9uTmFtZTogXCJBbGVydGJhclwiLCBjb21wb25lbnQ6IFwiZGl2XCIgfSxcblx0XHRcdGFuaW1hdGVkQmFyXG5cdFx0KSA6IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHQnZGl2Jyxcblx0XHRcdHsgY2xhc3NOYW1lOiBjbGFzc05hbWUgfSxcblx0XHRcdHB1bHNlV3JhcFxuXHRcdCk7XG5cblx0XHRyZXR1cm4gY29tcG9uZW50O1xuXHR9XG59KTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0L2FkZG9ucycpO1xudmFyIFRhcHBhYmxlID0gcmVxdWlyZSgncmVhY3QtdGFwcGFibGUnKTtcblxudmFyIGJsYWNrbGlzdCA9IHJlcXVpcmUoJ2JsYWNrbGlzdCcpO1xudmFyIGNsYXNzbmFtZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogJ0J1dHRvbicsXG5cdHByb3BUeXBlczoge1xuXHRcdGNoaWxkcmVuOiBSZWFjdC5Qcm9wVHlwZXMubm9kZS5pc1JlcXVpcmVkLFxuXHRcdGNsYXNzTmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0XHR0eXBlOiBSZWFjdC5Qcm9wVHlwZXMub25lT2YoWydkZWZhdWx0JywgJ2luZm8nLCAncHJpbWFyeScsICdzdWNjZXNzJywgJ3dhcm5pbmcnLCAnZGFuZ2VyJ10pXG5cdH0sXG5cblx0Z2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiBnZXREZWZhdWx0UHJvcHMoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHR5cGU6ICdkZWZhdWx0J1xuXHRcdH07XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0dmFyIGNsYXNzTmFtZSA9IGNsYXNzbmFtZXMoJ0J1dHRvbicsICdCdXR0b24tLScgKyB0aGlzLnByb3BzLnR5cGUsIHRoaXMucHJvcHMuY2xhc3NOYW1lKTtcblx0XHR2YXIgcHJvcHMgPSBibGFja2xpc3QodGhpcy5wcm9wcywgJ3R5cGUnKTtcblxuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFRhcHBhYmxlLCBfZXh0ZW5kcyh7fSwgcHJvcHMsIHsgY2xhc3NOYW1lOiBjbGFzc05hbWUsIGNvbXBvbmVudDogXCJidXR0b25cIiB9KSk7XG5cdH1cbn0pOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxudmFyIGJsYWNrbGlzdCA9IHJlcXVpcmUoJ2JsYWNrbGlzdCcpO1xudmFyIGNsYXNzbmFtZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyk7XG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdC9hZGRvbnMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnQnV0dG9uR3JvdXAnLFxuXHRwcm9wVHlwZXM6IHtcblx0XHRjaGlsZHJlbjogUmVhY3QuUHJvcFR5cGVzLm5vZGUuaXNSZXF1aXJlZCxcblx0XHRjbGFzc05hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmdcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0dmFyIGNsYXNzTmFtZSA9IGNsYXNzbmFtZXMoJ0J1dHRvbkdyb3VwJywgdGhpcy5wcm9wcy5jbGFzc05hbWUpO1xuXHRcdHZhciBwcm9wcyA9IGJsYWNrbGlzdCh0aGlzLnByb3BzLCAnY2xhc3NOYW1lJyk7XG5cblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgX2V4dGVuZHMoeyBjbGFzc05hbWU6IGNsYXNzTmFtZSB9LCBwcm9wcykpO1xuXHR9XG59KTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbnZhciBibGFja2xpc3QgPSByZXF1aXJlKCdibGFja2xpc3QnKTtcbnZhciBjbGFzc25hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QvYWRkb25zJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogJ0ZpZWxkQ29udHJvbCcsXG5cdHByb3BUeXBlczoge1xuXHRcdGNoaWxkcmVuOiBSZWFjdC5Qcm9wVHlwZXMubm9kZS5pc1JlcXVpcmVkLFxuXHRcdGNsYXNzTmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHR2YXIgY2xhc3NOYW1lID0gY2xhc3NuYW1lcygnRmllbGRDb250cm9sJywgdGhpcy5wcm9wcy5jbGFzc05hbWUpO1xuXHRcdHZhciBwcm9wcyA9IGJsYWNrbGlzdCh0aGlzLnByb3BzLCAnY2xhc3NOYW1lJyk7XG5cblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgX2V4dGVuZHMoeyBjbGFzc05hbWU6IGNsYXNzTmFtZSB9LCBwcm9wcykpO1xuXHR9XG59KTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbnZhciBibGFja2xpc3QgPSByZXF1aXJlKCdibGFja2xpc3QnKTtcbnZhciBjbGFzc25hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QvYWRkb25zJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogJ0ZpZWxkTGFiZWwnLFxuXHRwcm9wVHlwZXM6IHtcblx0XHRjaGlsZHJlbjogUmVhY3QuUHJvcFR5cGVzLm5vZGUuaXNSZXF1aXJlZCxcblx0XHRjbGFzc05hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmdcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0dmFyIGNsYXNzTmFtZSA9IGNsYXNzbmFtZXMoJ0ZpZWxkTGFiZWwnLCB0aGlzLnByb3BzLmNsYXNzTmFtZSk7XG5cdFx0dmFyIHByb3BzID0gYmxhY2tsaXN0KHRoaXMucHJvcHMsICdjbGFzc05hbWUnKTtcblxuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCBfZXh0ZW5kcyh7IGNsYXNzTmFtZTogY2xhc3NOYW1lIH0sIHByb3BzKSk7XG5cdH1cbn0pOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxudmFyIGJsYWNrbGlzdCA9IHJlcXVpcmUoJ2JsYWNrbGlzdCcpO1xudmFyIGNsYXNzbmFtZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyk7XG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdC9hZGRvbnMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnR3JvdXAnLFxuXHRwcm9wVHlwZXM6IHtcblx0XHRjaGlsZHJlbjogUmVhY3QuUHJvcFR5cGVzLm5vZGUuaXNSZXF1aXJlZCxcblx0XHRjbGFzc05hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdFx0aGFzVG9wR3V0dGVyOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbFxuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHR2YXIgY2xhc3NOYW1lID0gY2xhc3NuYW1lcygnR3JvdXAnLCB7XG5cdFx0XHQnR3JvdXAtLWhhcy1ndXR0ZXItdG9wJzogdGhpcy5wcm9wcy5oYXNUb3BHdXR0ZXJcblx0XHR9LCB0aGlzLnByb3BzLmNsYXNzTmFtZSk7XG5cdFx0dmFyIHByb3BzID0gYmxhY2tsaXN0KHRoaXMucHJvcHMsICdjbGFzc05hbWUnKTtcblxuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCBfZXh0ZW5kcyh7IGNsYXNzTmFtZTogY2xhc3NOYW1lIH0sIHByb3BzKSk7XG5cdH1cbn0pOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxudmFyIGJsYWNrbGlzdCA9IHJlcXVpcmUoJ2JsYWNrbGlzdCcpO1xudmFyIGNsYXNzbmFtZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyk7XG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdC9hZGRvbnMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnR3JvdXBCb2R5Jyxcblx0cHJvcFR5cGVzOiB7XG5cdFx0Y2hpbGRyZW46IFJlYWN0LlByb3BUeXBlcy5ub2RlLmlzUmVxdWlyZWQsXG5cdFx0Y2xhc3NOYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdHZhciBjbGFzc05hbWUgPSBjbGFzc25hbWVzKCdHcm91cF9fYm9keScsIHRoaXMucHJvcHMuY2xhc3NOYW1lKTtcblx0XHR2YXIgcHJvcHMgPSBibGFja2xpc3QodGhpcy5wcm9wcywgJ2NsYXNzTmFtZScpO1xuXG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIF9leHRlbmRzKHsgY2xhc3NOYW1lOiBjbGFzc05hbWUgfSwgcHJvcHMpKTtcblx0fVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG52YXIgYmxhY2tsaXN0ID0gcmVxdWlyZSgnYmxhY2tsaXN0Jyk7XG52YXIgY2xhc3NuYW1lcyA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKTtcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0L2FkZG9ucycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6ICdHcm91cEZvb3RlcicsXG5cdHByb3BUeXBlczoge1xuXHRcdGNoaWxkcmVuOiBSZWFjdC5Qcm9wVHlwZXMubm9kZS5pc1JlcXVpcmVkLFxuXHRcdGNsYXNzTmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHR2YXIgY2xhc3NOYW1lID0gY2xhc3NuYW1lcygnR3JvdXBfX2Zvb3RlcicsIHRoaXMucHJvcHMuY2xhc3NOYW1lKTtcblx0XHR2YXIgcHJvcHMgPSBibGFja2xpc3QodGhpcy5wcm9wcywgJ2NsYXNzTmFtZScpO1xuXG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIF9leHRlbmRzKHsgY2xhc3NOYW1lOiBjbGFzc05hbWUgfSwgcHJvcHMpKTtcblx0fVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG52YXIgYmxhY2tsaXN0ID0gcmVxdWlyZSgnYmxhY2tsaXN0Jyk7XG52YXIgY2xhc3NuYW1lcyA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKTtcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0L2FkZG9ucycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6ICdHcm91cEhlYWRlcicsXG5cdHByb3BUeXBlczoge1xuXHRcdGNoaWxkcmVuOiBSZWFjdC5Qcm9wVHlwZXMubm9kZS5pc1JlcXVpcmVkLFxuXHRcdGNsYXNzTmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHR2YXIgY2xhc3NOYW1lID0gY2xhc3NuYW1lcygnR3JvdXBfX2hlYWRlcicsIHRoaXMucHJvcHMuY2xhc3NOYW1lKTtcblx0XHR2YXIgcHJvcHMgPSBibGFja2xpc3QodGhpcy5wcm9wcywgJ2NsYXNzTmFtZScpO1xuXG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIF9leHRlbmRzKHsgY2xhc3NOYW1lOiBjbGFzc05hbWUgfSwgcHJvcHMpKTtcblx0fVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG52YXIgYmxhY2tsaXN0ID0gcmVxdWlyZSgnYmxhY2tsaXN0Jyk7XG52YXIgY2xhc3NuYW1lcyA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKTtcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0L2FkZG9ucycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6ICdHcm91cElubmVyJyxcblx0cHJvcFR5cGVzOiB7XG5cdFx0Y2hpbGRyZW46IFJlYWN0LlByb3BUeXBlcy5ub2RlLmlzUmVxdWlyZWQsXG5cdFx0Y2xhc3NOYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdHZhciBjbGFzc05hbWUgPSBjbGFzc25hbWVzKCdHcm91cF9faW5uZXInLCB0aGlzLnByb3BzLmNsYXNzTmFtZSk7XG5cdFx0dmFyIHByb3BzID0gYmxhY2tsaXN0KHRoaXMucHJvcHMsICdjbGFzc05hbWUnKTtcblxuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCBfZXh0ZW5kcyh7IGNsYXNzTmFtZTogY2xhc3NOYW1lIH0sIHByb3BzKSk7XG5cdH1cbn0pOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxudmFyIEl0ZW0gPSByZXF1aXJlKCcuL0l0ZW0nKTtcbnZhciBJdGVtQ29udGVudCA9IHJlcXVpcmUoJy4vSXRlbUNvbnRlbnQnKTtcbnZhciBJdGVtSW5uZXIgPSByZXF1aXJlKCcuL0l0ZW1Jbm5lcicpO1xudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QvYWRkb25zJyk7XG5cbnZhciBibGFja2xpc3QgPSByZXF1aXJlKCdibGFja2xpc3QnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnSW5wdXQnLFxuXG5cdHByb3BUeXBlczoge1xuXHRcdGNsYXNzTmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0XHRjaGlsZHJlbjogUmVhY3QuUHJvcFR5cGVzLm5vZGUsXG5cdFx0ZGlzYWJsZWQ6IFJlYWN0LlByb3BUeXBlcy5ib29sXG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0dmFyIGlucHV0UHJvcHMgPSBibGFja2xpc3QodGhpcy5wcm9wcywgJ2NoaWxkcmVuJywgJ2NsYXNzTmFtZScpO1xuXG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRJdGVtLFxuXHRcdFx0eyBjbGFzc05hbWU6IHRoaXMucHJvcHMuY2xhc3NOYW1lLCBzZWxlY3RhYmxlOiB0aGlzLnByb3BzLmRpc2FibGVkLCBjb21wb25lbnQ6IFwibGFiZWxcIiB9LFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0SXRlbUlubmVyLFxuXHRcdFx0XHRudWxsLFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdEl0ZW1Db250ZW50LFxuXHRcdFx0XHRcdHsgY29tcG9uZW50OiBcImxhYmVsXCIgfSxcblx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KCdpbnB1dCcsIF9leHRlbmRzKHsgY2xhc3NOYW1lOiBcImZpZWxkXCIsIHR5cGU6IFwidGV4dFwiIH0sIGlucHV0UHJvcHMpKVxuXHRcdFx0XHQpLFxuXHRcdFx0XHR0aGlzLnByb3BzLmNoaWxkcmVuXG5cdFx0XHQpXG5cdFx0KTtcblx0fVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfYmxhY2tsaXN0ID0gcmVxdWlyZSgnYmxhY2tsaXN0Jyk7XG5cbnZhciBfYmxhY2tsaXN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2JsYWNrbGlzdCk7XG5cbnZhciBfcmVhY3RBZGRvbnMgPSByZXF1aXJlKCdyZWFjdC9hZGRvbnMnKTtcblxudmFyIF9yZWFjdEFkZG9uczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdEFkZG9ucyk7XG5cbnZhciBfY2xhc3NuYW1lcyA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKTtcblxudmFyIF9jbGFzc25hbWVzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NsYXNzbmFtZXMpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IF9yZWFjdEFkZG9uczJbJ2RlZmF1bHQnXS5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnSXRlbScsXG5cblx0cHJvcFR5cGVzOiB7XG5cdFx0Y2hpbGRyZW46IF9yZWFjdEFkZG9uczJbJ2RlZmF1bHQnXS5Qcm9wVHlwZXMubm9kZS5pc1JlcXVpcmVkLFxuXHRcdGNsYXNzTmFtZTogX3JlYWN0QWRkb25zMlsnZGVmYXVsdCddLlByb3BUeXBlcy5zdHJpbmcsXG5cdFx0c2hvd0Rpc2Nsb3N1cmVBcnJvdzogX3JlYWN0QWRkb25zMlsnZGVmYXVsdCddLlByb3BUeXBlcy5ib29sXG5cdH0sXG5cblx0Z2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiBnZXREZWZhdWx0UHJvcHMoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGNvbXBvbmVudDogJ2Rpdidcblx0XHR9O1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdHZhciBjb21wb25lbnRDbGFzcyA9ICgwLCBfY2xhc3NuYW1lczJbJ2RlZmF1bHQnXSkoJ0l0ZW0nLCB7XG5cdFx0XHQnSXRlbS0taGFzLWRpc2Nsb3N1cmUtYXJyb3cnOiB0aGlzLnByb3BzLnNob3dEaXNjbG9zdXJlQXJyb3dcblx0XHR9LCB0aGlzLnByb3BzLmNsYXNzTmFtZSk7XG5cblx0XHR2YXIgcHJvcHMgPSAoMCwgX2JsYWNrbGlzdDJbJ2RlZmF1bHQnXSkodGhpcy5wcm9wcywgJ2NoaWxkcmVuJywgJ2NsYXNzTmFtZScsICdzaG93RGlzY2xvc3VyZUFycm93Jyk7XG5cdFx0cHJvcHMuY2xhc3NOYW1lID0gY29tcG9uZW50Q2xhc3M7XG5cblx0XHRyZXR1cm4gX3JlYWN0QWRkb25zMlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQodGhpcy5wcm9wcy5jb21wb25lbnQsIHByb3BzLCB0aGlzLnByb3BzLmNoaWxkcmVuKTtcblx0fVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG52YXIgYmxhY2tsaXN0ID0gcmVxdWlyZSgnYmxhY2tsaXN0Jyk7XG52YXIgY2xhc3NuYW1lcyA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKTtcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0L2FkZG9ucycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6ICdJdGVtQ29udGVudCcsXG5cdHByb3BUeXBlczoge1xuXHRcdGNoaWxkcmVuOiBSZWFjdC5Qcm9wVHlwZXMubm9kZS5pc1JlcXVpcmVkLFxuXHRcdGNsYXNzTmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHR2YXIgY2xhc3NOYW1lID0gY2xhc3NuYW1lcygnSXRlbV9fY29udGVudCcsIHRoaXMucHJvcHMuY2xhc3NOYW1lKTtcblx0XHR2YXIgcHJvcHMgPSBibGFja2xpc3QodGhpcy5wcm9wcywgJ2NsYXNzTmFtZScpO1xuXG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIF9leHRlbmRzKHsgY2xhc3NOYW1lOiBjbGFzc05hbWUgfSwgcHJvcHMpKTtcblx0fVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdC9hZGRvbnMnKTtcblxudmFyIGNsYXNzbmFtZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogJ0l0ZW1Jbm5lcicsXG5cblx0cHJvcFR5cGVzOiB7XG5cdFx0Y2hpbGRyZW46IFJlYWN0LlByb3BUeXBlcy5ub2RlLmlzUmVxdWlyZWQsXG5cdFx0Y2xhc3NOYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0dmFyIGNsYXNzTmFtZSA9IGNsYXNzbmFtZXMoJ0l0ZW1fX2lubmVyJywgdGhpcy5wcm9wcy5jbGFzc05hbWUpO1xuXG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIF9leHRlbmRzKHsgY2xhc3NOYW1lOiBjbGFzc05hbWUgfSwgdGhpcy5wcm9wcykpO1xuXHR9XG59KTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0L2FkZG9ucycpO1xudmFyIGNsYXNzbmFtZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogJ0l0ZW1NZWRpYScsXG5cdHByb3BUeXBlczoge1xuXHRcdGF2YXRhcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0XHRhdmF0YXJJbml0aWFsczogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0XHRjbGFzc05hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdFx0aWNvbjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0XHR0aHVtYm5haWw6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmdcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHR2YXIgY2xhc3NOYW1lID0gY2xhc3NuYW1lcyh7XG5cdFx0XHQnSXRlbV9fbWVkaWEnOiB0cnVlLFxuXHRcdFx0J0l0ZW1fX21lZGlhLS1pY29uJzogdGhpcy5wcm9wcy5pY29uLFxuXHRcdFx0J0l0ZW1fX21lZGlhLS1hdmF0YXInOiB0aGlzLnByb3BzLmF2YXRhciB8fCB0aGlzLnByb3BzLmF2YXRhckluaXRpYWxzLFxuXHRcdFx0J0l0ZW1fX21lZGlhLS10aHVtYm5haWwnOiB0aGlzLnByb3BzLnRodW1ibmFpbFxuXHRcdH0sIHRoaXMucHJvcHMuY2xhc3NOYW1lKTtcblxuXHRcdC8vIG1lZGlhIHR5cGVzXG5cdFx0dmFyIGljb24gPSB0aGlzLnByb3BzLmljb24gPyBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IGNsYXNzTmFtZTogJ0l0ZW1fX21lZGlhX19pY29uICcgKyB0aGlzLnByb3BzLmljb24gfSkgOiBudWxsO1xuXHRcdHZhciBhdmF0YXIgPSB0aGlzLnByb3BzLmF2YXRhciB8fCB0aGlzLnByb3BzLmF2YXRhckluaXRpYWxzID8gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdCdkaXYnLFxuXHRcdFx0eyBjbGFzc05hbWU6IFwiSXRlbV9fbWVkaWFfX2F2YXRhclwiIH0sXG5cdFx0XHR0aGlzLnByb3BzLmF2YXRhciA/IFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2ltZycsIHsgc3JjOiB0aGlzLnByb3BzLmF2YXRhciB9KSA6IHRoaXMucHJvcHMuYXZhdGFySW5pdGlhbHNcblx0XHQpIDogbnVsbDtcblx0XHR2YXIgdGh1bWJuYWlsID0gdGhpcy5wcm9wcy50aHVtYm5haWwgPyBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0J2RpdicsXG5cdFx0XHR7IGNsYXNzTmFtZTogXCJJdGVtX19tZWRpYV9fdGh1bWJuYWlsXCIgfSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2ltZycsIHsgc3JjOiB0aGlzLnByb3BzLnRodW1ibmFpbCB9KVxuXHRcdCkgOiBudWxsO1xuXG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHQnZGl2Jyxcblx0XHRcdHsgY2xhc3NOYW1lOiBjbGFzc05hbWUgfSxcblx0XHRcdGljb24sXG5cdFx0XHRhdmF0YXIsXG5cdFx0XHR0aHVtYm5haWxcblx0XHQpO1xuXHR9XG59KTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBjbGFzc25hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QvYWRkb25zJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogJ0l0ZW1Ob3RlJyxcblx0cHJvcFR5cGVzOiB7XG5cdFx0Y2xhc3NOYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRcdGljb246IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdFx0bGFiZWw6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdFx0dHlwZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xuXHR9LFxuXHRnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uIGdldERlZmF1bHRQcm9wcygpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dHlwZTogJ2RlZmF1bHQnXG5cdFx0fTtcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0dmFyIGNsYXNzTmFtZSA9IGNsYXNzbmFtZXMoJ0l0ZW1fX25vdGUnLCAnSXRlbV9fbm90ZS0tJyArIHRoaXMucHJvcHMudHlwZSwgdGhpcy5wcm9wcy5jbGFzc05hbWUpO1xuXG5cdFx0Ly8gZWxlbWVudHNcblx0XHR2YXIgbGFiZWwgPSB0aGlzLnByb3BzLmxhYmVsID8gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdCdkaXYnLFxuXHRcdFx0eyBjbGFzc05hbWU6IFwiSXRlbV9fbm90ZV9fbGFiZWxcIiB9LFxuXHRcdFx0dGhpcy5wcm9wcy5sYWJlbFxuXHRcdCkgOiBudWxsO1xuXHRcdHZhciBpY29uID0gdGhpcy5wcm9wcy5pY29uID8gUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBjbGFzc05hbWU6ICdJdGVtX19ub3RlX19pY29uICcgKyB0aGlzLnByb3BzLmljb24gfSkgOiBudWxsO1xuXG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHQnZGl2Jyxcblx0XHRcdHsgY2xhc3NOYW1lOiBjbGFzc05hbWUgfSxcblx0XHRcdGxhYmVsLFxuXHRcdFx0aWNvblxuXHRcdCk7XG5cdH1cbn0pOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxudmFyIGJsYWNrbGlzdCA9IHJlcXVpcmUoJ2JsYWNrbGlzdCcpO1xudmFyIGNsYXNzbmFtZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyk7XG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdC9hZGRvbnMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnSXRlbVN1YlRpdGxlJyxcblx0cHJvcFR5cGVzOiB7XG5cdFx0Y2hpbGRyZW46IFJlYWN0LlByb3BUeXBlcy5ub2RlLmlzUmVxdWlyZWQsXG5cdFx0Y2xhc3NOYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdHZhciBjbGFzc05hbWUgPSBjbGFzc25hbWVzKCdJdGVtX19zdWJ0aXRsZScsIHRoaXMucHJvcHMuY2xhc3NOYW1lKTtcblx0XHR2YXIgcHJvcHMgPSBibGFja2xpc3QodGhpcy5wcm9wcywgJ2NsYXNzTmFtZScpO1xuXG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIF9leHRlbmRzKHsgY2xhc3NOYW1lOiBjbGFzc05hbWUgfSwgcHJvcHMpKTtcblx0fVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG52YXIgYmxhY2tsaXN0ID0gcmVxdWlyZSgnYmxhY2tsaXN0Jyk7XG52YXIgY2xhc3NuYW1lcyA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKTtcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0L2FkZG9ucycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6ICdJdGVtVGl0bGUnLFxuXHRwcm9wVHlwZXM6IHtcblx0XHRjaGlsZHJlbjogUmVhY3QuUHJvcFR5cGVzLm5vZGUuaXNSZXF1aXJlZCxcblx0XHRjbGFzc05hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmdcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0dmFyIGNsYXNzTmFtZSA9IGNsYXNzbmFtZXMoJ0l0ZW1fX3RpdGxlJywgdGhpcy5wcm9wcy5jbGFzc05hbWUpO1xuXHRcdHZhciBwcm9wcyA9IGJsYWNrbGlzdCh0aGlzLnByb3BzLCAnY2xhc3NOYW1lJyk7XG5cblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgX2V4dGVuZHMoeyBjbGFzc05hbWU6IGNsYXNzTmFtZSB9LCBwcm9wcykpO1xuXHR9XG59KTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9ibGFja2xpc3QgPSByZXF1aXJlKCdibGFja2xpc3QnKTtcblxudmFyIF9ibGFja2xpc3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfYmxhY2tsaXN0KTtcblxudmFyIF9GaWVsZENvbnRyb2wgPSByZXF1aXJlKCcuL0ZpZWxkQ29udHJvbCcpO1xuXG52YXIgX0ZpZWxkQ29udHJvbDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9GaWVsZENvbnRyb2wpO1xuXG52YXIgX0ZpZWxkTGFiZWwgPSByZXF1aXJlKCcuL0ZpZWxkTGFiZWwnKTtcblxudmFyIF9GaWVsZExhYmVsMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX0ZpZWxkTGFiZWwpO1xuXG52YXIgX0l0ZW0gPSByZXF1aXJlKCcuL0l0ZW0nKTtcblxudmFyIF9JdGVtMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX0l0ZW0pO1xuXG52YXIgX0l0ZW1Jbm5lciA9IHJlcXVpcmUoJy4vSXRlbUlubmVyJyk7XG5cbnZhciBfSXRlbUlubmVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX0l0ZW1Jbm5lcik7XG5cbnZhciBfcmVhY3RBZGRvbnMgPSByZXF1aXJlKCdyZWFjdC9hZGRvbnMnKTtcblxudmFyIF9yZWFjdEFkZG9uczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdEFkZG9ucyk7XG5cbnZhciBfcmVhY3RUYXBwYWJsZSA9IHJlcXVpcmUoJ3JlYWN0LXRhcHBhYmxlJyk7XG5cbi8vIE1hbnkgaW5wdXQgdHlwZXMgRE8gTk9UIHN1cHBvcnQgc2V0U2VsZWN0aW9uUmFuZ2UuXG4vLyBFbWFpbCB3aWxsIHNob3cgYW4gZXJyb3Igb24gbW9zdCBkZXNrdG9wIGJyb3dzZXJzIGJ1dCB3b3JrcyBvblxuLy8gbW9iaWxlIHNhZmFyaSArIFdLV2ViVmlldywgd2hpY2ggaXMgcmVhbGx5IHdoYXQgd2UgY2FyZSBhYm91dFxuXG52YXIgX3JlYWN0VGFwcGFibGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3RUYXBwYWJsZSk7XG5cbnZhciBTRUxFQ1RBQkxFX0lOUFVUX1RZUEVTID0ge1xuXHQnZW1haWwnOiB0cnVlLFxuXHQncGFzc3dvcmQnOiB0cnVlLFxuXHQnc2VhcmNoJzogdHJ1ZSxcblx0J3RlbCc6IHRydWUsXG5cdCd0ZXh0JzogdHJ1ZSxcblx0J3VybCc6IHRydWVcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gX3JlYWN0QWRkb25zMlsnZGVmYXVsdCddLmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6ICdMYWJlbElucHV0JyxcblxuXHRwcm9wVHlwZXM6IHtcblx0XHRhbGlnblRvcDogX3JlYWN0QWRkb25zMlsnZGVmYXVsdCddLlByb3BUeXBlcy5ib29sLFxuXHRcdGNoaWxkcmVuOiBfcmVhY3RBZGRvbnMyWydkZWZhdWx0J10uUHJvcFR5cGVzLm5vZGUsXG5cdFx0Y2xhc3NOYW1lOiBfcmVhY3RBZGRvbnMyWydkZWZhdWx0J10uUHJvcFR5cGVzLnN0cmluZyxcblx0XHRkaXNhYmxlZDogX3JlYWN0QWRkb25zMlsnZGVmYXVsdCddLlByb3BUeXBlcy5ib29sLFxuXHRcdGxhYmVsOiBfcmVhY3RBZGRvbnMyWydkZWZhdWx0J10uUHJvcFR5cGVzLnN0cmluZyxcblx0XHRyZWFkT25seTogX3JlYWN0QWRkb25zMlsnZGVmYXVsdCddLlByb3BUeXBlcy5ib29sLFxuXHRcdHZhbHVlOiBfcmVhY3RBZGRvbnMyWydkZWZhdWx0J10uUHJvcFR5cGVzLnN0cmluZ1xuXHR9LFxuXG5cdGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24gZ2V0RGVmYXVsdFByb3BzKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRyZWFkT25seTogZmFsc2Vcblx0XHR9O1xuXHR9LFxuXG5cdG1vdmVDdXJzb3JUb0VuZDogZnVuY3Rpb24gbW92ZUN1cnNvclRvRW5kKCkge1xuXHRcdHZhciB0YXJnZXQgPSB0aGlzLnJlZnMuZm9jdXNUYXJnZXQuZ2V0RE9NTm9kZSgpO1xuXHRcdHZhciBlbmRPZlN0cmluZyA9IHRhcmdldC52YWx1ZS5sZW5ndGg7XG5cblx0XHRjb25zb2xlLmNvdW50KCdmb2N1cyAnICsgdGFyZ2V0LnR5cGUpO1xuXG5cdFx0aWYgKFNFTEVDVEFCTEVfSU5QVVRfVFlQRVMuaGFzT3duUHJvcGVydHkodGFyZ2V0LnR5cGUpKSB7XG5cdFx0XHR0YXJnZXQuc2V0U2VsZWN0aW9uUmFuZ2UoZW5kT2ZTdHJpbmcsIGVuZE9mU3RyaW5nKTtcblx0XHR9XG5cdH0sXG5cblx0aGFuZGxlRm9jdXM6IGZ1bmN0aW9uIGhhbmRsZUZvY3VzKCkge1xuXHRcdHRoaXMubW92ZUN1cnNvclRvRW5kKCk7XG5cblx0XHRpZiAodGhpcy5wcm9wcy5vbkZvY3VzKSB7XG5cdFx0XHR0aGlzLnByb3BzLm9uRm9jdXMoKTtcblx0XHR9XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0dmFyIGluZGVudGlmaWVkQnlVc2VySW5wdXQgPSB0aGlzLnByb3BzLmlkIHx8IHRoaXMucHJvcHMuaHRtbEZvcjtcblxuXHRcdHZhciBpbnB1dFByb3BzID0gKDAsIF9ibGFja2xpc3QyWydkZWZhdWx0J10pKHRoaXMucHJvcHMsICdhbGlnblRvcCcsICdjaGlsZHJlbicsICdmaXJzdCcsICdyZWFkT25seScpO1xuXHRcdHZhciByZW5kZXJJbnB1dCA9IHRoaXMucHJvcHMucmVhZE9ubHkgPyBfcmVhY3RBZGRvbnMyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChcblx0XHRcdCdkaXYnLFxuXHRcdFx0eyBjbGFzc05hbWU6IFwiZmllbGQgdS1zZWxlY3RhYmxlXCIgfSxcblx0XHRcdHRoaXMucHJvcHMudmFsdWVcblx0XHQpIDogX3JlYWN0QWRkb25zMlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoJ2lucHV0JywgX2V4dGVuZHMoeyByZWY6IFwiZm9jdXNUYXJnZXRcIiwgY2xhc3NOYW1lOiBcImZpZWxkXCIsIHR5cGU6IFwidGV4dFwiIH0sIGlucHV0UHJvcHMpKTtcblxuXHRcdHJldHVybiBfcmVhY3RBZGRvbnMyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChcblx0XHRcdF9JdGVtMlsnZGVmYXVsdCddLFxuXHRcdFx0eyBhbGlnblRvcDogdGhpcy5wcm9wcy5hbGlnblRvcCwgc2VsZWN0YWJsZTogdGhpcy5wcm9wcy5kaXNhYmxlZCwgY2xhc3NOYW1lOiB0aGlzLnByb3BzLmNsYXNzTmFtZSwgY29tcG9uZW50OiBcImxhYmVsXCIgfSxcblx0XHRcdF9yZWFjdEFkZG9uczJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRfSXRlbUlubmVyMlsnZGVmYXVsdCddLFxuXHRcdFx0XHRudWxsLFxuXHRcdFx0XHRfcmVhY3RBZGRvbnMyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHRfcmVhY3RUYXBwYWJsZTJbJ2RlZmF1bHQnXSxcblx0XHRcdFx0XHR7IG9uVGFwOiB0aGlzLmhhbmRsZUZvY3VzLCBjbGFzc05hbWU6IFwiRmllbGRMYWJlbFwiIH0sXG5cdFx0XHRcdFx0dGhpcy5wcm9wcy5sYWJlbFxuXHRcdFx0XHQpLFxuXHRcdFx0XHRfcmVhY3RBZGRvbnMyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHRfRmllbGRDb250cm9sMlsnZGVmYXVsdCddLFxuXHRcdFx0XHRcdG51bGwsXG5cdFx0XHRcdFx0cmVuZGVySW5wdXQsXG5cdFx0XHRcdFx0dGhpcy5wcm9wcy5jaGlsZHJlblxuXHRcdFx0XHQpXG5cdFx0XHQpXG5cdFx0KTtcblx0fVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgRmllbGRDb250cm9sID0gcmVxdWlyZSgnLi9GaWVsZENvbnRyb2wnKTtcbnZhciBGaWVsZExhYmVsID0gcmVxdWlyZSgnLi9GaWVsZExhYmVsJyk7XG52YXIgSXRlbSA9IHJlcXVpcmUoJy4vSXRlbScpO1xudmFyIEl0ZW1Jbm5lciA9IHJlcXVpcmUoJy4vSXRlbUlubmVyJyk7XG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdC9hZGRvbnMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnTGFiZWxTZWxlY3QnLFxuXHRwcm9wVHlwZXM6IHtcblx0XHRhbGlnblRvcDogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG5cdFx0Y2xhc3NOYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRcdGRpc2FibGVkOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcblx0XHRmaXJzdDogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG5cdFx0bGFiZWw6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdFx0b3B0aW9uczogUmVhY3QuUHJvcFR5cGVzLmFycmF5LFxuXHRcdHZhbHVlOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRcdG9uQ2hhbmdlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG5cdH0sXG5cblx0Z2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiBnZXREZWZhdWx0UHJvcHMoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGNsYXNzTmFtZTogJydcblx0XHR9O1xuXHR9LFxuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHR2YWx1ZTogdGhpcy5wcm9wcy52YWx1ZVxuXHRcdH07XG5cdH0sXG5cblx0Ly91cGRhdGVJbnB1dFZhbHVlOiBmdW5jdGlvbiB1cGRhdGVJbnB1dFZhbHVlKGV2ZW50KSB7XG5cdC8vXHR0aGlzLnNldFN0YXRlKHtcblx0Ly9cdFx0dmFsdWU6IGV2ZW50LnRhcmdldC52YWx1ZVxuXHQvL1x0fSk7XG5cdC8vfSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHQvLyBNYXAgT3B0aW9uc1xuXHRcdHZhciBvcHRpb25zID0gdGhpcy5wcm9wcy5vcHRpb25zLm1hcChmdW5jdGlvbiAob3ApIHtcblx0XHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHQnb3B0aW9uJyxcblx0XHRcdFx0eyBrZXk6ICdvcHRpb24tJyArIG9wLnZhbHVlLCB2YWx1ZTogb3AudmFsdWUgfSxcblx0XHRcdFx0b3AubGFiZWxcblx0XHRcdCk7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdEl0ZW0sXG5cdFx0XHR7IGFsaWduVG9wOiB0aGlzLnByb3BzLmFsaWduVG9wLCBzZWxlY3RhYmxlOiB0aGlzLnByb3BzLmRpc2FibGVkLCBjbGFzc05hbWU6IHRoaXMucHJvcHMuY2xhc3NOYW1lLCBjb21wb25lbnQ6IFwibGFiZWxcIiB9LFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0SXRlbUlubmVyLFxuXHRcdFx0XHRudWxsLFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdEZpZWxkTGFiZWwsXG5cdFx0XHRcdFx0bnVsbCxcblx0XHRcdFx0XHR0aGlzLnByb3BzLmxhYmVsXG5cdFx0XHRcdCksXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0RmllbGRDb250cm9sLFxuXHRcdFx0XHRcdG51bGwsXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHRcdCdzZWxlY3QnLFxuXHRcdFx0XHRcdFx0eyB2YWx1ZTogdGhpcy5wcm9wcy52YWx1ZSwgb25DaGFuZ2U6IHRoaXMucHJvcHMub25DaGFuZ2UsIGNsYXNzTmFtZTogXCJzZWxlY3QtZmllbGRcIiB9LFxuXHRcdFx0XHRcdFx0b3B0aW9uc1xuXHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRcdFx0eyBjbGFzc05hbWU6IFwic2VsZWN0LWZpZWxkLWluZGljYXRvclwiIH0sXG5cdFx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IGNsYXNzTmFtZTogXCJzZWxlY3QtZmllbGQtaW5kaWNhdG9yLWFycm93XCIgfSlcblx0XHRcdFx0XHQpXG5cdFx0XHRcdClcblx0XHRcdClcblx0XHQpO1xuXHR9XG59KTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbnZhciBibGFja2xpc3QgPSByZXF1aXJlKCdibGFja2xpc3QnKTtcbnZhciBjbGFzc25hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QvYWRkb25zJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogJ0xhYmVsVGV4dGFyZWEnLFxuXG5cdHByb3BUeXBlczoge1xuXHRcdGNoaWxkcmVuOiBSZWFjdC5Qcm9wVHlwZXMubm9kZSxcblx0XHRjbGFzc05hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdFx0ZGlzYWJsZWQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuXHRcdGZpcnN0OiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcblx0XHRsYWJlbDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0XHRyZWFkT25seTogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG5cdFx0dmFsdWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmdcblx0fSxcblxuXHRnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uIGdldERlZmF1bHRQcm9wcygpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cm93czogM1xuXHRcdH07XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0dmFyIGNsYXNzTmFtZSA9IGNsYXNzbmFtZXModGhpcy5wcm9wcy5jbGFzc05hbWUsICdsaXN0LWl0ZW0nLCAnZmllbGQtaXRlbScsICdhbGlnbi10b3AnLCB7XG5cdFx0XHQnaXMtZmlyc3QnOiB0aGlzLnByb3BzLmZpcnN0LFxuXHRcdFx0J3Utc2VsZWN0YWJsZSc6IHRoaXMucHJvcHMuZGlzYWJsZWRcblx0XHR9KTtcblxuXHRcdHZhciBwcm9wcyA9IGJsYWNrbGlzdCh0aGlzLnByb3BzLCAnY2hpbGRyZW4nLCAnY2xhc3NOYW1lJywgJ2Rpc2FibGVkJywgJ2ZpcnN0JywgJ2xhYmVsJywgJ3JlYWRPbmx5Jyk7XG5cblx0XHR2YXIgcmVuZGVySW5wdXQgPSB0aGlzLnByb3BzLnJlYWRPbmx5ID8gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdCdkaXYnLFxuXHRcdFx0eyBjbGFzc05hbWU6IFwiZmllbGQgdS1zZWxlY3RhYmxlXCIgfSxcblx0XHRcdHRoaXMucHJvcHMudmFsdWVcblx0XHQpIDogUmVhY3QuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnLCBfZXh0ZW5kcyh7fSwgcHJvcHMsIHsgY2xhc3NOYW1lOiBcImZpZWxkXCIgfSkpO1xuXG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHQnZGl2Jyxcblx0XHRcdHsgY2xhc3NOYW1lOiBjbGFzc05hbWUgfSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdsYWJlbCcsXG5cdFx0XHRcdHsgY2xhc3NOYW1lOiBcIml0ZW0taW5uZXJcIiB9LFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRcdHsgY2xhc3NOYW1lOiBcImZpZWxkLWxhYmVsXCIgfSxcblx0XHRcdFx0XHR0aGlzLnByb3BzLmxhYmVsXG5cdFx0XHRcdCksXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0J2RpdicsXG5cdFx0XHRcdFx0eyBjbGFzc05hbWU6IFwiZmllbGQtY29udHJvbFwiIH0sXG5cdFx0XHRcdFx0cmVuZGVySW5wdXQsXG5cdFx0XHRcdFx0dGhpcy5wcm9wcy5jaGlsZHJlblxuXHRcdFx0XHQpXG5cdFx0XHQpXG5cdFx0KTtcblx0fVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgYmxhY2tsaXN0ID0gcmVxdWlyZSgnYmxhY2tsaXN0Jyk7XG52YXIgY2xhc3NOYW1lcyA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnTGlzdEhlYWRlcicsXG5cblx0cHJvcFR5cGVzOiB7XG5cdFx0Y2xhc3NOYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRcdHN0aWNreTogUmVhY3QuUHJvcFR5cGVzLmJvb2xcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHR2YXIgY2xhc3NOYW1lID0gY2xhc3NOYW1lcygnbGlzdC1oZWFkZXInLCB7XG5cdFx0XHQnc3RpY2t5JzogdGhpcy5wcm9wcy5zdGlja3lcblx0XHR9LCB0aGlzLnByb3BzLmNsYXNzTmFtZSk7XG5cblx0XHR2YXIgcHJvcHMgPSBibGFja2xpc3QodGhpcy5wcm9wcywgJ3N0aWNreScpO1xuXG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIF9leHRlbmRzKHsgY2xhc3NOYW1lOiBjbGFzc05hbWUgfSwgcHJvcHMpKTtcblx0fVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG5cdHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxudmFyIGNsYXNzTmFtZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyk7XG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdC9hZGRvbnMnKTtcbnZhciBUYXBwYWJsZSA9IHJlcXVpcmUoJ3JlYWN0LXRhcHBhYmxlJyk7XG52YXIgVHJhbnNpdGlvbiA9IFJlYWN0LmFkZG9ucy5DU1NUcmFuc2l0aW9uR3JvdXA7XG5cbnZhciBESVJFQ1RJT05TID0ge1xuXHQncmV2ZWFsLWZyb20tcmlnaHQnOiAtMSxcblx0J3Nob3ctZnJvbS1sZWZ0JzogLTEsXG5cdCdzaG93LWZyb20tcmlnaHQnOiAxLFxuXHQncmV2ZWFsLWZyb20tbGVmdCc6IDFcbn07XG5cbnZhciBkZWZhdWx0Q29udHJvbGxlclN0YXRlID0ge1xuXHRkaXJlY3Rpb246IDAsXG5cdGZhZGU6IGZhbHNlLFxuXHRsZWZ0QXJyb3c6IGZhbHNlLFxuXHRsZWZ0QnV0dG9uRGlzYWJsZWQ6IGZhbHNlLFxuXHRsZWZ0SWNvbjogJycsXG5cdGxlZnRMYWJlbDogJycsXG5cdGxlZnRBY3Rpb246IG51bGwsXG5cdHJpZ2h0QXJyb3c6IGZhbHNlLFxuXHRyaWdodEJ1dHRvbkRpc2FibGVkOiBmYWxzZSxcblx0cmlnaHRJY29uOiAnJyxcblx0cmlnaHRMYWJlbDogJycsXG5cdHJpZ2h0QWN0aW9uOiBudWxsLFxuXHR0aXRsZTogJydcbn07XG5cbmZ1bmN0aW9uIG5ld1N0YXRlKGZyb20pIHtcblx0dmFyIG5zID0gX2V4dGVuZHMoe30sIGRlZmF1bHRDb250cm9sbGVyU3RhdGUpO1xuXHRpZiAoZnJvbSkgX2V4dGVuZHMobnMsIGZyb20pO1xuXHRkZWxldGUgbnMubmFtZTsgLy8gbWF5IGxlYWsgZnJvbSBwcm9wc1xuXHRyZXR1cm4gbnM7XG59XG5cbnZhciBOYXZpZ2F0aW9uQmFyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogJ05hdmlnYXRpb25CYXInLFxuXG5cdGNvbnRleHRUeXBlczoge1xuXHRcdGFwcDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdFxuXHR9LFxuXG5cdHByb3BUeXBlczoge1xuXHRcdG5hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmdcblx0fSxcblxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSgpIHtcblx0XHRyZXR1cm4gbmV3U3RhdGUodGhpcy5wcm9wcyk7XG5cdH0sXG5cblx0Y29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuXHRcdGlmICh0aGlzLnByb3BzLm5hbWUpIHtcblx0XHRcdHRoaXMuY29udGV4dC5hcHAubmF2aWdhdGlvbkJhcnNbdGhpcy5wcm9wcy5uYW1lXSA9IHRoaXM7XG5cdFx0fVxuXHR9LFxuXG5cdGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcblx0XHRpZiAodGhpcy5wcm9wcy5uYW1lKSB7XG5cdFx0XHRkZWxldGUgdGhpcy5jb250ZXh0LmFwcC5uYXZpZ2F0aW9uQmFyc1t0aGlzLnByb3BzLm5hbWVdO1xuXHRcdH1cblx0fSxcblxuXHRjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xuXHRcdHRoaXMuc2V0U3RhdGUobmV3U3RhdGUobmV4dFByb3BzKSk7XG5cdFx0aWYgKG5leHRQcm9wcy5uYW1lICE9PSB0aGlzLnByb3BzLm5hbWUpIHtcblx0XHRcdGlmIChuZXh0UHJvcHMubmFtZSkge1xuXHRcdFx0XHR0aGlzLmNvbnRleHQuYXBwLm5hdmlnYXRpb25CYXJzW25leHRQcm9wcy5uYW1lXSA9IHRoaXM7XG5cdFx0XHR9XG5cdFx0XHRpZiAodGhpcy5wcm9wcy5uYW1lKSB7XG5cdFx0XHRcdGRlbGV0ZSB0aGlzLmNvbnRleHQuYXBwLm5hdmlnYXRpb25CYXJzW3RoaXMucHJvcHMubmFtZV07XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKHN0YXRlKSB7XG5cdFx0Ly8gRklYTUU6IHdoYXQgaXMgaGFwcGVuaW5nIGhlcmVcblx0XHRzdGF0ZSA9IG5ld1N0YXRlKHN0YXRlKTtcblx0XHR0aGlzLnNldFN0YXRlKG5ld1N0YXRlKHN0YXRlKSk7XG5cdH0sXG5cblx0dXBkYXRlV2l0aFRyYW5zaXRpb246IGZ1bmN0aW9uIHVwZGF0ZVdpdGhUcmFuc2l0aW9uKHN0YXRlLCB0cmFuc2l0aW9uKSB7XG5cdFx0c3RhdGUgPSBuZXdTdGF0ZShzdGF0ZSk7XG5cdFx0c3RhdGUuZGlyZWN0aW9uID0gRElSRUNUSU9OU1t0cmFuc2l0aW9uXSB8fCAwO1xuXG5cdFx0aWYgKHRyYW5zaXRpb24gPT09ICdmYWRlJyB8fCB0cmFuc2l0aW9uID09PSAnZmFkZS1jb250cmFjdCcgfHwgdHJhbnNpdGlvbiA9PT0gJ2ZhZGUtZXhwYW5kJykge1xuXHRcdFx0c3RhdGUuZmFkZSA9IHRydWU7XG5cdFx0fVxuXG5cdFx0dGhpcy5zZXRTdGF0ZShzdGF0ZSk7XG5cdH0sXG5cblx0cmVuZGVyTGVmdEJ1dHRvbjogZnVuY3Rpb24gcmVuZGVyTGVmdEJ1dHRvbigpIHtcblx0XHR2YXIgY2xhc3NOYW1lID0gY2xhc3NOYW1lcygnTmF2aWdhdGlvbkJhckxlZnRCdXR0b24nLCB7XG5cdFx0XHQnaGFzLWFycm93JzogdGhpcy5zdGF0ZS5sZWZ0QXJyb3dcblx0XHR9KTtcblxuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0VGFwcGFibGUsXG5cdFx0XHR7IG9uVGFwOiB0aGlzLnN0YXRlLmxlZnRBY3Rpb24sIGNsYXNzTmFtZTogY2xhc3NOYW1lLCBkaXNhYmxlZDogdGhpcy5zdGF0ZS5sZWZ0QnV0dG9uRGlzYWJsZWQsIGNvbXBvbmVudDogXCJidXR0b25cIiB9LFxuXHRcdFx0dGhpcy5yZW5kZXJMZWZ0QXJyb3coKSxcblx0XHRcdHRoaXMucmVuZGVyTGVmdExhYmVsKClcblx0XHQpO1xuXHR9LFxuXG5cdHJlbmRlckxlZnRBcnJvdzogZnVuY3Rpb24gcmVuZGVyTGVmdEFycm93KCkge1xuXHRcdHZhciB0cmFuc2l0aW9uTmFtZSA9ICdOYXZpZ2F0aW9uQmFyVHJhbnNpdGlvbi1JbnN0YW50Jztcblx0XHRpZiAodGhpcy5zdGF0ZS5mYWRlIHx8IHRoaXMuc3RhdGUuZGlyZWN0aW9uKSB7XG5cdFx0XHR0cmFuc2l0aW9uTmFtZSA9ICdOYXZpZ2F0aW9uQmFyVHJhbnNpdGlvbi1GYWRlJztcblx0XHR9XG5cblx0XHR2YXIgYXJyb3cgPSB0aGlzLnN0YXRlLmxlZnRBcnJvdyA/IFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nLCB7IGNsYXNzTmFtZTogXCJOYXZpZ2F0aW9uQmFyTGVmdEFycm93XCIgfSkgOiBudWxsO1xuXG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRUcmFuc2l0aW9uLFxuXHRcdFx0eyB0cmFuc2l0aW9uTmFtZTogdHJhbnNpdGlvbk5hbWUgfSxcblx0XHRcdGFycm93XG5cdFx0KTtcblx0fSxcblxuXHRyZW5kZXJMZWZ0TGFiZWw6IGZ1bmN0aW9uIHJlbmRlckxlZnRMYWJlbCgpIHtcblx0XHR2YXIgdHJhbnNpdGlvbk5hbWUgPSAnTmF2aWdhdGlvbkJhclRyYW5zaXRpb24tSW5zdGFudCc7XG5cdFx0aWYgKHRoaXMuc3RhdGUuZmFkZSkge1xuXHRcdFx0dHJhbnNpdGlvbk5hbWUgPSAnTmF2aWdhdGlvbkJhclRyYW5zaXRpb24tRmFkZSc7XG5cdFx0fSBlbHNlIGlmICh0aGlzLnN0YXRlLmRpcmVjdGlvbiA+IDApIHtcblx0XHRcdHRyYW5zaXRpb25OYW1lID0gJ05hdmlnYXRpb25CYXJUcmFuc2l0aW9uLUZvcndhcmRzJztcblx0XHR9IGVsc2UgaWYgKHRoaXMuc3RhdGUuZGlyZWN0aW9uIDwgMCkge1xuXHRcdFx0dHJhbnNpdGlvbk5hbWUgPSAnTmF2aWdhdGlvbkJhclRyYW5zaXRpb24tQmFja3dhcmRzJztcblx0XHR9XG5cblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFRyYW5zaXRpb24sXG5cdFx0XHR7IHRyYW5zaXRpb25OYW1lOiB0cmFuc2l0aW9uTmFtZSB9LFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0J3NwYW4nLFxuXHRcdFx0XHR7IGtleTogRGF0ZS5ub3coKSwgY2xhc3NOYW1lOiBcIk5hdmlnYXRpb25CYXJMZWZ0TGFiZWxcIiB9LFxuXHRcdFx0XHR0aGlzLnN0YXRlLmxlZnRMYWJlbFxuXHRcdFx0KVxuXHRcdCk7XG5cdH0sXG5cblx0cmVuZGVyVGl0bGU6IGZ1bmN0aW9uIHJlbmRlclRpdGxlKCkge1xuXHRcdHZhciB0aXRsZSA9IHRoaXMuc3RhdGUudGl0bGUgPyBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0J3NwYW4nLFxuXHRcdFx0eyBrZXk6IERhdGUubm93KCksIGNsYXNzTmFtZTogXCJOYXZpZ2F0aW9uQmFyVGl0bGVcIiB9LFxuXHRcdFx0dGhpcy5zdGF0ZS50aXRsZVxuXHRcdCkgOiBudWxsO1xuXHRcdHZhciB0cmFuc2l0aW9uTmFtZSA9ICdOYXZpZ2F0aW9uQmFyVHJhbnNpdGlvbi1JbnN0YW50Jztcblx0XHRpZiAodGhpcy5zdGF0ZS5mYWRlKSB7XG5cdFx0XHR0cmFuc2l0aW9uTmFtZSA9ICdOYXZpZ2F0aW9uQmFyVHJhbnNpdGlvbi1GYWRlJztcblx0XHR9IGVsc2UgaWYgKHRoaXMuc3RhdGUuZGlyZWN0aW9uID4gMCkge1xuXHRcdFx0dHJhbnNpdGlvbk5hbWUgPSAnTmF2aWdhdGlvbkJhclRyYW5zaXRpb24tRm9yd2FyZHMnO1xuXHRcdH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5kaXJlY3Rpb24gPCAwKSB7XG5cdFx0XHR0cmFuc2l0aW9uTmFtZSA9ICdOYXZpZ2F0aW9uQmFyVHJhbnNpdGlvbi1CYWNrd2FyZHMnO1xuXHRcdH1cblxuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0VHJhbnNpdGlvbixcblx0XHRcdHsgdHJhbnNpdGlvbk5hbWU6IHRyYW5zaXRpb25OYW1lIH0sXG5cdFx0XHR0aXRsZVxuXHRcdCk7XG5cdH0sXG5cblx0cmVuZGVyUmlnaHRCdXR0b246IGZ1bmN0aW9uIHJlbmRlclJpZ2h0QnV0dG9uKCkge1xuXHRcdHZhciB0cmFuc2l0aW9uTmFtZSA9ICdOYXZpZ2F0aW9uQmFyVHJhbnNpdGlvbi1JbnN0YW50Jztcblx0XHRpZiAodGhpcy5zdGF0ZS5mYWRlIHx8IHRoaXMuc3RhdGUuZGlyZWN0aW9uKSB7XG5cdFx0XHR0cmFuc2l0aW9uTmFtZSA9ICdOYXZpZ2F0aW9uQmFyVHJhbnNpdGlvbi1GYWRlJztcblx0XHR9XG5cdFx0dmFyIGJ1dHRvbiA9IHRoaXMuc3RhdGUucmlnaHRJY29uIHx8IHRoaXMuc3RhdGUucmlnaHRMYWJlbCA/IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRUYXBwYWJsZSxcblx0XHRcdHsga2V5OiBEYXRlLm5vdygpLCBvblRhcDogdGhpcy5zdGF0ZS5yaWdodEFjdGlvbiwgY2xhc3NOYW1lOiBcIk5hdmlnYXRpb25CYXJSaWdodEJ1dHRvblwiLCBkaXNhYmxlZDogdGhpcy5zdGF0ZS5yaWdodEJ1dHRvbkRpc2FibGVkLCBjb21wb25lbnQ6IFwiYnV0dG9uXCIgfSxcblx0XHRcdHRoaXMucmVuZGVyUmlnaHRMYWJlbCgpLFxuXHRcdFx0dGhpcy5yZW5kZXJSaWdodEljb24oKVxuXHRcdCkgOiBudWxsO1xuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0VHJhbnNpdGlvbixcblx0XHRcdHsgdHJhbnNpdGlvbk5hbWU6IHRyYW5zaXRpb25OYW1lIH0sXG5cdFx0XHRidXR0b25cblx0XHQpO1xuXHR9LFxuXG5cdHJlbmRlclJpZ2h0SWNvbjogZnVuY3Rpb24gcmVuZGVyUmlnaHRJY29uKCkge1xuXHRcdGlmICghdGhpcy5zdGF0ZS5yaWdodEljb24pIHJldHVybiBudWxsO1xuXG5cdFx0dmFyIGNsYXNzTmFtZSA9IGNsYXNzTmFtZXMoJ05hdmlnYXRpb25CYXJSaWdodEljb24nLCB0aGlzLnN0YXRlLnJpZ2h0SWNvbik7XG5cblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudCgnc3BhbicsIHsgY2xhc3NOYW1lOiBjbGFzc05hbWUgfSk7XG5cdH0sXG5cblx0cmVuZGVyUmlnaHRMYWJlbDogZnVuY3Rpb24gcmVuZGVyUmlnaHRMYWJlbCgpIHtcblx0XHRyZXR1cm4gdGhpcy5zdGF0ZS5yaWdodExhYmVsID8gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdCdzcGFuJyxcblx0XHRcdHsga2V5OiBEYXRlLm5vdygpLCBjbGFzc05hbWU6IFwiTmF2aWdhdGlvbkJhclJpZ2h0TGFiZWxcIiB9LFxuXHRcdFx0dGhpcy5zdGF0ZS5yaWdodExhYmVsXG5cdFx0KSA6IG51bGw7XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHQnZGl2Jyxcblx0XHRcdHsgY2xhc3NOYW1lOiBcIk5hdmlnYXRpb25CYXJcIiB9LFxuXHRcdFx0dGhpcy5yZW5kZXJMZWZ0QnV0dG9uKCksXG5cdFx0XHR0aGlzLnJlbmRlclRpdGxlKCksXG5cdFx0XHR0aGlzLnJlbmRlclJpZ2h0QnV0dG9uKClcblx0XHQpO1xuXHR9XG59KTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gTmF2aWdhdGlvbkJhcjtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QvYWRkb25zJyk7XG52YXIgUmVhY3RDU1NUcmFuc2l0aW9uR3JvdXAgPSBSZWFjdC5hZGRvbnMuQ1NTVHJhbnNpdGlvbkdyb3VwO1xuXG52YXIgY2xhc3NuYW1lcyA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnUG9wdXAnLFxuXG5cdHByb3BUeXBlczoge1xuXHRcdGNoaWxkcmVuOiBSZWFjdC5Qcm9wVHlwZXMubm9kZSxcblx0XHRjbGFzc05hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdFx0dmlzaWJsZTogUmVhY3QuUHJvcFR5cGVzLmJvb2xcblx0fSxcblxuXHRnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uIGdldERlZmF1bHRQcm9wcygpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dHJhbnNpdGlvbjogJ25vbmUnXG5cdFx0fTtcblx0fSxcblxuXHRyZW5kZXJCYWNrZHJvcDogZnVuY3Rpb24gcmVuZGVyQmFja2Ryb3AoKSB7XG5cdFx0aWYgKCF0aGlzLnByb3BzLnZpc2libGUpIHJldHVybiBudWxsO1xuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IGNsYXNzTmFtZTogXCJQb3B1cC1iYWNrZHJvcFwiIH0pO1xuXHR9LFxuXG5cdHJlbmRlckRpYWxvZzogZnVuY3Rpb24gcmVuZGVyRGlhbG9nKCkge1xuXHRcdGlmICghdGhpcy5wcm9wcy52aXNpYmxlKSByZXR1cm4gbnVsbDtcblxuXHRcdC8vIFNldCBjbGFzc25hbWVzXG5cdFx0dmFyIGRpYWxvZ0NsYXNzTmFtZSA9IGNsYXNzbmFtZXMoJ1BvcHVwLWRpYWxvZycsIHRoaXMucHJvcHMuY2xhc3NOYW1lKTtcblxuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0J2RpdicsXG5cdFx0XHR7IGNsYXNzTmFtZTogZGlhbG9nQ2xhc3NOYW1lIH0sXG5cdFx0XHR0aGlzLnByb3BzLmNoaWxkcmVuXG5cdFx0KTtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdCdkaXYnLFxuXHRcdFx0eyBjbGFzc05hbWU6IFwiUG9wdXBcIiB9LFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0UmVhY3RDU1NUcmFuc2l0aW9uR3JvdXAsXG5cdFx0XHRcdHsgdHJhbnNpdGlvbk5hbWU6IFwiUG9wdXAtZGlhbG9nXCIsIGNvbXBvbmVudDogXCJkaXZcIiB9LFxuXHRcdFx0XHR0aGlzLnJlbmRlckRpYWxvZygpXG5cdFx0XHQpLFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0UmVhY3RDU1NUcmFuc2l0aW9uR3JvdXAsXG5cdFx0XHRcdHsgdHJhbnNpdGlvbk5hbWU6IFwiUG9wdXAtYmFja2dyb3VuZFwiLCBjb21wb25lbnQ6IFwiZGl2XCIgfSxcblx0XHRcdFx0dGhpcy5yZW5kZXJCYWNrZHJvcCgpXG5cdFx0XHQpXG5cdFx0KTtcblx0fVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdC9hZGRvbnMnKTtcbnZhciBjbGFzc05hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6ICdQb3B1cEljb24nLFxuXHRwcm9wVHlwZXM6IHtcblx0XHRuYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRcdHR5cGU6IFJlYWN0LlByb3BUeXBlcy5vbmVPZihbJ2RlZmF1bHQnLCAnbXV0ZWQnLCAncHJpbWFyeScsICdzdWNjZXNzJywgJ3dhcm5pbmcnLCAnZGFuZ2VyJ10pLFxuXHRcdHNwaW5uaW5nOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbFxuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdHZhciBjbGFzc05hbWUgPSBjbGFzc05hbWVzKCdQb3B1cEljb24nLCB7XG5cdFx0XHQnaXMtc3Bpbm5pbmcnOiB0aGlzLnByb3BzLnNwaW5uaW5nXG5cdFx0fSwgdGhpcy5wcm9wcy5uYW1lLCB0aGlzLnByb3BzLnR5cGUpO1xuXG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgY2xhc3NOYW1lOiBjbGFzc05hbWUgfSk7XG5cdH1cbn0pOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNsYXNzbmFtZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyk7XG52YXIgSXRlbSA9IHJlcXVpcmUoJy4vSXRlbScpO1xudmFyIEl0ZW1Jbm5lciA9IHJlcXVpcmUoJy4vSXRlbUlubmVyJyk7XG52YXIgSXRlbU5vdGUgPSByZXF1aXJlKCcuL0l0ZW1Ob3RlJyk7XG52YXIgSXRlbVRpdGxlID0gcmVxdWlyZSgnLi9JdGVtVGl0bGUnKTtcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgVGFwcGFibGUgPSByZXF1aXJlKCdyZWFjdC10YXBwYWJsZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6ICdSYWRpb0xpc3QnLFxuXG5cdHByb3BUeXBlczoge1xuXHRcdG9wdGlvbnM6IFJlYWN0LlByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxuXHRcdHZhbHVlOiBSZWFjdC5Qcm9wVHlwZXMub25lT2ZUeXBlKFtSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLCBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyXSksXG5cdFx0aWNvbjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0XHRvbkNoYW5nZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmNcblx0fSxcblxuXHRvbkNoYW5nZTogZnVuY3Rpb24gb25DaGFuZ2UodmFsdWUpIHtcblx0XHR0aGlzLnByb3BzLm9uQ2hhbmdlKHZhbHVlKTtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0dmFyIG9wdGlvbnMgPSB0aGlzLnByb3BzLm9wdGlvbnMubWFwKGZ1bmN0aW9uIChvcCwgaSkge1xuXHRcdFx0dmFyIGljb25DbGFzc25hbWUgPSBjbGFzc25hbWVzKCdpdGVtLWljb24gcHJpbWFyeScsIG9wLmljb24pO1xuXHRcdFx0dmFyIGNoZWNrTWFyayA9IG9wLnZhbHVlID09PSBzZWxmLnByb3BzLnZhbHVlID8gUmVhY3QuY3JlYXRlRWxlbWVudChJdGVtTm90ZSwgeyB0eXBlOiBcInByaW1hcnlcIiwgaWNvbjogXCJpb24tY2hlY2ttYXJrXCIgfSkgOiBudWxsO1xuXHRcdFx0dmFyIGljb24gPSBvcC5pY29uID8gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0J2RpdicsXG5cdFx0XHRcdHsgY2xhc3NOYW1lOiBcIml0ZW0tbWVkaWFcIiB9LFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KCdzcGFuJywgeyBjbGFzc05hbWU6IGljb25DbGFzc25hbWUgfSlcblx0XHRcdCkgOiBudWxsO1xuXG5cdFx0XHRmdW5jdGlvbiBvbkNoYW5nZSgpIHtcblx0XHRcdFx0c2VsZi5vbkNoYW5nZShvcC52YWx1ZSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRUYXBwYWJsZSxcblx0XHRcdFx0eyBrZXk6ICdvcHRpb24tJyArIGksIG9uVGFwOiBvbkNoYW5nZSB9LFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdEl0ZW0sXG5cdFx0XHRcdFx0eyBrZXk6ICdvcHRpb24tJyArIGksIG9uVGFwOiBvbkNoYW5nZSB9LFxuXHRcdFx0XHRcdGljb24sXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHRcdEl0ZW1Jbm5lcixcblx0XHRcdFx0XHRcdG51bGwsXG5cdFx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdFx0XHRJdGVtVGl0bGUsXG5cdFx0XHRcdFx0XHRcdG51bGwsXG5cdFx0XHRcdFx0XHRcdG9wLmxhYmVsXG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0Y2hlY2tNYXJrXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHQpXG5cdFx0XHQpO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHQnZGl2Jyxcblx0XHRcdG51bGwsXG5cdFx0XHRvcHRpb25zXG5cdFx0KTtcblx0fVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmxhY2tsaXN0ID0gcmVxdWlyZSgnYmxhY2tsaXN0Jyk7XG52YXIgY2xhc3NuYW1lcyA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKTtcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0L2FkZG9ucycpO1xudmFyIFRhcHBhYmxlID0gcmVxdWlyZSgncmVhY3QtdGFwcGFibGUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnU2VhcmNoRmllbGQnLFxuXHRwcm9wVHlwZXM6IHtcblx0XHRjbGFzc05hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdFx0b25DaGFuZ2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuXHRcdG9uQ2xlYXI6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuXHRcdHBsYWNlaG9sZGVyOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRcdHR5cGU6IFJlYWN0LlByb3BUeXBlcy5vbmVPZihbJ2RlZmF1bHQnLCAnZGFyayddKSxcblx0XHR2YWx1ZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xuXHR9LFxuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRpc0ZvY3VzZWQ6IGZhbHNlXG5cdFx0fTtcblx0fSxcblxuXHRnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uIGdldERlZmF1bHRQcm9wcygpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dHlwZTogJ2RlZmF1bHQnLFxuXHRcdFx0dmFsdWU6ICcnXG5cdFx0fTtcblx0fSxcblxuXHRoYW5kbGVDbGVhcjogZnVuY3Rpb24gaGFuZGxlQ2xlYXIoKSB7XG5cdFx0dGhpcy5yZWZzLmlucHV0LmdldERPTU5vZGUoKS5mb2N1cygpO1xuXHRcdHRoaXMucHJvcHMub25DbGVhcigpO1xuXHR9LFxuXG5cdGhhbmRsZUNhbmNlbDogZnVuY3Rpb24gaGFuZGxlQ2FuY2VsKCkge1xuXHRcdHRoaXMucmVmcy5pbnB1dC5nZXRET01Ob2RlKCkuYmx1cigpO1xuXHRcdHRoaXMucHJvcHMub25DYW5jZWwoKTtcblx0fSxcblxuXHRoYW5kbGVDaGFuZ2U6IGZ1bmN0aW9uIGhhbmRsZUNoYW5nZShlKSB7XG5cdFx0dGhpcy5wcm9wcy5vbkNoYW5nZShlLnRhcmdldC52YWx1ZSk7XG5cdH0sXG5cblx0aGFuZGxlQmx1cjogZnVuY3Rpb24gaGFuZGxlQmx1cihlKSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRpc0ZvY3VzZWQ6IGZhbHNlXG5cdFx0fSk7XG5cdH0sXG5cblx0aGFuZGxlRm9jdXM6IGZ1bmN0aW9uIGhhbmRsZUZvY3VzKGUpIHtcblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdGlzRm9jdXNlZDogdHJ1ZVxuXHRcdH0pO1xuXHR9LFxuXG5cdGhhbmRsZVN1Ym1pdDogZnVuY3Rpb24gaGFuZGxlU3VibWl0KGUpIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHR2YXIgaW5wdXQgPSB0aGlzLnJlZnMuaW5wdXQuZ2V0RE9NTm9kZSgpO1xuXG5cdFx0aW5wdXQuYmx1cigpO1xuXHRcdHRoaXMucHJvcHMub25TdWJtaXQoaW5wdXQudmFsdWUpO1xuXHR9LFxuXG5cdHJlbmRlckNsZWFyOiBmdW5jdGlvbiByZW5kZXJDbGVhcigpIHtcblx0XHRpZiAoIXRoaXMucHJvcHMudmFsdWUubGVuZ3RoKSByZXR1cm47XG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGFwcGFibGUsIHsgY2xhc3NOYW1lOiBcIlNlYXJjaEZpZWxkX19pY29uIFNlYXJjaEZpZWxkX19pY29uLS1jbGVhclwiLCBvblRhcDogdGhpcy5oYW5kbGVDbGVhciB9KTtcblx0fSxcblxuXHRyZW5kZXJDYW5jZWw6IGZ1bmN0aW9uIHJlbmRlckNhbmNlbCgpIHtcblx0XHR2YXIgY2xhc3NOYW1lID0gY2xhc3NuYW1lcygnU2VhcmNoRmllbGRfX2NhbmNlbCcsIHtcblx0XHRcdCdpcy12aXNpYmxlJzogdGhpcy5zdGF0ZS5pc0ZvY3VzZWQgfHwgdGhpcy5wcm9wcy52YWx1ZVxuXHRcdH0pO1xuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0VGFwcGFibGUsXG5cdFx0XHR7IGNsYXNzTmFtZTogY2xhc3NOYW1lLCBvblRhcDogdGhpcy5oYW5kbGVDYW5jZWwgfSxcblx0XHRcdCdDYW5jZWwnXG5cdFx0KTtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHR2YXIgY2xhc3NOYW1lID0gY2xhc3NuYW1lcygnU2VhcmNoRmllbGQnLCAnU2VhcmNoRmllbGQtLScgKyB0aGlzLnByb3BzLnR5cGUsIHtcblx0XHRcdCdpcy1mb2N1c2VkJzogdGhpcy5zdGF0ZS5pc0ZvY3VzZWQsXG5cdFx0XHQnaGFzLXZhbHVlJzogdGhpcy5wcm9wcy52YWx1ZVxuXHRcdH0sIHRoaXMucHJvcHMuY2xhc3NOYW1lKTtcblx0XHR2YXIgcHJvcHMgPSBibGFja2xpc3QodGhpcy5wcm9wcywgJ2NsYXNzTmFtZScsICdwbGFjZWhvbGRlcicsICd0eXBlJyk7XG5cblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdCdmb3JtJyxcblx0XHRcdHsgb25TdWJtaXQ6IHRoaXMuaGFuZGxlU3VibWl0LCBhY3Rpb246IFwiamF2YXNjcmlwdDo7XCIsIGNsYXNzTmFtZTogY2xhc3NOYW1lIH0sXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHQnbGFiZWwnLFxuXHRcdFx0XHR7IGNsYXNzTmFtZTogXCJTZWFyY2hGaWVsZF9fZmllbGRcIiB9LFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRcdHsgY2xhc3NOYW1lOiBcIlNlYXJjaEZpZWxkX19wbGFjZWhvbGRlclwiIH0sXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudCgnc3BhbicsIHsgY2xhc3NOYW1lOiBcIlNlYXJjaEZpZWxkX19pY29uIFNlYXJjaEZpZWxkX19pY29uLS1zZWFyY2hcIiB9KSxcblx0XHRcdFx0XHQhdGhpcy5wcm9wcy52YWx1ZS5sZW5ndGggPyB0aGlzLnByb3BzLnBsYWNlaG9sZGVyIDogbnVsbFxuXHRcdFx0XHQpLFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KCdpbnB1dCcsIHsgdHlwZTogXCJzZWFyY2hcIiwgcmVmOiBcImlucHV0XCIsIHZhbHVlOiB0aGlzLnByb3BzLnZhbHVlLCBvbkNoYW5nZTogdGhpcy5oYW5kbGVDaGFuZ2UsIG9uRm9jdXM6IHRoaXMuaGFuZGxlRm9jdXMsIG9uQmx1cjogdGhpcy5oYW5kbGVCbHVyLCBjbGFzc05hbWU6IFwiU2VhcmNoRmllbGRfX2lucHV0XCIgfSksXG5cdFx0XHRcdHRoaXMucmVuZGVyQ2xlYXIoKVxuXHRcdFx0KSxcblx0XHRcdHRoaXMucmVuZGVyQ2FuY2VsKClcblx0XHQpO1xuXHR9XG59KTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgY2xhc3NuYW1lcyA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKTtcbnZhciBUYXBwYWJsZSA9IHJlcXVpcmUoJ3JlYWN0LXRhcHBhYmxlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogJ1NlZ21lbnRlZENvbnRyb2wnLFxuXG5cdHByb3BUeXBlczoge1xuXHRcdGNsYXNzTmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0XHRlcXVhbFdpZHRoU2VnbWVudHM6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuXHRcdGlzSW5saW5lOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcblx0XHRoYXNHdXR0ZXI6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuXHRcdG9uQ2hhbmdlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuXHRcdG9wdGlvbnM6IFJlYWN0LlByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxuXHRcdHR5cGU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdFx0dmFsdWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmdcblx0fSxcblxuXHRnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uIGdldERlZmF1bHRQcm9wcygpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dHlwZTogJ3ByaW1hcnknXG5cdFx0fTtcblx0fSxcblxuXHRvbkNoYW5nZTogZnVuY3Rpb24gb25DaGFuZ2UodmFsdWUpIHtcblx0XHR0aGlzLnByb3BzLm9uQ2hhbmdlKHZhbHVlKTtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHR2YXIgY29tcG9uZW50Q2xhc3NOYW1lID0gY2xhc3NuYW1lcygnU2VnbWVudGVkQ29udHJvbCcsICdTZWdtZW50ZWRDb250cm9sLS0nICsgdGhpcy5wcm9wcy50eXBlLCB7XG5cdFx0XHQnU2VnbWVudGVkQ29udHJvbC0taW5saW5lJzogdGhpcy5wcm9wcy5pc0lubGluZSxcblx0XHRcdCdTZWdtZW50ZWRDb250cm9sLS1oYXMtZ3V0dGVyJzogdGhpcy5wcm9wcy5oYXNHdXR0ZXIsXG5cdFx0XHQnU2VnbWVudGVkQ29udHJvbC0tZXF1YWwtd2lkdGhzJzogdGhpcy5wcm9wcy5lcXVhbFdpZHRoU2VnbWVudHNcblx0XHR9LCB0aGlzLnByb3BzLmNsYXNzTmFtZSk7XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXG5cdFx0dmFyIG9wdGlvbnMgPSB0aGlzLnByb3BzLm9wdGlvbnMubWFwKGZ1bmN0aW9uIChvcCkge1xuXHRcdFx0ZnVuY3Rpb24gb25DaGFuZ2UoKSB7XG5cdFx0XHRcdHNlbGYub25DaGFuZ2Uob3AudmFsdWUpO1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgaXRlbUNsYXNzTmFtZSA9IGNsYXNzbmFtZXMoJ1NlZ21lbnRlZENvbnRyb2xfX2l0ZW0nLCB7XG5cdFx0XHRcdCdpcy1zZWxlY3RlZCc6IG9wLnZhbHVlID09PSBzZWxmLnByb3BzLnZhbHVlXG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFRhcHBhYmxlLFxuXHRcdFx0XHR7IGtleTogJ29wdGlvbi0nICsgb3AudmFsdWUsIG9uVGFwOiBvbkNoYW5nZSwgY2xhc3NOYW1lOiBpdGVtQ2xhc3NOYW1lIH0sXG5cdFx0XHRcdG9wLmxhYmVsXG5cdFx0XHQpO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHQnZGl2Jyxcblx0XHRcdHsgY2xhc3NOYW1lOiBjb21wb25lbnRDbGFzc05hbWUgfSxcblx0XHRcdG9wdGlvbnNcblx0XHQpO1xuXHR9XG59KTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBjbGFzc25hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBUYXBwYWJsZSA9IHJlcXVpcmUoJ3JlYWN0LXRhcHBhYmxlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogJ1N3aXRjaCcsXG5cblx0cHJvcFR5cGVzOiB7XG5cdFx0ZGlzYWJsZWQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuXHRcdG9uOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcblx0XHRvblRhcDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG5cdFx0dHlwZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xuXHR9LFxuXG5cdGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24gZ2V0RGVmYXVsdFByb3BzKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHR0eXBlOiAnZGVmYXVsdCdcblx0XHR9O1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdHZhciBjbGFzc05hbWUgPSBjbGFzc25hbWVzKCdTd2l0Y2gnLCAnU3dpdGNoLS0nICsgdGhpcy5wcm9wcy50eXBlLCB7XG5cdFx0XHQnaXMtZGlzYWJsZWQnOiB0aGlzLnByb3BzLmRpc2FibGVkLFxuXHRcdFx0J2lzLW9uJzogdGhpcy5wcm9wcy5vblxuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRUYXBwYWJsZSxcblx0XHRcdHsgb25UYXA6IHRoaXMucHJvcHMub25UYXAsIGNsYXNzTmFtZTogY2xhc3NOYW1lLCBjb21wb25lbnQ6IFwibGFiZWxcIiB9LFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0J2RpdicsXG5cdFx0XHRcdHsgY2xhc3NOYW1lOiBcIlN3aXRjaF9fdHJhY2tcIiB9LFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IGNsYXNzTmFtZTogXCJTd2l0Y2hfX2hhbmRsZVwiIH0pXG5cdFx0XHQpXG5cdFx0KTtcblx0fVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG5cdHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBUYXBwYWJsZSA9IHJlcXVpcmUoJ3JlYWN0LXRhcHBhYmxlJyk7XG5cbnZhciBibGFja2xpc3QgPSByZXF1aXJlKCdibGFja2xpc3QnKTtcbnZhciBjbGFzc25hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xuXG52YXIgTmF2aWdhdG9yID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogJ05hdmlnYXRvcicsXG5cblx0cHJvcFR5cGVzOiB7XG5cdFx0Y2xhc3NOYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0dmFyIGNsYXNzTmFtZSA9IGNsYXNzbmFtZXMoJ1RhYnMtTmF2aWdhdG9yJywgdGhpcy5wcm9wcy5jbGFzc05hbWUpO1xuXHRcdHZhciBvdGhlclByb3BzID0gYmxhY2tsaXN0KHRoaXMucHJvcHMsICdjbGFzc05hbWUnKTtcblxuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCBfZXh0ZW5kcyh7IGNsYXNzTmFtZTogY2xhc3NOYW1lIH0sIG90aGVyUHJvcHMpKTtcblx0fVxufSk7XG5cbmV4cG9ydHMuTmF2aWdhdG9yID0gTmF2aWdhdG9yO1xudmFyIFRhYiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6ICdUYWInLFxuXG5cdHByb3BUeXBlczoge1xuXHRcdHNlbGVjdGVkOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbFxuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdHZhciBjbGFzc05hbWUgPSBjbGFzc25hbWVzKCdUYWJzLVRhYicsIHsgJ2lzLXNlbGVjdGVkJzogdGhpcy5wcm9wcy5zZWxlY3RlZCB9KTtcblx0XHR2YXIgb3RoZXJQcm9wcyA9IGJsYWNrbGlzdCh0aGlzLnByb3BzLCAnc2VsZWN0ZWQnKTtcblxuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFRhcHBhYmxlLCBfZXh0ZW5kcyh7IGNsYXNzTmFtZTogY2xhc3NOYW1lIH0sIG90aGVyUHJvcHMpKTtcblx0fVxufSk7XG5cbmV4cG9ydHMuVGFiID0gVGFiO1xudmFyIExhYmVsID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogJ0xhYmVsJyxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgX2V4dGVuZHMoeyBjbGFzc05hbWU6IFwiVGFicy1MYWJlbFwiIH0sIHRoaXMucHJvcHMpKTtcblx0fVxufSk7XG5leHBvcnRzLkxhYmVsID0gTGFiZWw7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdC9hZGRvbnMnKTtcblxudmFyIEl0ZW0gPSByZXF1aXJlKCcuL0l0ZW0nKTtcbnZhciBJdGVtQ29udGVudCA9IHJlcXVpcmUoJy4vSXRlbUNvbnRlbnQnKTtcbnZhciBJdGVtSW5uZXIgPSByZXF1aXJlKCcuL0l0ZW1Jbm5lcicpO1xuXG52YXIgYmxhY2tsaXN0ID0gcmVxdWlyZSgnYmxhY2tsaXN0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogJ0lucHV0Jyxcblx0cHJvcFR5cGVzOiB7XG5cdFx0Y2xhc3NOYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRcdGNoaWxkcmVuOiBSZWFjdC5Qcm9wVHlwZXMubm9kZSxcblx0XHRkaXNhYmxlZDogUmVhY3QuUHJvcFR5cGVzLmJvb2xcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHR2YXIgaW5wdXRQcm9wcyA9IGJsYWNrbGlzdCh0aGlzLnByb3BzLCAnY2hpbGRyZW4nLCAnY2xhc3NOYW1lJyk7XG5cblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdEl0ZW0sXG5cdFx0XHR7IHNlbGVjdGFibGU6IHRoaXMucHJvcHMuZGlzYWJsZWQsIGNsYXNzTmFtZTogdGhpcy5wcm9wcy5jbGFzc05hbWUsIGNvbXBvbmVudDogXCJsYWJlbFwiIH0sXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRJdGVtSW5uZXIsXG5cdFx0XHRcdG51bGwsXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0SXRlbUNvbnRlbnQsXG5cdFx0XHRcdFx0eyBjb21wb25lbnQ6IFwibGFiZWxcIiB9LFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJywgX2V4dGVuZHMoeyBjbGFzc05hbWU6IFwiZmllbGRcIiwgcm93czogMyB9LCBpbnB1dFByb3BzKSlcblx0XHRcdFx0KSxcblx0XHRcdFx0dGhpcy5wcm9wcy5jaGlsZHJlblxuXHRcdFx0KVxuXHRcdCk7XG5cdH1cbn0pOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG52YXIgQWxlcnRiYXIgPSByZXF1aXJlKCcuL0FsZXJ0YmFyJyk7XG5leHBvcnRzLkFsZXJ0YmFyID0gQWxlcnRiYXI7XG52YXIgQnV0dG9uID0gcmVxdWlyZSgnLi9CdXR0b24nKTtcbmV4cG9ydHMuQnV0dG9uID0gQnV0dG9uO1xudmFyIEJ1dHRvbkdyb3VwID0gcmVxdWlyZSgnLi9CdXR0b25Hcm91cCcpO1xuZXhwb3J0cy5CdXR0b25Hcm91cCA9IEJ1dHRvbkdyb3VwO1xudmFyIEZpZWxkQ29udHJvbCA9IHJlcXVpcmUoJy4vRmllbGRDb250cm9sJyk7XG5leHBvcnRzLkZpZWxkQ29udHJvbCA9IEZpZWxkQ29udHJvbDtcbnZhciBGaWVsZExhYmVsID0gcmVxdWlyZSgnLi9GaWVsZExhYmVsJyk7XG5leHBvcnRzLkZpZWxkTGFiZWwgPSBGaWVsZExhYmVsO1xudmFyIEdyb3VwID0gcmVxdWlyZSgnLi9Hcm91cCcpO1xuZXhwb3J0cy5Hcm91cCA9IEdyb3VwO1xudmFyIEdyb3VwQm9keSA9IHJlcXVpcmUoJy4vR3JvdXBCb2R5Jyk7XG5leHBvcnRzLkdyb3VwQm9keSA9IEdyb3VwQm9keTtcbnZhciBHcm91cEZvb3RlciA9IHJlcXVpcmUoJy4vR3JvdXBGb290ZXInKTtcbmV4cG9ydHMuR3JvdXBGb290ZXIgPSBHcm91cEZvb3RlcjtcbnZhciBHcm91cEhlYWRlciA9IHJlcXVpcmUoJy4vR3JvdXBIZWFkZXInKTtcbmV4cG9ydHMuR3JvdXBIZWFkZXIgPSBHcm91cEhlYWRlcjtcbnZhciBHcm91cElubmVyID0gcmVxdWlyZSgnLi9Hcm91cElubmVyJyk7XG5leHBvcnRzLkdyb3VwSW5uZXIgPSBHcm91cElubmVyO1xudmFyIEl0ZW0gPSByZXF1aXJlKCcuL0l0ZW0nKTtcbmV4cG9ydHMuSXRlbSA9IEl0ZW07XG52YXIgSXRlbUNvbnRlbnQgPSByZXF1aXJlKCcuL0l0ZW1Db250ZW50Jyk7XG5leHBvcnRzLkl0ZW1Db250ZW50ID0gSXRlbUNvbnRlbnQ7XG52YXIgSXRlbUlubmVyID0gcmVxdWlyZSgnLi9JdGVtSW5uZXInKTtcbmV4cG9ydHMuSXRlbUlubmVyID0gSXRlbUlubmVyO1xudmFyIEl0ZW1NZWRpYSA9IHJlcXVpcmUoJy4vSXRlbU1lZGlhJyk7XG5leHBvcnRzLkl0ZW1NZWRpYSA9IEl0ZW1NZWRpYTtcbnZhciBJdGVtTm90ZSA9IHJlcXVpcmUoJy4vSXRlbU5vdGUnKTtcbmV4cG9ydHMuSXRlbU5vdGUgPSBJdGVtTm90ZTtcbnZhciBJdGVtU3ViVGl0bGUgPSByZXF1aXJlKCcuL0l0ZW1TdWJUaXRsZScpO1xuZXhwb3J0cy5JdGVtU3ViVGl0bGUgPSBJdGVtU3ViVGl0bGU7XG52YXIgSXRlbVRpdGxlID0gcmVxdWlyZSgnLi9JdGVtVGl0bGUnKTtcbmV4cG9ydHMuSXRlbVRpdGxlID0gSXRlbVRpdGxlO1xudmFyIExhYmVsSW5wdXQgPSByZXF1aXJlKCcuL0xhYmVsSW5wdXQnKTtcbmV4cG9ydHMuTGFiZWxJbnB1dCA9IExhYmVsSW5wdXQ7XG52YXIgTGFiZWxTZWxlY3QgPSByZXF1aXJlKCcuL0xhYmVsU2VsZWN0Jyk7XG5leHBvcnRzLkxhYmVsU2VsZWN0ID0gTGFiZWxTZWxlY3Q7XG52YXIgTGFiZWxUZXh0YXJlYSA9IHJlcXVpcmUoJy4vTGFiZWxUZXh0YXJlYScpO1xuZXhwb3J0cy5MYWJlbFRleHRhcmVhID0gTGFiZWxUZXh0YXJlYTtcbnZhciBMaXN0SGVhZGVyID0gcmVxdWlyZSgnLi9MaXN0SGVhZGVyJyk7XG5leHBvcnRzLkxpc3RIZWFkZXIgPSBMaXN0SGVhZGVyO1xudmFyIE5hdmlnYXRpb25CYXIgPSByZXF1aXJlKCcuL05hdmlnYXRpb25CYXInKTtcbmV4cG9ydHMuTmF2aWdhdGlvbkJhciA9IE5hdmlnYXRpb25CYXI7XG52YXIgUG9wdXAgPSByZXF1aXJlKCcuL1BvcHVwJyk7XG5leHBvcnRzLlBvcHVwID0gUG9wdXA7XG52YXIgUG9wdXBJY29uID0gcmVxdWlyZSgnLi9Qb3B1cEljb24nKTtcbmV4cG9ydHMuUG9wdXBJY29uID0gUG9wdXBJY29uO1xudmFyIFJhZGlvTGlzdCA9IHJlcXVpcmUoJy4vUmFkaW9MaXN0Jyk7XG5leHBvcnRzLlJhZGlvTGlzdCA9IFJhZGlvTGlzdDtcbnZhciBTZWFyY2hGaWVsZCA9IHJlcXVpcmUoJy4vU2VhcmNoRmllbGQnKTtcbmV4cG9ydHMuU2VhcmNoRmllbGQgPSBTZWFyY2hGaWVsZDtcbnZhciBTZWdtZW50ZWRDb250cm9sID0gcmVxdWlyZSgnLi9TZWdtZW50ZWRDb250cm9sJyk7XG5leHBvcnRzLlNlZ21lbnRlZENvbnRyb2wgPSBTZWdtZW50ZWRDb250cm9sO1xudmFyIFN3aXRjaCA9IHJlcXVpcmUoJy4vU3dpdGNoJyk7XG5leHBvcnRzLlN3aXRjaCA9IFN3aXRjaDtcbnZhciBUYWJzID0gcmVxdWlyZSgnLi9UYWJzJyk7XG5leHBvcnRzLlRhYnMgPSBUYWJzO1xudmFyIFRleHRhcmVhID0gcmVxdWlyZSgnLi9UZXh0YXJlYScpO1xuXG4vLyBkZXBlbmRzIG9uIGFib3ZlXG5leHBvcnRzLlRleHRhcmVhID0gVGV4dGFyZWE7XG52YXIgSW5wdXQgPSByZXF1aXJlKCcuL0lucHV0Jyk7XG5leHBvcnRzLklucHV0ID0gSW5wdXQ7IiwiLyoqXG4gKiBUd2Vlbi5qcyAtIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICogaHR0cHM6Ly9naXRodWIuY29tL3NvbGUvdHdlZW4uanNcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqXG4gKiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3NvbGUvdHdlZW4uanMvZ3JhcGhzL2NvbnRyaWJ1dG9ycyBmb3IgdGhlIGZ1bGwgbGlzdCBvZiBjb250cmlidXRvcnMuXG4gKiBUaGFuayB5b3UgYWxsLCB5b3UncmUgYXdlc29tZSFcbiAqL1xuXG4vLyBEYXRlLm5vdyBzaGltIGZvciAoYWhlbSkgSW50ZXJuZXQgRXhwbG8oZHxyKWVyXG5pZiAoIERhdGUubm93ID09PSB1bmRlZmluZWQgKSB7XG5cblx0RGF0ZS5ub3cgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRyZXR1cm4gbmV3IERhdGUoKS52YWx1ZU9mKCk7XG5cblx0fTtcblxufVxuXG52YXIgVFdFRU4gPSBUV0VFTiB8fCAoIGZ1bmN0aW9uICgpIHtcblxuXHR2YXIgX3R3ZWVucyA9IFtdO1xuXG5cdHJldHVybiB7XG5cblx0XHRSRVZJU0lPTjogJzE0JyxcblxuXHRcdGdldEFsbDogZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRyZXR1cm4gX3R3ZWVucztcblxuXHRcdH0sXG5cblx0XHRyZW1vdmVBbGw6IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0X3R3ZWVucyA9IFtdO1xuXG5cdFx0fSxcblxuXHRcdGFkZDogZnVuY3Rpb24gKCB0d2VlbiApIHtcblxuXHRcdFx0X3R3ZWVucy5wdXNoKCB0d2VlbiApO1xuXG5cdFx0fSxcblxuXHRcdHJlbW92ZTogZnVuY3Rpb24gKCB0d2VlbiApIHtcblxuXHRcdFx0dmFyIGkgPSBfdHdlZW5zLmluZGV4T2YoIHR3ZWVuICk7XG5cblx0XHRcdGlmICggaSAhPT0gLTEgKSB7XG5cblx0XHRcdFx0X3R3ZWVucy5zcGxpY2UoIGksIDEgKTtcblxuXHRcdFx0fVxuXG5cdFx0fSxcblxuXHRcdHVwZGF0ZTogZnVuY3Rpb24gKCB0aW1lICkge1xuXG5cdFx0XHRpZiAoIF90d2VlbnMubGVuZ3RoID09PSAwICkgcmV0dXJuIGZhbHNlO1xuXG5cdFx0XHR2YXIgaSA9IDA7XG5cblx0XHRcdHRpbWUgPSB0aW1lICE9PSB1bmRlZmluZWQgPyB0aW1lIDogKCB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cucGVyZm9ybWFuY2UgIT09IHVuZGVmaW5lZCAmJiB3aW5kb3cucGVyZm9ybWFuY2Uubm93ICE9PSB1bmRlZmluZWQgPyB3aW5kb3cucGVyZm9ybWFuY2Uubm93KCkgOiBEYXRlLm5vdygpICk7XG5cblx0XHRcdHdoaWxlICggaSA8IF90d2VlbnMubGVuZ3RoICkge1xuXG5cdFx0XHRcdGlmICggX3R3ZWVuc1sgaSBdLnVwZGF0ZSggdGltZSApICkge1xuXG5cdFx0XHRcdFx0aSsrO1xuXG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRfdHdlZW5zLnNwbGljZSggaSwgMSApO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblxuXHRcdH1cblx0fTtcblxufSApKCk7XG5cblRXRUVOLlR3ZWVuID0gZnVuY3Rpb24gKCBvYmplY3QgKSB7XG5cblx0dmFyIF9vYmplY3QgPSBvYmplY3Q7XG5cdHZhciBfdmFsdWVzU3RhcnQgPSB7fTtcblx0dmFyIF92YWx1ZXNFbmQgPSB7fTtcblx0dmFyIF92YWx1ZXNTdGFydFJlcGVhdCA9IHt9O1xuXHR2YXIgX2R1cmF0aW9uID0gMTAwMDtcblx0dmFyIF9yZXBlYXQgPSAwO1xuXHR2YXIgX3lveW8gPSBmYWxzZTtcblx0dmFyIF9pc1BsYXlpbmcgPSBmYWxzZTtcblx0dmFyIF9yZXZlcnNlZCA9IGZhbHNlO1xuXHR2YXIgX2RlbGF5VGltZSA9IDA7XG5cdHZhciBfc3RhcnRUaW1lID0gbnVsbDtcblx0dmFyIF9lYXNpbmdGdW5jdGlvbiA9IFRXRUVOLkVhc2luZy5MaW5lYXIuTm9uZTtcblx0dmFyIF9pbnRlcnBvbGF0aW9uRnVuY3Rpb24gPSBUV0VFTi5JbnRlcnBvbGF0aW9uLkxpbmVhcjtcblx0dmFyIF9jaGFpbmVkVHdlZW5zID0gW107XG5cdHZhciBfb25TdGFydENhbGxiYWNrID0gbnVsbDtcblx0dmFyIF9vblN0YXJ0Q2FsbGJhY2tGaXJlZCA9IGZhbHNlO1xuXHR2YXIgX29uVXBkYXRlQ2FsbGJhY2sgPSBudWxsO1xuXHR2YXIgX29uQ29tcGxldGVDYWxsYmFjayA9IG51bGw7XG5cdHZhciBfb25TdG9wQ2FsbGJhY2sgPSBudWxsO1xuXG5cdC8vIFNldCBhbGwgc3RhcnRpbmcgdmFsdWVzIHByZXNlbnQgb24gdGhlIHRhcmdldCBvYmplY3Rcblx0Zm9yICggdmFyIGZpZWxkIGluIG9iamVjdCApIHtcblxuXHRcdF92YWx1ZXNTdGFydFsgZmllbGQgXSA9IHBhcnNlRmxvYXQob2JqZWN0W2ZpZWxkXSwgMTApO1xuXG5cdH1cblxuXHR0aGlzLnRvID0gZnVuY3Rpb24gKCBwcm9wZXJ0aWVzLCBkdXJhdGlvbiApIHtcblxuXHRcdGlmICggZHVyYXRpb24gIT09IHVuZGVmaW5lZCApIHtcblxuXHRcdFx0X2R1cmF0aW9uID0gZHVyYXRpb247XG5cblx0XHR9XG5cblx0XHRfdmFsdWVzRW5kID0gcHJvcGVydGllcztcblxuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5zdGFydCA9IGZ1bmN0aW9uICggdGltZSApIHtcblxuXHRcdFRXRUVOLmFkZCggdGhpcyApO1xuXG5cdFx0X2lzUGxheWluZyA9IHRydWU7XG5cblx0XHRfb25TdGFydENhbGxiYWNrRmlyZWQgPSBmYWxzZTtcblxuXHRcdF9zdGFydFRpbWUgPSB0aW1lICE9PSB1bmRlZmluZWQgPyB0aW1lIDogKCB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cucGVyZm9ybWFuY2UgIT09IHVuZGVmaW5lZCAmJiB3aW5kb3cucGVyZm9ybWFuY2Uubm93ICE9PSB1bmRlZmluZWQgPyB3aW5kb3cucGVyZm9ybWFuY2Uubm93KCkgOiBEYXRlLm5vdygpICk7XG5cdFx0X3N0YXJ0VGltZSArPSBfZGVsYXlUaW1lO1xuXG5cdFx0Zm9yICggdmFyIHByb3BlcnR5IGluIF92YWx1ZXNFbmQgKSB7XG5cblx0XHRcdC8vIGNoZWNrIGlmIGFuIEFycmF5IHdhcyBwcm92aWRlZCBhcyBwcm9wZXJ0eSB2YWx1ZVxuXHRcdFx0aWYgKCBfdmFsdWVzRW5kWyBwcm9wZXJ0eSBdIGluc3RhbmNlb2YgQXJyYXkgKSB7XG5cblx0XHRcdFx0aWYgKCBfdmFsdWVzRW5kWyBwcm9wZXJ0eSBdLmxlbmd0aCA9PT0gMCApIHtcblxuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBjcmVhdGUgYSBsb2NhbCBjb3B5IG9mIHRoZSBBcnJheSB3aXRoIHRoZSBzdGFydCB2YWx1ZSBhdCB0aGUgZnJvbnRcblx0XHRcdFx0X3ZhbHVlc0VuZFsgcHJvcGVydHkgXSA9IFsgX29iamVjdFsgcHJvcGVydHkgXSBdLmNvbmNhdCggX3ZhbHVlc0VuZFsgcHJvcGVydHkgXSApO1xuXG5cdFx0XHR9XG5cblx0XHRcdF92YWx1ZXNTdGFydFsgcHJvcGVydHkgXSA9IF9vYmplY3RbIHByb3BlcnR5IF07XG5cblx0XHRcdGlmKCAoIF92YWx1ZXNTdGFydFsgcHJvcGVydHkgXSBpbnN0YW5jZW9mIEFycmF5ICkgPT09IGZhbHNlICkge1xuXHRcdFx0XHRfdmFsdWVzU3RhcnRbIHByb3BlcnR5IF0gKj0gMS4wOyAvLyBFbnN1cmVzIHdlJ3JlIHVzaW5nIG51bWJlcnMsIG5vdCBzdHJpbmdzXG5cdFx0XHR9XG5cblx0XHRcdF92YWx1ZXNTdGFydFJlcGVhdFsgcHJvcGVydHkgXSA9IF92YWx1ZXNTdGFydFsgcHJvcGVydHkgXSB8fCAwO1xuXG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRpZiAoICFfaXNQbGF5aW5nICkge1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fVxuXG5cdFx0VFdFRU4ucmVtb3ZlKCB0aGlzICk7XG5cdFx0X2lzUGxheWluZyA9IGZhbHNlO1xuXG5cdFx0aWYgKCBfb25TdG9wQ2FsbGJhY2sgIT09IG51bGwgKSB7XG5cblx0XHRcdF9vblN0b3BDYWxsYmFjay5jYWxsKCBfb2JqZWN0ICk7XG5cblx0XHR9XG5cblx0XHR0aGlzLnN0b3BDaGFpbmVkVHdlZW5zKCk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLnN0b3BDaGFpbmVkVHdlZW5zID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0Zm9yICggdmFyIGkgPSAwLCBudW1DaGFpbmVkVHdlZW5zID0gX2NoYWluZWRUd2VlbnMubGVuZ3RoOyBpIDwgbnVtQ2hhaW5lZFR3ZWVuczsgaSsrICkge1xuXG5cdFx0XHRfY2hhaW5lZFR3ZWVuc1sgaSBdLnN0b3AoKTtcblxuXHRcdH1cblxuXHR9O1xuXG5cdHRoaXMuZGVsYXkgPSBmdW5jdGlvbiAoIGFtb3VudCApIHtcblxuXHRcdF9kZWxheVRpbWUgPSBhbW91bnQ7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLnJlcGVhdCA9IGZ1bmN0aW9uICggdGltZXMgKSB7XG5cblx0XHRfcmVwZWF0ID0gdGltZXM7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLnlveW8gPSBmdW5jdGlvbiggeW95byApIHtcblxuXHRcdF95b3lvID0geW95bztcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cblx0dGhpcy5lYXNpbmcgPSBmdW5jdGlvbiAoIGVhc2luZyApIHtcblxuXHRcdF9lYXNpbmdGdW5jdGlvbiA9IGVhc2luZztcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMuaW50ZXJwb2xhdGlvbiA9IGZ1bmN0aW9uICggaW50ZXJwb2xhdGlvbiApIHtcblxuXHRcdF9pbnRlcnBvbGF0aW9uRnVuY3Rpb24gPSBpbnRlcnBvbGF0aW9uO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5jaGFpbiA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdF9jaGFpbmVkVHdlZW5zID0gYXJndW1lbnRzO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5vblN0YXJ0ID0gZnVuY3Rpb24gKCBjYWxsYmFjayApIHtcblxuXHRcdF9vblN0YXJ0Q2FsbGJhY2sgPSBjYWxsYmFjaztcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMub25VcGRhdGUgPSBmdW5jdGlvbiAoIGNhbGxiYWNrICkge1xuXG5cdFx0X29uVXBkYXRlQ2FsbGJhY2sgPSBjYWxsYmFjaztcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMub25Db21wbGV0ZSA9IGZ1bmN0aW9uICggY2FsbGJhY2sgKSB7XG5cblx0XHRfb25Db21wbGV0ZUNhbGxiYWNrID0gY2FsbGJhY2s7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLm9uU3RvcCA9IGZ1bmN0aW9uICggY2FsbGJhY2sgKSB7XG5cblx0XHRfb25TdG9wQ2FsbGJhY2sgPSBjYWxsYmFjaztcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMudXBkYXRlID0gZnVuY3Rpb24gKCB0aW1lICkge1xuXG5cdFx0dmFyIHByb3BlcnR5O1xuXG5cdFx0aWYgKCB0aW1lIDwgX3N0YXJ0VGltZSApIHtcblxuXHRcdFx0cmV0dXJuIHRydWU7XG5cblx0XHR9XG5cblx0XHRpZiAoIF9vblN0YXJ0Q2FsbGJhY2tGaXJlZCA9PT0gZmFsc2UgKSB7XG5cblx0XHRcdGlmICggX29uU3RhcnRDYWxsYmFjayAhPT0gbnVsbCApIHtcblxuXHRcdFx0XHRfb25TdGFydENhbGxiYWNrLmNhbGwoIF9vYmplY3QgKTtcblxuXHRcdFx0fVxuXG5cdFx0XHRfb25TdGFydENhbGxiYWNrRmlyZWQgPSB0cnVlO1xuXG5cdFx0fVxuXG5cdFx0dmFyIGVsYXBzZWQgPSAoIHRpbWUgLSBfc3RhcnRUaW1lICkgLyBfZHVyYXRpb247XG5cdFx0ZWxhcHNlZCA9IGVsYXBzZWQgPiAxID8gMSA6IGVsYXBzZWQ7XG5cblx0XHR2YXIgdmFsdWUgPSBfZWFzaW5nRnVuY3Rpb24oIGVsYXBzZWQgKTtcblxuXHRcdGZvciAoIHByb3BlcnR5IGluIF92YWx1ZXNFbmQgKSB7XG5cblx0XHRcdHZhciBzdGFydCA9IF92YWx1ZXNTdGFydFsgcHJvcGVydHkgXSB8fCAwO1xuXHRcdFx0dmFyIGVuZCA9IF92YWx1ZXNFbmRbIHByb3BlcnR5IF07XG5cblx0XHRcdGlmICggZW5kIGluc3RhbmNlb2YgQXJyYXkgKSB7XG5cblx0XHRcdFx0X29iamVjdFsgcHJvcGVydHkgXSA9IF9pbnRlcnBvbGF0aW9uRnVuY3Rpb24oIGVuZCwgdmFsdWUgKTtcblxuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHQvLyBQYXJzZXMgcmVsYXRpdmUgZW5kIHZhbHVlcyB3aXRoIHN0YXJ0IGFzIGJhc2UgKGUuZy46ICsxMCwgLTMpXG5cdFx0XHRcdGlmICggdHlwZW9mKGVuZCkgPT09IFwic3RyaW5nXCIgKSB7XG5cdFx0XHRcdFx0ZW5kID0gc3RhcnQgKyBwYXJzZUZsb2F0KGVuZCwgMTApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gcHJvdGVjdCBhZ2FpbnN0IG5vbiBudW1lcmljIHByb3BlcnRpZXMuXG5cdFx0XHRcdGlmICggdHlwZW9mKGVuZCkgPT09IFwibnVtYmVyXCIgKSB7XG5cdFx0XHRcdFx0X29iamVjdFsgcHJvcGVydHkgXSA9IHN0YXJ0ICsgKCBlbmQgLSBzdGFydCApICogdmFsdWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0aWYgKCBfb25VcGRhdGVDYWxsYmFjayAhPT0gbnVsbCApIHtcblxuXHRcdFx0X29uVXBkYXRlQ2FsbGJhY2suY2FsbCggX29iamVjdCwgdmFsdWUgKTtcblxuXHRcdH1cblxuXHRcdGlmICggZWxhcHNlZCA9PSAxICkge1xuXG5cdFx0XHRpZiAoIF9yZXBlYXQgPiAwICkge1xuXG5cdFx0XHRcdGlmKCBpc0Zpbml0ZSggX3JlcGVhdCApICkge1xuXHRcdFx0XHRcdF9yZXBlYXQtLTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIHJlYXNzaWduIHN0YXJ0aW5nIHZhbHVlcywgcmVzdGFydCBieSBtYWtpbmcgc3RhcnRUaW1lID0gbm93XG5cdFx0XHRcdGZvciggcHJvcGVydHkgaW4gX3ZhbHVlc1N0YXJ0UmVwZWF0ICkge1xuXG5cdFx0XHRcdFx0aWYgKCB0eXBlb2YoIF92YWx1ZXNFbmRbIHByb3BlcnR5IF0gKSA9PT0gXCJzdHJpbmdcIiApIHtcblx0XHRcdFx0XHRcdF92YWx1ZXNTdGFydFJlcGVhdFsgcHJvcGVydHkgXSA9IF92YWx1ZXNTdGFydFJlcGVhdFsgcHJvcGVydHkgXSArIHBhcnNlRmxvYXQoX3ZhbHVlc0VuZFsgcHJvcGVydHkgXSwgMTApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChfeW95bykge1xuXHRcdFx0XHRcdFx0dmFyIHRtcCA9IF92YWx1ZXNTdGFydFJlcGVhdFsgcHJvcGVydHkgXTtcblx0XHRcdFx0XHRcdF92YWx1ZXNTdGFydFJlcGVhdFsgcHJvcGVydHkgXSA9IF92YWx1ZXNFbmRbIHByb3BlcnR5IF07XG5cdFx0XHRcdFx0XHRfdmFsdWVzRW5kWyBwcm9wZXJ0eSBdID0gdG1wO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdF92YWx1ZXNTdGFydFsgcHJvcGVydHkgXSA9IF92YWx1ZXNTdGFydFJlcGVhdFsgcHJvcGVydHkgXTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKF95b3lvKSB7XG5cdFx0XHRcdFx0X3JldmVyc2VkID0gIV9yZXZlcnNlZDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdF9zdGFydFRpbWUgPSB0aW1lICsgX2RlbGF5VGltZTtcblxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblxuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRpZiAoIF9vbkNvbXBsZXRlQ2FsbGJhY2sgIT09IG51bGwgKSB7XG5cblx0XHRcdFx0XHRfb25Db21wbGV0ZUNhbGxiYWNrLmNhbGwoIF9vYmplY3QgKTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Zm9yICggdmFyIGkgPSAwLCBudW1DaGFpbmVkVHdlZW5zID0gX2NoYWluZWRUd2VlbnMubGVuZ3RoOyBpIDwgbnVtQ2hhaW5lZFR3ZWVuczsgaSsrICkge1xuXG5cdFx0XHRcdFx0X2NoYWluZWRUd2VlbnNbIGkgXS5zdGFydCggdGltZSApO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXG5cdH07XG5cbn07XG5cblxuVFdFRU4uRWFzaW5nID0ge1xuXG5cdExpbmVhcjoge1xuXG5cdFx0Tm9uZTogZnVuY3Rpb24gKCBrICkge1xuXG5cdFx0XHRyZXR1cm4gaztcblxuXHRcdH1cblxuXHR9LFxuXG5cdFF1YWRyYXRpYzoge1xuXG5cdFx0SW46IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0cmV0dXJuIGsgKiBrO1xuXG5cdFx0fSxcblxuXHRcdE91dDogZnVuY3Rpb24gKCBrICkge1xuXG5cdFx0XHRyZXR1cm4gayAqICggMiAtIGsgKTtcblxuXHRcdH0sXG5cblx0XHRJbk91dDogZnVuY3Rpb24gKCBrICkge1xuXG5cdFx0XHRpZiAoICggayAqPSAyICkgPCAxICkgcmV0dXJuIDAuNSAqIGsgKiBrO1xuXHRcdFx0cmV0dXJuIC0gMC41ICogKCAtLWsgKiAoIGsgLSAyICkgLSAxICk7XG5cblx0XHR9XG5cblx0fSxcblxuXHRDdWJpYzoge1xuXG5cdFx0SW46IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0cmV0dXJuIGsgKiBrICogaztcblxuXHRcdH0sXG5cblx0XHRPdXQ6IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0cmV0dXJuIC0tayAqIGsgKiBrICsgMTtcblxuXHRcdH0sXG5cblx0XHRJbk91dDogZnVuY3Rpb24gKCBrICkge1xuXG5cdFx0XHRpZiAoICggayAqPSAyICkgPCAxICkgcmV0dXJuIDAuNSAqIGsgKiBrICogaztcblx0XHRcdHJldHVybiAwLjUgKiAoICggayAtPSAyICkgKiBrICogayArIDIgKTtcblxuXHRcdH1cblxuXHR9LFxuXG5cdFF1YXJ0aWM6IHtcblxuXHRcdEluOiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdHJldHVybiBrICogayAqIGsgKiBrO1xuXG5cdFx0fSxcblxuXHRcdE91dDogZnVuY3Rpb24gKCBrICkge1xuXG5cdFx0XHRyZXR1cm4gMSAtICggLS1rICogayAqIGsgKiBrICk7XG5cblx0XHR9LFxuXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0aWYgKCAoIGsgKj0gMiApIDwgMSkgcmV0dXJuIDAuNSAqIGsgKiBrICogayAqIGs7XG5cdFx0XHRyZXR1cm4gLSAwLjUgKiAoICggayAtPSAyICkgKiBrICogayAqIGsgLSAyICk7XG5cblx0XHR9XG5cblx0fSxcblxuXHRRdWludGljOiB7XG5cblx0XHRJbjogZnVuY3Rpb24gKCBrICkge1xuXG5cdFx0XHRyZXR1cm4gayAqIGsgKiBrICogayAqIGs7XG5cblx0XHR9LFxuXG5cdFx0T3V0OiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdHJldHVybiAtLWsgKiBrICogayAqIGsgKiBrICsgMTtcblxuXHRcdH0sXG5cblx0XHRJbk91dDogZnVuY3Rpb24gKCBrICkge1xuXG5cdFx0XHRpZiAoICggayAqPSAyICkgPCAxICkgcmV0dXJuIDAuNSAqIGsgKiBrICogayAqIGsgKiBrO1xuXHRcdFx0cmV0dXJuIDAuNSAqICggKCBrIC09IDIgKSAqIGsgKiBrICogayAqIGsgKyAyICk7XG5cblx0XHR9XG5cblx0fSxcblxuXHRTaW51c29pZGFsOiB7XG5cblx0XHRJbjogZnVuY3Rpb24gKCBrICkge1xuXG5cdFx0XHRyZXR1cm4gMSAtIE1hdGguY29zKCBrICogTWF0aC5QSSAvIDIgKTtcblxuXHRcdH0sXG5cblx0XHRPdXQ6IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0cmV0dXJuIE1hdGguc2luKCBrICogTWF0aC5QSSAvIDIgKTtcblxuXHRcdH0sXG5cblx0XHRJbk91dDogZnVuY3Rpb24gKCBrICkge1xuXG5cdFx0XHRyZXR1cm4gMC41ICogKCAxIC0gTWF0aC5jb3MoIE1hdGguUEkgKiBrICkgKTtcblxuXHRcdH1cblxuXHR9LFxuXG5cdEV4cG9uZW50aWFsOiB7XG5cblx0XHRJbjogZnVuY3Rpb24gKCBrICkge1xuXG5cdFx0XHRyZXR1cm4gayA9PT0gMCA/IDAgOiBNYXRoLnBvdyggMTAyNCwgayAtIDEgKTtcblxuXHRcdH0sXG5cblx0XHRPdXQ6IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0cmV0dXJuIGsgPT09IDEgPyAxIDogMSAtIE1hdGgucG93KCAyLCAtIDEwICogayApO1xuXG5cdFx0fSxcblxuXHRcdEluT3V0OiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdGlmICggayA9PT0gMCApIHJldHVybiAwO1xuXHRcdFx0aWYgKCBrID09PSAxICkgcmV0dXJuIDE7XG5cdFx0XHRpZiAoICggayAqPSAyICkgPCAxICkgcmV0dXJuIDAuNSAqIE1hdGgucG93KCAxMDI0LCBrIC0gMSApO1xuXHRcdFx0cmV0dXJuIDAuNSAqICggLSBNYXRoLnBvdyggMiwgLSAxMCAqICggayAtIDEgKSApICsgMiApO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0Q2lyY3VsYXI6IHtcblxuXHRcdEluOiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdHJldHVybiAxIC0gTWF0aC5zcXJ0KCAxIC0gayAqIGsgKTtcblxuXHRcdH0sXG5cblx0XHRPdXQ6IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0cmV0dXJuIE1hdGguc3FydCggMSAtICggLS1rICogayApICk7XG5cblx0XHR9LFxuXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0aWYgKCAoIGsgKj0gMiApIDwgMSkgcmV0dXJuIC0gMC41ICogKCBNYXRoLnNxcnQoIDEgLSBrICogaykgLSAxKTtcblx0XHRcdHJldHVybiAwLjUgKiAoIE1hdGguc3FydCggMSAtICggayAtPSAyKSAqIGspICsgMSk7XG5cblx0XHR9XG5cblx0fSxcblxuXHRFbGFzdGljOiB7XG5cblx0XHRJbjogZnVuY3Rpb24gKCBrICkge1xuXG5cdFx0XHR2YXIgcywgYSA9IDAuMSwgcCA9IDAuNDtcblx0XHRcdGlmICggayA9PT0gMCApIHJldHVybiAwO1xuXHRcdFx0aWYgKCBrID09PSAxICkgcmV0dXJuIDE7XG5cdFx0XHRpZiAoICFhIHx8IGEgPCAxICkgeyBhID0gMTsgcyA9IHAgLyA0OyB9XG5cdFx0XHRlbHNlIHMgPSBwICogTWF0aC5hc2luKCAxIC8gYSApIC8gKCAyICogTWF0aC5QSSApO1xuXHRcdFx0cmV0dXJuIC0gKCBhICogTWF0aC5wb3coIDIsIDEwICogKCBrIC09IDEgKSApICogTWF0aC5zaW4oICggayAtIHMgKSAqICggMiAqIE1hdGguUEkgKSAvIHAgKSApO1xuXG5cdFx0fSxcblxuXHRcdE91dDogZnVuY3Rpb24gKCBrICkge1xuXG5cdFx0XHR2YXIgcywgYSA9IDAuMSwgcCA9IDAuNDtcblx0XHRcdGlmICggayA9PT0gMCApIHJldHVybiAwO1xuXHRcdFx0aWYgKCBrID09PSAxICkgcmV0dXJuIDE7XG5cdFx0XHRpZiAoICFhIHx8IGEgPCAxICkgeyBhID0gMTsgcyA9IHAgLyA0OyB9XG5cdFx0XHRlbHNlIHMgPSBwICogTWF0aC5hc2luKCAxIC8gYSApIC8gKCAyICogTWF0aC5QSSApO1xuXHRcdFx0cmV0dXJuICggYSAqIE1hdGgucG93KCAyLCAtIDEwICogaykgKiBNYXRoLnNpbiggKCBrIC0gcyApICogKCAyICogTWF0aC5QSSApIC8gcCApICsgMSApO1xuXG5cdFx0fSxcblxuXHRcdEluT3V0OiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdHZhciBzLCBhID0gMC4xLCBwID0gMC40O1xuXHRcdFx0aWYgKCBrID09PSAwICkgcmV0dXJuIDA7XG5cdFx0XHRpZiAoIGsgPT09IDEgKSByZXR1cm4gMTtcblx0XHRcdGlmICggIWEgfHwgYSA8IDEgKSB7IGEgPSAxOyBzID0gcCAvIDQ7IH1cblx0XHRcdGVsc2UgcyA9IHAgKiBNYXRoLmFzaW4oIDEgLyBhICkgLyAoIDIgKiBNYXRoLlBJICk7XG5cdFx0XHRpZiAoICggayAqPSAyICkgPCAxICkgcmV0dXJuIC0gMC41ICogKCBhICogTWF0aC5wb3coIDIsIDEwICogKCBrIC09IDEgKSApICogTWF0aC5zaW4oICggayAtIHMgKSAqICggMiAqIE1hdGguUEkgKSAvIHAgKSApO1xuXHRcdFx0cmV0dXJuIGEgKiBNYXRoLnBvdyggMiwgLTEwICogKCBrIC09IDEgKSApICogTWF0aC5zaW4oICggayAtIHMgKSAqICggMiAqIE1hdGguUEkgKSAvIHAgKSAqIDAuNSArIDE7XG5cblx0XHR9XG5cblx0fSxcblxuXHRCYWNrOiB7XG5cblx0XHRJbjogZnVuY3Rpb24gKCBrICkge1xuXG5cdFx0XHR2YXIgcyA9IDEuNzAxNTg7XG5cdFx0XHRyZXR1cm4gayAqIGsgKiAoICggcyArIDEgKSAqIGsgLSBzICk7XG5cblx0XHR9LFxuXG5cdFx0T3V0OiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdHZhciBzID0gMS43MDE1ODtcblx0XHRcdHJldHVybiAtLWsgKiBrICogKCAoIHMgKyAxICkgKiBrICsgcyApICsgMTtcblxuXHRcdH0sXG5cblx0XHRJbk91dDogZnVuY3Rpb24gKCBrICkge1xuXG5cdFx0XHR2YXIgcyA9IDEuNzAxNTggKiAxLjUyNTtcblx0XHRcdGlmICggKCBrICo9IDIgKSA8IDEgKSByZXR1cm4gMC41ICogKCBrICogayAqICggKCBzICsgMSApICogayAtIHMgKSApO1xuXHRcdFx0cmV0dXJuIDAuNSAqICggKCBrIC09IDIgKSAqIGsgKiAoICggcyArIDEgKSAqIGsgKyBzICkgKyAyICk7XG5cblx0XHR9XG5cblx0fSxcblxuXHRCb3VuY2U6IHtcblxuXHRcdEluOiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdHJldHVybiAxIC0gVFdFRU4uRWFzaW5nLkJvdW5jZS5PdXQoIDEgLSBrICk7XG5cblx0XHR9LFxuXG5cdFx0T3V0OiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdGlmICggayA8ICggMSAvIDIuNzUgKSApIHtcblxuXHRcdFx0XHRyZXR1cm4gNy41NjI1ICogayAqIGs7XG5cblx0XHRcdH0gZWxzZSBpZiAoIGsgPCAoIDIgLyAyLjc1ICkgKSB7XG5cblx0XHRcdFx0cmV0dXJuIDcuNTYyNSAqICggayAtPSAoIDEuNSAvIDIuNzUgKSApICogayArIDAuNzU7XG5cblx0XHRcdH0gZWxzZSBpZiAoIGsgPCAoIDIuNSAvIDIuNzUgKSApIHtcblxuXHRcdFx0XHRyZXR1cm4gNy41NjI1ICogKCBrIC09ICggMi4yNSAvIDIuNzUgKSApICogayArIDAuOTM3NTtcblxuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRyZXR1cm4gNy41NjI1ICogKCBrIC09ICggMi42MjUgLyAyLjc1ICkgKSAqIGsgKyAwLjk4NDM3NTtcblxuXHRcdFx0fVxuXG5cdFx0fSxcblxuXHRcdEluT3V0OiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdGlmICggayA8IDAuNSApIHJldHVybiBUV0VFTi5FYXNpbmcuQm91bmNlLkluKCBrICogMiApICogMC41O1xuXHRcdFx0cmV0dXJuIFRXRUVOLkVhc2luZy5Cb3VuY2UuT3V0KCBrICogMiAtIDEgKSAqIDAuNSArIDAuNTtcblxuXHRcdH1cblxuXHR9XG5cbn07XG5cblRXRUVOLkludGVycG9sYXRpb24gPSB7XG5cblx0TGluZWFyOiBmdW5jdGlvbiAoIHYsIGsgKSB7XG5cblx0XHR2YXIgbSA9IHYubGVuZ3RoIC0gMSwgZiA9IG0gKiBrLCBpID0gTWF0aC5mbG9vciggZiApLCBmbiA9IFRXRUVOLkludGVycG9sYXRpb24uVXRpbHMuTGluZWFyO1xuXG5cdFx0aWYgKCBrIDwgMCApIHJldHVybiBmbiggdlsgMCBdLCB2WyAxIF0sIGYgKTtcblx0XHRpZiAoIGsgPiAxICkgcmV0dXJuIGZuKCB2WyBtIF0sIHZbIG0gLSAxIF0sIG0gLSBmICk7XG5cblx0XHRyZXR1cm4gZm4oIHZbIGkgXSwgdlsgaSArIDEgPiBtID8gbSA6IGkgKyAxIF0sIGYgLSBpICk7XG5cblx0fSxcblxuXHRCZXppZXI6IGZ1bmN0aW9uICggdiwgayApIHtcblxuXHRcdHZhciBiID0gMCwgbiA9IHYubGVuZ3RoIC0gMSwgcHcgPSBNYXRoLnBvdywgYm4gPSBUV0VFTi5JbnRlcnBvbGF0aW9uLlV0aWxzLkJlcm5zdGVpbiwgaTtcblxuXHRcdGZvciAoIGkgPSAwOyBpIDw9IG47IGkrKyApIHtcblx0XHRcdGIgKz0gcHcoIDEgLSBrLCBuIC0gaSApICogcHcoIGssIGkgKSAqIHZbIGkgXSAqIGJuKCBuLCBpICk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGI7XG5cblx0fSxcblxuXHRDYXRtdWxsUm9tOiBmdW5jdGlvbiAoIHYsIGsgKSB7XG5cblx0XHR2YXIgbSA9IHYubGVuZ3RoIC0gMSwgZiA9IG0gKiBrLCBpID0gTWF0aC5mbG9vciggZiApLCBmbiA9IFRXRUVOLkludGVycG9sYXRpb24uVXRpbHMuQ2F0bXVsbFJvbTtcblxuXHRcdGlmICggdlsgMCBdID09PSB2WyBtIF0gKSB7XG5cblx0XHRcdGlmICggayA8IDAgKSBpID0gTWF0aC5mbG9vciggZiA9IG0gKiAoIDEgKyBrICkgKTtcblxuXHRcdFx0cmV0dXJuIGZuKCB2WyAoIGkgLSAxICsgbSApICUgbSBdLCB2WyBpIF0sIHZbICggaSArIDEgKSAlIG0gXSwgdlsgKCBpICsgMiApICUgbSBdLCBmIC0gaSApO1xuXG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0aWYgKCBrIDwgMCApIHJldHVybiB2WyAwIF0gLSAoIGZuKCB2WyAwIF0sIHZbIDAgXSwgdlsgMSBdLCB2WyAxIF0sIC1mICkgLSB2WyAwIF0gKTtcblx0XHRcdGlmICggayA+IDEgKSByZXR1cm4gdlsgbSBdIC0gKCBmbiggdlsgbSBdLCB2WyBtIF0sIHZbIG0gLSAxIF0sIHZbIG0gLSAxIF0sIGYgLSBtICkgLSB2WyBtIF0gKTtcblxuXHRcdFx0cmV0dXJuIGZuKCB2WyBpID8gaSAtIDEgOiAwIF0sIHZbIGkgXSwgdlsgbSA8IGkgKyAxID8gbSA6IGkgKyAxIF0sIHZbIG0gPCBpICsgMiA/IG0gOiBpICsgMiBdLCBmIC0gaSApO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0VXRpbHM6IHtcblxuXHRcdExpbmVhcjogZnVuY3Rpb24gKCBwMCwgcDEsIHQgKSB7XG5cblx0XHRcdHJldHVybiAoIHAxIC0gcDAgKSAqIHQgKyBwMDtcblxuXHRcdH0sXG5cblx0XHRCZXJuc3RlaW46IGZ1bmN0aW9uICggbiAsIGkgKSB7XG5cblx0XHRcdHZhciBmYyA9IFRXRUVOLkludGVycG9sYXRpb24uVXRpbHMuRmFjdG9yaWFsO1xuXHRcdFx0cmV0dXJuIGZjKCBuICkgLyBmYyggaSApIC8gZmMoIG4gLSBpICk7XG5cblx0XHR9LFxuXG5cdFx0RmFjdG9yaWFsOiAoIGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0dmFyIGEgPSBbIDEgXTtcblxuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uICggbiApIHtcblxuXHRcdFx0XHR2YXIgcyA9IDEsIGk7XG5cdFx0XHRcdGlmICggYVsgbiBdICkgcmV0dXJuIGFbIG4gXTtcblx0XHRcdFx0Zm9yICggaSA9IG47IGkgPiAxOyBpLS0gKSBzICo9IGk7XG5cdFx0XHRcdHJldHVybiBhWyBuIF0gPSBzO1xuXG5cdFx0XHR9O1xuXG5cdFx0fSApKCksXG5cblx0XHRDYXRtdWxsUm9tOiBmdW5jdGlvbiAoIHAwLCBwMSwgcDIsIHAzLCB0ICkge1xuXG5cdFx0XHR2YXIgdjAgPSAoIHAyIC0gcDAgKSAqIDAuNSwgdjEgPSAoIHAzIC0gcDEgKSAqIDAuNSwgdDIgPSB0ICogdCwgdDMgPSB0ICogdDI7XG5cdFx0XHRyZXR1cm4gKCAyICogcDEgLSAyICogcDIgKyB2MCArIHYxICkgKiB0MyArICggLSAzICogcDEgKyAzICogcDIgLSAyICogdjAgLSB2MSApICogdDIgKyB2MCAqIHQgKyBwMTtcblxuXHRcdH1cblxuXHR9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzPVRXRUVOOyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdC9hZGRvbnMnO1xuaW1wb3J0IHtcblx0Q29udGFpbmVyLFxuXHRjcmVhdGVBcHAsXG5cdFVJLFxuXHRWaWV3LFxuXHRWaWV3TWFuYWdlclxufSBmcm9tICd0b3VjaHN0b25lanMnO1xuXG4vLyBBcHAgQ29uZmlnXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuY29uc3QgTWVkaWFTdG9yZSA9IHJlcXVpcmUoJy4vc3RvcmVzL21lZGlhJylcbmNvbnN0IG1lZGlhU3RvcmUgPSBuZXcgTWVkaWFTdG9yZSgpXG5cblxudmFyIEFwcCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0bWl4aW5zOiBbY3JlYXRlQXBwKCldLFxuXG5cdGNoaWxkQ29udGV4dFR5cGVzOiB7XG5cdFx0bWVkaWFTdG9yZTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdFxuXHR9LFxuXG5cdGdldENoaWxkQ29udGV4dCAoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdG1lZGlhU3RvcmU6IG1lZGlhU3RvcmVcblx0XHR9O1xuXHR9LFxuXG5cdHJlbmRlciAoKSB7XG5cdFx0bGV0IGFwcFdyYXBwZXJDbGFzc05hbWUgPSAnYXBwLXdyYXBwZXIgZGV2aWNlLS0nICsgKHdpbmRvdy5kZXZpY2UgfHwge30pLnBsYXRmb3JtXG5cblx0XHRyZXR1cm4gKFxuXHRcdFx0PGRpdiBjbGFzc05hbWU9e2FwcFdyYXBwZXJDbGFzc05hbWV9PlxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImRldmljZS1zaWxob3VldHRlXCI+XG5cdFx0XHRcdFx0PFZpZXdNYW5hZ2VyIG5hbWU9XCJhcHBcIiBkZWZhdWx0Vmlldz1cIm1haW5cIj5cblx0XHRcdFx0XHRcdDxWaWV3IG5hbWU9XCJtYWluXCIgY29tcG9uZW50PXtNYWluVmlld0NvbnRyb2xsZXJ9IC8+XG5cdFx0XHRcdFx0PC9WaWV3TWFuYWdlcj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9XG59KTtcblxuLy8gTWFpbiBDb250cm9sbGVyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciBNYWluVmlld0NvbnRyb2xsZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdHJlbmRlciAoKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdDxDb250YWluZXI+XG5cdFx0XHRcdDxVSS5OYXZpZ2F0aW9uQmFyIG5hbWU9XCJtYWluXCIgLz5cblx0XHRcdFx0PFZpZXdNYW5hZ2VyIG5hbWU9XCJtYWluXCIgZGVmYXVsdFZpZXc9XCJ0YWJzXCI+XG5cdFx0XHRcdFx0PFZpZXcgbmFtZT1cInRhYnNcIiBjb21wb25lbnQ9e1RhYlZpZXdDb250cm9sbGVyfSAvPlxuXHRcdFx0XHQ8L1ZpZXdNYW5hZ2VyPlxuXHRcdFx0PC9Db250YWluZXI+XG5cdFx0KTtcblx0fVxufSk7XG5cbi8vIFRhYiBWaWV3IENvbnRyb2xsZXJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgbGFzdFNlbGVjdGVkVGFiID0gJ2NyaXRlcmlhJ1xudmFyIFRhYlZpZXdDb250cm9sbGVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cblx0b25WaWV3Q2hhbmdlIChuZXh0Vmlldykge1xuXHRcdGxhc3RTZWxlY3RlZFRhYiA9IG5leHRWaWV3XG5cblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdHNlbGVjdGVkVGFiOiBuZXh0Vmlld1xuXHRcdH0pO1xuXHR9LFxuXG5cdHNlbGVjdFRhYiAodmFsdWUpIHtcblx0XHRsZXQgdmlld1Byb3BzO1xuXG5cdFx0dGhpcy5yZWZzLmxpc3R2bS50cmFuc2l0aW9uVG8odmFsdWUsIHtcblx0XHRcdHRyYW5zaXRpb246ICdpbnN0YW50Jyxcblx0XHRcdHZpZXdQcm9wczogdmlld1Byb3BzXG5cdFx0fSk7XG5cblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdHNlbGVjdGVkVGFiOiB2YWx1ZVxuXHRcdH0pXG5cdH0sXG5cdGdldEluaXRpYWxTdGF0ZSgpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0c2VsZWN0ZWRUYWI6IGxhc3RTZWxlY3RlZFRhYixcblx0XHRcdHByZWZlcmVuY2VzOiB7XG5cdFx0XHRcdG1lZGlhVHlwZTogJ3NvbmcnLFxuXHRcdFx0XHRudW1SZXN1bHRzOiAnMTUnXG5cdFx0XHR9XG5cdFx0fTtcblx0fSxcblx0Y2hhbmdlUHJlZmVyZW5jZShrZXksdmFsKSB7XG5cdFx0dGhpcy5zZXRTdGF0ZShzdGF0ZSA9PiB7XG5cdFx0XHRzdGF0ZS5wcmVmZXJlbmNlc1trZXldPXZhbDtcblx0XHRcdHJldHVybiBzdGF0ZTtcblx0XHR9KTtcblx0fSxcblx0cmVuZGVyICgpIHtcblx0XHRsZXQgc2VsZWN0ZWRUYWIgPSB0aGlzLnN0YXRlLnNlbGVjdGVkVGFiXG5cdFx0bGV0IHNlbGVjdGVkVGFiU3BhbiA9IHNlbGVjdGVkVGFiXG5cblx0XHQvLyBTdWJ2aWV3cyBpbiB0aGUgc3RhY2sgbmVlZCB0byBzaG93IHRoZSByaWdodCB0YWIgc2VsZWN0ZWRcblx0XHRpZiAoc2VsZWN0ZWRUYWIgPT09ICdjcml0ZXJpYScgfHwgc2VsZWN0ZWRUYWIgPT09ICdtZWRpYS1saXN0JyB8fCBzZWxlY3RlZFRhYiA9PT0gJ21lZGlhLWRldGFpbHMnIHx8IHNlbGVjdGVkVGFiID09PSAnYWJvdXQnKSB7XG5cdFx0XHRzZWxlY3RlZFRhYlNwYW4gPSAnY3JpdGVyaWEnO1xuXHRcdH1cblxuXHRcdGVsc2Ugc2VsZWN0ZWRUYWJTcGFuID0gJ3NldHRpbmdzJztcblxuXHRcdHJldHVybiAoXG5cdFx0XHQ8Q29udGFpbmVyPlxuXHRcdFx0XHQ8Vmlld01hbmFnZXIgcmVmPVwibGlzdHZtXCIgbmFtZT1cInRhYnNcIiBkZWZhdWx0Vmlldz17c2VsZWN0ZWRUYWJ9IG9uVmlld0NoYW5nZT17dGhpcy5vblZpZXdDaGFuZ2V9PlxuXHRcdFx0XHRcdDxWaWV3IG5hbWU9XCJhYm91dFwiIGNvbXBvbmVudD17cmVxdWlyZSgnLi92aWV3cy9hYm91dCcpfSAvPlxuXHRcdFx0XHRcdDxWaWV3IG5hbWU9XCJjcml0ZXJpYVwiIGNvbXBvbmVudD17cmVxdWlyZSgnLi92aWV3cy9jcml0ZXJpYS1mb3JtJyl9IHByZWZlcmVuY2VzPXt0aGlzLnN0YXRlLnByZWZlcmVuY2VzfS8+XG5cdFx0XHRcdFx0PFZpZXcgbmFtZT1cIm1lZGlhLWxpc3RcIiBjb21wb25lbnQ9e3JlcXVpcmUoJy4vdmlld3MvbWVkaWEtbGlzdCcpfSAvPlxuXHRcdFx0XHRcdDxWaWV3IG5hbWU9XCJtZWRpYS1kZXRhaWxzXCIgY29tcG9uZW50PXtyZXF1aXJlKCcuL3ZpZXdzL21lZGlhLWRldGFpbHMnKX0gLz5cblx0XHRcdFx0XHQ8VmlldyBuYW1lPVwic2V0dGluZ3NcIiBjb21wb25lbnQ9e3JlcXVpcmUoJy4vdmlld3MvcHJlZmVyZW5jZXMnKX0gcHJlZmVyZW5jZXM9e3RoaXMuc3RhdGUucHJlZmVyZW5jZXN9XG5cdFx0XHRcdFx0XHRvbkNoYW5nZVByZWZlcmVuY2U9eyhrZXksdmFsKSA9PiB0aGlzLmNoYW5nZVByZWZlcmVuY2Uoa2V5LHZhbCl9Lz5cblx0XHRcdFx0PC9WaWV3TWFuYWdlcj5cblxuXHRcdFx0XHQ8VUkuVGFicy5OYXZpZ2F0b3I+XG5cdFx0XHRcdFx0PFVJLlRhYnMuVGFiIG9uVGFwPXt0aGlzLnNlbGVjdFRhYi5iaW5kKHRoaXMsICdjcml0ZXJpYScpfSBzZWxlY3RlZD17c2VsZWN0ZWRUYWJTcGFuID09PSAnY3JpdGVyaWEnfT5cblx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT1cIlRhYnMtSWNvbiBUYWJzLUljb24tLWZvcm1cIiAvPlxuXHRcdFx0XHRcdFx0PFVJLlRhYnMuTGFiZWw+U2VhcmNoIE1lZGlhPC9VSS5UYWJzLkxhYmVsPlxuXHRcdFx0XHRcdDwvVUkuVGFicy5UYWI+XG5cblx0XHRcdFx0XHQ8VUkuVGFicy5UYWIgb25UYXA9e3RoaXMuc2VsZWN0VGFiLmJpbmQodGhpcywgJ3NldHRpbmdzJyl9IHNlbGVjdGVkPXtzZWxlY3RlZFRhYlNwYW4gPT09ICdzZXR0aW5ncyd9PlxuXHRcdFx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwiVGFicy1JY29uIFRhYnMtSWNvbi0tc2V0dGluZ3NcIiAvPlxuXHRcdFx0XHRcdFx0PFVJLlRhYnMuTGFiZWw+UHJlZmVyZW5jZXM8L1VJLlRhYnMuTGFiZWw+XG5cdFx0XHRcdFx0PC9VSS5UYWJzLlRhYj5cblx0XHRcdFx0PC9VSS5UYWJzLk5hdmlnYXRvcj5cblx0XHRcdDwvQ29udGFpbmVyPlxuXHRcdCk7XG5cdH1cbn0pO1xuXG5mdW5jdGlvbiBzdGFydEFwcCAoKSB7XG5cdC8vIENhdGNoLWFsbCBlcnJvciBoYW5kbGluZ1xuXHR3aW5kb3cuZXJyb3IgPSBmdW5jdGlvbihlKSB7IGNvbnNvbGUubG9nKCcqKiBFcnJvcjogJyArIGUubWVzc2FnZSk7IH07XG5cblx0Ly8gSGFuZGxlIGFueSBDb3Jkb3ZhIG5lZWRzIGhlcmVcblxuXHQvLyBJZiB0aGUgc3BsYXNoIHNjcmVlbiBwbHVnaW4gaXMgbG9hZGVkIGFuZCBjb25maWcueG1sIHByZWZzIGhhdmUgQXV0b0hpZGVTcGxhc2hTY3JlZW4gc2V0IHRvIGZhbHNlIGZvciBpT1Mgd2UgbmVlZCB0b1xuXHQvLyBwcm9ncmFtYXRpY2FsbHkgaGlkZSBpdCBoZXJlLiBZb3UgY291bGQgYWxzbyBpbmNsdWRlIGluIGEgdGltZW91dCBpZiBuZWVkZWQgdG8gbG9hZCBtb3JlIHJlc291cmNlcyBvciBzZWUgYSB3aGl0ZSBzY3JlZW5cblx0Ly8gZGlzcGxheSBpbiBiZXR3ZWVuIHNwbGFzaCBzY3JlZW4gYW5kIGFwcCBsb2FkLiBSZW1vdmUgb3IgY2hhbmdlIGFzIG5lZWRlZC4gTGVmdCB0aW1lb3V0IGNvZGUgZm9yIHJlZmVyZW5jZSwgdGltZW91dFxuXHQvLyBub3QgbmVlZGVkIGluIHRoaXMgY2FzZS5cblxuXHRpZiAobmF2aWdhdG9yLnNwbGFzaHNjcmVlbikge1xuXHRcdC8vc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRuYXZpZ2F0b3Iuc3BsYXNoc2NyZWVuLmhpZGUoKTtcblx0XHQvL30sIDEwMDApO1xuXHR9XG5cblx0UmVhY3QucmVuZGVyKDxBcHAgLz4sIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHAnKSk7XG59XG5cbmlmICghd2luZG93LmNvcmRvdmEpIHtcblx0c3RhcnRBcHAoKTtcbn0gZWxzZSB7XG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RldmljZXJlYWR5Jywgc3RhcnRBcHAsIGZhbHNlKTtcbn1cbiIsImZ1bmN0aW9uIE1lZGlhU3RvcmUgKCkge1xuXHR0aGlzLml0ZW1zID0gW107XG59XG5NZWRpYVN0b3JlLnByb3RvdHlwZS5mb3JtYXREYXRlID0gZnVuY3Rpb24oKXtcblx0Ly92YXIgaXRlbUFycmF5ID0gcmVzLmJvZHkucmVzdWx0cy5tYXAociA9PiByKTtcblxuXHQvLyBQb3N0IHByb2Nlc3Npbmcgb2YgdGhlIGRhdGFcblx0dGhpcy5pdGVtcy5mb3JFYWNoKChpdGVtLCBpKSA9PiB7XG5cdFx0aXRlbS5pZCA9IGk7XG5cdFx0aXRlbS5yZWxlYXNlRGF0ZSA9IGl0ZW0ucmVsZWFzZURhdGUuc3Vic3RyaW5nKDAsMTApOyAvLyBGb3JtYXQgdGhlIGRhdGUgdG8ganVzdCBzaG93IHRoZSBkYXRlIGl0c2VsZiBpbnN0ZWFkIG9mIEdNVFxuXHR9KVxuXHRyZXR1cm4gdGhpcy5pdGVtcztcbn1cbm1vZHVsZS5leHBvcnRzID0gTWVkaWFTdG9yZVxuIiwiaW1wb3J0IENvbnRhaW5lciBmcm9tICdyZWFjdC1jb250YWluZXInO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBUYXBwYWJsZSBmcm9tICdyZWFjdC10YXBwYWJsZSc7XG5pbXBvcnQgeyBMaW5rLCBVSSB9IGZyb20gJ3RvdWNoc3RvbmVqcyc7XG5cbmNvbnN0IHNjcm9sbGFibGUgPSBDb250YWluZXIuaW5pdFNjcm9sbGFibGUoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgc3RhdGljczoge1xuICAgICAgICBuYXZpZ2F0aW9uQmFyOiAnbWFpbicsXG4gICAgICAgIGdldE5hdmlnYXRpb24gKHByb3BzLGFwcCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBsZWZ0QXJyb3c6IHRydWUsXG4gICAgICAgICAgICAgICAgbGVmdExhYmVsOiAnQmFjaycsXG4gICAgICAgICAgICAgICAgbGVmdEFjdGlvbjogKCkgPT4geyBhcHAudHJhbnNpdGlvblRvKCd0YWJzOicgKyBwcm9wcy5wcmV2VmlldywgeyB0cmFuc2l0aW9uOiAncmV2ZWFsLWZyb20tcmlnaHQnfSkgfSxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ0Fib3V0J1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9wZW5VUkwgKCkge1xuICAgICAgICB2YXIgcHJvamVjdFVybCA9IFwiaHR0cDovL2dpdGh1Yi5jb20vaG9sbHlzY2hpbnNreS9waG9uZWdhcC1hcHAtdG91Y2hzdG9uZWpzXCI7XG4gICAgICAgIGlmICghd2luZG93LmNvcmRvdmEpXG4gICAgICAgICAgICB3aW5kb3cub3Blbihwcm9qZWN0VXJsKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICB3aW5kb3cub3Blbihwcm9qZWN0VXJsLFwiX2JsYW5rXCIpO1xuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxDb250YWluZXIgc2Nyb2xsYWJsZT17c2Nyb2xsYWJsZX0+XG4gICAgICAgICAgICAgICAgPFVJLkdyb3VwPlxuICAgICAgICAgICAgICAgICAgICA8VUkuR3JvdXBIZWFkZXIgY2xhc3NOYW1lPVwidGV4dC1wcmltYXJ5XCI+QXBwIERldGFpbHM8L1VJLkdyb3VwSGVhZGVyPlxuICAgICAgICAgICAgICAgICAgICA8VUkuTGlzdEhlYWRlcj5pVHVuZXMgTWVkaWEgRmluZGVyPC9VSS5MaXN0SGVhZGVyPlxuICAgICAgICAgICAgICAgICAgICA8VUkuTGFiZWxJbnB1dCByZWFkT25seSBsYWJlbD1cIlZlcnNpb25cIiB2YWx1ZT1cIjAuMS4wXCIvPlxuICAgICAgICAgICAgICAgICAgICA8VUkuTGFiZWxJbnB1dCByZWFkT25seSBsYWJlbD1cIkRhdGVcIiB2YWx1ZT1cIlNlcHRlbWJlciAyMDE1XCIvPlxuICAgICAgICAgICAgICAgIDwvVUkuR3JvdXA+XG5cbiAgICAgICAgICAgICAgICA8VUkuR3JvdXA+XG4gICAgICAgICAgICAgICAgICAgIDxVSS5Hcm91cEhlYWRlciBjbGFzc05hbWU9XCJ0ZXh0LXByaW1hcnlcIj5BdXRob3I8L1VJLkdyb3VwSGVhZGVyPlxuICAgICAgICAgICAgICAgICAgICA8VUkuR3JvdXBCb2R5PlxuICAgICAgICAgICAgICAgICAgICAgICAgPFVJLkl0ZW0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPFVJLkl0ZW1Jbm5lcj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPFVJLkl0ZW1Db250ZW50PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPFVJLkl0ZW1UaXRsZT5Ib2xseSBTY2hpbnNreTwvVUkuSXRlbVRpdGxlPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L1VJLkl0ZW1Db250ZW50PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8VGFwcGFibGUgb25UYXA9e3RoaXMub3BlblVSTC5iaW5kKG51bGwpfSBzdG9wUHJvcGFnYXRpb24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8VUkuSXRlbU5vdGUgaWNvbj0naW9uLWlvcy1zdGFyJyB0eXBlPVwicHJpbWFyeVwiIGNsYXNzTmFtZT1cImlvbi1sZ1wiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvVGFwcGFibGU+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9VSS5JdGVtSW5uZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L1VJLkl0ZW0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8VUkuSXRlbT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8VUkuSXRlbUlubmVyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8VUkuSXRlbUNvbnRlbnQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8VUkuSXRlbVRpdGxlPlBob25lR2FwIFRlYW08L1VJLkl0ZW1UaXRsZT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxVSS5JdGVtU3ViVGl0bGU+QWRvYmUgU3lzdGVtcywgSW5jPC9VSS5JdGVtU3ViVGl0bGU+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvVUkuSXRlbUNvbnRlbnQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9VSS5JdGVtSW5uZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L1VJLkl0ZW0+XG4gICAgICAgICAgICAgICAgICAgIDwvVUkuR3JvdXBCb2R5PlxuICAgICAgICAgICAgICAgIDwvVUkuR3JvdXA+XG4gICAgICAgICAgICAgICAgPFVJLkdyb3VwPlxuICAgICAgICAgICAgICAgICAgICA8VUkuR3JvdXBIZWFkZXIgY2xhc3NOYW1lPVwidGV4dC1wcmltYXJ5XCI+UG93ZXJlZCBCeTwvVUkuR3JvdXBIZWFkZXI+XG4gICAgICAgICAgICAgICAgICAgIDxVSS5JdGVtPlxuICAgICAgICAgICAgICAgICAgICAgICAgPFVJLkl0ZW1Jbm5lcj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8VUkuSXRlbUNvbnRlbnQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiaW1nL3JlYWN0LWxvZ28ucG5nXCIgY2xhc3NOYW1lPVwiYXZhdGFyXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz1cImltZy90cy1sb2dvLnBuZ1wiIGNsYXNzTmFtZT1cImF2YXRhclwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9XCJpbWcvcGctbG9nby5wbmdcIiBjbGFzc05hbWU9XCJhdmF0YXJcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9VSS5JdGVtQ29udGVudD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L1VJLkl0ZW1Jbm5lcj5cblxuICAgICAgICAgICAgICAgICAgICAgICAgPC9VSS5JdGVtPlxuICAgICAgICAgICAgICAgIDwvVUkuR3JvdXA+XG5cbiAgICAgICAgICAgIDwvQ29udGFpbmVyPlxuXG5cbiAgICAgICAgKTtcbiAgICB9XG59KTtcbiIsImltcG9ydCBDb250YWluZXIgZnJvbSAncmVhY3QtY29udGFpbmVyJztcbmltcG9ydCBkaWFsb2dzIGZyb20gJ2NvcmRvdmEtZGlhbG9ncyc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFRhcHBhYmxlIGZyb20gJ3JlYWN0LXRhcHBhYmxlJztcbmltcG9ydCB7TGluaywgVUkgfSBmcm9tICd0b3VjaHN0b25lanMnO1xuXG5jb25zdCBzY3JvbGxhYmxlID0gQ29udGFpbmVyLmluaXRTY3JvbGxhYmxlKCk7XG5cbmNvbnN0IE1FRElBX1RZUEVTID0gW1xuXHR7IGxhYmVsOiAnTXVzaWMgVmlkZW8nLCAgICB2YWx1ZTogJ211c2ljVmlkZW8nIH0sXG5cdHsgbGFiZWw6ICdTb25nJywgIHZhbHVlOiAnc29uZycgfSxcblx0eyBsYWJlbDogJ01vdmllJywgICAgdmFsdWU6ICdtb3ZpZScgfSxcbl07XG5jb25zdCBSRVNVTFRTID0gW1xuXHR7IGxhYmVsOiAnMTUnLCAgICB2YWx1ZTogJzE1JyB9LFxuXHR7IGxhYmVsOiAnMjUnLCAgdmFsdWU6ICcyNScgfSxcblx0eyBsYWJlbDogJzUwJywgICAgdmFsdWU6ICc1MCcgfSxcbl07XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRjb250ZXh0VHlwZXM6IHsgbWVkaWFTdG9yZTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLCBhcHA6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QgfSxcblx0c3RhdGljczoge1xuXHRcdG5hdmlnYXRpb25CYXI6ICdtYWluJyxcblx0XHRnZXROYXZpZ2F0aW9uIChwcm9wcyxhcHApIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHRpdGxlOiAnU2VhcmNoIENyaXRlcmlhJyxcblx0XHRcdFx0bGVmdEFycm93OiBmYWxzZSxcblx0XHRcdFx0cmlnaHRBY3Rpb246ICgpID0+IHsgYXBwLnRyYW5zaXRpb25UbygndGFiczphYm91dCcsIHsgdHJhbnNpdGlvbjogJ2ZhZGUtZXhwYW5kJywgdmlld1Byb3BzOiB7cHJldlZpZXc6J2NyaXRlcmlhJ319KSB9LFxuXHRcdFx0XHRyaWdodEljb246ICdpb24taW5mb3JtYXRpb24tY2lyY2xlZCdcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0Z2V0SW5pdGlhbFN0YXRlICgpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0bWVkaWFUeXBlOiB0aGlzLnByb3BzLnByZWZlcmVuY2VzLm1lZGlhVHlwZSxcblx0XHRcdG51bVJlc3VsdHM6IHRoaXMucHJvcHMucHJlZmVyZW5jZXMubnVtUmVzdWx0cyxcblx0XHRcdHNlYXJjaFRlcm06ICdQaW5rJ1xuXHRcdH1cblx0fSxcblxuXHRoYW5kbGVSZXN1bHRzQ2hhbmdlIChrZXksIG5ld1ZhbHVlKSB7XG5cdFx0bGV0IG5ld1N0YXRlID0ge307XG5cdFx0bmV3U3RhdGVba2V5XSA9IG5ld1ZhbHVlO1xuXHRcdHRoaXMuc2V0U3RhdGUobmV3U3RhdGUpO1xuXHR9LFxuXHRcblx0aGFuZGxlVHlwZUNoYW5nZSAoa2V5LCBldmVudCkge1xuXHRcdHRoaXMuc3RhdGUubWVkaWFUeXBlID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpOyAvLyB3b24ndCBzdGF5IHNlbGVjdGVkIGlmIEkgZG9uJ3Qgc3RvcCBpdCBmcm9tIHByb3BhZ2F0ZWQgLSBtYXkgYmUgYnVnIGluIExhYmVsU2VsZWN0XG5cdH0sXG5cblx0aGFuZGxlU2VhcmNoVGVybUNoYW5nZSAoa2V5LCBldmVudCkge1xuXHRcdGxldCBuZXdTdGF0ZSA9IHt9O1xuXHRcdG5ld1N0YXRlW2tleV0gPSBldmVudC50YXJnZXQudmFsdWU7XG5cdFx0dGhpcy5zZXRTdGF0ZShuZXdTdGF0ZSk7XG5cdH0sXG5cblxuXHRzaG93UmVzdWx0cygpIHtcblx0XHR0aGlzLmNvbnRleHQuYXBwLnRyYW5zaXRpb25UbygndGFiczptZWRpYS1saXN0Jyxcblx0XHRcdHt0cmFuc2l0aW9uOiAnc2hvdy1mcm9tLXJpZ2h0Jyx2aWV3UHJvcHM6e3ByZXZWaWV3OiAnY3JpdGVyaWEnLCBtZWRpYVR5cGU6IHRoaXMuc3RhdGUubWVkaWFUeXBlLCBzZWFyY2hUZXJtOiB0aGlzLnN0YXRlLnNlYXJjaFRlcm0sXG5cdFx0XHRcdG51bVJlc3VsdHM6IHRoaXMuc3RhdGUubnVtUmVzdWx0c319KVxuXHR9LFxuXG5cdHJlbmRlciAoKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdDxDb250YWluZXIgc2Nyb2xsYWJsZT17c2Nyb2xsYWJsZX0+XG5cdFx0XHRcdDxVSS5Hcm91cD5cblx0XHRcdFx0XHQ8VUkuR3JvdXBIZWFkZXI+U2VhcmNoIENyaXRlcmlhPC9VSS5Hcm91cEhlYWRlcj5cblx0XHRcdFx0XHQ8VUkuR3JvdXBCb2R5PlxuXHRcdFx0XHRcdFx0PFVJLkxhYmVsU2VsZWN0IGxhYmVsPVwiVHlwZVwiIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZVR5cGVDaGFuZ2UuYmluZCh0aGlzLCdtZWRpYVR5cGUnKX0gdmFsdWU9e3RoaXMuc3RhdGUubWVkaWFUeXBlfSBvcHRpb25zPXtNRURJQV9UWVBFU30gLz5cblx0XHRcdFx0XHRcdDxVSS5MYWJlbElucHV0IGxhYmVsPVwiU2VhcmNoIGZvclwiICB2YWx1ZT17dGhpcy5zdGF0ZS5zZWFyY2hUZXJtfSBwbGFjZWhvbGRlcj1cInNlYXJjaCB0ZXJtXCIgb25DaGFuZ2U9e3RoaXMuaGFuZGxlU2VhcmNoVGVybUNoYW5nZS5iaW5kKHRoaXMsICdzZWFyY2hUZXJtJyl9ICAvPlxuXHRcdFx0XHRcdDwvVUkuR3JvdXBCb2R5PlxuXHRcdFx0XHQ8L1VJLkdyb3VwPlxuXHRcdFx0XHQ8VUkuR3JvdXA+XG5cdFx0XHRcdFx0PFVJLkdyb3VwSGVhZGVyPiMgUmVzdWx0czwvVUkuR3JvdXBIZWFkZXI+XG5cdFx0XHRcdFx0PFVJLkdyb3VwQm9keT5cblx0XHRcdFx0XHRcdDxVSS5SYWRpb0xpc3QgdmFsdWU9e3RoaXMuc3RhdGUubnVtUmVzdWx0c30gb25DaGFuZ2U9e3RoaXMuaGFuZGxlUmVzdWx0c0NoYW5nZS5iaW5kKHRoaXMsICdudW1SZXN1bHRzJyl9IG9wdGlvbnM9e1JFU1VMVFN9Lz5cblx0XHRcdFx0XHQ8L1VJLkdyb3VwQm9keT5cblx0XHRcdFx0PC9VSS5Hcm91cD5cblx0XHRcdFx0PFVJLkJ1dHRvbiBvblRhcD17dGhpcy5zaG93UmVzdWx0c30gdHlwZT1cInByaW1hcnlcIj5TaG93IFJlc3VsdHM8L1VJLkJ1dHRvbj5cblx0XHRcdDwvQ29udGFpbmVyPlxuXHRcdCk7XG5cdH1cbn0pO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGhzY2hpbnNrIG9uIDgvMjUvMTUuXG4gKi9cbmltcG9ydCBDb250YWluZXIgZnJvbSAncmVhY3QtY29udGFpbmVyJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBMaW5rLCBVSSB9IGZyb20gJ3RvdWNoc3RvbmVqcyc7XG5cbmNvbnN0IHNjcm9sbGFibGUgPSBDb250YWluZXIuaW5pdFNjcm9sbGFibGUoeyBsZWZ0OiAwLCB0b3A6IDQ0fSk7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIHN0YXRpY3M6IHtcbiAgICAgICAgbmF2aWdhdGlvbkJhcjogJ21haW4nLFxuICAgICAgICBnZXROYXZpZ2F0aW9uIChwcm9wcywgYXBwKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGxlZnRBcnJvdzogdHJ1ZSxcbiAgICAgICAgICAgICAgICBsZWZ0TGFiZWw6ICdMaXN0JyxcbiAgICAgICAgICAgICAgICBsZWZ0QWN0aW9uOiAoKSA9PiB7IGFwcC50cmFuc2l0aW9uVG8oJ3RhYnM6JyArIHByb3BzLnByZXZWaWV3LCB7IHRyYW5zaXRpb246ICdyZXZlYWwtZnJvbS1yaWdodCcgfSkgfSxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ0RldGFpbHMnXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb3BlblVSTCAoZXZlbnQpIHtcbiAgICAgICAgdmFyIG1lZGlhVXJsID0gdGhpcy5wcm9wcy5pdGVtLnRyYWNrVmlld1VybDtcblxuICAgICAgICBpZiAoIXdpbmRvdy5jb3Jkb3ZhKSB7XG4gICAgICAgICAgICB3aW5kb3cub3BlbihtZWRpYVVybClcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHdpbmRvdy5vcGVuKG1lZGlhVXJsLFwiX2JsYW5rXCIpXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcmVuZGVyICgpIHtcbiAgICAgICAgdmFyIHsgaXRlbSB9ID0gdGhpcy5wcm9wcztcblxuICAgICAgICB2YXIgdmlkZW9WYWwgPSAnYmxvY2snO1xuICAgICAgICB2YXIgYXVkaW9WYWwgPSAnbm9uZSc7XG4gICAgICAgIHZhciBjbGFzc05hbWUgPSBcInZpZGVvX19hdmF0YXJcIjtcblxuICAgICAgICBpZiAoaXRlbS5raW5kLmluZGV4T2YoJ3NvbmcnKT4tMSkge1xuICAgICAgICAgICAgdmlkZW9WYWwgPSAnbm9uZSc7XG4gICAgICAgICAgICBhdWRpb1ZhbCA9ICdibG9jayc7XG4gICAgICAgICAgICBjbGFzc05hbWUgPSBcInNvbmdfX2F2YXRhclwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGl0ZW0ua2luZC5pbmRleE9mKCdtb3ZpZScpPi0xKSB7XG4gICAgICAgICAgICB2aWRlb1ZhbCA9ICdub25lJztcbiAgICAgICAgICAgIGF1ZGlvVmFsID0gJ25vbmUnO1xuICAgICAgICAgICAgY2xhc3NOYW1lID0gXCJtb3ZpZV9fYXZhdGFyXCI7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPENvbnRhaW5lciByZWY9XCJzY3JvbGxDb250YWluZXJcIiBzY3JvbGxhYmxlPXtzY3JvbGxhYmxlfT5cbiAgICAgICAgICAgICAgICA8VUkuR3JvdXA+XG4gICAgICAgICAgICAgICAgICAgIDxVSS5Hcm91cEhlYWRlciBjbGFzc05hbWU9XCJ0ZXh0LXByaW1hcnlcIj57aXRlbS5raW5kfTwvVUkuR3JvdXBIZWFkZXI+XG4gICAgICAgICAgICAgICAgICAgIDxVSS5Hcm91cEJvZHk+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz17aXRlbS5hcnR3b3JrVXJsMTAwfSBjbGFzc05hbWU9e2NsYXNzTmFtZX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgPFVJLkxhYmVsSW5wdXQgcmVhZE9ubHkgbGFiZWw9XCJOYW1lXCIgdmFsdWU9e2l0ZW0udHJhY2tOYW1lfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8VUkuTGFiZWxJbnB1dCByZWFkT25seSBsYWJlbD1cIkFydGlzdFwiIHZhbHVlPXtpdGVtLmFydGlzdE5hbWV9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxVSS5MYWJlbElucHV0IHJlYWRPbmx5IGxhYmVsPVwiR2VucmVcIiB2YWx1ZT17aXRlbS5wcmltYXJ5R2VucmVOYW1lfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8VUkuTGFiZWxJbnB1dCByZWFkT25seSBsYWJlbD1cIkNvbGxlY3Rpb25cIiB2YWx1ZT17aXRlbS5jb2xsZWN0aW9uTmFtZX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgPFVJLkxhYmVsSW5wdXQgcmVhZE9ubHkgbGFiZWw9XCJSZWxlYXNlZFwiIHZhbHVlPXtpdGVtLnJlbGVhc2VEYXRlfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8VUkuTGFiZWxJbnB1dCByZWFkT25seSBsYWJlbD1cIkl0ZW0gUHJpY2VcIiB2YWx1ZT17aXRlbS50cmFja1ByaWNlIT1udWxsP2l0ZW0udHJhY2tQcmljZS50b1N0cmluZygpOml0ZW0udHJhY2tQcmljZX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgPFVJLkl0ZW0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPFVJLkl0ZW1Jbm5lcj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPFVJLkZpZWxkTGFiZWw+RXhwbGljaXQ/PC9VSS5GaWVsZExhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8VUkuU3dpdGNoIG9uPXtpdGVtLmNvbGxlY3Rpb25FeHBsaWNpdG5lc3M9PSdleHBsaWNpdCd9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L1VJLkl0ZW1Jbm5lcj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvVUkuSXRlbT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxVSS5JdGVtIHN0eWxlPXt7ZGlzcGxheTphdWRpb1ZhbH19PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxVSS5JdGVtSW5uZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhdWRpbyBjb250cm9scz1cInRydWVcIiBwcmVsb2FkPVwiYXV0b1wiIHNyYz17aXRlbS5wcmV2aWV3VXJsfT7igKg8L2F1ZGlvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvVUkuSXRlbUlubmVyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9VSS5JdGVtPlxuICAgICAgICAgICAgICAgICAgICAgICAgPFVJLkl0ZW0gc3R5bGU9e3tkaXNwbGF5OnZpZGVvVmFsfX0+4oCoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHZpZGVvIGNvbnRyb2xzIHNyYz17aXRlbS5wcmV2aWV3VXJsfSB0eXBlPVwidmlkZW8vbXA0XCI+4oCoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC92aWRlbz5cbiAgICAgICAgICAgICAgICAgICAgICAgIOKAqDwvVUkuSXRlbT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxVSS5JdGVtPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxVSS5JdGVtSW5uZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxVSS5CdXR0b24gb25UYXA9e3RoaXMub3BlblVSTC5iaW5kKHRoaXMsdGhpcy5wcm9wcy5pdGVtLnRyYWNrVmlld1VybCl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPFVJLkl0ZW1Ob3RlIGxhYmVsPVwiT3BlbiBpbiBpVHVuZXNcIiBpY29uPVwiaW9uLXNoYXJlXCIgdHlwZT1cImluZm9cIj48L1VJLkl0ZW1Ob3RlPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L1VJLkJ1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L1VJLkl0ZW1Jbm5lcj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvVUkuSXRlbT5cbiAgICAgICAgICAgICAgICAgICAgPC9VSS5Hcm91cEJvZHk+XG4gICAgICAgICAgICAgICAgICAgIDxVSS5Hcm91cEZvb3Rlcj5cbiAgICAgICAgICAgICAgICAgICAgICAgIERhdGEgYmFzZWQgb24gdGhlIGxhdGVzdCByZXN1bHRzIGZyb20gPGEgaHJlZj1cImh0dHA6Ly9pdHVuZXMuY29tXCI+aVR1bmVzPC9hPlxuICAgICAgICAgICAgICAgICAgICA8L1VJLkdyb3VwRm9vdGVyPlxuICAgICAgICAgICAgICAgIDwvVUkuR3JvdXA+XG4gICAgICAgICAgICA8L0NvbnRhaW5lcj5cbiAgICAgICAgKVxuICAgIH1cbn0pO1xuIiwiaW1wb3J0IENvbnRhaW5lciBmcm9tICdyZWFjdC1jb250YWluZXInO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBTZW50cnkgZnJvbSAncmVhY3Qtc2VudHJ5JztcbmltcG9ydCBUYXBwYWJsZSBmcm9tICdyZWFjdC10YXBwYWJsZSc7XG5pbXBvcnQgVGltZXJzIGZyb20gJ3JlYWN0LXRpbWVycyc7XG5pbXBvcnQgeyBMaW5rLCBVSSB9IGZyb20gJ3RvdWNoc3RvbmVqcyc7XG5cbnZhciBzY3JvbGxhYmxlID0gQ29udGFpbmVyLmluaXRTY3JvbGxhYmxlKHsgbGVmdDogMCwgdG9wOiA0NCB9KTtcblxudmFyIFNpbXBsZUxpbmtJdGVtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRwcm9wVHlwZXM6IHtcblx0XHRpdGVtOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWRcblx0fSxcblxuXHRnZXREZWZhdWx0UHJvcHMgKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRwcmV2VmlldzogJ21lZGlhLWxpc3QnXG5cdFx0fVxuXHR9LFxuXG5cdHJlbmRlciAoKSB7XG5cdFx0bGV0IGl0ZW0gPSB0aGlzLnByb3BzLml0ZW07XG5cdFx0bGV0IGNsYXNzTmFtZSA9IFwidmlkZW9fX2F2YXRhcl9zbVwiO1xuXG5cdFx0aWYgKGl0ZW0ua2luZC5pbmRleE9mKCdzb25nJyk+LTEpXG5cdFx0XHRjbGFzc05hbWUgPSBcInNvbmdfX2F2YXRhcl9zbVwiO1xuXHRcdGVsc2UgaWYgKGl0ZW0ua2luZC5pbmRleE9mKCdtb3ZpZScpPi0xKVxuXHRcdFx0Y2xhc3NOYW1lID0gXCJtb3ZpZV9fYXZhdGFyX3NtXCI7XG5cblx0XHRcdHJldHVybiAoXG5cdFx0XHQ8TGluayB0bz1cInRhYnM6bWVkaWEtZGV0YWlsc1wiIHRyYW5zaXRpb249XCJzaG93LWZyb20tcmlnaHRcIiB2aWV3UHJvcHM9e3sgaXRlbTogdGhpcy5wcm9wcy5pdGVtLCBwcmV2VmlldzogdGhpcy5wcm9wcy5wcmV2Vmlld319ID5cblx0XHRcdFx0PFVJLkl0ZW0gc2hvd0Rpc2Nsb3N1cmVBcnJvdz5cblx0XHRcdFx0XHQ8aW1nIHNyYz17aXRlbS5hcnR3b3JrVXJsNjB9IGNsYXNzTmFtZT17Y2xhc3NOYW1lfS8+XG5cdFx0XHRcdFx0PFVJLkl0ZW1Jbm5lcj5cblx0XHRcdFx0XHRcdDxVSS5JdGVtQ29udGVudD5cblx0XHRcdFx0XHRcdFx0PFVJLkl0ZW1UaXRsZT57aXRlbS50cmFja05hbWV9PC9VSS5JdGVtVGl0bGU+XG5cdFx0XHRcdFx0XHRcdDxVSS5JdGVtU3ViVGl0bGU+e2l0ZW0uYXJ0aXN0TmFtZX08L1VJLkl0ZW1TdWJUaXRsZT5cblx0XHRcdFx0XHRcdDwvVUkuSXRlbUNvbnRlbnQ+XG5cdFx0XHRcdFx0PC9VSS5JdGVtSW5uZXI+XG5cdFx0XHRcdDwvVUkuSXRlbT5cblx0XHRcdDwvTGluaz5cblx0XHQpO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdG1peGluczogIFtTZW50cnkoKSwgVGltZXJzKCldLFxuXHRjb250ZXh0VHlwZXM6IHsgbWVkaWFTdG9yZTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLCBhcHA6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QgfSxcblx0c3RhdGljczoge1xuXHRcdG5hdmlnYXRpb25CYXI6ICdtYWluJyxcblx0XHRnZXROYXZpZ2F0aW9uIChwcm9wcywgYXBwKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRsZWZ0QXJyb3c6IHRydWUsXG5cdFx0XHRcdGxlZnRMYWJlbDogJ0NyaXRlcmlhJyxcblx0XHRcdFx0bGVmdEFjdGlvbjogKCkgPT4geyBhcHAudHJhbnNpdGlvblRvKCd0YWJzOmNyaXRlcmlhJywgeyB0cmFuc2l0aW9uOiAncmV2ZWFsLWZyb20tcmlnaHQnLCAgdmlld1Byb3BzOiB7cHJldlZpZXc6J21lZGlhLWxpc3QnfX0pIH0sXG5cdFx0XHRcdHRpdGxlOiAnTWVkaWEgUmVzdWx0cydcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0Y29tcG9uZW50RGlkTW91bnQgKCkge1xuXHRcdGlmICh0aGlzLnByb3BzLnByZXZWaWV3PT0nY3JpdGVyaWEnKSB7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0cG9wdXA6IHtcblx0XHRcdFx0XHR2aXNpYmxlOiB0cnVlLFxuXHRcdFx0XHRcdGxvYWRpbmc6IHRydWUsXG5cdFx0XHRcdFx0aGVhZGVyOiAnTG9hZGluZycsXG5cdFx0XHRcdFx0aWNvbk5hbWU6ICdpb24tbG9hZC1hJyxcblx0XHRcdFx0XHRpY29uVHlwZTogJ2RlZmF1bHQnXG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXG5cdFx0XHQvLyBVc2luZyBqc29ucCBzbyB3ZSBjYW4gcnVuIHRoaXMgaW4gdGhlIGJyb3dzZXIgd2l0aG91dCBYSFIgaXNzdWVzIGZvciBlYXNpZXIgZGVidWdnaW5nXG5cdFx0XHR0aGlzLmpzb25wKFwiaHR0cHM6Ly9pdHVuZXMuYXBwbGUuY29tL3NlYXJjaD90ZXJtPVwiICsgdGhpcy5wcm9wcy5zZWFyY2hUZXJtICsgXCImZW50aXR5PVwiICsgdGhpcy5wcm9wcy5tZWRpYVR5cGUgKyBcIiZsaW1pdD1cIiArIHRoaXMucHJvcHMubnVtUmVzdWx0cywgZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRzZWxmLnNldFN0YXRlKHtcblx0XHRcdFx0XHRwb3B1cDoge1xuXHRcdFx0XHRcdFx0dmlzaWJsZTogZmFsc2Vcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRpZiAoZGF0YSE9bnVsbCkge1xuXHRcdFx0XHRcdHNlbGYuY29udGV4dC5tZWRpYVN0b3JlLml0ZW1zID0gZGF0YS5yZXN1bHRzOyAvLyBob2xkIGl0IGluIHRoZSBjb250ZXh0IG9iamVjdCBmb3Igd2hlbiB3ZSBjb21lIGJhY2tcblx0XHRcdFx0XHR2YXIgaXRlbXMgPSBzZWxmLmNvbnRleHQubWVkaWFTdG9yZS5mb3JtYXREYXRlKCk7XG5cdFx0XHRcdFx0c2VsZi5zZXRTdGF0ZSh7bWVkaWE6IGl0ZW1zfSk7XG5cblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHNlbGYuc2hvd0FsZXJ0KCdkYW5nZXInLFwiQW4gZXJyb3Igb2NjdXJyZWQgcmV0cmlldmluZyBkYXRhIGZyb20gaVR1bmVzLiBEbyB5b3UgaGF2ZSBhbiBJbnRlcm5ldCBjb25uZWN0aW9uPyBBIHZhbGlkIFVSTD9cIik7XG5cblx0XHRcdH0pO1xuXHRcdH1cblx0XHQvLyBDb21pbmcgYmFjayBmcm9tIGRldGFpbHMgcGFnZSAtIHVzZSB0aGUgYWxyZWFkeSBzdG9yZWQgcmVzdWx0cyBpbiB0aGUgbWVkaWEgc3RvcmVcblx0XHRlbHNlIHRoaXMuc2V0U3RhdGUoe21lZGlhOnRoaXMuY29udGV4dC5tZWRpYVN0b3JlLml0ZW1zfSlcblx0fSxcblxuXHRqc29ucCAodXJsLCBjYWxsYmFjaykge1xuXHRcdHZhciBjYWxsYmFja05hbWUgPSAnanNvbnBfY2FsbGJhY2tfJyArIE1hdGgucm91bmQoMTAwMDAwICogTWF0aC5yYW5kb20oKSk7XG5cdFx0d2luZG93W2NhbGxiYWNrTmFtZV0gPSBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRkZWxldGUgd2luZG93W2NhbGxiYWNrTmFtZV07XG5cdFx0XHRkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHNjcmlwdCk7XG5cdFx0XHRjYWxsYmFjayhkYXRhKTtcblx0XHR9O1xuXG5cdFx0dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuXHRcdHNjcmlwdC5zcmMgPSB1cmwgKyAodXJsLmluZGV4T2YoJz8nKSA+PSAwID8gJyYnIDogJz8nKSArICdjYWxsYmFjaz0nICsgY2FsbGJhY2tOYW1lO1xuXHRcdHNlbGYgPSB0aGlzO1xuXHRcdHNjcmlwdC5vbmVycm9yID0gZnVuY3Rpb24oZXJyKSB7XG5cdFx0XHRjYWxsYmFjayhudWxsKVxuXHRcdH07XG5cblx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdCk7XG5cdH0sXG5cblx0c2hvd0FsZXJ0ICh0eXBlLCB0ZXh0KSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRhbGVydGJhcjoge1xuXHRcdFx0XHR2aXNpYmxlOiB0cnVlLFxuXHRcdFx0XHR0eXBlOiB0eXBlLFxuXHRcdFx0XHR0ZXh0OiB0ZXh0XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0dGhpcy5zZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRhbGVydGJhcjoge1xuXHRcdFx0XHRcdHZpc2libGU6IGZhbHNlXG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0sIDMwMDApO1xuXHR9LFxuXG5cdGdldEluaXRpYWxTdGF0ZSAoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGZpbHRlclN0cmluZzogJycsXG5cdFx0XHRtZWRpYTogW10sXG5cdFx0XHRwb3B1cDoge1xuXHRcdFx0XHR2aXNpYmxlOiBmYWxzZVxuXHRcdFx0fSxcblx0XHRcdGFsZXJ0YmFyOiB7XG5cdFx0XHRcdHZpc2libGU6IGZhbHNlLFxuXHRcdFx0XHR0eXBlOiAnJyxcblx0XHRcdFx0dGV4dDogJydcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0Y2xlYXJGaWx0ZXIgKCkge1xuXHRcdHRoaXMuc2V0U3RhdGUoeyBmaWx0ZXJTdHJpbmc6ICcnIH0pO1xuXHR9LFxuXG5cdHVwZGF0ZUZpbHRlciAoc3RyKSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7IGZpbHRlclN0cmluZzogc3RyIH0pO1xuXHR9LFxuXG5cdHN1Ym1pdEZpbHRlciAoc3RyKSB7XG5cdFx0Y29uc29sZS5sb2coc3RyKTtcblx0fSxcblxuXHRyZW5kZXIgKCkge1xuXHRcdGxldCB7IG1lZGlhLCBmaWx0ZXJTdHJpbmcsIGFsZXJ0YmFyfSA9IHRoaXMuc3RhdGVcblx0XHRsZXQgZmlsdGVyUmVnZXggPSBuZXcgUmVnRXhwKGZpbHRlclN0cmluZy50b0xvd2VyQ2FzZSgpKVxuXG5cdFx0ZnVuY3Rpb24gbWVkaWFGaWx0ZXIgKGl0ZW0pIHtcblx0XHRcdHJldHVybiBmaWx0ZXJSZWdleC50ZXN0KGl0ZW0udHJhY2tOYW1lLnRvTG93ZXJDYXNlKCkpXG5cdFx0fTtcblx0XHRmdW5jdGlvbiBzb3J0QnlOYW1lIChhLCBiKSB7XG5cdFx0XHRyZXR1cm4gYS50cmFja05hbWUubG9jYWxlQ29tcGFyZShiLnRyYWNrTmFtZSlcblx0XHR9O1xuXG5cdFx0bGV0IGZpbHRlcmVkTWVkaWEgPSBtZWRpYS5maWx0ZXIobWVkaWFGaWx0ZXIpLnNvcnQoc29ydEJ5TmFtZSk7XG5cblx0XHRsZXQgcmVzdWx0c1xuXG5cdFx0aWYgKGZpbHRlclN0cmluZyAmJiAhZmlsdGVyZWRNZWRpYS5sZW5ndGgpIHtcblx0XHRcdHJlc3VsdHMgPSAoXG5cdFx0XHRcdDxDb250YWluZXIgZGlyZWN0aW9uPVwiY29sdW1uXCIgYWxpZ249XCJjZW50ZXJcIiBqdXN0aWZ5PVwiY2VudGVyXCIgY2xhc3NOYW1lPVwibm8tcmVzdWx0c1wiPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwibm8tcmVzdWx0c19faWNvbiBpb24taW9zLWZpbHRlci1zdHJvbmdcIiAvPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwibm8tcmVzdWx0c19fdGV4dFwiPnsnTm8gcmVzdWx0cyBmb3IgXCInICsgZmlsdGVyU3RyaW5nICsgJ1wiJ308L2Rpdj5cblx0XHRcdFx0PC9Db250YWluZXI+XG5cdFx0XHQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXN1bHRzID0gKFxuXHRcdFx0XHQ8VUkuR3JvdXBCb2R5PlxuXHRcdFx0XHRcdHtmaWx0ZXJlZE1lZGlhLm1hcCgoaXRlbSwgaSkgPT4ge1xuXHRcdFx0XHRcdFx0cmV0dXJuIDxTaW1wbGVMaW5rSXRlbSBrZXk9eydpdGVtJyArIGl9IGl0ZW09e2l0ZW19Lz5cblx0XHRcdFx0XHR9KX1cblx0XHRcdFx0PC9VSS5Hcm91cEJvZHk+XG5cdFx0XHQpO1xuXHRcdH1cblxuXHRcdHJldHVybiAoXG5cdFx0XHQ8Q29udGFpbmVyIHJlZj1cInNjcm9sbENvbnRhaW5lclwiIHNjcm9sbGFibGU9e3Njcm9sbGFibGV9PlxuXHRcdFx0XHQ8VUkuQWxlcnRiYXIgdHlwZT17YWxlcnRiYXIudHlwZSB8fCAnZGVmYXVsdCd9IHZpc2libGU9e2FsZXJ0YmFyLnZpc2libGV9IGFuaW1hdGVkPnthbGVydGJhci50ZXh0fTwvVUkuQWxlcnRiYXI+XG5cdFx0XHRcdDxVSS5TZWFyY2hGaWVsZCB0eXBlPVwiZGFya1wiIHZhbHVlPXt0aGlzLnN0YXRlLmZpbHRlclN0cmluZ30gb25TdWJtaXQ9e3RoaXMuc3VibWl0RmlsdGVyfSBvbkNoYW5nZT17dGhpcy51cGRhdGVGaWx0ZXJ9XG5cdFx0XHRcdCAgb25DYW5jZWw9e3RoaXMuY2xlYXJGaWx0ZXJ9IG9uQ2xlYXI9e3RoaXMuY2xlYXJGaWx0ZXJ9IHBsYWNlaG9sZGVyPVwiRmlsdGVyLi4uXCIgLz5cblx0XHRcdFx0e3Jlc3VsdHN9XG5cdFx0XHRcdDxVSS5Qb3B1cCB2aXNpYmxlPXt0aGlzLnN0YXRlLnBvcHVwLnZpc2libGV9PlxuXHRcdFx0XHRcdDxVSS5Qb3B1cEljb24gbmFtZT17dGhpcy5zdGF0ZS5wb3B1cC5pY29uTmFtZX0gdHlwZT17dGhpcy5zdGF0ZS5wb3B1cC5pY29uVHlwZX0gc3Bpbm5pbmc9e3RoaXMuc3RhdGUucG9wdXAubG9hZGluZ30gLz5cblx0XHRcdFx0XHQ8ZGl2PjxzdHJvbmc+e3RoaXMuc3RhdGUucG9wdXAuaGVhZGVyfTwvc3Ryb25nPjwvZGl2PlxuXHRcdFx0XHQ8L1VJLlBvcHVwPlxuXHRcdFx0PC9Db250YWluZXI+XG5cdFx0KTtcblx0fVxufSk7XG4iLCJcbmltcG9ydCBDb250YWluZXIgZnJvbSAncmVhY3QtY29udGFpbmVyJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBMaW5rLCBVSSB9IGZyb20gJ3RvdWNoc3RvbmVqcyc7XG5cbmNvbnN0IHNjcm9sbGFibGUgPSBDb250YWluZXIuaW5pdFNjcm9sbGFibGUoKTtcblxuY29uc3QgTUVESUFfVFlQRVMgPSBbXG4gICAgeyBsYWJlbDogJ011c2ljIFZpZGVvJywgICAgdmFsdWU6ICdtdXNpY1ZpZGVvJyB9LFxuICAgIHsgbGFiZWw6ICdTb25nJywgIHZhbHVlOiAnc29uZycgfSxcbiAgICB7IGxhYmVsOiAnTW92aWUnLCAgICB2YWx1ZTogJ21vdmllJyB9LFxuXTtcbmNvbnN0IFJFU1VMVFMgPSBbXG4gICAgeyBsYWJlbDogJzE1JywgICAgdmFsdWU6ICcxNScgfSxcbiAgICB7IGxhYmVsOiAnMjUnLCAgdmFsdWU6ICcyNScgfSxcbiAgICB7IGxhYmVsOiAnNTAnLCAgICB2YWx1ZTogJzUwJyB9LFxuXTtcbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIHN0YXRpY3M6IHtcbiAgICAgICAgbmF2aWdhdGlvbkJhcjogJ21haW4nLFxuICAgICAgICBnZXROYXZpZ2F0aW9uIChwcm9wcyxhcHApIHtcbiAgICAgICAgICAgIC8vIFRoaXMgaXMgYSBzZXBhcmF0ZSB0YWIgYW5kIHZpZXcgc3RhY2sgd2l0aCBqdXN0IG9uZSB2aWV3IGN1cnJlbnRseVxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1ByZWZlcmVuY2VzJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGdldEluaXRpYWxTdGF0ZSAoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBtZWRpYVR5cGU6IHRoaXMucHJvcHMucHJlZmVyZW5jZXMubWVkaWFUeXBlLFxuICAgICAgICAgICAgbnVtUmVzdWx0czogdGhpcy5wcm9wcy5wcmVmZXJlbmNlcy5udW1SZXN1bHRzXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgaGFuZGxlUmVzdWx0c0NoYW5nZSAoa2V5LCBuZXdWYWx1ZSkge1xuICAgICAgICBsZXQgbmV3U3RhdGUgPSB7fTtcbiAgICAgICAgbmV3U3RhdGVba2V5XSA9IG5ld1ZhbHVlO1xuICAgICAgICB0aGlzLnNldFN0YXRlKG5ld1N0YXRlKTtcbiAgICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZVByZWZlcmVuY2Uoa2V5LG5ld1ZhbHVlKVxuXG4gICAgfSxcblxuICAgIGhhbmRsZVR5cGVDaGFuZ2UgKGtleSwgZXZlbnQpIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5tZWRpYVR5cGUgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgICAgIHRoaXMucHJvcHMub25DaGFuZ2VQcmVmZXJlbmNlKGtleSxldmVudC50YXJnZXQudmFsdWUpXG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPENvbnRhaW5lciBzY3JvbGxhYmxlPXtzY3JvbGxhYmxlfT5cbiAgICAgICAgICAgICAgICA8VUkuR3JvdXA+XG4gICAgICAgICAgICAgICAgICAgIDxVSS5Hcm91cEhlYWRlcj5QcmVmZXJlbmNlczwvVUkuR3JvdXBIZWFkZXI+XG4gICAgICAgICAgICAgICAgICAgIDxVSS5Hcm91cEJvZHk+XG4gICAgICAgICAgICAgICAgICAgICAgICA8VUkuTGFiZWxTZWxlY3QgbGFiZWw9XCJNZWRpYSBUeXBlXCIgdmFsdWU9e3RoaXMuc3RhdGUubWVkaWFUeXBlfSBvcHRpb25zPXtNRURJQV9UWVBFU31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVUeXBlQ2hhbmdlLmJpbmQodGhpcywnbWVkaWFUeXBlJyl9Lz5cbiAgICAgICAgICAgICAgICAgICAgPC9VSS5Hcm91cEJvZHk+XG4gICAgICAgICAgICAgICAgPC9VSS5Hcm91cD5cbiAgICAgICAgICAgICAgICA8VUkuR3JvdXA+XG4gICAgICAgICAgICAgICAgICAgIDxVSS5Hcm91cEhlYWRlcj4jIFJlc3VsdHM8L1VJLkdyb3VwSGVhZGVyPlxuICAgICAgICAgICAgICAgICAgICA8VUkuR3JvdXBCb2R5PlxuICAgICAgICAgICAgICAgICAgICAgICAgPFVJLlJhZGlvTGlzdCB2YWx1ZT17dGhpcy5zdGF0ZS5udW1SZXN1bHRzfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVSZXN1bHRzQ2hhbmdlLmJpbmQodGhpcywgJ251bVJlc3VsdHMnKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucz17UkVTVUxUU30gLz5cbiAgICAgICAgICAgICAgICAgICAgPC9VSS5Hcm91cEJvZHk+XG4gICAgICAgICAgICAgICAgPC9VSS5Hcm91cD5cbiAgICAgICAgICAgIDwvQ29udGFpbmVyPlxuICAgICAgICApO1xuICAgIH1cbn0pO1xuIl19
