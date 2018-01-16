import React from 'react';
import {Redirect} from 'react-router-dom';
import axios from 'axios';
import getApiurl from '../Util/getApiUrl';

export default class Upload extends React.Component {
    constructor() {
        super();
        this.state = {
            errorMessage: '',
        }
    }

    audioFileOnChange(e){
        // Get the file name
        if(e.target.files[0]){
            const fileName = e.target.files[0].name;
            const stripFileName = fileName.split('.')[0];
            const titleEl = this.refs.title;
            if(!titleEl.value){
                titleEl.value = stripFileName;
            }
        }
    }

    throwError(msg){
        this.setState({
            errorMessage: msg,
        })
    }

    async uploadTrack(){
        const form = new FormData(this.refs.uploadForm);
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            },

            // Functions
            onUploadProgress:(progressEvt) => {
                const complete = progressEvt.loaded / progressEvt.total;
                const percentComplete = complete * 100;
                this.refs.processBar.style.width = `${percentComplete}%`;
            }
        };
        const response = await axios.post(getApiurl('api', `/upload?`), form, config);
        if(response.data.error){
            this.throwError(response.data.msg);
        }else{
            return (
                <Redirect to={`/track/${response.data.id}`}/>
            )
        }
    }

    render() {
        return (
            <div ref="upload">

                <div className="error">
                    <p
                        style={{
                            color: 'red'
                        }}
                    >{this.state.errorMessage}</p>
                </div>

                <form ref="uploadForm">

                    <div className="progress">
                        <div className="progress-bar"
                             role="progressbar"
                             aria-valuenow="0"
                             aria-valuemin="0"
                             aria-valuemax="100"
                             ref="processBar"
                             style={{
                                 width: '0%',
                             }}
                        >
                        </div>
                    </div>

                    {/*Media file and info*/}

                    <h1>Step 1: Select your audio file</h1>

                    <div
                        id="audioFile"
                        style={{
                            position: 'relative',
                            border: '3px solid #161616',
                            width: '50em',
                            height: '10em',
                            margin: '0.5em auto'
                        }}
                    >

                        <p style={{
                            textAlign: 'center',
                            fontSize: '1.2em',
                            margin: '0.5em',
                        }}>Drop your file here</p>

                        <input
                            ref="audioFile"
                            type="file"
                            name={'audio'}
                            onChange={this.audioFileOnChange.bind(this)}
                        style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        opacity: 0,
                        width: '100%',
                        height: '100%',
                    }}
                        />
                    </div>

                    <hr/>

                    <h1>Step 2: Fill up the meta data</h1>

                    <div id="title">
                        <p>Title<span style={{color: 'red'}}>*</span></p>
                        <input ref="title" type="text" name={'title'} />
                    </div>

                    <div id="description">
                        <p>Description</p>
                        <textarea ref="description" type="text" name={'description'} />
                    </div>

                    <hr/>

                    <h1>Step 3: Choose a covert art</h1>

                    <div
                        id="audioFile"
                        style={{
                            position: 'relative',
                            border: '3px solid #161616',
                            width: '50em',
                            height: '10em',
                            margin: '0.5em auto'
                        }}
                    >

                        <p style={{
                            textAlign: 'center',
                            fontSize: '1.2em',
                            margin: '0.5em',
                        }}>Drop your file here</p>

                        <input
                            ref="coverArtFile"
                            type="file"
                            name={'image'}
                            onChange={this.audioFileOnChange.bind(this)}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                opacity: 0,
                                width: '100%',
                                height: '100%',
                            }}
                        />
                    </div>

                    <hr/>

                    <div
                        className="btn btn-success"
                        style={{
                            cursor: 'pointer',
                            marginTop: '0.5em',
                        }}
                        onClick={this.uploadTrack.bind(this)}
                    >Upload</div>

                </form>
            </div>
        )
    }
}