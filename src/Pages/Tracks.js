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
        }
    }

    async fetchMore(){
        const url = getApiurl('api', `/tracks?offset=${this.state.offset}`);
        const tracks = await axios.get(url);
        const trackEl = this.state.trackEl;
        if(!tracks.data.error){
            tracks.data.map(track => {
                return trackEl.push(
                    <TrackContainer key={track.id} track={track}/>
                );
            });
            console.log(trackEl)
            this.setState({
                trackEl,
                offset: (this.state.offset + tracks.data.length),
            });
        }else{
            trackEl.push(
                <div
                    style={{
                        color: 'red',
                    }}
                >ERROR: Can't not fetch more tracks, please try again later on</div>
            )
        }
    }

    async componentDidMount() {
        const url = getApiurl('api', `/tracks?offset=${this.state.offset}`);
        // const tracks = await axios.get(url);
        // axios.get(getApiurl('api', `/tracks?offset=${this.state.offset}`))
        // .then(response => {
        //     const tracks = response.data;
        //     // Add some tracks to the local playlist
        //     store.dispatch({
        //         type: 'ADD_LOCAL_PLAYLIST',
        //         payload: {
        //             tracks,
        //         }
        //     });
        //
        //     const trackEl = tracks.map(track => {
        //         return (
        //             <TrackContainer key={track.id} track={track}/>
        //         )
        //     });
        //     this.setState({
        //         trackEl,
        //         offset: 10,
        //     });
        // })
        // .catch(error => {
        //     console.log(error);
        // })
    }

    render() {
        return (
            <div>
                {this.state.trackEl}
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