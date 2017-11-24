import React from 'react';
import '../css/TrackContainer.css';
import {Link} from 'react-router-dom';
import getApiUrl from '../Util/getApiUrl';
let trackTitle;
const audio = new Audio();
let playing = false;

export default class TrackContainer extends React.Component {

    playMusic() {
        const trackId = this.props.trackId;
        const src = getApiUrl('stream', `/${trackId}`);
        if(audio.src !== src){
            audio.src = src;
        }
        if(playing) {
            playing = false;
            audio.pause();
            this.refs.playPauseButton.textContent = 'play_arrow';
        }else{
            playing = true;
            audio.play();
            this.refs.playPauseButton.textContent = 'pause';
        }
    }

    render() {
        if (!this.props.withouttitle) {
            trackTitle = <h3>{this.props.author_fullName} - {this.props.title}</h3>;
        }
        return (
            <div key={this.props.id} className="TrackContainer">
                <Link to={"/track/" + this.props.trackId}>
                    <div ref="playPauseButton" className="playPauseButton material-icons" onClick={() => {
                        this.playMusic()
                    }}>play_arrow
                    </div>
                    <img ref="coverImage" src={this.props.coverImage} alt={"This cover image for track " + this.props.trackId}/>
                    {trackTitle}
                </Link>
            </div>
        )
    }
}