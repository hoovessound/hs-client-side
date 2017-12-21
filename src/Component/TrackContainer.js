import React from 'react';
import '../css/TrackContainer.css';
import {Link} from 'react-router-dom';
import store from '../Redux/store';

let trackTitle;
let body;

export default class TrackContainer extends React.Component {

    playButton() {
        return (
            <div
                ref="playPauseButton"
                className="playPauseButton material-icons"
                onClick={this.playMusic.bind(this)}
                style={{
                    cursor: 'pointer',
                    background: 'skyblue',
                    padding: '0.5em',
                    borderRadius: '50%',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, 50%)',
                    color: '#161616'
                }}
            >play_arrow
            </div>
        )
    }

    playMusic(e) {
        e.preventDefault();
        store.dispatch({
            type: 'UPDATE_TRACK_DETAILS',
            payload: {
                ...this.props,
                playitnow: true,
            }
        });
    }

    render() {

        if (this.props.notitle) {
            trackTitle = "";
        } else {
            trackTitle = <h3>{this.props.author_fullName} - {this.props.title}</h3>;
        }

        const image = () => {
            return (
                <div
                    className={'coverArt'}
                    style={{
                        backgroundImage: `url(${this.props.coverImage})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        width: '30em',
                        height: '30em',
                        position: 'relative',
                    }}
                >
                    {this.playButton()}
                </div>
            )
        }

        if (this.props.nolink) {
            body = () => {
                return (
                    <div key={this.props.trackId}
                        style={{
                            position: 'relative',
                        }}
                    >
                        {image()}
                        {trackTitle}
                    </div>
                )
            }
        } else {
            body = () => {
                return (
                    <div key={this.props.trackId}>
                        <Link to={"/track/" + this.props.trackId}>
                            {image()}
                            {trackTitle}
                        </Link>
                    </div>
                )
            }
        }
        return (
            <div key={this.props.id} className="TrackContainer">
                {body()}
            </div>
        )
    }
}