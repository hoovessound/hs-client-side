import React from 'react';
import '../css/TrackPlayer.css';
import axios from 'axios';
import '../css/Favorite.css';
import getApiurl from '../Util/getApiUrl';

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
        axios.post(getApiurl('api', `/track/favorite/${trackId}?`));
    }

    async componentDidMount(){
        const trackId = this.props.trackId;
        const heart = this.refs.heart;
        // Check if the user already favorite this track or not
        const response = await axios.get(getApiurl('api', `/me?`));
        if(response.data.fave.includes(trackId)) {
            heart.classList.add('favorite');
        }else{
            heart.classList.remove('favorite');
        }
    }

    render() {
        return (
            <div ref="heart" className="fa fa-heart" onClick={this.favorite.bind(this)}></div>
        )
    }
}