import React from 'react/addons';
import {
	Container,
	createApp,
	UI,
	View,
	ViewManager
} from 'touchstonejs';
// ------------------------------
// App Config
// ------------------------------

const MediaStore = require('./stores/media')
const mediaStore = new MediaStore()


var App = React.createClass({
	mixins: [createApp()],

	childContextTypes: {
		mediaStore: React.PropTypes.object
	},

	getChildContext () {
		return {
			mediaStore: mediaStore
		};
	},

	render () {
		let appWrapperClassName = 'app-wrapper device--' + (window.device || {}).platform

		return (
			<div className={appWrapperClassName}>
				<div className="device-silhouette">
					<ViewManager name="app" defaultView="main">
						<View name="main" component={MainViewController} />
					</ViewManager>
				</div>
			</div>
		);
	}
});
// ------------------------------
// Main Controller
// ------------------------------
var MainViewController = React.createClass({
	render () {
		return (
			<Container>
				<UI.NavigationBar name="main" />
				<ViewManager name="main" defaultView="tabs">
					<View name="tabs" component={TabViewController} />
				</ViewManager>
			</Container>
		);
	}
});
// ------------------------------
// Tab View Controller
// ------------------------------

var lastSelectedTab = 'criteria'
var TabViewController = React.createClass({
	onViewChange (nextView) {
		lastSelectedTab = nextView

		this.setState({
			selectedTab: nextView
		});
	},

	selectTab (value) {
		let viewProps;

		this.refs.listvm.transitionTo(value, {
			transition: 'instant',
			viewProps: viewProps
		});

		this.setState({
			selectedTab: value
		})
	},
	getInitialState() {
		return {
			selectedTab: lastSelectedTab,
			preferences: {
				mediaType: 'song',
				numResults: '15'
			}
		};
	},
	changePreference(key,val) {
		this.setState(state => {
			state.preferences[key]=val;
			return state;
		});
	},
	render () {
		let selectedTab = this.state.selectedTab
		let selectedTabSpan = selectedTab

		// Subviews in the stack need to show the right tab selected
		if (selectedTab === 'criteria' || selectedTab === 'media-list' || selectedTab === 'media-details' || selectedTab === 'about') {
			selectedTabSpan = 'criteria';
		}

		else selectedTabSpan = 'settings';

		return (
			<Container>
				<ViewManager ref="listvm" name="tabs" defaultView={selectedTab} onViewChange={this.onViewChange}>
					<View name="about" component={require('./views/about')} />
					<View name="criteria" component={require('./views/criteria-form')} preferences={this.state.preferences}/>
					<View name="media-list" component={require('./views/media-list')} />
					<View name="media-details" component={require('./views/media-details')} />
					<View name="settings" component={require('./views/preferences')} preferences={this.state.preferences}
						onChangePreference={(key,val) => this.changePreference(key,val)}/>
				</ViewManager>

				<UI.Tabs.Navigator>
					<UI.Tabs.Tab onTap={this.selectTab.bind(this, 'criteria')} selected={selectedTabSpan === 'criteria'}>
						<span className="Tabs-Icon Tabs-Icon--form" />
						<UI.Tabs.Label>Search Media</UI.Tabs.Label>
					</UI.Tabs.Tab>

					<UI.Tabs.Tab onTap={this.selectTab.bind(this, 'settings')} selected={selectedTabSpan === 'settings'}>
						<span className="Tabs-Icon Tabs-Icon--settings" />
						<UI.Tabs.Label>Preferences</UI.Tabs.Label>
					</UI.Tabs.Tab>
				</UI.Tabs.Navigator>
			</Container>
		);
	}
});

function startApp () {
	// Handle any Cordova needs here now that deviceReady has fired...

	// If the splash screen plugin is loaded and config.xml prefs have AutoHideSplashScreen set to false for iOS we need to
	// programatically hide it here. You could also include in a timeout if needed to load more resources or see a white screen
	// display in between splash screen and app load. Remove or change as needed. Timeout not needed in this case but left for
	// reference.

	if (navigator.splashscreen) {
		//setTimeout(function () {
			navigator.splashscreen.hide();
		//}, 1000);
	}

	React.render(<App />, document.getElementById('app'));
}

if (!window.cordova) {
	startApp();
} else {
	document.addEventListener('deviceready', startApp, false);
}
