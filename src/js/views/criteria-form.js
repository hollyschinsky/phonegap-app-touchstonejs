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
	{ label: '25',    value: '25' },
	{ label: '50',  value: '50' },
	{ label: '100',    value: '100' },
];

module.exports = React.createClass({
	contextTypes: { mediaStore: React.PropTypes.object.isRequired, app: React.PropTypes.object },
	statics: {
		navigationBar: 'main',
		getNavigation () {
			return {
				title: 'Search Criteria'
			}
		}
	},


	getInitialState () {
		return {
			mediaType: 'musicVideo',
			numResults: '50',
			searchTerm: 'Katy Perry'
		}
	},
	
	handleResultsChange (key, newValue) {
		let newState = {};
		newState[key] = newValue;
		this.setState(newState);
	},
	
	handleTypeChange (key, event) {
		this.state.mediaType = event.target.value;
	},

	handleSearchTermChange (key, event) {
		let newState = {};
		newState[key] = event.target.value;
		this.setState(newState);
	},

	showResults(event) {
		this.context.app.viewManagers.listvm.transitionTo('media-list',
			{transition: 'show-from-right',viewProps:{prevView: 'criteria',mediaType: this.state.mediaType, searchTerm: this.state.searchTerm, numResults: this.state.numResults}})
	},

	render () {
		return (
			<Container scrollable={scrollable}>
				<UI.Group>
					<UI.GroupHeader>Search Criteria</UI.GroupHeader>
					<UI.GroupBody>
						<UI.LabelSelect id="sel1" label="Type" onChange={this.handleTypeChange.bind(this,'mediaType')} value={this.props.mediaType} options={MEDIA_TYPES} />
						<UI.LabelInput label="Search term"  value={this.state.searchTerm} placeholder="search term" onChange={this.handleSearchTermChange.bind(this, 'searchTerm')}  />
					</UI.GroupBody>
				</UI.Group>
				<UI.Group>
					<UI.GroupHeader># Results</UI.GroupHeader>
					<UI.GroupBody>
						<UI.RadioList value={this.state.numResults} onChange={this.handleResultsChange.bind(this, 'numResults')} options={RESULTS}/>
					</UI.GroupBody>
				</UI.Group>
				<UI.Button onTap={this.showResults.bind(this)} type="primary"> Show Results</UI.Button>
			</Container>
		);
	}
});
