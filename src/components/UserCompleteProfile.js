import React, { useEffect, useState } from 'react'
import {Form, Badge} from 'react-bootstrap'
import CommonCard from './Card';
import axios from 'axios';
import { useHistory } from "react-router-dom"

export default function UserCompleteProfile() {
    const history = useHistory();
    const [user, setuser] = useState({
        firstName: '',
        lastName: '',
        skills: []
    });

    const [ssrender, setSsrender] = useState(null)

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('login'));
            console.log(token)
            if(!token?.isLoggedIn){
                history.push("/SignIn")
            };
            axios.defaults.headers.common = {'Authorization': `Bearer ${token?.token}`};

            axios.get( 'https://fechallenge.dev.bhyve.io/user/profile').then(async function(response) {
                console.log(response.data); 
                setuser(response.data);
                onRender(response.data);
            }).catch(function(error) {
                console.log(error);
                alert(error?.response?.data?.message)
                return -1;
            });
        
    }, [])

    const onRender = (d) => {
        let ssrender = d.skills.map((el, index) => <span  key={index}><Badge variant="success">{el}</Badge> {'   '}</span> );
        setSsrender(ssrender)
    }
    return (
        <>
             <CommonCard text="Profile">
             <Form>
                <Form.Group>
                    <Form.Label><Badge variant="info"><h3>{user.firstName}  {user.lastName}</h3></Badge></Form.Label>                   
                </Form.Group>
                <Form.Group>
                    <Form.Label>{ssrender}</Form.Label>
                </Form.Group>
            </Form>
             </CommonCard>
        </>
    )
}

// https://codepen.io/mhmanandhar/pen/oEWBqx
// firstName: "sds"
// id: 888
// lastName: "ssd"
// password: "$2b$10$/brD9yaiFef7Hom4Z8UobeRAXd2BMlZw0kp99WtFqz6FMYE7037Cm"
// profileCompleted: true
// publicId: "18858b12-8081-48b6-b511-d08e8f6cb983"
// salt: "$2b$10$/brD9yaiFef7Hom4Z8Uobe"
// skills: ["node.js", "javascript", "abc", "ddd"]
// username: "Ruchi@gmail.com"
