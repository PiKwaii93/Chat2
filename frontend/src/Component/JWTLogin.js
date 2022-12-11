import {useLocation, useParams, useNavigate} from "react-router-dom";
import {userContext} from "../Context/UserContext";
import {useContext, useEffect, useState} from "react";
import jwt_decode from "jwt-decode";


export default function JWTLogin() {

    const params = useParams();

    const [loggedUser, setLoggedUser] = useContext(userContext);

    const navigate = useNavigate();
    let location = useLocation();
    let from = location.state?.from?.pathname || '/';



    useEffect(() => {
        try {
            console.log(jwt_decode(params.jwt))
            setLoggedUser(params.jwt);
            navigate(from, {replace: true});
        } catch (error) {
            navigate(from, {replace: true});
        }
    }, []);


/*     useEffect(() => {
        setLoggedUser(params.jwt);
        navigate(from, {replace: true});
    }, []) */
    
    return(
        <div className="w-75 mx-auto mb-3 overflow-hidden"></div>
    )
}