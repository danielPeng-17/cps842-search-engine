import  React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SearchPage() {
    const navigate = useNavigate();
    let loading = false;
    let [data,setData] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        await axios.get('/search')
            .then(res => {
                setData(res.data);
                loading = true;
            })
            .catch(err => {
                console.log(err);         
            }
        );
       
    }

    useEffect(() => {
        console.log('in here')
        if (data) {
            console.log('in effect')
            loading = false;
            navigate('/result', { state: { data }  });
        }
    });

    return (
        <div>
            {
                !loading ? 
                    <div>
                        <h1>Search</h1>
                        <form onSubmit={(e) => handleSearch(e)}>
                            Query: <input type="text" name="query"/>
                            <input type="submit" value="Submit"/>
                        </form>
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