import React from 'react';
import axios from 'axios';
import getApiUrl from '../Util/getApiUrl';
import {Link} from 'react-router-dom';

let offset = 0;

export default class PlaylistCollections extends React.Component {
    constructor() {
        super();
        this.state = {
            playlist: [],
        }
    }

    async fetchPlaylist(){
        const url = getApiUrl('api', '/me/playlists?');
        const response = await axios.get(url);
        this.setState({
            playlist: response.data,
        });
    }

    eachPlaylist(playlists){
        return playlists.map(playlist => {
            return (
                <div className="playlistContainer" key={playlist.id}>
                    <Link to={`/playlist/${playlist.id}`}>
                        <img
                            src={getApiUrl('api', `/image/playlist/${playlist.id}?width=300`, false)}
                            alt={`${playlist.title} cover art`}
                            className="coverArt"
                            style={{
                                width: '10em',
                                height: '10em',
                            }}
                        />
                        <span
                            className="title"
                            style={{
                                paddingLeft: '0.5em'
                            }}
                        >{playlist.title}</span>
                    </Link>
                </div>
            )
        });
    }

    componentDidMount(){
        this.fetchPlaylist();
    }

    render() {
        return (
            <div id={'playlist'}>
                {this.eachPlaylist(this.state.playlist)}
            </div>
        )
    }
}