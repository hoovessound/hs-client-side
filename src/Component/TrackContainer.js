import React from 'react';
import '../css/TrackContainer.css';
import {Link} from 'react-router-dom';
let trackTitle;
export default class TrackContainer extends React.Component {
    render() {
        if(!this.props.withouttitle){
            trackTitle = <h3>{this.props.author_fullName} - {this.props.title}</h3>;
        }
        return (
            <div key={this.props.id} className="TrackContainer">
                <Link to={"/track/" + this.props.trackId}>
                    <img src={this.props.coverImage} alt={"This cover image for track " + this.props.trackId}/>
                    {trackTitle}
                </Link>
            </div>
        )
    }
}