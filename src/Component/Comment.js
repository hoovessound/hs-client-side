import React from 'react';
import axios from 'axios';
import getApiurl from '../Util/getApiUrl';
import {url} from '../Util/textFormat';
import {Link} from 'react-router-dom';

const token = 'e7671b56aca42828b5da68aad722f8c4f441d76dcef9f747d3aebd371dc10c18af6ac5c6297094500fe69578904c95eacca8';
export default class Comment extends React.Component {

    constructor() {
        super();
        this.state = {
            comments: [],
        }
    }

    async componentDidMount() {
        const trackId = this.props.trackId;
        const response = await axios.get(getApiurl('api', `/track/comment/${trackId}?bypass=true&oauth_token=${token}`));
        const body = response.data;

        if (body.length >= 1) {
            // Have comment
            const comments = body.map(comment => {
                const context = url(comment.comment);
                return (
                    <span className="commentBlock" key={comment.postDate + comment.author.username}>
                        <Link to={'/@' + comment.author.username}>{'@' + comment.author.username}</Link>
                        <br/>
                        {context}
                        </span>
                )
            })
            this.setState({
                comments,
            })
        } else {
            // No comment
            this.setState({
                comments: <span>No one is saying anything, will ya?</span>
            })
        }

    }

    render() {
        return (
            <div id="Comment" ref="Comment">
                <input ref={"commentInput"} onKeyDown={this.postComment}/>
                <div className="comments" ref="comments">
                    {this.state.comments}
                </div>
            </div>
        )
    }
}