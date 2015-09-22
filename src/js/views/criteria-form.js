import Container from 'react-container';
import dialogs from 'cordova-dialogs';
import React from 'react';
import Tappable from 'react-tappable';
import {Link, UI } from 'touchstonejs';

const scrollable = Container.initScrollable();

const MEDIA_TYPES = [
	{ label: 'Music Video',    value: 'musicVideo' },
	{ label: 'Song',  value: 'song' },
	{ label: 'Movie',    value: 'movie' },
];
const RESULTS = [
	{ label: '15',    value: '15' },
	{ label: '25',  value: '25' },
	{ label: '50',    value: '50' },
];

module.exports = React.createClass({
	contextTypes: { mediaStore: React.PropTypes.object.isRequired, app: React.PropTypes.object },
	statics: {
		navigationBar: 'main',
		getNavigation (props,app) {
			return {
				title: 'Search Criteria',
				leftArrow: false,
				rightAction: () => { app.transitionTo('tabs:about', { transition: 'fade-expand', viewProps: {prevView:'criteria'}}) },
				rightIcon: 'ion-information-circled'
			}
		}
	},

	getInitialState () {
		return {
			mediaType: this.props.preferences.mediaType,
			numResults: this.props.preferences.numResults,
			searchTerm: 'Pink'
		}
	},

	handleResultsChange (key, newValue) {
		let newState = {};
		newState[key] = newValue;
		this.setState(newState);
	},
	
	handleTypeChange (key, event) {
		this.state.mediaType = event.target.value;
		// The select field won't show the updated value on the web if i don't do preventBubble() and it won't show the updated value on device
		// if don't do stopPropagation. Need to figure out why but this fixes it for both.
		event.preventBubble();
		event.stopPropagation();
	},

	handleSearchTermChange (key, event) {
		let newState = {};
		newState[key] = event.target.value;
		this.setState(newState);
	},


	showResults() {
		this.context.app.transitionTo('tabs:media-list',
			{transition: 'show-from-right',viewProps:{prevView: 'criteria', mediaType: this.state.mediaType, searchTerm: this.state.searchTerm,
				numResults: this.state.numResults}})
	},

	render () {
		return (
			<Container scrollable={scrollable}>
				<UI.Group>
					<UI.GroupHeader>Search Criteria</UI.GroupHeader>
					<UI.GroupBody>
						<UI.LabelSelect label="Type" onChange={this.handleTypeChange.bind(this,'mediaType')} value={this.state.mediaType} options={MEDIA_TYPES} />
						<UI.LabelInput label="Search for"  value={this.state.searchTerm} placeholder="search term" onChange={this.handleSearchTermChange.bind(this, 'searchTerm')}  />
					</UI.GroupBody>
				</UI.Group>
				<UI.Group>
					<UI.GroupHeader># Results</UI.GroupHeader>
					<UI.GroupBody>
						<UI.RadioList value={this.state.numResults} onChange={this.handleResultsChange.bind(this, 'numResults')} options={RESULTS}/>
					</UI.GroupBody>
				</UI.Group>
				<UI.Button onTap={this.showResults} type="primary">Show Results</UI.Button>
			</Container>
		);
	}
});
