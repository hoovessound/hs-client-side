import React from 'react';
import '../css/TrackPlayer.css';
import {Link} from 'react-router-dom';
export default class TrackContainer extends React.Component {
    render() {
        return (
            <div key={this.props.id} className="TrackContainer">
                <Link to={"/track/" + this.props.id}>
                    <img src={this.props.coverImage}/>
                    <h3>{this.props.author_fullName} - {this.props.title}</h3>
                </Link>
            </div>
        )
    }
}