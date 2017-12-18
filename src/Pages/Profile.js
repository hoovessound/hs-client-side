import React from 'react';
// import {Link} from 'react-router-dom';
import store from '../Redux/store';
import axios from 'axios';
import getApiUrl from '../Util/getApiUrl';

export default class Profile extends React.Component {
    constructor() {
        super();
        this.state = {
            user: {}
        }
    }

    async componentDidMount() {
        const user = store.getState().User;
        this.updateInfo(user);
        store.subscribe(() => {
            const user = store.getState().User;
            this.updateInfo(user);
        })
    }

    updateInfo(user) {
        this.setState({
            user,
        });
    }

    closeOverLay() {
        this.refs.overlay.style.display = 'none';
        this.refs.updateBox.style.display = 'none';
    }

    openOverLay() {
        this.refs.overlay.style.display = 'block';
        this.refs.updateBox.style.display = 'block';
    }

    fullNameOnChange(){
        const user = this.state.user;
        user.fullname = this.refs.userFullName_Edit.value;
        this.setState({
            user,
        })
    }

    async save(){
        const apiUrl = getApiUrl('api', '/settings?');
        await axios.post(apiUrl, {
            settings: {
                full_name: this.state.user.fullname,
            }
        }, {
            headers: {
                'content-type': 'application/json',
            }
        })
        this.closeOverLay();
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
                    padding: '5em 3em',
                }}
            >

                <div
                    id="overlay"
                    ref={"overlay"}
                    style={{
                        display: 'none',
                        position: 'fixed',
                        background: 'rgba(255,255,255, 0.5)',
                        height: '100vh',
                        width: '100vw',
                        top: 0,
                        left: 0,
                    }}
                    onClick={this.closeOverLay.bind(this)}
                ></div>

                <div
                    id="updateBox"
                    ref={"updateBox"}
                    style={{
                        display: 'none',
                        textAlign: 'center',
                        background: '#FFF',
                        padding: '4em 3em',
                        height: '50%',
                        width: '50%',
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}
                >
                    <img
                        alt="User profile icon"
                        ref={"userIcon_Edit"}
                        src={this.state.user.icon}
                        style={{
                            borderRadius: '50%',
                            width: '4em',
                            cursor: 'pointer',
                            margin: '0.5em',
                        }}
                    />
                    <p>Your name</p>
                    <input
                        ref="userFullName_Edit"
                        type={'text'}
                        style={{
                            cursor: 'pointer',
                            display: 'block',
                            border: '1px solid #000',
                            textAlign: 'center',
                            position: 'relative',
                            margin: 'auto',
                            padding: '0.5em',
                            borderRadius: '3px',
                        }}
                        value={this.state.user.fullname}
                        onChange={this.fullNameOnChange.bind(this)}
                    />


                    <div className="btn btn-success"
                         style={{
                             cursor: 'pointer',
                             margin: '0.5em',
                         }}
                         onClick={this.save.bind(this)}
                    >Update
                    </div>

                </div>

                <img
                    alt="User profile icon"
                    ref={"userIcon"}
                    src={this.state.user.icon}
                    style={{
                        borderRadius: '50%',
                    }}
                />
                <h1 ref="userFullName">{this.state.user.fullname}</h1>
                <div className="btn btn-info" onClick={this.openOverLay.bind(this)} style={{cursor: 'pointer'}}>Edit
                </div>
            </div>
        )
    }
}