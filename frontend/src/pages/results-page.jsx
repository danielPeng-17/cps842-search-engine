
import React from 'react';
import ResultItem from '../components/result-item';
import {useLocation} from 'react-router-dom';

function ResultsPage() {
    const { state } = useLocation();
    // console.log(props)
    return (
        <div>
            <h1>Results</h1>
            {
                Object.keys(state.data).map(key => {
                    return <ResultItem data={state.data[key]} />
                })
                // console.log(state.data)
            }
        </div>
    );
}

export default ResultsPage;
