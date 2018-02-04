import React from 'react';

export default class Layout extends React.Component {

    render() {

        return (
            <footer
                style={{
                    marginTop: '1.5em',
                }}
            >
                <hr/>
                <a href="https://github.com/hoovessound"
                   className="fa fa-github"
                   target="_blank"
                   rel="noopener noreferrer"
                >Open Source</a>
            </footer>
        )
    }
}