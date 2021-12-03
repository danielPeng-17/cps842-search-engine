import React from 'react';

function ResultItem(props) {

    return (
        <div>
            {console.log(props)}
            <h1>title: {props.data.title}</h1>
            <p>url is: {props.data.url}</p>
            <p>score</p>
        </div>
    );
}

export default ResultItem;