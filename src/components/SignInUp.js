import React, { useState,  useEffect } from 'react'
import CommonCard from './Card';
import axios from 'axios';
import {Form, Row, Col, Button, Alert} from 'react-bootstrap'
import { useHistory } from "react-router-dom"

const noErrorObj = {
    status : false,
    error : ''
}

export default function SignInUp(props) {

    let response = null;
    const history = useHistory();

    const [email, setEmail] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(noErrorObj);

    const [password, setPassword] = useState('')
    const [isPassValid, setIsPassValid] = useState(noErrorObj)

    const [errorMessages, setErrorMessages] = useState([]);

    useEffect(() => {
        const emailErrors = errorMessages.filter(el => el.includes("email") || el.includes("Email")  );
        const passwordErrors = errorMessages.filter(el => el.includes("password") || el.includes("Password"));

        if(emailErrors.length > 0) setIsEmailValid ({
            status : true,
            error: emailErrors.join("   \n")
        })
        
        if(passwordErrors.length > 0) setIsPassValid ({
            status : true,
            error: passwordErrors.join("  \n")
        })
        
    }, [errorMessages]);


    const SignInUp = () => {
        // if(!isValid) return false;
        if(props.type === 'SignUp') SignUp();

        if(props.type === 'SignIn') SignIn();
    }

    const onError = (error) => {
        if(error.response.status === 400)  setErrorMessages(error?.response?.data?.message);
        else if(error.response.status === 409)  {
            console.log(error?.response?.data?.message)
            setIsEmailValid({
            status : true,
            error: error?.response?.data?.message
        })
    }
        else if(error.response.status === 401) {
            const errObj = { status : true, error: error?.response?.data?.message };
            setIsPassValid(errObj);
            setIsEmailValid(errObj);
        }
    }

    const SignIn = () => {
        axios.post('https://fechallenge.dev.bhyve.io/user/signin',{
                "username": email,
                "password": password
            })
            .then(function (response) {
                if(response.status === 201) {
                    localStorage.setItem('login', JSON.stringify({
                        isLoggedIn: true,
                        token: response?.data?.accessToken
                    }));
                    console.log(response)
                    if(response.data.user.profileCompleted)  {history.push("/UserCompleteProfile"); return true;}
                    // if(response.data.user)  history.push("/Skills")
                    history.push("/BasicInfo")
                }
            }).catch(function (error){
                onError(error);
            });
    }

    const SignUp = () => {
        axios.post('https://fechallenge.dev.bhyve.io/user/signup',{
                "username": email,
                "password": password
            })
            .then(function (response) {
                if(response.status === 201)  history.push("/SignIn");
            }).catch(function (error){
                onError(error);
            });
    }



    return (

        <>
            { props.type === "SignIn" ?  <Alert  variant="success"> Please Sign In  </Alert> : null }
            <CommonCard text={props.type}>
                <Form>
                    <Form.Group as={Row}>
                        <Form.Label column sm="4">
                        Email
                        </Form.Label>
                        <Col sm="8">
                        <Form.Control 
                            type="email" 
                            placeholder="name@example.com" 
                            onChange={e => {
                                setEmail(e.target.value);
                                setIsEmailValid(noErrorObj)
                                setIsPassValid(noErrorObj)
                            }} 
                            isInvalid={ isEmailValid.status }  
                        />
                        <Form.Control.Feedback type="invalid">
                            {isEmailValid.error}
                        </Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Form.Label column sm="4">
                        Password
                        </Form.Label>
                        <Col sm="8">
                        <Form.Control 
                        type="password" 
                        placeholder="Password" 
                        onChange={e => {
                            setPassword(e.target.value)
                            setIsPassValid(noErrorObj)
                            setIsEmailValid(noErrorObj)
                        }} 
                        isInvalid={ isPassValid.status } />
                        <Form.Control.Feedback type="invalid">
                            {isPassValid.error }
                        </Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    <Form.Group>
                    <span className="container-center">
                        <Button onClick={SignInUp} className="bg-green">{props.type}</Button>
                    </span>
                    </Form.Group>
                </Form>
                
            </CommonCard>
        </>
        
    )
}


// config: {url: "https://fechallenge.dev.bhyve.io/user/signin", method: "post", data: "{"username":"Ruchi@gmail.com","password":"Ruchi@gmail.com"}", headers: {…}, transformRequest: Array(1), …}
// data:
// accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlJ1Y2hpQGdtYWlsLmNvbSIsImlhdCI6MTYyMTMxODk3NywiZXhwIjoxNjIxMzIyNTc3fQ.iSFvj4dygJ9zoI8BWs9Jw-mOUiaiA6dPs7IExogcyAY"
// user:
// firstName: "sds"
// id: 888
// lastName: "ssd"
// password: "$2b$10$/brD9yaiFef7Hom4Z8UobeRAXd2BMlZw0kp99WtFqz6FMYE7037Cm"
// profileCompleted: false
// publicId: "18858b12-8081-48b6-b511-d08e8f6cb983"
// salt: "$2b$10$/brD9yaiFef7Hom4Z8Uobe"
// skills: null
// username: "Ruchi@gmail.com"


