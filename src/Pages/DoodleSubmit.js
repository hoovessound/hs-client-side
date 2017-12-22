import React from 'react';
import axios from 'axios';
import getApiUrl from '../Util/getApiUrl';
import {Redirect} from 'react-router-dom';

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
        return (
            <div id="doodleSubmit">
                <span
                    style={{
                        color: 'red',
                    }}
                >{this.state.error}</span>

                <p>First of all, thank you for your submission</p>
                <div class="input-group">
                    <input type="text" class="form-control" placeholder="Artwork title" ref={'title'}/>
                </div>

                <div class="input-group">
                    <span
                        style={{
                            color: 'red',
                        }}
                    >*</span>
                    <input type="text" class="form-control" placeholder="Imgur url" ref={'imgur'}/>
                </div>

                <div class="input-group">
                    <input type="text" class="form-control"
                           placeholder="Your profile link EP: https://yay.deviantart.com" ref={'profileLink'}/>
                </div>

                <div id="checks" ref={'checks'}>
                    {this.makeChecks([
                        'Make sure you have a copy of you artwork file, like a PSD and a PNG/JPG on your computer',
                        'You artwork is COMPLETELY family save, NO NSFW is allow in HoovesSound Doodle',
                        'You own this artwork, and you didn\'t violate the copyright law, like download somebody else artwork and re-uplaod it'
                    ])}
                </div>

                <div
                    className="btn btn-success"
                    onClick={this.submit.bind(this)}
                >Submit
                </div>
                <Redirect to={this.state.redirect}/>
            </div>
        )
    }
}