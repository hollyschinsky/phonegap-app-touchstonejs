/**
 * Created by hschinsk on 8/25/15.
 */
import Container from 'react-container';
import React from 'react';
import { Link, UI } from 'touchstonejs';

module.exports = React.createClass({
    statics: {
        navigationBar: 'main',
        getNavigation (props, app) {
            var leftLabel = 'List';
            return {
                leftArrow: true,
                leftLabel: leftLabel,
                leftAction: () => { app.transitionTo('listvm:' + props.prevView, { transition: 'reveal-from-right' }) },
                title: 'Details'
            }
        }
    },

    getDefaultProps () {
        return {
            prevView: 'media-details'
        }
    },

    preview () {
        var mediaUrl = this.props.item.trackViewUrl;
        if (!window.cordova)
            window.open(mediaUrl)
        else
            cordova.InAppBrowser.open(mediaUrl,"_blank");
    },

    render () {
        var { item } = this.props;

        var videoVal = 'block';
        var audioVal = 'none';
        var className = "video__avatar";

        if (item.kind.indexOf('song')>-1) {
            videoVal = 'none';
            audioVal = 'block';
            className = "song__avatar";
        }
        else if (item.kind.indexOf('movie')>-1) {
            videoVal = 'none';
            audioVal = 'none';
            className = "movie__avatar";
        }


        return (
            <Container scrollable ref="scrollContainer">
                <UI.Group>
                    <UI.GroupHeader className="text-primary">{item.kind}</UI.GroupHeader>
                    <UI.GroupBody>
                        <img src={item.artworkUrl100} className={className}/>
                        <UI.LabelInput readOnly label="Item Name" value={item.trackName}/>
                        <UI.LabelInput readOnly label="Artist" value={item.artistName}/>
                        <UI.LabelInput readOnly label="Genre" value={item.primaryGenreName}/>
                        <UI.LabelInput readOnly label="Collection Name" value={item.collectionName}/>
                        <UI.LabelInput readOnly label="Item Price" value={item.trackPrice}/>
                        <UI.LabelInput readOnly label="Release Date" value={item.releaseDate}/>
                        <UI.Item>
                            <UI.ItemInner>
                                <UI.FieldLabel>Explicit?</UI.FieldLabel>
                                <UI.Switch on={item.collectionExplicitness=='explicit'}/>
                            </UI.ItemInner>
                        </UI.Item>
                        <UI.Item style={{display:audioVal}}>
                            <UI.ItemInner>
                                <audio controls="true" preload="auto" src={item.previewUrl}> </audio>
                            </UI.ItemInner>
                        </UI.Item>
                        <UI.Item style={{display:videoVal}}> 
                            <video controls width="350" height="100" src={item.previewUrl} type="video/mp4"> 
                            </video>
                         </UI.Item>
                        <UI.Item>
                            <UI.ItemInner>
                                <UI.Button onTap={this.preview.bind(this)}>
                                    <UI.ItemNote label="Show in iTunes" icon="ion-share" type="primary">  </UI.ItemNote>
                                </UI.Button>
                            </UI.ItemInner>
                        </UI.Item>
                    </UI.GroupBody>

                    <UI.GroupFooter>
                        Data based on the latest results from <a href="http://itunes.com">iTunes</a>
                    </UI.GroupFooter>
                </UI.Group>
            </Container>
        )
    }
});
