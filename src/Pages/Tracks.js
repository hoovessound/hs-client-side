import React from 'react';
import axios from 'axios';
import TrackContainer from '../Component/TrackContainer';
import getApiurl from '../Util/getApiUrl';
import store from '../Redux/store';

export default class Tracks extends React.Component {
    constructor() {
        super();
        this.state = {
            trackEl: []
        }
    }

    componentDidMount() {
        axios.get(getApiurl('api', `/tracks?offset=0`))
        .then(response => {
            const tracks = response.data;

            // Add some tracks to the local playlist
            store.dispatch({
                type: 'ADD_LOCAL_PLAYLIST',
                payload: {
                    tracks,
                }
            });

            const trackEl = tracks.map(track => {
                return (
                    <TrackContainer key={track.id} track={track}/>
                )
            });
            this.setState({
                trackEl,
            });
        })
        .catch(error => {
            console.log(error);
        })
    }

    render() {
        return (
            <div>
                {this.state.trackEl}
            </div>
        )
    }
}