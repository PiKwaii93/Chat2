import { useParams } from "react-router-dom"
import {useEffect, useState, useContext, useRef} from "react";
import {BrowserRouter, Routes, Route, Link} from "react-router-dom";
import {userContext} from "../Context/UserContext";
import jwt_decode from "jwt-decode";
import QRCode from "react-qr-code";
import retour from "../Ressource/retour.svg"

export default function UserProfil() {
    
    const [loggedUser, setLoggedUser] = useContext(userContext);
    
    const link = "http://localhost:3000/jwt/" + loggedUser;

    const value = link

    const sendUserEntity = jwt_decode(loggedUser).mercure.payload;

    console.log(sendUserEntity)

    return (
        <div className='w-75 mx-auto mb-3 overflow-auto'> 
            <Link to="/"><img className='position-absolute start-0 mb-1 ml-5' src={retour} style={{width:"50px", marginLeft: "0.25rem!important"}}/></Link>
            <h1>Bienvenue {sendUserEntity.username}</h1>
            <h4>Votre QR Code d'authenfication</h4>
            <QRCode
            size={256}
            style={{ height: "auto", width: "300px", margin: "30px" }}
            value={value}
            viewBox={`0 0 256 256`}
            />
        </div>
    )
}