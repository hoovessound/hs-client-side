import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import TrackContainer from '../Component/TrackContainer';
import getApiurl from '../Util/getApiUrl';
import renderHTML from 'react-render-html';
import {url} from '../Util/textFormat';
import Comment from '../Component/Comment';
import Favorite from '../Component/Favorite';
import Playlist from '../Component/Playlist';
import Modal from 'react-responsive-modal';
import * as checkLogin from '../Util/checkLogin';
import store from "../Redux/store";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';


export default class Track extends React.Component {
    constructor() {
        super();
        this.state = {
            trackInfo: [],
            track: {},
            modal: {
                edit: {
                    open: false,
                }
            },
            backgroundDropEl: [],
            longText: 'Show More',
            descriptionExtended: false,
            descriptionStyle: {
                display: 'none',
            },
        }
    }

    async componentDidMount() {
        this.fetchBackgroundDrop();
        try {
            const trackId = this.props.match.params.id;
            const response = await axios.get(getApiurl('api', `/track/${trackId}?`))
            const track = response.data;
            if(track.description === null) {
                track.description = '';
            }
            const description = track.description ? url(track.description) : '';

            this.setState({
                track,
            });

            const trackInfo = () => {
                return (
                    <div>
                        <div className="tags">

                        </div>

                        {
                            (() => {
                                if(checkLogin.isLogin()){
                                    return (
                                        <div>
                                            <Favorite trackId={this.props.match.params.id}/>
                                            <Playlist track={track}/>

                                            <div
                                                className="btn btn-info"
                                                onClick={() => {
                                                    this.setState({
                                                        modal: {
                                                            edit: {
                                                                open: true,
                                                            }
                                                        }
                                                    });
                                                }}
                                                style={{
                                                    cursor: 'pointer',
                                                }}
                                            >Edit</div>

                                        </div>
                                    )
                                }else{
                                    return (
                                        <span></span>
                                    )
                                }
                            })()
                        }

                        <h1
                            className="title"
                            style={{
                                whiteSpace: 'pre',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                        >{track.title}</h1>
                        <p>By <Link
                            to={'/@' + track.author.username}>{'@' + track.author.username}</Link>
                        </p>
                        <TrackContainer key={track.id} track={track} notitle nolink noauthor/>

                        <div className="description">
                            {renderHTML(description)}
                        </div>

                        {
                            (() => {
                                if(checkLogin.isLogin()){
                                    return (
                                        <Comment trackId={this.props.match.params.id}/>
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
            };
            this.setState({
                trackInfo: trackInfo(),
            });
        } catch (e) {
            console.log(e)
        }
    }

    eachTags(){
        if(this.state.track.tags && this.state.track.tags.length > 0){
            const tags = [];
            this.state.track.tags.map(tag => {
                return tags.push(
                    <span
                        className="tag"
                        key={tag}
                        style={{
                            background: 'lightgray',
                            padding: '0.3em 0.5em',
                            borderRadius: '5px',
                        }}
                    >
                    {tag}
                </span>
                )
            });
            return tags;
        }else{
            return (
                <span>Maybe add some tags :P</span>
            )
        }
    }

    async addTag(evt){
        const charCode = evt.which || evt.charCode || evt.keyCode || 0;
        if(charCode === 13){
            // ENTER
            const url = getApiurl('api', `/track/tag/${this.state.track.id}?`);
            const tagName = this.refs.tagName.value;
            const tags = this.state.track.tags;
            tags.push(tagName);
            this.setState({
                track: {
                    tags,
                }
            });
            this.refs.tagName.value = '';
            await axios.post(url,{
                tag: tagName,
            });
        }
    }

    async updateTrack(){
        const track = this.state.track;
        const url = getApiurl('api', `/track/edit/${track.id}?`);
        const form = new FormData(this.refs.editForm);
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        };
        await axios.post(url, form, config);
        const modal = this.state.modal;
        modal.edit.open = false;
        this.setState({
            modal,
        });
        // Update the DOM
        track.title = form.get('title');
        track.description = form.get('description');
        this.setState({
            track,
        })
    }

    async fetchBackgroundDrop(){
        const url = getApiurl('api', '/me/doodles?');
        const response = await axios.get(url);
        const doodles = response.data.map(doodle => {
            return (
                <div className="bgDropContainer"
                    style={{
                        cursor: 'pointer',
                    }}
                     key={doodle.id}
                     onClick={() => this.changeBackgroundDrop(doodle.id)}
                >
                    <img src={doodle.image} alt={`${doodle.id} doodle`} style={{width: '25em', height: '15em'}}/>
                    <hr/>
                </div>
            )
        });
        this.setState({
            backgroundDropEl: doodles,
        })
    }

    async changeBackgroundDrop(id){
        const modal = this.state.modal;
        const url = getApiurl('api', `/track/backgrounddrop/${this.state.track.id}?`);

        await axios.post(url, {
            id,
        });

        modal.edit.open = false;
        this.setState({
            modal,
        });
    }

    render() {
        const track = this.state.track;
        if(track.author){
            return (
                <div ref={this.props.match.params.id} key={this.props.match.params.id}>

                    <Modal open={this.state.modal.edit.open} onClose={() => {
                        this.setState({
                            modal: {
                                edit: {
                                    open: false,
                                },
                            }
                        })
                    }} little>
                        <br/>
                        <h3>Edit {renderHTML(this.state.track.title ? this.state.track.title : '')}</h3>

                        <form id="editForm" ref={'editForm'}>
                            <Tabs>

                                <TabList>
                                    <Tab>Metadata</Tab>
                                    <Tab>Background Drop</Tab>
                                </TabList>

                                <TabPanel>
                                    <p>Title</p>
                                    <input type="text" name={'title'} defaultValue={renderHTML(this.state.track.title ? this.state.track.title : '')} />
                                    <p>Description</p>
                                    <textarea name="description" defaultValue={renderHTML(this.state.track.description ? this.state.track.description : '')}></textarea>
                                    <hr/>
                                    <span>Tags</span>
                                    <div className="tags">
                                        {this.eachTags()}
                                        <input
                                            type="text"
                                            ref={'tagName'}
                                            style={{
                                                border: 'none',
                                                background: 'none',
                                                outline: 'none',
                                                marginLeft: '0.5em',
                                            }}
                                            onKeyDown={this.addTag.bind(this)}
                                        />
                                    </div>

                                    <div className="btn btn-success" ref={'updateButton'} onClick={this.updateTrack.bind(this)}>Update</div>
                                </TabPanel>

                                <TabPanel>
                                    {this.state.backgroundDropEl}
                                </TabPanel>

                            </Tabs>
                        </form>
                    </Modal>


                    <div>
                        <div className="tags">

                        </div>

                        {
                            (() => {
                                if(checkLogin.isLogin()){
                                    return (
                                        <div>
                                            <Favorite trackId={this.props.match.params.id}/>
                                            <Playlist track={track}/>

                                            {
                                                (() => {
                                                    const User = store.getState().User;
                                                    if(User.id === this.state.track.author.id){
                                                        return (
                                                            <div
                                                                className="btn btn-info"
                                                                onClick={() => {
                                                                    this.setState({
                                                                        modal: {
                                                                            edit: {
                                                                                open: true,
                                                                            }
                                                                        }
                                                                    });
                                                                }}
                                                                style={{
                                                                    cursor: 'pointer',
                                                                }}
                                                            >Edit</div>
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
                                }else{
                                    return (
                                        <span></span>
                                    )
                                }
                            })()
                        }

                        <h1
                            className="title"
                            style={{
                                whiteSpace: 'pre',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                            ref={'mainTitle'}
                        >{track.title}</h1>
                        <p>By <Link
                            to={'/@' + track.author.username}>{'@' + track.author.username}</Link>
                        </p>
                        <TrackContainer key={track.id}
                                        track={track}
                                        notitle
                                        nolink
                                        noauthor
                                        nobackgrounddrop
                        />

                        <div className="description">
                            {
                                (() => {
                                    let a = this.state.track.description;
                                    const b = a.split('\n');
                                    const lines = b.length;
                                    let preview = '';
                                    // Genera preview text
                                    for(let index = 0; index < 3; index++){
                                        preview += url(a.split('\n')[index] + ' <BR />');
                                    }
                                    a = a.split(/\n/).join(' <BR />');

                                    if(lines <= 2){
                                        return renderHTML(
                                            url(a)
                                        );
                                    }else{
                                        return (
                                            <div id={'readmore'}>
                                                {
                                                    renderHTML(preview)
                                                }
                                                <div ref={'dsText'} id={'dsText'} style={this.state.descriptionStyle}>
                                                    {
                                                        (() => {
                                                            let text = '';
                                                            for(let index = 3; index < lines; index++){
                                                                text += url(`${b[index]} <BR />`);
                                                            };
                                                            return renderHTML(text);
                                                        })()
                                                    }
                                                </div>
                                                <a
                                                    style={{
                                                        display: 'block',
                                                        background: 'rgba(204, 204, 204, 0.4)',
                                                        cursor: 'pointer',
                                                        textAlign: 'center',
                                                        width: '15em',
                                                        padding: '0.1em',
                                                    }}
                                                    onClick={ (() => {
                                                        if(this.state.descriptionExtended){
                                                            // Close
                                                            this.setState({
                                                                descriptionExtended: false,
                                                                descriptionStyle: {
                                                                    display: 'none',
                                                                },
                                                                longText: 'Show More',
                                                            });
                                                        }else{
                                                            // Open
                                                            this.setState({
                                                                descriptionExtended: true,
                                                                descriptionStyle: {
                                                                    display: 'block',
                                                                },
                                                                longText: 'Show Less',
                                                            });
                                                        }
                                                    })}
                                                >{this.state.longText}</a>
                                            </div>
                                        )

                                    }
                                })()

                            }
                        </div>
                        <hr />
                        {
                            (() => {
                                if(checkLogin.isLogin()){
                                    return (
                                        <Comment trackId={this.props.match.params.id}/>
                                    )
                                }else{
                                    return (
                                        <Comment trackId={this.props.match.params.id} noinput/>
                                    )
                                }
                            })()
                        }

                    </div>
                </div>
            )
        }else{
            return (
                <div></div>
            )
        }
    }
}