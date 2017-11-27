import React from 'react';
import axios from 'axios';
import TrackContainer from '../Component/TrackContainer';
import getApiurl from '../Util/getApiUrl';
import store from '../Redux/store';

export default class Tracks extends React.Component {
    constructor() {
        super()
        this.state = {
            trackEl: []
        }
    }

    componentDidMount() {
        axios.get(getApiurl('api', `/tracks?offset=0`))
        .then(response => {
            const tracks = response.data;

            const trackEl = tracks.map(track => {
                return (
                    <TrackContainer key={track.id} title={track.title} coverImage={track.coverImage} trackId={track.id}
                                    author_username={track.author.username} author_fullName={track.author.fullName}/>
                )
            })
            this.setState({
                trackEl,
            }, function () {
                store.dispatch({
                    type: 'UPDATE_TRACK_DETAILS',
                    payload: {
                        ...this.state.trackEl[0].props,
                        playitnow: false,
                    },
                });
            })
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