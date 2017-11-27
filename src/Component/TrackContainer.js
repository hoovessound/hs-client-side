import React from 'react';
import '../css/TrackContainer.css';
import {Link} from 'react-router-dom';
import getApiUrl from '../Util/getApiUrl';
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
                    "cursor": "pointer"
                }}
            >play_arrow
            </div>
        )
    }

    playMusic() {
        const trackId = this.props.trackId;
        const src = getApiUrl('stream', `/${trackId}`);

        store.dispatch({
            type: 'UPDATE_TRACK_DETAILS',
            payload: {
                ...this.props,
            }
        });
    }

    render() {

        if (this.props.notitle) {
            trackTitle = "";
        } else {
            trackTitle = <h3>{this.props.author_fullName} - {this.props.title}</h3>;
        }

        if (this.props.nolink) {
            body =
                <div key={this.props.trackId}>
                    {this.playButton()}
                    <img ref="coverImage" src={this.props.coverImage}
                         alt={"This cover image for track " + this.props.trackId}/>
                    {trackTitle}
                </div>
        } else {
            body =
                <div key={this.props.trackId}>
                    {this.playButton()}
                    <Link to={"/track/" + this.props.trackId}>
                        <img ref="coverImage" src={this.props.coverImage}
                             alt={"This cover image for track " + this.props.trackId}/>
                        {trackTitle}
                    </Link>
                </div>
        }
        return (
            <div key={this.props.id} className="TrackContainer">
                {body}
            </div>
        )
    }
}