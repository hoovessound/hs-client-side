import React from 'react';
import axios from 'axios';
import getApiUrl from '../Util/getApiUrl';
import TrackContainer from "../Component/TrackContainer";
import store from "../Redux/store";

export default class PlaylistPage extends React.Component {
    constructor() {
        super();
        this.state = {
            tracks: [],
            playlist: {},
        }
    }

    async fetchPlaylist(id){
        const url = getApiUrl('api', `/playlist/${id}?`);
        const response = await axios.get(url);
        // Add some tracks to the local playlist
        store.dispatch({
            type: 'ADD_LOCAL_PLAYLIST',
            payload: {
                tracks: response.data.tracks,
            }
        });
        this.eachTrack(response.data);
    }

    componentDidMount(){
        const id = this.props.match.params.id;
        this.fetchPlaylist(id);
    }

    eachTrack(payload){
        const tracks = [];
        payload.tracks.map(track => {
            return tracks.push(
                <TrackContainer key={track.id} title={track.title} coverImage={track.coverImage} trackId={track.id}
                                author_username={track.author.username} author_fullName={track.author.fullname}/>
            )
        });
        this.setState({
            tracks,
        });
    }

    render() {
        return (
            <div id={'playlist'}>
                {this.state.tracks}
            </div>
        )
    }
}