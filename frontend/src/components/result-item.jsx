import React from 'react';
import { Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

function ResultItem(props) {
    console.log(props)
    // put the url link to a variable and remove https:// from website url
    // var url = (props.data.url).replace(/^https?:\/\/www./, '')
    return (
        // <Card style={{marginRight:"auto", marginLeft:"auto", width: '90%', fontSize: '30px', fontFamily: 'arial', paddingBottom: "10px", paddingTop: "10px"}}>
        // <Card.Body>
        //     {/* url[0].toUpperCase() + url.substring(1) uppercases the first word */}
        //     <Card.Title style={{paddingBottom:"1px"}}><a style={{fontSize: "30px"}} href={props.data.url}> {url[0].toUpperCase() + url.substring(1)} </a></Card.Title>
        //     {/* Uncomment the one below if you just want the link */}
        //     {/* <Card.Title style={{paddingBottom:"1px"}}><a style={{fontSize: "30px"}} href={props.data.url}> {props.data.url} </a></Card.Title>  */} 
        //     <Card.Text style={{marginTop:"5px", marginBottom: "5px", fontWeight: "bold"}}>
        //     The ranking score is {props.data.score}
        //     </Card.Text>
        // </Card.Body>
        // </Card>
        <div>
            hello world 123
        </div>
    );
}

export default ResultItem;