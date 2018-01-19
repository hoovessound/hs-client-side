import React from 'react';
import axios from 'axios';
import getApiUrl from '../Util/getApiUrl';
import * as checkLogin from '../Util/checkLogin';
import {Redirect} from 'react-router-dom';

export default class DoodleSubmit extends React.Component {

    constructor() {
        super();
        this.state = {
            checks: [],
            ticks: [],
            error: '',
            redirect: false,
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
                },

                onUploadProgress:(progressEvt) => {
                    const complete = progressEvt.loaded / progressEvt.total;
                    const percentComplete = complete * 100;
                    this.refs.processBar.style.width = `${percentComplete}%`;
                }
            };
            const apiUrl = getApiUrl('api', '/doodle?');
            const response = await axios.post(apiUrl, form, config);
            if(response.data.error){
                this.setState({
                    error: response.data.error
                });
            }else{
                this.setState({
                    redirect: true,
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

                    {
                        (() => {
                            if(this.state.redirect){
                                return (
                                    <Redirect to={'/doodle'}/>
                                )
                            }else{
                                return (
                                    <span></span>
                                )
                            }
                        })()
                    }

                    <p style={{font-family: 'verdana', font-size: '160%', font-weight: 'bold'}}>Artwork Submission</p>
                    <p style={{color: 'red'}}>{this.state.error}</p>

                    <div
                        className="progress-container"
                        style={{
                            width: 'auto',
                            height: '1.5em',
                            position: 'relative',
                        }}
                    >
                        <div
                            className="progress"
                            style={{
                                width: 'auto',
                                height: '1.5em',
                                top: '6em',
                                left: '0em',
                                right: '0em',
                                position: 'fixed',
                            }}

                        >
                            <div className="progress-bar"
                                 role="progressbar"
                                 aria-valuenow="0"
                                 aria-valuemin="0"
                                 aria-valuemax="100"
                                 ref="processBar"
                                 style={{
                                     width: '0%',
                                     position: 'relative'
                                 }}
                            >
                            </div>
                        </div>

                    </div>

                    <form id="inputs" ref={'inputs'}>
                        {
                            this.makeInput([
                                {
                                    title: 'Title',
                                    placeholder: 'Title of Artwork',
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
                                    placeholder: 'Source link e.g. https://artist.deviantart.com',
                                    require: true,
                                    name: 'url',
                                }
                            ])
                        }
                    </form>
                    <br>
                    <p>By submitting this artwork, I declare that:</p>

                    <div id="checks" ref={'checks'}>
                        {this.makeChecks([
                            'The artwork is safe for work and contains no mature content.',
                            'The artwork can be shared within the scope of fair use with regards to copyrighted or licensed materials, if applicable.'
                        ])}
                    </div>

                    <hr/>

                    <p>Once you click Submit, it will immediately show up in the user gallery, but it will NOT appear in other places until your artwork has been approved and validated</p> // Is this so?

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
