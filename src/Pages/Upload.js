import React from 'react';
import {Redirect} from 'react-router-dom';
import axios from 'axios';
import getApiurl from '../Util/getApiUrl';

export default class Upload extends React.Component {
    constructor() {
        super();
        this.state = {
            errorMessage: '',
            redirect: false,
            redirectTo: '',
        }
    }

    audioFileOnChange(e){
        // Get the file name
        if(e.target.files[0]){
            const file = e.target.files[0];
            const fileName = file.name;
            const stripFileName = fileName.split('.')[0];
            const titleEl = this.refs.title;
            if(!titleEl.value){
                titleEl.value = stripFileName;
            }
        }
    }

    coverArtOnChange(e){
        const file = e.target.files[0];
        const fs = new FileReader();
        fs.readAsDataURL(file);
        fs.onload = () => {
            this.refs.coverArt.style.backgroundImage = `url(${fs.result})`;
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
            // Redirect the user to the track page
            this.setState({
                redirect: true,
                redirectTo: `/track/${response.data.id}`,
            });
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

                <form ref="uploadForm" className={'uploadForm'}>

                    {/*Media file and info*/}
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-3">
                                <div
                                    className="coverArt"
                                    ref={'coverArt'}
                                    style={{
                                        position: 'relative',
                                        width: '15em',
                                        height: '15em',
                                        border: '2px dashed #161616',
                                        margin: '1em',
                                        backgroundSize: 'cover',
                                        backgroundRepeat: 'no-repeat',
                                    }}
                                >
                                    <input type="file" name="image" id="image" onChange={this.coverArtOnChange.bind(this)}
                                        style={{
                                            opacity: '0',
                                            width: '100%',
                                            height: '100%',
                                            cursor: 'pointer',
                                        }}
                                    />
                                        <div className="placeholder"
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                position: 'absolute',
                                                height: '100%',
                                                width: '100%',
                                                top: '0em',
                                                left: '0em',
                                                fontSize: '1.3em',
                                                zIndex: '-1',
                                                color: '#CCC',
                                            }}
                                        >
                                            <div className="fa fa-camera"></div>
                                        </div>
                                </div>
                            </div>

                            <div className="col-sm-9">
                                <input type="text" className="title form-control" placeholder="Track title" ref={'title'} name={'title'} style={{margin: '0.5em 0em'}} />
                                <textarea name="description" placeholder="Description" className="description form-control"
                                    style={{
                                        width: '100%',
                                        height: '50%',
                                        resize: 'none',
                                        marginBottom: '0.5em',
                                    }}
                                ></textarea>

                                <div className="audioContainer"
                                    style={{
                                        width: '100%',
                                        height: '20%',
                                        border: '2px dashed #161616',
                                        position: 'relative',
                                    }}
                                >
                                    <input type="file" name="audio" id="audio" onChange={this.audioFileOnChange.bind(this)} style={{
                                        opacity: '0',
                                        width: '100%',
                                        height: '100%',
                                        cursor: 'pointer',
                                    }} />
                                    <div className="placeholder"
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            position: 'absolute',
                                            height: '100%',
                                            width: '100%',
                                            top: '0em',
                                            left: '0em',
                                            color: '#CCC',
                                            zIndex: '-1',
                                        }}
                                    >
                                        <span>Audio track</span>
                                    </div>
                                </div>
                                <a className="btn btn-outline-success uploadButton" onClick={this.uploadTrack.bind(this)}
                                    style={{
                                        display: 'block',
                                        margin: '0.5em',
                                    }}
                                >Upload</a>
                            </div>
                        </div>
                    </div>

                </form>
                {
                    (() => {
                        if(this.state.redirect){
                            return (
                                <Redirect to={this.state.redirectTo}/>
                            )
                        }else{
                            return (
                                <span></span>
                            )
                        }
                    })()
                }
            </div>
        )
    }
}
