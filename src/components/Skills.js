import React, { useState, useEffect} from 'react'
import axios from 'axios';
import { useHistory } from "react-router-dom"
import CommonCard from './Card';
import { Pagination, ListGroup, Form, Alert, Button, Badge } from 'react-bootstrap';

const noError = {
    error : false,
    msg: ''
}

export default function Skills() {
    const history = useHistory(); 

    const [activeIndex, setActiveIndex] = useState(1)
    const [skills, setSkills] = useState([])
    const [ss, setSs] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        todosPerPage: 10,
        upperPageBound: 3,
        lowerPageBound: 0,
        isPrevBtnActive: 'disabled',
        isNextBtnActive: '',
        pageBound: 3,
    });

    const [ssError, setSsError] = useState(noError);

const [ssRender, setSsRender] = useState(null)
    const [renderTodos, setRenderTodos] = useState(null);
    const [renderPageNumbers, setRenderPageNumbers] = useState(null)
    const [pageIncrementBtn, setPageIncrementBtn] = useState(null)
    const [pageDecrementBtn, setPageDecrementBtn] = useState(null)
    const [renderPrevBtn, setrenderPrevBtn] = useState(null)
    const [renderNextBtn, setRenderNextBtn] = useState(null)

    const handleClick = async (event) => {
        let listId = Number(event.target.id);
        pagination.currentPage = listId;
        await setPagination(pagination)
        await setActiveIndex(listId)
        await setPrevAndNextBtnClass(listId);
    }

    const btnDecrementClick = async () => {
        let listId = pagination.upperPageBound - 1;
        pagination.upperPageBound= pagination.upperPageBound-pagination.pageBound;
        pagination.lowerPageBound= pagination.lowerPageBound-pagination.pageBound;
        pagination.currentPage= listId ;
        await setPagination(pagination);
        setPrevAndNextBtnClass(listId);
    }
    const btnIncrementClick = async() => {
        let {upperPageBound, lowerPageBound, pageBound } = pagination;
        let listId = pagination.upperPageBound + 1;
        pagination.upperPageBound= pagination.upperPageBound+pagination.pageBound ;
        pagination.lowerPageBound= pagination.lowerPageBound+pagination.pageBound;
        pagination.currentPage= listId;
        await setPagination(pagination);
        setPrevAndNextBtnClass(listId);

    }
    const btnNextClick = async() => {
        let {currentPage, pageBound, upperPageBound, lowerPageBound } = pagination;
        if((pagination.currentPage + 1) > pagination.upperPageBound ){
            pagination.upperPageBound= pagination.upperPageBound + pagination.pageBound;
            pagination.lowerPageBound= pagination.lowerPageBound + pagination.pageBound;
        }
        let listid = pagination.currentPage + 1;
        pagination.currentPage = listid;
        await setPagination(pagination);
        setPrevAndNextBtnClass(listid);
    }
    const btnPrevClick = async() => {
        let {currentPage, pageBound, upperPageBound, lowerPageBound } = pagination;
        if((pagination.currentPage -1)%pagination.pageBound === 0 ){
            pagination.upperPageBound= pagination.upperPageBound - pagination.pageBound;
            pagination.lowerPageBound= pagination.lowerPageBound - pagination.pageBound;
        }
        let listid = pagination.currentPage - 1;
        pagination.currentPage = listid;
        await setPagination(pagination);
        setPrevAndNextBtnClass(listid);
    }

    const setPrevAndNextBtnClass = (listId) => {
        let totalPage = Math.ceil( skills.length / pagination.todosPerPage );
        pagination.isNextBtnActive= 'disabled';
        pagination.isPrevBtnActive= 'disabled';

        if(totalPage === listId && totalPage > 1){
            pagination.isPrevBtnActive='';
        }
        else if(listId === 1 && totalPage > 1){
            pagination.isNextBtnActive= '';
        }
        else if(totalPage > 1){
            pagination.isPrevBtnActive='';
            pagination.isNextBtnActive= '';
        }
        setPagination(pagination);
        onRender(skills);
    }

    const handleCheckBox = async (skillName,e) => {
        if(!e.target.checked) {
            let index = ss.indexOf(skillName);
            ss.splice(index, 1);
        }
        if(ss.length > 7 ) {
            setSsError({
                error: true,
                msg: 'You can select Maximum 8 skills '
            })
            e.target.checked = false;
            return -1;
        }else{
            setSsError(noError);
        }
        
        if(e.target.checked) ss.push(skillName); //ss.includes(skillName) ? 
        let ssrender = ss.map((el, index) => <span  key={index}><Badge variant="info">{el}</Badge> {'   '}</span> )
        setSsRender(ssrender);
        await setSs(ss);
        console.log(ss);
    }
   

    const onRender = (sk) => {
        const { currentPage, todosPerPage,upperPageBound,lowerPageBound,isPrevBtnActive,isNextBtnActive } = pagination;

         // Logic for displaying current todos
        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const currentTodos = sk.slice(indexOfFirstTodo, indexOfLastTodo);

        let renderTodos = null;
        let renderPageNumbers = null;
        let pageIncrementBtn = null;
        let pageDecrementBtn = null;
        let renderPrevBtn = null;
        let renderNextBtn = null;

        renderTodos = currentTodos.map((skill, index) => {
        return <ListGroup.Item key={skill.id}>
                    <Form.Check 
                        type="checkbox" 
                        onChange={(e)=> handleCheckBox(skill.skillName,e)}  
                        label=  {skill.skillName} />                    
                </ListGroup.Item>
        });
        setRenderTodos(renderTodos);
        // Logic for displaying page numbers
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(sk.length / todosPerPage); i++) {
            pageNumbers.push(i);
        }

        renderPageNumbers = pageNumbers.map(number => {
            if(number === 1 && currentPage === 1){
                return(
                    // <li key={number} className='active' id={number}><a href='#' id={number} onClick={this.handleClick}>{number}</a></li>
                    <Pagination.Item active key={number} id={number} onClick={handleClick}>{number}</Pagination.Item>
                )
            }
            else if((number < upperPageBound + 1) && number > lowerPageBound){
                return(
                    <Pagination.Item key={number} id={number} onClick={handleClick}>{number}</Pagination.Item>
                    // <li key={number} id={number}><a href='#' id={number} onClick={this.handleClick}>{number}</a></li>
                )
            }
        })
        setRenderPageNumbers(renderPageNumbers);

        if(pageNumbers.length > upperPageBound){
            pageIncrementBtn = <Pagination.Item onClick={btnIncrementClick}>&hellip;</Pagination.Item>
            setPageIncrementBtn(pageIncrementBtn);
        }
        if(lowerPageBound >= 1){
            pageDecrementBtn = <Pagination.Item onClick={btnDecrementClick}>&hellip;</Pagination.Item>
            setPageDecrementBtn(pageDecrementBtn)
        }
        if(isPrevBtnActive === 'disabled') {
            renderPrevBtn = <Pagination.Item disabled id="btnPrev"> Prev </Pagination.Item>
            // <li className={isPrevBtnActive}><span id="btnPrev"> Prev </span></li>
        }
        else{
            renderPrevBtn = <Pagination.Item onClick={btnPrevClick} id="btnPrev"> Prev </Pagination.Item>
            // <li className={isPrevBtnActive}><a href='#' id="btnPrev" onClick={this.btnPrevClick}> Prev </a></li>
        }
        setrenderPrevBtn(renderPrevBtn)
        if(isNextBtnActive === 'disabled') {
            renderNextBtn = <Pagination.Item disabled id="btnNext" > Next </Pagination.Item>
        }
        else{
            renderNextBtn = <Pagination.Item onClick={btnNextClick} id="btnNext" > Next </Pagination.Item>
        }
        setRenderNextBtn(renderNextBtn);
        setSkills(sk);
        
    }

    const skillJogar = (sk) => {
        for(let i = 0; i<sk.length ; i++){
            skills.push(sk[i]);
        }
        setSkills(skills)
    }

    useEffect(() => {
            const token = JSON.parse(localStorage.getItem('login'));
            console.log(token)
            if(!token?.isLoggedIn){
                history.push("/SignIn")
            };
            axios.defaults.headers.common = {'Authorization': `bearer ${token?.token}`}
            if(skills.length === 0){
                axios.get( 'https://fechallenge.dev.bhyve.io/skills').then(async function(response) {
                    console.log(response); 
                    skillJogar(response.data)
                    onRender(response.data);
                }).catch(function(error) {
                    console.log(error);
                    alert(error?.response?.data?.message)
                    return -1;
                });
            }
            
            onRender(skills);
    }, [pagination.currentPage])

    const submit = () => {
        if(ss.length < 3 ) {
            setSsError({
                error: true,
                msg: 'You need to select Minimum 3 skills '
            })
            return -1;
        }
        // {
        //     "skills": ["node.js", "javascript", "typescript", "python", "nestjs"]
        // }
        const token = JSON.parse(localStorage.getItem('login'));
        console.log(token)
        if(!token?.isLoggedIn){
            history.push("/SignIn")
        };
        axios.post( 
            'https://fechallenge.dev.bhyve.io/user/skills',
            {
                "skills": ss
            }            
            ).then(function(response) {
                console.log(response);
                if(response.status === 201) {
                    history.push("/UserCompleteProfile")
                }
            }).catch(function(error) {
                alert(error?.response?.data?.message);
                // handleError(error);
            });
    }

    return (
        <>
            { ssError.error?  <Alert  variant="warning">{ ssError.msg }</Alert> : null }
            <CommonCard text="Skills">
                <>
                <ListGroup >
                    {renderTodos}
                </ListGroup>
                <br/>
                <Pagination>
                    {renderPrevBtn}
                    {pageDecrementBtn}
                    {renderPageNumbers}
                    {pageIncrementBtn}
                    {renderNextBtn}
                </Pagination>
                <br/>
                <span className="container-center">
                    <Button onClick={submit} className="bg-green">Submit</Button>
                </span>
                </>
                
            </CommonCard>
            <div>
                {(ss.length > 0) ? <span>{ssRender}</span> : null  }
                    {/*  */}             
            </div>
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