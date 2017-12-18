import React from 'react';
import axios from 'axios';
import getApiUrl from '../Util/getApiUrl';
let offset = 0;
export default class Doodle extends React.Component {
    constructor() {
        super();
        this.state = {
            doodles: [],
        }
    }

    async fetchDoodles(){
        const apiUrl = getApiUrl('api', `/doodle/collections/${offset}?`);
        const response = await axios.get(apiUrl);
        const doodles = response.data;
        const arrayOfDoodles = []
        doodles.map(doodle => {
            arrayOfDoodles.push(
                <div className="card">
                    <img
                        className="card-img-top"
                        src={doodle.image}
                        alt={`doodle for ${doodle.id}`}
                        style={{
                            width: '60%',
                        }}
                    />
                    <div className="card-block">
                        <h4>
                            By: <a href={doodle.author.link} target="_blank">{doodle.author.name}</a>
                        </h4>
                    </div>
                </div>
            )
        });
        this.setState({
            doodles: arrayOfDoodles,
        })
    }

    render() {
        this.fetchDoodles();
        return (
            <div id={'doodles'}>
                {this.state.doodles}
            </div>
        )
    }
}