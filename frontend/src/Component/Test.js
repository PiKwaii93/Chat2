import { useParams } from "react-router-dom"
import {useEffect, useState, useContext, useRef} from "react";
import {BrowserRouter, Routes, Route, Link} from "react-router-dom";
import useGetUserList from "../Hook/useGetUserList";
import useBackendPing from "../Hook/useBackendPing";
import useGetOneUser from "../Hook/userGetOneUser";
import {userContext} from "../Context/UserContext";
import useSendMessage from "../Hook/useSendMessage";
import useGetChatMessage from "../Hook/useGetChatMessage";
import jwt_decode from "jwt-decode";

export default function Test() {
    
    const params = useParams();

    const [user, setUser] = useState([]);
    const [loggedUser, setLoggedUser] = useContext(userContext);
    const [allMessages, setAllMessages] = useState([]);
    const [idTemp, setIdTemp] = useState();
    
    const [text, setText] = useState();

    const getOneUser = useGetOneUser();
    const sendMessage = useSendMessage();
    const chatMessage = useGetChatMessage();

    const sendUser = jwt_decode(loggedUser).mercure.payload.userid;
    const userId = params.id;

    const bottomRef = useRef(null);

    const toggleChange = e => {
        setText(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const message = text;
        sendMessage(userId,message,sendUser).then(data => console.log(data))
        chatMessage(userId, sendUser).then(data => setAllMessages(data.specificMessages));
    }

    const handleMessage = (e) => {
        const getData = JSON.parse(e.data);
        chatMessage(userId, sendUser).then(data => setAllMessages(data.specificMessages));
/*         const newMessage = getData.sendMessage
        document.querySelector('h1').insertAdjacentHTML('afterend', '<div class="alert alert-success w-75 mx-auto">' + newMessage + '</div>');
        window.setTimeout(() => {
            const $alert = document.querySelector('.alert');
            $alert.parentNode.removeChild($alert);
        }, 2000);
        console.log(JSON.parse(e.data)); */
    }

    useEffect(() => {
        setIdTemp(0);
        getOneUser(params.id).then(data => setUser(data.user));

        chatMessage(userId, sendUser).then(data => setAllMessages(data.specificMessages));

        const url = new URL('http://localhost:9090/.well-known/mercure');
        url.searchParams.append('topic', 'https://example.com/my-private-topic');

        const eventSource = new EventSource(url, {withCredentials: true});
        eventSource.onmessage = handleMessage

        return () => {
            eventSource.close()
        }
    }, [params.id])

    useEffect(() => {

        bottomRef.current?.scrollIntoView({behavior: 'smooth'})

    }, [allMessages])
    

    return (
        <div className='w-75 mx-auto mb-3 overflow-hidden' style={{"height":"100vh"}}>
            <h2 className="position-fixed">{user.username}</h2>
            <div className='w-100 mx-auto mb-3 overflow-hidden' style={{"height":"100vh"}}> 
                <div className="d-flex flex-column justify-content-end min-vh-100" style={{"height":"100vh"}}>
                    <div className="w-75 mx-auto mb-3 overflow-auto mt-5" style={{"height":"100vh"}}>
                        {allMessages.map((allMessage) => {
                            if (allMessage.user_id == allMessages[allMessages.length - 1].user_id) {
                                if (allMessage.user_id == sendUser) {
                                    return (
                                        <div key={allMessage.id} value={allMessage.user_id} className="d-flex justify-content-end messageChatContainer" ref={bottomRef}>
                                            <div className='w-auto mw-75 alert alert-primary d-flex flex-column align-items-end messageChat'>
                                                <p>{allMessage.Content}</p>
                                                <p>{allMessage.Date}</p>
                                            </div>
                                        </div>
                                    );
                                }else{
                                    return(
                                        <div key={allMessage.id} value={allMessage.user_id} className="d-flex messageChatContainer" ref={bottomRef}>
                                            <div className='w-auto mw-75 alert alert-secondary d-flex flex-column messageChat'>
                                                <p>{allMessage.Content}</p>
                                                <p>{allMessage.Date}</p>
                                            </div>
                                        </div>
                                    );
                                }
                            }else{
                                if (allMessage.user_id == sendUser) {
                                    return (
                                        <div key={allMessage.id} value={allMessage.user_id} className="d-flex justify-content-end messageChatContainer">
                                            <div className='w-auto mw-75 alert alert-primary d-flex flex-column align-items-end messageChat'>
                                                <p>{allMessage.Content}</p>
                                                <p>{allMessage.Date}</p>
                                            </div>
                                        </div>
                                    );
                                }else{
                                    return(
                                        <div key={allMessage.id} value={allMessage.user_id} className="d-flex messageChatContainer">
                                            <div className='w-auto mw-75 alert alert-secondary d-flex flex-column messageChat'>
                                                <p>{allMessage.Content}</p>
                                                <p>{allMessage.Date}</p>
                                            </div>
                                        </div>
                                    );
                                }
                            }
                        })}
                    </div>
                    <form className='w-75 mx-auto mb-3 d-flex justify-content-end position-sticky' onSubmit={handleSubmit}>
                        <input className="w-75" type="text" onChange={toggleChange}/>
                        <button className='btn btn-dark w-25' type='submit'>Send</button>
                    </form>
                </div>
            </div>
        </div>
    )
}