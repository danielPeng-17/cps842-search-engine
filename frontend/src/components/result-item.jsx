import React from 'react';

function ResultItem(props) {

    return (
        <div>
            <h1>{props.data.title}</h1>
            <p>url is: {props.data.url}</p>
        </div>
    );
}

export default ResultItem;