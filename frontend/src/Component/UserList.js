import {useEffect, useState, useContext} from "react";
import {BrowserRouter, Routes, Route, Link} from "react-router-dom";
import useGetUserList from "../Hook/useGetUserList";
import useBackendPing from "../Hook/useBackendPing";
import {userContext} from "../Context/UserContext";
import jwt_decode from "jwt-decode";

export default function UserList() {
    const [userList, setUserList] = useState([]);
    const [loggedUser, setLoggedUser] = useContext(userContext);

    console.log(userList)

    const [message, setMessage] = useState();

    const getUserList = useGetUserList();
    const backendPing = useBackendPing();

    const toggleChange = e => {
        setMessage(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const sendUser = jwt_decode(loggedUser).mercure.payload.userid;
        const userId = e.target[0].value;
        const sendMessage = message;
        backendPing(userId,sendMessage, sendUser).then(data => console.log(data))
    }

    const handleMessage = (e) => {
        const getData = JSON.parse(e.data);
        const newMessage = getData.sendMessage
        document.querySelector('h1').insertAdjacentHTML('afterend', '<div class="alert alert-success w-75 mx-auto">' + newMessage + '</div>');
        window.setTimeout(() => {
            const $alert = document.querySelector('.alert');
            $alert.parentNode.removeChild($alert);
        }, 2000);
        console.log(JSON.parse(e.data));
    }

    const wouf = 1

    useEffect(() => {
        getUserList().then(data => setUserList(data.users));

        const url = new URL('http://localhost:9090/.well-known/mercure');
        url.searchParams.append('topic', 'https://example.com/my-private-topic');

        const eventSource = new EventSource(url, {withCredentials: true});
        eventSource.onmessage = handleMessage;

        return () => {
            eventSource.close();
        }

    }, [wouf])

    return (
        <div className='w-25 mx-auto mb-3 overflow-auto'>
            <h1 className='m-5 text-center'>Choose a user</h1>
            <div className='w-75 mx-auto mb-3'>
                <ul>
                    {userList.map((user) => (
                        <li key={user.id}>
                            <Link to={`/${user.id}`}>{user.username}</Link>
                        </li>

                    ))}
                </ul>
            </div>
        </div>
    )
}