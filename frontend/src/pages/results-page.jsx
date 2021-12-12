
import React from 'react';
import ResultItem from '../components/result-item';
import {useLocation} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap/';

function ResultsPage() {
    const navigate = useNavigate();
    const { state } = useLocation();

    const handleClick = () => navigate('/');

    return (
        <div>
            <Button
                style={{
                    marginLeft: '20px',
                    marginTop: '20px'
                }}
                onClick={() => handleClick()}
            >
                Back
            </Button>
            <h1 style={{textAlign:'center', fontSize: "3em", fontWeight: 'bold', marginBottom: "20px", marginTop: "20px"}}>Results Page</h1>
            <hr/>
            {
                state.data.data.map(element => {
                    return <ResultItem data={element} />
                })
            }
        </div>
    );
}

export default ResultsPage;
