import React from 'react';
import axios from 'axios';
import getApiurl from '../Util/getApiUrl';
import {url} from '../Util/textFormat';
import {Link} from 'react-router-dom';

const token = 'e7671b56aca42828b5da68aad722f8c4f441d76dcef9f747d3aebd371dc10c18af6ac5c6297094500fe69578904c95eacca8';
export default class Comment extends React.Component {
    constructor(){
        super();
        this.state = {
            comments: []
        }
    }

    async componentDidMount(){
        const trackId = this.props.trackId;
        const response = await axios.get(getApiurl('api', `/track/comment/${trackId}?offset=0&bypass=true&oauth_token=${token}`))
        const body = response.data;
        this.setState({
            comments: body,
        })
    }

    eachComment(comment, index){
        return (
            <div key={comment.id}>
                <Link to={"/@" + comment.author.username}>{"@" + comment.author.username}</Link>
                <p>{url(comment.comment)}</p>
            </div>
        )
    }

    async postComment(event){
        if(event.keyCode === 13){
            const trackId = this.props.trackId;
            const value = this.refs.input.value;
            this.refs.input.value = '';
            const response = await axios.post(getApiurl('api', `/track/comment/${trackId}?offset=0&bypass=true&oauth_token=${token}`), {
                comment: value,
            })
            const body = response.data;
            const comments = this.state.comments;
            comments.push(body);
            this.setState({
                comments,
            });
        }
    }

    render(){
        return (
            <div className="commentSession">
                <input ref="input" onKeyDown={this.postComment.bind(this)} />

                <div className="comments">
                    {this.state.comments.map(this.eachComment.bind(this))}
                </div>
            </div>
        )
    }
}