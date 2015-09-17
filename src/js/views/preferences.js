
import Container from 'react-container';
import React from 'react';
import { Link, UI } from 'touchstonejs';

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
    statics: {
        navigationBar: 'main',
        getNavigation (props,app) {
            return {
                title: 'Preferences'
            }
        }
    },

    getInitialState () {
        return {
            mediaType: this.props.preferences.mediaType,
            numResults: this.props.preferences.numResults
        }
    },

    handleResultsChange (key, newValue) {
        let newState = {};
        newState[key] = newValue;
        this.setState(newState);
        this.props.onChangePreference(key,newValue)

    },

    handleTypeChange (key, event) {
        this.state.mediaType = event.target.value;
        this.props.onChangePreference(key,event.target.value)
    },

    render: function () {
        return (
            <Container scrollable={scrollable}>
                <UI.Group>
                    <UI.GroupHeader>Preferences</UI.GroupHeader>
                    <UI.GroupBody>
                        <UI.LabelSelect label="Media Type" value={this.state.mediaType} options={MEDIA_TYPES}
                                        onChange={this.handleTypeChange.bind(this,'mediaType')}/>
                    </UI.GroupBody>
                </UI.Group>
                <UI.Group>
                    <UI.GroupHeader># Results</UI.GroupHeader>
                    <UI.GroupBody>
                        <UI.RadioList value={this.state.numResults} onChange={this.handleResultsChange.bind(this, 'numResults')}
                                      options={RESULTS} />
                    </UI.GroupBody>
                </UI.Group>
            </Container>
        );
    }
});
