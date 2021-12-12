import  React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

function SearchPage() {
    const navigate = useNavigate();
    let loading = false;
    let [data,setData] = useState('');
    let [query, setQuery] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        await axios.get('/search?q=' + query)
            .then(res => {
                setData(res.data);
                loading = true;
            })
            .catch(err => {
                console.log(err);         
            }
        );
       
    }

    const stateUpdateQuery = ({target: {value}}) => setQuery(value);

    useEffect(() => {
        if (data) {
            loading = false;
            navigate('/result', { state: { data }  });
        }
    });
    
    return (
        <div>
            {
                !loading ? 
                    <div style={{textAlign:'center'}}>
                        <h1 style={{textAlign:'center', fontSize: "3em", fontWeight: 'bold', marginBottom: "20px", marginTop: "20px"}}>Search Page</h1>
                        <hr/>
                        <Form onSubmit={(e) => handleSearch(e)}>
                            <Form.Group controlId="formBasicQuery">
                                <Form.Label style={{fontSize:"2em"}}>What would you like to search for?<br/></Form.Label>
                                <Form.Control 
                                    style={{
                                        marginLeft: "auto", 
                                        marginRight:"auto", 
                                        width:'50%', 
                                        textAlign:'center', 
                                        borderRadius:'1rem', 
                                        fontSize:'2em'
                                    }} 
                                    type="text" 
                                    placeholder="Input query"
                                    onChange={stateUpdateQuery}
                                    value={query}
                                />
                            </Form.Group>
                            <Button style={{margin:'25px', fontSize:'2em'}} variant="primary" type="submit">
                                Submit
                            </Button>
                            {/* Query: <input type="text" name="query"/>
                            <input type="submit" value="Submit"/> */}
                        </Form>
                    </div>
                :
                    <div>
                        <p>loading...</p>
                    </div>
            }
        </div>
    );
}

export default SearchPage;