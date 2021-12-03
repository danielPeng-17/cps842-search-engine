
import React from 'react';
import { ResultItem } from '../components/result-item';

function ResultsPage(props) {
    return (
        <div>
            <h1>Results</h1>
            {
                props.results.forEach(result => {
                    <ResultItem data={result} />
                })
            }
        </div>
    );
}

export default ResultsPage;
