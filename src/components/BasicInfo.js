import React, { useState, useEffect } from 'react'
import axios from 'axios';
import CommonCard from './Card';
import {Form, Row, Col, Button, Alert} from 'react-bootstrap'
import { useHistory } from "react-router-dom"

let errorObj = {
    error: true,
    msg: 'Field Cannot be Empty'
}

let noErrorObj = {
    error: false,
    msg: ''
}

export default function BasicInfo() {
    const history = useHistory();
    const [config, setConfig] = useState({
        headers: {}
    })
    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('login'));
        console.log(token)
        if(!token?.isLoggedIn){
            history.push("/SignIn")
        };
        axios.defaults.headers.common = {'Authorization': `Bearer ${token?.token}`}
        // setConfig({
        //     headers: { Authorization: `Bearer ${token.token}` }
        // });
    }, [])
    const [name, setName] = useState({
        firstName: '',
        lastName: ''
    });

    const [firstNameError, setFirstnameError] = useState( noErrorObj );
    const [lastNameError, setLastnameError] = useState( noErrorObj );

    const isValid = () => {
        let valid = true;
        if(name.firstName === '') {
            valid = false;
            setFirstnameError(errorObj);
        }
        if(name.lastName === '') {
            valid = false;
            setLastnameError(errorObj)
        }
        return valid;
    }

    const handleError = (error) => {
        let errorMsgs = [];
        // :["firstName should not be null or undefined","firstName must be a string",
        ///"lastName should not be null or undefined","lastName must be a string"]
        if(error.response.status === 400)  errorMsgs = error?.response?.data?.message;
        const firstError = errorMsgs.filter(el => el.includes("firstName") || el.includes("FirstName")  );
        const secondError = errorMsgs.filter(el => el.includes("lastName") || el.includes("LastName")  );

        setFirstnameError({
            error: true,
            msg: firstError.join("  \n")
        });
        setLastnameError({
            error: true,
            msg: secondError.join("  \n")
        })
    }

    const saveFullName = () => {
        let valid = isValid();
        if(!valid) return -1;
        axios.post( 
        'https://fechallenge.dev.bhyve.io/user/basic/profile',
        name,
        config
        ).then(function(response) {
            console.log(response);
            if(response.status === 201) {
                history.push("/Skills")
            }
        }).catch(function(error) {
            console.log(error);
            handleError(error);
        });
    }

    return (
        <>
            <CommonCard text="Basic Profile Information">
                <Form>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Control 
                                    type="text"
                                    placeholder="First name" 
                                    onChange={(e)=>{
                                        setName({...name, firstName: e.target.value })
                                        setFirstnameError(noErrorObj)
                                    }} 
                                    isInvalid={ firstNameError.error }  
                                />
                                <Form.Control.Feedback type="invalid">
                                    {firstNameError.msg}
                                </Form.Control.Feedback> 
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Control 
                                    type="text"
                                    placeholder="Last name" 
                                    onChange={(e)=> {
                                        setName({...name, lastName: e.target.value }); 
                                        setLastnameError(noErrorObj) 
                                    }} 
                                    isInvalid={ lastNameError.error } 
                                />
                                <Form.Control.Feedback type="invalid">
                                    {lastNameError.msg}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group>
                        <span className="container-center">
                            <Button onClick={saveFullName} className="bg-green">Save Name</Button>
                        </span>
                    </Form.Group>
                </Form>
            </CommonCard>
        </>
    )
}



// data:
// firstName: "sds"
// id: 888
// lastName: "ssd"
// password: "$2b$10$/brD9yaiFef7Hom4Z8UobeRAXd2BMlZw0kp99WtFqz6FMYE7037Cm"
// profileCompleted: false
// publicId: "18858b12-8081-48b6-b511-d08e8f6cb983"
// salt: "$2b$10$/brD9yaiFef7Hom4Z8Uobe"
// skills: null
// username: "Ruchi@gmail.com"
