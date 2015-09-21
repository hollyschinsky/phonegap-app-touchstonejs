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
				numResults: '25'
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

	// Handle any cordova needs here

	// If splash screen plugin is loaded and config.xml prefs have AutoHideSplashScreen set to false for iOS we need to
	// programatically hide it here. Could include in a timeout if needed to load more resources or see a white screen
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

module.exports = _react2['default'].createClass({
    displayName: 'exports',

    statics: {
        navigationBar: 'main',
        getNavigation: function getNavigation() {
            return {
                title: 'About'
            };
        }
    },

    openURL: function openURL() {
        var projectUrl = "http://github.com/hollyschinsky/phonegap-app-touchstonejs";
        if (!window.cordova) window.open(projectUrl);else cordova.InAppBrowser.open(projectUrl, "_blank");
    },

    render: function render() {
        return _react2['default'].createElement(
            _reactContainer2['default'],
            null,
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
                            _react2['default'].createElement('img', { src: 'img/react2.png', className: 'avatar' }),
                            _react2['default'].createElement('img', { src: 'img/ts-icon.png', className: 'avatar' }),
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
					app.transitionTo('tabs:about', { transition: 'fade-expand' });
				},
				rightIcon: 'ion-information-circled'
			};
		}
	},

	getInitialState: function getInitialState() {
		return {
			mediaType: this.props.preferences.mediaType,
			numResults: this.props.preferences.numResults,
			searchTerm: 'Ed Sheeran'
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
					_react2['default'].createElement(_touchstonejs.UI.LabelInput, { label: 'Search term', value: this.state.searchTerm, placeholder: 'search term', onChange: this.handleSearchTermChange.bind(this, 'searchTerm') })
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

var scrollable = _reactContainer2['default'].initScrollable();

module.exports = _react2['default'].createClass({
    displayName: 'exports',

    statics: {
        navigationBar: 'main',
        getNavigation: function getNavigation(props, app) {
            var leftLabel = 'List';
            return {
                leftArrow: true,
                leftLabel: leftLabel,
                leftAction: function leftAction() {
                    app.transitionTo('tabs:' + props.prevView, { transition: 'reveal-from-right' });
                },
                title: 'Details'
            };
        }
    },

    getDefaultProps: function getDefaultProps() {
        return {
            prevView: 'media-details'
        };
    },

    openURL: function openURL(event) {
        var mediaUrl = this.props.item.trackViewUrl;
        if (!window.cordova) window.open(mediaUrl);else cordova.InAppBrowser.open(mediaUrl, "_blank");
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
            { scrollable: scrollable },
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
                    _react2['default'].createElement(_touchstonejs.UI.LabelInput, { readOnly: true, label: 'Item Name', value: item.trackName }),
                    _react2['default'].createElement(_touchstonejs.UI.LabelInput, { readOnly: true, label: 'Artist', value: item.artistName }),
                    _react2['default'].createElement(_touchstonejs.UI.LabelInput, { readOnly: true, label: 'Genre', value: item.primaryGenreName }),
                    _react2['default'].createElement(_touchstonejs.UI.LabelInput, { readOnly: true, label: 'Collection', value: item.collectionName }),
                    _react2['default'].createElement(_touchstonejs.UI.LabelInput, { readOnly: true, label: 'Item Price', value: item.trackPrice }),
                    _react2['default'].createElement(_touchstonejs.UI.LabelInput, { readOnly: true, label: 'Released', value: item.releaseDate }),
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
                            { controls: true, width: '350', src: item.previewUrl, type: 'video/mp4' },
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

	render: function render() {
		var item = this.props.item;
		var className = "video__avatar_sm";

		if (item.kind.indexOf('song') > -1) className = "song__avatar_sm";else if (item.kind.indexOf('movie') > -1) className = "movie__avatar_sm";

		return _react2['default'].createElement(
			_touchstonejs.Link,
			{ to: 'tabs:media-details', transition: 'show-from-right', viewProps: { item: this.props.item, prevView: 'media-list' } },
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
					app.transitionTo('tabs:criteria', { transition: 'reveal-from-right' });
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy90b3VjaHN0b25lanMtdGFza3Mvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIm5vZGVfbW9kdWxlcy9jbGFzc25hbWVzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2NvcmRvdmEtZGlhbG9ncy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1jb250YWluZXIvbGliL0NvbnRhaW5lci5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1jb250YWluZXIvbm9kZV9tb2R1bGVzL2JsYWNrbGlzdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1zZW50cnkvbGliL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LXRhcHBhYmxlL2xpYi9UYXBwYWJsZS5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC10aW1lcnMvbGliL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3RvdWNoc3RvbmVqcy9saWIvY29yZS9FcnJvclZpZXcuanMiLCJub2RlX21vZHVsZXMvdG91Y2hzdG9uZWpzL2xpYi9jb3JlL0xpbmsuanMiLCJub2RlX21vZHVsZXMvdG91Y2hzdG9uZWpzL2xpYi9jb3JlL1ZpZXcuanMiLCJub2RlX21vZHVsZXMvdG91Y2hzdG9uZWpzL2xpYi9jb3JlL1ZpZXdNYW5hZ2VyLmpzIiwibm9kZV9tb2R1bGVzL3RvdWNoc3RvbmVqcy9saWIvY29yZS9hbmltYXRpb24uanMiLCJub2RlX21vZHVsZXMvdG91Y2hzdG9uZWpzL2xpYi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy90b3VjaHN0b25lanMvbGliL21peGlucy9UcmFuc2l0aW9ucy5qcyIsIm5vZGVfbW9kdWxlcy90b3VjaHN0b25lanMvbGliL21peGlucy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy90b3VjaHN0b25lanMvbGliL3VpL0FsZXJ0YmFyLmpzIiwibm9kZV9tb2R1bGVzL3RvdWNoc3RvbmVqcy9saWIvdWkvQnV0dG9uLmpzIiwibm9kZV9tb2R1bGVzL3RvdWNoc3RvbmVqcy9saWIvdWkvQnV0dG9uR3JvdXAuanMiLCJub2RlX21vZHVsZXMvdG91Y2hzdG9uZWpzL2xpYi91aS9GaWVsZENvbnRyb2wuanMiLCJub2RlX21vZHVsZXMvdG91Y2hzdG9uZWpzL2xpYi91aS9GaWVsZExhYmVsLmpzIiwibm9kZV9tb2R1bGVzL3RvdWNoc3RvbmVqcy9saWIvdWkvR3JvdXAuanMiLCJub2RlX21vZHVsZXMvdG91Y2hzdG9uZWpzL2xpYi91aS9Hcm91cEJvZHkuanMiLCJub2RlX21vZHVsZXMvdG91Y2hzdG9uZWpzL2xpYi91aS9Hcm91cEZvb3Rlci5qcyIsIm5vZGVfbW9kdWxlcy90b3VjaHN0b25lanMvbGliL3VpL0dyb3VwSGVhZGVyLmpzIiwibm9kZV9tb2R1bGVzL3RvdWNoc3RvbmVqcy9saWIvdWkvR3JvdXBJbm5lci5qcyIsIm5vZGVfbW9kdWxlcy90b3VjaHN0b25lanMvbGliL3VpL0lucHV0LmpzIiwibm9kZV9tb2R1bGVzL3RvdWNoc3RvbmVqcy9saWIvdWkvSXRlbS5qcyIsIm5vZGVfbW9kdWxlcy90b3VjaHN0b25lanMvbGliL3VpL0l0ZW1Db250ZW50LmpzIiwibm9kZV9tb2R1bGVzL3RvdWNoc3RvbmVqcy9saWIvdWkvSXRlbUlubmVyLmpzIiwibm9kZV9tb2R1bGVzL3RvdWNoc3RvbmVqcy9saWIvdWkvSXRlbU1lZGlhLmpzIiwibm9kZV9tb2R1bGVzL3RvdWNoc3RvbmVqcy9saWIvdWkvSXRlbU5vdGUuanMiLCJub2RlX21vZHVsZXMvdG91Y2hzdG9uZWpzL2xpYi91aS9JdGVtU3ViVGl0bGUuanMiLCJub2RlX21vZHVsZXMvdG91Y2hzdG9uZWpzL2xpYi91aS9JdGVtVGl0bGUuanMiLCJub2RlX21vZHVsZXMvdG91Y2hzdG9uZWpzL2xpYi91aS9MYWJlbElucHV0LmpzIiwibm9kZV9tb2R1bGVzL3RvdWNoc3RvbmVqcy9saWIvdWkvTGFiZWxTZWxlY3QuanMiLCJub2RlX21vZHVsZXMvdG91Y2hzdG9uZWpzL2xpYi91aS9MYWJlbFRleHRhcmVhLmpzIiwibm9kZV9tb2R1bGVzL3RvdWNoc3RvbmVqcy9saWIvdWkvTGlzdEhlYWRlci5qcyIsIm5vZGVfbW9kdWxlcy90b3VjaHN0b25lanMvbGliL3VpL05hdmlnYXRpb25CYXIuanMiLCJub2RlX21vZHVsZXMvdG91Y2hzdG9uZWpzL2xpYi91aS9Qb3B1cC5qcyIsIm5vZGVfbW9kdWxlcy90b3VjaHN0b25lanMvbGliL3VpL1BvcHVwSWNvbi5qcyIsIm5vZGVfbW9kdWxlcy90b3VjaHN0b25lanMvbGliL3VpL1JhZGlvTGlzdC5qcyIsIm5vZGVfbW9kdWxlcy90b3VjaHN0b25lanMvbGliL3VpL1NlYXJjaEZpZWxkLmpzIiwibm9kZV9tb2R1bGVzL3RvdWNoc3RvbmVqcy9saWIvdWkvU2VnbWVudGVkQ29udHJvbC5qcyIsIm5vZGVfbW9kdWxlcy90b3VjaHN0b25lanMvbGliL3VpL1N3aXRjaC5qcyIsIm5vZGVfbW9kdWxlcy90b3VjaHN0b25lanMvbGliL3VpL1RhYnMuanMiLCJub2RlX21vZHVsZXMvdG91Y2hzdG9uZWpzL2xpYi91aS9UZXh0YXJlYS5qcyIsIm5vZGVfbW9kdWxlcy90b3VjaHN0b25lanMvbGliL3VpL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3RvdWNoc3RvbmVqcy9ub2RlX21vZHVsZXMvdHdlZW4uanMvaW5kZXguanMiLCIvVXNlcnMvaHNjaGluc2svRG93bmxvYWRzL3Bob25lZ2FwLWFwcC10b3VjaHN0b25lanMvc3JjL2pzL2FwcC5qcyIsIi9Vc2Vycy9oc2NoaW5zay9Eb3dubG9hZHMvcGhvbmVnYXAtYXBwLXRvdWNoc3RvbmVqcy9zcmMvanMvc3RvcmVzL21lZGlhLmpzIiwiL1VzZXJzL2hzY2hpbnNrL0Rvd25sb2Fkcy9waG9uZWdhcC1hcHAtdG91Y2hzdG9uZWpzL3NyYy9qcy92aWV3cy9hYm91dC5qcyIsIi9Vc2Vycy9oc2NoaW5zay9Eb3dubG9hZHMvcGhvbmVnYXAtYXBwLXRvdWNoc3RvbmVqcy9zcmMvanMvdmlld3MvY3JpdGVyaWEtZm9ybS5qcyIsIi9Vc2Vycy9oc2NoaW5zay9Eb3dubG9hZHMvcGhvbmVnYXAtYXBwLXRvdWNoc3RvbmVqcy9zcmMvanMvdmlld3MvbWVkaWEtZGV0YWlscy5qcyIsIi9Vc2Vycy9oc2NoaW5zay9Eb3dubG9hZHMvcGhvbmVnYXAtYXBwLXRvdWNoc3RvbmVqcy9zcmMvanMvdmlld3MvbWVkaWEtbGlzdC5qcyIsIi9Vc2Vycy9oc2NoaW5zay9Eb3dubG9hZHMvcGhvbmVnYXAtYXBwLXRvdWNoc3RvbmVqcy9zcmMvanMvdmlld3MvcHJlZmVyZW5jZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzljQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OzsyQkNwdkJrQixjQUFjOzs7OzRCQU96QixjQUFjOzs7OztBQUtyQixJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtBQUM1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RCxVQUFNLEVBQUUsa0JBQVk7QUFDaEIsZUFDSTs7Y0FBVyxVQUFVLEVBQUUsVUFBVSxBQUFDO1lBQzlCO0FBQUMsaUNBQUcsS0FBSzs7Z0JBQ0w7QUFBQyxxQ0FBRyxXQUFXOzs7aUJBQTZCO2dCQUM1QztBQUFDLHFDQUFHLFNBQVM7O29CQUNULGlDQUFDLGlCQUFHLFdBQVcsSUFBQyxLQUFLLEVBQUMsWUFBWSxFQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQUFBQyxFQUFDLE9BQU8sRUFBRSxXQUFXLEFBQUM7QUFDckUsZ0NBQVEsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBQyxXQUFXLENBQUMsQUFBQyxHQUFFO2lCQUM5RDthQUNSO1lBQ1g7QUFBQyxpQ0FBRyxLQUFLOztnQkFDTDtBQUFDLHFDQUFHLFdBQVc7OztpQkFBMkI7Z0JBQzFDO0FBQUMscUNBQUcsU0FBUzs7b0JBQ1QsaUNBQUMsaUJBQUcsU0FBUyxJQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQUFBQyxFQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxZQUFZLENBQUMsQUFBQztBQUMxRiwrQkFBTyxFQUFFLE9BQU8sQUFBQyxHQUFHO2lCQUN2QjthQUNSO1NBQ0gsQ0FDZDtLQUNMO0NBQ0osQ0FBQyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIVxuICBDb3B5cmlnaHQgKGMpIDIwMTUgSmVkIFdhdHNvbi5cbiAgTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlIChNSVQpLCBzZWVcbiAgaHR0cDovL2plZHdhdHNvbi5naXRodWIuaW8vY2xhc3NuYW1lc1xuKi9cblxuKGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdGZ1bmN0aW9uIGNsYXNzTmFtZXMgKCkge1xuXG5cdFx0dmFyIGNsYXNzZXMgPSAnJztcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgYXJnID0gYXJndW1lbnRzW2ldO1xuXHRcdFx0aWYgKCFhcmcpIGNvbnRpbnVlO1xuXG5cdFx0XHR2YXIgYXJnVHlwZSA9IHR5cGVvZiBhcmc7XG5cblx0XHRcdGlmICgnc3RyaW5nJyA9PT0gYXJnVHlwZSB8fCAnbnVtYmVyJyA9PT0gYXJnVHlwZSkge1xuXHRcdFx0XHRjbGFzc2VzICs9ICcgJyArIGFyZztcblxuXHRcdFx0fSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGFyZykpIHtcblx0XHRcdFx0Y2xhc3NlcyArPSAnICcgKyBjbGFzc05hbWVzLmFwcGx5KG51bGwsIGFyZyk7XG5cblx0XHRcdH0gZWxzZSBpZiAoJ29iamVjdCcgPT09IGFyZ1R5cGUpIHtcblx0XHRcdFx0Zm9yICh2YXIga2V5IGluIGFyZykge1xuXHRcdFx0XHRcdGlmIChhcmcuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBhcmdba2V5XSkge1xuXHRcdFx0XHRcdFx0Y2xhc3NlcyArPSAnICcgKyBrZXk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNsYXNzZXMuc3Vic3RyKDEpO1xuXHR9XG5cblx0aWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBjbGFzc05hbWVzO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGRlZmluZS5hbWQgPT09ICdvYmplY3QnICYmIGRlZmluZS5hbWQpe1xuXHRcdC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cblx0XHRkZWZpbmUoZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIGNsYXNzTmFtZXM7XG5cdFx0fSk7XG5cdH0gZWxzZSB7XG5cdFx0d2luZG93LmNsYXNzTmFtZXMgPSBjbGFzc05hbWVzO1xuXHR9XG5cbn0oKSk7XG4iLCJmdW5jdGlvbiBtYWtlc2hpZnRUaXRsZSh0aXRsZSwgbWVzc2FnZSkge1xuICByZXR1cm4gdGl0bGUgPyAodGl0bGUgKyAnXFxuXFxuJyArIG1lc3NhZ2UpIDogbWVzc2FnZVxufVxuXG4vLyBTZWUgaHR0cDovL2RvY3MucGhvbmVnYXAuY29tL2VuL2VkZ2UvY29yZG92YV9ub3RpZmljYXRpb25fbm90aWZpY2F0aW9uLm1kLmh0bWwgZm9yIGRvY3VtZW50YXRpb25cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhbGVydDogZnVuY3Rpb24gYWxlcnQobWVzc2FnZSwgY2FsbGJhY2ssIHRpdGxlKSB7XG4gICAgaWYgKHdpbmRvdy5uYXZpZ2F0b3Iubm90aWZpY2F0aW9uICYmIHdpbmRvdy5uYXZpZ2F0b3Iubm90aWZpY2F0aW9uLmFsZXJ0KSB7XG4gICAgICByZXR1cm4gd2luZG93Lm5hdmlnYXRvci5ub3RpZmljYXRpb24uYWxlcnQuYXBwbHkobnVsbCwgYXJndW1lbnRzKVxuICAgIH1cblxuICAgIHZhciB0ZXh0ID0gbWFrZXNoaWZ0VGl0bGUodGl0bGUsIG1lc3NhZ2UpXG5cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgd2luZG93LmFsZXJ0KHRleHQpXG5cbiAgICAgIGNhbGxiYWNrKClcbiAgICB9LCAwKVxuICB9LFxuICBjb25maXJtOiBmdW5jdGlvbiBjb25maXJtKG1lc3NhZ2UsIGNhbGxiYWNrLCB0aXRsZSkge1xuICAgIGlmICh3aW5kb3cubmF2aWdhdG9yLm5vdGlmaWNhdGlvbiAmJiB3aW5kb3cubmF2aWdhdG9yLm5vdGlmaWNhdGlvbi5jb25maXJtKSB7XG4gICAgICByZXR1cm4gd2luZG93Lm5hdmlnYXRvci5ub3RpZmljYXRpb24uY29uZmlybS5hcHBseShudWxsLCBhcmd1bWVudHMpXG4gICAgfVxuXG4gICAgdmFyIHRleHQgPSBtYWtlc2hpZnRUaXRsZSh0aXRsZSwgbWVzc2FnZSlcblxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgY29uZmlybWVkID0gd2luZG93LmNvbmZpcm0odGV4dClcbiAgICAgIHZhciBidXR0b25JbmRleCA9IGNvbmZpcm1lZCA/IDEgOiAyXG5cbiAgICAgIGNhbGxiYWNrKGJ1dHRvbkluZGV4KVxuICAgIH0sIDApXG4gIH0sXG5cbiAgcHJvbXB0OiBmdW5jdGlvbiBwcm9tcHQobWVzc2FnZSwgY2FsbGJhY2ssIHRpdGxlLCBkZWZhdWx0VGV4dCkge1xuICAgIGlmICh3aW5kb3cubmF2aWdhdG9yLm5vdGlmaWNhdGlvbiAmJiB3aW5kb3cubmF2aWdhdG9yLm5vdGlmaWNhdGlvbi5wcm9tcHQpIHtcbiAgICAgIHJldHVybiB3aW5kb3cubmF2aWdhdG9yLm5vdGlmaWNhdGlvbi5wcm9tcHQuYXBwbHkobnVsbCwgYXJndW1lbnRzKVxuICAgIH1cblxuICAgIHZhciBxdWVzdGlvbiA9IG1ha2VzaGlmdFRpdGxlKHRpdGxlLCBtZXNzYWdlKVxuXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIHZhciB0ZXh0ID0gd2luZG93LnByb21wdChxdWVzdGlvbiwgZGVmYXVsdFRleHQpXG4gICAgICB2YXIgYnV0dG9uSW5kZXggPSAodGV4dCA9PT0gbnVsbCkgPyAwIDogMVxuXG4gICAgICBjYWxsYmFjayh7XG4gICAgICAgIGJ1dHRvbkluZGV4OiBidXR0b25JbmRleCxcbiAgICAgICAgaW5wdXQxOiB0ZXh0XG4gICAgICB9KVxuICAgIH0sIDApXG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuXHR2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbnZhciBibGFja2xpc3QgPSByZXF1aXJlKCdibGFja2xpc3QnKTtcbnZhciBjbGFzc25hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxuZnVuY3Rpb24gaGFzQ2hpbGRyZW5XaXRoVmVydGljYWxGaWxsKGNoaWxkcmVuKSB7XG5cdHZhciByZXN1bHQgPSBmYWxzZTtcblxuXHRSZWFjdC5DaGlsZHJlbi5mb3JFYWNoKGNoaWxkcmVuLCBmdW5jdGlvbiAoYykge1xuXHRcdGlmIChyZXN1bHQpIHJldHVybjsgLy8gZWFybHktZXhpdFxuXHRcdGlmICghYykgcmV0dXJuO1xuXHRcdGlmICghYy50eXBlKSByZXR1cm47XG5cblx0XHRyZXN1bHQgPSAhIWMudHlwZS5zaG91bGRGaWxsVmVydGljYWxTcGFjZTtcblx0fSk7XG5cblx0cmV0dXJuIHJlc3VsdDtcbn1cblxudmFyIENvbnRhaW5lciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6ICdDb250YWluZXInLFxuXG5cdHByb3BUeXBlczoge1xuXHRcdGFsaWduOiBSZWFjdC5Qcm9wVHlwZXMub25lT2YoWydlbmQnLCAnY2VudGVyJywgJ3N0YXJ0J10pLFxuXHRcdGRpcmVjdGlvbjogUmVhY3QuUHJvcFR5cGVzLm9uZU9mKFsnY29sdW1uJywgJ3JvdyddKSxcblx0XHRmaWxsOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcblx0XHRncm93OiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcblx0XHRqdXN0aWZ5OiBSZWFjdC5Qcm9wVHlwZXMub25lT2ZUeXBlKFtSZWFjdC5Qcm9wVHlwZXMuYm9vbCwgUmVhY3QuUHJvcFR5cGVzLm9uZU9mKFsnZW5kJywgJ2NlbnRlcicsICdzdGFydCddKV0pLFxuXHRcdHNjcm9sbGFibGU6IFJlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoW1JlYWN0LlByb3BUeXBlcy5ib29sLCBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0XSlcblx0fSxcblx0Y29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuXHRcdGlmICh0aGlzLnByb3BzLnNjcm9sbGFibGUgJiYgdGhpcy5wcm9wcy5zY3JvbGxhYmxlLm1vdW50KSB7XG5cdFx0XHR0aGlzLnByb3BzLnNjcm9sbGFibGUubW91bnQodGhpcyk7XG5cdFx0fVxuXHR9LFxuXHRjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24gY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG5cdFx0aWYgKHRoaXMucHJvcHMuc2Nyb2xsYWJsZSAmJiB0aGlzLnByb3BzLnNjcm9sbGFibGUudW5tb3VudCkge1xuXHRcdFx0dGhpcy5wcm9wcy5zY3JvbGxhYmxlLnVubW91bnQodGhpcyk7XG5cdFx0fVxuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHR2YXIgZGlyZWN0aW9uID0gdGhpcy5wcm9wcy5kaXJlY3Rpb247XG5cdFx0aWYgKCFkaXJlY3Rpb24pIHtcblx0XHRcdGlmIChoYXNDaGlsZHJlbldpdGhWZXJ0aWNhbEZpbGwodGhpcy5wcm9wcy5jaGlsZHJlbikpIHtcblx0XHRcdFx0ZGlyZWN0aW9uID0gJ2NvbHVtbic7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dmFyIGZpbGwgPSB0aGlzLnByb3BzLmZpbGw7XG5cdFx0aWYgKGRpcmVjdGlvbiA9PT0gJ2NvbHVtbicgfHwgdGhpcy5wcm9wcy5zY3JvbGxhYmxlKSB7XG5cdFx0XHRmaWxsID0gdHJ1ZTtcblx0XHR9XG5cblx0XHR2YXIgYWxpZ24gPSB0aGlzLnByb3BzLmFsaWduO1xuXHRcdGlmIChkaXJlY3Rpb24gPT09ICdjb2x1bW4nICYmIGFsaWduID09PSAndG9wJykgYWxpZ24gPSAnc3RhcnQnO1xuXHRcdGlmIChkaXJlY3Rpb24gPT09ICdjb2x1bW4nICYmIGFsaWduID09PSAnYm90dG9tJykgYWxpZ24gPSAnZW5kJztcblx0XHRpZiAoZGlyZWN0aW9uID09PSAncm93JyAmJiBhbGlnbiA9PT0gJ2xlZnQnKSBhbGlnbiA9ICdzdGFydCc7XG5cdFx0aWYgKGRpcmVjdGlvbiA9PT0gJ3JvdycgJiYgYWxpZ24gPT09ICdyaWdodCcpIGFsaWduID0gJ2VuZCc7XG5cblx0XHR2YXIgY2xhc3NOYW1lID0gY2xhc3NuYW1lcyh0aGlzLnByb3BzLmNsYXNzTmFtZSwge1xuXHRcdFx0J0NvbnRhaW5lci0tZmlsbCc6IGZpbGwsXG5cdFx0XHQnQ29udGFpbmVyLS1kaXJlY3Rpb24tY29sdW1uJzogZGlyZWN0aW9uID09PSAnY29sdW1uJyxcblx0XHRcdCdDb250YWluZXItLWRpcmVjdGlvbi1yb3cnOiBkaXJlY3Rpb24gPT09ICdyb3cnLFxuXHRcdFx0J0NvbnRhaW5lci0tYWxpZ24tY2VudGVyJzogYWxpZ24gPT09ICdjZW50ZXInLFxuXHRcdFx0J0NvbnRhaW5lci0tYWxpZ24tc3RhcnQnOiBhbGlnbiA9PT0gJ3N0YXJ0Jyxcblx0XHRcdCdDb250YWluZXItLWFsaWduLWVuZCc6IGFsaWduID09PSAnZW5kJyxcblx0XHRcdCdDb250YWluZXItLWp1c3RpZnktY2VudGVyJzogdGhpcy5wcm9wcy5qdXN0aWZ5ID09PSAnY2VudGVyJyxcblx0XHRcdCdDb250YWluZXItLWp1c3RpZnktc3RhcnQnOiB0aGlzLnByb3BzLmp1c3RpZnkgPT09ICdzdGFydCcsXG5cdFx0XHQnQ29udGFpbmVyLS1qdXN0aWZ5LWVuZCc6IHRoaXMucHJvcHMuanVzdGlmeSA9PT0gJ2VuZCcsXG5cdFx0XHQnQ29udGFpbmVyLS1qdXN0aWZpZWQnOiB0aGlzLnByb3BzLmp1c3RpZnkgPT09IHRydWUsXG5cdFx0XHQnQ29udGFpbmVyLS1zY3JvbGxhYmxlJzogdGhpcy5wcm9wcy5zY3JvbGxhYmxlXG5cdFx0fSk7XG5cblx0XHR2YXIgcHJvcHMgPSBibGFja2xpc3QodGhpcy5wcm9wcywgJ2NsYXNzTmFtZScsICdkaXJlY3Rpb24nLCAnZmlsbCcsICdqdXN0aWZ5JywgJ3Njcm9sbGFibGUnKTtcblxuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0J2RpdicsXG5cdFx0XHRfZXh0ZW5kcyh7IGNsYXNzTmFtZTogY2xhc3NOYW1lIH0sIHByb3BzKSxcblx0XHRcdHRoaXMucHJvcHMuY2hpbGRyZW5cblx0XHQpO1xuXHR9XG59KTtcblxuZnVuY3Rpb24gaW5pdFNjcm9sbGFibGUoZGVmYXVsdFBvcykge1xuXHRpZiAoIWRlZmF1bHRQb3MpIHtcblx0XHRkZWZhdWx0UG9zID0ge307XG5cdH1cblx0dmFyIHBvcztcblx0dmFyIHNjcm9sbGFibGUgPSB7XG5cdFx0cmVzZXQ6IGZ1bmN0aW9uIHJlc2V0KCkge1xuXHRcdFx0cG9zID0geyBsZWZ0OiBkZWZhdWx0UG9zLmxlZnQgfHwgMCwgdG9wOiBkZWZhdWx0UG9zLnRvcCB8fCAwIH07XG5cdFx0fSxcblx0XHRnZXRQb3M6IGZ1bmN0aW9uIGdldFBvcygpIHtcblx0XHRcdHJldHVybiB7IGxlZnQ6IHBvcy5sZWZ0LCB0b3A6IHBvcy50b3AgfTtcblx0XHR9LFxuXHRcdG1vdW50OiBmdW5jdGlvbiBtb3VudChlbGVtZW50KSB7XG5cdFx0XHR2YXIgbm9kZSA9IFJlYWN0LmZpbmRET01Ob2RlKGVsZW1lbnQpO1xuXHRcdFx0bm9kZS5zY3JvbGxMZWZ0ID0gcG9zLmxlZnQ7XG5cdFx0XHRub2RlLnNjcm9sbFRvcCA9IHBvcy50b3A7XG5cdFx0fSxcblx0XHR1bm1vdW50OiBmdW5jdGlvbiB1bm1vdW50KGVsZW1lbnQpIHtcblx0XHRcdHZhciBub2RlID0gUmVhY3QuZmluZERPTU5vZGUoZWxlbWVudCk7XG5cdFx0XHRwb3MubGVmdCA9IG5vZGUuc2Nyb2xsTGVmdDtcblx0XHRcdHBvcy50b3AgPSBub2RlLnNjcm9sbFRvcDtcblx0XHR9XG5cdH07XG5cdHNjcm9sbGFibGUucmVzZXQoKTtcblx0cmV0dXJuIHNjcm9sbGFibGU7XG59XG5cbkNvbnRhaW5lci5pbml0U2Nyb2xsYWJsZSA9IGluaXRTY3JvbGxhYmxlO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBDb250YWluZXI7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJsYWNrbGlzdCAoc3JjKSB7XG4gIHZhciBjb3B5ID0ge30sIGZpbHRlciA9IGFyZ3VtZW50c1sxXVxuXG4gIGlmICh0eXBlb2YgZmlsdGVyID09PSAnc3RyaW5nJykge1xuICAgIGZpbHRlciA9IHt9XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGZpbHRlclthcmd1bWVudHNbaV1dID0gdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIGZvciAodmFyIGtleSBpbiBzcmMpIHtcbiAgICAvLyBibGFja2xpc3Q/XG4gICAgaWYgKGZpbHRlcltrZXldKSBjb250aW51ZVxuXG4gICAgY29weVtrZXldID0gc3JjW2tleV1cbiAgfVxuXG4gIHJldHVybiBjb3B5XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBsaXN0ZW5lcnMgPSBbXTtcblxuICByZXR1cm4ge1xuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICAgIGxpc3RlbmVycy5mb3JFYWNoKGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgICAgICB2YXIgZW1pdHRlciA9IGxpc3RlbmVyLmVtaXR0ZXI7XG4gICAgICAgIHZhciBldmVudE5hbWUgPSBsaXN0ZW5lci5ldmVudE5hbWU7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IGxpc3RlbmVyLmNhbGxiYWNrO1xuXG4gICAgICAgIHZhciByZW1vdmVMaXN0ZW5lciA9IGVtaXR0ZXIucmVtb3ZlTGlzdGVuZXIgfHwgZW1pdHRlci5yZW1vdmVFdmVudExpc3RlbmVyO1xuICAgICAgICByZW1vdmVMaXN0ZW5lci5jYWxsKGVtaXR0ZXIsIGV2ZW50TmFtZSwgY2FsbGJhY2spO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIHdhdGNoOiBmdW5jdGlvbiB3YXRjaChlbWl0dGVyLCBldmVudE5hbWUsIGNhbGxiYWNrKSB7XG4gICAgICBsaXN0ZW5lcnMucHVzaCh7XG4gICAgICAgIGVtaXR0ZXI6IGVtaXR0ZXIsXG4gICAgICAgIGV2ZW50TmFtZTogZXZlbnROYW1lLFxuICAgICAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgYWRkTGlzdGVuZXIgPSBlbWl0dGVyLmFkZExpc3RlbmVyIHx8IGVtaXR0ZXIuYWRkRXZlbnRMaXN0ZW5lcjtcbiAgICAgIGFkZExpc3RlbmVyLmNhbGwoZW1pdHRlciwgZXZlbnROYW1lLCBjYWxsYmFjayk7XG4gICAgfSxcblxuICAgIHVud2F0Y2g6IGZ1bmN0aW9uIHVud2F0Y2goZW1pdHRlciwgZXZlbnROYW1lLCBjYWxsYmFjaykge1xuICAgICAgbGlzdGVuZXJzID0gbGlzdGVuZXJzLmZpbHRlcihmdW5jdGlvbiAobGlzdGVuZXIpIHtcbiAgICAgICAgcmV0dXJuIGxpc3RlbmVyLmVtaXR0ZXIgPT09IGVtaXR0ZXIgJiYgbGlzdGVuZXIuZXZlbnROYW1lID09PSBldmVudE5hbWUgJiYgbGlzdGVuZXIuY2FsbGJhY2sgPT09IGNhbGxiYWNrO1xuICAgICAgfSk7XG5cbiAgICAgIHZhciByZW1vdmVMaXN0ZW5lciA9IGVtaXR0ZXIucmVtb3ZlTGlzdGVuZXIgfHwgZW1pdHRlci5yZW1vdmVFdmVudExpc3RlbmVyO1xuICAgICAgcmVtb3ZlTGlzdGVuZXIuY2FsbChlbWl0dGVyLCBldmVudE5hbWUsIGNhbGxiYWNrKTtcbiAgICB9XG4gIH07XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxuZnVuY3Rpb24gZ2V0VG91Y2hQcm9wcyh0b3VjaCkge1xuXHRpZiAoIXRvdWNoKSByZXR1cm4ge307XG5cdHJldHVybiB7XG5cdFx0cGFnZVg6IHRvdWNoLnBhZ2VYLFxuXHRcdHBhZ2VZOiB0b3VjaC5wYWdlWSxcblx0XHRjbGllbnRYOiB0b3VjaC5jbGllbnRYLFxuXHRcdGNsaWVudFk6IHRvdWNoLmNsaWVudFlcblx0fTtcbn1cblxuZnVuY3Rpb24gaXNEYXRhT3JBcmlhUHJvcChrZXkpIHtcblx0cmV0dXJuIGtleS5pbmRleE9mKCdkYXRhLScpID09PSAwIHx8IGtleS5pbmRleE9mKCdhcmlhLScpID09PSAwO1xufVxuXG5mdW5jdGlvbiBnZXRQaW5jaFByb3BzKHRvdWNoZXMpIHtcblx0cmV0dXJuIHtcblx0XHR0b3VjaGVzOiBBcnJheS5wcm90b3R5cGUubWFwLmNhbGwodG91Y2hlcywgZnVuY3Rpb24gY29weVRvdWNoKHRvdWNoKSB7XG5cdFx0XHRyZXR1cm4geyBpZGVudGlmaWVyOiB0b3VjaC5pZGVudGlmaWVyLCBwYWdlWDogdG91Y2gucGFnZVgsIHBhZ2VZOiB0b3VjaC5wYWdlWSB9O1xuXHRcdH0pLFxuXHRcdGNlbnRlcjogeyB4OiAodG91Y2hlc1swXS5wYWdlWCArIHRvdWNoZXNbMV0ucGFnZVgpIC8gMiwgeTogKHRvdWNoZXNbMF0ucGFnZVkgKyB0b3VjaGVzWzFdLnBhZ2VZKSAvIDIgfSxcblx0XHRhbmdsZTogTWF0aC5hdGFuKCkgKiAodG91Y2hlc1sxXS5wYWdlWSAtIHRvdWNoZXNbMF0ucGFnZVkpIC8gKHRvdWNoZXNbMV0ucGFnZVggLSB0b3VjaGVzWzBdLnBhZ2VYKSAqIDE4MCAvIE1hdGguUEksXG5cdFx0ZGlzdGFuY2U6IE1hdGguc3FydChNYXRoLnBvdyhNYXRoLmFicyh0b3VjaGVzWzFdLnBhZ2VYIC0gdG91Y2hlc1swXS5wYWdlWCksIDIpICsgTWF0aC5wb3coTWF0aC5hYnModG91Y2hlc1sxXS5wYWdlWSAtIHRvdWNoZXNbMF0ucGFnZVkpLCAyKSlcblx0fTtcbn1cblxudmFyIFRPVUNIX1NUWUxFUyA9IHtcblx0V2Via2l0VGFwSGlnaGxpZ2h0Q29sb3I6ICdyZ2JhKDAsMCwwLDApJyxcblx0V2Via2l0VG91Y2hDYWxsb3V0OiAnbm9uZScsXG5cdFdlYmtpdFVzZXJTZWxlY3Q6ICdub25lJyxcblx0S2h0bWxVc2VyU2VsZWN0OiAnbm9uZScsXG5cdE1velVzZXJTZWxlY3Q6ICdub25lJyxcblx0bXNVc2VyU2VsZWN0OiAnbm9uZScsXG5cdHVzZXJTZWxlY3Q6ICdub25lJyxcblx0Y3Vyc29yOiAncG9pbnRlcidcbn07XG5cbi8qKlxuICogVGFwcGFibGUgTWl4aW5cbiAqID09PT09PT09PT09PT09XG4gKi9cblxudmFyIE1peGluID0ge1xuXHRwcm9wVHlwZXM6IHtcblx0XHRtb3ZlVGhyZXNob2xkOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLCAvLyBwaXhlbHMgdG8gbW92ZSBiZWZvcmUgY2FuY2VsbGluZyB0YXBcblx0XHRhY3RpdmVEZWxheTogUmVhY3QuUHJvcFR5cGVzLm51bWJlciwgLy8gbXMgdG8gd2FpdCBiZWZvcmUgYWRkaW5nIHRoZSBgLWFjdGl2ZWAgY2xhc3Ncblx0XHRwcmVzc0RlbGF5OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLCAvLyBtcyB0byB3YWl0IGJlZm9yZSBkZXRlY3RpbmcgYSBwcmVzc1xuXHRcdHByZXNzTW92ZVRocmVzaG9sZDogUmVhY3QuUHJvcFR5cGVzLm51bWJlciwgLy8gcGl4ZWxzIHRvIG1vdmUgYmVmb3JlIGNhbmNlbGxpbmcgcHJlc3Ncblx0XHRwcmV2ZW50RGVmYXVsdDogUmVhY3QuUHJvcFR5cGVzLmJvb2wsIC8vIHdoZXRoZXIgdG8gcHJldmVudERlZmF1bHQgb24gYWxsIGV2ZW50c1xuXHRcdHN0b3BQcm9wYWdhdGlvbjogUmVhY3QuUHJvcFR5cGVzLmJvb2wsIC8vIHdoZXRoZXIgdG8gc3RvcFByb3BhZ2F0aW9uIG9uIGFsbCBldmVudHNcblxuXHRcdG9uVGFwOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYywgLy8gZmlyZXMgd2hlbiBhIHRhcCBpcyBkZXRlY3RlZFxuXHRcdG9uUHJlc3M6IFJlYWN0LlByb3BUeXBlcy5mdW5jLCAvLyBmaXJlcyB3aGVuIGEgcHJlc3MgaXMgZGV0ZWN0ZWRcblx0XHRvblRvdWNoU3RhcnQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLCAvLyBwYXNzLXRocm91Z2ggdG91Y2ggZXZlbnRcblx0XHRvblRvdWNoTW92ZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsIC8vIHBhc3MtdGhyb3VnaCB0b3VjaCBldmVudFxuXHRcdG9uVG91Y2hFbmQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLCAvLyBwYXNzLXRocm91Z2ggdG91Y2ggZXZlbnRcblx0XHRvbk1vdXNlRG93bjogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsIC8vIHBhc3MtdGhyb3VnaCBtb3VzZSBldmVudFxuXHRcdG9uTW91c2VVcDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsIC8vIHBhc3MtdGhyb3VnaCBtb3VzZSBldmVudFxuXHRcdG9uTW91c2VNb3ZlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYywgLy8gcGFzcy10aHJvdWdoIG1vdXNlIGV2ZW50XG5cdFx0b25Nb3VzZU91dDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsIC8vIHBhc3MtdGhyb3VnaCBtb3VzZSBldmVudFxuXG5cdFx0b25QaW5jaFN0YXJ0OiBSZWFjdC5Qcm9wVHlwZXMuZnVuYywgLy8gZmlyZXMgd2hlbiBhIHBpbmNoIGdlc3R1cmUgaXMgc3RhcnRlZFxuXHRcdG9uUGluY2hNb3ZlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYywgLy8gZmlyZXMgb24gZXZlcnkgdG91Y2gtbW92ZSB3aGVuIGEgcGluY2ggYWN0aW9uIGlzIGFjdGl2ZVxuXHRcdG9uUGluY2hFbmQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jIC8vIGZpcmVzIHdoZW4gYSBwaW5jaCBhY3Rpb24gZW5kc1xuXHR9LFxuXG5cdGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24gZ2V0RGVmYXVsdFByb3BzKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRhY3RpdmVEZWxheTogMCxcblx0XHRcdG1vdmVUaHJlc2hvbGQ6IDEwMCxcblx0XHRcdHByZXNzRGVsYXk6IDEwMDAsXG5cdFx0XHRwcmVzc01vdmVUaHJlc2hvbGQ6IDVcblx0XHR9O1xuXHR9LFxuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRpc0FjdGl2ZTogZmFsc2UsXG5cdFx0XHR0b3VjaEFjdGl2ZTogZmFsc2UsXG5cdFx0XHRwaW5jaEFjdGl2ZTogZmFsc2Vcblx0XHR9O1xuXHR9LFxuXG5cdGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcblx0XHR0aGlzLmNsZWFudXBTY3JvbGxEZXRlY3Rpb24oKTtcblx0XHR0aGlzLmNhbmNlbFByZXNzRGV0ZWN0aW9uKCk7XG5cdFx0dGhpcy5jbGVhckFjdGl2ZVRpbWVvdXQoKTtcblx0fSxcblxuXHRwcm9jZXNzRXZlbnQ6IGZ1bmN0aW9uIHByb2Nlc3NFdmVudChldmVudCkge1xuXHRcdGlmICh0aGlzLnByb3BzLnByZXZlbnREZWZhdWx0KSBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGlmICh0aGlzLnByb3BzLnN0b3BQcm9wYWdhdGlvbikgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdH0sXG5cblx0b25Ub3VjaFN0YXJ0OiBmdW5jdGlvbiBvblRvdWNoU3RhcnQoZXZlbnQpIHtcblx0XHRpZiAodGhpcy5wcm9wcy5vblRvdWNoU3RhcnQgJiYgdGhpcy5wcm9wcy5vblRvdWNoU3RhcnQoZXZlbnQpID09PSBmYWxzZSkgcmV0dXJuO1xuXHRcdHRoaXMucHJvY2Vzc0V2ZW50KGV2ZW50KTtcblx0XHR3aW5kb3cuX2Jsb2NrTW91c2VFdmVudHMgPSB0cnVlO1xuXHRcdGlmIChldmVudC50b3VjaGVzLmxlbmd0aCA9PT0gMSkge1xuXHRcdFx0dGhpcy5faW5pdGlhbFRvdWNoID0gdGhpcy5fbGFzdFRvdWNoID0gZ2V0VG91Y2hQcm9wcyhldmVudC50b3VjaGVzWzBdKTtcblx0XHRcdHRoaXMuaW5pdFNjcm9sbERldGVjdGlvbigpO1xuXHRcdFx0dGhpcy5pbml0UHJlc3NEZXRlY3Rpb24oZXZlbnQsIHRoaXMuZW5kVG91Y2gpO1xuXHRcdFx0dGhpcy5fYWN0aXZlVGltZW91dCA9IHNldFRpbWVvdXQodGhpcy5tYWtlQWN0aXZlLCB0aGlzLnByb3BzLmFjdGl2ZURlbGF5KTtcblx0XHR9IGVsc2UgaWYgKCh0aGlzLnByb3BzLm9uUGluY2hTdGFydCB8fCB0aGlzLnByb3BzLm9uUGluY2hNb3ZlIHx8IHRoaXMucHJvcHMub25QaW5jaEVuZCkgJiYgZXZlbnQudG91Y2hlcy5sZW5ndGggPT09IDIpIHtcblx0XHRcdHRoaXMub25QaW5jaFN0YXJ0KGV2ZW50KTtcblx0XHR9XG5cdH0sXG5cblx0bWFrZUFjdGl2ZTogZnVuY3Rpb24gbWFrZUFjdGl2ZSgpIHtcblx0XHRpZiAoIXRoaXMuaXNNb3VudGVkKCkpIHJldHVybjtcblx0XHR0aGlzLmNsZWFyQWN0aXZlVGltZW91dCgpO1xuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0aXNBY3RpdmU6IHRydWVcblx0XHR9KTtcblx0fSxcblxuXHRjbGVhckFjdGl2ZVRpbWVvdXQ6IGZ1bmN0aW9uIGNsZWFyQWN0aXZlVGltZW91dCgpIHtcblx0XHRjbGVhclRpbWVvdXQodGhpcy5fYWN0aXZlVGltZW91dCk7XG5cdFx0dGhpcy5fYWN0aXZlVGltZW91dCA9IGZhbHNlO1xuXHR9LFxuXG5cdG9uUGluY2hTdGFydDogZnVuY3Rpb24gb25QaW5jaFN0YXJ0KGV2ZW50KSB7XG5cdFx0Ly8gaW4gY2FzZSB0aGUgdHdvIHRvdWNoZXMgZGlkbid0IHN0YXJ0IGV4YWN0bHkgYXQgdGhlIHNhbWUgdGltZVxuXHRcdGlmICh0aGlzLl9pbml0aWFsVG91Y2gpIHtcblx0XHRcdHRoaXMuZW5kVG91Y2goKTtcblx0XHR9XG5cdFx0dmFyIHRvdWNoZXMgPSBldmVudC50b3VjaGVzO1xuXHRcdHRoaXMuX2luaXRpYWxQaW5jaCA9IGdldFBpbmNoUHJvcHModG91Y2hlcyk7XG5cdFx0dGhpcy5faW5pdGlhbFBpbmNoID0gX2V4dGVuZHModGhpcy5faW5pdGlhbFBpbmNoLCB7XG5cdFx0XHRkaXNwbGFjZW1lbnQ6IHsgeDogMCwgeTogMCB9LFxuXHRcdFx0ZGlzcGxhY2VtZW50VmVsb2NpdHk6IHsgeDogMCwgeTogMCB9LFxuXHRcdFx0cm90YXRpb246IDAsXG5cdFx0XHRyb3RhdGlvblZlbG9jaXR5OiAwLFxuXHRcdFx0em9vbTogMSxcblx0XHRcdHpvb21WZWxvY2l0eTogMCxcblx0XHRcdHRpbWU6IERhdGUubm93KClcblx0XHR9KTtcblx0XHR0aGlzLl9sYXN0UGluY2ggPSB0aGlzLl9pbml0aWFsUGluY2g7XG5cdFx0dGhpcy5wcm9wcy5vblBpbmNoU3RhcnQgJiYgdGhpcy5wcm9wcy5vblBpbmNoU3RhcnQodGhpcy5faW5pdGlhbFBpbmNoLCBldmVudCk7XG5cdH0sXG5cblx0b25QaW5jaE1vdmU6IGZ1bmN0aW9uIG9uUGluY2hNb3ZlKGV2ZW50KSB7XG5cdFx0aWYgKHRoaXMuX2luaXRpYWxUb3VjaCkge1xuXHRcdFx0dGhpcy5lbmRUb3VjaCgpO1xuXHRcdH1cblx0XHR2YXIgdG91Y2hlcyA9IGV2ZW50LnRvdWNoZXM7XG5cdFx0aWYgKHRvdWNoZXMubGVuZ3RoICE9PSAyKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5vblBpbmNoRW5kKGV2ZW50KSAvLyBiYWlsIG91dCBiZWZvcmUgZGlzYXN0ZXJcblx0XHRcdDtcblx0XHR9XG5cblx0XHR2YXIgY3VycmVudFBpbmNoID0gdG91Y2hlc1swXS5pZGVudGlmaWVyID09PSB0aGlzLl9pbml0aWFsUGluY2gudG91Y2hlc1swXS5pZGVudGlmaWVyICYmIHRvdWNoZXNbMV0uaWRlbnRpZmllciA9PT0gdGhpcy5faW5pdGlhbFBpbmNoLnRvdWNoZXNbMV0uaWRlbnRpZmllciA/IGdldFBpbmNoUHJvcHModG91Y2hlcykgLy8gdGhlIHRvdWNoZXMgYXJlIGluIHRoZSBjb3JyZWN0IG9yZGVyXG5cdFx0OiB0b3VjaGVzWzFdLmlkZW50aWZpZXIgPT09IHRoaXMuX2luaXRpYWxQaW5jaC50b3VjaGVzWzBdLmlkZW50aWZpZXIgJiYgdG91Y2hlc1swXS5pZGVudGlmaWVyID09PSB0aGlzLl9pbml0aWFsUGluY2gudG91Y2hlc1sxXS5pZGVudGlmaWVyID8gZ2V0UGluY2hQcm9wcyh0b3VjaGVzLnJldmVyc2UoKSkgLy8gdGhlIHRvdWNoZXMgaGF2ZSBzb21laG93IGNoYW5nZWQgb3JkZXJcblx0XHQ6IGdldFBpbmNoUHJvcHModG91Y2hlcyk7IC8vIHNvbWV0aGluZyBpcyB3cm9uZywgYnV0IHdlIHN0aWxsIGhhdmUgdHdvIHRvdWNoLXBvaW50cywgc28gd2UgdHJ5IG5vdCB0byBmYWlsXG5cblx0XHRjdXJyZW50UGluY2guZGlzcGxhY2VtZW50ID0ge1xuXHRcdFx0eDogY3VycmVudFBpbmNoLmNlbnRlci54IC0gdGhpcy5faW5pdGlhbFBpbmNoLmNlbnRlci54LFxuXHRcdFx0eTogY3VycmVudFBpbmNoLmNlbnRlci55IC0gdGhpcy5faW5pdGlhbFBpbmNoLmNlbnRlci55XG5cdFx0fTtcblxuXHRcdGN1cnJlbnRQaW5jaC50aW1lID0gRGF0ZS5ub3coKTtcblx0XHR2YXIgdGltZVNpbmNlTGFzdFBpbmNoID0gY3VycmVudFBpbmNoLnRpbWUgLSB0aGlzLl9sYXN0UGluY2gudGltZTtcblxuXHRcdGN1cnJlbnRQaW5jaC5kaXNwbGFjZW1lbnRWZWxvY2l0eSA9IHtcblx0XHRcdHg6IChjdXJyZW50UGluY2guZGlzcGxhY2VtZW50LnggLSB0aGlzLl9sYXN0UGluY2guZGlzcGxhY2VtZW50LngpIC8gdGltZVNpbmNlTGFzdFBpbmNoLFxuXHRcdFx0eTogKGN1cnJlbnRQaW5jaC5kaXNwbGFjZW1lbnQueSAtIHRoaXMuX2xhc3RQaW5jaC5kaXNwbGFjZW1lbnQueSkgLyB0aW1lU2luY2VMYXN0UGluY2hcblx0XHR9O1xuXG5cdFx0Y3VycmVudFBpbmNoLnJvdGF0aW9uID0gY3VycmVudFBpbmNoLmFuZ2xlIC0gdGhpcy5faW5pdGlhbFBpbmNoLmFuZ2xlO1xuXHRcdGN1cnJlbnRQaW5jaC5yb3RhdGlvblZlbG9jaXR5ID0gY3VycmVudFBpbmNoLnJvdGF0aW9uIC0gdGhpcy5fbGFzdFBpbmNoLnJvdGF0aW9uIC8gdGltZVNpbmNlTGFzdFBpbmNoO1xuXG5cdFx0Y3VycmVudFBpbmNoLnpvb20gPSBjdXJyZW50UGluY2guZGlzdGFuY2UgLyB0aGlzLl9pbml0aWFsUGluY2guZGlzdGFuY2U7XG5cdFx0Y3VycmVudFBpbmNoLnpvb21WZWxvY2l0eSA9IChjdXJyZW50UGluY2guem9vbSAtIHRoaXMuX2xhc3RQaW5jaC56b29tKSAvIHRpbWVTaW5jZUxhc3RQaW5jaDtcblxuXHRcdHRoaXMucHJvcHMub25QaW5jaE1vdmUgJiYgdGhpcy5wcm9wcy5vblBpbmNoTW92ZShjdXJyZW50UGluY2gsIGV2ZW50KTtcblxuXHRcdHRoaXMuX2xhc3RQaW5jaCA9IGN1cnJlbnRQaW5jaDtcblx0fSxcblxuXHRvblBpbmNoRW5kOiBmdW5jdGlvbiBvblBpbmNoRW5kKGV2ZW50KSB7XG5cdFx0Ly8gVE9ETyB1c2UgaGVscGVyIHRvIG9yZGVyIHRvdWNoZXMgYnkgaWRlbnRpZmllciBhbmQgdXNlIGFjdHVhbCB2YWx1ZXMgb24gdG91Y2hFbmQuXG5cdFx0dmFyIGN1cnJlbnRQaW5jaCA9IF9leHRlbmRzKHt9LCB0aGlzLl9sYXN0UGluY2gpO1xuXHRcdGN1cnJlbnRQaW5jaC50aW1lID0gRGF0ZS5ub3coKTtcblxuXHRcdGlmIChjdXJyZW50UGluY2gudGltZSAtIHRoaXMuX2xhc3RQaW5jaC50aW1lID4gMTYpIHtcblx0XHRcdGN1cnJlbnRQaW5jaC5kaXNwbGFjZW1lbnRWZWxvY2l0eSA9IDA7XG5cdFx0XHRjdXJyZW50UGluY2gucm90YXRpb25WZWxvY2l0eSA9IDA7XG5cdFx0XHRjdXJyZW50UGluY2guem9vbVZlbG9jaXR5ID0gMDtcblx0XHR9XG5cblx0XHR0aGlzLnByb3BzLm9uUGluY2hFbmQgJiYgdGhpcy5wcm9wcy5vblBpbmNoRW5kKGN1cnJlbnRQaW5jaCwgZXZlbnQpO1xuXG5cdFx0dGhpcy5faW5pdGlhbFBpbmNoID0gdGhpcy5fbGFzdFBpbmNoID0gbnVsbDtcblxuXHRcdC8vIElmIG9uZSBmaW5nZXIgaXMgc3RpbGwgb24gc2NyZWVuLCBpdCBzaG91bGQgc3RhcnQgYSBuZXcgdG91Y2ggZXZlbnQgZm9yIHN3aXBpbmcgZXRjXG5cdFx0Ly8gQnV0IGl0IHNob3VsZCBuZXZlciBmaXJlIGFuIG9uVGFwIG9yIG9uUHJlc3MgZXZlbnQuXG5cdFx0Ly8gU2luY2UgdGhlcmUgaXMgbm8gc3VwcG9ydCBzd2lwZXMgeWV0LCB0aGlzIHNob3VsZCBiZSBkaXNyZWdhcmRlZCBmb3Igbm93XG5cdFx0Ly8gaWYgKGV2ZW50LnRvdWNoZXMubGVuZ3RoID09PSAxKSB7XG5cdFx0Ly8gXHR0aGlzLm9uVG91Y2hTdGFydChldmVudCk7XG5cdFx0Ly8gfVxuXHR9LFxuXG5cdGluaXRTY3JvbGxEZXRlY3Rpb246IGZ1bmN0aW9uIGluaXRTY3JvbGxEZXRlY3Rpb24oKSB7XG5cdFx0dGhpcy5fc2Nyb2xsUG9zID0geyB0b3A6IDAsIGxlZnQ6IDAgfTtcblx0XHR0aGlzLl9zY3JvbGxQYXJlbnRzID0gW107XG5cdFx0dGhpcy5fc2Nyb2xsUGFyZW50UG9zID0gW107XG5cdFx0dmFyIG5vZGUgPSB0aGlzLmdldERPTU5vZGUoKTtcblx0XHR3aGlsZSAobm9kZSkge1xuXHRcdFx0aWYgKG5vZGUuc2Nyb2xsSGVpZ2h0ID4gbm9kZS5vZmZzZXRIZWlnaHQgfHwgbm9kZS5zY3JvbGxXaWR0aCA+IG5vZGUub2Zmc2V0V2lkdGgpIHtcblx0XHRcdFx0dGhpcy5fc2Nyb2xsUGFyZW50cy5wdXNoKG5vZGUpO1xuXHRcdFx0XHR0aGlzLl9zY3JvbGxQYXJlbnRQb3MucHVzaChub2RlLnNjcm9sbFRvcCArIG5vZGUuc2Nyb2xsTGVmdCk7XG5cdFx0XHRcdHRoaXMuX3Njcm9sbFBvcy50b3AgKz0gbm9kZS5zY3JvbGxUb3A7XG5cdFx0XHRcdHRoaXMuX3Njcm9sbFBvcy5sZWZ0ICs9IG5vZGUuc2Nyb2xsTGVmdDtcblx0XHRcdH1cblx0XHRcdG5vZGUgPSBub2RlLnBhcmVudE5vZGU7XG5cdFx0fVxuXHR9LFxuXG5cdGNhbGN1bGF0ZU1vdmVtZW50OiBmdW5jdGlvbiBjYWxjdWxhdGVNb3ZlbWVudCh0b3VjaCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHR4OiBNYXRoLmFicyh0b3VjaC5jbGllbnRYIC0gdGhpcy5faW5pdGlhbFRvdWNoLmNsaWVudFgpLFxuXHRcdFx0eTogTWF0aC5hYnModG91Y2guY2xpZW50WSAtIHRoaXMuX2luaXRpYWxUb3VjaC5jbGllbnRZKVxuXHRcdH07XG5cdH0sXG5cblx0ZGV0ZWN0U2Nyb2xsOiBmdW5jdGlvbiBkZXRlY3RTY3JvbGwoKSB7XG5cdFx0dmFyIGN1cnJlbnRTY3JvbGxQb3MgPSB7IHRvcDogMCwgbGVmdDogMCB9O1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fc2Nyb2xsUGFyZW50cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0Y3VycmVudFNjcm9sbFBvcy50b3AgKz0gdGhpcy5fc2Nyb2xsUGFyZW50c1tpXS5zY3JvbGxUb3A7XG5cdFx0XHRjdXJyZW50U2Nyb2xsUG9zLmxlZnQgKz0gdGhpcy5fc2Nyb2xsUGFyZW50c1tpXS5zY3JvbGxMZWZ0O1xuXHRcdH1cblx0XHRyZXR1cm4gIShjdXJyZW50U2Nyb2xsUG9zLnRvcCA9PT0gdGhpcy5fc2Nyb2xsUG9zLnRvcCAmJiBjdXJyZW50U2Nyb2xsUG9zLmxlZnQgPT09IHRoaXMuX3Njcm9sbFBvcy5sZWZ0KTtcblx0fSxcblxuXHRjbGVhbnVwU2Nyb2xsRGV0ZWN0aW9uOiBmdW5jdGlvbiBjbGVhbnVwU2Nyb2xsRGV0ZWN0aW9uKCkge1xuXHRcdHRoaXMuX3Njcm9sbFBhcmVudHMgPSB1bmRlZmluZWQ7XG5cdFx0dGhpcy5fc2Nyb2xsUG9zID0gdW5kZWZpbmVkO1xuXHR9LFxuXG5cdGluaXRQcmVzc0RldGVjdGlvbjogZnVuY3Rpb24gaW5pdFByZXNzRGV0ZWN0aW9uKGV2ZW50LCBjYWxsYmFjaykge1xuXHRcdGlmICghdGhpcy5wcm9wcy5vblByZXNzKSByZXR1cm47XG5cdFx0dGhpcy5fcHJlc3NUaW1lb3V0ID0gc2V0VGltZW91dCgoZnVuY3Rpb24gKCkge1xuXHRcdFx0dGhpcy5wcm9wcy5vblByZXNzKGV2ZW50KTtcblx0XHRcdGNhbGxiYWNrKCk7XG5cdFx0fSkuYmluZCh0aGlzKSwgdGhpcy5wcm9wcy5wcmVzc0RlbGF5KTtcblx0fSxcblxuXHRjYW5jZWxQcmVzc0RldGVjdGlvbjogZnVuY3Rpb24gY2FuY2VsUHJlc3NEZXRlY3Rpb24oKSB7XG5cdFx0Y2xlYXJUaW1lb3V0KHRoaXMuX3ByZXNzVGltZW91dCk7XG5cdH0sXG5cblx0b25Ub3VjaE1vdmU6IGZ1bmN0aW9uIG9uVG91Y2hNb3ZlKGV2ZW50KSB7XG5cdFx0aWYgKHRoaXMuX2luaXRpYWxUb3VjaCkge1xuXHRcdFx0dGhpcy5wcm9jZXNzRXZlbnQoZXZlbnQpO1xuXG5cdFx0XHRpZiAodGhpcy5kZXRlY3RTY3JvbGwoKSkgcmV0dXJuIHRoaXMuZW5kVG91Y2goZXZlbnQpO1xuXG5cdFx0XHR0aGlzLnByb3BzLm9uVG91Y2hNb3ZlICYmIHRoaXMucHJvcHMub25Ub3VjaE1vdmUoZXZlbnQpO1xuXHRcdFx0dGhpcy5fbGFzdFRvdWNoID0gZ2V0VG91Y2hQcm9wcyhldmVudC50b3VjaGVzWzBdKTtcblx0XHRcdHZhciBtb3ZlbWVudCA9IHRoaXMuY2FsY3VsYXRlTW92ZW1lbnQodGhpcy5fbGFzdFRvdWNoKTtcblx0XHRcdGlmIChtb3ZlbWVudC54ID4gdGhpcy5wcm9wcy5wcmVzc01vdmVUaHJlc2hvbGQgfHwgbW92ZW1lbnQueSA+IHRoaXMucHJvcHMucHJlc3NNb3ZlVGhyZXNob2xkKSB7XG5cdFx0XHRcdHRoaXMuY2FuY2VsUHJlc3NEZXRlY3Rpb24oKTtcblx0XHRcdH1cblx0XHRcdGlmIChtb3ZlbWVudC54ID4gdGhpcy5wcm9wcy5tb3ZlVGhyZXNob2xkIHx8IG1vdmVtZW50LnkgPiB0aGlzLnByb3BzLm1vdmVUaHJlc2hvbGQpIHtcblx0XHRcdFx0aWYgKHRoaXMuc3RhdGUuaXNBY3RpdmUpIHtcblx0XHRcdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0XHRcdGlzQWN0aXZlOiBmYWxzZVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHRoaXMuX2FjdGl2ZVRpbWVvdXQpIHtcblx0XHRcdFx0XHR0aGlzLmNsZWFyQWN0aXZlVGltZW91dCgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAoIXRoaXMuc3RhdGUuaXNBY3RpdmUgJiYgIXRoaXMuX2FjdGl2ZVRpbWVvdXQpIHtcblx0XHRcdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0XHRcdGlzQWN0aXZlOiB0cnVlXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKHRoaXMuX2luaXRpYWxQaW5jaCAmJiBldmVudC50b3VjaGVzLmxlbmd0aCA9PT0gMikge1xuXHRcdFx0dGhpcy5vblBpbmNoTW92ZShldmVudCk7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdH1cblx0fSxcblxuXHRvblRvdWNoRW5kOiBmdW5jdGlvbiBvblRvdWNoRW5kKGV2ZW50KSB7XG5cdFx0dmFyIF90aGlzID0gdGhpcztcblxuXHRcdGlmICh0aGlzLl9pbml0aWFsVG91Y2gpIHtcblx0XHRcdHRoaXMucHJvY2Vzc0V2ZW50KGV2ZW50KTtcblx0XHRcdHZhciBhZnRlckVuZFRvdWNoO1xuXHRcdFx0dmFyIG1vdmVtZW50ID0gdGhpcy5jYWxjdWxhdGVNb3ZlbWVudCh0aGlzLl9sYXN0VG91Y2gpO1xuXHRcdFx0aWYgKG1vdmVtZW50LnggPD0gdGhpcy5wcm9wcy5tb3ZlVGhyZXNob2xkICYmIG1vdmVtZW50LnkgPD0gdGhpcy5wcm9wcy5tb3ZlVGhyZXNob2xkICYmIHRoaXMucHJvcHMub25UYXApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0YWZ0ZXJFbmRUb3VjaCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHR2YXIgZmluYWxQYXJlbnRTY3JvbGxQb3MgPSBfdGhpcy5fc2Nyb2xsUGFyZW50cy5tYXAoZnVuY3Rpb24gKG5vZGUpIHtcblx0XHRcdFx0XHRcdHJldHVybiBub2RlLnNjcm9sbFRvcCArIG5vZGUuc2Nyb2xsTGVmdDtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR2YXIgc3RvcHBlZE1vbWVudHVtU2Nyb2xsID0gX3RoaXMuX3Njcm9sbFBhcmVudFBvcy5zb21lKGZ1bmN0aW9uIChlbmQsIGkpIHtcblx0XHRcdFx0XHRcdHJldHVybiBlbmQgIT09IGZpbmFsUGFyZW50U2Nyb2xsUG9zW2ldO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdGlmICghc3RvcHBlZE1vbWVudHVtU2Nyb2xsKSB7XG5cdFx0XHRcdFx0XHRfdGhpcy5wcm9wcy5vblRhcChldmVudCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5lbmRUb3VjaChldmVudCwgYWZ0ZXJFbmRUb3VjaCk7XG5cdFx0fSBlbHNlIGlmICh0aGlzLl9pbml0aWFsUGluY2ggJiYgZXZlbnQudG91Y2hlcy5sZW5ndGggKyBldmVudC5jaGFuZ2VkVG91Y2hlcy5sZW5ndGggPT09IDIpIHtcblx0XHRcdHRoaXMub25QaW5jaEVuZChldmVudCk7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdH1cblx0fSxcblxuXHRlbmRUb3VjaDogZnVuY3Rpb24gZW5kVG91Y2goZXZlbnQsIGNhbGxiYWNrKSB7XG5cdFx0dGhpcy5jYW5jZWxQcmVzc0RldGVjdGlvbigpO1xuXHRcdHRoaXMuY2xlYXJBY3RpdmVUaW1lb3V0KCk7XG5cdFx0aWYgKGV2ZW50ICYmIHRoaXMucHJvcHMub25Ub3VjaEVuZCkge1xuXHRcdFx0dGhpcy5wcm9wcy5vblRvdWNoRW5kKGV2ZW50KTtcblx0XHR9XG5cdFx0dGhpcy5faW5pdGlhbFRvdWNoID0gbnVsbDtcblx0XHR0aGlzLl9sYXN0VG91Y2ggPSBudWxsO1xuXHRcdGlmIChjYWxsYmFjaykge1xuXHRcdFx0Y2FsbGJhY2soKTtcblx0XHR9XG5cdFx0aWYgKHRoaXMuc3RhdGUuaXNBY3RpdmUpIHtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRpc0FjdGl2ZTogZmFsc2Vcblx0XHRcdH0pO1xuXHRcdH1cblx0fSxcblxuXHRvbk1vdXNlRG93bjogZnVuY3Rpb24gb25Nb3VzZURvd24oZXZlbnQpIHtcblx0XHRpZiAod2luZG93Ll9ibG9ja01vdXNlRXZlbnRzKSB7XG5cdFx0XHR3aW5kb3cuX2Jsb2NrTW91c2VFdmVudHMgPSBmYWxzZTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0aWYgKHRoaXMucHJvcHMub25Nb3VzZURvd24gJiYgdGhpcy5wcm9wcy5vbk1vdXNlRG93bihldmVudCkgPT09IGZhbHNlKSByZXR1cm47XG5cdFx0dGhpcy5wcm9jZXNzRXZlbnQoZXZlbnQpO1xuXHRcdHRoaXMuaW5pdFByZXNzRGV0ZWN0aW9uKGV2ZW50LCB0aGlzLmVuZE1vdXNlRXZlbnQpO1xuXHRcdHRoaXMuX21vdXNlRG93biA9IHRydWU7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRpc0FjdGl2ZTogdHJ1ZVxuXHRcdH0pO1xuXHR9LFxuXG5cdG9uTW91c2VNb3ZlOiBmdW5jdGlvbiBvbk1vdXNlTW92ZShldmVudCkge1xuXHRcdGlmICh3aW5kb3cuX2Jsb2NrTW91c2VFdmVudHMgfHwgIXRoaXMuX21vdXNlRG93bikgcmV0dXJuO1xuXHRcdHRoaXMucHJvY2Vzc0V2ZW50KGV2ZW50KTtcblx0XHR0aGlzLnByb3BzLm9uTW91c2VNb3ZlICYmIHRoaXMucHJvcHMub25Nb3VzZU1vdmUoZXZlbnQpO1xuXHR9LFxuXG5cdG9uTW91c2VVcDogZnVuY3Rpb24gb25Nb3VzZVVwKGV2ZW50KSB7XG5cdFx0aWYgKHdpbmRvdy5fYmxvY2tNb3VzZUV2ZW50cyB8fCAhdGhpcy5fbW91c2VEb3duKSByZXR1cm47XG5cdFx0dGhpcy5wcm9jZXNzRXZlbnQoZXZlbnQpO1xuXHRcdHRoaXMucHJvcHMub25Nb3VzZVVwICYmIHRoaXMucHJvcHMub25Nb3VzZVVwKGV2ZW50KTtcblx0XHR0aGlzLnByb3BzLm9uVGFwICYmIHRoaXMucHJvcHMub25UYXAoZXZlbnQpO1xuXHRcdHRoaXMuZW5kTW91c2VFdmVudCgpO1xuXHR9LFxuXG5cdG9uTW91c2VPdXQ6IGZ1bmN0aW9uIG9uTW91c2VPdXQoZXZlbnQpIHtcblx0XHRpZiAod2luZG93Ll9ibG9ja01vdXNlRXZlbnRzIHx8ICF0aGlzLl9tb3VzZURvd24pIHJldHVybjtcblx0XHR0aGlzLnByb2Nlc3NFdmVudChldmVudCk7XG5cdFx0dGhpcy5wcm9wcy5vbk1vdXNlT3V0ICYmIHRoaXMucHJvcHMub25Nb3VzZU91dChldmVudCk7XG5cdFx0dGhpcy5lbmRNb3VzZUV2ZW50KCk7XG5cdH0sXG5cblx0ZW5kTW91c2VFdmVudDogZnVuY3Rpb24gZW5kTW91c2VFdmVudCgpIHtcblx0XHR0aGlzLmNhbmNlbFByZXNzRGV0ZWN0aW9uKCk7XG5cdFx0dGhpcy5fbW91c2VEb3duID0gZmFsc2U7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRpc0FjdGl2ZTogZmFsc2Vcblx0XHR9KTtcblx0fSxcblxuXHRjYW5jZWxUYXA6IGZ1bmN0aW9uIGNhbmNlbFRhcCgpIHtcblx0XHR0aGlzLmVuZFRvdWNoKCk7XG5cdFx0dGhpcy5fbW91c2VEb3duID0gZmFsc2U7XG5cdH0sXG5cblx0dG91Y2hTdHlsZXM6IGZ1bmN0aW9uIHRvdWNoU3R5bGVzKCkge1xuXHRcdHJldHVybiBUT1VDSF9TVFlMRVM7XG5cdH0sXG5cblx0aGFuZGxlcnM6IGZ1bmN0aW9uIGhhbmRsZXJzKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRvblRvdWNoU3RhcnQ6IHRoaXMub25Ub3VjaFN0YXJ0LFxuXHRcdFx0b25Ub3VjaE1vdmU6IHRoaXMub25Ub3VjaE1vdmUsXG5cdFx0XHRvblRvdWNoRW5kOiB0aGlzLm9uVG91Y2hFbmQsXG5cdFx0XHRvbk1vdXNlRG93bjogdGhpcy5vbk1vdXNlRG93bixcblx0XHRcdG9uTW91c2VVcDogdGhpcy5vbk1vdXNlVXAsXG5cdFx0XHRvbk1vdXNlTW92ZTogdGhpcy5vbk1vdXNlTW92ZSxcblx0XHRcdG9uTW91c2VPdXQ6IHRoaXMub25Nb3VzZU91dFxuXHRcdH07XG5cdH1cbn07XG5cbi8qKlxuICogVGFwcGFibGUgQ29tcG9uZW50XG4gKiA9PT09PT09PT09PT09PT09PT1cbiAqL1xuXG52YXIgQ29tcG9uZW50ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdGRpc3BsYXlOYW1lOiAnVGFwcGFibGUnLFxuXG5cdG1peGluczogW01peGluXSxcblxuXHRwcm9wVHlwZXM6IHtcblx0XHRjb21wb25lbnQ6IFJlYWN0LlByb3BUeXBlcy5hbnksIC8vIGNvbXBvbmVudCB0byBjcmVhdGVcblx0XHRjbGFzc05hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsIC8vIG9wdGlvbmFsIGNsYXNzTmFtZVxuXHRcdGNsYXNzQmFzZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZywgLy8gYmFzZSBmb3IgZ2VuZXJhdGVkIGNsYXNzTmFtZXNcblx0XHRzdHlsZTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCwgLy8gYWRkaXRpb25hbCBzdHlsZSBwcm9wZXJ0aWVzIGZvciB0aGUgY29tcG9uZW50XG5cdFx0ZGlzYWJsZWQ6IFJlYWN0LlByb3BUeXBlcy5ib29sIC8vIG9ubHkgYXBwbGllcyB0byBidXR0b25zXG5cdH0sXG5cblx0Z2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiBnZXREZWZhdWx0UHJvcHMoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGNvbXBvbmVudDogJ3NwYW4nLFxuXHRcdFx0Y2xhc3NCYXNlOiAnVGFwcGFibGUnXG5cdFx0fTtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHR2YXIgcHJvcHMgPSB0aGlzLnByb3BzO1xuXHRcdHZhciBjbGFzc05hbWUgPSBwcm9wcy5jbGFzc0Jhc2UgKyAodGhpcy5zdGF0ZS5pc0FjdGl2ZSA/ICctYWN0aXZlJyA6ICctaW5hY3RpdmUnKTtcblxuXHRcdGlmIChwcm9wcy5jbGFzc05hbWUpIHtcblx0XHRcdGNsYXNzTmFtZSArPSAnICcgKyBwcm9wcy5jbGFzc05hbWU7XG5cdFx0fVxuXG5cdFx0dmFyIHN0eWxlID0ge307XG5cdFx0X2V4dGVuZHMoc3R5bGUsIHRoaXMudG91Y2hTdHlsZXMoKSwgcHJvcHMuc3R5bGUpO1xuXG5cdFx0dmFyIG5ld0NvbXBvbmVudFByb3BzID0gX2V4dGVuZHMoe30sIHByb3BzLCB7XG5cdFx0XHRzdHlsZTogc3R5bGUsXG5cdFx0XHRjbGFzc05hbWU6IGNsYXNzTmFtZSxcblx0XHRcdGRpc2FibGVkOiBwcm9wcy5kaXNhYmxlZCxcblx0XHRcdGhhbmRsZXJzOiB0aGlzLmhhbmRsZXJzXG5cdFx0fSwgdGhpcy5oYW5kbGVycygpKTtcblxuXHRcdGRlbGV0ZSBuZXdDb21wb25lbnRQcm9wcy5vblRhcDtcblx0XHRkZWxldGUgbmV3Q29tcG9uZW50UHJvcHMub25QcmVzcztcblx0XHRkZWxldGUgbmV3Q29tcG9uZW50UHJvcHMub25QaW5jaFN0YXJ0O1xuXHRcdGRlbGV0ZSBuZXdDb21wb25lbnRQcm9wcy5vblBpbmNoTW92ZTtcblx0XHRkZWxldGUgbmV3Q29tcG9uZW50UHJvcHMub25QaW5jaEVuZDtcblx0XHRkZWxldGUgbmV3Q29tcG9uZW50UHJvcHMubW92ZVRocmVzaG9sZDtcblx0XHRkZWxldGUgbmV3Q29tcG9uZW50UHJvcHMucHJlc3NEZWxheTtcblx0XHRkZWxldGUgbmV3Q29tcG9uZW50UHJvcHMucHJlc3NNb3ZlVGhyZXNob2xkO1xuXHRcdGRlbGV0ZSBuZXdDb21wb25lbnRQcm9wcy5wcmV2ZW50RGVmYXVsdDtcblx0XHRkZWxldGUgbmV3Q29tcG9uZW50UHJvcHMuc3RvcFByb3BhZ2F0aW9uO1xuXHRcdGRlbGV0ZSBuZXdDb21wb25lbnRQcm9wcy5jb21wb25lbnQ7XG5cblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChwcm9wcy5jb21wb25lbnQsIG5ld0NvbXBvbmVudFByb3BzLCBwcm9wcy5jaGlsZHJlbik7XG5cdH1cbn0pO1xuXG5Db21wb25lbnQuTWl4aW4gPSBNaXhpbjtcbkNvbXBvbmVudC50b3VjaFN0eWxlcyA9IFRPVUNIX1NUWUxFUztcbm1vZHVsZS5leHBvcnRzID0gQ29tcG9uZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgR0xPQkFMID0gZ2xvYmFsIHx8IHdpbmRvdztcblxuZnVuY3Rpb24gY2xlYXJUaW1lcnMoKSB7XG4gIHRoaXMuY2xlYXJJbnRlcnZhbHMoKTtcbiAgdGhpcy5jbGVhclRpbWVvdXRzKCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gVGltZXJzKCkge1xuICB2YXIgaW50ZXJ2YWxzID0gdW5kZWZpbmVkLFxuICAgICAgdGltZW91dHMgPSB1bmRlZmluZWQ7XG5cbiAgcmV0dXJuIHtcbiAgICBjbGVhckludGVydmFsczogZnVuY3Rpb24gY2xlYXJJbnRlcnZhbHMoKSB7XG4gICAgICBpbnRlcnZhbHMuZm9yRWFjaChHTE9CQUwuY2xlYXJJbnRlcnZhbCk7XG4gICAgfSxcbiAgICBjbGVhclRpbWVvdXRzOiBmdW5jdGlvbiBjbGVhclRpbWVvdXRzKCkge1xuICAgICAgdGltZW91dHMuZm9yRWFjaChHTE9CQUwuY2xlYXJUaW1lb3V0KTtcbiAgICB9LFxuICAgIGNsZWFySW50ZXJ2YWw6IGZ1bmN0aW9uIGNsZWFySW50ZXJ2YWwoKSB7XG4gICAgICByZXR1cm4gR0xPQkFMLmNsZWFySW50ZXJ2YWwuYXBwbHkoR0xPQkFMLCBhcmd1bWVudHMpO1xuICAgIH0sXG4gICAgY2xlYXJUaW1lb3V0OiBmdW5jdGlvbiBjbGVhclRpbWVvdXQoKSB7XG4gICAgICByZXR1cm4gR0xPQkFMLmNsZWFyVGltZW91dC5hcHBseShHTE9CQUwsIGFyZ3VtZW50cyk7XG4gICAgfSxcbiAgICBjbGVhclRpbWVyczogY2xlYXJUaW1lcnMsXG5cbiAgICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcbiAgICAgIGludGVydmFscyA9IFtdO1xuICAgICAgdGltZW91dHMgPSBbXTtcbiAgICB9LFxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50OiBjbGVhclRpbWVycyxcblxuICAgIHNldEludGVydmFsOiBmdW5jdGlvbiBzZXRJbnRlcnZhbChjYWxsYmFjaykge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMSA/IF9sZW4gLSAxIDogMCksIF9rZXkgPSAxOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICAgIGFyZ3NbX2tleSAtIDFdID0gYXJndW1lbnRzW19rZXldO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gaW50ZXJ2YWxzW2ludGVydmFscy5wdXNoKEdMT0JBTC5zZXRJbnRlcnZhbC5hcHBseShHTE9CQUwsIFtmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZvciAodmFyIF9sZW4yID0gYXJndW1lbnRzLmxlbmd0aCwgcGFyYW1zID0gQXJyYXkoX2xlbjIpLCBfa2V5MiA9IDA7IF9rZXkyIDwgX2xlbjI7IF9rZXkyKyspIHtcbiAgICAgICAgICBwYXJhbXNbX2tleTJdID0gYXJndW1lbnRzW19rZXkyXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhbGxiYWNrLmNhbGwuYXBwbHkoY2FsbGJhY2ssIFtfdGhpc10uY29uY2F0KHBhcmFtcykpO1xuICAgICAgfV0uY29uY2F0KGFyZ3MpKSkgLSAxXTtcbiAgICB9LFxuICAgIHNldFRpbWVvdXQ6IGZ1bmN0aW9uIHNldFRpbWVvdXQoY2FsbGJhY2spIHtcbiAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICBmb3IgKHZhciBfbGVuMyA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuMyA+IDEgPyBfbGVuMyAtIDEgOiAwKSwgX2tleTMgPSAxOyBfa2V5MyA8IF9sZW4zOyBfa2V5MysrKSB7XG4gICAgICAgIGFyZ3NbX2tleTMgLSAxXSA9IGFyZ3VtZW50c1tfa2V5M107XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aW1lb3V0c1t0aW1lb3V0cy5wdXNoKEdMT0JBTC5zZXRUaW1lb3V0LmFwcGx5KEdMT0JBTCwgW2Z1bmN0aW9uICgpIHtcbiAgICAgICAgZm9yICh2YXIgX2xlbjQgPSBhcmd1bWVudHMubGVuZ3RoLCBwYXJhbXMgPSBBcnJheShfbGVuNCksIF9rZXk0ID0gMDsgX2tleTQgPCBfbGVuNDsgX2tleTQrKykge1xuICAgICAgICAgIHBhcmFtc1tfa2V5NF0gPSBhcmd1bWVudHNbX2tleTRdO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FsbGJhY2suY2FsbC5hcHBseShjYWxsYmFjaywgW190aGlzMl0uY29uY2F0KHBhcmFtcykpO1xuICAgICAgfV0uY29uY2F0KGFyZ3MpKSkgLSAxXTtcbiAgICB9XG4gIH07XG59OyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuXHR2YWx1ZTogdHJ1ZVxufSk7XG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIENvbnRhaW5lciA9IHJlcXVpcmUoJ3JlYWN0LWNvbnRhaW5lcicpO1xuXG52YXIgRXJyb3JWaWV3ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogJ0Vycm9yVmlldycsXG5cblx0cHJvcFR5cGVzOiB7XG5cdFx0Y2hpbGRyZW46IFJlYWN0LlByb3BUeXBlcy5ub2RlXG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRDb250YWluZXIsXG5cdFx0XHR7IGZpbGw6IHRydWUsIGNsYXNzTmFtZTogXCJWaWV3IEVycm9yVmlld1wiIH0sXG5cdFx0XHR0aGlzLnByb3BzLmNoaWxkcmVuXG5cdFx0KTtcblx0fVxufSk7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IEVycm9yVmlldztcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuXHR2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbnZhciBibGFja2xpc3QgPSByZXF1aXJlKCdibGFja2xpc3QnKTtcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgVGFwcGFibGUgPSByZXF1aXJlKCdyZWFjdC10YXBwYWJsZScpO1xudmFyIFRyYW5zaXRpb25zID0gcmVxdWlyZSgnLi4vbWl4aW5zL1RyYW5zaXRpb25zJyk7XG5cbnZhciBMaW5rID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogJ0xpbmsnLFxuXG5cdG1peGluczogW1RyYW5zaXRpb25zXSxcblx0cHJvcFR5cGVzOiB7XG5cdFx0Y2hpbGRyZW46IFJlYWN0LlByb3BUeXBlcy5hbnksXG5cdFx0b3B0aW9uczogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcblx0XHR0cmFuc2l0aW9uOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRcdHRvOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRcdHZpZXdQcm9wczogUmVhY3QuUHJvcFR5cGVzLmFueVxuXHR9LFxuXG5cdGRvVHJhbnNpdGlvbjogZnVuY3Rpb24gZG9UcmFuc2l0aW9uKCkge1xuXHRcdHZhciBvcHRpb25zID0gX2V4dGVuZHMoeyB2aWV3UHJvcHM6IHRoaXMucHJvcHMudmlld1Byb3BzLCB0cmFuc2l0aW9uOiB0aGlzLnByb3BzLnRyYW5zaXRpb24gfSwgdGhpcy5wcm9wcy5vcHRpb25zKTtcblx0XHRjb25zb2xlLmluZm8oJ0xpbmsgdG8gXCInICsgdGhpcy5wcm9wcy50byArICdcIiB1c2luZyB0cmFuc2l0aW9uIFwiJyArIHRoaXMucHJvcHMudHJhbnNpdGlvbiArICdcIicgKyAnIHdpdGggcHJvcHMgJywgdGhpcy5wcm9wcy52aWV3UHJvcHMpO1xuXHRcdHRoaXMudHJhbnNpdGlvblRvKHRoaXMucHJvcHMudG8sIG9wdGlvbnMpO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdHZhciB0YXBwYWJsZVByb3BzID0gYmxhY2tsaXN0KHRoaXMucHJvcHMsICdjaGlsZHJlbicsICdvcHRpb25zJywgJ3RyYW5zaXRpb24nLCAndmlld1Byb3BzJyk7XG5cblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFRhcHBhYmxlLFxuXHRcdFx0X2V4dGVuZHMoeyBvblRhcDogdGhpcy5kb1RyYW5zaXRpb24gfSwgdGFwcGFibGVQcm9wcyksXG5cdFx0XHR0aGlzLnByb3BzLmNoaWxkcmVuXG5cdFx0KTtcblx0fVxufSk7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IExpbms7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcblx0dmFsdWU6IHRydWVcbn0pO1xudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIFZpZXcgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnVmlldycsXG5cblx0cHJvcFR5cGVzOiB7XG5cdFx0Y29tcG9uZW50OiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuXHRcdG5hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZFxuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ1RvdWNoc3RvbmVKUyA8Vmlldz4gc2hvdWxkIG5vdCBiZSByZW5kZXJlZCBkaXJlY3RseS4nKTtcblx0fVxufSk7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IFZpZXc7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcblx0dmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG52YXIgYmxhY2tsaXN0ID0gcmVxdWlyZSgnYmxhY2tsaXN0Jyk7XG52YXIgY2xhc3NOYW1lcyA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKTtcbnZhciBFcnJvclZpZXcgPSByZXF1aXJlKCcuL0Vycm9yVmlldycpO1xudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QvYWRkb25zJyk7XG52YXIgVHJhbnNpdGlvbiA9IFJlYWN0LmFkZG9ucy5DU1NUcmFuc2l0aW9uR3JvdXA7XG5cbmZ1bmN0aW9uIGNyZWF0ZVZpZXdzRnJvbUNoaWxkcmVuKGNoaWxkcmVuKSB7XG5cdHZhciB2aWV3cyA9IHt9O1xuXHRSZWFjdC5DaGlsZHJlbi5mb3JFYWNoKGNoaWxkcmVuLCBmdW5jdGlvbiAodmlldykge1xuXHRcdHZpZXdzW3ZpZXcucHJvcHMubmFtZV0gPSB2aWV3O1xuXHR9KTtcblx0cmV0dXJuIHZpZXdzO1xufVxuXG52YXIgVmlld0NvbnRhaW5lciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6ICdWaWV3Q29udGFpbmVyJyxcblxuXHRzdGF0aWNzOiB7XG5cdFx0c2hvdWxkRmlsbFZlcnRpY2FsU3BhY2U6IHRydWVcblx0fSxcblx0cHJvcFR5cGVzOiB7XG5cdFx0Y2hpbGRyZW46IFJlYWN0LlByb3BUeXBlcy5ub2RlXG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdHZhciBwcm9wcyA9IGJsYWNrbGlzdCh0aGlzLnByb3BzLCAnY2hpbGRyZW4nKTtcblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdCdkaXYnLFxuXHRcdFx0cHJvcHMsXG5cdFx0XHR0aGlzLnByb3BzLmNoaWxkcmVuXG5cdFx0KTtcblx0fVxufSk7XG5cbnZhciBWaWV3TWFuYWdlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6ICdWaWV3TWFuYWdlcicsXG5cblx0c3RhdGljczoge1xuXHRcdHNob3VsZEZpbGxWZXJ0aWNhbFNwYWNlOiB0cnVlXG5cdH0sXG5cdGNvbnRleHRUeXBlczoge1xuXHRcdGFwcDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG5cdH0sXG5cdHByb3BUeXBlczoge1xuXHRcdG5hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdFx0Y2hpbGRyZW46IFJlYWN0LlByb3BUeXBlcy5ub2RlLFxuXHRcdGNsYXNzTmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0XHRkZWZhdWx0VmlldzogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0XHRvblZpZXdDaGFuZ2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jXG5cdH0sXG5cdGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24gZ2V0RGVmYXVsdFByb3BzKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRuYW1lOiAnX19kZWZhdWx0J1xuXHRcdH07XG5cdH0sXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHR2aWV3czogY3JlYXRlVmlld3NGcm9tQ2hpbGRyZW4odGhpcy5wcm9wcy5jaGlsZHJlbiksXG5cdFx0XHRjdXJyZW50VmlldzogdGhpcy5wcm9wcy5kZWZhdWx0Vmlldyxcblx0XHRcdG9wdGlvbnM6IHt9XG5cdFx0fTtcblx0fSxcblx0Y29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuXHRcdHRoaXMuY29udGV4dC5hcHAudmlld01hbmFnZXJzW3RoaXMucHJvcHMubmFtZV0gPSB0aGlzO1xuXHR9LFxuXHRjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24gY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG5cdFx0ZGVsZXRlIHRoaXMuY29udGV4dC5hcHAudmlld01hbmFnZXJzW3RoaXMucHJvcHMubmFtZV07XG5cdH0sXG5cdGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHR2aWV3czogY3JlYXRlVmlld3NGcm9tQ2hpbGRyZW4odGhpcy5wcm9wcy5jaGlsZHJlbilcblx0XHR9KTtcblx0XHRpZiAobmV4dFByb3BzLm5hbWUgIT09IHRoaXMucHJvcHMubmFtZSkge1xuXHRcdFx0dGhpcy5jb250ZXh0LmFwcC52aWV3TWFuYWdlcnNbbmV4dFByb3BzLm5hbWVdID0gdGhpcztcblx0XHRcdGRlbGV0ZSB0aGlzLmNvbnRleHQuYXBwLnZpZXdNYW5hZ2Vyc1t0aGlzLnByb3BzLm5hbWVdO1xuXHRcdH1cblx0XHRpZiAobmV4dFByb3BzLmN1cnJlbnRWaWV3ICYmIG5leHRQcm9wcy5jdXJyZW50VmlldyAhPT0gdGhpcy5zdGF0ZS5jdXJyZW50Vmlldykge1xuXHRcdFx0dGhpcy50cmFuc2l0aW9uVG8obmV4dFByb3BzLmN1cnJlbnRWaWV3LCB7IHZpZXdQcm9wczogbmV4dFByb3BzLnZpZXdQcm9wcyB9KTtcblx0XHR9XG5cdH0sXG5cdHRyYW5zaXRpb25UbzogZnVuY3Rpb24gdHJhbnNpdGlvblRvKHZpZXdLZXksIG9wdGlvbnMpIHtcblx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXG5cdFx0aWYgKHR5cGVvZiBvcHRpb25zID09PSAnc3RyaW5nJykge1xuXHRcdFx0b3B0aW9ucyA9IHsgdHJhbnNpdGlvbjogb3B0aW9ucyB9O1xuXHRcdH1cblx0XHRpZiAoIW9wdGlvbnMpIG9wdGlvbnMgPSB7fTtcblx0XHR0aGlzLmFjdGl2ZVRyYW5zaXRpb25PcHRpb25zID0gb3B0aW9ucztcblx0XHR0aGlzLmNvbnRleHQuYXBwLnZpZXdNYW5hZ2VySW5UcmFuc2l0aW9uID0gdGhpcztcblx0XHR0aGlzLnByb3BzLm9uVmlld0NoYW5nZSAmJiB0aGlzLnByb3BzLm9uVmlld0NoYW5nZSh2aWV3S2V5KTtcblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdGN1cnJlbnRWaWV3OiB2aWV3S2V5LFxuXHRcdFx0b3B0aW9uczogb3B0aW9uc1xuXHRcdH0sIGZ1bmN0aW9uICgpIHtcblx0XHRcdGRlbGV0ZSBfdGhpcy5hY3RpdmVUcmFuc2l0aW9uT3B0aW9ucztcblx0XHRcdGRlbGV0ZSBfdGhpcy5jb250ZXh0LmFwcC52aWV3TWFuYWdlckluVHJhbnNpdGlvbjtcblx0XHR9KTtcblx0fSxcblx0cmVuZGVyVmlld0NvbnRhaW5lcjogZnVuY3Rpb24gcmVuZGVyVmlld0NvbnRhaW5lcigpIHtcblx0XHR2YXIgdmlld0tleSA9IHRoaXMuc3RhdGUuY3VycmVudFZpZXc7XG5cdFx0aWYgKCF2aWV3S2V5KSB7XG5cdFx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0RXJyb3JWaWV3LFxuXHRcdFx0XHRudWxsLFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdCdzcGFuJyxcblx0XHRcdFx0XHR7IGNsYXNzTmFtZTogXCJFcnJvclZpZXdfX2hlYWRpbmdcIiB9LFxuXHRcdFx0XHRcdCdWaWV3TWFuYWdlcjogJyxcblx0XHRcdFx0XHR0aGlzLnByb3BzLm5hbWVcblx0XHRcdFx0KSxcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHQnc3BhbicsXG5cdFx0XHRcdFx0eyBjbGFzc05hbWU6IFwiRXJyb3JWaWV3X190ZXh0XCIgfSxcblx0XHRcdFx0XHQnRXJyb3I6IFRoZXJlIGlzIG5vIGN1cnJlbnQgVmlldy4nXG5cdFx0XHRcdClcblx0XHRcdCk7XG5cdFx0fVxuXHRcdHZhciB2aWV3ID0gdGhpcy5zdGF0ZS52aWV3c1t2aWV3S2V5XTtcblx0XHRpZiAoIXZpZXcgfHwgIXZpZXcucHJvcHMuY29tcG9uZW50KSB7XG5cdFx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0RXJyb3JWaWV3LFxuXHRcdFx0XHRudWxsLFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdCdzcGFuJyxcblx0XHRcdFx0XHR7IGNsYXNzTmFtZTogXCJFcnJvclZpZXdfX2hlYWRpbmdcIiB9LFxuXHRcdFx0XHRcdCdWaWV3TWFuYWdlcjogXCInLFxuXHRcdFx0XHRcdHRoaXMucHJvcHMubmFtZSxcblx0XHRcdFx0XHQnXCInXG5cdFx0XHRcdCksXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0J3NwYW4nLFxuXHRcdFx0XHRcdHsgY2xhc3NOYW1lOiBcIkVycm9yVmlld19fdGV4dFwiIH0sXG5cdFx0XHRcdFx0J1RoZSBWaWV3IFwiJyxcblx0XHRcdFx0XHR2aWV3S2V5LFxuXHRcdFx0XHRcdCdcIiBpcyBpbnZhbGlkLidcblx0XHRcdFx0KVxuXHRcdFx0KTtcblx0XHR9XG5cdFx0dmFyIG9wdGlvbnMgPSB0aGlzLnN0YXRlLm9wdGlvbnMgfHwge307XG5cdFx0dmFyIHZpZXdDbGFzc05hbWUgPSBjbGFzc05hbWVzKCdWaWV3IFZpZXctLScgKyB2aWV3S2V5LCB2aWV3LnByb3BzLmNsYXNzTmFtZSk7XG5cdFx0dmFyIFZpZXdDb21wb25lbnQgPSB2aWV3LnByb3BzLmNvbXBvbmVudDtcblx0XHR2YXIgdmlld1Byb3BzID0gYmxhY2tsaXN0KHZpZXcucHJvcHMsICdjb21wb25lbnQnLCAnY2xhc3NOYW1lJyk7XG5cdFx0X2V4dGVuZHModmlld1Byb3BzLCBvcHRpb25zLnZpZXdQcm9wcyk7XG5cdFx0dmFyIHZpZXdFbGVtZW50ID0gUmVhY3QuY3JlYXRlRWxlbWVudChWaWV3Q29tcG9uZW50LCB2aWV3UHJvcHMpO1xuXG5cdFx0aWYgKHRoaXMuX19sYXN0UmVuZGVyZWRWaWV3ICE9PSB2aWV3S2V5KSB7XG5cdFx0XHQvLyBjb25zb2xlLmxvZygnaW5pdGlhbGlzaW5nIHZpZXcgJyArIHZpZXdLZXkgKyAnIHdpdGggb3B0aW9ucycsIG9wdGlvbnMpO1xuXHRcdFx0aWYgKHZpZXdFbGVtZW50LnR5cGUubmF2aWdhdGlvbkJhciAmJiB2aWV3RWxlbWVudC50eXBlLmdldE5hdmlnYXRpb24pIHtcblx0XHRcdFx0dmFyIGFwcCA9IHRoaXMuY29udGV4dC5hcHA7XG5cdFx0XHRcdHZhciB0cmFuc2l0aW9uID0gb3B0aW9ucy50cmFuc2l0aW9uO1xuXHRcdFx0XHRpZiAoYXBwLnZpZXdNYW5hZ2VySW5UcmFuc2l0aW9uKSB7XG5cdFx0XHRcdFx0dHJhbnNpdGlvbiA9IGFwcC52aWV3TWFuYWdlckluVHJhbnNpdGlvbi5hY3RpdmVUcmFuc2l0aW9uT3B0aW9ucy50cmFuc2l0aW9uO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGFwcC5uYXZpZ2F0aW9uQmFyc1t2aWV3RWxlbWVudC50eXBlLm5hdmlnYXRpb25CYXJdLnVwZGF0ZVdpdGhUcmFuc2l0aW9uKHZpZXdFbGVtZW50LnR5cGUuZ2V0TmF2aWdhdGlvbih2aWV3UHJvcHMsIGFwcCksIHRyYW5zaXRpb24pO1xuXHRcdFx0XHR9LCAwKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX19sYXN0UmVuZGVyZWRWaWV3ID0gdmlld0tleTtcblx0XHR9XG5cblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFZpZXdDb250YWluZXIsXG5cdFx0XHR7IGNsYXNzTmFtZTogdmlld0NsYXNzTmFtZSwga2V5OiB2aWV3S2V5IH0sXG5cdFx0XHR2aWV3RWxlbWVudFxuXHRcdCk7XG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdHZhciBjbGFzc05hbWUgPSBjbGFzc05hbWVzKCdWaWV3TWFuYWdlcicsIHRoaXMucHJvcHMuY2xhc3NOYW1lKTtcblx0XHR2YXIgdmlld0NvbnRhaW5lciA9IHRoaXMucmVuZGVyVmlld0NvbnRhaW5lcih0aGlzLnN0YXRlLmN1cnJlbnRWaWV3LCB7IHZpZXdQcm9wczogdGhpcy5zdGF0ZS5jdXJyZW50Vmlld1Byb3BzIH0pO1xuXG5cdFx0dmFyIHRyYW5zaXRpb25OYW1lID0gJ3ZpZXctdHJhbnNpdGlvbi1pbnN0YW50Jztcblx0XHRpZiAodGhpcy5zdGF0ZS5vcHRpb25zLnRyYW5zaXRpb24pIHtcblx0XHRcdC8vIGNvbnNvbGUubG9nKCdhcHBseWluZyB2aWV3IHRyYW5zaXRpb246ICcgKyB0aGlzLnN0YXRlLm9wdGlvbnMudHJhbnNpdGlvbiArICcgdG8gdmlldyAnICsgdGhpcy5zdGF0ZS5jdXJyZW50Vmlldyk7XG5cdFx0XHR0cmFuc2l0aW9uTmFtZSA9ICd2aWV3LXRyYW5zaXRpb24tJyArIHRoaXMuc3RhdGUub3B0aW9ucy50cmFuc2l0aW9uO1xuXHRcdH1cblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFRyYW5zaXRpb24sXG5cdFx0XHR7IHRyYW5zaXRpb25OYW1lOiB0cmFuc2l0aW9uTmFtZSwgdHJhbnNpdGlvbkVudGVyOiB0cnVlLCB0cmFuc2l0aW9uTGVhdmU6IHRydWUsIGNsYXNzTmFtZTogY2xhc3NOYW1lLCBjb21wb25lbnQ6IFwiZGl2XCIgfSxcblx0XHRcdHZpZXdDb250YWluZXJcblx0XHQpO1xuXHR9XG59KTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gVmlld01hbmFnZXI7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBhbmltYXRpb24gPSByZXF1aXJlKCd0d2Vlbi5qcycpO1xudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxuZnVuY3Rpb24gdXBkYXRlKCkge1xuXHRhbmltYXRpb24udXBkYXRlKCk7XG5cdGlmIChhbmltYXRpb24uZ2V0QWxsKCkubGVuZ3RoKSB7XG5cdFx0d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHNjcm9sbFRvVG9wKGVsLCBvcHRpb25zKSB7XG5cdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXHR2YXIgZnJvbSA9IGVsLnNjcm9sbFRvcDtcblx0dmFyIGR1cmF0aW9uID0gTWF0aC5taW4oTWF0aC5tYXgoMjAwLCBmcm9tIC8gMiksIDM1MCk7XG5cdGlmIChmcm9tID4gMjAwKSBkdXJhdGlvbiA9IDMwMDtcblx0ZWwuc3R5bGUud2Via2l0T3ZlcmZsb3dTY3JvbGxpbmcgPSAnYXV0byc7XG5cdGVsLnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG5cdHZhciB0d2VlbiA9IG5ldyBhbmltYXRpb24uVHdlZW4oeyBwb3M6IGZyb20gfSkudG8oeyBwb3M6IDAgfSwgZHVyYXRpb24pLmVhc2luZyhhbmltYXRpb24uRWFzaW5nLlF1YWRyYXRpYy5PdXQpLm9uVXBkYXRlKGZ1bmN0aW9uICgpIHtcblx0XHRlbC5zY3JvbGxUb3AgPSB0aGlzLnBvcztcblx0XHRpZiAob3B0aW9ucy5vblVwZGF0ZSkge1xuXHRcdFx0b3B0aW9ucy5vblVwZGF0ZSgpO1xuXHRcdH1cblx0fSkub25Db21wbGV0ZShmdW5jdGlvbiAoKSB7XG5cdFx0ZWwuc3R5bGUud2Via2l0T3ZlcmZsb3dTY3JvbGxpbmcgPSAndG91Y2gnO1xuXHRcdGVsLnN0eWxlLm92ZXJmbG93ID0gJ3Njcm9sbCc7XG5cdFx0aWYgKG9wdGlvbnMub25Db21wbGV0ZSkgb3B0aW9ucy5vbkNvbXBsZXRlKCk7XG5cdH0pLnN0YXJ0KCk7XG5cdHVwZGF0ZSgpO1xuXHRyZXR1cm4gdHdlZW47XG59XG5cbmV4cG9ydHMuc2Nyb2xsVG9Ub3AgPSBzY3JvbGxUb1RvcDtcblxudmFyIE1peGlucyA9IGV4cG9ydHMuTWl4aW5zID0ge307XG5cbk1peGlucy5TY3JvbGxDb250YWluZXJUb1RvcCA9IHtcblx0Y29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzdGF0dXNUYXAnLCB0aGlzLnNjcm9sbENvbnRhaW5lclRvVG9wKTtcblx0fSxcblx0Y29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuXHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdzdGF0dXNUYXAnLCB0aGlzLnNjcm9sbENvbnRhaW5lclRvVG9wKTtcblx0XHRpZiAodGhpcy5fc2Nyb2xsQ29udGFpbmVyQW5pbWF0aW9uKSB7XG5cdFx0XHR0aGlzLl9zY3JvbGxDb250YWluZXJBbmltYXRpb24uc3RvcCgpO1xuXHRcdH1cblx0fSxcblx0c2Nyb2xsQ29udGFpbmVyVG9Ub3A6IGZ1bmN0aW9uIHNjcm9sbENvbnRhaW5lclRvVG9wKCkge1xuXHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cblx0XHRpZiAoIXRoaXMuaXNNb3VudGVkKCkgfHwgIXRoaXMucmVmcy5zY3JvbGxDb250YWluZXIpIHJldHVybjtcblx0XHR0aGlzLl9zY3JvbGxDb250YWluZXJBbmltYXRpb24gPSBzY3JvbGxUb1RvcChSZWFjdC5maW5kRE9NTm9kZSh0aGlzLnJlZnMuc2Nyb2xsQ29udGFpbmVyKSwge1xuXHRcdFx0b25Db21wbGV0ZTogZnVuY3Rpb24gb25Db21wbGV0ZSgpIHtcblx0XHRcdFx0ZGVsZXRlIF90aGlzLl9zY3JvbGxDb250YWluZXJBbmltYXRpb247XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG5cdHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuY3JlYXRlQXBwID0gY3JlYXRlQXBwO1xudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIGFuaW1hdGlvbiA9IHJlcXVpcmUoJy4vY29yZS9hbmltYXRpb24nKTtcbmV4cG9ydHMuYW5pbWF0aW9uID0gYW5pbWF0aW9uO1xudmFyIExpbmsgPSByZXF1aXJlKCcuL2NvcmUvTGluaycpO1xuZXhwb3J0cy5MaW5rID0gTGluaztcbnZhciBWaWV3ID0gcmVxdWlyZSgnLi9jb3JlL1ZpZXcnKTtcbmV4cG9ydHMuVmlldyA9IFZpZXc7XG52YXIgVmlld01hbmFnZXIgPSByZXF1aXJlKCcuL2NvcmUvVmlld01hbmFnZXInKTtcblxuZXhwb3J0cy5WaWV3TWFuYWdlciA9IFZpZXdNYW5hZ2VyO1xudmFyIENvbnRhaW5lciA9IHJlcXVpcmUoJ3JlYWN0LWNvbnRhaW5lcicpO1xuZXhwb3J0cy5Db250YWluZXIgPSBDb250YWluZXI7XG52YXIgTWl4aW5zID0gcmVxdWlyZSgnLi9taXhpbnMnKTtcbmV4cG9ydHMuTWl4aW5zID0gTWl4aW5zO1xudmFyIFVJID0gcmVxdWlyZSgnLi91aScpO1xuXG5leHBvcnRzLlVJID0gVUk7XG5cbmZ1bmN0aW9uIGNyZWF0ZUFwcCgpIHtcblx0dmFyIGFwcCA9IHtcblx0XHRuYXZpZ2F0aW9uQmFyczoge30sXG5cdFx0dmlld01hbmFnZXJzOiB7fSxcblx0XHR2aWV3czoge30sXG5cdFx0dHJhbnNpdGlvblRvOiBmdW5jdGlvbiB0cmFuc2l0aW9uVG8odmlldywgb3B0cykge1xuXHRcdFx0dmFyIHZtID0gJ19fZGVmYXVsdCc7XG5cdFx0XHR2aWV3ID0gdmlldy5zcGxpdCgnOicpO1xuXHRcdFx0aWYgKHZpZXcubGVuZ3RoID4gMSkge1xuXHRcdFx0XHR2bSA9IHZpZXcuc2hpZnQoKTtcblx0XHRcdH1cblx0XHRcdHZpZXcgPSB2aWV3WzBdO1xuXHRcdFx0YXBwLnZpZXdNYW5hZ2Vyc1t2bV0udHJhbnNpdGlvblRvKHZpZXcsIG9wdHMpO1xuXHRcdH1cblx0fTtcblx0cmV0dXJuIHtcblx0XHRjaGlsZENvbnRleHRUeXBlczoge1xuXHRcdFx0YXBwOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0XG5cdFx0fSxcblx0XHRnZXRDaGlsZENvbnRleHQ6IGZ1bmN0aW9uIGdldENoaWxkQ29udGV4dCgpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGFwcDogYXBwXG5cdFx0XHR9O1xuXHRcdH1cblx0fTtcbn0iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcblx0dmFsdWU6IHRydWVcbn0pO1xudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIFRyYW5zaXRpb25zID0ge1xuXHRjb250ZXh0VHlwZXM6IHtcblx0XHRhcHA6IFJlYWN0LlByb3BUeXBlcy5vYmplY3Rcblx0fSxcblx0dHJhbnNpdGlvblRvOiBmdW5jdGlvbiB0cmFuc2l0aW9uVG8odmlldywgb3B0cykge1xuXHRcdHRoaXMuY29udGV4dC5hcHAudHJhbnNpdGlvblRvKHZpZXcsIG9wdHMpO1xuXHR9XG59O1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBUcmFuc2l0aW9ucztcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG52YXIgVHJhbnNpdGlvbnMgPSByZXF1aXJlKCcuL1RyYW5zaXRpb25zJyk7XG5leHBvcnRzLlRyYW5zaXRpb25zID0gVHJhbnNpdGlvbnM7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdC9hZGRvbnMnKTtcbnZhciBjbGFzc25hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xudmFyIFRyYW5zaXRpb24gPSBSZWFjdC5hZGRvbnMuQ1NTVHJhbnNpdGlvbkdyb3VwO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6ICdBbGVydGJhcicsXG5cdHByb3BUeXBlczoge1xuXHRcdGFuaW1hdGVkOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcblx0XHRjaGlsZHJlbjogUmVhY3QuUHJvcFR5cGVzLm5vZGUuaXNSZXF1aXJlZCxcblx0XHRjbGFzc05hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdFx0cHVsc2U6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuXHRcdHR5cGU6IFJlYWN0LlByb3BUeXBlcy5vbmVPZihbJ2RlZmF1bHQnLCAncHJpbWFyeScsICdzdWNjZXNzJywgJ3dhcm5pbmcnLCAnZGFuZ2VyJ10pLFxuXHRcdHZpc2libGU6IFJlYWN0LlByb3BUeXBlcy5ib29sXG5cdH0sXG5cblx0Z2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiBnZXREZWZhdWx0UHJvcHMoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHR5cGU6ICdkZWZhdWx0J1xuXHRcdH07XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0dmFyIGNsYXNzTmFtZSA9IGNsYXNzbmFtZXMoJ0FsZXJ0YmFyJywgJ0FsZXJ0YmFyLS0nICsgdGhpcy5wcm9wcy50eXBlLCB7XG5cdFx0XHQnQWxlcnRiYXItLWFuaW1hdGVkJzogdGhpcy5wcm9wcy5hbmltYXRlZCxcblx0XHRcdCdBbGVydGJhci0tcHVsc2UnOiB0aGlzLnByb3BzLnB1bHNlXG5cdFx0fSwgdGhpcy5wcm9wcy5jbGFzc05hbWUpO1xuXG5cdFx0dmFyIHB1bHNlV3JhcCA9IHRoaXMucHJvcHMucHVsc2UgPyBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0J2RpdicsXG5cdFx0XHR7IGNsYXNzTmFtZTogXCJBbGVydGJhcl9faW5uZXJcIiB9LFxuXHRcdFx0dGhpcy5wcm9wcy5jaGlsZHJlblxuXHRcdCkgOiB0aGlzLnByb3BzLmNoaWxkcmVuO1xuXHRcdHZhciBhbmltYXRlZEJhciA9IHRoaXMucHJvcHMudmlzaWJsZSA/IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHQnZGl2Jyxcblx0XHRcdHsgY2xhc3NOYW1lOiBjbGFzc05hbWUgfSxcblx0XHRcdHB1bHNlV3JhcFxuXHRcdCkgOiBudWxsO1xuXG5cdFx0dmFyIGNvbXBvbmVudCA9IHRoaXMucHJvcHMuYW5pbWF0ZWQgPyBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0VHJhbnNpdGlvbixcblx0XHRcdHsgdHJhbnNpdGlvbk5hbWU6IFwiQWxlcnRiYXJcIiwgY29tcG9uZW50OiBcImRpdlwiIH0sXG5cdFx0XHRhbmltYXRlZEJhclxuXHRcdCkgOiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0J2RpdicsXG5cdFx0XHR7IGNsYXNzTmFtZTogY2xhc3NOYW1lIH0sXG5cdFx0XHRwdWxzZVdyYXBcblx0XHQpO1xuXG5cdFx0cmV0dXJuIGNvbXBvbmVudDtcblx0fVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdC9hZGRvbnMnKTtcbnZhciBUYXBwYWJsZSA9IHJlcXVpcmUoJ3JlYWN0LXRhcHBhYmxlJyk7XG5cbnZhciBibGFja2xpc3QgPSByZXF1aXJlKCdibGFja2xpc3QnKTtcbnZhciBjbGFzc25hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6ICdCdXR0b24nLFxuXHRwcm9wVHlwZXM6IHtcblx0XHRjaGlsZHJlbjogUmVhY3QuUHJvcFR5cGVzLm5vZGUuaXNSZXF1aXJlZCxcblx0XHRjbGFzc05hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdFx0dHlwZTogUmVhY3QuUHJvcFR5cGVzLm9uZU9mKFsnZGVmYXVsdCcsICdpbmZvJywgJ3ByaW1hcnknLCAnc3VjY2VzcycsICd3YXJuaW5nJywgJ2RhbmdlciddKVxuXHR9LFxuXG5cdGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24gZ2V0RGVmYXVsdFByb3BzKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHR0eXBlOiAnZGVmYXVsdCdcblx0XHR9O1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdHZhciBjbGFzc05hbWUgPSBjbGFzc25hbWVzKCdCdXR0b24nLCAnQnV0dG9uLS0nICsgdGhpcy5wcm9wcy50eXBlLCB0aGlzLnByb3BzLmNsYXNzTmFtZSk7XG5cdFx0dmFyIHByb3BzID0gYmxhY2tsaXN0KHRoaXMucHJvcHMsICd0eXBlJyk7XG5cblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChUYXBwYWJsZSwgX2V4dGVuZHMoe30sIHByb3BzLCB7IGNsYXNzTmFtZTogY2xhc3NOYW1lLCBjb21wb25lbnQ6IFwiYnV0dG9uXCIgfSkpO1xuXHR9XG59KTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbnZhciBibGFja2xpc3QgPSByZXF1aXJlKCdibGFja2xpc3QnKTtcbnZhciBjbGFzc25hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QvYWRkb25zJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogJ0J1dHRvbkdyb3VwJyxcblx0cHJvcFR5cGVzOiB7XG5cdFx0Y2hpbGRyZW46IFJlYWN0LlByb3BUeXBlcy5ub2RlLmlzUmVxdWlyZWQsXG5cdFx0Y2xhc3NOYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdHZhciBjbGFzc05hbWUgPSBjbGFzc25hbWVzKCdCdXR0b25Hcm91cCcsIHRoaXMucHJvcHMuY2xhc3NOYW1lKTtcblx0XHR2YXIgcHJvcHMgPSBibGFja2xpc3QodGhpcy5wcm9wcywgJ2NsYXNzTmFtZScpO1xuXG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIF9leHRlbmRzKHsgY2xhc3NOYW1lOiBjbGFzc05hbWUgfSwgcHJvcHMpKTtcblx0fVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG52YXIgYmxhY2tsaXN0ID0gcmVxdWlyZSgnYmxhY2tsaXN0Jyk7XG52YXIgY2xhc3NuYW1lcyA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKTtcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0L2FkZG9ucycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6ICdGaWVsZENvbnRyb2wnLFxuXHRwcm9wVHlwZXM6IHtcblx0XHRjaGlsZHJlbjogUmVhY3QuUHJvcFR5cGVzLm5vZGUuaXNSZXF1aXJlZCxcblx0XHRjbGFzc05hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmdcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0dmFyIGNsYXNzTmFtZSA9IGNsYXNzbmFtZXMoJ0ZpZWxkQ29udHJvbCcsIHRoaXMucHJvcHMuY2xhc3NOYW1lKTtcblx0XHR2YXIgcHJvcHMgPSBibGFja2xpc3QodGhpcy5wcm9wcywgJ2NsYXNzTmFtZScpO1xuXG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIF9leHRlbmRzKHsgY2xhc3NOYW1lOiBjbGFzc05hbWUgfSwgcHJvcHMpKTtcblx0fVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG52YXIgYmxhY2tsaXN0ID0gcmVxdWlyZSgnYmxhY2tsaXN0Jyk7XG52YXIgY2xhc3NuYW1lcyA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKTtcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0L2FkZG9ucycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6ICdGaWVsZExhYmVsJyxcblx0cHJvcFR5cGVzOiB7XG5cdFx0Y2hpbGRyZW46IFJlYWN0LlByb3BUeXBlcy5ub2RlLmlzUmVxdWlyZWQsXG5cdFx0Y2xhc3NOYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdHZhciBjbGFzc05hbWUgPSBjbGFzc25hbWVzKCdGaWVsZExhYmVsJywgdGhpcy5wcm9wcy5jbGFzc05hbWUpO1xuXHRcdHZhciBwcm9wcyA9IGJsYWNrbGlzdCh0aGlzLnByb3BzLCAnY2xhc3NOYW1lJyk7XG5cblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgX2V4dGVuZHMoeyBjbGFzc05hbWU6IGNsYXNzTmFtZSB9LCBwcm9wcykpO1xuXHR9XG59KTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbnZhciBibGFja2xpc3QgPSByZXF1aXJlKCdibGFja2xpc3QnKTtcbnZhciBjbGFzc25hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QvYWRkb25zJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogJ0dyb3VwJyxcblx0cHJvcFR5cGVzOiB7XG5cdFx0Y2hpbGRyZW46IFJlYWN0LlByb3BUeXBlcy5ub2RlLmlzUmVxdWlyZWQsXG5cdFx0Y2xhc3NOYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRcdGhhc1RvcEd1dHRlcjogUmVhY3QuUHJvcFR5cGVzLmJvb2xcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0dmFyIGNsYXNzTmFtZSA9IGNsYXNzbmFtZXMoJ0dyb3VwJywge1xuXHRcdFx0J0dyb3VwLS1oYXMtZ3V0dGVyLXRvcCc6IHRoaXMucHJvcHMuaGFzVG9wR3V0dGVyXG5cdFx0fSwgdGhpcy5wcm9wcy5jbGFzc05hbWUpO1xuXHRcdHZhciBwcm9wcyA9IGJsYWNrbGlzdCh0aGlzLnByb3BzLCAnY2xhc3NOYW1lJyk7XG5cblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgX2V4dGVuZHMoeyBjbGFzc05hbWU6IGNsYXNzTmFtZSB9LCBwcm9wcykpO1xuXHR9XG59KTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbnZhciBibGFja2xpc3QgPSByZXF1aXJlKCdibGFja2xpc3QnKTtcbnZhciBjbGFzc25hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QvYWRkb25zJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogJ0dyb3VwQm9keScsXG5cdHByb3BUeXBlczoge1xuXHRcdGNoaWxkcmVuOiBSZWFjdC5Qcm9wVHlwZXMubm9kZS5pc1JlcXVpcmVkLFxuXHRcdGNsYXNzTmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHR2YXIgY2xhc3NOYW1lID0gY2xhc3NuYW1lcygnR3JvdXBfX2JvZHknLCB0aGlzLnByb3BzLmNsYXNzTmFtZSk7XG5cdFx0dmFyIHByb3BzID0gYmxhY2tsaXN0KHRoaXMucHJvcHMsICdjbGFzc05hbWUnKTtcblxuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCBfZXh0ZW5kcyh7IGNsYXNzTmFtZTogY2xhc3NOYW1lIH0sIHByb3BzKSk7XG5cdH1cbn0pOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxudmFyIGJsYWNrbGlzdCA9IHJlcXVpcmUoJ2JsYWNrbGlzdCcpO1xudmFyIGNsYXNzbmFtZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyk7XG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdC9hZGRvbnMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnR3JvdXBGb290ZXInLFxuXHRwcm9wVHlwZXM6IHtcblx0XHRjaGlsZHJlbjogUmVhY3QuUHJvcFR5cGVzLm5vZGUuaXNSZXF1aXJlZCxcblx0XHRjbGFzc05hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmdcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0dmFyIGNsYXNzTmFtZSA9IGNsYXNzbmFtZXMoJ0dyb3VwX19mb290ZXInLCB0aGlzLnByb3BzLmNsYXNzTmFtZSk7XG5cdFx0dmFyIHByb3BzID0gYmxhY2tsaXN0KHRoaXMucHJvcHMsICdjbGFzc05hbWUnKTtcblxuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCBfZXh0ZW5kcyh7IGNsYXNzTmFtZTogY2xhc3NOYW1lIH0sIHByb3BzKSk7XG5cdH1cbn0pOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxudmFyIGJsYWNrbGlzdCA9IHJlcXVpcmUoJ2JsYWNrbGlzdCcpO1xudmFyIGNsYXNzbmFtZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyk7XG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdC9hZGRvbnMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnR3JvdXBIZWFkZXInLFxuXHRwcm9wVHlwZXM6IHtcblx0XHRjaGlsZHJlbjogUmVhY3QuUHJvcFR5cGVzLm5vZGUuaXNSZXF1aXJlZCxcblx0XHRjbGFzc05hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmdcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0dmFyIGNsYXNzTmFtZSA9IGNsYXNzbmFtZXMoJ0dyb3VwX19oZWFkZXInLCB0aGlzLnByb3BzLmNsYXNzTmFtZSk7XG5cdFx0dmFyIHByb3BzID0gYmxhY2tsaXN0KHRoaXMucHJvcHMsICdjbGFzc05hbWUnKTtcblxuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCBfZXh0ZW5kcyh7IGNsYXNzTmFtZTogY2xhc3NOYW1lIH0sIHByb3BzKSk7XG5cdH1cbn0pOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxudmFyIGJsYWNrbGlzdCA9IHJlcXVpcmUoJ2JsYWNrbGlzdCcpO1xudmFyIGNsYXNzbmFtZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyk7XG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdC9hZGRvbnMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnR3JvdXBJbm5lcicsXG5cdHByb3BUeXBlczoge1xuXHRcdGNoaWxkcmVuOiBSZWFjdC5Qcm9wVHlwZXMubm9kZS5pc1JlcXVpcmVkLFxuXHRcdGNsYXNzTmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHR2YXIgY2xhc3NOYW1lID0gY2xhc3NuYW1lcygnR3JvdXBfX2lubmVyJywgdGhpcy5wcm9wcy5jbGFzc05hbWUpO1xuXHRcdHZhciBwcm9wcyA9IGJsYWNrbGlzdCh0aGlzLnByb3BzLCAnY2xhc3NOYW1lJyk7XG5cblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgX2V4dGVuZHMoeyBjbGFzc05hbWU6IGNsYXNzTmFtZSB9LCBwcm9wcykpO1xuXHR9XG59KTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbnZhciBJdGVtID0gcmVxdWlyZSgnLi9JdGVtJyk7XG52YXIgSXRlbUNvbnRlbnQgPSByZXF1aXJlKCcuL0l0ZW1Db250ZW50Jyk7XG52YXIgSXRlbUlubmVyID0gcmVxdWlyZSgnLi9JdGVtSW5uZXInKTtcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0L2FkZG9ucycpO1xuXG52YXIgYmxhY2tsaXN0ID0gcmVxdWlyZSgnYmxhY2tsaXN0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogJ0lucHV0JyxcblxuXHRwcm9wVHlwZXM6IHtcblx0XHRjbGFzc05hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdFx0Y2hpbGRyZW46IFJlYWN0LlByb3BUeXBlcy5ub2RlLFxuXHRcdGRpc2FibGVkOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbFxuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdHZhciBpbnB1dFByb3BzID0gYmxhY2tsaXN0KHRoaXMucHJvcHMsICdjaGlsZHJlbicsICdjbGFzc05hbWUnKTtcblxuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0SXRlbSxcblx0XHRcdHsgY2xhc3NOYW1lOiB0aGlzLnByb3BzLmNsYXNzTmFtZSwgc2VsZWN0YWJsZTogdGhpcy5wcm9wcy5kaXNhYmxlZCwgY29tcG9uZW50OiBcImxhYmVsXCIgfSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdEl0ZW1Jbm5lcixcblx0XHRcdFx0bnVsbCxcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHRJdGVtQ29udGVudCxcblx0XHRcdFx0XHR7IGNvbXBvbmVudDogXCJsYWJlbFwiIH0sXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudCgnaW5wdXQnLCBfZXh0ZW5kcyh7IGNsYXNzTmFtZTogXCJmaWVsZFwiLCB0eXBlOiBcInRleHRcIiB9LCBpbnB1dFByb3BzKSlcblx0XHRcdFx0KSxcblx0XHRcdFx0dGhpcy5wcm9wcy5jaGlsZHJlblxuXHRcdFx0KVxuXHRcdCk7XG5cdH1cbn0pOyIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX2JsYWNrbGlzdCA9IHJlcXVpcmUoJ2JsYWNrbGlzdCcpO1xuXG52YXIgX2JsYWNrbGlzdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9ibGFja2xpc3QpO1xuXG52YXIgX3JlYWN0QWRkb25zID0gcmVxdWlyZSgncmVhY3QvYWRkb25zJyk7XG5cbnZhciBfcmVhY3RBZGRvbnMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3RBZGRvbnMpO1xuXG52YXIgX2NsYXNzbmFtZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyk7XG5cbnZhciBfY2xhc3NuYW1lczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jbGFzc25hbWVzKTtcblxubW9kdWxlLmV4cG9ydHMgPSBfcmVhY3RBZGRvbnMyWydkZWZhdWx0J10uY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogJ0l0ZW0nLFxuXG5cdHByb3BUeXBlczoge1xuXHRcdGNoaWxkcmVuOiBfcmVhY3RBZGRvbnMyWydkZWZhdWx0J10uUHJvcFR5cGVzLm5vZGUuaXNSZXF1aXJlZCxcblx0XHRjbGFzc05hbWU6IF9yZWFjdEFkZG9uczJbJ2RlZmF1bHQnXS5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRcdHNob3dEaXNjbG9zdXJlQXJyb3c6IF9yZWFjdEFkZG9uczJbJ2RlZmF1bHQnXS5Qcm9wVHlwZXMuYm9vbFxuXHR9LFxuXG5cdGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24gZ2V0RGVmYXVsdFByb3BzKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRjb21wb25lbnQ6ICdkaXYnXG5cdFx0fTtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHR2YXIgY29tcG9uZW50Q2xhc3MgPSAoMCwgX2NsYXNzbmFtZXMyWydkZWZhdWx0J10pKCdJdGVtJywge1xuXHRcdFx0J0l0ZW0tLWhhcy1kaXNjbG9zdXJlLWFycm93JzogdGhpcy5wcm9wcy5zaG93RGlzY2xvc3VyZUFycm93XG5cdFx0fSwgdGhpcy5wcm9wcy5jbGFzc05hbWUpO1xuXG5cdFx0dmFyIHByb3BzID0gKDAsIF9ibGFja2xpc3QyWydkZWZhdWx0J10pKHRoaXMucHJvcHMsICdjaGlsZHJlbicsICdjbGFzc05hbWUnLCAnc2hvd0Rpc2Nsb3N1cmVBcnJvdycpO1xuXHRcdHByb3BzLmNsYXNzTmFtZSA9IGNvbXBvbmVudENsYXNzO1xuXG5cdFx0cmV0dXJuIF9yZWFjdEFkZG9uczJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KHRoaXMucHJvcHMuY29tcG9uZW50LCBwcm9wcywgdGhpcy5wcm9wcy5jaGlsZHJlbik7XG5cdH1cbn0pOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxudmFyIGJsYWNrbGlzdCA9IHJlcXVpcmUoJ2JsYWNrbGlzdCcpO1xudmFyIGNsYXNzbmFtZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyk7XG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdC9hZGRvbnMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnSXRlbUNvbnRlbnQnLFxuXHRwcm9wVHlwZXM6IHtcblx0XHRjaGlsZHJlbjogUmVhY3QuUHJvcFR5cGVzLm5vZGUuaXNSZXF1aXJlZCxcblx0XHRjbGFzc05hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmdcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0dmFyIGNsYXNzTmFtZSA9IGNsYXNzbmFtZXMoJ0l0ZW1fX2NvbnRlbnQnLCB0aGlzLnByb3BzLmNsYXNzTmFtZSk7XG5cdFx0dmFyIHByb3BzID0gYmxhY2tsaXN0KHRoaXMucHJvcHMsICdjbGFzc05hbWUnKTtcblxuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCBfZXh0ZW5kcyh7IGNsYXNzTmFtZTogY2xhc3NOYW1lIH0sIHByb3BzKSk7XG5cdH1cbn0pOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QvYWRkb25zJyk7XG5cbnZhciBjbGFzc25hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6ICdJdGVtSW5uZXInLFxuXG5cdHByb3BUeXBlczoge1xuXHRcdGNoaWxkcmVuOiBSZWFjdC5Qcm9wVHlwZXMubm9kZS5pc1JlcXVpcmVkLFxuXHRcdGNsYXNzTmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdHZhciBjbGFzc05hbWUgPSBjbGFzc25hbWVzKCdJdGVtX19pbm5lcicsIHRoaXMucHJvcHMuY2xhc3NOYW1lKTtcblxuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCBfZXh0ZW5kcyh7IGNsYXNzTmFtZTogY2xhc3NOYW1lIH0sIHRoaXMucHJvcHMpKTtcblx0fVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdC9hZGRvbnMnKTtcbnZhciBjbGFzc25hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6ICdJdGVtTWVkaWEnLFxuXHRwcm9wVHlwZXM6IHtcblx0XHRhdmF0YXI6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdFx0YXZhdGFySW5pdGlhbHM6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdFx0Y2xhc3NOYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRcdGljb246IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdFx0dGh1bWJuYWlsOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0dmFyIGNsYXNzTmFtZSA9IGNsYXNzbmFtZXMoe1xuXHRcdFx0J0l0ZW1fX21lZGlhJzogdHJ1ZSxcblx0XHRcdCdJdGVtX19tZWRpYS0taWNvbic6IHRoaXMucHJvcHMuaWNvbixcblx0XHRcdCdJdGVtX19tZWRpYS0tYXZhdGFyJzogdGhpcy5wcm9wcy5hdmF0YXIgfHwgdGhpcy5wcm9wcy5hdmF0YXJJbml0aWFscyxcblx0XHRcdCdJdGVtX19tZWRpYS0tdGh1bWJuYWlsJzogdGhpcy5wcm9wcy50aHVtYm5haWxcblx0XHR9LCB0aGlzLnByb3BzLmNsYXNzTmFtZSk7XG5cblx0XHQvLyBtZWRpYSB0eXBlc1xuXHRcdHZhciBpY29uID0gdGhpcy5wcm9wcy5pY29uID8gUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBjbGFzc05hbWU6ICdJdGVtX19tZWRpYV9faWNvbiAnICsgdGhpcy5wcm9wcy5pY29uIH0pIDogbnVsbDtcblx0XHR2YXIgYXZhdGFyID0gdGhpcy5wcm9wcy5hdmF0YXIgfHwgdGhpcy5wcm9wcy5hdmF0YXJJbml0aWFscyA/IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHQnZGl2Jyxcblx0XHRcdHsgY2xhc3NOYW1lOiBcIkl0ZW1fX21lZGlhX19hdmF0YXJcIiB9LFxuXHRcdFx0dGhpcy5wcm9wcy5hdmF0YXIgPyBSZWFjdC5jcmVhdGVFbGVtZW50KCdpbWcnLCB7IHNyYzogdGhpcy5wcm9wcy5hdmF0YXIgfSkgOiB0aGlzLnByb3BzLmF2YXRhckluaXRpYWxzXG5cdFx0KSA6IG51bGw7XG5cdFx0dmFyIHRodW1ibmFpbCA9IHRoaXMucHJvcHMudGh1bWJuYWlsID8gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdCdkaXYnLFxuXHRcdFx0eyBjbGFzc05hbWU6IFwiSXRlbV9fbWVkaWFfX3RodW1ibmFpbFwiIH0sXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KCdpbWcnLCB7IHNyYzogdGhpcy5wcm9wcy50aHVtYm5haWwgfSlcblx0XHQpIDogbnVsbDtcblxuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0J2RpdicsXG5cdFx0XHR7IGNsYXNzTmFtZTogY2xhc3NOYW1lIH0sXG5cdFx0XHRpY29uLFxuXHRcdFx0YXZhdGFyLFxuXHRcdFx0dGh1bWJuYWlsXG5cdFx0KTtcblx0fVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2xhc3NuYW1lcyA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKTtcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0L2FkZG9ucycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6ICdJdGVtTm90ZScsXG5cdHByb3BUeXBlczoge1xuXHRcdGNsYXNzTmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0XHRpY29uOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRcdGxhYmVsOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRcdHR5cGU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmdcblx0fSxcblx0Z2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiBnZXREZWZhdWx0UHJvcHMoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHR5cGU6ICdkZWZhdWx0J1xuXHRcdH07XG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdHZhciBjbGFzc05hbWUgPSBjbGFzc25hbWVzKCdJdGVtX19ub3RlJywgJ0l0ZW1fX25vdGUtLScgKyB0aGlzLnByb3BzLnR5cGUsIHRoaXMucHJvcHMuY2xhc3NOYW1lKTtcblxuXHRcdC8vIGVsZW1lbnRzXG5cdFx0dmFyIGxhYmVsID0gdGhpcy5wcm9wcy5sYWJlbCA/IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHQnZGl2Jyxcblx0XHRcdHsgY2xhc3NOYW1lOiBcIkl0ZW1fX25vdGVfX2xhYmVsXCIgfSxcblx0XHRcdHRoaXMucHJvcHMubGFiZWxcblx0XHQpIDogbnVsbDtcblx0XHR2YXIgaWNvbiA9IHRoaXMucHJvcHMuaWNvbiA/IFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgY2xhc3NOYW1lOiAnSXRlbV9fbm90ZV9faWNvbiAnICsgdGhpcy5wcm9wcy5pY29uIH0pIDogbnVsbDtcblxuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0J2RpdicsXG5cdFx0XHR7IGNsYXNzTmFtZTogY2xhc3NOYW1lIH0sXG5cdFx0XHRsYWJlbCxcblx0XHRcdGljb25cblx0XHQpO1xuXHR9XG59KTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbnZhciBibGFja2xpc3QgPSByZXF1aXJlKCdibGFja2xpc3QnKTtcbnZhciBjbGFzc25hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QvYWRkb25zJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogJ0l0ZW1TdWJUaXRsZScsXG5cdHByb3BUeXBlczoge1xuXHRcdGNoaWxkcmVuOiBSZWFjdC5Qcm9wVHlwZXMubm9kZS5pc1JlcXVpcmVkLFxuXHRcdGNsYXNzTmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHR2YXIgY2xhc3NOYW1lID0gY2xhc3NuYW1lcygnSXRlbV9fc3VidGl0bGUnLCB0aGlzLnByb3BzLmNsYXNzTmFtZSk7XG5cdFx0dmFyIHByb3BzID0gYmxhY2tsaXN0KHRoaXMucHJvcHMsICdjbGFzc05hbWUnKTtcblxuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCBfZXh0ZW5kcyh7IGNsYXNzTmFtZTogY2xhc3NOYW1lIH0sIHByb3BzKSk7XG5cdH1cbn0pOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxudmFyIGJsYWNrbGlzdCA9IHJlcXVpcmUoJ2JsYWNrbGlzdCcpO1xudmFyIGNsYXNzbmFtZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyk7XG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdC9hZGRvbnMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnSXRlbVRpdGxlJyxcblx0cHJvcFR5cGVzOiB7XG5cdFx0Y2hpbGRyZW46IFJlYWN0LlByb3BUeXBlcy5ub2RlLmlzUmVxdWlyZWQsXG5cdFx0Y2xhc3NOYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdHZhciBjbGFzc05hbWUgPSBjbGFzc25hbWVzKCdJdGVtX190aXRsZScsIHRoaXMucHJvcHMuY2xhc3NOYW1lKTtcblx0XHR2YXIgcHJvcHMgPSBibGFja2xpc3QodGhpcy5wcm9wcywgJ2NsYXNzTmFtZScpO1xuXG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIF9leHRlbmRzKHsgY2xhc3NOYW1lOiBjbGFzc05hbWUgfSwgcHJvcHMpKTtcblx0fVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfYmxhY2tsaXN0ID0gcmVxdWlyZSgnYmxhY2tsaXN0Jyk7XG5cbnZhciBfYmxhY2tsaXN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2JsYWNrbGlzdCk7XG5cbnZhciBfRmllbGRDb250cm9sID0gcmVxdWlyZSgnLi9GaWVsZENvbnRyb2wnKTtcblxudmFyIF9GaWVsZENvbnRyb2wyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfRmllbGRDb250cm9sKTtcblxudmFyIF9GaWVsZExhYmVsID0gcmVxdWlyZSgnLi9GaWVsZExhYmVsJyk7XG5cbnZhciBfRmllbGRMYWJlbDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9GaWVsZExhYmVsKTtcblxudmFyIF9JdGVtID0gcmVxdWlyZSgnLi9JdGVtJyk7XG5cbnZhciBfSXRlbTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9JdGVtKTtcblxudmFyIF9JdGVtSW5uZXIgPSByZXF1aXJlKCcuL0l0ZW1Jbm5lcicpO1xuXG52YXIgX0l0ZW1Jbm5lcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9JdGVtSW5uZXIpO1xuXG52YXIgX3JlYWN0QWRkb25zID0gcmVxdWlyZSgncmVhY3QvYWRkb25zJyk7XG5cbnZhciBfcmVhY3RBZGRvbnMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3RBZGRvbnMpO1xuXG52YXIgX3JlYWN0VGFwcGFibGUgPSByZXF1aXJlKCdyZWFjdC10YXBwYWJsZScpO1xuXG4vLyBNYW55IGlucHV0IHR5cGVzIERPIE5PVCBzdXBwb3J0IHNldFNlbGVjdGlvblJhbmdlLlxuLy8gRW1haWwgd2lsbCBzaG93IGFuIGVycm9yIG9uIG1vc3QgZGVza3RvcCBicm93c2VycyBidXQgd29ya3Mgb25cbi8vIG1vYmlsZSBzYWZhcmkgKyBXS1dlYlZpZXcsIHdoaWNoIGlzIHJlYWxseSB3aGF0IHdlIGNhcmUgYWJvdXRcblxudmFyIF9yZWFjdFRhcHBhYmxlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0VGFwcGFibGUpO1xuXG52YXIgU0VMRUNUQUJMRV9JTlBVVF9UWVBFUyA9IHtcblx0J2VtYWlsJzogdHJ1ZSxcblx0J3Bhc3N3b3JkJzogdHJ1ZSxcblx0J3NlYXJjaCc6IHRydWUsXG5cdCd0ZWwnOiB0cnVlLFxuXHQndGV4dCc6IHRydWUsXG5cdCd1cmwnOiB0cnVlXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IF9yZWFjdEFkZG9uczJbJ2RlZmF1bHQnXS5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnTGFiZWxJbnB1dCcsXG5cblx0cHJvcFR5cGVzOiB7XG5cdFx0YWxpZ25Ub3A6IF9yZWFjdEFkZG9uczJbJ2RlZmF1bHQnXS5Qcm9wVHlwZXMuYm9vbCxcblx0XHRjaGlsZHJlbjogX3JlYWN0QWRkb25zMlsnZGVmYXVsdCddLlByb3BUeXBlcy5ub2RlLFxuXHRcdGNsYXNzTmFtZTogX3JlYWN0QWRkb25zMlsnZGVmYXVsdCddLlByb3BUeXBlcy5zdHJpbmcsXG5cdFx0ZGlzYWJsZWQ6IF9yZWFjdEFkZG9uczJbJ2RlZmF1bHQnXS5Qcm9wVHlwZXMuYm9vbCxcblx0XHRsYWJlbDogX3JlYWN0QWRkb25zMlsnZGVmYXVsdCddLlByb3BUeXBlcy5zdHJpbmcsXG5cdFx0cmVhZE9ubHk6IF9yZWFjdEFkZG9uczJbJ2RlZmF1bHQnXS5Qcm9wVHlwZXMuYm9vbCxcblx0XHR2YWx1ZTogX3JlYWN0QWRkb25zMlsnZGVmYXVsdCddLlByb3BUeXBlcy5zdHJpbmdcblx0fSxcblxuXHRnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uIGdldERlZmF1bHRQcm9wcygpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVhZE9ubHk6IGZhbHNlXG5cdFx0fTtcblx0fSxcblxuXHRtb3ZlQ3Vyc29yVG9FbmQ6IGZ1bmN0aW9uIG1vdmVDdXJzb3JUb0VuZCgpIHtcblx0XHR2YXIgdGFyZ2V0ID0gdGhpcy5yZWZzLmZvY3VzVGFyZ2V0LmdldERPTU5vZGUoKTtcblx0XHR2YXIgZW5kT2ZTdHJpbmcgPSB0YXJnZXQudmFsdWUubGVuZ3RoO1xuXG5cdFx0Y29uc29sZS5jb3VudCgnZm9jdXMgJyArIHRhcmdldC50eXBlKTtcblxuXHRcdGlmIChTRUxFQ1RBQkxFX0lOUFVUX1RZUEVTLmhhc093blByb3BlcnR5KHRhcmdldC50eXBlKSkge1xuXHRcdFx0dGFyZ2V0LnNldFNlbGVjdGlvblJhbmdlKGVuZE9mU3RyaW5nLCBlbmRPZlN0cmluZyk7XG5cdFx0fVxuXHR9LFxuXG5cdGhhbmRsZUZvY3VzOiBmdW5jdGlvbiBoYW5kbGVGb2N1cygpIHtcblx0XHR0aGlzLm1vdmVDdXJzb3JUb0VuZCgpO1xuXG5cdFx0aWYgKHRoaXMucHJvcHMub25Gb2N1cykge1xuXHRcdFx0dGhpcy5wcm9wcy5vbkZvY3VzKCk7XG5cdFx0fVxuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdHZhciBpbmRlbnRpZmllZEJ5VXNlcklucHV0ID0gdGhpcy5wcm9wcy5pZCB8fCB0aGlzLnByb3BzLmh0bWxGb3I7XG5cblx0XHR2YXIgaW5wdXRQcm9wcyA9ICgwLCBfYmxhY2tsaXN0MlsnZGVmYXVsdCddKSh0aGlzLnByb3BzLCAnYWxpZ25Ub3AnLCAnY2hpbGRyZW4nLCAnZmlyc3QnLCAncmVhZE9ubHknKTtcblx0XHR2YXIgcmVuZGVySW5wdXQgPSB0aGlzLnByb3BzLnJlYWRPbmx5ID8gX3JlYWN0QWRkb25zMlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHQnZGl2Jyxcblx0XHRcdHsgY2xhc3NOYW1lOiBcImZpZWxkIHUtc2VsZWN0YWJsZVwiIH0sXG5cdFx0XHR0aGlzLnByb3BzLnZhbHVlXG5cdFx0KSA6IF9yZWFjdEFkZG9uczJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KCdpbnB1dCcsIF9leHRlbmRzKHsgcmVmOiBcImZvY3VzVGFyZ2V0XCIsIGNsYXNzTmFtZTogXCJmaWVsZFwiLCB0eXBlOiBcInRleHRcIiB9LCBpbnB1dFByb3BzKSk7XG5cblx0XHRyZXR1cm4gX3JlYWN0QWRkb25zMlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRfSXRlbTJbJ2RlZmF1bHQnXSxcblx0XHRcdHsgYWxpZ25Ub3A6IHRoaXMucHJvcHMuYWxpZ25Ub3AsIHNlbGVjdGFibGU6IHRoaXMucHJvcHMuZGlzYWJsZWQsIGNsYXNzTmFtZTogdGhpcy5wcm9wcy5jbGFzc05hbWUsIGNvbXBvbmVudDogXCJsYWJlbFwiIH0sXG5cdFx0XHRfcmVhY3RBZGRvbnMyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChcblx0XHRcdFx0X0l0ZW1Jbm5lcjJbJ2RlZmF1bHQnXSxcblx0XHRcdFx0bnVsbCxcblx0XHRcdFx0X3JlYWN0QWRkb25zMlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0X3JlYWN0VGFwcGFibGUyWydkZWZhdWx0J10sXG5cdFx0XHRcdFx0eyBvblRhcDogdGhpcy5oYW5kbGVGb2N1cywgY2xhc3NOYW1lOiBcIkZpZWxkTGFiZWxcIiB9LFxuXHRcdFx0XHRcdHRoaXMucHJvcHMubGFiZWxcblx0XHRcdFx0KSxcblx0XHRcdFx0X3JlYWN0QWRkb25zMlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0X0ZpZWxkQ29udHJvbDJbJ2RlZmF1bHQnXSxcblx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdHJlbmRlcklucHV0LFxuXHRcdFx0XHRcdHRoaXMucHJvcHMuY2hpbGRyZW5cblx0XHRcdFx0KVxuXHRcdFx0KVxuXHRcdCk7XG5cdH1cbn0pOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIEZpZWxkQ29udHJvbCA9IHJlcXVpcmUoJy4vRmllbGRDb250cm9sJyk7XG52YXIgRmllbGRMYWJlbCA9IHJlcXVpcmUoJy4vRmllbGRMYWJlbCcpO1xudmFyIEl0ZW0gPSByZXF1aXJlKCcuL0l0ZW0nKTtcbnZhciBJdGVtSW5uZXIgPSByZXF1aXJlKCcuL0l0ZW1Jbm5lcicpO1xudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QvYWRkb25zJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogJ0xhYmVsU2VsZWN0Jyxcblx0cHJvcFR5cGVzOiB7XG5cdFx0YWxpZ25Ub3A6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuXHRcdGNsYXNzTmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0XHRkaXNhYmxlZDogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG5cdFx0Zmlyc3Q6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuXHRcdGxhYmVsOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRcdG9wdGlvbnM6IFJlYWN0LlByb3BUeXBlcy5hcnJheSxcblx0XHR2YWx1ZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0XHRvbkNoYW5nZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxuXHR9LFxuXG5cdGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24gZ2V0RGVmYXVsdFByb3BzKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRjbGFzc05hbWU6ICcnXG5cdFx0fTtcblx0fSxcblxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSgpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dmFsdWU6IHRoaXMucHJvcHMudmFsdWVcblx0XHR9O1xuXHR9LFxuXG5cdC8vdXBkYXRlSW5wdXRWYWx1ZTogZnVuY3Rpb24gdXBkYXRlSW5wdXRWYWx1ZShldmVudCkge1xuXHQvL1x0dGhpcy5zZXRTdGF0ZSh7XG5cdC8vXHRcdHZhbHVlOiBldmVudC50YXJnZXQudmFsdWVcblx0Ly9cdH0pO1xuXHQvL30sXG5cblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0Ly8gTWFwIE9wdGlvbnNcblx0XHR2YXIgb3B0aW9ucyA9IHRoaXMucHJvcHMub3B0aW9ucy5tYXAoZnVuY3Rpb24gKG9wKSB7XG5cdFx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0J29wdGlvbicsXG5cdFx0XHRcdHsga2V5OiAnb3B0aW9uLScgKyBvcC52YWx1ZSwgdmFsdWU6IG9wLnZhbHVlIH0sXG5cdFx0XHRcdG9wLmxhYmVsXG5cdFx0XHQpO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRJdGVtLFxuXHRcdFx0eyBhbGlnblRvcDogdGhpcy5wcm9wcy5hbGlnblRvcCwgc2VsZWN0YWJsZTogdGhpcy5wcm9wcy5kaXNhYmxlZCwgY2xhc3NOYW1lOiB0aGlzLnByb3BzLmNsYXNzTmFtZSwgY29tcG9uZW50OiBcImxhYmVsXCIgfSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdEl0ZW1Jbm5lcixcblx0XHRcdFx0bnVsbCxcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHRGaWVsZExhYmVsLFxuXHRcdFx0XHRcdG51bGwsXG5cdFx0XHRcdFx0dGhpcy5wcm9wcy5sYWJlbFxuXHRcdFx0XHQpLFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdEZpZWxkQ29udHJvbCxcblx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0XHQnc2VsZWN0Jyxcblx0XHRcdFx0XHRcdHsgdmFsdWU6IHRoaXMucHJvcHMudmFsdWUsIG9uQ2hhbmdlOiB0aGlzLnByb3BzLm9uQ2hhbmdlLCBjbGFzc05hbWU6IFwic2VsZWN0LWZpZWxkXCIgfSxcblx0XHRcdFx0XHRcdG9wdGlvbnNcblx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0XHRcdHsgY2xhc3NOYW1lOiBcInNlbGVjdC1maWVsZC1pbmRpY2F0b3JcIiB9LFxuXHRcdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBjbGFzc05hbWU6IFwic2VsZWN0LWZpZWxkLWluZGljYXRvci1hcnJvd1wiIH0pXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHQpXG5cdFx0XHQpXG5cdFx0KTtcblx0fVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG52YXIgYmxhY2tsaXN0ID0gcmVxdWlyZSgnYmxhY2tsaXN0Jyk7XG52YXIgY2xhc3NuYW1lcyA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKTtcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0L2FkZG9ucycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6ICdMYWJlbFRleHRhcmVhJyxcblxuXHRwcm9wVHlwZXM6IHtcblx0XHRjaGlsZHJlbjogUmVhY3QuUHJvcFR5cGVzLm5vZGUsXG5cdFx0Y2xhc3NOYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRcdGRpc2FibGVkOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcblx0XHRmaXJzdDogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG5cdFx0bGFiZWw6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdFx0cmVhZE9ubHk6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuXHRcdHZhbHVlOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG5cdH0sXG5cblx0Z2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiBnZXREZWZhdWx0UHJvcHMoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJvd3M6IDNcblx0XHR9O1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdHZhciBjbGFzc05hbWUgPSBjbGFzc25hbWVzKHRoaXMucHJvcHMuY2xhc3NOYW1lLCAnbGlzdC1pdGVtJywgJ2ZpZWxkLWl0ZW0nLCAnYWxpZ24tdG9wJywge1xuXHRcdFx0J2lzLWZpcnN0JzogdGhpcy5wcm9wcy5maXJzdCxcblx0XHRcdCd1LXNlbGVjdGFibGUnOiB0aGlzLnByb3BzLmRpc2FibGVkXG5cdFx0fSk7XG5cblx0XHR2YXIgcHJvcHMgPSBibGFja2xpc3QodGhpcy5wcm9wcywgJ2NoaWxkcmVuJywgJ2NsYXNzTmFtZScsICdkaXNhYmxlZCcsICdmaXJzdCcsICdsYWJlbCcsICdyZWFkT25seScpO1xuXG5cdFx0dmFyIHJlbmRlcklucHV0ID0gdGhpcy5wcm9wcy5yZWFkT25seSA/IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHQnZGl2Jyxcblx0XHRcdHsgY2xhc3NOYW1lOiBcImZpZWxkIHUtc2VsZWN0YWJsZVwiIH0sXG5cdFx0XHR0aGlzLnByb3BzLnZhbHVlXG5cdFx0KSA6IFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJywgX2V4dGVuZHMoe30sIHByb3BzLCB7IGNsYXNzTmFtZTogXCJmaWVsZFwiIH0pKTtcblxuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0J2RpdicsXG5cdFx0XHR7IGNsYXNzTmFtZTogY2xhc3NOYW1lIH0sXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHQnbGFiZWwnLFxuXHRcdFx0XHR7IGNsYXNzTmFtZTogXCJpdGVtLWlubmVyXCIgfSxcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0XHR7IGNsYXNzTmFtZTogXCJmaWVsZC1sYWJlbFwiIH0sXG5cdFx0XHRcdFx0dGhpcy5wcm9wcy5sYWJlbFxuXHRcdFx0XHQpLFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRcdHsgY2xhc3NOYW1lOiBcImZpZWxkLWNvbnRyb2xcIiB9LFxuXHRcdFx0XHRcdHJlbmRlcklucHV0LFxuXHRcdFx0XHRcdHRoaXMucHJvcHMuY2hpbGRyZW5cblx0XHRcdFx0KVxuXHRcdFx0KVxuXHRcdCk7XG5cdH1cbn0pOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIGJsYWNrbGlzdCA9IHJlcXVpcmUoJ2JsYWNrbGlzdCcpO1xudmFyIGNsYXNzTmFtZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogJ0xpc3RIZWFkZXInLFxuXG5cdHByb3BUeXBlczoge1xuXHRcdGNsYXNzTmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0XHRzdGlja3k6IFJlYWN0LlByb3BUeXBlcy5ib29sXG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0dmFyIGNsYXNzTmFtZSA9IGNsYXNzTmFtZXMoJ2xpc3QtaGVhZGVyJywge1xuXHRcdFx0J3N0aWNreSc6IHRoaXMucHJvcHMuc3RpY2t5XG5cdFx0fSwgdGhpcy5wcm9wcy5jbGFzc05hbWUpO1xuXG5cdFx0dmFyIHByb3BzID0gYmxhY2tsaXN0KHRoaXMucHJvcHMsICdzdGlja3knKTtcblxuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCBfZXh0ZW5kcyh7IGNsYXNzTmFtZTogY2xhc3NOYW1lIH0sIHByb3BzKSk7XG5cdH1cbn0pOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuXHR2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbnZhciBjbGFzc05hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QvYWRkb25zJyk7XG52YXIgVGFwcGFibGUgPSByZXF1aXJlKCdyZWFjdC10YXBwYWJsZScpO1xudmFyIFRyYW5zaXRpb24gPSBSZWFjdC5hZGRvbnMuQ1NTVHJhbnNpdGlvbkdyb3VwO1xuXG52YXIgRElSRUNUSU9OUyA9IHtcblx0J3JldmVhbC1mcm9tLXJpZ2h0JzogLTEsXG5cdCdzaG93LWZyb20tbGVmdCc6IC0xLFxuXHQnc2hvdy1mcm9tLXJpZ2h0JzogMSxcblx0J3JldmVhbC1mcm9tLWxlZnQnOiAxXG59O1xuXG52YXIgZGVmYXVsdENvbnRyb2xsZXJTdGF0ZSA9IHtcblx0ZGlyZWN0aW9uOiAwLFxuXHRmYWRlOiBmYWxzZSxcblx0bGVmdEFycm93OiBmYWxzZSxcblx0bGVmdEJ1dHRvbkRpc2FibGVkOiBmYWxzZSxcblx0bGVmdEljb246ICcnLFxuXHRsZWZ0TGFiZWw6ICcnLFxuXHRsZWZ0QWN0aW9uOiBudWxsLFxuXHRyaWdodEFycm93OiBmYWxzZSxcblx0cmlnaHRCdXR0b25EaXNhYmxlZDogZmFsc2UsXG5cdHJpZ2h0SWNvbjogJycsXG5cdHJpZ2h0TGFiZWw6ICcnLFxuXHRyaWdodEFjdGlvbjogbnVsbCxcblx0dGl0bGU6ICcnXG59O1xuXG5mdW5jdGlvbiBuZXdTdGF0ZShmcm9tKSB7XG5cdHZhciBucyA9IF9leHRlbmRzKHt9LCBkZWZhdWx0Q29udHJvbGxlclN0YXRlKTtcblx0aWYgKGZyb20pIF9leHRlbmRzKG5zLCBmcm9tKTtcblx0ZGVsZXRlIG5zLm5hbWU7IC8vIG1heSBsZWFrIGZyb20gcHJvcHNcblx0cmV0dXJuIG5zO1xufVxuXG52YXIgTmF2aWdhdGlvbkJhciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6ICdOYXZpZ2F0aW9uQmFyJyxcblxuXHRjb250ZXh0VHlwZXM6IHtcblx0XHRhcHA6IFJlYWN0LlByb3BUeXBlcy5vYmplY3Rcblx0fSxcblxuXHRwcm9wVHlwZXM6IHtcblx0XHRuYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG5cdH0sXG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKSB7XG5cdFx0cmV0dXJuIG5ld1N0YXRlKHRoaXMucHJvcHMpO1xuXHR9LFxuXG5cdGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcblx0XHRpZiAodGhpcy5wcm9wcy5uYW1lKSB7XG5cdFx0XHR0aGlzLmNvbnRleHQuYXBwLm5hdmlnYXRpb25CYXJzW3RoaXMucHJvcHMubmFtZV0gPSB0aGlzO1xuXHRcdH1cblx0fSxcblxuXHRjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24gY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG5cdFx0aWYgKHRoaXMucHJvcHMubmFtZSkge1xuXHRcdFx0ZGVsZXRlIHRoaXMuY29udGV4dC5hcHAubmF2aWdhdGlvbkJhcnNbdGhpcy5wcm9wcy5uYW1lXTtcblx0XHR9XG5cdH0sXG5cblx0Y29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24gY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcblx0XHR0aGlzLnNldFN0YXRlKG5ld1N0YXRlKG5leHRQcm9wcykpO1xuXHRcdGlmIChuZXh0UHJvcHMubmFtZSAhPT0gdGhpcy5wcm9wcy5uYW1lKSB7XG5cdFx0XHRpZiAobmV4dFByb3BzLm5hbWUpIHtcblx0XHRcdFx0dGhpcy5jb250ZXh0LmFwcC5uYXZpZ2F0aW9uQmFyc1tuZXh0UHJvcHMubmFtZV0gPSB0aGlzO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHRoaXMucHJvcHMubmFtZSkge1xuXHRcdFx0XHRkZWxldGUgdGhpcy5jb250ZXh0LmFwcC5uYXZpZ2F0aW9uQmFyc1t0aGlzLnByb3BzLm5hbWVdO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHR1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShzdGF0ZSkge1xuXHRcdC8vIEZJWE1FOiB3aGF0IGlzIGhhcHBlbmluZyBoZXJlXG5cdFx0c3RhdGUgPSBuZXdTdGF0ZShzdGF0ZSk7XG5cdFx0dGhpcy5zZXRTdGF0ZShuZXdTdGF0ZShzdGF0ZSkpO1xuXHR9LFxuXG5cdHVwZGF0ZVdpdGhUcmFuc2l0aW9uOiBmdW5jdGlvbiB1cGRhdGVXaXRoVHJhbnNpdGlvbihzdGF0ZSwgdHJhbnNpdGlvbikge1xuXHRcdHN0YXRlID0gbmV3U3RhdGUoc3RhdGUpO1xuXHRcdHN0YXRlLmRpcmVjdGlvbiA9IERJUkVDVElPTlNbdHJhbnNpdGlvbl0gfHwgMDtcblxuXHRcdGlmICh0cmFuc2l0aW9uID09PSAnZmFkZScgfHwgdHJhbnNpdGlvbiA9PT0gJ2ZhZGUtY29udHJhY3QnIHx8IHRyYW5zaXRpb24gPT09ICdmYWRlLWV4cGFuZCcpIHtcblx0XHRcdHN0YXRlLmZhZGUgPSB0cnVlO1xuXHRcdH1cblxuXHRcdHRoaXMuc2V0U3RhdGUoc3RhdGUpO1xuXHR9LFxuXG5cdHJlbmRlckxlZnRCdXR0b246IGZ1bmN0aW9uIHJlbmRlckxlZnRCdXR0b24oKSB7XG5cdFx0dmFyIGNsYXNzTmFtZSA9IGNsYXNzTmFtZXMoJ05hdmlnYXRpb25CYXJMZWZ0QnV0dG9uJywge1xuXHRcdFx0J2hhcy1hcnJvdyc6IHRoaXMuc3RhdGUubGVmdEFycm93XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFRhcHBhYmxlLFxuXHRcdFx0eyBvblRhcDogdGhpcy5zdGF0ZS5sZWZ0QWN0aW9uLCBjbGFzc05hbWU6IGNsYXNzTmFtZSwgZGlzYWJsZWQ6IHRoaXMuc3RhdGUubGVmdEJ1dHRvbkRpc2FibGVkLCBjb21wb25lbnQ6IFwiYnV0dG9uXCIgfSxcblx0XHRcdHRoaXMucmVuZGVyTGVmdEFycm93KCksXG5cdFx0XHR0aGlzLnJlbmRlckxlZnRMYWJlbCgpXG5cdFx0KTtcblx0fSxcblxuXHRyZW5kZXJMZWZ0QXJyb3c6IGZ1bmN0aW9uIHJlbmRlckxlZnRBcnJvdygpIHtcblx0XHR2YXIgdHJhbnNpdGlvbk5hbWUgPSAnTmF2aWdhdGlvbkJhclRyYW5zaXRpb24tSW5zdGFudCc7XG5cdFx0aWYgKHRoaXMuc3RhdGUuZmFkZSB8fCB0aGlzLnN0YXRlLmRpcmVjdGlvbikge1xuXHRcdFx0dHJhbnNpdGlvbk5hbWUgPSAnTmF2aWdhdGlvbkJhclRyYW5zaXRpb24tRmFkZSc7XG5cdFx0fVxuXG5cdFx0dmFyIGFycm93ID0gdGhpcy5zdGF0ZS5sZWZ0QXJyb3cgPyBSZWFjdC5jcmVhdGVFbGVtZW50KCdzcGFuJywgeyBjbGFzc05hbWU6IFwiTmF2aWdhdGlvbkJhckxlZnRBcnJvd1wiIH0pIDogbnVsbDtcblxuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0VHJhbnNpdGlvbixcblx0XHRcdHsgdHJhbnNpdGlvbk5hbWU6IHRyYW5zaXRpb25OYW1lIH0sXG5cdFx0XHRhcnJvd1xuXHRcdCk7XG5cdH0sXG5cblx0cmVuZGVyTGVmdExhYmVsOiBmdW5jdGlvbiByZW5kZXJMZWZ0TGFiZWwoKSB7XG5cdFx0dmFyIHRyYW5zaXRpb25OYW1lID0gJ05hdmlnYXRpb25CYXJUcmFuc2l0aW9uLUluc3RhbnQnO1xuXHRcdGlmICh0aGlzLnN0YXRlLmZhZGUpIHtcblx0XHRcdHRyYW5zaXRpb25OYW1lID0gJ05hdmlnYXRpb25CYXJUcmFuc2l0aW9uLUZhZGUnO1xuXHRcdH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5kaXJlY3Rpb24gPiAwKSB7XG5cdFx0XHR0cmFuc2l0aW9uTmFtZSA9ICdOYXZpZ2F0aW9uQmFyVHJhbnNpdGlvbi1Gb3J3YXJkcyc7XG5cdFx0fSBlbHNlIGlmICh0aGlzLnN0YXRlLmRpcmVjdGlvbiA8IDApIHtcblx0XHRcdHRyYW5zaXRpb25OYW1lID0gJ05hdmlnYXRpb25CYXJUcmFuc2l0aW9uLUJhY2t3YXJkcyc7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRUcmFuc2l0aW9uLFxuXHRcdFx0eyB0cmFuc2l0aW9uTmFtZTogdHJhbnNpdGlvbk5hbWUgfSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdzcGFuJyxcblx0XHRcdFx0eyBrZXk6IERhdGUubm93KCksIGNsYXNzTmFtZTogXCJOYXZpZ2F0aW9uQmFyTGVmdExhYmVsXCIgfSxcblx0XHRcdFx0dGhpcy5zdGF0ZS5sZWZ0TGFiZWxcblx0XHRcdClcblx0XHQpO1xuXHR9LFxuXG5cdHJlbmRlclRpdGxlOiBmdW5jdGlvbiByZW5kZXJUaXRsZSgpIHtcblx0XHR2YXIgdGl0bGUgPSB0aGlzLnN0YXRlLnRpdGxlID8gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdCdzcGFuJyxcblx0XHRcdHsga2V5OiBEYXRlLm5vdygpLCBjbGFzc05hbWU6IFwiTmF2aWdhdGlvbkJhclRpdGxlXCIgfSxcblx0XHRcdHRoaXMuc3RhdGUudGl0bGVcblx0XHQpIDogbnVsbDtcblx0XHR2YXIgdHJhbnNpdGlvbk5hbWUgPSAnTmF2aWdhdGlvbkJhclRyYW5zaXRpb24tSW5zdGFudCc7XG5cdFx0aWYgKHRoaXMuc3RhdGUuZmFkZSkge1xuXHRcdFx0dHJhbnNpdGlvbk5hbWUgPSAnTmF2aWdhdGlvbkJhclRyYW5zaXRpb24tRmFkZSc7XG5cdFx0fSBlbHNlIGlmICh0aGlzLnN0YXRlLmRpcmVjdGlvbiA+IDApIHtcblx0XHRcdHRyYW5zaXRpb25OYW1lID0gJ05hdmlnYXRpb25CYXJUcmFuc2l0aW9uLUZvcndhcmRzJztcblx0XHR9IGVsc2UgaWYgKHRoaXMuc3RhdGUuZGlyZWN0aW9uIDwgMCkge1xuXHRcdFx0dHJhbnNpdGlvbk5hbWUgPSAnTmF2aWdhdGlvbkJhclRyYW5zaXRpb24tQmFja3dhcmRzJztcblx0XHR9XG5cblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFRyYW5zaXRpb24sXG5cdFx0XHR7IHRyYW5zaXRpb25OYW1lOiB0cmFuc2l0aW9uTmFtZSB9LFxuXHRcdFx0dGl0bGVcblx0XHQpO1xuXHR9LFxuXG5cdHJlbmRlclJpZ2h0QnV0dG9uOiBmdW5jdGlvbiByZW5kZXJSaWdodEJ1dHRvbigpIHtcblx0XHR2YXIgdHJhbnNpdGlvbk5hbWUgPSAnTmF2aWdhdGlvbkJhclRyYW5zaXRpb24tSW5zdGFudCc7XG5cdFx0aWYgKHRoaXMuc3RhdGUuZmFkZSB8fCB0aGlzLnN0YXRlLmRpcmVjdGlvbikge1xuXHRcdFx0dHJhbnNpdGlvbk5hbWUgPSAnTmF2aWdhdGlvbkJhclRyYW5zaXRpb24tRmFkZSc7XG5cdFx0fVxuXHRcdHZhciBidXR0b24gPSB0aGlzLnN0YXRlLnJpZ2h0SWNvbiB8fCB0aGlzLnN0YXRlLnJpZ2h0TGFiZWwgPyBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0VGFwcGFibGUsXG5cdFx0XHR7IGtleTogRGF0ZS5ub3coKSwgb25UYXA6IHRoaXMuc3RhdGUucmlnaHRBY3Rpb24sIGNsYXNzTmFtZTogXCJOYXZpZ2F0aW9uQmFyUmlnaHRCdXR0b25cIiwgZGlzYWJsZWQ6IHRoaXMuc3RhdGUucmlnaHRCdXR0b25EaXNhYmxlZCwgY29tcG9uZW50OiBcImJ1dHRvblwiIH0sXG5cdFx0XHR0aGlzLnJlbmRlclJpZ2h0TGFiZWwoKSxcblx0XHRcdHRoaXMucmVuZGVyUmlnaHRJY29uKClcblx0XHQpIDogbnVsbDtcblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFRyYW5zaXRpb24sXG5cdFx0XHR7IHRyYW5zaXRpb25OYW1lOiB0cmFuc2l0aW9uTmFtZSB9LFxuXHRcdFx0YnV0dG9uXG5cdFx0KTtcblx0fSxcblxuXHRyZW5kZXJSaWdodEljb246IGZ1bmN0aW9uIHJlbmRlclJpZ2h0SWNvbigpIHtcblx0XHRpZiAoIXRoaXMuc3RhdGUucmlnaHRJY29uKSByZXR1cm4gbnVsbDtcblxuXHRcdHZhciBjbGFzc05hbWUgPSBjbGFzc05hbWVzKCdOYXZpZ2F0aW9uQmFyUmlnaHRJY29uJywgdGhpcy5zdGF0ZS5yaWdodEljb24pO1xuXG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nLCB7IGNsYXNzTmFtZTogY2xhc3NOYW1lIH0pO1xuXHR9LFxuXG5cdHJlbmRlclJpZ2h0TGFiZWw6IGZ1bmN0aW9uIHJlbmRlclJpZ2h0TGFiZWwoKSB7XG5cdFx0cmV0dXJuIHRoaXMuc3RhdGUucmlnaHRMYWJlbCA/IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHQnc3BhbicsXG5cdFx0XHR7IGtleTogRGF0ZS5ub3coKSwgY2xhc3NOYW1lOiBcIk5hdmlnYXRpb25CYXJSaWdodExhYmVsXCIgfSxcblx0XHRcdHRoaXMuc3RhdGUucmlnaHRMYWJlbFxuXHRcdCkgOiBudWxsO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0J2RpdicsXG5cdFx0XHR7IGNsYXNzTmFtZTogXCJOYXZpZ2F0aW9uQmFyXCIgfSxcblx0XHRcdHRoaXMucmVuZGVyTGVmdEJ1dHRvbigpLFxuXHRcdFx0dGhpcy5yZW5kZXJUaXRsZSgpLFxuXHRcdFx0dGhpcy5yZW5kZXJSaWdodEJ1dHRvbigpXG5cdFx0KTtcblx0fVxufSk7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IE5hdmlnYXRpb25CYXI7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0L2FkZG9ucycpO1xudmFyIFJlYWN0Q1NTVHJhbnNpdGlvbkdyb3VwID0gUmVhY3QuYWRkb25zLkNTU1RyYW5zaXRpb25Hcm91cDtcblxudmFyIGNsYXNzbmFtZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogJ1BvcHVwJyxcblxuXHRwcm9wVHlwZXM6IHtcblx0XHRjaGlsZHJlbjogUmVhY3QuUHJvcFR5cGVzLm5vZGUsXG5cdFx0Y2xhc3NOYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRcdHZpc2libGU6IFJlYWN0LlByb3BUeXBlcy5ib29sXG5cdH0sXG5cblx0Z2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiBnZXREZWZhdWx0UHJvcHMoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHRyYW5zaXRpb246ICdub25lJ1xuXHRcdH07XG5cdH0sXG5cblx0cmVuZGVyQmFja2Ryb3A6IGZ1bmN0aW9uIHJlbmRlckJhY2tkcm9wKCkge1xuXHRcdGlmICghdGhpcy5wcm9wcy52aXNpYmxlKSByZXR1cm4gbnVsbDtcblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBjbGFzc05hbWU6IFwiUG9wdXAtYmFja2Ryb3BcIiB9KTtcblx0fSxcblxuXHRyZW5kZXJEaWFsb2c6IGZ1bmN0aW9uIHJlbmRlckRpYWxvZygpIHtcblx0XHRpZiAoIXRoaXMucHJvcHMudmlzaWJsZSkgcmV0dXJuIG51bGw7XG5cblx0XHQvLyBTZXQgY2xhc3NuYW1lc1xuXHRcdHZhciBkaWFsb2dDbGFzc05hbWUgPSBjbGFzc25hbWVzKCdQb3B1cC1kaWFsb2cnLCB0aGlzLnByb3BzLmNsYXNzTmFtZSk7XG5cblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdCdkaXYnLFxuXHRcdFx0eyBjbGFzc05hbWU6IGRpYWxvZ0NsYXNzTmFtZSB9LFxuXHRcdFx0dGhpcy5wcm9wcy5jaGlsZHJlblxuXHRcdCk7XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHQnZGl2Jyxcblx0XHRcdHsgY2xhc3NOYW1lOiBcIlBvcHVwXCIgfSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFJlYWN0Q1NTVHJhbnNpdGlvbkdyb3VwLFxuXHRcdFx0XHR7IHRyYW5zaXRpb25OYW1lOiBcIlBvcHVwLWRpYWxvZ1wiLCBjb21wb25lbnQ6IFwiZGl2XCIgfSxcblx0XHRcdFx0dGhpcy5yZW5kZXJEaWFsb2coKVxuXHRcdFx0KSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFJlYWN0Q1NTVHJhbnNpdGlvbkdyb3VwLFxuXHRcdFx0XHR7IHRyYW5zaXRpb25OYW1lOiBcIlBvcHVwLWJhY2tncm91bmRcIiwgY29tcG9uZW50OiBcImRpdlwiIH0sXG5cdFx0XHRcdHRoaXMucmVuZGVyQmFja2Ryb3AoKVxuXHRcdFx0KVxuXHRcdCk7XG5cdH1cbn0pOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QvYWRkb25zJyk7XG52YXIgY2xhc3NOYW1lcyA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnUG9wdXBJY29uJyxcblx0cHJvcFR5cGVzOiB7XG5cdFx0bmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0XHR0eXBlOiBSZWFjdC5Qcm9wVHlwZXMub25lT2YoWydkZWZhdWx0JywgJ211dGVkJywgJ3ByaW1hcnknLCAnc3VjY2VzcycsICd3YXJuaW5nJywgJ2RhbmdlciddKSxcblx0XHRzcGlubmluZzogUmVhY3QuUHJvcFR5cGVzLmJvb2xcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHR2YXIgY2xhc3NOYW1lID0gY2xhc3NOYW1lcygnUG9wdXBJY29uJywge1xuXHRcdFx0J2lzLXNwaW5uaW5nJzogdGhpcy5wcm9wcy5zcGlubmluZ1xuXHRcdH0sIHRoaXMucHJvcHMubmFtZSwgdGhpcy5wcm9wcy50eXBlKTtcblxuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IGNsYXNzTmFtZTogY2xhc3NOYW1lIH0pO1xuXHR9XG59KTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBjbGFzc25hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xudmFyIEl0ZW0gPSByZXF1aXJlKCcuL0l0ZW0nKTtcbnZhciBJdGVtSW5uZXIgPSByZXF1aXJlKCcuL0l0ZW1Jbm5lcicpO1xudmFyIEl0ZW1Ob3RlID0gcmVxdWlyZSgnLi9JdGVtTm90ZScpO1xudmFyIEl0ZW1UaXRsZSA9IHJlcXVpcmUoJy4vSXRlbVRpdGxlJyk7XG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIFRhcHBhYmxlID0gcmVxdWlyZSgncmVhY3QtdGFwcGFibGUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnUmFkaW9MaXN0JyxcblxuXHRwcm9wVHlwZXM6IHtcblx0XHRvcHRpb25zOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcblx0XHR2YWx1ZTogUmVhY3QuUHJvcFR5cGVzLm9uZU9mVHlwZShbUmVhY3QuUHJvcFR5cGVzLnN0cmluZywgUmVhY3QuUHJvcFR5cGVzLm51bWJlcl0pLFxuXHRcdGljb246IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdFx0b25DaGFuZ2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jXG5cdH0sXG5cblx0b25DaGFuZ2U6IGZ1bmN0aW9uIG9uQ2hhbmdlKHZhbHVlKSB7XG5cdFx0dGhpcy5wcm9wcy5vbkNoYW5nZSh2YWx1ZSk7XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdHZhciBvcHRpb25zID0gdGhpcy5wcm9wcy5vcHRpb25zLm1hcChmdW5jdGlvbiAob3AsIGkpIHtcblx0XHRcdHZhciBpY29uQ2xhc3NuYW1lID0gY2xhc3NuYW1lcygnaXRlbS1pY29uIHByaW1hcnknLCBvcC5pY29uKTtcblx0XHRcdHZhciBjaGVja01hcmsgPSBvcC52YWx1ZSA9PT0gc2VsZi5wcm9wcy52YWx1ZSA/IFJlYWN0LmNyZWF0ZUVsZW1lbnQoSXRlbU5vdGUsIHsgdHlwZTogXCJwcmltYXJ5XCIsIGljb246IFwiaW9uLWNoZWNrbWFya1wiIH0pIDogbnVsbDtcblx0XHRcdHZhciBpY29uID0gb3AuaWNvbiA/IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHR7IGNsYXNzTmFtZTogXCJpdGVtLW1lZGlhXCIgfSxcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudCgnc3BhbicsIHsgY2xhc3NOYW1lOiBpY29uQ2xhc3NuYW1lIH0pXG5cdFx0XHQpIDogbnVsbDtcblxuXHRcdFx0ZnVuY3Rpb24gb25DaGFuZ2UoKSB7XG5cdFx0XHRcdHNlbGYub25DaGFuZ2Uob3AudmFsdWUpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0VGFwcGFibGUsXG5cdFx0XHRcdHsga2V5OiAnb3B0aW9uLScgKyBpLCBvblRhcDogb25DaGFuZ2UgfSxcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHRJdGVtLFxuXHRcdFx0XHRcdHsga2V5OiAnb3B0aW9uLScgKyBpLCBvblRhcDogb25DaGFuZ2UgfSxcblx0XHRcdFx0XHRpY29uLFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0XHRJdGVtSW5uZXIsXG5cdFx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHRcdFx0SXRlbVRpdGxlLFxuXHRcdFx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdFx0XHRvcC5sYWJlbFxuXHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdGNoZWNrTWFya1xuXHRcdFx0XHRcdClcblx0XHRcdFx0KVxuXHRcdFx0KTtcblx0XHR9KTtcblxuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0J2RpdicsXG5cdFx0XHRudWxsLFxuXHRcdFx0b3B0aW9uc1xuXHRcdCk7XG5cdH1cbn0pOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJsYWNrbGlzdCA9IHJlcXVpcmUoJ2JsYWNrbGlzdCcpO1xudmFyIGNsYXNzbmFtZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyk7XG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdC9hZGRvbnMnKTtcbnZhciBUYXBwYWJsZSA9IHJlcXVpcmUoJ3JlYWN0LXRhcHBhYmxlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogJ1NlYXJjaEZpZWxkJyxcblx0cHJvcFR5cGVzOiB7XG5cdFx0Y2xhc3NOYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRcdG9uQ2hhbmdlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcblx0XHRvbkNsZWFyOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcblx0XHRwbGFjZWhvbGRlcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0XHR0eXBlOiBSZWFjdC5Qcm9wVHlwZXMub25lT2YoWydkZWZhdWx0JywgJ2RhcmsnXSksXG5cdFx0dmFsdWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmdcblx0fSxcblxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSgpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0aXNGb2N1c2VkOiBmYWxzZVxuXHRcdH07XG5cdH0sXG5cblx0Z2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiBnZXREZWZhdWx0UHJvcHMoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHR5cGU6ICdkZWZhdWx0Jyxcblx0XHRcdHZhbHVlOiAnJ1xuXHRcdH07XG5cdH0sXG5cblx0aGFuZGxlQ2xlYXI6IGZ1bmN0aW9uIGhhbmRsZUNsZWFyKCkge1xuXHRcdHRoaXMucmVmcy5pbnB1dC5nZXRET01Ob2RlKCkuZm9jdXMoKTtcblx0XHR0aGlzLnByb3BzLm9uQ2xlYXIoKTtcblx0fSxcblxuXHRoYW5kbGVDYW5jZWw6IGZ1bmN0aW9uIGhhbmRsZUNhbmNlbCgpIHtcblx0XHR0aGlzLnJlZnMuaW5wdXQuZ2V0RE9NTm9kZSgpLmJsdXIoKTtcblx0XHR0aGlzLnByb3BzLm9uQ2FuY2VsKCk7XG5cdH0sXG5cblx0aGFuZGxlQ2hhbmdlOiBmdW5jdGlvbiBoYW5kbGVDaGFuZ2UoZSkge1xuXHRcdHRoaXMucHJvcHMub25DaGFuZ2UoZS50YXJnZXQudmFsdWUpO1xuXHR9LFxuXG5cdGhhbmRsZUJsdXI6IGZ1bmN0aW9uIGhhbmRsZUJsdXIoZSkge1xuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0aXNGb2N1c2VkOiBmYWxzZVxuXHRcdH0pO1xuXHR9LFxuXG5cdGhhbmRsZUZvY3VzOiBmdW5jdGlvbiBoYW5kbGVGb2N1cyhlKSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRpc0ZvY3VzZWQ6IHRydWVcblx0XHR9KTtcblx0fSxcblxuXHRoYW5kbGVTdWJtaXQ6IGZ1bmN0aW9uIGhhbmRsZVN1Ym1pdChlKSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0dmFyIGlucHV0ID0gdGhpcy5yZWZzLmlucHV0LmdldERPTU5vZGUoKTtcblxuXHRcdGlucHV0LmJsdXIoKTtcblx0XHR0aGlzLnByb3BzLm9uU3VibWl0KGlucHV0LnZhbHVlKTtcblx0fSxcblxuXHRyZW5kZXJDbGVhcjogZnVuY3Rpb24gcmVuZGVyQ2xlYXIoKSB7XG5cdFx0aWYgKCF0aGlzLnByb3BzLnZhbHVlLmxlbmd0aCkgcmV0dXJuO1xuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFRhcHBhYmxlLCB7IGNsYXNzTmFtZTogXCJTZWFyY2hGaWVsZF9faWNvbiBTZWFyY2hGaWVsZF9faWNvbi0tY2xlYXJcIiwgb25UYXA6IHRoaXMuaGFuZGxlQ2xlYXIgfSk7XG5cdH0sXG5cblx0cmVuZGVyQ2FuY2VsOiBmdW5jdGlvbiByZW5kZXJDYW5jZWwoKSB7XG5cdFx0dmFyIGNsYXNzTmFtZSA9IGNsYXNzbmFtZXMoJ1NlYXJjaEZpZWxkX19jYW5jZWwnLCB7XG5cdFx0XHQnaXMtdmlzaWJsZSc6IHRoaXMuc3RhdGUuaXNGb2N1c2VkIHx8IHRoaXMucHJvcHMudmFsdWVcblx0XHR9KTtcblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFRhcHBhYmxlLFxuXHRcdFx0eyBjbGFzc05hbWU6IGNsYXNzTmFtZSwgb25UYXA6IHRoaXMuaGFuZGxlQ2FuY2VsIH0sXG5cdFx0XHQnQ2FuY2VsJ1xuXHRcdCk7XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0dmFyIGNsYXNzTmFtZSA9IGNsYXNzbmFtZXMoJ1NlYXJjaEZpZWxkJywgJ1NlYXJjaEZpZWxkLS0nICsgdGhpcy5wcm9wcy50eXBlLCB7XG5cdFx0XHQnaXMtZm9jdXNlZCc6IHRoaXMuc3RhdGUuaXNGb2N1c2VkLFxuXHRcdFx0J2hhcy12YWx1ZSc6IHRoaXMucHJvcHMudmFsdWVcblx0XHR9LCB0aGlzLnByb3BzLmNsYXNzTmFtZSk7XG5cdFx0dmFyIHByb3BzID0gYmxhY2tsaXN0KHRoaXMucHJvcHMsICdjbGFzc05hbWUnLCAncGxhY2Vob2xkZXInLCAndHlwZScpO1xuXG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHQnZm9ybScsXG5cdFx0XHR7IG9uU3VibWl0OiB0aGlzLmhhbmRsZVN1Ym1pdCwgYWN0aW9uOiBcImphdmFzY3JpcHQ6O1wiLCBjbGFzc05hbWU6IGNsYXNzTmFtZSB9LFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0J2xhYmVsJyxcblx0XHRcdFx0eyBjbGFzc05hbWU6IFwiU2VhcmNoRmllbGRfX2ZpZWxkXCIgfSxcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0XHR7IGNsYXNzTmFtZTogXCJTZWFyY2hGaWVsZF9fcGxhY2Vob2xkZXJcIiB9LFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nLCB7IGNsYXNzTmFtZTogXCJTZWFyY2hGaWVsZF9faWNvbiBTZWFyY2hGaWVsZF9faWNvbi0tc2VhcmNoXCIgfSksXG5cdFx0XHRcdFx0IXRoaXMucHJvcHMudmFsdWUubGVuZ3RoID8gdGhpcy5wcm9wcy5wbGFjZWhvbGRlciA6IG51bGxcblx0XHRcdFx0KSxcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudCgnaW5wdXQnLCB7IHR5cGU6IFwic2VhcmNoXCIsIHJlZjogXCJpbnB1dFwiLCB2YWx1ZTogdGhpcy5wcm9wcy52YWx1ZSwgb25DaGFuZ2U6IHRoaXMuaGFuZGxlQ2hhbmdlLCBvbkZvY3VzOiB0aGlzLmhhbmRsZUZvY3VzLCBvbkJsdXI6IHRoaXMuaGFuZGxlQmx1ciwgY2xhc3NOYW1lOiBcIlNlYXJjaEZpZWxkX19pbnB1dFwiIH0pLFxuXHRcdFx0XHR0aGlzLnJlbmRlckNsZWFyKClcblx0XHRcdCksXG5cdFx0XHR0aGlzLnJlbmRlckNhbmNlbCgpXG5cdFx0KTtcblx0fVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIGNsYXNzbmFtZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyk7XG52YXIgVGFwcGFibGUgPSByZXF1aXJlKCdyZWFjdC10YXBwYWJsZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6ICdTZWdtZW50ZWRDb250cm9sJyxcblxuXHRwcm9wVHlwZXM6IHtcblx0XHRjbGFzc05hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdFx0ZXF1YWxXaWR0aFNlZ21lbnRzOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcblx0XHRpc0lubGluZTogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG5cdFx0aGFzR3V0dGVyOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcblx0XHRvbkNoYW5nZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcblx0XHRvcHRpb25zOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcblx0XHR0eXBlOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRcdHZhbHVlOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG5cdH0sXG5cblx0Z2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiBnZXREZWZhdWx0UHJvcHMoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHR5cGU6ICdwcmltYXJ5J1xuXHRcdH07XG5cdH0sXG5cblx0b25DaGFuZ2U6IGZ1bmN0aW9uIG9uQ2hhbmdlKHZhbHVlKSB7XG5cdFx0dGhpcy5wcm9wcy5vbkNoYW5nZSh2YWx1ZSk7XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0dmFyIGNvbXBvbmVudENsYXNzTmFtZSA9IGNsYXNzbmFtZXMoJ1NlZ21lbnRlZENvbnRyb2wnLCAnU2VnbWVudGVkQ29udHJvbC0tJyArIHRoaXMucHJvcHMudHlwZSwge1xuXHRcdFx0J1NlZ21lbnRlZENvbnRyb2wtLWlubGluZSc6IHRoaXMucHJvcHMuaXNJbmxpbmUsXG5cdFx0XHQnU2VnbWVudGVkQ29udHJvbC0taGFzLWd1dHRlcic6IHRoaXMucHJvcHMuaGFzR3V0dGVyLFxuXHRcdFx0J1NlZ21lbnRlZENvbnRyb2wtLWVxdWFsLXdpZHRocyc6IHRoaXMucHJvcHMuZXF1YWxXaWR0aFNlZ21lbnRzXG5cdFx0fSwgdGhpcy5wcm9wcy5jbGFzc05hbWUpO1xuXHRcdHZhciBzZWxmID0gdGhpcztcblxuXHRcdHZhciBvcHRpb25zID0gdGhpcy5wcm9wcy5vcHRpb25zLm1hcChmdW5jdGlvbiAob3ApIHtcblx0XHRcdGZ1bmN0aW9uIG9uQ2hhbmdlKCkge1xuXHRcdFx0XHRzZWxmLm9uQ2hhbmdlKG9wLnZhbHVlKTtcblx0XHRcdH1cblxuXHRcdFx0dmFyIGl0ZW1DbGFzc05hbWUgPSBjbGFzc25hbWVzKCdTZWdtZW50ZWRDb250cm9sX19pdGVtJywge1xuXHRcdFx0XHQnaXMtc2VsZWN0ZWQnOiBvcC52YWx1ZSA9PT0gc2VsZi5wcm9wcy52YWx1ZVxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRUYXBwYWJsZSxcblx0XHRcdFx0eyBrZXk6ICdvcHRpb24tJyArIG9wLnZhbHVlLCBvblRhcDogb25DaGFuZ2UsIGNsYXNzTmFtZTogaXRlbUNsYXNzTmFtZSB9LFxuXHRcdFx0XHRvcC5sYWJlbFxuXHRcdFx0KTtcblx0XHR9KTtcblxuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0J2RpdicsXG5cdFx0XHR7IGNsYXNzTmFtZTogY29tcG9uZW50Q2xhc3NOYW1lIH0sXG5cdFx0XHRvcHRpb25zXG5cdFx0KTtcblx0fVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2xhc3NuYW1lcyA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKTtcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgVGFwcGFibGUgPSByZXF1aXJlKCdyZWFjdC10YXBwYWJsZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6ICdTd2l0Y2gnLFxuXG5cdHByb3BUeXBlczoge1xuXHRcdGRpc2FibGVkOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcblx0XHRvbjogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG5cdFx0b25UYXA6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuXHRcdHR5cGU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmdcblx0fSxcblxuXHRnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uIGdldERlZmF1bHRQcm9wcygpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dHlwZTogJ2RlZmF1bHQnXG5cdFx0fTtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHR2YXIgY2xhc3NOYW1lID0gY2xhc3NuYW1lcygnU3dpdGNoJywgJ1N3aXRjaC0tJyArIHRoaXMucHJvcHMudHlwZSwge1xuXHRcdFx0J2lzLWRpc2FibGVkJzogdGhpcy5wcm9wcy5kaXNhYmxlZCxcblx0XHRcdCdpcy1vbic6IHRoaXMucHJvcHMub25cblx0XHR9KTtcblxuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0VGFwcGFibGUsXG5cdFx0XHR7IG9uVGFwOiB0aGlzLnByb3BzLm9uVGFwLCBjbGFzc05hbWU6IGNsYXNzTmFtZSwgY29tcG9uZW50OiBcImxhYmVsXCIgfSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHR7IGNsYXNzTmFtZTogXCJTd2l0Y2hfX3RyYWNrXCIgfSxcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBjbGFzc05hbWU6IFwiU3dpdGNoX19oYW5kbGVcIiB9KVxuXHRcdFx0KVxuXHRcdCk7XG5cdH1cbn0pOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuXHR2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgVGFwcGFibGUgPSByZXF1aXJlKCdyZWFjdC10YXBwYWJsZScpO1xuXG52YXIgYmxhY2tsaXN0ID0gcmVxdWlyZSgnYmxhY2tsaXN0Jyk7XG52YXIgY2xhc3NuYW1lcyA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKTtcblxudmFyIE5hdmlnYXRvciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6ICdOYXZpZ2F0b3InLFxuXG5cdHByb3BUeXBlczoge1xuXHRcdGNsYXNzTmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdHZhciBjbGFzc05hbWUgPSBjbGFzc25hbWVzKCdUYWJzLU5hdmlnYXRvcicsIHRoaXMucHJvcHMuY2xhc3NOYW1lKTtcblx0XHR2YXIgb3RoZXJQcm9wcyA9IGJsYWNrbGlzdCh0aGlzLnByb3BzLCAnY2xhc3NOYW1lJyk7XG5cblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgX2V4dGVuZHMoeyBjbGFzc05hbWU6IGNsYXNzTmFtZSB9LCBvdGhlclByb3BzKSk7XG5cdH1cbn0pO1xuXG5leHBvcnRzLk5hdmlnYXRvciA9IE5hdmlnYXRvcjtcbnZhciBUYWIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnVGFiJyxcblxuXHRwcm9wVHlwZXM6IHtcblx0XHRzZWxlY3RlZDogUmVhY3QuUHJvcFR5cGVzLmJvb2xcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHR2YXIgY2xhc3NOYW1lID0gY2xhc3NuYW1lcygnVGFicy1UYWInLCB7ICdpcy1zZWxlY3RlZCc6IHRoaXMucHJvcHMuc2VsZWN0ZWQgfSk7XG5cdFx0dmFyIG90aGVyUHJvcHMgPSBibGFja2xpc3QodGhpcy5wcm9wcywgJ3NlbGVjdGVkJyk7XG5cblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChUYXBwYWJsZSwgX2V4dGVuZHMoeyBjbGFzc05hbWU6IGNsYXNzTmFtZSB9LCBvdGhlclByb3BzKSk7XG5cdH1cbn0pO1xuXG5leHBvcnRzLlRhYiA9IFRhYjtcbnZhciBMYWJlbCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6ICdMYWJlbCcsXG5cblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIF9leHRlbmRzKHsgY2xhc3NOYW1lOiBcIlRhYnMtTGFiZWxcIiB9LCB0aGlzLnByb3BzKSk7XG5cdH1cbn0pO1xuZXhwb3J0cy5MYWJlbCA9IExhYmVsOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QvYWRkb25zJyk7XG5cbnZhciBJdGVtID0gcmVxdWlyZSgnLi9JdGVtJyk7XG52YXIgSXRlbUNvbnRlbnQgPSByZXF1aXJlKCcuL0l0ZW1Db250ZW50Jyk7XG52YXIgSXRlbUlubmVyID0gcmVxdWlyZSgnLi9JdGVtSW5uZXInKTtcblxudmFyIGJsYWNrbGlzdCA9IHJlcXVpcmUoJ2JsYWNrbGlzdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6ICdJbnB1dCcsXG5cdHByb3BUeXBlczoge1xuXHRcdGNsYXNzTmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0XHRjaGlsZHJlbjogUmVhY3QuUHJvcFR5cGVzLm5vZGUsXG5cdFx0ZGlzYWJsZWQ6IFJlYWN0LlByb3BUeXBlcy5ib29sXG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0dmFyIGlucHV0UHJvcHMgPSBibGFja2xpc3QodGhpcy5wcm9wcywgJ2NoaWxkcmVuJywgJ2NsYXNzTmFtZScpO1xuXG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRJdGVtLFxuXHRcdFx0eyBzZWxlY3RhYmxlOiB0aGlzLnByb3BzLmRpc2FibGVkLCBjbGFzc05hbWU6IHRoaXMucHJvcHMuY2xhc3NOYW1lLCBjb21wb25lbnQ6IFwibGFiZWxcIiB9LFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0SXRlbUlubmVyLFxuXHRcdFx0XHRudWxsLFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdEl0ZW1Db250ZW50LFxuXHRcdFx0XHRcdHsgY29tcG9uZW50OiBcImxhYmVsXCIgfSxcblx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScsIF9leHRlbmRzKHsgY2xhc3NOYW1lOiBcImZpZWxkXCIsIHJvd3M6IDMgfSwgaW5wdXRQcm9wcykpXG5cdFx0XHRcdCksXG5cdFx0XHRcdHRoaXMucHJvcHMuY2hpbGRyZW5cblx0XHRcdClcblx0XHQpO1xuXHR9XG59KTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xudmFyIEFsZXJ0YmFyID0gcmVxdWlyZSgnLi9BbGVydGJhcicpO1xuZXhwb3J0cy5BbGVydGJhciA9IEFsZXJ0YmFyO1xudmFyIEJ1dHRvbiA9IHJlcXVpcmUoJy4vQnV0dG9uJyk7XG5leHBvcnRzLkJ1dHRvbiA9IEJ1dHRvbjtcbnZhciBCdXR0b25Hcm91cCA9IHJlcXVpcmUoJy4vQnV0dG9uR3JvdXAnKTtcbmV4cG9ydHMuQnV0dG9uR3JvdXAgPSBCdXR0b25Hcm91cDtcbnZhciBGaWVsZENvbnRyb2wgPSByZXF1aXJlKCcuL0ZpZWxkQ29udHJvbCcpO1xuZXhwb3J0cy5GaWVsZENvbnRyb2wgPSBGaWVsZENvbnRyb2w7XG52YXIgRmllbGRMYWJlbCA9IHJlcXVpcmUoJy4vRmllbGRMYWJlbCcpO1xuZXhwb3J0cy5GaWVsZExhYmVsID0gRmllbGRMYWJlbDtcbnZhciBHcm91cCA9IHJlcXVpcmUoJy4vR3JvdXAnKTtcbmV4cG9ydHMuR3JvdXAgPSBHcm91cDtcbnZhciBHcm91cEJvZHkgPSByZXF1aXJlKCcuL0dyb3VwQm9keScpO1xuZXhwb3J0cy5Hcm91cEJvZHkgPSBHcm91cEJvZHk7XG52YXIgR3JvdXBGb290ZXIgPSByZXF1aXJlKCcuL0dyb3VwRm9vdGVyJyk7XG5leHBvcnRzLkdyb3VwRm9vdGVyID0gR3JvdXBGb290ZXI7XG52YXIgR3JvdXBIZWFkZXIgPSByZXF1aXJlKCcuL0dyb3VwSGVhZGVyJyk7XG5leHBvcnRzLkdyb3VwSGVhZGVyID0gR3JvdXBIZWFkZXI7XG52YXIgR3JvdXBJbm5lciA9IHJlcXVpcmUoJy4vR3JvdXBJbm5lcicpO1xuZXhwb3J0cy5Hcm91cElubmVyID0gR3JvdXBJbm5lcjtcbnZhciBJdGVtID0gcmVxdWlyZSgnLi9JdGVtJyk7XG5leHBvcnRzLkl0ZW0gPSBJdGVtO1xudmFyIEl0ZW1Db250ZW50ID0gcmVxdWlyZSgnLi9JdGVtQ29udGVudCcpO1xuZXhwb3J0cy5JdGVtQ29udGVudCA9IEl0ZW1Db250ZW50O1xudmFyIEl0ZW1Jbm5lciA9IHJlcXVpcmUoJy4vSXRlbUlubmVyJyk7XG5leHBvcnRzLkl0ZW1Jbm5lciA9IEl0ZW1Jbm5lcjtcbnZhciBJdGVtTWVkaWEgPSByZXF1aXJlKCcuL0l0ZW1NZWRpYScpO1xuZXhwb3J0cy5JdGVtTWVkaWEgPSBJdGVtTWVkaWE7XG52YXIgSXRlbU5vdGUgPSByZXF1aXJlKCcuL0l0ZW1Ob3RlJyk7XG5leHBvcnRzLkl0ZW1Ob3RlID0gSXRlbU5vdGU7XG52YXIgSXRlbVN1YlRpdGxlID0gcmVxdWlyZSgnLi9JdGVtU3ViVGl0bGUnKTtcbmV4cG9ydHMuSXRlbVN1YlRpdGxlID0gSXRlbVN1YlRpdGxlO1xudmFyIEl0ZW1UaXRsZSA9IHJlcXVpcmUoJy4vSXRlbVRpdGxlJyk7XG5leHBvcnRzLkl0ZW1UaXRsZSA9IEl0ZW1UaXRsZTtcbnZhciBMYWJlbElucHV0ID0gcmVxdWlyZSgnLi9MYWJlbElucHV0Jyk7XG5leHBvcnRzLkxhYmVsSW5wdXQgPSBMYWJlbElucHV0O1xudmFyIExhYmVsU2VsZWN0ID0gcmVxdWlyZSgnLi9MYWJlbFNlbGVjdCcpO1xuZXhwb3J0cy5MYWJlbFNlbGVjdCA9IExhYmVsU2VsZWN0O1xudmFyIExhYmVsVGV4dGFyZWEgPSByZXF1aXJlKCcuL0xhYmVsVGV4dGFyZWEnKTtcbmV4cG9ydHMuTGFiZWxUZXh0YXJlYSA9IExhYmVsVGV4dGFyZWE7XG52YXIgTGlzdEhlYWRlciA9IHJlcXVpcmUoJy4vTGlzdEhlYWRlcicpO1xuZXhwb3J0cy5MaXN0SGVhZGVyID0gTGlzdEhlYWRlcjtcbnZhciBOYXZpZ2F0aW9uQmFyID0gcmVxdWlyZSgnLi9OYXZpZ2F0aW9uQmFyJyk7XG5leHBvcnRzLk5hdmlnYXRpb25CYXIgPSBOYXZpZ2F0aW9uQmFyO1xudmFyIFBvcHVwID0gcmVxdWlyZSgnLi9Qb3B1cCcpO1xuZXhwb3J0cy5Qb3B1cCA9IFBvcHVwO1xudmFyIFBvcHVwSWNvbiA9IHJlcXVpcmUoJy4vUG9wdXBJY29uJyk7XG5leHBvcnRzLlBvcHVwSWNvbiA9IFBvcHVwSWNvbjtcbnZhciBSYWRpb0xpc3QgPSByZXF1aXJlKCcuL1JhZGlvTGlzdCcpO1xuZXhwb3J0cy5SYWRpb0xpc3QgPSBSYWRpb0xpc3Q7XG52YXIgU2VhcmNoRmllbGQgPSByZXF1aXJlKCcuL1NlYXJjaEZpZWxkJyk7XG5leHBvcnRzLlNlYXJjaEZpZWxkID0gU2VhcmNoRmllbGQ7XG52YXIgU2VnbWVudGVkQ29udHJvbCA9IHJlcXVpcmUoJy4vU2VnbWVudGVkQ29udHJvbCcpO1xuZXhwb3J0cy5TZWdtZW50ZWRDb250cm9sID0gU2VnbWVudGVkQ29udHJvbDtcbnZhciBTd2l0Y2ggPSByZXF1aXJlKCcuL1N3aXRjaCcpO1xuZXhwb3J0cy5Td2l0Y2ggPSBTd2l0Y2g7XG52YXIgVGFicyA9IHJlcXVpcmUoJy4vVGFicycpO1xuZXhwb3J0cy5UYWJzID0gVGFicztcbnZhciBUZXh0YXJlYSA9IHJlcXVpcmUoJy4vVGV4dGFyZWEnKTtcblxuLy8gZGVwZW5kcyBvbiBhYm92ZVxuZXhwb3J0cy5UZXh0YXJlYSA9IFRleHRhcmVhO1xudmFyIElucHV0ID0gcmVxdWlyZSgnLi9JbnB1dCcpO1xuZXhwb3J0cy5JbnB1dCA9IElucHV0OyIsIi8qKlxuICogVHdlZW4uanMgLSBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9zb2xlL3R3ZWVuLmpzXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKlxuICogU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9zb2xlL3R3ZWVuLmpzL2dyYXBocy9jb250cmlidXRvcnMgZm9yIHRoZSBmdWxsIGxpc3Qgb2YgY29udHJpYnV0b3JzLlxuICogVGhhbmsgeW91IGFsbCwgeW91J3JlIGF3ZXNvbWUhXG4gKi9cblxuLy8gRGF0ZS5ub3cgc2hpbSBmb3IgKGFoZW0pIEludGVybmV0IEV4cGxvKGR8cillclxuaWYgKCBEYXRlLm5vdyA9PT0gdW5kZWZpbmVkICkge1xuXG5cdERhdGUubm93ID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0cmV0dXJuIG5ldyBEYXRlKCkudmFsdWVPZigpO1xuXG5cdH07XG5cbn1cblxudmFyIFRXRUVOID0gVFdFRU4gfHwgKCBmdW5jdGlvbiAoKSB7XG5cblx0dmFyIF90d2VlbnMgPSBbXTtcblxuXHRyZXR1cm4ge1xuXG5cdFx0UkVWSVNJT046ICcxNCcsXG5cblx0XHRnZXRBbGw6IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0cmV0dXJuIF90d2VlbnM7XG5cblx0XHR9LFxuXG5cdFx0cmVtb3ZlQWxsOiBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdF90d2VlbnMgPSBbXTtcblxuXHRcdH0sXG5cblx0XHRhZGQ6IGZ1bmN0aW9uICggdHdlZW4gKSB7XG5cblx0XHRcdF90d2VlbnMucHVzaCggdHdlZW4gKTtcblxuXHRcdH0sXG5cblx0XHRyZW1vdmU6IGZ1bmN0aW9uICggdHdlZW4gKSB7XG5cblx0XHRcdHZhciBpID0gX3R3ZWVucy5pbmRleE9mKCB0d2VlbiApO1xuXG5cdFx0XHRpZiAoIGkgIT09IC0xICkge1xuXG5cdFx0XHRcdF90d2VlbnMuc3BsaWNlKCBpLCAxICk7XG5cblx0XHRcdH1cblxuXHRcdH0sXG5cblx0XHR1cGRhdGU6IGZ1bmN0aW9uICggdGltZSApIHtcblxuXHRcdFx0aWYgKCBfdHdlZW5zLmxlbmd0aCA9PT0gMCApIHJldHVybiBmYWxzZTtcblxuXHRcdFx0dmFyIGkgPSAwO1xuXG5cdFx0XHR0aW1lID0gdGltZSAhPT0gdW5kZWZpbmVkID8gdGltZSA6ICggdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LnBlcmZvcm1hbmNlICE9PSB1bmRlZmluZWQgJiYgd2luZG93LnBlcmZvcm1hbmNlLm5vdyAhPT0gdW5kZWZpbmVkID8gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpIDogRGF0ZS5ub3coKSApO1xuXG5cdFx0XHR3aGlsZSAoIGkgPCBfdHdlZW5zLmxlbmd0aCApIHtcblxuXHRcdFx0XHRpZiAoIF90d2VlbnNbIGkgXS51cGRhdGUoIHRpbWUgKSApIHtcblxuXHRcdFx0XHRcdGkrKztcblxuXHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0X3R3ZWVucy5zcGxpY2UoIGksIDEgKTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHRydWU7XG5cblx0XHR9XG5cdH07XG5cbn0gKSgpO1xuXG5UV0VFTi5Ud2VlbiA9IGZ1bmN0aW9uICggb2JqZWN0ICkge1xuXG5cdHZhciBfb2JqZWN0ID0gb2JqZWN0O1xuXHR2YXIgX3ZhbHVlc1N0YXJ0ID0ge307XG5cdHZhciBfdmFsdWVzRW5kID0ge307XG5cdHZhciBfdmFsdWVzU3RhcnRSZXBlYXQgPSB7fTtcblx0dmFyIF9kdXJhdGlvbiA9IDEwMDA7XG5cdHZhciBfcmVwZWF0ID0gMDtcblx0dmFyIF95b3lvID0gZmFsc2U7XG5cdHZhciBfaXNQbGF5aW5nID0gZmFsc2U7XG5cdHZhciBfcmV2ZXJzZWQgPSBmYWxzZTtcblx0dmFyIF9kZWxheVRpbWUgPSAwO1xuXHR2YXIgX3N0YXJ0VGltZSA9IG51bGw7XG5cdHZhciBfZWFzaW5nRnVuY3Rpb24gPSBUV0VFTi5FYXNpbmcuTGluZWFyLk5vbmU7XG5cdHZhciBfaW50ZXJwb2xhdGlvbkZ1bmN0aW9uID0gVFdFRU4uSW50ZXJwb2xhdGlvbi5MaW5lYXI7XG5cdHZhciBfY2hhaW5lZFR3ZWVucyA9IFtdO1xuXHR2YXIgX29uU3RhcnRDYWxsYmFjayA9IG51bGw7XG5cdHZhciBfb25TdGFydENhbGxiYWNrRmlyZWQgPSBmYWxzZTtcblx0dmFyIF9vblVwZGF0ZUNhbGxiYWNrID0gbnVsbDtcblx0dmFyIF9vbkNvbXBsZXRlQ2FsbGJhY2sgPSBudWxsO1xuXHR2YXIgX29uU3RvcENhbGxiYWNrID0gbnVsbDtcblxuXHQvLyBTZXQgYWxsIHN0YXJ0aW5nIHZhbHVlcyBwcmVzZW50IG9uIHRoZSB0YXJnZXQgb2JqZWN0XG5cdGZvciAoIHZhciBmaWVsZCBpbiBvYmplY3QgKSB7XG5cblx0XHRfdmFsdWVzU3RhcnRbIGZpZWxkIF0gPSBwYXJzZUZsb2F0KG9iamVjdFtmaWVsZF0sIDEwKTtcblxuXHR9XG5cblx0dGhpcy50byA9IGZ1bmN0aW9uICggcHJvcGVydGllcywgZHVyYXRpb24gKSB7XG5cblx0XHRpZiAoIGR1cmF0aW9uICE9PSB1bmRlZmluZWQgKSB7XG5cblx0XHRcdF9kdXJhdGlvbiA9IGR1cmF0aW9uO1xuXG5cdFx0fVxuXG5cdFx0X3ZhbHVlc0VuZCA9IHByb3BlcnRpZXM7XG5cblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMuc3RhcnQgPSBmdW5jdGlvbiAoIHRpbWUgKSB7XG5cblx0XHRUV0VFTi5hZGQoIHRoaXMgKTtcblxuXHRcdF9pc1BsYXlpbmcgPSB0cnVlO1xuXG5cdFx0X29uU3RhcnRDYWxsYmFja0ZpcmVkID0gZmFsc2U7XG5cblx0XHRfc3RhcnRUaW1lID0gdGltZSAhPT0gdW5kZWZpbmVkID8gdGltZSA6ICggdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LnBlcmZvcm1hbmNlICE9PSB1bmRlZmluZWQgJiYgd2luZG93LnBlcmZvcm1hbmNlLm5vdyAhPT0gdW5kZWZpbmVkID8gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpIDogRGF0ZS5ub3coKSApO1xuXHRcdF9zdGFydFRpbWUgKz0gX2RlbGF5VGltZTtcblxuXHRcdGZvciAoIHZhciBwcm9wZXJ0eSBpbiBfdmFsdWVzRW5kICkge1xuXG5cdFx0XHQvLyBjaGVjayBpZiBhbiBBcnJheSB3YXMgcHJvdmlkZWQgYXMgcHJvcGVydHkgdmFsdWVcblx0XHRcdGlmICggX3ZhbHVlc0VuZFsgcHJvcGVydHkgXSBpbnN0YW5jZW9mIEFycmF5ICkge1xuXG5cdFx0XHRcdGlmICggX3ZhbHVlc0VuZFsgcHJvcGVydHkgXS5sZW5ndGggPT09IDAgKSB7XG5cblx0XHRcdFx0XHRjb250aW51ZTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gY3JlYXRlIGEgbG9jYWwgY29weSBvZiB0aGUgQXJyYXkgd2l0aCB0aGUgc3RhcnQgdmFsdWUgYXQgdGhlIGZyb250XG5cdFx0XHRcdF92YWx1ZXNFbmRbIHByb3BlcnR5IF0gPSBbIF9vYmplY3RbIHByb3BlcnR5IF0gXS5jb25jYXQoIF92YWx1ZXNFbmRbIHByb3BlcnR5IF0gKTtcblxuXHRcdFx0fVxuXG5cdFx0XHRfdmFsdWVzU3RhcnRbIHByb3BlcnR5IF0gPSBfb2JqZWN0WyBwcm9wZXJ0eSBdO1xuXG5cdFx0XHRpZiggKCBfdmFsdWVzU3RhcnRbIHByb3BlcnR5IF0gaW5zdGFuY2VvZiBBcnJheSApID09PSBmYWxzZSApIHtcblx0XHRcdFx0X3ZhbHVlc1N0YXJ0WyBwcm9wZXJ0eSBdICo9IDEuMDsgLy8gRW5zdXJlcyB3ZSdyZSB1c2luZyBudW1iZXJzLCBub3Qgc3RyaW5nc1xuXHRcdFx0fVxuXG5cdFx0XHRfdmFsdWVzU3RhcnRSZXBlYXRbIHByb3BlcnR5IF0gPSBfdmFsdWVzU3RhcnRbIHByb3BlcnR5IF0gfHwgMDtcblxuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5zdG9wID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0aWYgKCAhX2lzUGxheWluZyApIHtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH1cblxuXHRcdFRXRUVOLnJlbW92ZSggdGhpcyApO1xuXHRcdF9pc1BsYXlpbmcgPSBmYWxzZTtcblxuXHRcdGlmICggX29uU3RvcENhbGxiYWNrICE9PSBudWxsICkge1xuXG5cdFx0XHRfb25TdG9wQ2FsbGJhY2suY2FsbCggX29iamVjdCApO1xuXG5cdFx0fVxuXG5cdFx0dGhpcy5zdG9wQ2hhaW5lZFR3ZWVucygpO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5zdG9wQ2hhaW5lZFR3ZWVucyA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdGZvciAoIHZhciBpID0gMCwgbnVtQ2hhaW5lZFR3ZWVucyA9IF9jaGFpbmVkVHdlZW5zLmxlbmd0aDsgaSA8IG51bUNoYWluZWRUd2VlbnM7IGkrKyApIHtcblxuXHRcdFx0X2NoYWluZWRUd2VlbnNbIGkgXS5zdG9wKCk7XG5cblx0XHR9XG5cblx0fTtcblxuXHR0aGlzLmRlbGF5ID0gZnVuY3Rpb24gKCBhbW91bnQgKSB7XG5cblx0XHRfZGVsYXlUaW1lID0gYW1vdW50O1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5yZXBlYXQgPSBmdW5jdGlvbiAoIHRpbWVzICkge1xuXG5cdFx0X3JlcGVhdCA9IHRpbWVzO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy55b3lvID0gZnVuY3Rpb24oIHlveW8gKSB7XG5cblx0XHRfeW95byA9IHlveW87XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXG5cdHRoaXMuZWFzaW5nID0gZnVuY3Rpb24gKCBlYXNpbmcgKSB7XG5cblx0XHRfZWFzaW5nRnVuY3Rpb24gPSBlYXNpbmc7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLmludGVycG9sYXRpb24gPSBmdW5jdGlvbiAoIGludGVycG9sYXRpb24gKSB7XG5cblx0XHRfaW50ZXJwb2xhdGlvbkZ1bmN0aW9uID0gaW50ZXJwb2xhdGlvbjtcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMuY2hhaW4gPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRfY2hhaW5lZFR3ZWVucyA9IGFyZ3VtZW50cztcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMub25TdGFydCA9IGZ1bmN0aW9uICggY2FsbGJhY2sgKSB7XG5cblx0XHRfb25TdGFydENhbGxiYWNrID0gY2FsbGJhY2s7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLm9uVXBkYXRlID0gZnVuY3Rpb24gKCBjYWxsYmFjayApIHtcblxuXHRcdF9vblVwZGF0ZUNhbGxiYWNrID0gY2FsbGJhY2s7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLm9uQ29tcGxldGUgPSBmdW5jdGlvbiAoIGNhbGxiYWNrICkge1xuXG5cdFx0X29uQ29tcGxldGVDYWxsYmFjayA9IGNhbGxiYWNrO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5vblN0b3AgPSBmdW5jdGlvbiAoIGNhbGxiYWNrICkge1xuXG5cdFx0X29uU3RvcENhbGxiYWNrID0gY2FsbGJhY2s7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uICggdGltZSApIHtcblxuXHRcdHZhciBwcm9wZXJ0eTtcblxuXHRcdGlmICggdGltZSA8IF9zdGFydFRpbWUgKSB7XG5cblx0XHRcdHJldHVybiB0cnVlO1xuXG5cdFx0fVxuXG5cdFx0aWYgKCBfb25TdGFydENhbGxiYWNrRmlyZWQgPT09IGZhbHNlICkge1xuXG5cdFx0XHRpZiAoIF9vblN0YXJ0Q2FsbGJhY2sgIT09IG51bGwgKSB7XG5cblx0XHRcdFx0X29uU3RhcnRDYWxsYmFjay5jYWxsKCBfb2JqZWN0ICk7XG5cblx0XHRcdH1cblxuXHRcdFx0X29uU3RhcnRDYWxsYmFja0ZpcmVkID0gdHJ1ZTtcblxuXHRcdH1cblxuXHRcdHZhciBlbGFwc2VkID0gKCB0aW1lIC0gX3N0YXJ0VGltZSApIC8gX2R1cmF0aW9uO1xuXHRcdGVsYXBzZWQgPSBlbGFwc2VkID4gMSA/IDEgOiBlbGFwc2VkO1xuXG5cdFx0dmFyIHZhbHVlID0gX2Vhc2luZ0Z1bmN0aW9uKCBlbGFwc2VkICk7XG5cblx0XHRmb3IgKCBwcm9wZXJ0eSBpbiBfdmFsdWVzRW5kICkge1xuXG5cdFx0XHR2YXIgc3RhcnQgPSBfdmFsdWVzU3RhcnRbIHByb3BlcnR5IF0gfHwgMDtcblx0XHRcdHZhciBlbmQgPSBfdmFsdWVzRW5kWyBwcm9wZXJ0eSBdO1xuXG5cdFx0XHRpZiAoIGVuZCBpbnN0YW5jZW9mIEFycmF5ICkge1xuXG5cdFx0XHRcdF9vYmplY3RbIHByb3BlcnR5IF0gPSBfaW50ZXJwb2xhdGlvbkZ1bmN0aW9uKCBlbmQsIHZhbHVlICk7XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0Ly8gUGFyc2VzIHJlbGF0aXZlIGVuZCB2YWx1ZXMgd2l0aCBzdGFydCBhcyBiYXNlIChlLmcuOiArMTAsIC0zKVxuXHRcdFx0XHRpZiAoIHR5cGVvZihlbmQpID09PSBcInN0cmluZ1wiICkge1xuXHRcdFx0XHRcdGVuZCA9IHN0YXJ0ICsgcGFyc2VGbG9hdChlbmQsIDEwKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIHByb3RlY3QgYWdhaW5zdCBub24gbnVtZXJpYyBwcm9wZXJ0aWVzLlxuXHRcdFx0XHRpZiAoIHR5cGVvZihlbmQpID09PSBcIm51bWJlclwiICkge1xuXHRcdFx0XHRcdF9vYmplY3RbIHByb3BlcnR5IF0gPSBzdGFydCArICggZW5kIC0gc3RhcnQgKSAqIHZhbHVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdGlmICggX29uVXBkYXRlQ2FsbGJhY2sgIT09IG51bGwgKSB7XG5cblx0XHRcdF9vblVwZGF0ZUNhbGxiYWNrLmNhbGwoIF9vYmplY3QsIHZhbHVlICk7XG5cblx0XHR9XG5cblx0XHRpZiAoIGVsYXBzZWQgPT0gMSApIHtcblxuXHRcdFx0aWYgKCBfcmVwZWF0ID4gMCApIHtcblxuXHRcdFx0XHRpZiggaXNGaW5pdGUoIF9yZXBlYXQgKSApIHtcblx0XHRcdFx0XHRfcmVwZWF0LS07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyByZWFzc2lnbiBzdGFydGluZyB2YWx1ZXMsIHJlc3RhcnQgYnkgbWFraW5nIHN0YXJ0VGltZSA9IG5vd1xuXHRcdFx0XHRmb3IoIHByb3BlcnR5IGluIF92YWx1ZXNTdGFydFJlcGVhdCApIHtcblxuXHRcdFx0XHRcdGlmICggdHlwZW9mKCBfdmFsdWVzRW5kWyBwcm9wZXJ0eSBdICkgPT09IFwic3RyaW5nXCIgKSB7XG5cdFx0XHRcdFx0XHRfdmFsdWVzU3RhcnRSZXBlYXRbIHByb3BlcnR5IF0gPSBfdmFsdWVzU3RhcnRSZXBlYXRbIHByb3BlcnR5IF0gKyBwYXJzZUZsb2F0KF92YWx1ZXNFbmRbIHByb3BlcnR5IF0sIDEwKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoX3lveW8pIHtcblx0XHRcdFx0XHRcdHZhciB0bXAgPSBfdmFsdWVzU3RhcnRSZXBlYXRbIHByb3BlcnR5IF07XG5cdFx0XHRcdFx0XHRfdmFsdWVzU3RhcnRSZXBlYXRbIHByb3BlcnR5IF0gPSBfdmFsdWVzRW5kWyBwcm9wZXJ0eSBdO1xuXHRcdFx0XHRcdFx0X3ZhbHVlc0VuZFsgcHJvcGVydHkgXSA9IHRtcDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRfdmFsdWVzU3RhcnRbIHByb3BlcnR5IF0gPSBfdmFsdWVzU3RhcnRSZXBlYXRbIHByb3BlcnR5IF07XG5cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChfeW95bykge1xuXHRcdFx0XHRcdF9yZXZlcnNlZCA9ICFfcmV2ZXJzZWQ7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRfc3RhcnRUaW1lID0gdGltZSArIF9kZWxheVRpbWU7XG5cblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0aWYgKCBfb25Db21wbGV0ZUNhbGxiYWNrICE9PSBudWxsICkge1xuXG5cdFx0XHRcdFx0X29uQ29tcGxldGVDYWxsYmFjay5jYWxsKCBfb2JqZWN0ICk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZvciAoIHZhciBpID0gMCwgbnVtQ2hhaW5lZFR3ZWVucyA9IF9jaGFpbmVkVHdlZW5zLmxlbmd0aDsgaSA8IG51bUNoYWluZWRUd2VlbnM7IGkrKyApIHtcblxuXHRcdFx0XHRcdF9jaGFpbmVkVHdlZW5zWyBpIF0uc3RhcnQoIHRpbWUgKTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblxuXHR9O1xuXG59O1xuXG5cblRXRUVOLkVhc2luZyA9IHtcblxuXHRMaW5lYXI6IHtcblxuXHRcdE5vbmU6IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0cmV0dXJuIGs7XG5cblx0XHR9XG5cblx0fSxcblxuXHRRdWFkcmF0aWM6IHtcblxuXHRcdEluOiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdHJldHVybiBrICogaztcblxuXHRcdH0sXG5cblx0XHRPdXQ6IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0cmV0dXJuIGsgKiAoIDIgLSBrICk7XG5cblx0XHR9LFxuXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0aWYgKCAoIGsgKj0gMiApIDwgMSApIHJldHVybiAwLjUgKiBrICogaztcblx0XHRcdHJldHVybiAtIDAuNSAqICggLS1rICogKCBrIC0gMiApIC0gMSApO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0Q3ViaWM6IHtcblxuXHRcdEluOiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdHJldHVybiBrICogayAqIGs7XG5cblx0XHR9LFxuXG5cdFx0T3V0OiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdHJldHVybiAtLWsgKiBrICogayArIDE7XG5cblx0XHR9LFxuXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0aWYgKCAoIGsgKj0gMiApIDwgMSApIHJldHVybiAwLjUgKiBrICogayAqIGs7XG5cdFx0XHRyZXR1cm4gMC41ICogKCAoIGsgLT0gMiApICogayAqIGsgKyAyICk7XG5cblx0XHR9XG5cblx0fSxcblxuXHRRdWFydGljOiB7XG5cblx0XHRJbjogZnVuY3Rpb24gKCBrICkge1xuXG5cdFx0XHRyZXR1cm4gayAqIGsgKiBrICogaztcblxuXHRcdH0sXG5cblx0XHRPdXQ6IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0cmV0dXJuIDEgLSAoIC0tayAqIGsgKiBrICogayApO1xuXG5cdFx0fSxcblxuXHRcdEluT3V0OiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdGlmICggKCBrICo9IDIgKSA8IDEpIHJldHVybiAwLjUgKiBrICogayAqIGsgKiBrO1xuXHRcdFx0cmV0dXJuIC0gMC41ICogKCAoIGsgLT0gMiApICogayAqIGsgKiBrIC0gMiApO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0UXVpbnRpYzoge1xuXG5cdFx0SW46IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0cmV0dXJuIGsgKiBrICogayAqIGsgKiBrO1xuXG5cdFx0fSxcblxuXHRcdE91dDogZnVuY3Rpb24gKCBrICkge1xuXG5cdFx0XHRyZXR1cm4gLS1rICogayAqIGsgKiBrICogayArIDE7XG5cblx0XHR9LFxuXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0aWYgKCAoIGsgKj0gMiApIDwgMSApIHJldHVybiAwLjUgKiBrICogayAqIGsgKiBrICogaztcblx0XHRcdHJldHVybiAwLjUgKiAoICggayAtPSAyICkgKiBrICogayAqIGsgKiBrICsgMiApO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0U2ludXNvaWRhbDoge1xuXG5cdFx0SW46IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0cmV0dXJuIDEgLSBNYXRoLmNvcyggayAqIE1hdGguUEkgLyAyICk7XG5cblx0XHR9LFxuXG5cdFx0T3V0OiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdHJldHVybiBNYXRoLnNpbiggayAqIE1hdGguUEkgLyAyICk7XG5cblx0XHR9LFxuXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0cmV0dXJuIDAuNSAqICggMSAtIE1hdGguY29zKCBNYXRoLlBJICogayApICk7XG5cblx0XHR9XG5cblx0fSxcblxuXHRFeHBvbmVudGlhbDoge1xuXG5cdFx0SW46IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0cmV0dXJuIGsgPT09IDAgPyAwIDogTWF0aC5wb3coIDEwMjQsIGsgLSAxICk7XG5cblx0XHR9LFxuXG5cdFx0T3V0OiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdHJldHVybiBrID09PSAxID8gMSA6IDEgLSBNYXRoLnBvdyggMiwgLSAxMCAqIGsgKTtcblxuXHRcdH0sXG5cblx0XHRJbk91dDogZnVuY3Rpb24gKCBrICkge1xuXG5cdFx0XHRpZiAoIGsgPT09IDAgKSByZXR1cm4gMDtcblx0XHRcdGlmICggayA9PT0gMSApIHJldHVybiAxO1xuXHRcdFx0aWYgKCAoIGsgKj0gMiApIDwgMSApIHJldHVybiAwLjUgKiBNYXRoLnBvdyggMTAyNCwgayAtIDEgKTtcblx0XHRcdHJldHVybiAwLjUgKiAoIC0gTWF0aC5wb3coIDIsIC0gMTAgKiAoIGsgLSAxICkgKSArIDIgKTtcblxuXHRcdH1cblxuXHR9LFxuXG5cdENpcmN1bGFyOiB7XG5cblx0XHRJbjogZnVuY3Rpb24gKCBrICkge1xuXG5cdFx0XHRyZXR1cm4gMSAtIE1hdGguc3FydCggMSAtIGsgKiBrICk7XG5cblx0XHR9LFxuXG5cdFx0T3V0OiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdHJldHVybiBNYXRoLnNxcnQoIDEgLSAoIC0tayAqIGsgKSApO1xuXG5cdFx0fSxcblxuXHRcdEluT3V0OiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdGlmICggKCBrICo9IDIgKSA8IDEpIHJldHVybiAtIDAuNSAqICggTWF0aC5zcXJ0KCAxIC0gayAqIGspIC0gMSk7XG5cdFx0XHRyZXR1cm4gMC41ICogKCBNYXRoLnNxcnQoIDEgLSAoIGsgLT0gMikgKiBrKSArIDEpO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0RWxhc3RpYzoge1xuXG5cdFx0SW46IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0dmFyIHMsIGEgPSAwLjEsIHAgPSAwLjQ7XG5cdFx0XHRpZiAoIGsgPT09IDAgKSByZXR1cm4gMDtcblx0XHRcdGlmICggayA9PT0gMSApIHJldHVybiAxO1xuXHRcdFx0aWYgKCAhYSB8fCBhIDwgMSApIHsgYSA9IDE7IHMgPSBwIC8gNDsgfVxuXHRcdFx0ZWxzZSBzID0gcCAqIE1hdGguYXNpbiggMSAvIGEgKSAvICggMiAqIE1hdGguUEkgKTtcblx0XHRcdHJldHVybiAtICggYSAqIE1hdGgucG93KCAyLCAxMCAqICggayAtPSAxICkgKSAqIE1hdGguc2luKCAoIGsgLSBzICkgKiAoIDIgKiBNYXRoLlBJICkgLyBwICkgKTtcblxuXHRcdH0sXG5cblx0XHRPdXQ6IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0dmFyIHMsIGEgPSAwLjEsIHAgPSAwLjQ7XG5cdFx0XHRpZiAoIGsgPT09IDAgKSByZXR1cm4gMDtcblx0XHRcdGlmICggayA9PT0gMSApIHJldHVybiAxO1xuXHRcdFx0aWYgKCAhYSB8fCBhIDwgMSApIHsgYSA9IDE7IHMgPSBwIC8gNDsgfVxuXHRcdFx0ZWxzZSBzID0gcCAqIE1hdGguYXNpbiggMSAvIGEgKSAvICggMiAqIE1hdGguUEkgKTtcblx0XHRcdHJldHVybiAoIGEgKiBNYXRoLnBvdyggMiwgLSAxMCAqIGspICogTWF0aC5zaW4oICggayAtIHMgKSAqICggMiAqIE1hdGguUEkgKSAvIHAgKSArIDEgKTtcblxuXHRcdH0sXG5cblx0XHRJbk91dDogZnVuY3Rpb24gKCBrICkge1xuXG5cdFx0XHR2YXIgcywgYSA9IDAuMSwgcCA9IDAuNDtcblx0XHRcdGlmICggayA9PT0gMCApIHJldHVybiAwO1xuXHRcdFx0aWYgKCBrID09PSAxICkgcmV0dXJuIDE7XG5cdFx0XHRpZiAoICFhIHx8IGEgPCAxICkgeyBhID0gMTsgcyA9IHAgLyA0OyB9XG5cdFx0XHRlbHNlIHMgPSBwICogTWF0aC5hc2luKCAxIC8gYSApIC8gKCAyICogTWF0aC5QSSApO1xuXHRcdFx0aWYgKCAoIGsgKj0gMiApIDwgMSApIHJldHVybiAtIDAuNSAqICggYSAqIE1hdGgucG93KCAyLCAxMCAqICggayAtPSAxICkgKSAqIE1hdGguc2luKCAoIGsgLSBzICkgKiAoIDIgKiBNYXRoLlBJICkgLyBwICkgKTtcblx0XHRcdHJldHVybiBhICogTWF0aC5wb3coIDIsIC0xMCAqICggayAtPSAxICkgKSAqIE1hdGguc2luKCAoIGsgLSBzICkgKiAoIDIgKiBNYXRoLlBJICkgLyBwICkgKiAwLjUgKyAxO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0QmFjazoge1xuXG5cdFx0SW46IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0dmFyIHMgPSAxLjcwMTU4O1xuXHRcdFx0cmV0dXJuIGsgKiBrICogKCAoIHMgKyAxICkgKiBrIC0gcyApO1xuXG5cdFx0fSxcblxuXHRcdE91dDogZnVuY3Rpb24gKCBrICkge1xuXG5cdFx0XHR2YXIgcyA9IDEuNzAxNTg7XG5cdFx0XHRyZXR1cm4gLS1rICogayAqICggKCBzICsgMSApICogayArIHMgKSArIDE7XG5cblx0XHR9LFxuXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0dmFyIHMgPSAxLjcwMTU4ICogMS41MjU7XG5cdFx0XHRpZiAoICggayAqPSAyICkgPCAxICkgcmV0dXJuIDAuNSAqICggayAqIGsgKiAoICggcyArIDEgKSAqIGsgLSBzICkgKTtcblx0XHRcdHJldHVybiAwLjUgKiAoICggayAtPSAyICkgKiBrICogKCAoIHMgKyAxICkgKiBrICsgcyApICsgMiApO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0Qm91bmNlOiB7XG5cblx0XHRJbjogZnVuY3Rpb24gKCBrICkge1xuXG5cdFx0XHRyZXR1cm4gMSAtIFRXRUVOLkVhc2luZy5Cb3VuY2UuT3V0KCAxIC0gayApO1xuXG5cdFx0fSxcblxuXHRcdE91dDogZnVuY3Rpb24gKCBrICkge1xuXG5cdFx0XHRpZiAoIGsgPCAoIDEgLyAyLjc1ICkgKSB7XG5cblx0XHRcdFx0cmV0dXJuIDcuNTYyNSAqIGsgKiBrO1xuXG5cdFx0XHR9IGVsc2UgaWYgKCBrIDwgKCAyIC8gMi43NSApICkge1xuXG5cdFx0XHRcdHJldHVybiA3LjU2MjUgKiAoIGsgLT0gKCAxLjUgLyAyLjc1ICkgKSAqIGsgKyAwLjc1O1xuXG5cdFx0XHR9IGVsc2UgaWYgKCBrIDwgKCAyLjUgLyAyLjc1ICkgKSB7XG5cblx0XHRcdFx0cmV0dXJuIDcuNTYyNSAqICggayAtPSAoIDIuMjUgLyAyLjc1ICkgKSAqIGsgKyAwLjkzNzU7XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0cmV0dXJuIDcuNTYyNSAqICggayAtPSAoIDIuNjI1IC8gMi43NSApICkgKiBrICsgMC45ODQzNzU7XG5cblx0XHRcdH1cblxuXHRcdH0sXG5cblx0XHRJbk91dDogZnVuY3Rpb24gKCBrICkge1xuXG5cdFx0XHRpZiAoIGsgPCAwLjUgKSByZXR1cm4gVFdFRU4uRWFzaW5nLkJvdW5jZS5JbiggayAqIDIgKSAqIDAuNTtcblx0XHRcdHJldHVybiBUV0VFTi5FYXNpbmcuQm91bmNlLk91dCggayAqIDIgLSAxICkgKiAwLjUgKyAwLjU7XG5cblx0XHR9XG5cblx0fVxuXG59O1xuXG5UV0VFTi5JbnRlcnBvbGF0aW9uID0ge1xuXG5cdExpbmVhcjogZnVuY3Rpb24gKCB2LCBrICkge1xuXG5cdFx0dmFyIG0gPSB2Lmxlbmd0aCAtIDEsIGYgPSBtICogaywgaSA9IE1hdGguZmxvb3IoIGYgKSwgZm4gPSBUV0VFTi5JbnRlcnBvbGF0aW9uLlV0aWxzLkxpbmVhcjtcblxuXHRcdGlmICggayA8IDAgKSByZXR1cm4gZm4oIHZbIDAgXSwgdlsgMSBdLCBmICk7XG5cdFx0aWYgKCBrID4gMSApIHJldHVybiBmbiggdlsgbSBdLCB2WyBtIC0gMSBdLCBtIC0gZiApO1xuXG5cdFx0cmV0dXJuIGZuKCB2WyBpIF0sIHZbIGkgKyAxID4gbSA/IG0gOiBpICsgMSBdLCBmIC0gaSApO1xuXG5cdH0sXG5cblx0QmV6aWVyOiBmdW5jdGlvbiAoIHYsIGsgKSB7XG5cblx0XHR2YXIgYiA9IDAsIG4gPSB2Lmxlbmd0aCAtIDEsIHB3ID0gTWF0aC5wb3csIGJuID0gVFdFRU4uSW50ZXJwb2xhdGlvbi5VdGlscy5CZXJuc3RlaW4sIGk7XG5cblx0XHRmb3IgKCBpID0gMDsgaSA8PSBuOyBpKysgKSB7XG5cdFx0XHRiICs9IHB3KCAxIC0gaywgbiAtIGkgKSAqIHB3KCBrLCBpICkgKiB2WyBpIF0gKiBibiggbiwgaSApO1xuXHRcdH1cblxuXHRcdHJldHVybiBiO1xuXG5cdH0sXG5cblx0Q2F0bXVsbFJvbTogZnVuY3Rpb24gKCB2LCBrICkge1xuXG5cdFx0dmFyIG0gPSB2Lmxlbmd0aCAtIDEsIGYgPSBtICogaywgaSA9IE1hdGguZmxvb3IoIGYgKSwgZm4gPSBUV0VFTi5JbnRlcnBvbGF0aW9uLlV0aWxzLkNhdG11bGxSb207XG5cblx0XHRpZiAoIHZbIDAgXSA9PT0gdlsgbSBdICkge1xuXG5cdFx0XHRpZiAoIGsgPCAwICkgaSA9IE1hdGguZmxvb3IoIGYgPSBtICogKCAxICsgayApICk7XG5cblx0XHRcdHJldHVybiBmbiggdlsgKCBpIC0gMSArIG0gKSAlIG0gXSwgdlsgaSBdLCB2WyAoIGkgKyAxICkgJSBtIF0sIHZbICggaSArIDIgKSAlIG0gXSwgZiAtIGkgKTtcblxuXHRcdH0gZWxzZSB7XG5cblx0XHRcdGlmICggayA8IDAgKSByZXR1cm4gdlsgMCBdIC0gKCBmbiggdlsgMCBdLCB2WyAwIF0sIHZbIDEgXSwgdlsgMSBdLCAtZiApIC0gdlsgMCBdICk7XG5cdFx0XHRpZiAoIGsgPiAxICkgcmV0dXJuIHZbIG0gXSAtICggZm4oIHZbIG0gXSwgdlsgbSBdLCB2WyBtIC0gMSBdLCB2WyBtIC0gMSBdLCBmIC0gbSApIC0gdlsgbSBdICk7XG5cblx0XHRcdHJldHVybiBmbiggdlsgaSA/IGkgLSAxIDogMCBdLCB2WyBpIF0sIHZbIG0gPCBpICsgMSA/IG0gOiBpICsgMSBdLCB2WyBtIDwgaSArIDIgPyBtIDogaSArIDIgXSwgZiAtIGkgKTtcblxuXHRcdH1cblxuXHR9LFxuXG5cdFV0aWxzOiB7XG5cblx0XHRMaW5lYXI6IGZ1bmN0aW9uICggcDAsIHAxLCB0ICkge1xuXG5cdFx0XHRyZXR1cm4gKCBwMSAtIHAwICkgKiB0ICsgcDA7XG5cblx0XHR9LFxuXG5cdFx0QmVybnN0ZWluOiBmdW5jdGlvbiAoIG4gLCBpICkge1xuXG5cdFx0XHR2YXIgZmMgPSBUV0VFTi5JbnRlcnBvbGF0aW9uLlV0aWxzLkZhY3RvcmlhbDtcblx0XHRcdHJldHVybiBmYyggbiApIC8gZmMoIGkgKSAvIGZjKCBuIC0gaSApO1xuXG5cdFx0fSxcblxuXHRcdEZhY3RvcmlhbDogKCBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdHZhciBhID0gWyAxIF07XG5cblx0XHRcdHJldHVybiBmdW5jdGlvbiAoIG4gKSB7XG5cblx0XHRcdFx0dmFyIHMgPSAxLCBpO1xuXHRcdFx0XHRpZiAoIGFbIG4gXSApIHJldHVybiBhWyBuIF07XG5cdFx0XHRcdGZvciAoIGkgPSBuOyBpID4gMTsgaS0tICkgcyAqPSBpO1xuXHRcdFx0XHRyZXR1cm4gYVsgbiBdID0gcztcblxuXHRcdFx0fTtcblxuXHRcdH0gKSgpLFxuXG5cdFx0Q2F0bXVsbFJvbTogZnVuY3Rpb24gKCBwMCwgcDEsIHAyLCBwMywgdCApIHtcblxuXHRcdFx0dmFyIHYwID0gKCBwMiAtIHAwICkgKiAwLjUsIHYxID0gKCBwMyAtIHAxICkgKiAwLjUsIHQyID0gdCAqIHQsIHQzID0gdCAqIHQyO1xuXHRcdFx0cmV0dXJuICggMiAqIHAxIC0gMiAqIHAyICsgdjAgKyB2MSApICogdDMgKyAoIC0gMyAqIHAxICsgMyAqIHAyIC0gMiAqIHYwIC0gdjEgKSAqIHQyICsgdjAgKiB0ICsgcDE7XG5cblx0XHR9XG5cblx0fVxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cz1UV0VFTjsiLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QvYWRkb25zJztcbmltcG9ydCB7XG5cdENvbnRhaW5lcixcblx0Y3JlYXRlQXBwLFxuXHRVSSxcblx0Vmlldyxcblx0Vmlld01hbmFnZXJcbn0gZnJvbSAndG91Y2hzdG9uZWpzJztcblxuLy8gQXBwIENvbmZpZ1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmNvbnN0IE1lZGlhU3RvcmUgPSByZXF1aXJlKCcuL3N0b3Jlcy9tZWRpYScpXG5jb25zdCBtZWRpYVN0b3JlID0gbmV3IE1lZGlhU3RvcmUoKVxuXG5cbnZhciBBcHAgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdG1peGluczogW2NyZWF0ZUFwcCgpXSxcblxuXHRjaGlsZENvbnRleHRUeXBlczoge1xuXHRcdG1lZGlhU3RvcmU6IFJlYWN0LlByb3BUeXBlcy5vYmplY3Rcblx0fSxcblxuXHRnZXRDaGlsZENvbnRleHQgKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRtZWRpYVN0b3JlOiBtZWRpYVN0b3JlXG5cdFx0fTtcblx0fSxcblxuXHRyZW5kZXIgKCkge1xuXHRcdGxldCBhcHBXcmFwcGVyQ2xhc3NOYW1lID0gJ2FwcC13cmFwcGVyIGRldmljZS0tJyArICh3aW5kb3cuZGV2aWNlIHx8IHt9KS5wbGF0Zm9ybVxuXG5cdFx0cmV0dXJuIChcblx0XHRcdDxkaXYgY2xhc3NOYW1lPXthcHBXcmFwcGVyQ2xhc3NOYW1lfT5cblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJkZXZpY2Utc2lsaG91ZXR0ZVwiPlxuXHRcdFx0XHRcdDxWaWV3TWFuYWdlciBuYW1lPVwiYXBwXCIgZGVmYXVsdFZpZXc9XCJtYWluXCI+XG5cdFx0XHRcdFx0XHQ8VmlldyBuYW1lPVwibWFpblwiIGNvbXBvbmVudD17TWFpblZpZXdDb250cm9sbGVyfSAvPlxuXHRcdFx0XHRcdDwvVmlld01hbmFnZXI+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0PC9kaXY+XG5cdFx0KTtcblx0fVxufSk7XG5cbi8vIE1haW4gQ29udHJvbGxlclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgTWFpblZpZXdDb250cm9sbGVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRyZW5kZXIgKCkge1xuXHRcdHJldHVybiAoXG5cdFx0XHQ8Q29udGFpbmVyPlxuXHRcdFx0XHQ8VUkuTmF2aWdhdGlvbkJhciBuYW1lPVwibWFpblwiIC8+XG5cdFx0XHRcdDxWaWV3TWFuYWdlciBuYW1lPVwibWFpblwiIGRlZmF1bHRWaWV3PVwidGFic1wiPlxuXHRcdFx0XHRcdDxWaWV3IG5hbWU9XCJ0YWJzXCIgY29tcG9uZW50PXtUYWJWaWV3Q29udHJvbGxlcn0gLz5cblx0XHRcdFx0PC9WaWV3TWFuYWdlcj5cblx0XHRcdDwvQ29udGFpbmVyPlxuXHRcdCk7XG5cdH1cbn0pO1xuXG4vLyBUYWIgVmlldyBDb250cm9sbGVyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGxhc3RTZWxlY3RlZFRhYiA9ICdjcml0ZXJpYSdcbnZhciBUYWJWaWV3Q29udHJvbGxlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXG5cdG9uVmlld0NoYW5nZSAobmV4dFZpZXcpIHtcblx0XHRsYXN0U2VsZWN0ZWRUYWIgPSBuZXh0Vmlld1xuXG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRzZWxlY3RlZFRhYjogbmV4dFZpZXdcblx0XHR9KTtcblx0fSxcblxuXHRzZWxlY3RUYWIgKHZhbHVlKSB7XG5cdFx0bGV0IHZpZXdQcm9wcztcblxuXHRcdHRoaXMucmVmcy5saXN0dm0udHJhbnNpdGlvblRvKHZhbHVlLCB7XG5cdFx0XHR0cmFuc2l0aW9uOiAnaW5zdGFudCcsXG5cdFx0XHR2aWV3UHJvcHM6IHZpZXdQcm9wc1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRzZWxlY3RlZFRhYjogdmFsdWVcblx0XHR9KVxuXHR9LFxuXHRnZXRJbml0aWFsU3RhdGUoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHNlbGVjdGVkVGFiOiBsYXN0U2VsZWN0ZWRUYWIsXG5cdFx0XHRwcmVmZXJlbmNlczoge1xuXHRcdFx0XHRtZWRpYVR5cGU6ICdzb25nJyxcblx0XHRcdFx0bnVtUmVzdWx0czogJzI1J1xuXHRcdFx0fVxuXHRcdH07XG5cdH0sXG5cdGNoYW5nZVByZWZlcmVuY2Uoa2V5LHZhbCkge1xuXHRcdHRoaXMuc2V0U3RhdGUoc3RhdGUgPT4ge1xuXHRcdFx0c3RhdGUucHJlZmVyZW5jZXNba2V5XT12YWw7XG5cdFx0XHRyZXR1cm4gc3RhdGU7XG5cdFx0fSk7XG5cdH0sXG5cdHJlbmRlciAoKSB7XG5cdFx0bGV0IHNlbGVjdGVkVGFiID0gdGhpcy5zdGF0ZS5zZWxlY3RlZFRhYlxuXHRcdGxldCBzZWxlY3RlZFRhYlNwYW4gPSBzZWxlY3RlZFRhYlxuXG5cdFx0Ly8gU3Vidmlld3MgaW4gdGhlIHN0YWNrIG5lZWQgdG8gc2hvdyB0aGUgcmlnaHQgdGFiIHNlbGVjdGVkXG5cdFx0aWYgKHNlbGVjdGVkVGFiID09PSAnY3JpdGVyaWEnIHx8IHNlbGVjdGVkVGFiID09PSAnbWVkaWEtbGlzdCcgfHwgc2VsZWN0ZWRUYWIgPT09ICdtZWRpYS1kZXRhaWxzJyB8fCBzZWxlY3RlZFRhYiA9PT0gJ2Fib3V0Jykge1xuXHRcdFx0c2VsZWN0ZWRUYWJTcGFuID0gJ2NyaXRlcmlhJztcblx0XHR9XG5cblx0XHRlbHNlIHNlbGVjdGVkVGFiU3BhbiA9ICdzZXR0aW5ncyc7XG5cblx0XHRyZXR1cm4gKFxuXHRcdFx0PENvbnRhaW5lcj5cblx0XHRcdFx0PFZpZXdNYW5hZ2VyIHJlZj1cImxpc3R2bVwiIG5hbWU9XCJ0YWJzXCIgZGVmYXVsdFZpZXc9e3NlbGVjdGVkVGFifSBvblZpZXdDaGFuZ2U9e3RoaXMub25WaWV3Q2hhbmdlfT5cblx0XHRcdFx0XHQ8VmlldyBuYW1lPVwiYWJvdXRcIiBjb21wb25lbnQ9e3JlcXVpcmUoJy4vdmlld3MvYWJvdXQnKX0gLz5cblx0XHRcdFx0XHQ8VmlldyBuYW1lPVwiY3JpdGVyaWFcIiBjb21wb25lbnQ9e3JlcXVpcmUoJy4vdmlld3MvY3JpdGVyaWEtZm9ybScpfSBwcmVmZXJlbmNlcz17dGhpcy5zdGF0ZS5wcmVmZXJlbmNlc30vPlxuXHRcdFx0XHRcdDxWaWV3IG5hbWU9XCJtZWRpYS1saXN0XCIgY29tcG9uZW50PXtyZXF1aXJlKCcuL3ZpZXdzL21lZGlhLWxpc3QnKX0gLz5cblx0XHRcdFx0XHQ8VmlldyBuYW1lPVwibWVkaWEtZGV0YWlsc1wiIGNvbXBvbmVudD17cmVxdWlyZSgnLi92aWV3cy9tZWRpYS1kZXRhaWxzJyl9IC8+XG5cdFx0XHRcdFx0PFZpZXcgbmFtZT1cInNldHRpbmdzXCIgY29tcG9uZW50PXtyZXF1aXJlKCcuL3ZpZXdzL3ByZWZlcmVuY2VzJyl9IHByZWZlcmVuY2VzPXt0aGlzLnN0YXRlLnByZWZlcmVuY2VzfVxuXHRcdFx0XHRcdFx0b25DaGFuZ2VQcmVmZXJlbmNlPXsoa2V5LHZhbCkgPT4gdGhpcy5jaGFuZ2VQcmVmZXJlbmNlKGtleSx2YWwpfS8+XG5cdFx0XHRcdDwvVmlld01hbmFnZXI+XG5cblx0XHRcdFx0PFVJLlRhYnMuTmF2aWdhdG9yPlxuXHRcdFx0XHRcdDxVSS5UYWJzLlRhYiBvblRhcD17dGhpcy5zZWxlY3RUYWIuYmluZCh0aGlzLCAnY3JpdGVyaWEnKX0gc2VsZWN0ZWQ9e3NlbGVjdGVkVGFiU3BhbiA9PT0gJ2NyaXRlcmlhJ30+XG5cdFx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9XCJUYWJzLUljb24gVGFicy1JY29uLS1mb3JtXCIgLz5cblx0XHRcdFx0XHRcdDxVSS5UYWJzLkxhYmVsPlNlYXJjaCBNZWRpYTwvVUkuVGFicy5MYWJlbD5cblx0XHRcdFx0XHQ8L1VJLlRhYnMuVGFiPlxuXG5cdFx0XHRcdFx0PFVJLlRhYnMuVGFiIG9uVGFwPXt0aGlzLnNlbGVjdFRhYi5iaW5kKHRoaXMsICdzZXR0aW5ncycpfSBzZWxlY3RlZD17c2VsZWN0ZWRUYWJTcGFuID09PSAnc2V0dGluZ3MnfT5cblx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT1cIlRhYnMtSWNvbiBUYWJzLUljb24tLXNldHRpbmdzXCIgLz5cblx0XHRcdFx0XHRcdDxVSS5UYWJzLkxhYmVsPlByZWZlcmVuY2VzPC9VSS5UYWJzLkxhYmVsPlxuXHRcdFx0XHRcdDwvVUkuVGFicy5UYWI+XG5cdFx0XHRcdDwvVUkuVGFicy5OYXZpZ2F0b3I+XG5cdFx0XHQ8L0NvbnRhaW5lcj5cblx0XHQpO1xuXHR9XG59KTtcblxuZnVuY3Rpb24gc3RhcnRBcHAgKCkge1xuXG5cdC8vIEhhbmRsZSBhbnkgY29yZG92YSBuZWVkcyBoZXJlXG5cblx0Ly8gSWYgc3BsYXNoIHNjcmVlbiBwbHVnaW4gaXMgbG9hZGVkIGFuZCBjb25maWcueG1sIHByZWZzIGhhdmUgQXV0b0hpZGVTcGxhc2hTY3JlZW4gc2V0IHRvIGZhbHNlIGZvciBpT1Mgd2UgbmVlZCB0b1xuXHQvLyBwcm9ncmFtYXRpY2FsbHkgaGlkZSBpdCBoZXJlLiBDb3VsZCBpbmNsdWRlIGluIGEgdGltZW91dCBpZiBuZWVkZWQgdG8gbG9hZCBtb3JlIHJlc291cmNlcyBvciBzZWUgYSB3aGl0ZSBzY3JlZW5cblx0Ly8gZGlzcGxheSBpbiBiZXR3ZWVuIHNwbGFzaCBzY3JlZW4gYW5kIGFwcCBsb2FkLiBSZW1vdmUgb3IgY2hhbmdlIGFzIG5lZWRlZC4gTGVmdCB0aW1lb3V0IGNvZGUgZm9yIHJlZmVyZW5jZSwgdGltZW91dFxuXHQvLyBub3QgbmVlZGVkIGluIHRoaXMgY2FzZS5cblx0aWYgKG5hdmlnYXRvci5zcGxhc2hzY3JlZW4pIHtcblx0XHQvL3NldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0bmF2aWdhdG9yLnNwbGFzaHNjcmVlbi5oaWRlKCk7XG5cdFx0Ly99LCAxMDAwKTtcblx0fVxuXG5cdFJlYWN0LnJlbmRlcig8QXBwIC8+LCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJykpO1xufVxuXG5pZiAoIXdpbmRvdy5jb3Jkb3ZhKSB7XG5cdHN0YXJ0QXBwKCk7XG59IGVsc2Uge1xuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdkZXZpY2VyZWFkeScsIHN0YXJ0QXBwLCBmYWxzZSk7XG59XG4iLCJmdW5jdGlvbiBNZWRpYVN0b3JlICgpIHtcblx0dGhpcy5pdGVtcyA9IFtdO1xufVxuTWVkaWFTdG9yZS5wcm90b3R5cGUuZm9ybWF0RGF0ZSA9IGZ1bmN0aW9uKCl7XG5cdC8vdmFyIGl0ZW1BcnJheSA9IHJlcy5ib2R5LnJlc3VsdHMubWFwKHIgPT4gcik7XG5cblx0Ly8gUG9zdCBwcm9jZXNzaW5nIG9mIHRoZSBkYXRhXG5cdHRoaXMuaXRlbXMuZm9yRWFjaCgoaXRlbSwgaSkgPT4ge1xuXHRcdGl0ZW0uaWQgPSBpO1xuXHRcdGl0ZW0ucmVsZWFzZURhdGUgPSBpdGVtLnJlbGVhc2VEYXRlLnN1YnN0cmluZygwLDEwKTsgLy8gRm9ybWF0IHRoZSBkYXRlIHRvIGp1c3Qgc2hvdyB0aGUgZGF0ZSBpdHNlbGYgaW5zdGVhZCBvZiBHTVRcblx0fSlcblx0cmV0dXJuIHRoaXMuaXRlbXM7XG59XG5tb2R1bGUuZXhwb3J0cyA9IE1lZGlhU3RvcmVcbiIsImltcG9ydCBDb250YWluZXIgZnJvbSAncmVhY3QtY29udGFpbmVyJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgVGFwcGFibGUgZnJvbSAncmVhY3QtdGFwcGFibGUnO1xuaW1wb3J0IHsgTGluaywgVUkgfSBmcm9tICd0b3VjaHN0b25lanMnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICBzdGF0aWNzOiB7XG4gICAgICAgIG5hdmlnYXRpb25CYXI6ICdtYWluJyxcbiAgICAgICAgZ2V0TmF2aWdhdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnQWJvdXQnXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb3BlblVSTCAoKSB7XG4gICAgICAgIHZhciBwcm9qZWN0VXJsID0gXCJodHRwOi8vZ2l0aHViLmNvbS9ob2xseXNjaGluc2t5L3Bob25lZ2FwLWFwcC10b3VjaHN0b25lanNcIjtcbiAgICAgICAgaWYgKCF3aW5kb3cuY29yZG92YSlcbiAgICAgICAgICAgIHdpbmRvdy5vcGVuKHByb2plY3RVcmwpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGNvcmRvdmEuSW5BcHBCcm93c2VyLm9wZW4ocHJvamVjdFVybCxcIl9ibGFua1wiKTtcbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8Q29udGFpbmVyPlxuICAgICAgICAgICAgICAgIDxVSS5Hcm91cD5cbiAgICAgICAgICAgICAgICAgICAgPFVJLkdyb3VwSGVhZGVyIGNsYXNzTmFtZT1cInRleHQtcHJpbWFyeVwiPkFwcCBEZXRhaWxzPC9VSS5Hcm91cEhlYWRlcj5cbiAgICAgICAgICAgICAgICAgICAgPFVJLkxpc3RIZWFkZXI+aVR1bmVzIE1lZGlhIEZpbmRlcjwvVUkuTGlzdEhlYWRlcj5cbiAgICAgICAgICAgICAgICAgICAgPFVJLkxhYmVsSW5wdXQgcmVhZE9ubHkgbGFiZWw9XCJWZXJzaW9uXCIgdmFsdWU9XCIwLjEuMFwiLz5cbiAgICAgICAgICAgICAgICAgICAgPFVJLkxhYmVsSW5wdXQgcmVhZE9ubHkgbGFiZWw9XCJEYXRlXCIgdmFsdWU9XCJTZXB0ZW1iZXIgMjAxNVwiLz5cbiAgICAgICAgICAgICAgICA8L1VJLkdyb3VwPlxuXG4gICAgICAgICAgICAgICAgPFVJLkdyb3VwPlxuICAgICAgICAgICAgICAgICAgICA8VUkuR3JvdXBIZWFkZXIgY2xhc3NOYW1lPVwidGV4dC1wcmltYXJ5XCI+QXV0aG9yPC9VSS5Hcm91cEhlYWRlcj5cbiAgICAgICAgICAgICAgICAgICAgPFVJLkdyb3VwQm9keT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxVSS5JdGVtPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxVSS5JdGVtSW5uZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxVSS5JdGVtQ29udGVudD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxVSS5JdGVtVGl0bGU+SG9sbHkgU2NoaW5za3k8L1VJLkl0ZW1UaXRsZT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9VSS5JdGVtQ29udGVudD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPFRhcHBhYmxlIG9uVGFwPXt0aGlzLm9wZW5VUkwuYmluZChudWxsKX0gc3RvcFByb3BhZ2F0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPFVJLkl0ZW1Ob3RlIGljb249J2lvbi1pb3Mtc3RhcicgdHlwZT1cInByaW1hcnlcIiBjbGFzc05hbWU9XCJpb24tbGdcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L1RhcHBhYmxlPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvVUkuSXRlbUlubmVyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9VSS5JdGVtPlxuICAgICAgICAgICAgICAgICAgICAgICAgPFVJLkl0ZW0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPFVJLkl0ZW1Jbm5lcj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPFVJLkl0ZW1Db250ZW50PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPFVJLkl0ZW1UaXRsZT5QaG9uZUdhcCBUZWFtPC9VSS5JdGVtVGl0bGU+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8VUkuSXRlbVN1YlRpdGxlPkFkb2JlIFN5c3RlbXMsIEluYzwvVUkuSXRlbVN1YlRpdGxlPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L1VJLkl0ZW1Db250ZW50PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvVUkuSXRlbUlubmVyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9VSS5JdGVtPlxuXG4gICAgICAgICAgICAgICAgICAgIDwvVUkuR3JvdXBCb2R5PlxuICAgICAgICAgICAgICAgIDwvVUkuR3JvdXA+XG4gICAgICAgICAgICAgICAgPFVJLkdyb3VwPlxuICAgICAgICAgICAgICAgICAgICA8VUkuR3JvdXBIZWFkZXIgY2xhc3NOYW1lPVwidGV4dC1wcmltYXJ5XCI+UG93ZXJlZCBCeTwvVUkuR3JvdXBIZWFkZXI+XG4gICAgICAgICAgICAgICAgICAgIDxVSS5JdGVtPlxuICAgICAgICAgICAgICAgICAgICAgICAgPFVJLkl0ZW1Jbm5lcj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8VUkuSXRlbUNvbnRlbnQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiaW1nL3JlYWN0Mi5wbmdcIiBjbGFzc05hbWU9XCJhdmF0YXJcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiaW1nL3RzLWljb24ucG5nXCIgY2xhc3NOYW1lPVwiYXZhdGFyXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz1cImltZy9wZy1sb2dvLnBuZ1wiIGNsYXNzTmFtZT1cImF2YXRhclwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L1VJLkl0ZW1Db250ZW50PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvVUkuSXRlbUlubmVyPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICA8L1VJLkl0ZW0+XG4gICAgICAgICAgICAgICAgPC9VSS5Hcm91cD5cblxuICAgICAgICAgICAgPC9Db250YWluZXI+XG5cblxuICAgICAgICApO1xuICAgIH1cbn0pO1xuIiwiaW1wb3J0IENvbnRhaW5lciBmcm9tICdyZWFjdC1jb250YWluZXInO1xuaW1wb3J0IGRpYWxvZ3MgZnJvbSAnY29yZG92YS1kaWFsb2dzJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgVGFwcGFibGUgZnJvbSAncmVhY3QtdGFwcGFibGUnO1xuaW1wb3J0IHtMaW5rLCBVSSB9IGZyb20gJ3RvdWNoc3RvbmVqcyc7XG5cbmNvbnN0IHNjcm9sbGFibGUgPSBDb250YWluZXIuaW5pdFNjcm9sbGFibGUoKTtcblxuY29uc3QgTUVESUFfVFlQRVMgPSBbXG5cdHsgbGFiZWw6ICdNdXNpYyBWaWRlbycsICAgIHZhbHVlOiAnbXVzaWNWaWRlbycgfSxcblx0eyBsYWJlbDogJ1NvbmcnLCAgdmFsdWU6ICdzb25nJyB9LFxuXHR7IGxhYmVsOiAnTW92aWUnLCAgICB2YWx1ZTogJ21vdmllJyB9LFxuXTtcbmNvbnN0IFJFU1VMVFMgPSBbXG5cdHsgbGFiZWw6ICcxNScsICAgIHZhbHVlOiAnMTUnIH0sXG5cdHsgbGFiZWw6ICcyNScsICB2YWx1ZTogJzI1JyB9LFxuXHR7IGxhYmVsOiAnNTAnLCAgICB2YWx1ZTogJzUwJyB9LFxuXTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGNvbnRleHRUeXBlczogeyBtZWRpYVN0b3JlOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsIGFwcDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCB9LFxuXHRzdGF0aWNzOiB7XG5cdFx0bmF2aWdhdGlvbkJhcjogJ21haW4nLFxuXHRcdGdldE5hdmlnYXRpb24gKHByb3BzLGFwcCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dGl0bGU6ICdTZWFyY2ggQ3JpdGVyaWEnLFxuXHRcdFx0XHRsZWZ0QXJyb3c6IGZhbHNlLFxuXHRcdFx0XHRyaWdodEFjdGlvbjogKCkgPT4geyBhcHAudHJhbnNpdGlvblRvKCd0YWJzOmFib3V0JywgeyB0cmFuc2l0aW9uOiAnZmFkZS1leHBhbmQnIH0pIH0sXG5cdFx0XHRcdHJpZ2h0SWNvbjogJ2lvbi1pbmZvcm1hdGlvbi1jaXJjbGVkJ1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHRnZXRJbml0aWFsU3RhdGUgKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRtZWRpYVR5cGU6IHRoaXMucHJvcHMucHJlZmVyZW5jZXMubWVkaWFUeXBlLFxuXHRcdFx0bnVtUmVzdWx0czogdGhpcy5wcm9wcy5wcmVmZXJlbmNlcy5udW1SZXN1bHRzLFxuXHRcdFx0c2VhcmNoVGVybTogJ0VkIFNoZWVyYW4nXG5cdFx0fVxuXHR9LFxuXG5cdGhhbmRsZVJlc3VsdHNDaGFuZ2UgKGtleSwgbmV3VmFsdWUpIHtcblx0XHRsZXQgbmV3U3RhdGUgPSB7fTtcblx0XHRuZXdTdGF0ZVtrZXldID0gbmV3VmFsdWU7XG5cdFx0dGhpcy5zZXRTdGF0ZShuZXdTdGF0ZSk7XG5cdH0sXG5cdFxuXHRoYW5kbGVUeXBlQ2hhbmdlIChrZXksIGV2ZW50KSB7XG5cdFx0dGhpcy5zdGF0ZS5tZWRpYVR5cGUgPSBldmVudC50YXJnZXQudmFsdWU7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7IC8vIHdvbid0IHN0YXkgc2VsZWN0ZWQgaWYgSSBkb24ndCBzdG9wIGl0IGZyb20gcHJvcGFnYXRlZCAtIG1heSBiZSBidWcgaW4gTGFiZWxTZWxlY3Rcblx0fSxcblxuXHRoYW5kbGVTZWFyY2hUZXJtQ2hhbmdlIChrZXksIGV2ZW50KSB7XG5cdFx0bGV0IG5ld1N0YXRlID0ge307XG5cdFx0bmV3U3RhdGVba2V5XSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcblx0XHR0aGlzLnNldFN0YXRlKG5ld1N0YXRlKTtcblx0fSxcblxuXHRzaG93UmVzdWx0cygpIHtcblx0XHR0aGlzLmNvbnRleHQuYXBwLnRyYW5zaXRpb25UbygndGFiczptZWRpYS1saXN0Jyxcblx0XHRcdHt0cmFuc2l0aW9uOiAnc2hvdy1mcm9tLXJpZ2h0Jyx2aWV3UHJvcHM6e3ByZXZWaWV3OiAnY3JpdGVyaWEnLCBtZWRpYVR5cGU6IHRoaXMuc3RhdGUubWVkaWFUeXBlLCBzZWFyY2hUZXJtOiB0aGlzLnN0YXRlLnNlYXJjaFRlcm0sXG5cdFx0XHRcdG51bVJlc3VsdHM6IHRoaXMuc3RhdGUubnVtUmVzdWx0c319KVxuXG5cdH0sXG5cblx0cmVuZGVyICgpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PENvbnRhaW5lciBzY3JvbGxhYmxlPXtzY3JvbGxhYmxlfT5cblx0XHRcdFx0PFVJLkdyb3VwPlxuXHRcdFx0XHRcdDxVSS5Hcm91cEhlYWRlcj5TZWFyY2ggQ3JpdGVyaWE8L1VJLkdyb3VwSGVhZGVyPlxuXHRcdFx0XHRcdDxVSS5Hcm91cEJvZHk+XG5cdFx0XHRcdFx0XHQ8VUkuTGFiZWxTZWxlY3QgbGFiZWw9XCJUeXBlXCIgb25DaGFuZ2U9e3RoaXMuaGFuZGxlVHlwZUNoYW5nZS5iaW5kKHRoaXMsJ21lZGlhVHlwZScpfSB2YWx1ZT17dGhpcy5zdGF0ZS5tZWRpYVR5cGV9IG9wdGlvbnM9e01FRElBX1RZUEVTfSAvPlxuXHRcdFx0XHRcdFx0PFVJLkxhYmVsSW5wdXQgbGFiZWw9XCJTZWFyY2ggdGVybVwiICB2YWx1ZT17dGhpcy5zdGF0ZS5zZWFyY2hUZXJtfSBwbGFjZWhvbGRlcj1cInNlYXJjaCB0ZXJtXCIgb25DaGFuZ2U9e3RoaXMuaGFuZGxlU2VhcmNoVGVybUNoYW5nZS5iaW5kKHRoaXMsICdzZWFyY2hUZXJtJyl9ICAvPlxuXHRcdFx0XHRcdDwvVUkuR3JvdXBCb2R5PlxuXHRcdFx0XHQ8L1VJLkdyb3VwPlxuXHRcdFx0XHQ8VUkuR3JvdXA+XG5cdFx0XHRcdFx0PFVJLkdyb3VwSGVhZGVyPiMgUmVzdWx0czwvVUkuR3JvdXBIZWFkZXI+XG5cdFx0XHRcdFx0PFVJLkdyb3VwQm9keT5cblx0XHRcdFx0XHRcdDxVSS5SYWRpb0xpc3QgdmFsdWU9e3RoaXMuc3RhdGUubnVtUmVzdWx0c30gb25DaGFuZ2U9e3RoaXMuaGFuZGxlUmVzdWx0c0NoYW5nZS5iaW5kKHRoaXMsICdudW1SZXN1bHRzJyl9IG9wdGlvbnM9e1JFU1VMVFN9Lz5cblx0XHRcdFx0XHQ8L1VJLkdyb3VwQm9keT5cblx0XHRcdFx0PC9VSS5Hcm91cD5cblx0XHRcdFx0PFVJLkJ1dHRvbiBvblRhcD17dGhpcy5zaG93UmVzdWx0c30gdHlwZT1cInByaW1hcnlcIj5TaG93IFJlc3VsdHM8L1VJLkJ1dHRvbj5cblx0XHRcdDwvQ29udGFpbmVyPlxuXHRcdCk7XG5cdH1cbn0pO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGhzY2hpbnNrIG9uIDgvMjUvMTUuXG4gKi9cbmltcG9ydCBDb250YWluZXIgZnJvbSAncmVhY3QtY29udGFpbmVyJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBMaW5rLCBVSSB9IGZyb20gJ3RvdWNoc3RvbmVqcyc7XG5cbmNvbnN0IHNjcm9sbGFibGUgPSBDb250YWluZXIuaW5pdFNjcm9sbGFibGUoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgc3RhdGljczoge1xuICAgICAgICBuYXZpZ2F0aW9uQmFyOiAnbWFpbicsXG4gICAgICAgIGdldE5hdmlnYXRpb24gKHByb3BzLCBhcHApIHtcbiAgICAgICAgICAgIHZhciBsZWZ0TGFiZWwgPSAnTGlzdCc7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGxlZnRBcnJvdzogdHJ1ZSxcbiAgICAgICAgICAgICAgICBsZWZ0TGFiZWw6IGxlZnRMYWJlbCxcbiAgICAgICAgICAgICAgICBsZWZ0QWN0aW9uOiAoKSA9PiB7IGFwcC50cmFuc2l0aW9uVG8oJ3RhYnM6JyArIHByb3BzLnByZXZWaWV3LCB7IHRyYW5zaXRpb246ICdyZXZlYWwtZnJvbS1yaWdodCcgfSkgfSxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ0RldGFpbHMnXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZ2V0RGVmYXVsdFByb3BzICgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHByZXZWaWV3OiAnbWVkaWEtZGV0YWlscydcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvcGVuVVJMIChldmVudCkge1xuICAgICAgICB2YXIgbWVkaWFVcmwgPSB0aGlzLnByb3BzLml0ZW0udHJhY2tWaWV3VXJsO1xuICAgICAgICBpZiAoIXdpbmRvdy5jb3Jkb3ZhKVxuICAgICAgICAgICAgd2luZG93Lm9wZW4obWVkaWFVcmwpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGNvcmRvdmEuSW5BcHBCcm93c2VyLm9wZW4obWVkaWFVcmwsXCJfYmxhbmtcIik7XG4gICAgfSxcblxuICAgIHJlbmRlciAoKSB7XG4gICAgICAgIHZhciB7IGl0ZW0gfSA9IHRoaXMucHJvcHM7XG5cbiAgICAgICAgdmFyIHZpZGVvVmFsID0gJ2Jsb2NrJztcbiAgICAgICAgdmFyIGF1ZGlvVmFsID0gJ25vbmUnO1xuICAgICAgICB2YXIgY2xhc3NOYW1lID0gXCJ2aWRlb19fYXZhdGFyXCI7XG5cbiAgICAgICAgaWYgKGl0ZW0ua2luZC5pbmRleE9mKCdzb25nJyk+LTEpIHtcbiAgICAgICAgICAgIHZpZGVvVmFsID0gJ25vbmUnO1xuICAgICAgICAgICAgYXVkaW9WYWwgPSAnYmxvY2snO1xuICAgICAgICAgICAgY2xhc3NOYW1lID0gXCJzb25nX19hdmF0YXJcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChpdGVtLmtpbmQuaW5kZXhPZignbW92aWUnKT4tMSkge1xuICAgICAgICAgICAgdmlkZW9WYWwgPSAnbm9uZSc7XG4gICAgICAgICAgICBhdWRpb1ZhbCA9ICdub25lJztcbiAgICAgICAgICAgIGNsYXNzTmFtZSA9IFwibW92aWVfX2F2YXRhclwiO1xuICAgICAgICB9XG5cblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPENvbnRhaW5lciBzY3JvbGxhYmxlPXtzY3JvbGxhYmxlfT5cbiAgICAgICAgICAgICAgICA8VUkuR3JvdXA+XG4gICAgICAgICAgICAgICAgICAgIDxVSS5Hcm91cEhlYWRlciBjbGFzc05hbWU9XCJ0ZXh0LXByaW1hcnlcIj57aXRlbS5raW5kfTwvVUkuR3JvdXBIZWFkZXI+XG4gICAgICAgICAgICAgICAgICAgIDxVSS5Hcm91cEJvZHk+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz17aXRlbS5hcnR3b3JrVXJsMTAwfSBjbGFzc05hbWU9e2NsYXNzTmFtZX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgPFVJLkxhYmVsSW5wdXQgcmVhZE9ubHkgbGFiZWw9XCJJdGVtIE5hbWVcIiB2YWx1ZT17aXRlbS50cmFja05hbWV9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxVSS5MYWJlbElucHV0IHJlYWRPbmx5IGxhYmVsPVwiQXJ0aXN0XCIgdmFsdWU9e2l0ZW0uYXJ0aXN0TmFtZX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgPFVJLkxhYmVsSW5wdXQgcmVhZE9ubHkgbGFiZWw9XCJHZW5yZVwiIHZhbHVlPXtpdGVtLnByaW1hcnlHZW5yZU5hbWV9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxVSS5MYWJlbElucHV0IHJlYWRPbmx5IGxhYmVsPVwiQ29sbGVjdGlvblwiIHZhbHVlPXtpdGVtLmNvbGxlY3Rpb25OYW1lfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8VUkuTGFiZWxJbnB1dCByZWFkT25seSBsYWJlbD1cIkl0ZW0gUHJpY2VcIiB2YWx1ZT17aXRlbS50cmFja1ByaWNlfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8VUkuTGFiZWxJbnB1dCByZWFkT25seSBsYWJlbD1cIlJlbGVhc2VkXCIgdmFsdWU9e2l0ZW0ucmVsZWFzZURhdGV9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxVSS5JdGVtPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxVSS5JdGVtSW5uZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxVSS5GaWVsZExhYmVsPkV4cGxpY2l0PzwvVUkuRmllbGRMYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPFVJLlN3aXRjaCBvbj17aXRlbS5jb2xsZWN0aW9uRXhwbGljaXRuZXNzPT0nZXhwbGljaXQnfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9VSS5JdGVtSW5uZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L1VJLkl0ZW0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8VUkuSXRlbSBzdHlsZT17e2Rpc3BsYXk6YXVkaW9WYWx9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8VUkuSXRlbUlubmVyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YXVkaW8gY29udHJvbHM9XCJ0cnVlXCIgcHJlbG9hZD1cImF1dG9cIiBzcmM9e2l0ZW0ucHJldmlld1VybH0+4oCoPC9hdWRpbz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L1VJLkl0ZW1Jbm5lcj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvVUkuSXRlbT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxVSS5JdGVtIHN0eWxlPXt7ZGlzcGxheTp2aWRlb1ZhbH19PuKAqFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx2aWRlbyBjb250cm9scyB3aWR0aD1cIjM1MFwiIHNyYz17aXRlbS5wcmV2aWV3VXJsfSB0eXBlPVwidmlkZW8vbXA0XCI+4oCoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC92aWRlbz5cbiAgICAgICAgICAgICAgICAgICAgICAgIOKAqDwvVUkuSXRlbT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxVSS5JdGVtPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxVSS5JdGVtSW5uZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxVSS5CdXR0b24gb25UYXA9e3RoaXMub3BlblVSTC5iaW5kKHRoaXMsdGhpcy5wcm9wcy5pdGVtLnRyYWNrVmlld1VybCl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPFVJLkl0ZW1Ob3RlIGxhYmVsPVwiT3BlbiBpbiBpVHVuZXNcIiBpY29uPVwiaW9uLXNoYXJlXCIgdHlwZT1cImluZm9cIj48L1VJLkl0ZW1Ob3RlPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L1VJLkJ1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L1VJLkl0ZW1Jbm5lcj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvVUkuSXRlbT5cbiAgICAgICAgICAgICAgICAgICAgPC9VSS5Hcm91cEJvZHk+XG4gICAgICAgICAgICAgICAgICAgIDxVSS5Hcm91cEZvb3Rlcj5cbiAgICAgICAgICAgICAgICAgICAgICAgIERhdGEgYmFzZWQgb24gdGhlIGxhdGVzdCByZXN1bHRzIGZyb20gPGEgaHJlZj1cImh0dHA6Ly9pdHVuZXMuY29tXCI+aVR1bmVzPC9hPlxuICAgICAgICAgICAgICAgICAgICA8L1VJLkdyb3VwRm9vdGVyPlxuICAgICAgICAgICAgICAgIDwvVUkuR3JvdXA+XG4gICAgICAgICAgICA8L0NvbnRhaW5lcj5cbiAgICAgICAgKVxuICAgIH1cbn0pO1xuIiwiaW1wb3J0IENvbnRhaW5lciBmcm9tICdyZWFjdC1jb250YWluZXInO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBTZW50cnkgZnJvbSAncmVhY3Qtc2VudHJ5JztcbmltcG9ydCBUYXBwYWJsZSBmcm9tICdyZWFjdC10YXBwYWJsZSc7XG5pbXBvcnQgVGltZXJzIGZyb20gJ3JlYWN0LXRpbWVycyc7XG5pbXBvcnQgeyBMaW5rLCBVSSB9IGZyb20gJ3RvdWNoc3RvbmVqcyc7XG5cbnZhciBzY3JvbGxhYmxlID0gQ29udGFpbmVyLmluaXRTY3JvbGxhYmxlKHsgbGVmdDogMCwgdG9wOiA0NCB9KTtcblxudmFyIFNpbXBsZUxpbmtJdGVtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRwcm9wVHlwZXM6IHtcblx0XHRpdGVtOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWRcblx0fSxcblxuXHRyZW5kZXIgKCkge1xuXHRcdGxldCBpdGVtID0gdGhpcy5wcm9wcy5pdGVtO1xuXHRcdGxldCBjbGFzc05hbWUgPSBcInZpZGVvX19hdmF0YXJfc21cIjtcblxuXHRcdGlmIChpdGVtLmtpbmQuaW5kZXhPZignc29uZycpPi0xKVxuXHRcdFx0Y2xhc3NOYW1lID0gXCJzb25nX19hdmF0YXJfc21cIjtcblx0XHRlbHNlIGlmIChpdGVtLmtpbmQuaW5kZXhPZignbW92aWUnKT4tMSlcblx0XHRcdGNsYXNzTmFtZSA9IFwibW92aWVfX2F2YXRhcl9zbVwiO1xuXG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0PExpbmsgdG89XCJ0YWJzOm1lZGlhLWRldGFpbHNcIiB0cmFuc2l0aW9uPVwic2hvdy1mcm9tLXJpZ2h0XCIgdmlld1Byb3BzPXt7IGl0ZW06IHRoaXMucHJvcHMuaXRlbSwgcHJldlZpZXc6ICdtZWRpYS1saXN0J319ID5cblx0XHRcdFx0PFVJLkl0ZW0gc2hvd0Rpc2Nsb3N1cmVBcnJvdz5cblx0XHRcdFx0XHQ8aW1nIHNyYz17aXRlbS5hcnR3b3JrVXJsNjB9IGNsYXNzTmFtZT17Y2xhc3NOYW1lfS8+XG5cdFx0XHRcdFx0PFVJLkl0ZW1Jbm5lcj5cblx0XHRcdFx0XHRcdDxVSS5JdGVtQ29udGVudD5cblx0XHRcdFx0XHRcdFx0PFVJLkl0ZW1UaXRsZT57aXRlbS50cmFja05hbWV9PC9VSS5JdGVtVGl0bGU+XG5cdFx0XHRcdFx0XHRcdDxVSS5JdGVtU3ViVGl0bGU+e2l0ZW0uYXJ0aXN0TmFtZX08L1VJLkl0ZW1TdWJUaXRsZT5cblx0XHRcdFx0XHRcdDwvVUkuSXRlbUNvbnRlbnQ+XG5cdFx0XHRcdFx0PC9VSS5JdGVtSW5uZXI+XG5cdFx0XHRcdDwvVUkuSXRlbT5cblx0XHRcdDwvTGluaz5cblx0XHQpO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdG1peGluczogIFtTZW50cnkoKSwgVGltZXJzKCldLFxuXHRjb250ZXh0VHlwZXM6IHsgbWVkaWFTdG9yZTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLCBhcHA6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QgfSxcblx0c3RhdGljczoge1xuXHRcdG5hdmlnYXRpb25CYXI6ICdtYWluJyxcblx0XHRnZXROYXZpZ2F0aW9uIChwcm9wcywgYXBwKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRsZWZ0QXJyb3c6IHRydWUsXG5cdFx0XHRcdGxlZnRMYWJlbDogJ0NyaXRlcmlhJyxcblx0XHRcdFx0bGVmdEFjdGlvbjogKCkgPT4geyBhcHAudHJhbnNpdGlvblRvKCd0YWJzOmNyaXRlcmlhJywgeyB0cmFuc2l0aW9uOiAncmV2ZWFsLWZyb20tcmlnaHQnIH0pIH0sXG5cdFx0XHRcdHRpdGxlOiAnTWVkaWEgUmVzdWx0cydcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0Y29tcG9uZW50RGlkTW91bnQgKCkge1xuXHRcdGlmICh0aGlzLnByb3BzLnByZXZWaWV3PT0nY3JpdGVyaWEnKSB7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0cG9wdXA6IHtcblx0XHRcdFx0XHR2aXNpYmxlOiB0cnVlLFxuXHRcdFx0XHRcdGxvYWRpbmc6IHRydWUsXG5cdFx0XHRcdFx0aGVhZGVyOiAnTG9hZGluZycsXG5cdFx0XHRcdFx0aWNvbk5hbWU6ICdpb24tbG9hZC1hJyxcblx0XHRcdFx0XHRpY29uVHlwZTogJ2RlZmF1bHQnXG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXG5cdFx0XHQvLyBVc2luZyBqc29ucCBzbyB3ZSBjYW4gcnVuIHRoaXMgaW4gdGhlIGJyb3dzZXIgd2l0aG91dCBYSFIgaXNzdWVzIGZvciBlYXNpZXIgZGVidWdnaW5nXG5cdFx0XHR0aGlzLmpzb25wKFwiaHR0cHM6Ly9pdHVuZXMuYXBwbGUuY29tL3NlYXJjaD90ZXJtPVwiICsgdGhpcy5wcm9wcy5zZWFyY2hUZXJtICsgXCImZW50aXR5PVwiICsgdGhpcy5wcm9wcy5tZWRpYVR5cGUgKyBcIiZsaW1pdD1cIiArIHRoaXMucHJvcHMubnVtUmVzdWx0cywgZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRzZWxmLnNldFN0YXRlKHtcblx0XHRcdFx0XHRwb3B1cDoge1xuXHRcdFx0XHRcdFx0dmlzaWJsZTogZmFsc2Vcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRpZiAoZGF0YSE9bnVsbCkge1xuXHRcdFx0XHRcdHNlbGYuY29udGV4dC5tZWRpYVN0b3JlLml0ZW1zID0gZGF0YS5yZXN1bHRzOyAvLyBob2xkIGl0IGluIHRoZSBjb250ZXh0IG9iamVjdCBmb3Igd2hlbiB3ZSBjb21lIGJhY2tcblx0XHRcdFx0XHR2YXIgaXRlbXMgPSBzZWxmLmNvbnRleHQubWVkaWFTdG9yZS5mb3JtYXREYXRlKCk7XG5cdFx0XHRcdFx0c2VsZi5zZXRTdGF0ZSh7bWVkaWE6IGl0ZW1zfSk7XG5cblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHNlbGYuc2hvd0FsZXJ0KCdkYW5nZXInLFwiQW4gZXJyb3Igb2NjdXJyZWQgcmV0cmlldmluZyBkYXRhIGZyb20gaVR1bmVzLiBEbyB5b3UgaGF2ZSBhbiBJbnRlcm5ldCBjb25uZWN0aW9uPyBBIHZhbGlkIFVSTD9cIik7XG5cblx0XHRcdH0pO1xuXHRcdH1cblx0XHQvLyBDb21pbmcgYmFjayBmcm9tIGRldGFpbHMgcGFnZSAtIHVzZSB0aGUgYWxyZWFkeSBzdG9yZWQgcmVzdWx0cyBpbiB0aGUgbWVkaWEgc3RvcmVcblx0XHRlbHNlIHRoaXMuc2V0U3RhdGUoe21lZGlhOnRoaXMuY29udGV4dC5tZWRpYVN0b3JlLml0ZW1zfSlcblx0fSxcblxuXHRqc29ucCAodXJsLCBjYWxsYmFjaykge1xuXHRcdHZhciBjYWxsYmFja05hbWUgPSAnanNvbnBfY2FsbGJhY2tfJyArIE1hdGgucm91bmQoMTAwMDAwICogTWF0aC5yYW5kb20oKSk7XG5cdFx0d2luZG93W2NhbGxiYWNrTmFtZV0gPSBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRkZWxldGUgd2luZG93W2NhbGxiYWNrTmFtZV07XG5cdFx0XHRkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHNjcmlwdCk7XG5cdFx0XHRjYWxsYmFjayhkYXRhKTtcblx0XHR9O1xuXG5cdFx0dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuXHRcdHNjcmlwdC5zcmMgPSB1cmwgKyAodXJsLmluZGV4T2YoJz8nKSA+PSAwID8gJyYnIDogJz8nKSArICdjYWxsYmFjaz0nICsgY2FsbGJhY2tOYW1lO1xuXHRcdHNlbGYgPSB0aGlzO1xuXHRcdHNjcmlwdC5vbmVycm9yID0gZnVuY3Rpb24oZXJyKSB7XG5cdFx0XHRjYWxsYmFjayhudWxsKVxuXHRcdH07XG5cblx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdCk7XG5cdH0sXG5cblx0c2hvd0FsZXJ0ICh0eXBlLCB0ZXh0KSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRhbGVydGJhcjoge1xuXHRcdFx0XHR2aXNpYmxlOiB0cnVlLFxuXHRcdFx0XHR0eXBlOiB0eXBlLFxuXHRcdFx0XHR0ZXh0OiB0ZXh0XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0dGhpcy5zZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRhbGVydGJhcjoge1xuXHRcdFx0XHRcdHZpc2libGU6IGZhbHNlXG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0sIDMwMDApO1xuXHR9LFxuXG5cdGdldEluaXRpYWxTdGF0ZSAoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGZpbHRlclN0cmluZzogJycsXG5cdFx0XHRtZWRpYTogW10sXG5cdFx0XHRwb3B1cDoge1xuXHRcdFx0XHR2aXNpYmxlOiBmYWxzZVxuXHRcdFx0fSxcblx0XHRcdGFsZXJ0YmFyOiB7XG5cdFx0XHRcdHZpc2libGU6IGZhbHNlLFxuXHRcdFx0XHR0eXBlOiAnJyxcblx0XHRcdFx0dGV4dDogJydcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0Y2xlYXJGaWx0ZXIgKCkge1xuXHRcdHRoaXMuc2V0U3RhdGUoeyBmaWx0ZXJTdHJpbmc6ICcnIH0pO1xuXHR9LFxuXG5cdHVwZGF0ZUZpbHRlciAoc3RyKSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7IGZpbHRlclN0cmluZzogc3RyIH0pO1xuXHR9LFxuXG5cdHN1Ym1pdEZpbHRlciAoc3RyKSB7XG5cdFx0Y29uc29sZS5sb2coc3RyKTtcblx0fSxcblxuXHRyZW5kZXIgKCkge1xuXHRcdGxldCB7IG1lZGlhLCBmaWx0ZXJTdHJpbmcsIGFsZXJ0YmFyfSA9IHRoaXMuc3RhdGVcblx0XHRsZXQgZmlsdGVyUmVnZXggPSBuZXcgUmVnRXhwKGZpbHRlclN0cmluZy50b0xvd2VyQ2FzZSgpKVxuXG5cdFx0ZnVuY3Rpb24gbWVkaWFGaWx0ZXIgKGl0ZW0pIHtcblx0XHRcdHJldHVybiBmaWx0ZXJSZWdleC50ZXN0KGl0ZW0udHJhY2tOYW1lLnRvTG93ZXJDYXNlKCkpXG5cdFx0fTtcblx0XHRmdW5jdGlvbiBzb3J0QnlOYW1lIChhLCBiKSB7XG5cdFx0XHRyZXR1cm4gYS50cmFja05hbWUubG9jYWxlQ29tcGFyZShiLnRyYWNrTmFtZSlcblx0XHR9O1xuXG5cdFx0bGV0IGZpbHRlcmVkTWVkaWEgPSBtZWRpYS5maWx0ZXIobWVkaWFGaWx0ZXIpLnNvcnQoc29ydEJ5TmFtZSk7XG5cblx0XHRsZXQgcmVzdWx0c1xuXG5cdFx0aWYgKGZpbHRlclN0cmluZyAmJiAhZmlsdGVyZWRNZWRpYS5sZW5ndGgpIHtcblx0XHRcdHJlc3VsdHMgPSAoXG5cdFx0XHRcdDxDb250YWluZXIgZGlyZWN0aW9uPVwiY29sdW1uXCIgYWxpZ249XCJjZW50ZXJcIiBqdXN0aWZ5PVwiY2VudGVyXCIgY2xhc3NOYW1lPVwibm8tcmVzdWx0c1wiPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwibm8tcmVzdWx0c19faWNvbiBpb24taW9zLWZpbHRlci1zdHJvbmdcIiAvPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwibm8tcmVzdWx0c19fdGV4dFwiPnsnTm8gcmVzdWx0cyBmb3IgXCInICsgZmlsdGVyU3RyaW5nICsgJ1wiJ308L2Rpdj5cblx0XHRcdFx0PC9Db250YWluZXI+XG5cdFx0XHQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXN1bHRzID0gKFxuXHRcdFx0XHQ8VUkuR3JvdXBCb2R5PlxuXHRcdFx0XHRcdHtmaWx0ZXJlZE1lZGlhLm1hcCgoaXRlbSwgaSkgPT4ge1xuXHRcdFx0XHRcdFx0cmV0dXJuIDxTaW1wbGVMaW5rSXRlbSBrZXk9eydpdGVtJyArIGl9IGl0ZW09e2l0ZW19Lz5cblx0XHRcdFx0XHR9KX1cblx0XHRcdFx0PC9VSS5Hcm91cEJvZHk+XG5cdFx0XHQpO1xuXHRcdH1cblxuXHRcdHJldHVybiAoXG5cdFx0XHQ8Q29udGFpbmVyIHJlZj1cInNjcm9sbENvbnRhaW5lclwiIHNjcm9sbGFibGU9e3Njcm9sbGFibGV9PlxuXHRcdFx0XHQ8VUkuQWxlcnRiYXIgdHlwZT17YWxlcnRiYXIudHlwZSB8fCAnZGVmYXVsdCd9IHZpc2libGU9e2FsZXJ0YmFyLnZpc2libGV9IGFuaW1hdGVkPnthbGVydGJhci50ZXh0fTwvVUkuQWxlcnRiYXI+XG5cdFx0XHRcdDxVSS5TZWFyY2hGaWVsZCB0eXBlPVwiZGFya1wiIHZhbHVlPXt0aGlzLnN0YXRlLmZpbHRlclN0cmluZ30gb25TdWJtaXQ9e3RoaXMuc3VibWl0RmlsdGVyfSBvbkNoYW5nZT17dGhpcy51cGRhdGVGaWx0ZXJ9XG5cdFx0XHRcdG9uQ2FuY2VsPXt0aGlzLmNsZWFyRmlsdGVyfSBvbkNsZWFyPXt0aGlzLmNsZWFyRmlsdGVyfSBwbGFjZWhvbGRlcj1cIkZpbHRlci4uLlwiIC8+XG5cdFx0XHRcdHtyZXN1bHRzfVxuXHRcdFx0XHQ8VUkuUG9wdXAgdmlzaWJsZT17dGhpcy5zdGF0ZS5wb3B1cC52aXNpYmxlfT5cblx0XHRcdFx0XHQ8VUkuUG9wdXBJY29uIG5hbWU9e3RoaXMuc3RhdGUucG9wdXAuaWNvbk5hbWV9IHR5cGU9e3RoaXMuc3RhdGUucG9wdXAuaWNvblR5cGV9IHNwaW5uaW5nPXt0aGlzLnN0YXRlLnBvcHVwLmxvYWRpbmd9IC8+XG5cdFx0XHRcdFx0PGRpdj48c3Ryb25nPnt0aGlzLnN0YXRlLnBvcHVwLmhlYWRlcn08L3N0cm9uZz48L2Rpdj5cblx0XHRcdFx0PC9VSS5Qb3B1cD5cblx0XHRcdDwvQ29udGFpbmVyPlxuXHRcdCk7XG5cdH1cbn0pO1xuIiwiXG5pbXBvcnQgQ29udGFpbmVyIGZyb20gJ3JlYWN0LWNvbnRhaW5lcic7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgTGluaywgVUkgfSBmcm9tICd0b3VjaHN0b25lanMnO1xuXG5jb25zdCBzY3JvbGxhYmxlID0gQ29udGFpbmVyLmluaXRTY3JvbGxhYmxlKCk7XG5cbmNvbnN0IE1FRElBX1RZUEVTID0gW1xuICAgIHsgbGFiZWw6ICdNdXNpYyBWaWRlbycsICAgIHZhbHVlOiAnbXVzaWNWaWRlbycgfSxcbiAgICB7IGxhYmVsOiAnU29uZycsICB2YWx1ZTogJ3NvbmcnIH0sXG4gICAgeyBsYWJlbDogJ01vdmllJywgICAgdmFsdWU6ICdtb3ZpZScgfSxcbl07XG5jb25zdCBSRVNVTFRTID0gW1xuICAgIHsgbGFiZWw6ICcxNScsICAgIHZhbHVlOiAnMTUnIH0sXG4gICAgeyBsYWJlbDogJzI1JywgIHZhbHVlOiAnMjUnIH0sXG4gICAgeyBsYWJlbDogJzUwJywgICAgdmFsdWU6ICc1MCcgfSxcbl07XG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICBzdGF0aWNzOiB7XG4gICAgICAgIG5hdmlnYXRpb25CYXI6ICdtYWluJyxcbiAgICAgICAgZ2V0TmF2aWdhdGlvbiAocHJvcHMsYXBwKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnUHJlZmVyZW5jZXMnXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZ2V0SW5pdGlhbFN0YXRlICgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG1lZGlhVHlwZTogdGhpcy5wcm9wcy5wcmVmZXJlbmNlcy5tZWRpYVR5cGUsXG4gICAgICAgICAgICBudW1SZXN1bHRzOiB0aGlzLnByb3BzLnByZWZlcmVuY2VzLm51bVJlc3VsdHNcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBoYW5kbGVSZXN1bHRzQ2hhbmdlIChrZXksIG5ld1ZhbHVlKSB7XG4gICAgICAgIGxldCBuZXdTdGF0ZSA9IHt9O1xuICAgICAgICBuZXdTdGF0ZVtrZXldID0gbmV3VmFsdWU7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUobmV3U3RhdGUpO1xuICAgICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlUHJlZmVyZW5jZShrZXksbmV3VmFsdWUpXG5cbiAgICB9LFxuXG4gICAgaGFuZGxlVHlwZUNoYW5nZSAoa2V5LCBldmVudCkge1xuICAgICAgICB0aGlzLnN0YXRlLm1lZGlhVHlwZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZVByZWZlcmVuY2Uoa2V5LGV2ZW50LnRhcmdldC52YWx1ZSlcbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8Q29udGFpbmVyIHNjcm9sbGFibGU9e3Njcm9sbGFibGV9PlxuICAgICAgICAgICAgICAgIDxVSS5Hcm91cD5cbiAgICAgICAgICAgICAgICAgICAgPFVJLkdyb3VwSGVhZGVyPlByZWZlcmVuY2VzPC9VSS5Hcm91cEhlYWRlcj5cbiAgICAgICAgICAgICAgICAgICAgPFVJLkdyb3VwQm9keT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxVSS5MYWJlbFNlbGVjdCBsYWJlbD1cIk1lZGlhIFR5cGVcIiB2YWx1ZT17dGhpcy5zdGF0ZS5tZWRpYVR5cGV9IG9wdGlvbnM9e01FRElBX1RZUEVTfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZVR5cGVDaGFuZ2UuYmluZCh0aGlzLCdtZWRpYVR5cGUnKX0vPlxuICAgICAgICAgICAgICAgICAgICA8L1VJLkdyb3VwQm9keT5cbiAgICAgICAgICAgICAgICA8L1VJLkdyb3VwPlxuICAgICAgICAgICAgICAgIDxVSS5Hcm91cD5cbiAgICAgICAgICAgICAgICAgICAgPFVJLkdyb3VwSGVhZGVyPiMgUmVzdWx0czwvVUkuR3JvdXBIZWFkZXI+XG4gICAgICAgICAgICAgICAgICAgIDxVSS5Hcm91cEJvZHk+XG4gICAgICAgICAgICAgICAgICAgICAgICA8VUkuUmFkaW9MaXN0IHZhbHVlPXt0aGlzLnN0YXRlLm51bVJlc3VsdHN9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZVJlc3VsdHNDaGFuZ2UuYmluZCh0aGlzLCAnbnVtUmVzdWx0cycpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zPXtSRVNVTFRTfSAvPlxuICAgICAgICAgICAgICAgICAgICA8L1VJLkdyb3VwQm9keT5cbiAgICAgICAgICAgICAgICA8L1VJLkdyb3VwPlxuICAgICAgICAgICAgPC9Db250YWluZXI+XG4gICAgICAgICk7XG4gICAgfVxufSk7XG4iXX0=
