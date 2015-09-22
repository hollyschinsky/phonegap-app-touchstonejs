import Container from 'react-container';
import React from 'react';
import Tappable from 'react-tappable';
import { Link, UI } from 'touchstonejs';

const scrollable = Container.initScrollable();

module.exports = React.createClass({
    statics: {
        navigationBar: 'main',
        getNavigation (props,app) {
            return {
                leftArrow: true,
                leftLabel: 'Back',
                leftAction: () => { app.transitionTo('tabs:' + props.prevView, { transition: 'reveal-from-right'}) },
                title: 'About'
            }
        }
    },

    openURL () {
        var projectUrl = "http://github.com/hollyschinsky/phonegap-app-touchstonejs";
        if (!window.cordova)
            window.open(projectUrl)
        else
            window.open(projectUrl,"_blank");
    },

    render: function () {
        return (
            <Container scrollable={scrollable}>
                <UI.Group>
                    <UI.GroupHeader className="text-primary">App Details</UI.GroupHeader>
                    <UI.ListHeader>iTunes Media Finder</UI.ListHeader>
                    <UI.LabelInput readOnly label="Version" value="0.1.0"/>
                    <UI.LabelInput readOnly label="Date" value="September 2015"/>
                </UI.Group>

                <UI.Group>
                    <UI.GroupHeader className="text-primary">Author</UI.GroupHeader>
                    <UI.GroupBody>
                        <UI.Item>
                            <UI.ItemInner>
                                <UI.ItemContent>
                                    <UI.ItemTitle>Holly Schinsky</UI.ItemTitle>
                                </UI.ItemContent>
                                <Tappable onTap={this.openURL.bind(null)} stopPropagation>
                                    <UI.ItemNote icon='ion-ios-star' type="primary" className="ion-lg" />
                                </Tappable>
                            </UI.ItemInner>
                        </UI.Item>
                        <UI.Item>
                            <UI.ItemInner>
                                <UI.ItemContent>
                                    <UI.ItemTitle>PhoneGap Team</UI.ItemTitle>
                                    <UI.ItemSubTitle>Adobe Systems, Inc</UI.ItemSubTitle>
                                </UI.ItemContent>
                            </UI.ItemInner>
                        </UI.Item>
                    </UI.GroupBody>
                </UI.Group>
                <UI.Group>
                    <UI.GroupHeader className="text-primary">Powered By</UI.GroupHeader>
                    <UI.Item>
                        <UI.ItemInner>
                            <UI.ItemContent>
                                <img src="img/react-logo.png" className="avatar"/>
                                <img src="img/ts-logo.png" className="avatar"/>
                                <img src="img/pg-logo.png" className="avatar"/>
                            </UI.ItemContent>
                            </UI.ItemInner>

                        </UI.Item>
                </UI.Group>

            </Container>


        );
    }
});
