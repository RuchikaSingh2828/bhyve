import React, { useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';


export default function CommonCard({text, children}) {
    let alternate = text==="SignUp" ? "SignIn" :( text==="SignIn" ?"SignUp" : null);

    return (
        <Card border="success" >
            <Card.Header className="bg-yellow">
                <h5>{text}</h5>
            </Card.Header>
            <Card.Body>
                {/* <Card.Title></Card.Title>
                <Card.Text> */}
                    {React.cloneElement(children, { text: text })}
                {/* </Card.Text> */}
                
            </Card.Body> 
            <Card.Footer className="text-muted bg-yellow">
                { alternate ? <Link to={`/${alternate}`}>{alternate}</Link> : null }
            </Card.Footer>
        </Card>
    )
}
