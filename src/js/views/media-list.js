import Container from 'react-container';
import React from 'react';
import Sentry from 'react-sentry';
import Tappable from 'react-tappable';
import Timers from 'react-timers';
import { Link, UI } from 'touchstonejs';

var scrollable = Container.initScrollable({ left: 0, top: 44 });

var SimpleLinkItem = React.createClass({
	propTypes: {
		item: React.PropTypes.object.isRequired
	},

	render () {
		let item = this.props.item;
		let className = "video__avatar_sm";

		if (item.kind.indexOf('song')>-1)
			className = "song__avatar_sm";
		else if (item.kind.indexOf('movie')>-1)
			className = "movie__avatar_sm";

			return (
			<Link to="listvm:media-details" transition="show-from-right" viewProps={{ item: this.props.item, prevView: 'media-list'}} >
				<UI.Item showDisclosureArrow>
					<img src={item.artworkUrl60} className={className}/>
					<UI.ItemInner>
						<UI.ItemContent>
							<UI.ItemTitle>{item.trackName}</UI.ItemTitle>
							<UI.ItemSubTitle>{item.artistName}</UI.ItemSubTitle>
						</UI.ItemContent>
					</UI.ItemInner>
				</UI.Item>
			</Link>
		);
	}
});

module.exports = React.createClass({
	mixins:  [Sentry(), Timers()],
	contextTypes: { mediaStore: React.PropTypes.object.isRequired, app: React.PropTypes.object },
	statics: {
		navigationBar: 'main',
		getNavigation (props, app) {
			return {
				leftArrow: true,
				leftLabel: 'Criteria',
				leftAction: () => { app.transitionTo('listvm:criteria', { transition: 'reveal-from-right' }) },
				title: 'Media Results'
			}
		}
	},

	componentDidMount () {
		if (this.props.prevView=='criteria') {
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

			this.jsonp("https://itunes.apple.com/search?term=" + this.props.searchTerm + "&entity=" + this.props.mediaType + "&limit=" + this.props.numResults, function(data) {
				self.setState({
					popup: {
						visible: false
					}
				});
				if (data!=null) {
					self.context.mediaStore.items = data.results; // hold it in the context object for when we come back
					var items = self.context.mediaStore.formatDate();
					self.setState({media: items});

				}
				else self.showAlert('danger',"An error occurred retrieving data from iTunes. Do you have an Internet connection? A valid URL?");

			});
		}
		// Coming back from details page - use the already stored results in the media store
		else this.setState({media:this.context.mediaStore.items})
	},

	jsonp (url, callback) {
		var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
		window[callbackName] = function(data) {
			delete window[callbackName];
			document.body.removeChild(script);
			callback(data);
		};

		var script = document.createElement('script');
		script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
		self = this;
		script.onerror = function(err) {
			callback(null)
		};

		document.body.appendChild(script);
	},

	showAlert (type, text) {
		this.setState({
			alertbar: {
				visible: true,
				type: type,
				text: text
			}
		});
		this.setTimeout(() => {
			this.setState({
				alertbar: {
					visible: false
				}
			});
		}, 3000);
	},

	getInitialState () {
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
		}
	},

	clearFilter () {
		this.setState({ filterString: '' });
	},

	updateFilter (str) {
		this.setState({ filterString: str });
	},

	submitFilter (str) {
		console.log(str);
	},

	render () {
		let { media, filterString, alertbar} = this.state
		let filterRegex = new RegExp(filterString.toLowerCase())

		function mediaFilter (item) {
			return filterRegex.test(item.trackName.toLowerCase())
		};
		function sortByName (a, b) {
			return a.trackName.localeCompare(b.trackName)
		};

		let filteredMedia = media.filter(mediaFilter).sort(sortByName);

		let results

		if (filterString && !filteredMedia.length) {
			results = (
				<Container direction="column" align="center" justify="center" className="no-results">
					<div className="no-results__icon ion-ios-filter-strong" />
					<div className="no-results__text">{'No results for "' + filterString + '"'}</div>
				</Container>
			);
		} else {
			results = (
				<UI.GroupBody>
					{filteredMedia.map((item, i) => {
						return <SimpleLinkItem key={'item' + i} item={item}/>
					})}
				</UI.GroupBody>
			);
		}

		return (
			<Container ref="scrollContainer" scrollable={scrollable}>
				<UI.Alertbar type={alertbar.type || 'default'} visible={alertbar.visible} animated>{alertbar.text}</UI.Alertbar>
				<UI.SearchField type="dark" value={this.state.filterString} onSubmit={this.submitFilter} onChange={this.updateFilter}
				onCancel={this.clearFilter} onClear={this.clearFilter} placeholder="Filter..." />
				{results}
				<UI.Popup visible={this.state.popup.visible}>
					<UI.PopupIcon name={this.state.popup.iconName} type={this.state.popup.iconType} spinning={this.state.popup.loading} />
					<div><strong>{this.state.popup.header}</strong></div>
				</UI.Popup>
			</Container>
		);
	}
});
