import {Navigate, useLocation} from "react-router-dom";
import {userContext} from "../Context/UserContext";
import {useContext} from "react";
import jwt_decode from "jwt-decode";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function RecirecTo() {
    let location = useLocation();
    const [loggedUser, setLoggedUser] = useContext(userContext);

    var sendUser = 0
    
    if(loggedUser!=""){
        sendUser = jwt_decode(loggedUser).mercure.payload.userid;
    }else{
        sendUser = 0
    }

    if (sendUser == 0) {
        return(
            <Navigate to='/login' state={{from: location}}/>
        );
    } else if(sendUser == 1) {
        return( <Navigate to='/2' state={{from: location}}/>)
    }else{
        return <Navigate to='/1' state={{from: location}}/>
    }
}