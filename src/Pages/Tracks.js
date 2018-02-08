import React from 'react';
import axios from 'axios';
import TrackContainer from '../Component/TrackContainer';
import getApiurl from '../Util/getApiUrl';
import store from '../Redux/store';

export default class Tracks extends React.Component {
    constructor() {
        super();
        this.state = {
            trackEl: [],
            offset: 0,
            tracks: [],
        }
    }

    async fetchMore(){
        const url = getApiurl('api', `/tracks?offset=${this.state.offset}`);
        const tracks = await axios.get(url);
        const stateTracks = this.state.tracks;
        if(!tracks.data.error && tracks.data.length >= 1){
            tracks.data.map(track => {
                return stateTracks.push(track);
            });
            this.setState({
                tracks: stateTracks,
                offset: (this.state.offset + tracks.data.length),
            });
        }
    }

    async componentDidMount() {
        const url = getApiurl('api', `/tracks?offset=${this.state.offset}`);
        const tracks = await axios.get(url);
        store.dispatch({
            type: 'ADD_LOCAL_PLAYLIST',
            payload: {
                tracks: tracks.data,
            }
        });
        this.setState({
            tracks: tracks.data,
            offset: 10,
        });
    }

    eachTrack(tracks){
        const render = [];
        tracks.map(track => {
            return render.push(
                <TrackContainer key={track.id} track={track}/>
            )
        });
        return (
            <div>{render}</div>
        )
    }

    render() {
        return (
            <div>
                {this.eachTrack(this.state.tracks)}
                <div className="btn btn-info"
                    style={{
                        cursor: 'pointer',
                    }}
                     onClick={this.fetchMore.bind(this)}
                >More</div>
            </div>
        )
    }
}