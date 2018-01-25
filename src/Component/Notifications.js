import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import getApiurl from '../Util/getApiUrl';
import skygear from "skygear";

let initLoad = false;
export default class Notifications extends React.Component {

    constructor() {
        super();
        this.state = {
            payloads: [],
            els: [], // Elements
        }
    }


    async componentDidMount() {
        const response = await axios.get(getApiurl('api', '/notification?read=true'));
        const els = [];
        this.setState({
            payloads: response.data,
        });
        // Init render
        response.data.map(payload => {
            return els.push(
                this.parsePayload(payload)
            )
        });
        this.setState({
            els,
        });
    }

    parsePayload(payload) {
        let body;
        let title;
        let icon;
        if (payload.title) {
            title = () => {
                return (
                    <span>{payload.title}</span>
                )
            }
        } else {
            title = () => {
                return (
                    <span></span>
                )
            }
        }

        if (payload.link) {
            const rootUrl = getApiurl('$NA', '', false);
            let isHSLink = false;
            if (payload.link.startsWith(rootUrl) || payload.link.startsWith('https://hoovessound.ml') || payload.link.startsWith('http://hoovessound.ml')) {
                isHSLink = true;
            }


            if (isHSLink) {
                const link = payload.link.split('/')[3];
                body = () => {
                    return (
                        <Link to={link}>
                            <span>{title()}</span>
                            <br/>
                            <span>{payload.message}</span>
                            <hr/>
                        </Link>
                    )
                }
            } else {
                body = () => {
                    return (
                        <a href={payload.link} target="_blank">
                            <span>{title()}</span>
                            <br/>
                            <span>{payload.message}</span>
                            <hr/>
                        </a>
                    )
                }
            }
        } else {
            body = () => {
                return (
                    <a href={payload.link} target="_blank">
                        <span>{title()}</span>
                        <br/>
                        <span>{payload.message}</span>
                        <hr/>
                    </a>
                )
            }
        }

        if (payload.icon) {
            icon = () => {
                return (
                    <img
                        src={payload.icon}
                        alt={payload.icon}
                        style={{
                            width: '2em',
                            borderRadius: '50%',
                            display: 'block',
                        }}
                    />
                )
            }
        } else {
            icon = () => {
                return null;
            }
        }
        return (
            <div
                key={payload.id}
            >
                {icon()}
                {body()}
            </div>
        );
    }

    render() {
        if(!initLoad){
            skygear.pubsub.on('NOTIFICATION_SENT', (data) => {
                const payloads = this.state.payloads;
                const els = this.state.els;
                payloads.push(data);
                this.setState({
                    payloads,
                });
                els.push(
                    this.parsePayload(data)
                );
                this.setState({
                    els: els.reverse(),
                });
            });
            initLoad = true;
        }
        return (
            <div id={'notifications'}>
                {this.state.els}
            </div>
        )
    }
}