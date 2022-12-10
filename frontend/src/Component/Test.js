import { useParams } from "react-router-dom"
import {useEffect, useState, useContext} from "react";
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
    
    const [text, setText] = useState();

    const getOneUser = useGetOneUser();
    const sendMessage = useSendMessage();
    const chatMessage = useGetChatMessage();

    const toggleChange = e => {
        setText(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const sendUser = jwt_decode(loggedUser).mercure.payload.userid;
        const userId = params.id;
        const message = text;
        sendMessage(userId,message,sendUser).then(data => console.log(data))
        chatMessage(userId, sendUser).then(data => setAllMessages(data.specificMessages));
    }

    const handleMessage = (e) => {
        const getData = JSON.parse(e.data);
        console.log(getData.message)
        const sendUser = jwt_decode(loggedUser).mercure.payload.userid;
        const userId = params.id;
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
        getOneUser(params.id).then(data => setUser(data.user));
        console.log(user)

        const sendUser = jwt_decode(loggedUser).mercure.payload.userid;
        const userId = params.id;
        chatMessage(userId, sendUser).then(data => setAllMessages(data.specificMessages));
        console.log(allMessages)

        const url = new URL('http://localhost:9090/.well-known/mercure');
        url.searchParams.append('topic', 'https://example.com/my-private-topic');

        const eventSource = new EventSource(url, {withCredentials: true});
        eventSource.onmessage = handleMessage

        return () => {
            eventSource.close();
        }
    }, [])

    return (
        <div>
            <h1>TEST {params.id}</h1>
            <h2>{user.username}</h2>
            <label>Message</label>
            <form className='w-75 mx-auto mb-3' onSubmit={handleSubmit}>
                <input type="text" onChange={toggleChange}/>
                <button className='btn btn-dark w-100' type='submit'>Send</button>
            </form>
            <div className="w-75 mx-auto mb-3">
                {allMessages.map((allMessage) => {
                    if (allMessage.user_id == "1") {
                        return (
                            <div key={allMessage.id} value={allMessage.user_id} className="d-flex justify-content-end messageChatContainer">
                                <div className='w-50  alert alert-primary d-flex flex-column align-items-end messageChat'>
                                    <h4>{allMessage.user_id}</h4>
                                    <p>{allMessage.Content}</p>
                                </div>
                            </div>
                        );
                    }else{
                        return(
                            <div key={allMessage.id} value={allMessage.user_id} className="d-flex messageChatContainer">
                                <div className='w-50  alert alert-primary d-flex flex-column messageChat'>
                                    <h4>{allMessage.user_id}</h4>
                                    <p>{allMessage.Content}</p>
                                </div>
                            </div>
                        );
                    }
                })}
            </div>
        </div>
    )
}