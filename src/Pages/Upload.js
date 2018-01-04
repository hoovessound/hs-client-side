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

    textStrip(text){
        // lol
        return (text);
    }

    updatingTitle(){
        this.refs.title.value = this.textStrip(this.refs.title.value);
    }

    audioFileOnChange(e){
        // Get the file name
        const fileName = e.target.files[0].name;
        const stripFileName = this.textStrip(fileName.split('.')[0]);
        const titleEl = this.refs.title;
        if(!titleEl.value){
            titleEl.value = stripFileName;
        }
    }

    throwError(msg){
        this.setState({
            errorMessage: msg,
        })
    }

    async uploadTrack(){
        const form = new FormData();
        const titleEl = this.refs.title;
        const audioFileEl = this.refs.audioFile;
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
        form.append('title', titleEl.value);
        form.append('audio', audioFileEl.files[0]);
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

                    <div id="audioFile">
                        <p>Audio File<span style={{color: 'red'}}>*</span></p>
                        <input ref="audioFile" type="file" onChange={this.audioFileOnChange.bind(this)} />
                    </div>

                    <div id="title">
                        <p>Title<span style={{color: 'red'}}>*</span></p>
                        <input ref="title" type="text" onKeyUp={this.updatingTitle.bind(this)}/>
                    </div>

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