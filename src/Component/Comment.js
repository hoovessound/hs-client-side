import React from 'react';
import axios from 'axios';
import getApiurl from '../Util/getApiUrl';
import {url} from '../Util/textFormat';
import {Link} from 'react-router-dom';
import renderHtml from 'react-render-html';

export default class Comment extends React.Component {
    constructor(){
        super();
        this.state = {
            comments: []
        }
    }

    async componentDidMount(){
        const trackId = this.props.trackId;
        const response = await axios.get(getApiurl('api', `/track/comment/${trackId}?offset=0`))
        const body = response.data;
        this.setState({
            comments: body,
        })
    }

    eachComment(comment, index){
        return (
            <div key={comment.id}>
                <Link to={"/@" + comment.author.username}>{"@" + comment.author.username}</Link>
                <p>{renderHtml(url(comment.comment))}</p>
            </div>
        )
    }

    async postComment(event){
        if(event.keyCode === 13){
            const trackId = this.props.trackId;
            const value = this.refs.input.value;
            this.refs.input.value = '';
            const response = await axios.post(getApiurl('api', `/track/comment/${trackId}?offset=0`), {
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