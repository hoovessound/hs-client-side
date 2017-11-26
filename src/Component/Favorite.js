import React from 'react';
import '../css/TrackPlayer.css';
import axios from 'axios';
import '../css/Favorite.css';
import getApiurl from '../Util/getApiUrl';

const token = 'e7671b56aca42828b5da68aad722f8c4f441d76dcef9f747d3aebd371dc10c18af6ac5c6297094500fe69578904c95eacca8';
export default class Favorite extends React.Component {

    async favorite() {
        const trackId = this.props.trackId;
        const heart = this.refs.heart;
        const faved = heart.classList.contains('favorite');
        if (faved) {
            heart.classList.remove('favorite')
        } else {
            heart.classList.add('favorite')
        }
        axios.post(getApiurl('api', `/track/favorite/${trackId}?bypass=true&oauth_token=${token}`));
    }

    render() {
        return (
            <div ref="heart" className="fa fa-heart" onClick={this.favorite.bind(this)}></div>
        )
    }
}