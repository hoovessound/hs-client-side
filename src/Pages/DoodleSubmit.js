import React from 'react';
import axios from 'axios';
import getApiUrl from '../Util/getApiUrl';
import {Redirect} from 'react-router-dom';
import * as checkLogin from '../Util/checkLogin';

export default class DoodleSubmit extends React.Component {

    constructor() {
        super();
        this.state = {
            checks: [],
            ticks: [],
            error: '',
        }
    }

    makeId() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }

    makeChecks(messages) {
        const checks = this.state.checks;
        return messages.map(message => {
            const id = this.makeId();
            if (checks.length < messages.length) {
                checks.push(id);
            }

            return (
                <div
                    className={'makeCheck checklist-item'}
                >
                    <span
                        style={{
                            color: 'red',
                        }}
                    >*</span>

                    <span ref={id}>{message}</span>

                    <input type="checkbox" checkId={id} onChange={e => this.check(e)}/>

                </div>
            )
        })
    }

    makeInput(options){
        return options.map(option => {
            const isRequest = () => {
                if(option.require){
                    return (
                        <span
                            style={{
                                color: 'red',
                            }}
                        >*</span>
                    )
                }else{
                    return(
                        <span></span>
                    )
                }
            }

            return(
                <div className="input-group" key={options.title}>
                    {isRequest()}
                    <input type="text" class="form-control" placeholder={option.placeholder} ref={options.title}/>
                </div>
            )
        })
    }

    validCheks() {
        const ticks = this.state.ticks;
        const checks = this.state.checks;
        let pass = false;
        if (ticks.length === checks.length) {
            pass = true;
        }
        return pass;
    }

    check(e) {
        const currentTarget = e.currentTarget;
        const checkId = currentTarget.getAttribute('checkId');
        if (currentTarget.checked) {
            const ticks = this.state.ticks;
            ticks.push(checkId)
            this.setState({
                ticks,
            })
        } else {
            const ticks = this.state.ticks;
            ticks.splice(ticks.indexOf(checkId), 1);
            this.setState({
                ticks,
            })
        }
    }

    async submit() {
        const pass = this.validCheks();
        if (pass) {
            this.refs.checks.style.border = '';
            const apiUrl = getApiUrl('api', '/doodle?');
            const title = this.refs.title.value;
            const profileLink = this.refs.profileLink.value;
            const imgur = this.refs.imgur.value;
            const data = {
                imgur,
                link: profileLink,
                title,
            };
            const response = await axios.post(apiUrl, data);
            if(!response.data.error){
                this.setState({
                    redirect: '/doodle'
                })
            }else{
                this.setState({
                    error: response.data.error,
                })
            }
        } else {
            this.refs.checks.style.border = '1px solid red';
        }
    }

    render() {
        if(checkLogin.isLogin()){
            return (
                <div id="doodleSubmit">

                    <p>First of all, thank you for your submission</p>

                    <div id="inputs" ref={'inputs'}>
                        {
                            this.makeInput([
                                {
                                    title: 'Title',
                                    placeholder: 'Artwork title',
                                    require: true,
                                },
                                {
                                    title: 'Imgur Url',
                                    placeholder: 'Imgur url',
                                    require: true,
                                },
                                {
                                    title: 'Profile Url',
                                    placeholder: 'Your profile link EP: https://yay.deviantart.com',
                                    require: true,
                                }
                            ])
                        }
                    </div>

                    <div id="checks" ref={'checks'}>
                        {this.makeChecks([
                            'Have an copy of the artwork source file',
                            'Your artwork is SFW and family friendlily',
                            'Your artwork is under copyright and fair use'
                        ])}
                    </div>

                    <hr/>

                    <p>Once you submit your artwork, your artwork will show up in the gallery right away, but will NOT show in other places until your artwork has been approved and validated</p>

                    <div
                        className="btn btn-success"
                        onClick={this.submit.bind(this)}
                    >Submit
                    </div>
                    <Redirect to={this.state.redirect}/>
                </div>
            )
        }else{
            checkLogin.goLogin();
        }
    }
}