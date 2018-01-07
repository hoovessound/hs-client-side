import React from 'react';
import store from '../Redux/store';
import axios from 'axios';
import getApiUrl from '../Util/getApiUrl';
import Modal from 'react-responsive-modal';

export default class Profile extends React.Component {
    constructor() {
        super();
        this.state = {
            user: {},
            isOwner: false,
            modal: {
                open: false,
            }
        }
    }

    async fetchUserData(username) {
        const response = await axios.get(getApiUrl('api', `/search/${username}?`))
        let userObject = response.data.users[0];
        userObject.fullname = userObject.fullName;
        delete userObject.fullName;
        this.updateInfo({
            user: userObject,
        })
        const User = store.getState().User;
        if (User.username === userObject.username) {
            this.setState({
                isOwner: true,
            })
        } else {
        }
    }

    updateInfo(data) {
        this.setState({
            ...data,
        })
    }

    componentDidMount() {
        const username = this.props.match.params.username;
        this.fetchUserData(username);
    }

    closeOverLay() {
        this.setState({
            modal: {
                open: false,
            }
        })
    }

    openOverLay() {
        this.setState({
            modal: {
                open: true,
            }
        })
    }

    fullNameOnChange() {
        const user = this.state.user;
        user.fullname = this.refs.userFullName_Edit.value;
        this.setState({
            user,
        })
    }

    async save() {
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

    updateUserIcon() {
        const userIcon = this.refs.userIcon_Edit;
        userIcon.click();
        userIcon.onchange = () => this.uploadUserIcon()
    }

    async uploadUserIcon() {
        const userIcon = this.refs.userIcon_Edit;
        const form = new FormData();
        form.append('image', userIcon.files[0]);
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        };
        const apiUrl = getApiUrl('api', '/settings/profilepicture?');
        const response = await axios.post(apiUrl, form, config);
        if (!response.data.error) {
            const user = this.state.user;
            user.icon = response.data.icon;
            this.setState({
                user,
            });
            this.closeOverLay();
        }
    }

    render() {
        const editButton = () => {
            const allowToEdit = this.state.isOwner;
            if (allowToEdit) {
                return (
                    <div className="btn btn-info" onClick={this.openOverLay.bind(this)}
                         style={{cursor: 'pointer'}}>Edit</div>
                )
            } else {
                return (
                    <span></span>
                )
            }
        };

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

                <Modal little open={this.state.modal.open} onClose={this.closeOverLay.bind(this)}>
                    <div
                        id="updateBox"
                        ref={"updateBox"}
                        style={{
                            textAlign: 'center',
                            background: '#FFF',
                            padding: '4em 3em',
                        }}
                    >
                        <img
                            alt=""
                            ref={"userIcon_Edit"}
                            src={this.state.user.icon}
                            style={{
                                borderRadius: '50%',
                                width: '4em',
                                cursor: 'pointer',
                                margin: '0.5em',
                            }}
                            onClick={this.updateUserIcon.bind(this)}
                        />

                        <input type="file" ref={'userIcon_Edit'} hidden={'true'} style={{display: 'none'}}/>

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
                </Modal>

                <img
                    alt=""
                    ref={"userIcon"}
                    src={this.state.user.icon}
                    style={{
                        borderRadius: '50%',
                        width: '4em',
                    }}
                />
                <h1 ref="userFullName">{this.state.user.fullname}</h1>
                {editButton()}
            </div>
        )
    }
}