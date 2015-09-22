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
		onChange: React.PropTypes.func.isRequired // ** HS - Added **
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

	// ** HS - Removed **
	//updateInputValue: function updateInputValue(event) {
	//	this.setState({
	//		value: event.target.value
	//	});
	//},

	//**  HS - Modified the line in render() with the onChange to remove the updateInputValue call and use the this.props.onChange function instead**
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