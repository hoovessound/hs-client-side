import React from 'react';
import axios from 'axios';

export default class Layout extends React.Component {

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
                }
            }
        }
    }

    async componentDidMount() {
        const apiUrl = 'https://api.github.com/repos/hoovessound/hs-client-side/commits';
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
            <footer
                style={{
                    marginTop: '1.5em',
                }}
            >
                <hr/>
                <a href="https://github.com/hoovessound" className="fa fa-github" target="_blank"> Open Source</a>

                <div
                    id="buildinfo"
                    style={{
                        fontSize: '0.6em',
                    }}
                >
                    <p>
                        Stage:
                        <span
                            style={{
                                color: '#FFF',
                                background: 'lightgreen',
                                padding: '0.2em',
                            }}
                        >Active Development(Open Beta)</span>
                    </p>

                    <p>
                        Build info:

                        <p>
                            Active Development Branch:
                            <span
                                style={{
                                    color: '#FFF',
                                    background: 'lightgreen',
                                    padding: '0.2em',
                                }}
                            >redux</span>
                        </p>

                        <p>
                            Last Commit:
                            <a href={this.state.buildInfo.commit.url} target="_blank">
                                <span
                                    style={{
                                        color: '#FFF',
                                        background: 'lightgreen',
                                        padding: '0.2em',
                                    }}
                                >{this.state.buildInfo.lastCommit}</span>
                            </a>
                        </p>

                        <p>
                            Commit Message:
                            <a href={this.state.buildInfo.commit.url} target="_blank">
                                <span
                                    style={{
                                        color: '#FFF',
                                        background: 'lightgreen',
                                        padding: '0.2em',
                                    }}
                                >{this.state.buildInfo.commit.message}</span>
                            </a>
                        </p>

                        <p>
                            Commit Author:
                            <a href={this.state.buildInfo.commit.author.link} target="_blank">
                                <span
                                    style={{
                                        color: '#FFF',
                                        background: 'lightgreen',
                                        padding: '0.2em',
                                    }}
                                >{this.state.buildInfo.commit.author.name}</span>
                            </a>
                        </p>

                    </p>
                </div>

            </footer>
        )
    }
}