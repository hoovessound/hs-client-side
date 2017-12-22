import React from 'react';
import axios from 'axios';
import getApiUrl from '../Util/getApiUrl';
import {Redirect} from 'react-router-dom';

export default class Status extends React.Component {

    constructor() {
        super();
        this.state = {
            buildInfo: {
                lastCommit: 'fetching...', // last commit hash
                commit: {
                    message: 'fetching...', // commit message
                    url: 'fetching...', // commit url
                    author: {
                        name: 'fetching...', // commit author
                        link: 'fetching...', // author GitHub link
                    },
                },
            },
            activeDevelopmentBranch: 'redux',
        }
    }

    async componentDidMount() {
        const apiUrl = `https://api.github.com/repos/hoovessound/hs-client-side/commits?sha=${this.state.activeDevelopmentBranch}`;
        const response = await axios.get(apiUrl);
        const data = response.data;
        const buildInfo = {
            lastCommit: data[0].sha,
            commit: {
                message: data[0].commit.message,
                url: `https://github.com/hoovessound/hs-client-side/commit/${data[0].sha}`,
                author: {
                    name: `@${data[0].author.login}`,
                    link: data[0].author.html_url,
                },
            }
        }
        this.setState({
            buildInfo,
        })
    }

    render() {
        return (
            <div>
                <h2>HoovesSound Status</h2>
                <div
                    id="buildinfo"
                    style={{
                        fontSize: '0.6em',
                    }}
                >

                    <div>
                        <p>
                            Stage:
                        </p>
                        <span
                            style={{
                                color: '#FFF',
                                background: 'lightgreen',
                                padding: '0.2em',
                            }}
                        >Active Development(Open Beta)</span>
                    </div>


                    <div>

                        <p>Build info:</p>
                        <p>Active Development Branch:</p>
                        <span
                            style={{
                                color: '#FFF',
                                background: 'lightgreen',
                                padding: '0.2em',
                            }}
                        >{this.state.activeDevelopmentBranch}</span>

                        <p>Last Commit:</p>
                        <a href={this.state.buildInfo.commit.url} target="_blank">
                                <span
                                    style={{
                                        color: '#FFF',
                                        background: 'lightgreen',
                                        padding: '0.2em',
                                    }}
                                >{this.state.buildInfo.lastCommit}</span>
                        </a>

                        <p>Commit Message:</p>
                        <a href={this.state.buildInfo.commit.url} target="_blank">
                                <span
                                    style={{
                                        color: '#FFF',
                                        background: 'lightgreen',
                                        padding: '0.2em',
                                    }}
                                >{this.state.buildInfo.commit.message}</span>
                        </a>

                        <p>Commit Author:</p>
                        <a href={this.state.buildInfo.commit.author.link} target="_blank">
                                <span
                                    style={{
                                        color: '#FFF',
                                        background: 'lightgreen',
                                        padding: '0.2em',
                                    }}
                                >{this.state.buildInfo.commit.author.name}</span>
                        </a>
                    </div>

                    <hr/>

                    <div id="server">
                        <h2>Server Status</h2>
                        <h4>HoovesSound is hosted on DigitalOcean</h4>
                        <h4>
                            <a href="https://status.digitalocean.com/" target="_blank">DigitalOcean Status Page</a>
                        </h4>
                    </div>

                    <hr/>

                    <div id="storage">
                        <h2>Google Cloud Storage</h2>
                        <h4>HoovesSound is using GCS to storage any kind of static files</h4>
                        <h4>
                            <a href="https://status.cloud.google.com/" target="_blank">Google Cloud Platform Status Page</a>
                        </h4>
                    </div>


                    <hr/>

                    <div id="database">
                        <h2>mLab</h2>
                        <h4>HoovesSound is using mLab as database provider</h4>
                        <h4>
                            <a href="https://status.mlab.com/" target="_blank">mLab Status Page</a>
                        </h4>
                    </div>
                </div>
            </div>
        )
    }
}