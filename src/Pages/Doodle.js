import React from 'react';
import axios from 'axios';
import getApiUrl from '../Util/getApiUrl';
import {Link} from 'react-router-dom';
import * as checkLogin from '../Util/checkLogin';

let offset = 0;

export default class Doodle extends React.Component {
    constructor() {
        super();
        this.state = {
            doodles: {},
        }
    }

    async fetchDoodles() {
        const apiUrl = getApiUrl('api', `/doodle/collections/${offset}?`);
        const response = await axios.get(apiUrl);
        let doodles = this.state.doodles;
        response.data.map(doodle => {
            return doodles[doodle.id] = doodle;
        });
        this.setState({
            doodles,
        });
        offset += 5;
    }

    componentDidMount() {
        this.fetchDoodles();
    }

    eachArtWork(doodles) {
        const render = [];
        for (let key in doodles) {
            const doodle = doodles[key];
            render.push(
                <div className="card" key={doodle.id}>
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
                            By: <a href={doodle.link} target="_blank">{doodle.author.fullname}</a>
                        </h4>
                    </div>
                </div>
            )
        }
        return (
            <div>
                {render}
            </div>
        )
    }

    render() {
        return (
            <div id={'doodles'}>
                {
                    (() => {
                        if(checkLogin.isLogin()){
                            return (
                                <Link to={'/doodle/submit'}>
                                    <div
                                        className="btn btn-success"
                                        style={{
                                            margin: '0.5em',
                                        }}
                                    >Submit
                                    </div>
                                </Link>
                            )
                        }else{
                            return (
                                <span> </span>
                            )
                        }
                    })()
                }
                {this.eachArtWork(this.state.doodles)}
                <div
                    className="btn btn-info"
                    style={{
                        margin: '0.5em',
                        cursor: 'pointer',
                    }}
                    onClick={this.fetchDoodles.bind(this)}
                >More
                </div>
            </div>
        )
    }
}