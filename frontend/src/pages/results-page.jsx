
import React from 'react';
import ResultItem from '../components/result-item';
import {useLocation} from 'react-router-dom';
import Card from 'react-bootstrap/Card';

function ResultsPage() {
    const { state } = useLocation();
    console.log(Object.keys(state.data))
    return (
        <div>
            <h1 style={{textAlign:'center', fontSize: "3em", fontWeight: 'bold', marginBottom: "20px", marginTop: "20px"}}>Results Page</h1>
            <hr/>
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
