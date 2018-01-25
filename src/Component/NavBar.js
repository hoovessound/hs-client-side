import React from 'react';
import axios from 'axios';
import store from '../Redux/store';
import getApiUrl from '../Util/getApiUrl';
import Notifications from '../Component/Notifications';
import {Link, Redirect} from 'react-router-dom';
import * as checkLogin from '../Util/checkLogin';
import '../css/NavBar.css';

const devUrl = getApiUrl('console.developer', '/', false);

export default class NavBar extends React.Component {

    constructor() {
        super();
        this.state = {
            userIcon: '',
            username: '',
            notificationStyle: '',
            redirect: {
                redirect: false,
                link: '/',
            }
        }
    }

    async componentDidMount() {
        const response = await axios.get(getApiUrl('api', '/me?'));
        let notificationStyle = {};
        if (response.data.unreadNotification) {
            notificationStyle = '2px red solid';
        }
        this.setState({
            userIcon: response.data.icon,
            username: response.data.username,
            notificationStyle,
        }, () => {
            store.dispatch({
                type: 'UPDATE_USER_STACK',
                payload: response.data,
            });
        });
    }

    showNotification() {
        this.setState({
            notificationStyle: '',
        });
    }

    search(e) {
        e.preventDefault();
        const value = this.refs.search.value;
        this.setState({
            redirect: {
                redirect: true,
                link: `/search/${value}`
            }
        }, () => {
            this.setState({
                redirect: {
                    redirect: false,
                    link: `/`
                }
            });
        })
    }

    render() {

        return (
            <div>

                {
                    (() => {
                        if (this.state.redirect.redirect) {
                            const url = this.state.redirect.link;
                            return (
                                <Redirect to={url}/>
                            )

                        } else {
                            return (
                                <span></span>
                            )
                        }
                    })()
                }

                <nav
                    className="navbar navbar-toggleable-md navbar-light bg-faded fixed-top"
                    style={{
                        padding: '1em',
                    }}
                >
                    <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse"
                            data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <span className="navbar-brand">
                        <Link to={"/"}>HoovesSound</Link>
                    </span>
                    <div className="collapse navbar-collapse" id="navbarNav">

                        <ul className="navbar-nav">

                            <li className="nav-item">
                                <div className="nav-link">
                                    <Link to={"/"}>Home</Link>
                                </div>
                            </li>

                            {
                                (() => {
                                    if (checkLogin.isLogin()) {
                                        return (
                                            <li className="nav-item">
                                                <div className="nav-link">
                                                    <Link to={"/favorite"}>Favorite</Link>
                                                </div>
                                            </li>
                                        )
                                    } else {
                                        return null;
                                    }
                                })()
                            }

                            <li className="nav-item">
                                <div className="nav-link">
                                    <Link to={"/doodle"}>Doodle</Link>
                                </div>
                            </li>

                        </ul>

                        {
                            (() => {
                                if (checkLogin.isLogin()) {
                                    return (
                                        <ul className="navbar-nav ml-auto">

                                            <ul className="text-truncate">
                                                <form className="input-group">
                                                    <input ref={'search'} className="form-control"
                                                           placeholder="Search Here" autoComplete="off" type="text"/>
                                                    <button className="btn btn-outline-success" type="submit"
                                                            onClick={(e) => this.search(e)}>Search
                                                    </button>
                                                </form>
                                            </ul>

                                            <li className="nav-link">
                                                <Link
                                                    to="/upload"
                                                    className="fa fa-upload"
                                                    style={{
                                                        fontSize: '1.5em'
                                                    }}
                                                />
                                            </li>

                                            {/*Notification*/}

                                            <li
                                                className="nav-item dropdown"
                                            >
                                                <a className="nav-link"
                                                   id="notification"
                                                   data-toggle="dropdown"
                                                   aria-haspopup="true"
                                                   aria-expanded="false"
                                                   style={{
                                                       display: 'inline',
                                                   }}
                                                >

                                    <span
                                        style={{
                                            cursor: 'pointer',
                                        }}
                                        id={'dropdown-wraper'}
                                    >
                                        <span
                                            className="fa fa-bell"
                                            style={{
                                                fontSize: '2em',
                                                display: 'inline-block',
                                                borderBottom: this.state.notificationStyle,
                                            }}
                                            onClick={this.showNotification.bind(this)}
                                        ></span>

                                    </span>

                                                </a>
                                                <div className="dropdown-menu dropdown-menu-right" ref={'notification'}>
                                                    <Notifications/>
                                                </div>
                                            </li>

                                            {/*Profile*/}

                                            <li
                                                className="nav-item dropdown"
                                            >
                                                <a className="nav-link"
                                                   id="navbarDropdown"
                                                   data-toggle="dropdown"
                                                   aria-haspopup="true"
                                                   aria-expanded="false"
                                                   style={{
                                                       display: 'inline',
                                                   }}
                                                >

                                    <span
                                        style={{
                                            cursor: 'pointer',
                                        }}
                                        id={'dropdown-wraper'}
                                    >
                                        <img
                                            src={`${this.state.userIcon}?width=50`}
                                            alt="Your profile icon"
                                            style={{
                                                borderRadius: '50%',
                                                width: '2.5em',
                                                display: 'inline',
                                            }}
                                        />
                                        <span
                                            className="fa fa-chevron-down"
                                            style={{
                                                fontSize: '0.7em',
                                                margin: '0.5em',
                                            }}
                                        ></span>
                                    </span>

                                                </a>
                                                <div className="dropdown-menu dropdown-menu-right"
                                                     aria-labelledby="navbarDropdown">

                                                    <div className="nav-link">
                                                        <Link to={`/@${this.state.username}`}>Profile</Link>
                                                    </div>

                                                    <div className="nav-link">
                                                        <a href={devUrl}>Developer</a>
                                                    </div>

                                                    <div className="nav-link">
                                                        <Link to={'/playlist'}>Playlist</Link>
                                                    </div>

                                                    <div className="nav-link">
                                                        <Link to={"/logout"}>Logout</Link>
                                                    </div>

                                                </div>
                                            </li>

                                        </ul>
                                    )
                                } else {
                                    return (
                                        <ul className="navbar-nav ml-auto">
                                            <a href={`https://id.hoovessound.ml/login?service=hs_service_login&redirect=${window.location}`}
                                               className="btn btn-info">Login</a>
                                        </ul>
                                    )
                                }
                            })()
                        }

                    </div>
                </nav>
            </div>

        )
    }
}