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
				rightAction: () => { app.transitionTo('tabs:about', { transition: 'fade-expand' }) },
				rightIcon: 'ion-information-circled'
			}
		}
	},

	getInitialState () {
		return {
			mediaType: this.props.preferences.mediaType,
			numResults: this.props.preferences.numResults,
			searchTerm: 'Ed Sheeran'
		}
	},

	handleResultsChange (key, newValue) {
		let newState = {};
		newState[key] = newValue;
		this.setState(newState);
	},
	
	handleTypeChange (key, event) {
		this.state.mediaType = event.target.value;
		event.stopPropagation(); // won't stay selected if I don't stop it from propagated - may be bug in LabelSelect
	},

	handleSearchTermChange (key, event) {
		let newState = {};
		newState[key] = event.target.value;
		this.setState(newState);
	},

	showResults(event) {
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
						<UI.LabelInput label="Search term"  value={this.state.searchTerm} placeholder="search term" onChange={this.handleSearchTermChange.bind(this, 'searchTerm')}  />
					</UI.GroupBody>
				</UI.Group>
				<UI.Group>
					<UI.GroupHeader># Results</UI.GroupHeader>
					<UI.GroupBody>
						<UI.RadioList value={this.state.numResults} onChange={this.handleResultsChange.bind(this, 'numResults')} options={RESULTS}/>
					</UI.GroupBody>
				</UI.Group>
				<UI.Button onTap={this.showResults.bind(this)} type="primary">Show Results</UI.Button>
			</Container>
		);
	}
});
