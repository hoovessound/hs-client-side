import React from 'react';
import axios from 'axios';
const token = 'e7671b56aca42828b5da68aad722f8c4f441d76dcef9f747d3aebd371dc10c18af6ac5c6297094500fe69578904c95eacca8';
export default class Tracks extends React.Component {
    constructor(){
        super()
        this.state = {
            trackEl: []
        }
    }

    componentDidMount() {
        axios.get(`https://api.hoovessound.ml/tracks?offset=0&bypass=true&oauth_token=${token}`)
        .then(response => {
            const tracks = response.data.tracks;
            const trackEl = tracks.map(track => {
                return (
                    <div key={track.id}>
                        <h3>{track.title}</h3>
                    </div>
                )
            })
            this.setState({
                trackEl,
            })
        })
        .catch(error => {
            console.log(error);
        })
    }

    render() {
        return (
            <div>
                {this.state.trackEl}
            </div>
        )
    }
}