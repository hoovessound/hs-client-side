import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import getApiurl from '../Util/getApiUrl';
import store from '../Redux/store';

export default class Profile extends React.Component {
    constructor() {
        super();
        this.state = {
            user: {}
        }
    }

    async componentDidMount() {
        store.subscribe(() => {
            const user = store.getState().User;
            console.log(user)
            this.setState({
                user,
            });
        })
    }

    render() {
        return (
            <div
                ref="userInfo"
                style={{
                    backgroundImage: `url(${this.state.user.banner})`,
                    backgroundAttachment: 'fixed',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    padding: '5em 3em'
                }}
            >
                <img
                    alt="User profile icon"
                    src={this.state.user.icon}
                    style={{
                        borderRadius: '50%',
                    }}
                />
                <h1 ref="fullname">{this.state.user.fullname}</h1>
            </div>
        )
    }
}