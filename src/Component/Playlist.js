import React from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import getApiurl from '../Util/getApiUrl';
import Modal from 'react-responsive-modal';

export default class Playlist extends React.Component {

    constructor() {
        super();
        this.state = {
            modal: {
                open: false,
            },
            playlists: [],
        }
    }

    eachPlaylists(data) {
        return data.map(playlist => {
            let text = 'Add';
            if(playlist.tracks.includes(this.props.track.id)){
                text = 'Added';
            }
            return (
                <div key={playlist.id}>

                    <Link to={`/playlist/${playlist.id}`}>
                        <img
                            src={getApiurl('api', `/image/playlist/${playlist.id}?width=100`, false)}
                            alt={`${playlist.title} cover art`}
                            className="coverArt"
                            style={{
                                width: '5em',
                                height: '5em',
                            }}
                        />
                        <span
                            className="title"
                            style={{
                                paddingLeft: '0.5em'
                            }}
                        >{playlist.title}</span>
                    </Link>

                    <div
                        className="btn btn-info"
                        style={{
                            right: '1em',
                            position: 'absolute',
                            cursor: 'pointer',
                        }}
                        onClick={() => this.addToPlaylist(playlist)}
                    >{text}</div>

                    <hr/>
                </div>
            )
        })
    }

    async addToPlaylist(playlist){
        const url = getApiurl('api', `/playlist/add/${playlist.id}/${this.props.track.id}?`);
        await axios.post(url);
        this.closeModal();
    }

    closeModal(){
        this.setState({
            modal: {
                open: false,
            }
        })
    }

    openModal(){
        this.setState({
            modal: {
                open: true,
            }
        })
    }

    async componentDidMount(){
        const url = getApiurl('api', '/me/playlists?');
        const response = await axios.get(url);
        this.setState({
            playlists: response.data,
        })
    }

    async createNewPlaylist(payload){
        const title = payload.title;
        const id = payload.id;
        const url = getApiurl('api', '/playlist/create?');
        await axios.post(url, {
            title,
            tracks: [
                id,
            ]
        });
        this.closeModal();
    }

    render() {
        return (
            <div
                className="material-icons"
                style={{
                    cursor: 'pointer',
                    marginLeft: '0.5em',
                }}
                onClick={this.openModal.bind(this)}
            >playlist_add

                <Modal open={this.state.modal.open} little onClose={this.closeModal.bind(this)}>
                    <h2>Add to playlist</h2>
                    <p>Adding {this.props.track.title} to one of your playlist</p>
                    <hr/>
                    {
                        this.eachPlaylists(this.state.playlists)
                    }
                    <div className="newPlaylist">
                        <p>Create a new playlist</p>
                        <input type="text" ref={'newPlaylistName'}/>
                        <div
                            className="btn btn-info"
                            style={{
                                right: '1em',
                                position: 'absolute',
                                cursor: 'pointer',
                            }}
                            onClick={() => this.createNewPlaylist({
                                title: this.refs.newPlaylistName.value,
                                id: this.props.track.id,
                            })}
                        >Add</div>
                    </div>
                </Modal>

            </div>
        )
    }
}