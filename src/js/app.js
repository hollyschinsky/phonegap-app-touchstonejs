import React from 'react/addons';
import {
	Container,
	createApp,
	UI,
	View,
	ViewManager
} from 'touchstonejs';

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

// Main Controller
// ------------------------------

var MainViewController = React.createClass({
	render () {
		return (
			<Container>
				<UI.NavigationBar name="main" />
				<ViewManager name="listvm" defaultView="criteria">
					<View name="criteria" component={require('./views/criteria-form')} />
					<View name="media-list" component={require('./views/media-list')} />
					<View name="media-details" component={require('./views/media-details')} />
				</ViewManager>
			</Container>
		);
	}
});

function startApp () {
	// Setting the status bar style in the config.xml - could also set here but since it's specific to mobile only it will
	// not have to run otherwise. Default causes black font to display, styleLightContent will make the font and battery white font.
	// If you include the status bar plugin, the default is already light content, so you only need to specify the preference
	// specifically in config.xml in the root if you want it to be black and set it to value of default
	//if (window.StatusBar) {
	//	window.StatusBar.styleLightContent();
    //
	//}

	React.render(<App />, document.getElementById('app'));
}

if (!window.cordova) {
	startApp();
} else {
	document.addEventListener('deviceready', startApp, false);
}
