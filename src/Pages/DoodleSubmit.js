import React from 'react';
import axios from 'axios';
import getApiUrl from '../Util/getApiUrl';
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
            };

            return(
                <div className="input-group" key={options.title}>
                    {isRequest()}
                    {
                        (() => {
                            if(option.file){
                                return (
                                    <input type="file" name={option.name} ref={option.name} />
                                )
                            }else{
                                return (
                                    <input type="text" class="form-control" placeholder={option.placeholder} name={option.name} ref={option.name} />
                                )
                            }
                        })()
                    }
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
            const formElement = this.refs.inputs;
            console.log(formElement)
            const form = new FormData(formElement);
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };
            const apiUrl = getApiUrl('api', '/doodle?');
            const response = await axios.post(apiUrl, form, config);
            if(!response.data.error){
                this.setState({
                    error: response.data.error
                });
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
                    <p style={{color: 'red'}}>{this.state.error}</p>
                    <form id="inputs" ref={'inputs'}>
                        {
                            this.makeInput([
                                {
                                    title: 'Title',
                                    placeholder: 'Artwork title',
                                    require: true,
                                    name: 'title',
                                },
                                {
                                    title: 'Imgur Url',
                                    placeholder: 'Imgur url',
                                    name: 'image',
                                    require: true,
                                    file: true,
                                },
                                {
                                    title: 'Profile Url',
                                    placeholder: 'Your profile link EP: https://yay.deviantart.com',
                                    require: true,
                                    name: 'url',
                                }
                            ])
                        }
                    </form>

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
                </div>
            )
        }else{
            checkLogin.goLogin();
        }
    }
}