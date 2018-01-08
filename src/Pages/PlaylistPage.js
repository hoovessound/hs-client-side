import React from 'react';
import axios from 'axios';
import getApiUrl from '../Util/getApiUrl';
import {Link} from 'react-router-dom';
import TrackContainer from "../Component/TrackContainer";

let offset = 0;

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
        this.eachTrack(response.data);
    }

    componentDidMount(){
        const id = this.props.match.params.id;
        this.fetchPlaylist(id);
    }

    eachTrack(payload){
        const stateTracks = this.state.tracks;
        payload.tracks.map(track => {
            stateTracks.push(
                <TrackContainer key={track.id} title={track.title} coverImage={track.coverImage} trackId={track.id}
                                author_username={track.author.username} author_fullName={track.author.fullName}/>
            )
        });
        this.setState({
            tracks: stateTracks,
            playlist: payload,
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