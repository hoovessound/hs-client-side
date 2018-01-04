import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import getApiurl from '../Util/getApiUrl';

export default class Notifications extends React.Component {

    constructor(){
        super();
        this.state = {
            payloads: [],
        }
    }


    async componentDidMount(){
        const response = await axios.get(getApiurl('api', '/notification?'));
        this.setState({
            payloads: response.data,
        })
    }

    eachPayload() {
        const payloads = this.state.payloads;
        let body;
        let title;
        let icon;
        return payloads.map(payload => {

            if(payload.title){
                title = () => {
                    return (
                        <span>{payload.title}</span>
                    )
                }
            }else{
                title = () => {
                    return (
                        <span></span>
                    )
                }
            }

            if(payload.link){
                const rootUrl = getApiurl('$NA', '', false);
                let isHSLink = false;
                if(payload.link.startsWith(rootUrl) || payload.link.startsWith('https://hoovessound.ml') || payload.link.startsWith('http://hoovessound.ml')){
                    isHSLink = true;
                }
                if(isHSLink){
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
                }else{
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
            }

            if(payload.icon){
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
            }

            return (
                <div
                    key={payload.id}
                >
                    {icon()}
                    {body()}
                </div>
            )
        })
    }

    render(){
        return (
            <div id={'notifications'}>
                {this.eachPayload(this.state.payloads)}
            </div>
        )
    }
}