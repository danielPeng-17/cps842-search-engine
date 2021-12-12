import React from 'react';
import { Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

function ResultItem(props) {
    // put the url link to a variable and remove https:// from website url
    var url = (props.data[1].url).replace('https://', '').replace('http://', '').replace('www.', '')
    return (
        <Card 
            style={{
                marginRight:"auto", 
                marginLeft:"auto", 
                marginBottom: '20px',
                width: '90%', 
                fontSize: '30px', 
                fontFamily: 'arial', 
                paddingBottom: "10px", 
                paddingTop: "10px"
            }}
        >
        <Card.Body>
            {/* url[0].toUpperCase() + url.substring(1) uppercases the first word */}
            <Card.Title style={{paddingBottom:"1px"}}><a style={{fontSize: "30px"}} href={props.data[1].url}> {url[0].toUpperCase() + url.substring(1)} </a></Card.Title>
            {/* Uncomment the one below if you just want the link */}
            {/* <Card.Title style={{paddingBottom:"1px"}}><a style={{fontSize: "30px"}} href={props.data.url}> {props.data.url} </a></Card.Title>  */} 
            <Card.Text style={{marginTop:"5px", marginBottom: "5px", fontWeight: "bold"}}>
            Rank: {props.data[1].rank} Score: {props.data[1].score}
            </Card.Text>
        </Card.Body>
        </Card>
    );
}

export default ResultItem;